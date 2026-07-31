// src/utils/tiktokTracking.ts
// TikTok Pixel tracking - mirrors Meta events for consistency

declare global {
  interface Window {
    ttq: {
      track: (event: string, parameters?: Record<string, any>) => void;
      page: () => void;
    };
  }
}

// ============================================
// DETERMINISTIC EVENT IDs - Same as Meta
// ============================================
// Uses SHA-256 of (eventName + identity) so TikTok events
// can be deduplicated consistently across sessions
let _tiktokSessionSeed: string | null = null;
function getTikTokSessionSeed(): string {
  if (_tiktokSessionSeed) return _tiktokSessionSeed;
  try {
    const stored = localStorage.getItem('fhg_tiktok_session_seed');
    if (stored) { _tiktokSessionSeed = stored; return stored; }
  } catch {}
  _tiktokSessionSeed = Math.random().toString(36).slice(2);
  try { localStorage.setItem('fhg_tiktok_session_seed', _tiktokSessionSeed); } catch {}
  return _tiktokSessionSeed;
}

async function makeTikTokEventId(eventName: string, identity?: string): Promise<string> {
  const seed = identity || getTikTokSessionSeed();
  const raw = `${eventName}_${seed}`;
  const hash = await sha256raw(raw);
  return hash.slice(0, 16); // 16-char hex = plenty unique
}

async function sha256raw(value: string): Promise<string> {
  const data = new TextEncoder().encode(value.trim().toLowerCase());
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Helper function to generate random event ID (fallback only)
function generateRandomEventId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Check if TikTok Pixel is loaded
function isTikTokLoaded(): boolean {
  return typeof window !== 'undefined' && typeof window.ttq === 'object' && typeof window.ttq.track === 'function';
}

// Wait for TikTok Pixel to load (max 3 seconds)
function waitForTikTok(): Promise<boolean> {
  return new Promise((resolve) => {
    if (isTikTokLoaded()) {
      resolve(true);
      return;
    }

    let attempts = 0;
    const maxAttempts = 30; // 3 seconds at 100ms intervals

    const checkInterval = setInterval(() => {
      attempts++;
      if (isTikTokLoaded()) {
        clearInterval(checkInterval);
        resolve(true);
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        resolve(false);
      }
    }, 100);
  });
}

// Generic TikTok event firing function
async function fireTikTokEvent(event: string, parameters?: Record<string, any>, identity?: string): Promise<void> {
  const tikTokReady = await waitForTikTok();
  
  if (!tikTokReady) {
    console.warn('[TikTok] Pixel not loaded, skipping event:', event);
    return;
  }

  try {
    const eventId = await makeTikTokEventId(event, identity);
    const eventParams = {
      ...parameters,
      event_id: eventId,
    };

    window.ttq.track(event, eventParams);
    console.log(`[TikTok] Event fired: ${event}`, eventParams);
  } catch (error) {
    console.error(`[TikTok] Error firing event ${event}:`, error);
  }
}

// ==============================
// TIKTOK EVENT FUNCTIONS
// ==============================

/**
 * LeadSync / CompleteRegistration - fires after email AND phone number are captured in Step 1's form
 */
export async function fireTikTokLeadSync(data?: {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}): Promise<void> {
  const identity = data?.phone || data?.email || '';
  await fireTikTokEvent('LeadSync', {
    content_category: 'identity_capture',
    value: 0,
  }, identity);
}

/**
 * CompleteRegistration - alternative name for LeadSync
 */
export async function fireTikTokCompleteRegistration(data?: {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}): Promise<void> {
  const identity = data?.phone || data?.email || '';
  await fireTikTokEvent('CompleteRegistration', {
    content_category: 'identity_capture',
    value: 0,
  }, identity);
}

/**
 * InitiateCheckout - fires when Step 2 is reached
 */
export async function fireTikTokInitiateCheckout(data: {
  content_name: string;
  content_id?: string;
  value: number;
  currency?: string;
  email?: string;
  phone?: string;
}): Promise<void> {
  const identity = data.phone || data.email || '';
  await fireTikTokEvent('InitiateCheckout', {
    content_type: 'product',
    content_name: data.content_name,
    content_id: data.content_id || 'PKG-001', // Required for VSA
    value: data.value,
    currency: data.currency || 'NGN',
  }, identity);
}

/**
 * Purchase - fires on the Thank You page
 */
export async function fireTikTokPurchase(data: {
  content_name: string;
  content_id?: string;
  value: number;
  currency?: string;
  email?: string;
  phone?: string;
  orderId?: string;
}): Promise<void> {
  const identity = data.orderId || data.phone || data.email || '';
  await fireTikTokEvent('Purchase', {
    content_type: 'product',
    content_name: data.content_name,
    content_id: data.content_id || 'PKG-001', // Required for VSA
    value: data.value,
    currency: data.currency || 'NGN',
    order_id: data.orderId,
    email: data.email,
    phone: data.phone,
  }, identity);
}

// ==============================
// UTILITY FUNCTIONS
// ==============================

/**
 * Check if TikTok Pixel is properly loaded
 */
export function isTikTokPixelReady(): boolean {
  return isTikTokLoaded();
}

/**
 * Get TikTok Pixel status for debugging
 */
export function getTikTokPixelStatus(): {
  loaded: boolean;
  pixelId?: string;
  lastEvent?: string;
} {
  return {
    loaded: isTikTokLoaded(),
    pixelId: 'D6I4NQRC77U4M1757710', // From index.html
  };
}
