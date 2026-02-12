/**
 * 🎯 10/10 EMQ: Location-Based Wealth Tiering System
 * Categorizes Nigerian LGAs and neighborhoods for premium Meta targeting
 */

// 🏆 Prime Locations (Billionaires/Ultra-High Net Worth)
export const HIGH_VALUE_LOCATIONS = {
  // Lagos Prime Areas
  lagos: [
    'banana island',
    'ikoyi', 
    'victoria island',
    'v.i.',
    'vi',
    'lekki phase 1',
    'lekki ph 1',
    'eko atlantic',
    'ikeja gra',
    'ikeja government residential area',
    'magodo',
    'magodo phase 1',
    'magodo phase 2',
    'shangisha',
    'isheri',
    'omole phase 1',
    'omole phase 2',
    'omole estate',
    'parkview estate',
    'victoria garden city',
    'vgc',
    'chevy view',
    'chevron view',
    'ajah',
    'lekki scheme 1',
    'lekki scheme 2',
    'eko atlantic city'
  ],
  
  // Abuja Prime Areas
  abuja: [
    'maitama',
    'asokoro',
    'wuse 2',
    'wuse ii',
    'guzape',
    'katampe',
    'katampe extension',
    'jabi lakeside',
    'jabi',
    'central business district',
    'cbd'
  ],
  
  // Port Harcourt Prime Areas
  rivers: [
    'old gra',
    'port harcourt old gra',
    'gra phase 2',
    'gra phase 3',
    'government residential area'
  ],
  
  // Kano Prime Areas
  kano: [
    'nassarawa gra',
    'dala gra',
    'government residential area'
  ],
  
  // Oyo Prime Areas
  oyo: [
    'bodija estate',
    'agodi gra',
    'agodi government residential area',
    'government residential area'
  ]
};

// 🎯 Mid-Tier Locations (High Professionals/Salaried)
export const MID_TIER_LOCATIONS = {
  // Lagos Mid-Tier
  lagos: [
    'gbagada',
    'surulere',
    'maryland',
    'yaba',
    'ajah',
    'sangotedo',
    'ikeja',
    'ikeja town',
    'oshodi',
    'illupeju',
    'anthony',
    'ogudu'
  ],
  
  // Abuja Mid-Tier
  abuja: [
    'gwarinpa',
    'utako',
    'mabushi',
    'life camp',
    'wuye',
    'garki',
    'asokoro extension',
    'karmo'
  ],
  
  // Port Harcourt Mid-Tier
  rivers: [
    'trans-amadi',
    'trans amadi',
    'peter odili road',
    'rumuomasi',
    'rumuola'
  ],
  
  // Kano Mid-Tier
  kano: [
    'badawa',
    'bompai',
    'nassarawa',
    'dala'
  ],
  
  // Oyo Mid-Tier
  oyo: [
    'ikolaba',
    'jericho',
    'bodija',
    'agodi',
    'ibadan'
  ]
};

/**
 * 🎯 Determine wealth tier based on location
 */
export function getLocationWealthTier(
  state?: string,
  lga?: string,
  address?: string,
  neighborhood?: string
): {
  is_prime_location: boolean;
  area_wealth_tier: 'high' | 'mid' | 'standard';
  location_priority: 1 | 2 | 3; // 1 = highest priority
  tier_name: string;
} {
  const normalizedState = (state || '').toLowerCase().trim();
  const normalizedLga = (lga || '').toLowerCase().trim();
  const normalizedAddress = (address || '').toLowerCase().trim();
  const normalizedNeighborhood = (neighborhood || '').toLowerCase().trim();
  
  // Check all location strings against our lists
  const locationStrings = [
    normalizedNeighborhood,
    normalizedLga,
    normalizedAddress
  ].filter(Boolean);
  
  // Check for Prime locations first
  for (const locationStr of locationStrings) {
    for (const [stateKey, primeAreas] of Object.entries(HIGH_VALUE_LOCATIONS)) {
      if (normalizedState.includes(stateKey) || stateKey.includes(normalizedState)) {
        if (primeAreas.some(area => 
          locationStr.includes(area) || area.includes(locationStr)
        )) {
          console.log('[Location Wealth Tier] 🏆 Prime location detected:', locationStr);
          return {
            is_prime_location: true,
            area_wealth_tier: 'high',
            location_priority: 1,
            tier_name: 'Prime (Ultra-High)'
          };
        }
      }
    }
  }
  
  // Check for Mid-Tier locations
  for (const locationStr of locationStrings) {
    for (const [stateKey, midAreas] of Object.entries(MID_TIER_LOCATIONS)) {
      if (normalizedState.includes(stateKey) || stateKey.includes(normalizedState)) {
        if (midAreas.some(area => 
          locationStr.includes(area) || area.includes(locationStr)
        )) {
          console.log('[Location Wealth Tier] 🎯 Mid-tier location detected:', locationStr);
          return {
            is_prime_location: false,
            area_wealth_tier: 'mid',
            location_priority: 2,
            tier_name: 'Mid-Tier (Professional)'
          };
        }
      }
    }
  }
  
  // Default to Standard
  console.log('[Location Wealth Tier] 📍 Standard location detected:', {
    state: normalizedState,
    lga: normalizedLga,
    neighborhood: normalizedNeighborhood
  });
  
  return {
    is_prime_location: false,
    area_wealth_tier: 'standard',
    location_priority: 3,
    tier_name: 'Standard'
  };
}

