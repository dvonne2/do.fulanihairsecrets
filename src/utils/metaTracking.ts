// src/utils/metaTracking.ts
// Complete Meta Pixel + CAPI tracking — single file, zero dependencies

import { CAPI_ENDPOINT } from '@/config/api';

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    __pvEventId?: string;
  }
}

// ============================================
// PERSISTENT DEDUP — survives page reloads
// ============================================
const DEDUP_STORAGE_KEY = 'fhg_meta_dedup';
const DEDUP_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours — same user, same day = 1 event

function loadDedup(): Set<string> {
  try {
    const raw = localStorage.getItem(DEDUP_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Date.now() < parsed.expiresAt) {
        return new Set<string>(parsed.keys);
      }
      localStorage.removeItem(DEDUP_STORAGE_KEY);
    }
  } catch {}
  return new Set<string>();
}

function saveDedup(set: Set<string>): void {
  try {
    localStorage.setItem(
      DEDUP_STORAGE_KEY,
      JSON.stringify({
        keys: Array.from(set),
        expiresAt: Date.now() + DEDUP_TTL_MS,
      })
    );
  } catch {}
}

let dedupSet = loadDedup();

// Blanket-blocked events: these event names should never fire again (e.g. recovery links)
const blanketBlocked = new Set<string>();

function hasFired(key: string): boolean {
  if (dedupSet.has(key)) return true;
  // Check blanket block: if key starts with any blocked prefix (e.g. "browser_FormStart")
  for (const blocked of blanketBlocked) {
    if (key.startsWith(blocked)) return true;
  }
  return false;
}

function markFired(key: string): void {
  dedupSet.add(key);
  saveDedup(dedupSet);
}

// ============================================
// IDENTITY-BASED EVENT IDs — deterministic dedup
// ============================================
// Uses SHA-256 of (eventName + identity) so Browser + CAPI always
// send the SAME event_id. Meta deduplicates them as one event.
let _sessionSeed: string | null = null;
function getSessionSeed(): string {
  if (_sessionSeed) return _sessionSeed;
  try {
    const stored = localStorage.getItem('fhg_session_seed');
    if (stored) { _sessionSeed = stored; return stored; }
  } catch {}
  _sessionSeed = Math.random().toString(36).slice(2);
  try { localStorage.setItem('fhg_session_seed', _sessionSeed); } catch {}
  return _sessionSeed;
}

async function makeEventId(eventName: string, identity?: string): Promise<string> {
  const seed = identity || getSessionSeed();
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
  eventId: string
): void {
  // Use eventId in dedup key so different orders can fire but same order can't double-fire
  const key = `browser_${eventName}_${eventId}`;
  if (hasFired(key)) {
    console.log(`[Meta] Browser skip duplicate (persisted): ${eventName} [${eventId}]`);
    return;
  }
  if (typeof window.fbq !== 'function') {
    console.warn(`[Meta] fbq not loaded, skipping: ${eventName}`);
    return; // Don't markFired — pixel may load later and event should retry
  }
  markFired(key);
  
  // Fire on existing pixel (Media Buyer 1)
  window.fbq(type, eventName, data, { eventID: eventId });
  
  // Fire on second pixel (Media Buyer 2) — trackSingle keeps it isolated
  window.fbq('trackSingle', '2709676702727852', eventName, data, { eventID: eventId });
  
  console.log(`[Meta] Browser ${type}: ${eventName}`, data, `eventID=${eventId}`);
  console.log(`[Meta] Second pixel fired: ${eventName}`, data, `eventID=${eventId}`);
}

async function fireCAPIEvent(
  eventName: string,
  eventId: string,
  userData: Record<string, any>,
  customData: Record<string, any>
): Promise<void> {
  // Use eventId in dedup key so different orders can fire but same order can't double-fire
  const key = `capi_${eventName}_${eventId}`;
  if (hasFired(key)) {
    console.log(`[Meta] CAPI skip duplicate (persisted): ${eventName} [${eventId}]`);
    return;
  }
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
        event_source_url: window.location.origin + window.location.pathname,
        user_data: userData,
        custom_data: {
          ...customData,
          currency: 'NGN',
        },
      }),
    });
    if (!res.ok) {
      throw new Error(`CAPI request failed: HTTP ${res.status}`);
    }
    const result = await res.json();
    markFired(key);
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
  // Guard: only fire once per order, even across page refreshes
  const thankYouKey = `fhg_ty_fired_${order.orderId}`;
  try {
    if (sessionStorage.getItem(thankYouKey)) {
      console.log('[Meta] Thank-you events already fired for order:', order.orderId, '— skipping');
      return;
    }
    sessionStorage.setItem(thankYouKey, '1');
  } catch {}
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

  // 1. PURCHASE — Fire separately on each pixel to avoid duplication
  const purchaseEventId = await makeEventId('Purchase', order.orderId);
  const purchaseData = {
    value: amount,
    currency: 'NGN',
    content_name: order.packageName || 'Fulani Hair Gro',
    content_type: 'product',
    order_id: order.orderId
  };
  
  // Fire on original pixel (220381209723501) with CAPI
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Purchase', purchaseData, { eventID: purchaseEventId });
    console.log('[Meta] Original pixel Purchase fired:', purchaseData, `eventID=${purchaseEventId}`);
  }
  
  // Fire CAPI for original pixel only
  await fireCAPIEvent('Purchase', purchaseEventId, userData, {
    value: amount,
    content_name: order.packageName || 'Fulani Hair Gro',
    content_type: 'product',
  });
  
  // Fire on second pixel (2709676702727852) without CAPI - clean browser-only event
  if (typeof window.fbq === 'function') {
    window.fbq('trackSingle', '2709676702727852', 'Purchase', purchaseData, { eventID: purchaseEventId });
    console.log('[Meta] Second pixel Purchase fired:', purchaseData, `eventID=${purchaseEventId}`);
  }

  // 2. VALUE-BASED EVENT — fires ONLY from Apps Script CAPI
  console.log('[Meta] Value event handled by Apps Script CAPI');

  // 3. HIGH VALUE PURCHASE — fires ONLY from Apps Script CAPI
  console.log('[Meta] High Value Purchase handled by Apps Script CAPI');

  // CompleteRegistration removed - belongs on signup/lead pages, not order confirmation

  console.log('[Meta] Thank-you events complete (Purchase only)');
}

