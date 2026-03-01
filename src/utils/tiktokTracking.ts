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

// Helper function to generate unique event IDs
function generateEventId(): string {
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
async function fireTikTokEvent(event: string, parameters?: Record<string, any>): Promise<void> {
  const tikTokReady = await waitForTikTok();
  
  if (!tikTokReady) {
    console.warn('[TikTok] Pixel not loaded, skipping event:', event);
    return;
  }

  try {
    const eventId = generateEventId();
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
 * AddToCart - fires when user clicks into the Step 1 form (first interaction/focus)
 */
export async function fireTikTokAddToCart(data?: {
  content_name?: string;
  content_id?: string;
  value?: number;
  currency?: string;
}): Promise<void> {
  await fireTikTokEvent('AddToCart', {
    content_type: 'product',
    content_name: data?.content_name || 'Fulani Hair Gro',
    content_id: data?.content_id || 'PKG-001', // Required for VSA
    value: data?.value || 0,
    currency: data?.currency || 'NGN',
  });
}

/**
 * LeadSync / CompleteRegistration - fires after email AND phone number are captured in Step 1's form
 */
export async function fireTikTokLeadSync(data?: {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}): Promise<void> {
  await fireTikTokEvent('LeadSync', {
    content_category: 'identity_capture',
    value: 0,
  });
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
  await fireTikTokEvent('CompleteRegistration', {
    content_category: 'identity_capture',
    value: 0,
  });
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
  await fireTikTokEvent('InitiateCheckout', {
    content_type: 'product',
    content_name: data.content_name,
    content_id: data.content_id || 'PKG-001', // Required for VSA
    value: data.value,
    currency: data.currency || 'NGN',
  });
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
  await fireTikTokEvent('Purchase', {
    content_type: 'product',
    content_name: data.content_name,
    content_id: data.content_id || 'PKG-001', // Required for VSA
    value: data.value,
    currency: data.currency || 'NGN',
    order_id: data.orderId,
  });
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
