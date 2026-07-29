import { google } from 'googleapis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const cut = (v: any, n = 140) => (v == null ? "" : String(v)).slice(0, n);
const TIMEOUT_MS = 5000;

const timeout = <T>(promise: Promise<T>, label: string) =>
  Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${TIMEOUT_MS}ms`)), TIMEOUT_MS)
    ),
  ]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const body = req.body;
  const missing = [];
  if (!body.name) missing.push('name');
  if (!body.phone) missing.push('phone');
  if (!body.whatsapp) missing.push('whatsapp');
  if (!body.email) missing.push('email');
  if (!body.address) missing.push('address');
  if (!body.state) missing.push('state');
  if (!body.package) missing.push('package');
  if (!body.amount) missing.push('amount');
  if (!body.deliveryDate) missing.push('deliveryDate');
  if (missing.length > 0) {
    return res.status(400).json({ ok: false, error: `Missing required fields: ${missing.join(', ')}` });
  }
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.email).trim().toLowerCase());
  const validPhone = (value: unknown) => /^(?:0\d{10}|234\d{10}|\d{10})$/.test(String(value).replace(/\D/g, ''));
  if (!validEmail) return res.status(400).json({ ok: false, error: 'Invalid email address' });
  if (!validPhone(body.phone)) return res.status(400).json({ ok: false, error: 'Invalid phone number' });
  if (!validPhone(body.whatsapp)) return res.status(400).json({ ok: false, error: 'Invalid WhatsApp number' });

  const erpnextWrite = (async () => {
    const url = process.env.ERPNEXT_INGEST_URL;
    const secret = process.env.ERPNEXT_WEBHOOK_SECRET;
    if (!url || !secret) { console.error('[ERPNext] Missing env vars'); return { ok: false, error: 'Missing env vars' }; }
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
      const response = await fetch(url, {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json', 'X-Webhook-Secret': secret },
        body: JSON.stringify({
          order_id: body.orderId, customer_name: body.name, customer_phone: body.phone,
          customer_email: body.email || '', package_name: body.package, total: body.amount,
          delivery_fee: body.deliveryFee || 3000, state: body.state, lga: body.lga || '',
          address: body.address, landmark: body.landmark || '', source: 'React-Web',
          aff_id: cut(body.aff_id), utm_source: cut(body.utm_source),
          payment_method: body.paymentMethod || 'Pay on Delivery',
          click_id: cut(body.click_id), landing_page_url: cut(body.landing_page_url),
        }),
      });
      clearTimeout(timer);
      if (!response.ok) { 
        const text = await response.text();
        console.error(`[ERPNext] ${response.status}: ${text}`); 
        return { ok: false, error: `${response.status}: ${text}` }; 
      }
      console.log('[ERPNext] Success');
      return { ok: true };
    } catch (e: any) { console.error('[ERPNext]', e.message); return { ok: false, error: e.message }; }
  })();

  const sheetsWrite = (async () => {
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const sheetId = process.env.SHEET_ID;
    if (!email || !key || !sheetId) { 
      console.error('[Sheets] Missing env vars', { hasEmail: !!email, hasKey: !!key, hasSheetId: !!sheetId }); 
      return { ok: false, error: 'Missing env vars' }; 
    }
    try {
      const auth = new google.auth.JWT({
        email,
        key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      });
      const sheets = google.sheets({ version: 'v4', auth });
      await timeout(sheets.spreadsheets.values.append({
        spreadsheetId: sheetId, range: 'Orders!A:K', valueInputOption: 'USER_ENTERED',
        requestBody: { values: [[
          new Date().toLocaleString('sv-SE', { timeZone: 'Africa/Lagos' }),
          body.orderId, body.name, body.phone, body.email || '',
          body.address, body.state, body.package, Number(body.amount),
          body.deliveryDate || '', 'website'
        ]] },
      }), '[Sheets]');
      console.log('[Sheets] Success');
      return { ok: true };
    } catch (e: any) { 
      console.error('[Sheets]', e.message); 
      console.error('[Sheets] Full error:', JSON.stringify(e, null, 2));
      return { ok: false, error: e.message }; 
    }
  })();

  const results = await Promise.allSettled([erpnextWrite, sheetsWrite]);
  const erpnextResult = results[0];
  const sheetResult = results[1];
  const erpnextOk = erpnextResult.status === 'fulfilled' && erpnextResult.value.ok === true;
  const sheetOk = sheetResult.status === 'fulfilled' && sheetResult.value.ok === true;

  if (erpnextOk || sheetOk) {
    return res.status(200).json({ ok: true, orderId: body.orderId, erpnext: erpnextOk, sheet: sheetOk });
  } else {
    return res.status(502).json({ 
      ok: false, 
      error: 'Order could not be recorded', 
      erpnext: false, 
      sheet: false
    });
  }
}
