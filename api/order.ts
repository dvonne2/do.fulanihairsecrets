import { google } from 'googleapis';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomBytes } from 'crypto';

function generateServerOrderId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = randomBytes(4).toString('hex').toUpperCase();
  return `FHS-${ts}-${rnd}`;
}

interface AttemptStatus {
  orderId: string;
  createdAt: number;
  erpnextOk: boolean;
  sheetOk: boolean;
  payload: Record<string, any>;
}

interface IdempotencyStore {
  get(attemptId: string): Promise<AttemptStatus | null>;
  claim(attemptId: string, orderId: string, createdAt: number, payload: Record<string, any>): Promise<boolean>;
  complete(attemptId: string, field: 'erpnextOk' | 'sheetOk', value: boolean): Promise<void>;
  acquireSideLock(attemptId: string, side: 'erpnext' | 'sheet'): Promise<boolean>;
  releaseSideLock(attemptId: string, side: 'erpnext' | 'sheet'): Promise<void>;
}

class MemoryIdempotencyStore implements IdempotencyStore {
  private data = new Map<string, AttemptStatus>();
  private locks = new Set<string>();

  async get(attemptId: string): Promise<AttemptStatus | null> {
    const v = this.data.get(attemptId);
    return v ? { ...v } : null;
  }

  async claim(attemptId: string, orderId: string, createdAt: number, payload: Record<string, any>): Promise<boolean> {
    if (this.data.has(attemptId)) return false;
    this.data.set(attemptId, { orderId, createdAt, erpnextOk: false, sheetOk: false, payload });
    return true;
  }

  async complete(attemptId: string, field: 'erpnextOk' | 'sheetOk', value: boolean): Promise<void> {
    const v = this.data.get(attemptId);
    if (!v) return;
    v[field] = value;
  }

  async acquireSideLock(attemptId: string, side: 'erpnext' | 'sheet'): Promise<boolean> {
    const key = `${attemptId}:${side}`;
    if (this.locks.has(key)) return false;
    this.locks.add(key);
    return true;
  }

  async releaseSideLock(attemptId: string, side: 'erpnext' | 'sheet'): Promise<void> {
    this.locks.delete(`${attemptId}:${side}`);
  }
}

class RedisIdempotencyStore implements IdempotencyStore {
  private baseUrl: string;
  private token: string;

  constructor(url?: string, token?: string) {
    this.baseUrl = (url || process.env.KV_REST_API_URL || process.env.KV_URL) as string;
    this.token = (token || process.env.KV_REST_API_TOKEN) as string;
    if (!this.baseUrl || !this.token) {
      throw new Error('Redis KV is not configured. Set KV_REST_API_URL and KV_REST_API_TOKEN.');
    }
    if (this.baseUrl.startsWith('redis://') || this.baseUrl.startsWith('rediss://')) {
      this.baseUrl = `https://${this.baseUrl.replace(/^rediss?:\/\//, '')}`;
    }
  }

  private async command<T = any>(...args: (string | number)[]): Promise<T> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(args),
    });
    if (!res.ok) {
      throw new Error(`KV request failed: HTTP ${res.status}`);
    }
    const data = (await res.json()) as { result?: T; error?: string };
    if (data.error) throw new Error(`KV error: ${data.error}`);
    return data.result as T;
  }

  private key(attemptId: string): string {
    return `idempotency:${attemptId}`;
  }

  private lockKey(attemptId: string, side: 'erpnext' | 'sheet'): string {
    return `idempotency:${attemptId}:lock:${side}`;
  }

  private toAttemptStatus(hash: Record<string, string>): AttemptStatus | null {
    if (!hash || !hash.order_id) return null;
    return {
      orderId: hash.order_id,
      createdAt: Number(hash.created_at) || 0,
      erpnextOk: String(hash.erpnext_ok) === 'true',
      sheetOk: String(hash.sheet_ok) === 'true',
      payload: this.parsePayload(hash.payload || '{}'),
    };
  }

  private parsePayload(raw: string): Record<string, any> {
    try {
      return JSON.parse(raw) as Record<string, any>;
    } catch {
      return {};
    }
  }

  async get(attemptId: string): Promise<AttemptStatus | null> {
    const hash = await this.command<Record<string, string> | null>('HGETALL', this.key(attemptId));
    if (!hash || Object.keys(hash).length === 0) return null;
    return this.toAttemptStatus(hash);
  }

  async claim(attemptId: string, orderId: string, createdAt: number, payload: Record<string, any>): Promise<boolean> {
    const created = await this.command<number>('HSETNX', this.key(attemptId), 'created_at', String(createdAt));
    if (created !== 1) return false;
    await this.command('HSET', this.key(attemptId),
      'order_id', orderId,
      'erpnext_ok', 'false',
      'sheet_ok', 'false',
      'payload', JSON.stringify(payload),
    );
    return true;
  }

  async complete(attemptId: string, field: 'erpnextOk' | 'sheetOk', value: boolean): Promise<void> {
    const redisField = field === 'erpnextOk' ? 'erpnext_ok' : 'sheet_ok';
    await this.command('HSET', this.key(attemptId), redisField, String(value));
    const status = await this.get(attemptId);
    if (status && status.erpnextOk && status.sheetOk) {
      await this.command('EXPIRE', this.key(attemptId), 90 * 24 * 60 * 60);
    }
  }

  async acquireSideLock(attemptId: string, side: 'erpnext' | 'sheet'): Promise<boolean> {
    const result = await this.command<string | null>('SET', this.lockKey(attemptId, side), '1', 'NX', 'EX', 60);
    return result === 'OK';
  }

  async releaseSideLock(attemptId: string, side: 'erpnext' | 'sheet'): Promise<void> {
    try {
      await this.command('DEL', this.lockKey(attemptId, side));
    } catch (e) {
      console.error('[Idempotency] lock release failed:', e);
    }
  }
}

