import { google } from 'googleapis';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomBytes, createHash } from 'crypto';

function generateServerOrderId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = randomBytes(4).toString('hex').toUpperCase();
  return `FHS-${ts}-${rnd}`;
}

function getSheets() {
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

const SHEET_TAB = process.env.SHEET_TAB_NAME || 'DO Orders';
const SHEET_RANGE = `${SHEET_TAB}!A:O`;

// Minimal Meta CAPI helpers (server-side, no browser deps)
const META_PIXEL_ID = (process.env.META_PIXEL_ID || process.env.FB_PIXEL_ID || '220381209723501').trim();
const META_ACCESS_TOKEN = (process.env.META_ACCESS_TOKEN || process.env.FB_CAPI_ACCESS_TOKEN || '').trim();
const META_API_VERSION = (process.env.META_API_VERSION || process.env.FB_CAPI_VERSION || 'v19.0').trim();

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  let normalized = digits;
  if (digits.startsWith('0')) normalized = '234' + digits.slice(1);
  else if (!digits.startsWith('234')) normalized = '234' + digits;
  if (normalized.length === 13 && normalized.startsWith('234')) return normalized;
  return '';
}

function normalizeName(value: string): string {
  return value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getCookieFromHeader(name: string, cookieHeader: string | undefined): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp('(^|;\\s*)' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function getFirstHeader(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] || '';
  return value || '';
}

function getClientIp(req: VercelRequest): string {
  const forwarded = getFirstHeader(req.headers['x-forwarded-for']);
  if (forwarded) return forwarded.split(',')[0].trim();
  const real = getFirstHeader(req.headers['x-real-ip']);
  if (real) return real;
  return req.socket?.remoteAddress || '';
}

async function sendMetaCapiPurchase(
  body: Record<string, any>,
  orderId: string,
  req: VercelRequest
): Promise<any> {
  if (!META_PIXEL_ID || !META_ACCESS_TOKEN) {
    console.warn('[Meta] CAPI not configured, skipping server Purchase');
    return null;
  }

  try {
    const name = String(body.name || '').trim();
    const nameParts = name.split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    const phone = String(body.phone || body.whatsapp || '');
    const email = String(body.email || '').trim().toLowerCase();
    const state = String(body.state || '').trim().toLowerCase();
    const city = String(body.lga || body.city || '').trim().toLowerCase();
    const amount = Number(body.amount) || 0;
    const productAmount = Number(body.productAmount) || amount;
    const quantity = Number(body.quantity) || 1;
    const sku = String(body.sku || body.package || 'FULANI_HAIR_GRO').toUpperCase();

    const userData: Record<string, any> = {
      client_ip_address: getClientIp(req),
      client_user_agent: getFirstHeader(req.headers['user-agent']),
    };

    const normalizedPhone = normalizePhone(phone);
    if (normalizedPhone) userData.ph = [sha256(normalizedPhone)];
    if (email && email.includes('@')) userData.em = [sha256(email)];
    if (firstName) userData.fn = [sha256(normalizeName(firstName))];
    if (lastName) userData.ln = [sha256(normalizeName(lastName))];
    if (state) userData.st = [sha256(state)];
    if (city) userData.ct = [sha256(city)];
    userData.country = [sha256('ng')];

    const externalIds: string[] = [orderId];
    if (email) externalIds.push(sha256(email));
    if (normalizedPhone) externalIds.push(sha256(normalizedPhone));
    userData.external_id = [...new Set(externalIds)];

    const fbc = String(body.fbc || '') || getCookieFromHeader('_fbc', req.headers.cookie);
    const fbp = String(body.fbp || '') || getCookieFromHeader('_fbp', req.headers.cookie);
    if (fbc) userData.fbc = fbc;
    if (fbp) userData.fbp = fbp;

    if (!userData.fbc) {
      const fbclid = String(body.fbclid || body.click_id || '');
      if (fbclid) userData.fbc = `fb.1.${Date.now()}.${fbclid}`;
    }

    const event = {
      event_name: 'Purchase',
      event_id: orderId,
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_source_url:
        getFirstHeader(req.headers['meta-capi-origin']) ||
        getFirstHeader(req.headers.referer) ||
        'https://do.fulanihairsecrets.com/',
      user_data: userData,
      custom_data: {
        value: amount,
        currency: 'NGN',
        content_ids: [sku],
        content_name: String(body.package || 'Fulani Hair Gro'),
        content_type: 'product',
        contents: [{ id: sku, quantity, item_price: productAmount }],
        num_items: quantity,
      },
    };

    const metaUrl = `https://graph.facebook.com/${META_API_VERSION}/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(META_ACCESS_TOKEN)}`;
    const metaRes = await fetch(metaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [event] }),
    });
    if (!metaRes.ok) {
      const text = await metaRes.text();
      console.warn('[Meta] server Purchase CAPI error:', metaRes.status, text.slice(0, 500));
      return null;
    }
    const metaBody = await metaRes.json();
    console.log('[Meta] server Purchase CAPI dispatched for order:', orderId, 'events_received:', metaBody?.events_received);
    return metaBody;
  } catch (err: any) {
    console.error('[Meta] server Purchase CAPI exception:', err?.message || err);
    return null;
  }
}

