import type { VercelRequest, VercelResponse } from '@vercel/node';

const ALLOWED_EVENT_NAMES = new Set([
  'PageView',
  'ViewContent',
  'InitiateCheckout',
  'Purchase',
  'FormStart',
  'LeadSync',
  'CartRecovery',
]);

const MAX_BODY_SIZE = 64 * 1024; // 64 KB
const MAX_EVENT_AGE = 7 * 24 * 60 * 60; // 7 days
const MAX_EVENT_FUTURE = 5 * 60; // 5 minutes

function getConfig() {
  return {
    pixelId: process.env.META_PIXEL_ID?.trim() || '',
    accessToken: process.env.META_ACCESS_TOKEN?.trim() || '',
    apiVersion: process.env.META_API_VERSION?.trim() || '',
    allowedOrigins: (process.env.META_CAPI_ALLOWED_ORIGINS || '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
    allowedSourceHosts: (process.env.META_CAPI_ALLOWED_SOURCE_HOSTS || '')
      .split(',')
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value)
  );
}

function getBodySize(body: unknown): number {
  return Buffer.byteLength(JSON.stringify(body ?? {}), 'utf8');
}

function getHeaderValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] || '';
  return value || '';
}

function firstForwardedIp(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return '';

  return raw
    .split(',')
    .map((part) => part.trim())
    .find(Boolean) || '';
}

function getClientIp(req: VercelRequest): string {
  return (
    firstForwardedIp(req.headers['x-vercel-forwarded-for']) ||
    firstForwardedIp(req.headers['x-real-ip']) ||
    firstForwardedIp(req.headers['x-forwarded-for']) ||
    req.socket?.remoteAddress ||
    ''
  );
}

function validateEventId(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (trimmed.length < 8 || trimmed.length > 128) return null;
  return trimmed;
}

function validateEventTime(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  if (value <= 0) return null;

  // Reject millisecond timestamps; require Unix seconds.
  if (value > 1_000_000_000_000) return null;

  const now = Math.floor(Date.now() / 1000);
  if (now - value > MAX_EVENT_AGE) return null;
  if (value - now > MAX_EVENT_FUTURE) return null;

  return Math.floor(value);
}

function validateActionSource(value: unknown): string | null {
  if (!value) return 'website';
  if (typeof value !== 'string' || value.trim() !== 'website') return null;
  return 'website';
}

function validateEventSourceUrl(
  value: unknown,
  allowedHosts: string[],
): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;

  try {
    const parsed = new URL(value);

    if (parsed.protocol !== 'https:') return null;
    if (!allowedHosts.includes(parsed.hostname.toLowerCase())) return null;

    return parsed.toString();
  } catch {
    return null;
  }
}

function setCorsHeaders(res: VercelResponse, origin: string) {
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sanitizeMetaResponse(raw: any) {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'Meta CAPI request failed' };
  }

  return {
    ok: false,
    error: 'Meta CAPI request failed',
    meta_code:
      typeof raw.error?.code === 'number'
        ? raw.error.code
        : undefined,
    meta_subcode:
      typeof raw.error?.error_subcode === 'number'
        ? raw.error.error_subcode
        : undefined,
    message:
      typeof raw.error?.message === 'string'
        ? raw.error.message.slice(0, 300)
        : undefined,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const method = req.method || '';
  const origin = getHeaderValue(req.headers.origin);
  const config = getConfig();

  if (method === 'OPTIONS') {
    if (origin && !config.allowedOrigins.includes(origin)) {
      return res.status(403).json({ ok: false, error: 'Origin not allowed' });
    }
    setCorsHeaders(res, origin || config.allowedOrigins[0] || 'https://fulanihairsecrets.com');
    return res.status(204).end();
  }

  if (method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  if (origin && !config.allowedOrigins.includes(origin)) {
    return res.status(403).json({ ok: false, error: 'Origin not allowed' });
  }

  if (origin) setCorsHeaders(res, origin);

  if (!config.pixelId || !config.accessToken || !config.apiVersion) {
    return res.status(500).json({ ok: false, error: 'CAPI not configured' });
  }

  const body = req.body;

  if (getBodySize(body) > MAX_BODY_SIZE) {
    return res.status(413).json({ ok: false, error: 'Payload too large' });
  }

  if (!isPlainObject(body)) {
    return res.status(400).json({ ok: false, error: 'Invalid payload' });
  }

  const {
    event_name,
    event_id,
    event_time,
    event_source_url,
    action_source,
    user_data,
    custom_data,
  } = body;

  if (typeof event_name !== 'string' || !ALLOWED_EVENT_NAMES.has(event_name)) {
    return res.status(400).json({ ok: false, error: 'Unsupported event_name' });
  }

  const validEventId = validateEventId(event_id);
  if (!validEventId) {
    return res.status(400).json({ ok: false, error: 'Invalid event_id' });
  }

  const validEventTime = validateEventTime(event_time);
  if (!validEventTime) {
    return res.status(400).json({ ok: false, error: 'Invalid event_time' });
  }

  const validActionSource = validateActionSource(action_source);
  if (!validActionSource) {
    return res.status(400).json({ ok: false, error: 'Invalid action_source' });
  }

  const validSourceUrl = validateEventSourceUrl(
    event_source_url,
    config.allowedSourceHosts,
  );
  if (!validSourceUrl) {
    return res.status(400).json({ ok: false, error: 'Invalid event_source_url' });
  }

  if (!isPlainObject(user_data) || !isPlainObject(custom_data)) {
    return res.status(400).json({ ok: false, error: 'Invalid user_data or custom_data' });
  }

  // Preserve supplied visitor identifiers; use request headers only as a fallback.
  const clientIp = user_data.client_ip_address || getClientIp(req);
  const clientUserAgent = user_data.client_user_agent || getHeaderValue(req.headers['user-agent']);

  const enrichedUserData: Record<string, any> = { ...user_data };
  if (clientIp) enrichedUserData.client_ip_address = clientIp;
  if (clientUserAgent) enrichedUserData.client_user_agent = clientUserAgent;

  const event = {
    event_name,
    event_id: validEventId,
    event_time: validEventTime,
    action_source: validActionSource,
    event_source_url: validSourceUrl,
    user_data: enrichedUserData,
    custom_data,
  };

  const metaUrl = new URL(
    `https://graph.facebook.com/${config.apiVersion}/${config.pixelId}/events`,
  );
  metaUrl.searchParams.set('access_token', config.accessToken);

  try {
    const metaRes = await fetch(metaUrl.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [event],
      }),
    });

    const text = await metaRes.text();

    if (!metaRes.ok) {
      let metaBody: any;
      try {
        metaBody = JSON.parse(text);
      } catch {
        return res.status(metaRes.status).json({
          ok: false,
          error: 'Meta CAPI request failed',
        });
      }
      return res.status(metaRes.status).json(sanitizeMetaResponse(metaBody));
    }

    let metaBody: any;
    try {
      metaBody = JSON.parse(text);
    } catch {
      return res.status(200).json({ ok: true });
    }

    return res.status(200).json({
      ok: true,
      events_received:
        typeof metaBody?.events_received === 'number'
          ? metaBody.events_received
          : undefined,
      messages:
        Array.isArray(metaBody?.messages)
          ? metaBody.messages
          : undefined,
    });
  } catch {
    return res.status(502).json({ ok: false, error: 'Meta CAPI request failed' });
  }
}
