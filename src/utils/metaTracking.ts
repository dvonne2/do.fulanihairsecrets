// src/utils/metaTracking.ts
// Complete Meta Pixel + CAPI tracking — single file, zero dependencies

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

const CAPI_ENDPOINT = 'https://apis.fulanihairsecrets.com/meta-capi.php';

const browserFired = new Set<string>();
const capiFired = new Set<string>();

async function sha256(value: string): Promise<string> {
  const data = new TextEncoder().encode(value.trim().toLowerCase());
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) return '234' + digits.slice(1);
  if (digits.startsWith('234')) return digits;
  return '234' + digits;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function getFbp(): string | null {
  return getCookie('_fbp');
}

function getFbc(): string | null {
  const cookieFbc = getCookie('_fbc');
  if (cookieFbc) return cookieFbc;
  const params = new URLSearchParams(window.location.search);
  const fbclid = params.get('fbclid');
  if (fbclid) return `fb.1.${Date.now()}.${fbclid}`;
  try {
    const stored = localStorage.getItem('meta_fbc_data');
    if (stored) {
      const data = JSON.parse(stored);
      if (Date.now() < data.expiresAt) return data.fbc;
    }
  } catch {}
  return null;
}

function captureFbclid(): void {
  try {
    const params = new URLSearchParams(window.location.search);
    const fbclid = params.get('fbclid');
    if (fbclid) {
      const fbc = `fb.1.${Date.now()}.${fbclid}`;
      localStorage.setItem(
        'meta_fbc_data',
        JSON.stringify({
          fbc,
          fbclid,
          timestamp: Date.now(),
          expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
        })
      );
    }
  } catch {}
}

if (typeof window !== 'undefined') {
  captureFbclid();
}

function fireBrowserEvent(
  type: 'track' | 'trackCustom',
  eventName: string,
  data: Record<string, any>,
  eventId?: string
): void {
  const key = `${type}_${eventName}`;
  if (browserFired.has(key)) {
    console.log(`[Meta] Browser skip duplicate: ${eventName}`);
    return;
  }
  browserFired.add(key);
  if (typeof window.fbq !== 'function') {
    console.warn(`[Meta] fbq not loaded, skipping: ${eventName}`);
    return;
  }
  const options = eventId ? { eventID: eventId } : undefined;
  window.fbq(type, eventName, data, options);
  console.log(`[Meta] Browser ${type}: ${eventName}`, data);
}

async function fireCAPIEvent(
  eventName: string,
  eventId: string,
  userData: Record<string, any>,
  customData: Record<string, any>
): Promise<void> {
  const key = `capi_${eventName}`;
  if (capiFired.has(key)) {
    console.log(`[Meta] CAPI skip duplicate: ${eventName}`);
    return;
  }
  capiFired.add(key);
  const fbp = getFbp();
  const fbc = getFbc();
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;
  try {
    const res = await fetch(CAPI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: eventName,
        event_id: eventId,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: window.location.href,
        user_data: userData,
        custom_data: {
          ...customData,
          currency: 'NGN',
        },
      }),
    });
    const result = await res.json();
    console.log(`[Meta] CAPI sent: ${eventName}`, result);
  } catch (err) {
    console.error(`[Meta] CAPI error: ${eventName}`, err);
  }
}

