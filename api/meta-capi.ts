import type { VercelRequest, VercelResponse } from '@vercel/node';

const UPSTREAM_URL = process.env.META_CAPI_UPSTREAM_URL || 'https://apis.fulanihairsecrets.com/meta-capi.php';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const forwardedFor = req.headers['x-forwarded-for'];
    const clientIp = (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor || req.socket.remoteAddress || '')
      .split(',')[0]
      .trim();
    const userAgent = req.headers['user-agent'] || '';
    const payload = {
      ...req.body,
      user_data: {
        ...(req.body?.user_data || {}),
        ...(clientIp ? { client_ip_address: clientIp } : {}),
        ...(userAgent ? { client_user_agent: userAgent } : {}),
      },
    };

    const upstream = await fetch(UPSTREAM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const responseText = await upstream.text();

    res.status(upstream.status);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    return res.send(responseText);
  } catch (error) {
    return res.status(502).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Meta CAPI request failed',
    });
  }
}
