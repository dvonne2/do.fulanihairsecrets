declare global {
  interface Window {
    fbq?: (...args: unknown[]) => unknown;
    getFbp?: () => string | null;
    getFbc?: () => string | null;
    _fbq?: unknown;
  }
}

import { getExternalId, generateRefCode, saveExternalId } from './externalIdMirroring';

// 🛡️ GLOBAL DEDUPLICATION GUARD: Prevents ANY pixel event from firing more than once
const firedEvents = new Set<string>();

export const PIXEL_ID = '220381209723501';

// CAPI Server-Side Proxy (WordPress PHP)
export const CAPI_PROXY_URL = 'https://apis.fulanihairsecrets.com/meta-capi.php';

// Meta Access Token - NOW HANDLED SERVER-SIDE via PHP proxy
// No client-side access to prevent token exposure

export const WEBHOOK_SECRET = 'fhg_orders_2024_secret';

export const FULANI_API_URL = 'https://script.google.com/macros/s/AKfycbx1dHWosMwJcMNNWQfNEyLZNMI3bbBW9wtFD58l_eP8Uo7A5p755RVBJsCIwAm2syEB/exec';

export const SESSION_KEYS = {
  PAGE_VIEW: 'fhg_pv_fired',
  FORM_START: 'fhg_form_start_fired',
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

export const META_CONTENT_CATEGORY = 'Hair Care, Hair Product';

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
    SESSION_KEYS.FORM_START,
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
  orderId?: string;
}

export function isPixelReady(): boolean {
  return typeof window !== 'undefined' && typeof window.fbq === 'function';
}

export function waitForPixel(timeout = 3000): Promise<boolean> {
  console.log('[Pixel] Waiting for fbq to be ready...');
  return new Promise((resolve) => {
    if (isPixelReady()) {
      console.log('[Pixel] fbq is already ready');
      resolve(true);
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (isPixelReady()) {
        clearInterval(checkInterval);
        console.log('[Pixel] fbq became ready after', Date.now() - startTime, 'ms');
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        console.warn('[Pixel] Timeout waiting for fbq to be ready after', timeout, 'ms');
        console.log('[Pixel] Window object:', typeof window, 'fbq exists:', typeof window?.fbq);
        resolve(false);
      }
    }, 100);
  });
}

// 🎯 10/10 EMQ: Cookie reading functions for Facebook Browser ID and Click ID
export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue || undefined;
  }
  return undefined;
}

export function getFacebookBrowserId(): string | undefined {
  const fbp = getCookie('_fbp');
  if (fbp) {
    console.log('[EMQ 10/10] 🎯 Facebook Browser ID found:', fbp);
    return fbp;
  }
  console.log('[EMQ 10/10] ⚠️ Facebook Browser ID not found');
  return undefined;
}

export function getFacebookClickId(): string | undefined {
  const fbc = getCookie('_fbc');
  if (fbc) {
    console.log('[EMQ 10/10] 🎯 Facebook Click ID found:', fbc);
    return fbc;
  }
  console.log('[EMQ 10/10] ⚠️ Facebook Click ID not found');
  return undefined;
}

// 🎯 10/10 EMQ: Session enrichment - pull stored PII from localStorage
export function getStoredIdentity(): any {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem('fulani_captured_identity');
    if (stored) {
      const identity = JSON.parse(stored);
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
      
      if (Date.now() - identity.timestamp < thirtyDaysInMs) {
        console.log('[EMQ 10/10] 🎯 Session enrichment loaded:', {
          hasEmail: !!identity.email,
          hasPhone: !!identity.phone,
          hasExternalId: !!identity.external_id,
          daysRemaining: Math.round((thirtyDaysInMs - (Date.now() - identity.timestamp)) / (24 * 60 * 60 * 1000))
        });
        return identity;
      }
    }
  } catch (error) {
    console.warn('[EMQ 10/10] Failed to load stored identity:', error);
  }
  
  return null;
}

// 🎯 10/10 EMQ: Get client IP and User Agent for server-side matching
export function getClientInfo(): { ip?: string; userAgent?: string } {
  if (typeof window === 'undefined') return {};
  
  // Note: IP address is typically sent from server-side
  // For client-side, we can use a fallback or leave it for server
  const userAgent = navigator.userAgent;
  
  console.log('[EMQ 10/10] 🎯 Client info collected:', {
    userAgent: userAgent.substring(0, 100) + '...',
    hasIP: false // IP should be added server-side
  });
  
  return { userAgent };
}

