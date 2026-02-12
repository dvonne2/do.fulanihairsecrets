// Enhanced matching parameters for Meta CAPI
// Improves match quality and increases reported conversions

export interface EnhancedMatchingData {
  em?: string;           // Hashed email (SHA256)
  ph?: string;           // Hashed phone (SHA256)
  ge?: string;           // Gender
  db?: string;           // Date of birth (YYYYMMDD)
  ln?: string;           // Last name (SHA256)
  fn?: string;           // First name (SHA256)
  ct?: string;           // City
  st?: string;           // State
  zp?: string;           // Zip code
  country?: string;      // Country code
  external_id?: string;  // External ID (SHA256)
  client_ip_address?: string;  // Client IP address
  client_user_agent?: string;  // Client user agent
}

/**
 * Hash a string using SHA256 (normalized and lowercase)
 */
export async function hashString(input: string): Promise<string> {
  if (!input || typeof input !== 'string') {
    return '';
  }

  try {
    // Normalize the input: trim whitespace, convert to lowercase
    const normalized = input.trim().toLowerCase();
    
    // Use Web Crypto API for SHA256 hashing
    const encoder = new TextEncoder();
    const data = encoder.encode(normalized);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
  } catch (error) {
    console.warn('[Hashing] Failed to hash string:', error);
    return '';
  }
}

/**
 * Get client IP address (with fallbacks)
 */
export async function getClientIPAddress(): Promise<string> {
  try {
    // Try multiple IP detection services in order of preference
    const ipServices = [
      'https://api.ipify.org?format=json',
      'https://ipapi.co/ip/',
      'https://api.ip.sb/ip',
      'https://icanhazip.com'
    ];

    for (const service of ipServices) {
      try {
        const response = await fetch(service);
        if (response.ok) {
          const data = await response.text();
          const ip = data.trim();
          
          // Validate IP format (basic IPv4/IPv6 validation)
          if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^[0-9a-fA-F:]+$/.test(ip)) {
            console.log('[Enhanced Matching] Client IP detected:', ip);
            return ip;
          }
        }
      } catch (serviceError) {
        console.warn(`[Enhanced Matching] IP service ${service} failed:`, serviceError);
        continue;
      }
    }

    console.warn('[Enhanced Matching] All IP services failed, using fallback');
    return '';
  } catch (error) {
    console.error('[Enhanced Matching] Failed to get client IP:', error);
    return '';
  }
}

/**
 * Get client user agent
 */
export function getClientUserAgent(): string {
  try {
    const userAgent = navigator.userAgent;
    console.log('[Enhanced Matching] User agent:', userAgent);
    return userAgent;
  } catch (error) {
    console.error('[Enhanced Matching] Failed to get user agent:', error);
    return '';
  }
}

/**
 * Create enhanced matching data for CAPI events
 */
