/**
 * Idempotency store interface for the order endpoint.
 *
 * Implementations must support atomic create-if-absent for a checkout_attempt_id.
 * The key must be durable and shared across all Vercel function instances.
 *
 * Production: RedisIdempotencyStore (Upstash / Vercel KV).
 * Test / dev: MemoryIdempotencyStore.
 *
 * Requirements:
 * - Redis is the sole authority for attempt mapping, destination status and retry state.
 * - Google Sheets is only an output destination and is never used for locking.
 * - Field updates are atomic (Redis Hash HSET).
 * - The validated payload is stored so a background retry can complete without a browser.
 * - Incomplete records are never expired; completed records get a 90-day TTL for audit.
 */

export interface AttemptStatus {
  orderId: string;
  createdAt: number;
  erpnextOk: boolean;
  sheetOk: boolean;
  payload: Record<string, any>;
}

export interface IdempotencyStore {
  /** Return the current status or null if the attempt is unknown. */
  get(attemptId: string): Promise<AttemptStatus | null>;
  /**
   * Try to atomically claim this attempt. Returns true if this call created
   * the record, false if another request already claimed it.
   */
  claim(attemptId: string, orderId: string, createdAt: number, payload: Record<string, any>): Promise<boolean>;
  /** Persist the final result of one side (erpnext or sheet). */
  complete(attemptId: string, field: 'erpnextOk' | 'sheetOk', value: boolean): Promise<void>;
  /**
   * Try to acquire a side lock so only one concurrent request executes
   * the missing side (ERPNext or Google Sheet) for an attempt.
   */
  acquireSideLock(attemptId: string, side: 'erpnext' | 'sheet'): Promise<boolean>;
  /** Release a side lock. */
  releaseSideLock(attemptId: string, side: 'erpnext' | 'sheet'): Promise<void>;
}

export class MemoryIdempotencyStore implements IdempotencyStore {
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

  /** Test helper to inspect state. */
  dump(): Map<string, AttemptStatus> {
    return new Map(this.data);
  }
}

/**
 * Vercel KV / Upstash Redis REST implementation.
 *
 * Uses a Redis Hash per checkout_attempt_id for mapping and destination status,
 * plus a transient lock key per side. Field updates are HSET so erpnext_ok and
 * sheet_ok can be updated independently without overwriting each other.
 *
 * Required environment variables:
 *   KV_REST_API_URL  (e.g. https://...upstash.io)
 *   KV_REST_API_TOKEN (read/write token from Upstash/Vercel KV)
 */
export class RedisIdempotencyStore implements IdempotencyStore {
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
    // HSETNX on a sentinel field creates the hash only if it does not exist.
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
    // Only completed records get a TTL; incomplete records persist until they succeed.
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