const cut = (value: any, max = 100): string => {
  const str = String(value || '').trim();
  return str.slice(0, max);
};

const TIMEOUT_MS = 8_000;

const timeout = <T>(promise: Promise<T>, label: string): Promise<T> => {
  let timer: NodeJS.Timeout | null = null;
  const clear = () => { if (timer) clearTimeout(timer); };
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timeout`)), TIMEOUT_MS);
  });
  return Promise.race([promise, deadline]).finally(clear);
};

async function erpnextWrite(
  body: any,
  orderId: string,
  fetchFn: typeof fetch,
  store: IdempotencyStore,
  attemptId: string,
): Promise<{ ok: boolean }> {
  const acquired = await store.acquireSideLock(attemptId, 'erpnext');
  if (!acquired) {
    console.log('[Idempotency] erpnext side already in progress, skipping');
    return { ok: false };
  }
  try {
    const url = process.env.ERPNEXT_INGEST_URL;
    const secret = process.env.ERPNEXT_WEBHOOK_SECRET;
    if (!url || !secret) {
      console.error('[ERPNext] missing env');
      return { ok: false, error: 'missing env' } as any;
    }
    const response = await timeout(
      fetchFn(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-webhook-secret': secret },
        body: JSON.stringify({
          order_id: orderId,
          customer_name: body.name,
          customer_phone: body.phone,
          customer_email: body.email || '',
          package_name: body.package,
          total: body.amount,
          delivery_fee: body.deliveryFee || 3000,
          state: body.state,
          lga: body.lga || '',
          address: body.address,
          landmark: body.landmark || '',
          source: 'React-Web',
          utm_source: cut(body.utm_source),
          payment_method: body.paymentMethod || 'Pay on Delivery',
          click_id: cut(body.click_id),
          landing_page_url: cut(body.landing_page_url),
        }),
      }),
      '[ERPNext]',
    );
    if (!response.ok) {
      const text = await response.text();
      console.error(`[ERPNext] ${response.status}: ${text}`);
      return { ok: false, error: `${response.status}: ${text}` } as any;
    }
    await store.complete(attemptId, 'erpnextOk', true);
    console.log('[ERPNext] Success');
    return { ok: true };
  } catch (e: any) {
    console.error('[ERPNext]', e.message);
    return { ok: false, error: e.message } as any;
  } finally {
    await store.releaseSideLock(attemptId, 'erpnext');
  }
}

async function sheetsWrite(
  body: any,
  orderId: string,
  sheets: any,
  store: IdempotencyStore,
  attemptId: string,
): Promise<{ ok: boolean }> {
  const acquired = await store.acquireSideLock(attemptId, 'sheet');
  if (!acquired) {
    console.log('[Idempotency] sheet side already in progress, skipping');
    return { ok: false };
  }
  if (!sheets) {
    await store.releaseSideLock(attemptId, 'sheet');
    return { ok: false, error: 'Google Sheets not configured' } as any;
  }
  const spreadsheetId = process.env.SHEET_ID;
  if (!spreadsheetId) {
    await store.releaseSideLock(attemptId, 'sheet');
    return { ok: false, error: 'missing SHEET_ID' } as any;
  }
  try {
    await timeout(
      sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Orders!A:K',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[
            new Date().toLocaleString('sv-SE', { timeZone: 'Africa/Lagos' }),
            orderId,
            body.name,
            body.phone,
            body.email || '',
            body.address,
            body.state,
            body.package,
            Number(body.amount),
            body.deliveryDate || '',
            'website',
          ]],
        },
      }),
      '[Sheets]',
    );
    await store.complete(attemptId, 'sheetOk', true);
    console.log('[Sheets] Success');
    return { ok: true };
  } catch (e: any) {
    console.error('[Sheets]', e.message);
    return { ok: false, error: e.message } as any;
  } finally {
    await store.releaseSideLock(attemptId, 'sheet');
  }
}

async function recordOrder(
  body: any,
  status: { orderId: string; erpnextOk: boolean; sheetOk: boolean },
  sheets: any,
  fetchFn: typeof fetch,
  store: IdempotencyStore,
  attemptId: string,
): Promise<{ erpnextOk: boolean; sheetOk: boolean }> {
  const erpnextRes = status.erpnextOk ? { ok: true } : await erpnextWrite(body, status.orderId, fetchFn, store, attemptId);
  const sheetRes = status.sheetOk ? { ok: true } : await sheetsWrite(body, status.orderId, sheets, store, attemptId);
  return { erpnextOk: erpnextRes.ok, sheetOk: sheetRes.ok };
}

async function handleOrder(
  req: any,
  res: any,
  sheets: any,
  fetchFn: typeof fetch,
  store: IdempotencyStore,
): Promise<any> {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const reqBody = (req.body as Record<string, any>) || {};
  const attemptId = reqBody.checkoutAttemptId;
  if (!attemptId) {
    return res.status(400).json({ ok: false, error: 'Missing checkoutAttemptId' });
  }

  let status = await store.get(attemptId);
  const payload = status ? { ...status.payload, ...reqBody } : { ...reqBody };

  if (!status) {
    if (!payload.name || !payload.phone || !payload.package || !payload.state || !payload.address || !payload.amount) {
      return res.status(400).json({ ok: false, error: 'Missing required order fields' });
    }
  }

  let orderId: string;

  if (status) {
    orderId = status.orderId;
    if (status.erpnextOk && status.sheetOk) {
      return res.status(200).json({ ok: true, partial: false, orderId, erpnext: true, sheet: true });
    }
  } else {
    orderId = generateServerOrderId();
    const claimed = await store.claim(attemptId, orderId, Date.now(), payload);
    if (!claimed) {
      const existing = await store.get(attemptId);
      if (!existing) {
        return res.status(500).json({ ok: false, error: 'Idempotency claim race without record' });
      }
      status = existing;
      orderId = existing.orderId;
      if (existing.erpnextOk && existing.sheetOk) {
        return res.status(200).json({ ok: true, partial: false, orderId, erpnext: true, sheet: true });
      }
    } else {
      status = { orderId, createdAt: Date.now(), erpnextOk: false, sheetOk: false, payload };
    }
  }

  await recordOrder(payload, status, sheets, fetchFn, store, attemptId);

  const current = await store.get(attemptId) || status;
  const erpnext = Boolean(current.erpnextOk);
  const sheet = Boolean(current.sheetOk);

  if (erpnext && sheet) {
    return res.status(200).json({ ok: true, partial: false, orderId, erpnext, sheet });
  }
  if (erpnext || sheet) {
    return res.status(200).json({
      ok: true,
      partial: true,
      orderId,
      erpnext,
      sheet,
    });
  }
  return res.status(502).json({
    ok: false,
    orderId,
    erpnext,
    sheet,
    error: 'Order could not be recorded',
  });
}

async function getSheets() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!email || !key) return null;
  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sheets = await getSheets();
  try {
    const store = new RedisIdempotencyStore();
    return await handleOrder(req, res, sheets, fetch, store);
  } catch (e: any) {
    console.warn('[api/order] Redis not configured, falling back to memory store:', e.message);
    try {
      const store = new MemoryIdempotencyStore();
      return await handleOrder(req, res, sheets, fetch, store);
    } catch (err: any) {
      console.error('[api/order] handleOrder error:', err.message);
      return res.status(500).json({ ok: false, error: err.message || 'Order handler failed' });
    }
  }
}
