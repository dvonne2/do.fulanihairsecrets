import { generateServerOrderId } from '../../src/utils/serverOrderId';
import type { IdempotencyStore } from './idempotency';

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

export async function handleOrder(
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
  // Merge stored payload with any new data so a background retry can proceed
  // even when the customer browser is not resending the full form.
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
    // Attempt to claim the attempt atomically.
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

  // At this point status exists and is missing one or both sides.
  await recordOrder(payload, status, sheets, fetchFn, store, attemptId);

  // Re-read authoritative status for the response.
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