// In-memory idempotency cache for the lifetime of this serverless container.
// It prevents the same checkout attempt from being written twice if the
// browser sends rapid duplicate requests before the redirect unloads the page.
const recentOrderIds = new Map<string, string>();
const MAX_RECENT_CACHE = 1000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', getFirstHeader(req.headers.origin) || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, meta-capi-origin');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const body = (req.body as Record<string, any>) || {};
  const required = ['name', 'phone', 'package', 'state', 'address', 'amount'];
  const productAmount = Number(body.productAmount) || 0;
  const deliveryFee = Number(body.deliveryFee) || 0;
  const quantity = Number(body.quantity) || 1;
  const sku = String(body.sku || '');
  const missing = required.filter((k) => !body[k]);
  if (missing.length) {
    return res.status(400).json({ ok: false, error: `Missing: ${missing.join(', ')}` });
  }

  const orderId = generateServerOrderId();
  const checkoutAttemptId =
    typeof body.checkoutAttemptId === 'string' ? body.checkoutAttemptId : '';

  // If this exact checkout attempt was already processed in this container,
  // return the original order ID instead of creating a duplicate.
  if (checkoutAttemptId && recentOrderIds.has(checkoutAttemptId)) {
    const existingOrderId = recentOrderIds.get(checkoutAttemptId) as string;
    console.log('[Sheets] Duplicate checkout attempt detected:', checkoutAttemptId);
    return res.status(200).json({ ok: true, orderId: existingOrderId });
  }

  const sheets = getSheets();
  if (!sheets) {
    return res.status(500).json({ ok: false, error: 'Google Sheets not configured' });
  }
  const spreadsheetId = process.env.SHEET_ID;
  if (!spreadsheetId) {
    return res.status(500).json({ ok: false, error: 'SHEET_ID not set' });
  }

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: SHEET_RANGE,
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
          productAmount,
          deliveryFee,
          quantity,
          sku,
        ]],
      },
    });
    if (checkoutAttemptId) {
      recentOrderIds.set(checkoutAttemptId, orderId);
      if (recentOrderIds.size > MAX_RECENT_CACHE) {
        const first = recentOrderIds.keys().next().value;
        if (first !== undefined) recentOrderIds.delete(first);
      }
    }
    const capiResult = await sendMetaCapiPurchase(body, orderId, req);
    return res.status(200).json({ ok: true, orderId, capi: capiResult });
  } catch (e: any) {
    const cause = e.cause ? ` (${e.cause.message || e.cause})` : '';
    const msg = String(e.message || 'unknown error') + cause;
    console.error('[Sheets]', msg, e);
    return res.status(502).json({ ok: false, orderId, error: 'Could not record order', diagnostic: msg });
  }
}
