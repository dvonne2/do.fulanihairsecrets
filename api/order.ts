import { google } from 'googleapis';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOrder } from './lib/orderHandler';
import { RedisIdempotencyStore, MemoryIdempotencyStore } from './lib/idempotency';

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
  if (!sheets) {
    return res.status(500).json({ ok: false, error: 'Server configuration missing Google Sheets credentials' });
  }
  try {
    const store = new RedisIdempotencyStore();
    return await handleOrder(req, res, sheets, fetch, store);
  } catch (e: any) {
    console.warn('[api/order] Redis not configured, falling back to memory store:', e.message);
    const store = new MemoryIdempotencyStore();
    return await handleOrder(req, res, sheets, fetch, store);
  }
}