export async function createEnhancedMatchingData(
  email?: string,
  phone?: string,
  firstName?: string,
  lastName?: string,
  city?: string,
  state?: string,
  zipCode?: string,
  country?: string,
  dateOfBirth?: string,
  externalId?: string,
  gender?: string
): Promise<EnhancedMatchingData> {
  const enhancedData: EnhancedMatchingData = {};

  try {
    // Hashed email (most important for matching)
    if (email && email.trim()) {
      enhancedData.em = await hashString(email);
      console.log('[Enhanced Matching] Email hashed successfully');
    }

    // Hashed phone number with E.164 standardization for maximum Facebook matching
    if (phone && phone.trim()) {
      // Remove non-digit characters for consistent hashing
      let cleanPhone = phone.replace(/\D/g, '');
      
      // 🎯 E.164 Standardization for Nigeria: +234 format
      if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
        // Convert 08012345678 → 2348012345678
        cleanPhone = '234' + cleanPhone.substring(1);
        console.log('[Enhanced Matching] Phone standardized to E.164:', cleanPhone);
      } else if (cleanPhone.startsWith('234') && cleanPhone.length === 13) {
        // Already in E.164 format: 2348012345678
        console.log('[Enhanced Matching] Phone already in E.164 format:', cleanPhone);
      } else if (cleanPhone.startsWith('2340') && cleanPhone.length === 14) {
        // Remove extra 0: 23408012345678 → 2348012345678
        cleanPhone = '234' + cleanPhone.substring(4);
        console.log('[Enhanced Matching] Phone corrected from 2340 format:', cleanPhone);
      }
      
      // Validate Nigerian phone number length (should be 13 digits in E.164)
      if (cleanPhone.length === 13 && cleanPhone.startsWith('234')) {
        enhancedData.ph = await hashString(cleanPhone);
        console.log('[Enhanced Matching] Phone hashed successfully with E.164 standardization');
      } else {
        console.warn('[Enhanced Matching] Invalid Nigerian phone format:', phone, '→', cleanPhone);
      }
    }

    // Hashed first name
    if (firstName && firstName.trim()) {
      enhancedData.fn = await hashString(firstName);
      console.log('[Enhanced Matching] First name hashed successfully');
    }

    // Hashed last name
    if (lastName && lastName.trim()) {
      enhancedData.ln = await hashString(lastName);
      console.log('[Enhanced Matching] Last name hashed successfully');
    }

    // Hashed external ID
    if (externalId && externalId.trim()) {
      enhancedData.external_id = await hashString(externalId);
      console.log('[Enhanced Matching] External ID hashed successfully');
    }

    // Location data (MUST be SHA256 hashed per Meta requirements)
    if (city && city.trim()) {
      enhancedData.ct = await hashString(city);
      console.log('[Enhanced Matching] City hashed successfully');
    }

    if (state && state.trim()) {
      enhancedData.st = await hashString(state);
      console.log('[Enhanced Matching] State hashed successfully');
    }

    if (zipCode && zipCode.trim()) {
      enhancedData.zp = await hashString(zipCode);
      console.log('[Enhanced Matching] Zip code hashed successfully');
    }

    if (country && country.trim()) {
      enhancedData.country = await hashString(country);
      console.log('[Enhanced Matching] Country hashed successfully');
    }

    // Demographics (MUST be SHA256 hashed per Meta requirements)
    if (gender && gender.trim()) {
      enhancedData.ge = await hashString(gender.trim().toLowerCase());
      console.log('[Enhanced Matching] Gender hashed successfully');
    }

    if (dateOfBirth && dateOfBirth.trim()) {
      // Ensure YYYYMMDD format then hash
      const cleanDob = dateOfBirth.replace(/\D/g, '');
      if (cleanDob.length === 8) {
        enhancedData.db = await hashString(cleanDob);
        console.log('[Enhanced Matching] Date of birth hashed successfully');
      }
    }

    // Client information (IP and User Agent)
    const [clientIP, clientUA] = await Promise.allSettled([
      getClientIPAddress(),
      Promise.resolve(getClientUserAgent())
    ]);

    if (clientIP.status === 'fulfilled' && clientIP.value) {
      enhancedData.client_ip_address = clientIP.value;
    }

    if (clientUA.status === 'fulfilled' && clientUA.value) {
      enhancedData.client_user_agent = clientUA.value;
    }

    console.log('[Enhanced Matching] Enhanced data created:', {
      hasEmail: !!enhancedData.em,
      hasPhone: !!enhancedData.ph,
      hasFirstName: !!enhancedData.fn,
      hasLastName: !!enhancedData.ln,
      hasIP: !!enhancedData.client_ip_address,
      hasUserAgent: !!enhancedData.client_user_agent,
      hasLocation: !!(enhancedData.ct || enhancedData.st || enhancedData.zp),
      totalFields: Object.keys(enhancedData).length
    });

    return enhancedData;

  } catch (error) {
    console.error('[Enhanced Matching] Failed to create enhanced data:', error);
    return enhancedData; // Return whatever we have
  }
}

/**
 * Extract name parts from full name
 */
