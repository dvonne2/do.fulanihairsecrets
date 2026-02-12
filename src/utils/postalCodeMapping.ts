/**
 * 🎯 10/10 EMQ: High-Wealth Postal Code Registry
 * Auto-injects specific 6-digit codes for premium Nigerian areas
 */

// 📍 High-Wealth Postal Code Mapping
export const POSTAL_CODE_MAP: Record<string, Record<string, string>> = {
  lagos: {
    // Ultra-Premium Lagos Areas
    'banana island': '101233',
    'ikoyi': '101233', 
    'victoria island': '101241',
    'vi': '101241',
    'v.i.': '101241',
    'lekki phase 1': '105102',
    'lekki ph1': '105102',
    'lekki phase 2': '105102',
    'lekki': '105102',
    'eko atlantic': '101241',
    'eko atlantic city': '101241',
    'parkview estate': '101233',
    'chevy view': '101233',
    'chevron view': '101233',
    'ajah': '105102',
    'vgc': '105102',
    'victoria garden city': '105102',
    
    // Premium Lagos Areas  
    'ikeja gra': '100271',
    'ikeja government residential area': '100271',
    'ikeja': '100271',
    'magodo phase 1': '100248',
    'magodo phase 2': '100248',
    'magodo': '100248',
    'shangisha': '100248',
    'isheri': '100248',
    'omole phase 1': '100214',
    'omole phase 2': '100214',
    'omole': '100214',
    'oregun': '100271',
    'alausa': '100271'
  },
  
  abuja: {
    // Ultra-Premium Abuja Areas
    'maitama': '900271',
    'asokoro': '900231', 
    'wuse 2': '900288',
    'wuse ii': '900288',
    'guzape': '900104',
    'central business district': '900288',
    'cbd': '900288',
    'three arms zone': '900288',
    
    // Premium Abuja Areas
    'jabi': '900108',
    'jabi lakeside': '900108',
    'katampe': '900108',
    'katampe extension': '900108',
    'karmo': '900108'
  },
  
  rivers: {
    // Port Harcourt Premium Areas
    'old gra': '500272',
    'port harcourt old gra': '500272',
    'gra phase 1': '500272',
    'gra phase 2': '500272', 
    'gra phase 3': '500272',
    'government residential area': '500272',
    'trans amadi gardens': '500272',
    'port harcourt': '500272'
  },
  
  oyo: {
    // Ibadan Premium Areas
    'bodija estate': '200212',
    'bodija': '200212',
    'agodi gra': '200212',
    'agodi government residential area': '200212',
    'agodi': '200212',
    'ikolaba': '200212',
    'jericho': '200212',
    'ibadan': '200212'
  },
  
  enugu: {
    // Enugu Premium Areas
    'independence layout': '400102',
    'gra': '400102',
    'government residential area': '400102',
    'enugu': '400102'
  },
  
  delta: {
    // Asaba Premium Areas
    'asaba gra': '320213',
    'government residential area': '320213',
    'asaba': '320213'
  }
};

/**
 * 🎯 Auto-inject postal code based on location
 */
export function getAutoInjectedPostalCode(
  state?: string,
  lga?: string, 
  address?: string,
  neighborhood?: string
): string | null {
  const normalizedState = (state || '').toLowerCase().trim();
  const normalizedLGA = (lga || '').toLowerCase().trim();
  const normalizedAddress = (address || '').toLowerCase().trim();
  const normalizedNeighborhood = (neighborhood || '').toLowerCase().trim();
  
  // Check all location strings against postal code map
  const locationStrings = [
    normalizedNeighborhood,
    normalizedLGA,
    normalizedAddress
  ].filter(Boolean);
  
  for (const locationStr of locationStrings) {
    for (const [stateKey, postalMap] of Object.entries(POSTAL_CODE_MAP)) {
      if (normalizedState.includes(stateKey) || stateKey.includes(normalizedState)) {
        for (const [area, postalCode] of Object.entries(postalMap)) {
          if (locationStr.includes(area) || area.includes(locationStr)) {
            console.log('[EMQ 10/10] 🎯 Auto-injected Zip:', {
              postalCode,
              area: locationStr,
              state: normalizedState
            });
            return postalCode;
          }
        }
      }
    }
  }
  
  return null;
}

/**
 * 🎯 Get all postal codes for a state
 */
export function getStatePostalCodes(state?: string): Record<string, string> {
  const normalizedState = (state || '').toLowerCase().trim();
  
  for (const [stateKey, postalMap] of Object.entries(POSTAL_CODE_MAP)) {
    if (normalizedState.includes(stateKey) || stateKey.includes(normalizedState)) {
      return postalMap;
    }
  }
  
  return {};
}

/**
 * 🎯 Check if location has premium postal code
 */
export function hasPremiumPostalCode(
  state?: string,
  lga?: string,
  address?: string,
  neighborhood?: string
): boolean {
  return getAutoInjectedPostalCode(state, lga, address, neighborhood) !== null;
}

/**
 * 🎯 Get granular city data with postal code context
 */
export function getGranularCityWithPostal(
  state?: string,
  lga?: string,
  address?: string,
  neighborhood?: string
): { city: string; hasPremiumPostal: boolean; postalCode?: string } {
  const normalizedState = (state || '').trim();
  const normalizedLGA = (lga || '').trim();
  const normalizedNeighborhood = (neighborhood || '').trim();
  const normalizedAddress = (address || '').trim();
  
  // Extract specific neighborhood from address if available
  let detectedNeighborhood = '';
  if (normalizedAddress) {
    const addressParts = normalizedAddress.toLowerCase().split(/[\s,]+/);
    
    // Check for premium neighborhoods in address
    const premiumNeighborhoods = [
      'banana island', 'ikoyi', 'victoria island', 'eko atlantic',
      'lekki phase 1', 'lekki phase 2', 'ajah', 'chevy view',
      'maitama', 'asokoro', 'wuse 2', 'guzape', 'jabi',
      'magodo phase 2', 'ikeja gra', 'victoria garden city', 'vgc'
    ];
    
    for (const part of addressParts) {
      if (premiumNeighborhoods.some(n => part.includes(n) || n.includes(part))) {
        detectedNeighborhood = part;
        break;
      }
    }
  }
  
  // Priority order: Neighborhood > LGA > State
  let city = '';
  if (detectedNeighborhood && normalizedState) {
    city = `${detectedNeighborhood}, ${normalizedState}`;
  } else if (normalizedLGA && normalizedState) {
    city = `${normalizedLGA}, ${normalizedState}`;
  } else if (normalizedState) {
    city = normalizedState;
  } else {
    city = 'Nigeria';
  }
  
  // Check for premium postal code
  const postalCode = getAutoInjectedPostalCode(state, lga, address, neighborhood);
  const hasPremiumPostal = postalCode !== null;
  
  console.log('[EMQ 10/10] 🎯 Granular city with postal:', {
    city,
    hasPremiumPostal,
    postalCode,
    detectedNeighborhood
  });
  
  return {
    city,
    hasPremiumPostal,
    postalCode: postalCode || undefined
  };
}