let leadSyncFired = false;

export async function fireLeadSync(info: {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}): Promise<void> {
  console.log('[Meta] fireLeadSync called:', { info, leadSyncFired });
  
  if (leadSyncFired) {
    console.log('[Meta] LeadSync already fired, skipping');
    return;
  }
  if (!info.email && !info.phone) {
    console.log('[Meta] LeadSync: No email or phone provided, skipping');
    return;
  }
  
  leadSyncFired = true;
  console.log('[Meta] LeadSync: Proceeding with event firing');
  
  const userData = await buildUserData(info);
  const identity = info.phone || info.email || '';
  const eventId = await makeEventId('LeadSync', identity);
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

export async function fireFormStart(): Promise<boolean> {
  if (typeof window.fbq !== 'function') {
    console.warn('[Meta] fbq not loaded yet, FormStart will retry on next keystroke');
    return false;
  }
  const eventId = await makeEventId('FormStart');
  fireBrowserEvent('trackCustom', 'FormStart', {}, eventId);
  const userData = await getStoredIdentity();
  await fireCAPIEvent('FormStart', eventId, userData, {
    value: 0,
    content_category: 'checkout',
  });
  return true;
}

export async function firePageViewCAPI(): Promise<void> {
  const eventId = window.__pvEventId || '';
  if (!eventId) {
    console.warn('[Meta] No PageView event_id found, skipping CAPI');
    return;
  }
  const key = `capi_PageView_${eventId}`;
  if (hasFired(key)) {
    console.log('[Meta] CAPI skip duplicate PageView');
    return;
  }
  const userData = await getStoredIdentity();
  const fbp = getFbp();
  const fbc = getFbc();
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;
  try {
    const res = await fetch(CAPI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: 'PageView',
        event_id: eventId,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: window.location.origin + window.location.pathname,
        user_data: userData,
        custom_data: { currency: 'NGN' },
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    markFired(key);
    console.log('[Meta] CAPI PageView sent, eventID=' + eventId);
  } catch (err) {
    console.error('[Meta] CAPI PageView error:', err);
  }
}

export async function fireAddToCart(data: {
  packageName: string;
  amount: number;
  email?: string;
  phone?: string;
}): Promise<void> {
  const identity = data.phone || data.email || '';
  const eventId = await makeEventId('AddToCart', identity);
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
  const identity = data.phone || data.email || '';
  const eventId = await makeEventId('InitiateCheckout', identity);
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

export async function fireCartRecovery(data: {
  orderId: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  packageName?: string;
  amount?: number;
}): Promise<void> {
  const eventId = await makeEventId('CartRecovery', data.orderId);
  fireBrowserEvent('trackCustom', 'CartRecovery', {
    value: Number(data.amount) || 0,
    currency: 'NGN',
    content_category: 'abandoned_cart',
    content_name: data.packageName || 'Fulani Hair Gro',
    order_id: data.orderId,
  }, eventId);
  const userData = await buildUserData({
    email: data.email,
    phone: data.phone,
    firstName: data.firstName,
    lastName: data.lastName,
    externalId: data.orderId,
  });
  await fireCAPIEvent('CartRecovery', eventId, userData, {
    value: Number(data.amount) || 0,
    content_category: 'abandoned_cart',
    content_name: data.packageName || 'Fulani Hair Gro',
    order_id: data.orderId,
  });
  console.log('[Meta] CartRecovery fired for order:', data.orderId);
}

/**
 * Pre-mark events as already fired so recovery sessions don't duplicate them.
 * Call this when restoring a recovery link to prevent FormStart/LeadSync/AddToCart
 * from re-firing with the pre-filled data.
 */
export function markEventsAsFired(events: string[]): void {
  for (const event of events) {
    // Blanket-block these event names so no future eventId variant can fire
    blanketBlocked.add(`browser_${event}`);
    blanketBlocked.add(`capi_${event}`);
  }
  if (events.includes('LeadSync')) {
    leadSyncFired = true;
  }
  console.log('[Meta] Blanket-blocked events (persisted):', events);
}

export function resetTracking(): void {
  dedupSet.clear();
  saveDedup(dedupSet);
  leadSyncFired = false;
  _sessionSeed = null;
  try { localStorage.removeItem('fhg_session_seed'); } catch {}
  try { localStorage.removeItem(DEDUP_STORAGE_KEY); } catch {}
}
