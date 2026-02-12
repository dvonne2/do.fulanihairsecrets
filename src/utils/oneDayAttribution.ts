/**
 * 🎯 1-Day Attribution Machine
 * Optimized for maximum signal density and speed in Meta's 24-hour attribution window
 */

// 🚀 FBC Persistence - Store Click ID for 30 days
export function captureAndStoreFBC(): string | null {
  try {
    // Check URL for fbclid parameter first
    const urlParams = new URLSearchParams(window.location.search);
    const fbclid = urlParams.get('fbclid');
    
    if (fbclid) {
      // Format as Meta _fbc string: "fb.1.{timestamp}.{fbclid}"
      const timestamp = Date.now().toString();
      const fbcString = `fb.1.${timestamp}.${fbclid}`;
      
      // Store in localStorage for 30 days
      const fbcData = {
        fbc: fbcString,
        timestamp: timestamp,
        fbclid: fbclid,
        expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
      };
      
      localStorage.setItem('meta_fbc_data', JSON.stringify(fbcData));
      
      console.log('[1-Day Attribution] 🎯 FBC captured and stored:', {
        fbc: fbcString,
        expiresAt: new Date(fbcData.expiresAt).toISOString()
      });
      
      return fbcString;
    }
    
    // Check if we have existing FBC in storage
    const storedFBC = getStoredFBC();
    if (storedFBC) {
      console.log('[1-Day Attribution] 🔄 Using stored FBC:', storedFBC);
      return storedFBC;
    }
    
    return null;
  } catch (error) {
    console.error('[1-Day Attribution] ❌ FBC capture failed:', error);
    return null;
  }
}

// 🔄 Get stored FBC from localStorage
export function getStoredFBC(): string | null {
  try {
    const stored = localStorage.getItem('meta_fbc_data');
    if (!stored) return null;
    
    const fbcData = JSON.parse(stored);
    
    // Check if expired
    if (Date.now() > fbcData.expiresAt) {
      localStorage.removeItem('meta_fbc_data');
      console.log('[1-Day Attribution] ⏰ FBC expired, removed from storage');
      return null;
    }
    
    return fbcData.fbc;
  } catch (error) {
    console.error('[1-Day Attribution] ❌ Failed to get stored FBC:', error);
    return null;
  }
}

// ⚡ Immediate CAPI Execution - No batching delays
export function sendImmediateCAPI(
  eventType: string,
  eventId: string,
  userData: any,
  customData: any
): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    
    // Fire immediately - no setTimeout, no batching
    fetch('https://fulanihairsecrets.com/meta-capi.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_name: eventType,
        event_id: eventId,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: window.location.href,
        user_data: userData,
        custom_data: customData
      })
    })
    .then(response => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.log(`[1-Day Attribution] ⚡ CAPI sent in ${duration.toFixed(2)}ms:`, {
        eventType,
        eventId,
        success: response.ok
      });
      
      if (!response.ok) {
        throw new Error(`CAPI failed: ${response.status}`);
      }
      
      resolve();
    })
    .catch(error => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.error(`[1-Day Attribution] ❌ CAPI failed in ${duration.toFixed(2)}ms:`, error);
      reject(error);
    });
  });
}