export function firePixelEvent(
  eventName: string,
  params: Record<string, unknown> = {},
  eventId?: string
): boolean {
  // 🛡️ GLOBAL DEDUP: Block duplicate events at the source (keyed on event name only)
  const eventKey = `track_${eventName}`;
  if (firedEvents.has(eventKey)) {
    console.warn(`[Pixel] 🛡️ Blocked duplicate track: ${eventName}`, { eventKey });
    return false;
  }
  firedEvents.add(eventKey);

  if (!isPixelReady()) {
    console.warn('[Pixel] fbq not ready (track skipped):', eventName);
    return false;
  }

  // 🎯 Deterministic Identity Mirroring: Get external_id for Pixel events
  let externalId: string | undefined;
  try {
    externalId = getExternalId();
    console.log('[Identity Mirroring] 📱 Pixel External ID:', externalId);
  } catch (error) {
    console.warn('[Identity Mirroring] ⚠️ Could not get external ID for Pixel:', error);
  }

  const eventParams = { 
    ...params, 
    ...(eventId && { eventID: eventId }),
    // 🎯 Add external_id to Pixel for perfect parity with CAPI
    ...(externalId && { external_id: externalId })
  };

  try {
    window.fbq('track', eventName, eventParams, { eventID: eventId || undefined });
    console.log('[Identity Mirroring] 🎯 Pixel event fired with external_id:', {
      eventName,
      eventId,
      externalId,
      hasExternalId: !!externalId
    });
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
  // 🛡️ GLOBAL DEDUP: Block duplicate custom events at the source (keyed on event name only)
  const eventKey = `trackCustom_${eventName}`;
  if (firedEvents.has(eventKey)) {
    console.warn(`[Pixel] 🛡️ Blocked duplicate trackCustom: ${eventName}`, { eventKey });
    return false;
  }
  firedEvents.add(eventKey);

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

/**
 * Update pixel with advanced matching parameters
 * This should be called when user data becomes available
 */
export async function updatePixelWithAdvancedMatching(userData: UserData): Promise<void> {
  if (!isPixelReady()) {
    console.warn('[Pixel] Cannot update advanced matching - pixel not ready');
    return;
  }

  try {
    const { createEnhancedMatchingData, extractNameParts, extractLocationData } = await import('./enhancedMatching');
    
    // Extract name parts from full name
    const { firstName, lastName } = extractNameParts(userData.fullName);
    
    // Extract location data from address components
    const { city, zipCode } = extractLocationData(userData.address, userData.state, userData.lga);
    
    // Create enhanced matching data
    const enhancedMatching = await createEnhancedMatchingData(
      userData.email,
      userData.phone,
      firstName,
      lastName,
      city,
      userData.state,
      zipCode,
      'NG', // Nigeria country code
      undefined, // Date of birth (not collected)
      userData.orderId, // Use orderId as external ID
      'female' // Target demographic (can be made dynamic)
    );

    // Note: Pixel is already initialized in index.html
    // Advanced matching data is automatically applied to subsequent events
    
    console.log('[Pixel] Advanced matching updated:', {
      hasEmail: !!enhancedMatching.em,
      hasPhone: !!enhancedMatching.ph,
      hasFirstName: !!enhancedMatching.fn,
      hasLastName: !!enhancedMatching.ln,
      hasLocation: !!(enhancedMatching.ct || enhancedMatching.st || enhancedMatching.zp),
      totalFields: Object.keys(enhancedMatching).length
    });
  } catch (error) {
    console.error('[Pixel] Failed to update advanced matching:', error);
  }
}

export async function sendToCAPI(
  eventType: 'addtocart' | 'initiatecheckout' | 'purchase' | 'custom',
  eventId: string,
  userData: UserData,
  customData: Record<string, any>
): Promise<void> {
  try {
    console.log('[EMQ 10/10] 🎯 Starting enhanced CAPI send for:', eventType);
    
    // 🎯 1-Day Attribution: Get Facebook cookies with persistence
    const { getStoredFBC, captureAndStoreFBC, sendImmediateCAPI, isInOneDayWindow } = await import('./oneDayAttribution');
    
    const fbp = getFacebookBrowserId();
    const fbc = getStoredFBC() || captureAndStoreFBC(); // Priority: stored > new > null
    
    // 🎯 Check if user is in 1-day attribution window
    const inOneDayWindow = isInOneDayWindow();
    console.log('[1-Day Attribution] ⏰ Attribution window status:', {
      inWindow: inOneDayWindow,
      hasFBC: !!fbc,
      hasFBP: !!fbp
    });
  
  // 🎯 10/10 EMQ: Session enrichment - pull stored PII from localStorage
  const storedIdentity = getStoredIdentity();
  
  // � Invisible Bridge: Get rehydrated identity for automatic cross-device stitching
  const { getStoredPIIForRehydration } = await import('./invisibleBridge');
  const rehydratedPII = getStoredPIIForRehydration();
  
  console.log('[Invisible Bridge] 🔄 Rehydrated PII available:', {
    hasEmail: !!rehydratedPII.email,
    hasPhone: !!rehydratedPII.phone,
    hasExternalId: !!rehydratedPII.externalId,
    ageHours: rehydratedPII.age ? Math.round(rehydratedPII.age / (1000 * 60 * 60)) : undefined
  });
  
  // � 10/10 EMQ: Get client fingerprint (IP + User Agent) for perfect browser matching
  const { getEnhancedClientFingerprint } = await import('./clientFingerprint');
  const clientFingerprint = await getEnhancedClientFingerprint();
  
  // Create enhanced matching data for better CAPI performance
  const { 
    createEnhancedMatchingData, 
    extractNameParts, 
    extractLocationData, 
    classifyWealthLevel, 
    classifySalaryEarner,
    createGranularCityData,
    createWealthFlags
  } = await import('./enhancedMatching');
  
  // 🎯 10/10 EMQ: Enrich userData with stored identity (session enrichment)
  const enrichedUserData = {
    ...userData,
    // Prioritize current form data, fallback to stored identity
    email: userData.email || storedIdentity?.email,
    phone: userData.phone || storedIdentity?.phone,
    fullName: userData.fullName || '', // Could be stored in future
    // Use external_id from stored identity if not provided
    orderId: userData.orderId || storedIdentity?.external_id
  };
  
  // Extract name parts from full name
  const { firstName, lastName } = extractNameParts(enrichedUserData.fullName);
  
  // 🎯 10/10 EMQ: Auto-inject postal code for premium areas
  const { getAutoInjectedPostalCode, getGranularCityWithPostal } = await import('./postalCodeMapping');
  
  // Get auto-injected postal code for high-wealth areas
  const autoInjectedZip = getAutoInjectedPostalCode(
    enrichedUserData.state,
    enrichedUserData.lga,
    enrichedUserData.address,
    undefined // neighborhood could be extracted from address
  );
  
  // 🎯 10/10 EMQ: Create granular city data with postal code context
  const { city: granularCity, hasPremiumPostal, postalCode: premiumPostalCode } = getGranularCityWithPostal(
    enrichedUserData.state,
    enrichedUserData.lga,
    enrichedUserData.address,
    undefined
  );
  
  // Extract location data from address components
  const { city, zipCode } = extractLocationData(enrichedUserData.address, enrichedUserData.state, enrichedUserData.lga);
  
  // 🎯 Priority: Auto-injected zip > user zip > extracted zip
  const finalZipCode = autoInjectedZip || zipCode || premiumPostalCode || '';
  
  console.log('[EMQ 10/10] 🎯 Postal code injection applied:', {
    userZip: zipCode,
    autoInjectedZip,
    premiumPostalCode,
    finalZipCode,
    hasPremiumPostal,
    granularCity
  });
  
  // Classify wealth level for premium targeting
  const wealthClassification = classifyWealthLevel(enrichedUserData.state, enrichedUserData.lga, enrichedUserData.address, zipCode);
  
  // 🎯 10/10 EMQ: Create wealth flags for custom data enrichment
  const wealthFlags = createWealthFlags(
    enrichedUserData.state,
    enrichedUserData.lga,
    enrichedUserData.address,
    zipCode
  );
  
  // 🎯 Location-Based Wealth Tiering: Premium area detection
  const { createLocationWealthData } = await import('./locationWealthTiering');
  const locationWealthData = createLocationWealthData(
    enrichedUserData.state,
    enrichedUserData.lga,
    enrichedUserData.address,
    undefined // neighborhood could be extracted from address
  );
  
  console.log('[EMQ 10/10] 🎯 Location wealth tiering applied:', {
    locationWealthData,
    detectedTier: locationWealthData.tier_name,
    isPrime: locationWealthData.is_prime_location
  });
  
  // Classify salary earner timing for month-end targeting
  const salaryClassification = classifySalaryEarner();
  
  // � Invisible Bridge: Prioritize rehydrated PII for automatic cross-device matching
  const prioritizedEmail = rehydratedPII.email || enrichedUserData.email;
  const prioritizedPhone = rehydratedPII.phone || enrichedUserData.phone;
  const prioritizedExternalId = rehydratedPII.externalId || enrichedUserData.orderId || storedIdentity?.external_id;
  
  // �� 10/10 EMQ: Create enhanced matching data with rehydrated PII priority
  const enhancedMatching = await createEnhancedMatchingData(
    prioritizedEmail,    // 🌉 Prioritize rehydrated email
    prioritizedPhone,    // 🌉 Prioritize rehydrated phone
    firstName,
    lastName,
    granularCity, // 🎯 Use granular city data instead of basic city
    enrichedUserData.state,
    finalZipCode, // 🎯 Use auto-injected zip code for premium areas
    'NG', // Nigeria country code
    undefined, // Date of birth (not collected)
    prioritizedExternalId, // 🌉 Prioritize rehydrated external ID
    'female' // Target demographic (can be made dynamic)
  );
  
  console.log('[Invisible Bridge] 🎯 PII prioritization applied:', {
    originalEmail: enrichedUserData.email,
    rehydratedEmail: rehydratedPII.email,
    finalEmail: prioritizedEmail,
    originalPhone: enrichedUserData.phone,
    rehydratedPhone: rehydratedPII.phone,
    finalPhone: prioritizedPhone,
    usedRehydratedPII: !!(rehydratedPII.email || rehydratedPII.phone)
  });
  
  console.log('[EMQ 10/10] 🎯 Location enrichment applied:', {
    basicCity: city,
    granularCity,
    wealthFlags,
    hasPremiumNeighborhood: granularCity.includes(',') && !granularCity.includes(enrichedUserData.state || '')
  });
  
  console.log('[EMQ 10/10] 🎯 Enhanced matching data created:', {
    hasEmail: !!enhancedMatching.em,
    hasPhone: !!enhancedMatching.ph,
    hasCity: !!enhancedMatching.ct,
    hasState: !!enhancedMatching.st,
    hasZip: !!enhancedMatching.zp,
    hasCountry: !!enhancedMatching.country,
    hasFBP: !!fbp,
    hasFBC: !!fbc,
    hasExternalId: !!(enrichedUserData.orderId || storedIdentity?.external_id)
  });

  // Map event types to Meta's standard event names
  const metaEventType = eventType === 'addtocart' ? 'AddToCart' :
                        eventType === 'initiatecheckout' ? 'InitiateCheckout' :
                        eventType === 'purchase' ? 'Purchase' :
                        customData?.custom_event_name || customData?.eventName || customData?.event_name || 'CustomEvent';

  // Build Meta CAPI payload in correct format
  const payload = {
    data: [{
      event_name: metaEventType,
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_id: eventId,
      user_data: {
        // 🎯 10/10 EMQ: Enhanced matching data (hashed)
        ...enhancedMatching,
        
        // 🎯 10/10 EMQ: Facebook Browser ID and Click ID (high priority)
        fbp: fbp,
        fbc: fbc,
        
        // 🎯 10/10 EMQ: Client fingerprint for perfect browser matching
        client_ip_address: clientFingerprint.client_ip_address,
        client_user_agent: clientFingerprint.client_user_agent,
        
        // 🎯 10/10 EMQ: Deterministic Identity Mirroring - Primary external_id
        external_id: (() => {
          let externalId = getExternalId();
          
          // Fallback: Generate new external ID if none exists
          if (!externalId) {
            externalId = generateRefCode();
            saveExternalId(externalId);
            console.log('[Identity Mirroring] 🔧 Generated fallback External ID:', externalId);
          }
          
          console.log('[Identity Mirroring] 🎯 CAPI External ID:', externalId);
          return externalId;
        })(),
      },
      custom_data: {
        // Standard Meta custom data fields
        currency: 'NGN',
        value: customData.totalAmount || customData.value || 0,
        content_type: 'product',
        content_ids: (() => { try { return customData.content_ids ? JSON.parse(customData.content_ids) : []; } catch { return []; } })(),
        content_name: customData.content_name || 'Fulani Hair Gro',
        content_category: META_CONTENT_CATEGORY,
        // Custom event-specific data
        ...customData,
        
        // 🎯 10/10 EMQ: Location-Based Wealth Tiering for Custom Conversions
        is_prime_location: locationWealthData.is_prime_location,
        area_wealth_tier: locationWealthData.area_wealth_tier,
        location_priority: locationWealthData.location_priority,
        tier_name: locationWealthData.tier_name,
        
        // 🎯 Additional location metadata for advanced targeting
        is_lagos: locationWealthData.is_lagos,
        is_abuja: locationWealthData.is_abuja,
        is_port_harcourt: locationWealthData.is_ph,
        is_kano: locationWealthData.is_kano,
        is_oyo: locationWealthData.is_oyo,
        
        // 🎯 Postal code injection tracking for EMQ optimization
        has_premium_postal_code: hasPremiumPostal,
        postal_code_injected: !!autoInjectedZip,
        postal_code_source: autoInjectedZip ? 'auto_injected' : (zipCode ? 'user_input' : 'none'),
        
        // Legacy wealth flagging (for backward compatibility)
        is_high_net_worth_area: wealthFlags.is_high_net_worth_area,
        
        // Legacy wealth classification (for backward compatibility)
        is_wealthy_area: wealthClassification.isWealthyArea,
        area_tier: wealthClassification.areaTier,
        is_lagos_island: wealthClassification.isLagosIsland,
        is_lagos_mainland: wealthClassification.isLagosMainland,
        is_abuja_legacy: wealthClassification.isAbuja, // Renamed to avoid conflict
        
        // Whale detection: high-value order >= ₦200,000
        is_whale: (customData.totalAmount || customData.value || 0) >= 200000,
        
        // Salary earner timing signals for month-end targeting & lookalike audiences
        is_salary_window: salaryClassification.is_salary_window,
        salary_timing: salaryClassification.salary_timing,
        is_quarter_end: salaryClassification.is_quarter_end,
        month_period: salaryClassification.month_period,
        day_of_month: salaryClassification.day_of_month,
        purchase_month: salaryClassification.purchase_month
      }
    }],
  };

  // Verify CAPI event accuracy
  const { trackingVerifier } = await import('./trackingVerifier');
  trackingVerifier.verifyCAPIEvent(eventType, eventId, payload);

  // Debug: Log the actual payload being sent
  console.log('[CAPI] DEBUG - Full Meta payload:', JSON.stringify(payload, null, 2));

  try {
    // Send to PHP proxy (server-side handles token and IP)
    const proxyPayload = {
      event_name: metaEventType,
      event_id: eventId,
      event_time: Math.floor(Date.now() / 1000),
      event_source_url: window.location.href,
      user_data: payload.data[0].user_data,
      custom_data: payload.data[0].custom_data
    };

    const response = await fetch(CAPI_PROXY_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(proxyPayload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`CAPI Proxy returned ${response.status}: ${errorText}`);
    }
    
    const responseData = await response.json();
    
    // Log success for debugging
    console.log('[CAPI] ✅ Event sent via PHP proxy successfully:', { 
      eventType: metaEventType,
      eventId,
      endpoint: CAPI_PROXY_URL,
      response: responseData,
      enhancedFields: {
        hasHashedEmail: !!enhancedMatching.em,
        hasHashedPhone: !!enhancedMatching.ph,
        hasHashedFirstName: !!enhancedMatching.fn,
        hasHashedLastName: !!enhancedMatching.ln,
        hasLocation: !!(enhancedMatching.ct || enhancedMatching.st || enhancedMatching.zp),
        totalEnhancedFields: Object.keys(enhancedMatching).length
      },
      userData: { ...userData, email: userData.email ? '***' : undefined } 
    });
  } catch (error) {
    console.error('[CAPI] ❌ Proxy send failed:', { 
      eventType: metaEventType, 
      eventId, 
      endpoint: CAPI_PROXY_URL,
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
  } catch (error) {
    console.error('[CAPI] Unexpected error:', error);
  }
}

// 🎯 AUTOMATION: Bulletproof Price Map for 100% Automatic Tracking
export const PRICE_MAP: Record<string, number> = {
  'FAMILY SAVES': 215000, // 🐋 Ultra Whale Package
  'SELF LOVE PLUS B2GOF': 66750, // 🎯 Premium Whale Package
  'SELF LOVE B2GOF': 52750, // 🐋 Standard Whale Package
  'SELF LOVE RETURN': 42750, // 📈 Return Customer Package
  'SELF LOVE PLUS': 32750, // 🎯 Baseline Package
  'Fulani Hair Gro': 32750, // 🎯 Default Fallback
};

// Legacy compatibility
export const PACKAGE_PRICES = PRICE_MAP;

export function getPackagePrice(packageName: string): number {
  // 🎯 AUTOMATION: Bulletproof price resolution with fallback
  const price = PRICE_MAP[packageName];
  if (price) {
    console.log('[Price Map] 🎯 Automatic price resolution:', {
      package: packageName,
      price,
      whaleTier: price >= 215000 ? 'Ultra Whale' : 
                 price >= 66750 ? 'Premium Whale' : 'Standard'
    });
    return price;
  }
  
  console.warn('[Price Map] ⚠️ Package not found, using fallback:', packageName);
  return 32750; // Safe fallback
}