async function buildUserData(info: {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  state?: string;
  city?: string;
  externalId?: string;
}): Promise<Record<string, any>> {
  const ud: Record<string, any> = {};
  if (info.email) ud.em = [await sha256(info.email)];
  if (info.phone) ud.ph = [await sha256(normalizePhone(info.phone))];
  if (info.firstName) ud.fn = [await sha256(info.firstName)];
  if (info.lastName) ud.ln = [await sha256(info.lastName)];
  if (info.state) ud.st = [await sha256(info.state)];
  if (info.city) ud.ct = [await sha256(info.city)];
  ud.country = [await sha256('ng')];
  if (info.externalId) ud.external_id = [await sha256(info.externalId)];
  const fbp = getFbp();
  const fbc = getFbc();
  if (fbp) ud.fbp = fbp;
  if (fbc) ud.fbc = fbc;
  return ud;
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function getStoredIdentity(): Promise<Record<string, any>> {
  try {
    const stored = localStorage.getItem('fhg_identity');
    if (stored) {
      const data = JSON.parse(stored);
      if (Date.now() < data.expiresAt) {
        return buildUserData({
          email: data.email,
          phone: data.phone,
          firstName: data.firstName,
          lastName: data.lastName,
        });
      }
    }
  } catch {}
  return {};
}

// ============================================
// EXPORTED FUNCTIONS
// ============================================

export interface OrderData {
  orderId: string;
  email?: string;
  phone?: string;
  fullName?: string;
  totalAmount: number;
  packageAmount?: number;
  packageName?: string;
  paymentType?: 'PBD' | 'POD' | string;
  state?: string;
  lga?: string;
  numItems?: number;
}

export async function fireThankYouEvents(order: OrderData): Promise<void> {
  console.log('[Meta] Firing thank-you events for order:', order.orderId);
  const nameParts = (order.fullName || '').trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  const userData = await buildUserData({
    email: order.email,
    phone: order.phone,
    firstName,
    lastName,
    state: order.state,
    city: order.lga,
    externalId: order.orderId,
  });
  const amount = Number(order.totalAmount) || 0;
  const pkgAmount = Number(order.packageAmount) || amount;
  const prefix = (order.paymentType || 'PBD').toUpperCase() === 'PBD' ? 'pbd' : 'pod';
  const valueEventName = `${prefix}${pkgAmount}`;

  // 1. PURCHASE
  const purchaseId = `purchase_${order.orderId}_${Date.now()}`;
  fireBrowserEvent('track', 'Purchase', {
    value: amount,
    currency: 'NGN',
    content_type: 'product',
    content_name: order.packageName || 'Fulani Hair Gro',
    num_items: order.numItems || 1,
  }, purchaseId);
  await fireCAPIEvent('Purchase', purchaseId, userData, {
    value: amount,
    content_name: order.packageName || 'Fulani Hair Gro',
    num_items: order.numItems || 1,
  });
  await delay(500);

  // 2. VALUE-BASED EVENT
  const valueId = `${prefix}_${order.orderId}_${Date.now()}`;
  fireBrowserEvent('trackCustom', valueEventName, {
    value: amount,
    currency: 'NGN',
    content_type: 'product',
    content_name: `${order.paymentType}_${order.packageName}`,
  }, valueId);
  await fireCAPIEvent(valueEventName, valueId, userData, {
    value: amount,
    content_name: `${order.paymentType}_${order.packageName}`,
  });
  await delay(500);

  // 3. HIGH VALUE PURCHASE
  if (amount >= 50000) {
    const hvpId = `hvp_${order.orderId}_${Date.now()}`;
    fireBrowserEvent('trackCustom', 'HighValuePurchase', {
      value: amount,
      currency: 'NGN',
      content_type: 'product',
      content_name: order.packageName || 'Fulani Hair Gro',
    }, hvpId);
    await fireCAPIEvent('HighValuePurchase', hvpId, userData, {
      value: amount,
      content_name: order.packageName || 'Fulani Hair Gro',
    });
  }

  // 4. COMPLETE REGISTRATION
  const crId = `cr_${order.orderId}_${Date.now()}`;
  fireBrowserEvent('track', 'CompleteRegistration', {
    value: amount,
    currency: 'NGN',
    content_name: order.packageName || 'Fulani Hair Gro',
  }, crId);

  console.log('[Meta] All thank-you events complete');
}

let leadSyncFired = false;

export async function fireLeadSync(info: {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}): Promise<void> {
  if (leadSyncFired) return;
  if (!info.email && !info.phone) return;
  leadSyncFired = true;
  const userData = await buildUserData(info);
  const eventId = `leadsync_${Date.now()}`;
  fireBrowserEvent('trackCustom', 'LeadSync', {
    content_category: 'identity_capture',
  }, eventId);
  await fireCAPIEvent('LeadSync', eventId, userData, {
    value: 0,
    content_category: 'identity_capture',
  });
  try {
    localStorage.setItem(
      'fhg_identity',
      JSON.stringify({
        email: info.email,
        phone: info.phone,
        firstName: info.firstName,
        lastName: info.lastName,
        capturedAt: Date.now(),
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      })
    );
  } catch {}
  console.log('[Meta] LeadSync fired');
}

export async function fireFormStart(): Promise<void> {
  const eventId = `formstart_${Date.now()}`;
  fireBrowserEvent('trackCustom', 'FormStart', {}, eventId);
  const userData = await getStoredIdentity();
  await fireCAPIEvent('FormStart', eventId, userData, {
    value: 0,
    content_category: 'checkout',
  });
}

export async function fireAddToCart(data: {
  packageName: string;
  amount: number;
  email?: string;
  phone?: string;
}): Promise<void> {
  const eventId = `atc_${Date.now()}`;
  fireBrowserEvent('track', 'AddToCart', {
    value: Number(data.amount) || 0,
    currency: 'NGN',
    content_type: 'product',
    content_name: data.packageName,
  }, eventId);
  const userData = await buildUserData({
    email: data.email,
    phone: data.phone,
  });
  await fireCAPIEvent('AddToCart', eventId, userData, {
    value: Number(data.amount) || 0,
    content_name: data.packageName,
  });
}

export async function fireInitiateCheckout(data: {
  packageName: string;
  amount: number;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}): Promise<void> {
  const eventId = `ic_${Date.now()}`;
  fireBrowserEvent('track', 'InitiateCheckout', {
    value: Number(data.amount) || 0,
    currency: 'NGN',
    content_type: 'product',
    content_name: data.packageName,
  }, eventId);
  const userData = await buildUserData({
    email: data.email,
    phone: data.phone,
    firstName: data.firstName,
    lastName: data.lastName,
  });
  await fireCAPIEvent('InitiateCheckout', eventId, userData, {
    value: Number(data.amount) || 0,
    content_name: data.packageName,
  });
}

export function resetTracking(): void {
  browserFired.clear();
  capiFired.clear();
  leadSyncFired = false;
}