/**
 * 🎯 Create location-based custom data for Meta events
 */
export function createLocationWealthData(
  state?: string,
  lga?: string,
  address?: string,
  neighborhood?: string
) {
  const wealthTier = getLocationWealthTier(state, lga, address, neighborhood);
  
  return {
    // 🎯 Wealth tiering for Custom Conversions
    is_prime_location: wealthTier.is_prime_location,
    area_wealth_tier: wealthTier.area_wealth_tier,
    location_priority: wealthTier.location_priority,
    tier_name: wealthTier.tier_name,
    
    // 🎯 Location metadata for targeting
    state: state || '',
    lga: lga || '',
    neighborhood: neighborhood || '',
    is_lagos: (state || '').toLowerCase().includes('lagos'),
    is_abuja: (state || '').toLowerCase().includes('abuja'),
    is_ph: (state || '').toLowerCase().includes('port harcourt') || (state || '').toLowerCase().includes('rivers'),
    is_kano: (state || '').toLowerCase().includes('kano'),
    is_oyo: (state || '').toLowerCase().includes('oyo') || (state || '').toLowerCase().includes('ibadan')
  };
}

/**
 * 🎯 Get all prime locations for a specific state (useful for dropdown validation)
 */
export function getPrimeLocationsForState(state?: string): string[] {
  const normalizedState = (state || '').toLowerCase().trim();
  
  for (const [stateKey, locations] of Object.entries(HIGH_VALUE_LOCATIONS)) {
    if (normalizedState.includes(stateKey) || stateKey.includes(normalizedState)) {
      return locations;
    }
  }
  
  return [];
}

/**
 * 🎯 Check if LGA is in a high-value area (for dropdown logic)
 */
export function isHighValueLGA(state?: string, lga?: string): boolean {
  const wealthTier = getLocationWealthTier(state, lga);
  return wealthTier.is_prime_location;
}

/**
 * 🎯 Get recommended neighborhoods for high-value LGAs
 */
export function getHighValueNeighborhoods(state?: string, lga?: string): string[] {
  const normalizedState = (state || '').toLowerCase().trim();
  const normalizedLga = (lga || '').toLowerCase().trim();
  
  // Map LGAs to their high-value neighborhoods
  const lgaToNeighborhoods: Record<string, string[]> = {
    'eti-osa': ['banana island', 'ikoyi', 'victoria island', 'lekki phase 1', 'eko atlantic'],
    'ikeja': ['ikeja gra', 'omole phase 1', 'omole phase 2', 'magodo'],
    'ikeja local government': ['ikeja gra', 'omole phase 1', 'omole phase 2', 'magodo'],
    'amuwo odofin': ['festac', 'satellite town'], // Some premium areas
    'abuja municipal': ['maitama', 'asokoro', 'wuse 2', 'guzape'],
    'bwari': ['katampe', 'katampe extension', 'jabi'],
    'port harcourt': ['old gra', 'gra phase 2', 'gra phase 3'],
    'kano municipal': ['nassarawa gra', 'dala gra'],
    'ibadan north': ['bodija estate', 'agodi gra']
  };
  
  return lgaToNeighborhoods[normalizedLga] || [];
}
