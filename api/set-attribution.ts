import type { VercelRequest, VercelResponse } from '@vercel/node';

const FBC_PATTERN = /^fb\.1\.\d+\.[\w-]+$/;
const FBP_PATTERN = /^fb\.1\.\d+\.\d+$/;
const MAX_LEN = 500;

function cookie(name: string, value: string, maxAgeDays: number): string {
  const maxAge = maxAgeDays * 24 * 60 * 60;
  return `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax; Secure`;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const body = (req.body as Record<string, any>) || {};
  const fbc = typeof body.fbc === 'string' ? body.fbc.slice(0, MAX_LEN) : '';
  const fbp = typeof body.fbp === 'string' ? body.fbp.slice(0, MAX_LEN) : '';

  const cookies: string[] = [];
  if (fbc && FBC_PATTERN.test(fbc)) {
    cookies.push(cookie('_fbc', fbc, 30));
  }
  if (fbp && FBP_PATTERN.test(fbp)) {
    cookies.push(cookie('_fbp', fbp, 90));
  }

  if (!cookies.length) {
    return res.status(400).json({ ok: false, error: 'No valid fbc or fbp provided' });
  }

  res.setHeader('Set-Cookie', cookies);
  return res.status(200).json({ ok: true, set: cookies.length });
}