// 🎯 Early Identification - LeadSync with full identity
export function triggerEarlyIdentification(
  email: string,
  phone: string,
  externalId: string,
  locationData: any
): Promise<void> {
  const eventId = generateEventId('lead');
  
  // Full user_data for immediate identification
  const userData = {
    // Hashed identity (will be hashed by caller)
    em: email,
    ph: phone,
    external_id: externalId,
    
    // Critical for 1-day attribution
    fbp: getFacebookBrowserId(),
    fbc: getStoredFBC() || captureAndStoreFBC(),
    
    // Location data for wealth targeting
    ct: locationData.city,
    st: locationData.state,
    zp: locationData.zipCode,
    country: 'NG'
  };
  
  // Enhanced custom data for bidding engine
  const customData = {
    custom_event_name: 'LeadSync',
    lead_type: 'early_identification',
    capture_timestamp: Date.now(),
    
    // 🎯 Wealth signals for immediate bidding
    area_wealth_tier: locationData.area_wealth_tier,
    is_prime_location: locationData.is_prime_location,
    location_priority: locationData.location_priority,
    
    // 🎯 Salary window timing
    is_salary_window: locationData.is_salary_window,
    salary_timing: locationData.salary_timing,
    
    // 🎯 Priority indicators
    is_high_value_lead: locationData.is_prime_location,
    conversion_probability: locationData.is_prime_location ? 'high' : 'medium'
  };
  
  console.log('[1-Day Attribution] 🎯 Triggering early identification:', {
    eventId,
    hasEmail: !!email,
    hasPhone: !!phone,
    hasFBC: !!userData.fbc,
    wealthTier: locationData.area_wealth_tier
  });
  
  return sendImmediateCAPI('custom', eventId, userData, customData);
}

// 🔄 Get Facebook Browser ID
function getFacebookBrowserId(): string | null {
  try {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === '_fbp') {
        return value;
      }
    }
    return null;
  } catch (error) {
    console.error('[1-Day Attribution] ❌ Failed to get FBP:', error);
    return null;
  }
}

// 🎲 Generate Event ID
function generateEventId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// 🎯 Location-Value Pairing for Checkout events
export function enhanceCheckoutWithLocation(
  baseCustomData: any,
  locationData: any
): any {
  return {
    ...baseCustomData,
    
    // 🎯 Wealth tier for bidding optimization
    area_wealth_tier: locationData.area_wealth_tier,
    is_prime_location: locationData.is_prime_location,
    location_priority: locationData.location_priority,
    
    // 🎯 Salary window for month-end targeting
    is_salary_window: locationData.is_salary_window,
    salary_timing: locationData.salary_timing,
    is_quarter_end: locationData.is_quarter_end,
    
    // 🎯 Bidding confidence indicators
    bid_confidence: locationData.is_prime_location ? 'high' : 'medium',
    expected_ltv: locationData.is_prime_location ? 'high' : 'medium',
    
    // 🎯 Urgency signals for 1-day window
    purchase_urgency: locationData.is_salary_window ? 'high' : 'medium',
    conversion_probability: locationData.is_prime_location ? 0.8 : 0.5
  };
}

// 🚀 Initialize 1-Day Attribution System
export function initializeOneDayAttribution(): void {
  console.log('[1-Day Attribution] 🚀 Initializing 1-Day Attribution System...');
  
  // Capture FBC immediately on page load
  const fbc = captureAndStoreFBC();
  
  // Log system status
  console.log('[1-Day Attribution] 📊 System status:', {
    hasFBC: !!fbc,
    hasFBP: !!getFacebookBrowserId(),
    timestamp: new Date().toISOString(),
    attributionWindow: '1-day'
  });
  
  // Set up performance monitoring
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      console.log('[1-Day Attribution] 📈 Attribution session ending');
    });
  }
}

// 🎯 Check if user is in 1-day attribution window
export function isInOneDayWindow(): boolean {
  const fbcData = localStorage.getItem('meta_fbc_data');
  if (!fbcData) return false;
  
  try {
    const data = JSON.parse(fbcData);
    const clickTime = parseInt(data.timestamp);
    const now = Date.now();
    const oneDayInMs = 24 * 60 * 60 * 1000;
    
    const inWindow = (now - clickTime) < oneDayInMs;
    
    console.log('[1-Day Attribution] ⏰ Window check:', {
      inWindow,
      hoursSinceClick: ((now - clickTime) / (60 * 60 * 1000)).toFixed(1),
      clickTime: new Date(clickTime).toISOString()
    });
    
    return inWindow;
  } catch (error) {
    console.error('[1-Day Attribution] ❌ Window check failed:', error);
    return false;
  }
}
