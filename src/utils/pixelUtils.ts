declare global {
  interface Window {
    fbq?: (...args: unknown[]) => unknown;
    getFbp?: () => string | null;
    getFbc?: () => string | null;
    _fbq?: unknown;
  }
}

export const PIXEL_ID = '220381209723501';

export const FULANI_API_URL =
  'https://script.google.com/macros/s/AKfycbx1dHWosMwJcMNNWQfNEyLZNMI3bbBW9wtFD58l_eP8Uo7A5p755RVBJsCIwAm2syEB/exec';

export const WEBHOOK_SECRET = 'fhg_orders_2024_secret';

export const SESSION_KEYS = {
  PAGE_VIEW: 'fhg_pv_fired',
  ADD_TO_CART: 'fhg_atc_fired',
  INITIATE_CHECKOUT: 'fhg_ic_fired',
  PURCHASE: 'fhg_purchase_fired'
} as const;

export type SessionKey = (typeof SESSION_KEYS)[keyof typeof SESSION_KEYS];

type ProductComponent = 'Shampoo' | 'Pomade' | 'Conditioner';

const PACKAGE_COMPONENTS: Record<string, Partial<Record<ProductComponent, number>>> = {
  'SELF LOVE PLUS': { Shampoo: 1, Pomade: 1, Conditioner: 1 },
  'SELF LOVE RETURN': { Pomade: 3 },
  'SELF LOVE B2GOF': { Shampoo: 3, Pomade: 3 },
  'SELF LOVE PLUS B2GOF': { Shampoo: 3, Pomade: 3, Conditioner: 3 },
  'FAMILY SAVES': { Shampoo: 10, Pomade: 10, Conditioner: 10 },
  'Fulani Hair Gro': { Shampoo: 1, Pomade: 1, Conditioner: 1 }
};

export const META_CONTENT_CATEGORY = 'Hair Care';

export function getProductContentIds(packageName: string): string[] {
  const components = PACKAGE_COMPONENTS[packageName] || PACKAGE_COMPONENTS['Fulani Hair Gro'];
  const ordered: ProductComponent[] = ['Shampoo', 'Pomade', 'Conditioner'];
  return ordered.filter((c) => (components?.[c] ?? 0) > 0).map((c) => `Fulani Hair Gro ${c}`);
}

export function getProductContentName(packageName: string): string {
  const ids = getProductContentIds(packageName);
  if (ids.length === 0) return 'Fulani Hair Gro';

  const names = ids.map((id) => id.replace(/^Fulani Hair Gro\s+/i, ''));
  return [`Fulani Hair Gro ${names[0]}`, ...names.slice(1)].join(', ');
}

export function getProductNumItems(packageName: string): number {
  const components = PACKAGE_COMPONENTS[packageName] || PACKAGE_COMPONENTS['Fulani Hair Gro'];
  const ordered: ProductComponent[] = ['Shampoo', 'Pomade', 'Conditioner'];
  const total = ordered.reduce((sum, c) => sum + (components?.[c] ?? 0), 0);
  return total > 0 ? total : 1;
}

const memorySession: Record<string, string> = {};

function safeSessionGet(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return memorySession[key] ?? null;
  }
}

function safeSessionSet(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    memorySession[key] = value;
  }
}

export function getFbp(): string | null {
  if (typeof window !== 'undefined' && typeof window.getFbp === 'function') {
    return window.getFbp();
  }

  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const trimmed = cookie.trim();
      if (trimmed.startsWith('_fbp=')) {
        return trimmed.substring(5);
      }
    }
  }

  return null;
}

export function getFbc(): string | null {
  if (typeof window !== 'undefined' && typeof window.getFbc === 'function') {
    return window.getFbc();
  }

  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const fbclid = urlParams.get('fbclid');
    if (fbclid) {
      return `fb.1.${Date.now()}.${fbclid}`;
    }
  }

  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const trimmed = cookie.trim();
      if (trimmed.startsWith('_fbc=')) {
        return trimmed.substring(5);
      }
    }
  }

  return null;
}

export function generateEventId(prefix?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 11);
  void prefix;
  return `${timestamp}_${random}`;
}

export function hasEventFired(key: string): boolean {
  if (typeof window === 'undefined') return false;

  return safeSessionGet(key) === 'true';
}

export function markEventFired(key: string): void {
  if (typeof window === 'undefined') return;

  safeSessionSet(key, 'true');
}

export function canFireEvent(eventKey: SessionKey): boolean {
  const order: SessionKey[] = [
    SESSION_KEYS.PAGE_VIEW,
    SESSION_KEYS.ADD_TO_CART,
    SESSION_KEYS.INITIATE_CHECKOUT,
    SESSION_KEYS.PURCHASE
  ];

  const idx = order.indexOf(eventKey);
  if (idx <= 0) return true;

  const prev = order[idx - 1];
  return hasEventFired(prev);
}

export interface UserData {
  fullName?: string;
  email?: string;
  phone?: string;
  state?: string;
  lga?: string;
  address?: string;
}

export function isPixelReady(): boolean {
  return typeof window !== 'undefined' && typeof window.fbq === 'function';
}

export function firePixelEvent(
  eventName: string,
  params: Record<string, unknown> = {},
  eventId?: string
): boolean {
  if (!isPixelReady()) {
    console.warn('[Pixel] fbq not ready (track skipped):', eventName);
    return false;
  }

  const eventParams = eventId ? { ...params, eventID: eventId } : params;

  try {
    window.fbq('track', eventName, eventParams);
    return true;
  } catch (error) {
    console.error('[Pixel] fbq track failed:', { eventName, error });
    return false;
  }
}

export function fireCustomPixelEvent(
  eventName: string,
  params: Record<string, unknown> = {},
  eventId?: string
): boolean {
  if (!isPixelReady()) {
    console.warn('[Pixel] fbq not ready (trackCustom skipped):', eventName);
    return false;
  }

  const eventParams = eventId ? { ...params, eventID: eventId } : params;

  try {
    window.fbq('trackCustom', eventName, eventParams);
    return true;
  } catch (error) {
    console.error('[Pixel] fbq trackCustom failed:', { eventName, error });
    return false;
  }
}

export async function sendToCAPI(
  eventType: 'addtocart' | 'initiatecheckout' | 'purchase',
  eventId: string,
  userData: UserData = {},
  customData: Record<string, unknown> = {}
): Promise<boolean> {
  const payload: Record<string, unknown> = {
    secret: WEBHOOK_SECRET,
    type: eventType,
    eventId,
    fbp: getFbp(),
    fbc: getFbc(),
    customerFullName: userData.fullName || '',
    email: userData.email || '',
    phoneNumber: userData.phone || '',
    state: userData.state || '',
    lga: userData.lga || '',
    fullAddress: userData.address || '',
    ...customData
  };

  const body = new URLSearchParams(
    Object.entries(payload).map(([k, v]) => [k, v == null ? '' : String(v)])
  );

  try {
    await fetch(FULANI_API_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body
    });
    return true;
  } catch {
    return false;
  }
}

export const PACKAGE_PRICES: Record<string, number> = {
  'SELF LOVE PLUS': 32750,
  'SELF LOVE RETURN': 42750,
  'SELF LOVE B2GOF': 52750,
  'SELF LOVE PLUS B2GOF': 66750,
  'FAMILY SAVES': 215000,
  'Fulani Hair Gro': 32750
};

export function getPackagePrice(packageName: string): number {
  return PACKAGE_PRICES[packageName] ?? 32750;
}
