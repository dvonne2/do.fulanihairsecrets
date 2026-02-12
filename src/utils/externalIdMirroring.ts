/**
 * 🎯 Deterministic Identity Mirroring - The "Secret Sauce"
 * Uses external_id as the primary key for bulletproof attribution
 */

// 🔑 Generate unique Ref Code (external_id)
export function generateRefCode(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8);
  const refCode = `${timestamp}_${random}`;
  
  console.log('[Identity Mirroring] 🔑 Generated Ref Code:', refCode);
  return refCode;
}

// 💾 Save external_id to localStorage with 30-day expiry
export function saveExternalId(refCode: string): void {
  try {
    const externalIdData = {
      refCode: refCode,
      timestamp: Date.now(),
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
      source: 'generated'
    };
    
    localStorage.setItem('meta_external_id', JSON.stringify(externalIdData));
    
    console.log('[Identity Mirroring] 💾 External ID saved:', {
      refCode,
      expiresAt: new Date(externalIdData.expiresAt).toISOString()
    });
  } catch (error) {
    console.error('[Identity Mirroring] ❌ Failed to save external ID:', error);
  }
}

// 🔄 Get stored external_id from localStorage
export function getStoredExternalId(): string | null {
  try {
    const stored = localStorage.getItem('meta_external_id');
    if (!stored) return null;
    
    const externalIdData = JSON.parse(stored);
    
    // Check if expired
    if (Date.now() > externalIdData.expiresAt) {
      localStorage.removeItem('meta_external_id');
      console.log('[Identity Mirroring] ⏰ External ID expired, removed from storage');
      return null;
    }
    
    console.log('[Identity Mirroring] 🔄 Retrieved stored External ID:', {
      refCode: externalIdData.refCode,
      source: externalIdData.source,
      age: ((Date.now() - externalIdData.timestamp) / (1000 * 60 * 60)).toFixed(1) + ' hours'
    });
    
    return externalIdData.refCode;
  } catch (error) {
    console.error('[Identity Mirroring] ❌ Failed to get stored external ID:', error);
    return null;
  }
}

// 🔗 Update external_id from Magic Link or abandoned cart URL
export function updateExternalIdFromURL(): string | null {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const refParam = urlParams.get('ref') || urlParams.get('external_id') || urlParams.get('ref_code');
    
    if (refParam) {
      // Update localStorage with new external_id
      const externalIdData = {
        refCode: refParam,
        timestamp: Date.now(),
        expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
        source: 'url_parameter'
      };
      
      localStorage.setItem('meta_external_id', JSON.stringify(externalIdData));
      
      console.log('[Identity Mirroring] 🔗 External ID updated from URL:', {
        refCode: refParam,
        source: 'url_parameter',
        url: window.location.href
      });
      
      return refParam;
    }
    
    return null;
  } catch (error) {
    console.error('[Identity Mirroring] ❌ Failed to update external ID from URL:', error);
    return null;
  }
}

// 🎯 Get or generate external_id (primary identity key)
export function getExternalId(): string {
  // First, try to update from URL (Magic Link priority)
  const urlRef = updateExternalIdFromURL();
  if (urlRef) {
    return urlRef;
  }
  
  // Then, try to get stored external_id
  const storedRef = getStoredExternalId();
  if (storedRef) {
    return storedRef;
  }
  
  // Finally, generate new external_id
  const newRef = generateRefCode();
  saveExternalId(newRef);
  return newRef;
}

// 🔍 Validate external_id format
export function validateExternalId(refCode: string): boolean {
  // Check if it matches our expected format: timestamp_random
  const pattern = /^\d{13}_[a-z0-9]{6}$/;
  const isValid = pattern.test(refCode);
  
  console.log('[Identity Mirroring] 🔍 External ID validation:', {
    refCode,
    isValid,
    pattern: 'timestamp_random (e.g., 1707321120_abc123)'
  });
  
  return isValid;
}

// 📊 Log external_id for debugging and verification
export function logExternalId(context: string, refCode?: string): void {
  const externalId = refCode || getExternalId();
  
  console.log(`[Identity Mirroring] ${context} External ID set to: ${externalId}`);
  
  // Additional debugging info
  const stored = localStorage.getItem('meta_external_id');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      console.log('[Identity Mirroring] 📊 External ID details:', {
        refCode: data.refCode,
        source: data.source,
        timestamp: new Date(data.timestamp).toISOString(),
        expiresAt: new Date(data.expiresAt).toISOString(),
        remainingHours: ((data.expiresAt - Date.now()) / (1000 * 60 * 60)).toFixed(1)
      });
    } catch (error) {
      console.error('[Identity Mirroring] ❌ Failed to parse stored external ID data:', error);
    }
  }
}

// 🔄 Initialize external_id system
export function initializeExternalIdSystem(): string {
  console.log('[Identity Mirroring] 🚀 Initializing Deterministic Identity Mirroring...');
  
  // Check for URL parameter first (Magic Link priority)
  const urlRef = updateExternalIdFromURL();
  
  // Get or generate external_id
  const externalId = urlRef || getStoredExternalId() || generateRefCode();
  
  // Save if newly generated
  if (!urlRef && !getStoredExternalId()) {
    saveExternalId(externalId);
  }
  
  // Log initialization
  console.log('[Identity Mirroring] 🎯 External ID system initialized:', {
    externalId,
    source: urlRef ? 'url_parameter' : (getStoredExternalId() ? 'stored' : 'generated'),
    timestamp: new Date().toISOString()
  });
  
  return externalId;
}

// 🔗 External ID consistency validator
export function validateExternalIdConsistency(expectedRef?: string): boolean {
  const currentRef = getExternalId();
  const isConsistent = !expectedRef || currentRef === expectedRef;
  
  console.log('[Identity Mirroring] 🔗 External ID consistency check:', {
    currentRef,
    expectedRef,
    isConsistent,
    timestamp: new Date().toISOString()
  });
  
  if (!isConsistent && expectedRef) {
    console.warn('[Identity Mirroring] ⚠️ External ID mismatch detected!', {
      expected: expectedRef,
      current: currentRef
    });
  }
  
  return isConsistent;
}

// 🎯 External ID for Pixel events (frontend)
export function getPixelExternalId(): string {
  const externalId = getExternalId();
  
  console.log('[Identity Mirroring] 📱 Pixel External ID:', externalId);
  
  return externalId;
}

// 🎯 External ID for CAPI events (server-side)
export function getCAPIExternalId(): string {
  const externalId = getExternalId();
  
  console.log('[Identity Mirroring] 🖥️ CAPI External ID:', externalId);
  
  return externalId;
}

// 🔄 External ID session bridge
export function bridgeExternalIdAcrossSessions(): void {
  // This function ensures external_id persists across browser sessions
  const externalId = getExternalId();
  
  console.log('[Identity Mirroring] 🌉 External ID session bridge:', {
    externalId,
    sessionId: externalId.split('_')[0],
    timestamp: new Date().toISOString()
  });
}

// 📊 External ID analytics for debugging
export function getExternalIdAnalytics(): {
  externalId: string;
  source: string;
  age: number;
  isValid: boolean;
  remainingHours: number;
} | null {
  try {
    const stored = localStorage.getItem('meta_external_id');
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    const now = Date.now();
    
    return {
      externalId: data.refCode,
      source: data.source,
      age: now - data.timestamp,
      isValid: validateExternalId(data.refCode),
      remainingHours: (data.expiresAt - now) / (1000 * 60 * 60)
    };
  } catch (error) {
    console.error('[Identity Mirroring] ❌ Failed to get external ID analytics:', error);
    return null;
  }
}