export function extractNameParts(fullName?: string): { firstName?: string; lastName?: string } {
  if (!fullName || typeof fullName !== 'string') {
    return { firstName: '', lastName: '' };
  }

  try {
    const parts = fullName.trim().split(/\s+/);
    
    if (parts.length === 1) {
      // Only one name, treat as first name
      return { firstName: parts[0], lastName: '' };
    } else if (parts.length === 2) {
      // First and last name
      return { firstName: parts[0], lastName: parts[1] };
    } else {
      // Multiple names, first is first name, last is last name
      return { firstName: parts[0], lastName: parts[parts.length - 1] };
    }
  } catch (error) {
    console.error('[Enhanced Matching] Failed to extract name parts:', error);
    return { firstName: '', lastName: '' };
  }
}

/**
 * 🎯 10/10 EMQ: Create granular city data for precise geotargeting
 * Combines Neighborhood/LGA with City for maximum Meta relevance
 */
export function createGranularCityData(
  lga?: string,
  address?: string,
  state?: string
): string {
  const normalizedLga = (lga || '').trim();
  const normalizedAddress = (address || '').trim();
  const normalizedState = (state || '').trim();
  
  // Extract specific neighborhood from address if available
  let neighborhood = '';
  if (normalizedAddress) {
    const addressParts = normalizedAddress.toLowerCase().split(/[\s,]+/);
    
    // Check for premium neighborhoods in address
    const premiumNeighborhoods = [
      'banana island', 'ikoyi', 'victoria island', 'eko atlantic',
      'lekki phase 1', 'lekki phase 2', 'ajah', 'chevy view',
      'maitama', 'asokoro', 'guzape', 'jabi', 'garki',
      'magodo phase 2', 'ikeja gra', 'victoria garden city', 'vgc'
    ];
    
    for (const part of addressParts) {
      if (premiumNeighborhoods.some(n => part.includes(n) || n.includes(part))) {
        neighborhood = part;
        break;
      }
    }
  }
  
  // Priority order: Neighborhood > LGA > State
  if (neighborhood && normalizedState) {
    return `${neighborhood}, ${normalizedState}`;
  } else if (normalizedLga && normalizedState) {
    return `${normalizedLga}, ${normalizedState}`;
  } else if (normalizedState) {
    return normalizedState;
  }
  
  return 'Nigeria'; // Fallback
}

/**
 * 🎯 10/10 EMQ: Create wealth flagging for custom data enrichment
 * Returns premium area flags for Meta Custom Audience targeting
 */
export function createWealthFlags(
  state?: string,
  lga?: string,
  address?: string,
  zipCode?: string
): {
  is_prime_location: boolean;
  area_wealth_tier: 'ultra_premium' | 'premium' | 'upper_middle' | 'middle' | 'budget';
  is_high_net_worth_area: boolean;
  location_priority: 'highest' | 'high' | 'medium' | 'low';
} {
  const wealthClassification = classifyWealthLevel(state, lga, address, zipCode);
  
  // Map area tier to priority levels
  const priorityMap = {
    'ultra_premium': 'highest' as const,
    'premium': 'high' as const,
    'upper_middle': 'medium' as const,
    'middle': 'low' as const,
    'budget': 'low' as const
  };
  
  return {
    is_prime_location: wealthClassification.isWealthyArea,
    area_wealth_tier: wealthClassification.areaTier,
    is_high_net_worth_area: wealthClassification.areaTier === 'ultra_premium' || wealthClassification.areaTier === 'premium',
    location_priority: priorityMap[wealthClassification.areaTier]
  };
}

/**
 * Classify area by wealth level based on Nigerian postal codes and LGAs
 */
export function classifyWealthLevel(
  state?: string,
  lga?: string,
  address?: string,
  zipCode?: string
): { 
  isWealthyArea: boolean; 
  areaTier: 'ultra_premium' | 'premium' | 'upper_middle' | 'middle' | 'budget';
  isLagosIsland: boolean;
  isLagosMainland: boolean;
  isAbuja: boolean;
} {
  const normalizedState = (state || '').toLowerCase().trim();
  const normalizedLga = (lga || '').toLowerCase().trim();
  const normalizedAddress = (address || '').toLowerCase().trim();
  const normalizedZip = (zipCode || '').trim();

  // Default classification
  const result = {
    isWealthyArea: false,
    areaTier: 'middle' as 'ultra_premium' | 'premium' | 'upper_middle' | 'middle' | 'budget',
    isLagosIsland: false,
    isLagosMainland: false,
    isAbuja: false
  };

  // Ultra Premium Areas - 🏝️ Nigerian Elite Locations (Comprehensive Keyword Net)
  const ultraPremiumAreas = [
    // Core Lagos Island areas
    'banana island', 'ikoyi', 'victoria island', 'eko atlantic',
    'lake ewe', 'yanokwaja',
    
    // Banana Island variations
    'banana is', 'banana island estate', 'banana island lagos',
    
    // Victoria Island variations  
    'v.i.', 'vi', 'victoria island lagos', 'v.i lagos',
    
    // Ikoyi variations
    'ikoyi crescent', 'ikoyi lagos', 'old ikoyi', 'new ikoyi',
    
    // Lekki variations
    'lekki phase 1', 'lekki phase 2', 'lekki ph 1', 'lekki ph 2',
    'lekki scheme 1', 'lekki scheme 2', 'lekki lagos',
    
    // Other Lagos premium areas
    'ajah', 'chevy view', 'chevron view', 'parkview estate',
    'victoria garden city', 'eko atlantic city', 'vgc',
    'orchid', 'orchid road', 'orchid estate',
    
    // Abuja Ultra Premium
    'maitama', 'asokoro', 'guzape', 'wuse 2', 'wuse ii',
    'maitama district', 'asokoro district', 'guzape district',
    
    // Lagos Mainland Ultra Premium
    'magodo phase 2', 'magodo phase ii', 'magodo gra phase 2',
    'ikeja gra', 'ikeja g.r.a', 'ikeja g.r.a.',
    
    // Ultra Premium Estates (address keyword check)
    'nicon town', 'nicon luxury', 'carlton gate',
    'carlton gate estate', 'ocean parade', 'ocean parade towers',
    'four points', 'eko pearl', 'eko pearl towers',
    'bella vista', 'the pearl', 'shoreline estate',
    'pinnock estate', 'pinnock beach', 'osborne foreshore',
    'osborne phase 1', 'osborne phase 2'
  ];
  
  // Premium Areas  
  const premiumAreas = [
    'ikeja', 'vi', 'v.i.', 'lekki', 'ikate', 'oshopa',
    'magodo', 'magodo phase 1', 'ogudu gra', 'ogudu',
    'anthony', 'maryland', 'illupeju',
    
    // Abuja Premium
    'garki', 'garki 2', 'jabi', 'utako', 'life camp',
    'gwarinpa', 'katampe', 'wuye',
    
    // Lagos Mainland Premium
    'gbagada', 'gbagada phase 2', 'omole phase 1', 'omole phase 2',
    'ojodu berger', 'isheri'
  ];

  // Upper Middle Areas
  const upperMiddleAreas = [
    'surulere', 'yaba', 'fadeyi', 'onipanu', 'somolu', 'bariga',
    'ketu', 'mushin', 'oshodi', 'isolo', 'egbe', 'ikotun'
  ];

  // Check for wealth indicators
  const hasUltraPremium = ultraPremiumAreas.some(area => 
    normalizedAddress.includes(area) || 
    normalizedLga.includes(area) ||
    normalizedState.includes(area)
  );

  const hasPremium = premiumAreas.some(area => 
    normalizedAddress.includes(area) || 
    normalizedLga.includes(area)
  );

  const hasUpperMiddle = upperMiddleAreas.some(area => 
    normalizedAddress.includes(area) || 
    normalizedLga.includes(area)
  );

  // Postal code classification for Lagos
  const isLagos = normalizedState.includes('lagos');
  const zipPrefix = normalizedZip.substring(0, 3);
  
  // Lagos Island postal codes (premium areas)
  const islandZipPrefixes = ['101', '100', '106', '107'];
  // Lagos Mainland postal codes (mixed areas)
  const mainlandZipPrefixes = ['100', '234', '200', '201'];
  
  const isAbuja = normalizedState.includes('abuja') || normalizedState.includes('fct');
  
  if (isLagos) {
    result.isLagosIsland = islandZipPrefixes.includes(zipPrefix);
    result.isLagosMainland = mainlandZipPrefixes.includes(zipPrefix);
  }
  
  if (isAbuja) {
    result.isAbuja = true;
  }

  // Determine wealth tier
  if (hasUltraPremium || result.isLagosIsland) {
    result.isWealthyArea = true;
    result.areaTier = 'ultra_premium';
  } else if (hasPremium) {
    result.isWealthyArea = true;
    result.areaTier = 'premium';
  } else if (hasUpperMiddle) {
    result.areaTier = 'upper_middle';
  } else {
    result.areaTier = 'middle';
  }

  console.log('[Wealth Classification]', {
    state: normalizedState,
    lga: normalizedLga,
    zipCode: normalizedZip,
    result
  });

  return result;
}

/**
 * Get location data from address components
 */
export function extractLocationData(
  address?: string,
  state?: string,
  lga?: string
): { city?: string; state?: string; zipCode?: string } {
  const locationData: { city?: string; state?: string; zipCode?: string } = {};

  try {
    // Use provided state
    if (state && state.trim()) {
      locationData.state = state.trim();
    }

    // Extract city from LGA or address
    if (lga && lga.trim()) {
      locationData.city = lga.trim();
    } else if (address && address.trim()) {
      // Try to extract city from address (first part before comma)
      const addressParts = address.split(',');
      if (addressParts.length > 0) {
        locationData.city = addressParts[0].trim();
      }
    }

    // Extract zip code from address (Nigerian postal codes are 6 digits)
    if (address && address.trim()) {
      const zipMatch = address.match(/\b(\d{6})\b/);
      if (zipMatch) {
        locationData.zipCode = zipMatch[1];
      }
    }

    console.log('[Enhanced Matching] Location data extracted:', locationData);
    return locationData;

  } catch (error) {
    console.error('[Enhanced Matching] Failed to extract location data:', error);
    return locationData;
  }
}

/**
 * Classify if a purchase is likely from a salary earner based on timing patterns.
 * 
 * Salary earner signals:
 * - Purchases on 26th-end of month through 1st-5th of following month (salary window)
 * - Quarterly patterns (end of March, June, September, December)
 * - Combined with other behavioral signals (prepaid, premium area)
 */
export function classifySalaryEarner(
  purchaseDate?: Date
): {
  is_salary_window: boolean;
  salary_timing: 'salary_window' | 'mid_month' | 'unknown';
  is_quarter_end: boolean;
  month_period: 'early' | 'mid' | 'late';
  day_of_month: number;
  purchase_month: number;
} {
  const now = purchaseDate || new Date();
  const dayOfMonth = now.getDate();
  const month = now.getMonth() + 1; // 1-12
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  // Salary window: 26th to end of month AND 1st to 5th of following month (wrap-around)
  const isSalaryWindow = dayOfMonth >= 26 || dayOfMonth <= 5;

  // Quarter end months: March (3), June (6), September (9), December (12)
  const quarterEndMonths = [3, 6, 9, 12];
  const isQuarterEnd = quarterEndMonths.includes(month) && dayOfMonth >= 20;

  // Month period classification
  let monthPeriod: 'early' | 'mid' | 'late';
  if (dayOfMonth <= 7) {
    monthPeriod = 'early';
  } else if (dayOfMonth <= 20) {
    monthPeriod = 'mid';
  } else {
    monthPeriod = 'late';
  }

  // Salary timing classification
  let salaryTiming: 'salary_window' | 'mid_month' | 'unknown';
  if (isSalaryWindow) {
    salaryTiming = 'salary_window';
  } else {
    salaryTiming = 'mid_month';
  }

  console.log('[Salary Earner] Classification:', {
    dayOfMonth,
    month,
    isSalaryWindow,
    salaryTiming,
    isQuarterEnd,
    monthPeriod
  });

  return {
    is_salary_window: isSalaryWindow,
    salary_timing: salaryTiming,
    is_quarter_end: isQuarterEnd,
    month_period: monthPeriod,
    day_of_month: dayOfMonth,
    purchase_month: month
  };
}

export default {
  createEnhancedMatchingData,
  hashString,
  getClientIPAddress,
  getClientUserAgent,
  extractNameParts,
  extractLocationData,
  classifySalaryEarner
};
