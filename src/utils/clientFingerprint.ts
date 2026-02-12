/**
 * 🎯 10/10 EMQ: Client Fingerprint Collection
 * Captures IP and User Agent for perfect browser matching
 */

// 🌐 Get Client IP Address (Server-side proxy needed for accuracy)
export async function getClientIPAddress(): Promise<string | null> {
  try {
    // Prioritize reliable IP services to avoid rate limiting
    const ipServices = [
      { url: 'https://ipinfo.io/json', timeout: 5000 },  // Most reliable
      { url: 'https://api.ipify.org?format=json', timeout: 3000 },  // Backup
      { url: 'https://httpbin.org/ip', timeout: 3000 }  // Simple fallback
    ];
    
    // Try each service until one succeeds
    for (const service of ipServices) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), service.timeout);
        
        const response = await fetch(service.url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
            'User-Agent': 'Mozilla/5.0 (compatible; FHG-Tracker/1.0)'
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          const ip = data.ip || data.query || data.ip_address || data.origin?.replace('/ip', '');
          
          if (ip && isValidIP(ip)) {
            console.log('[EMQ 10/10] 🌐 Client IP detected:', {
              ip,
              service: service.url.split('/')[2],
              timestamp: new Date().toISOString()
            });
            return ip;
          }
        }
      } catch (error) {
        console.log(`[EMQ 10/10] ⚠️ IP service ${service.url} failed:`, error instanceof Error ? error.name : error);
        continue;
      }
    }
    
    // Fallback: Try to get IP from browser's WebRTC (less reliable but better than nothing)
    const webrtcIP = await getWebRTCIP();
    if (webrtcIP) {
      console.log('[EMQ 10/10] 🌐 WebRTC IP fallback:', webrtcIP);
      return webrtcIP;
    }
    
    // Final fallback: Use a placeholder to prevent empty headers
    console.log('[EMQ 10/10] ⚠️ Could not detect client IP address, using fallback');
    return '0.0.0.0'; // Placeholder that Meta will ignore but won't cause 400 errors
    
  } catch (error) {
    console.error('[EMQ 10/10] ❌ IP detection failed:', error);
    return null;
  }
}

// 🔍 Validate IP address format
function isValidIP(ip: string): boolean {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

// 🌐 WebRTC IP detection (fallback method)
async function getWebRTCIP(): Promise<string | null> {
  return new Promise((resolve) => {
    const rtc = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    };
    
    const pc = new RTCPeerConnection(rtc);
    
    pc.createDataChannel('');
    pc.createOffer()
      .then(offer => pc.setLocalDescription(offer))
      .catch(() => resolve(null));
    
    pc.onicecandidate = (event) => {
      if (event.candidate && event.candidate.candidate) {
        const candidate = event.candidate.candidate;
        const ipMatch = candidate.match(/(\d{1,3}\.){3}\d{1,3}/);
        
        if (ipMatch && isValidIP(ipMatch[0])) {
          resolve(ipMatch[0]);
          pc.close();
        }
      }
    };
    
    // Timeout after 3 seconds
    setTimeout(() => {
      pc.close();
      resolve(null);
    }, 3000);
  });
}

// 🖥️ Get User Agent (Client-side only)
export function getClientUserAgent(): string {
  if (typeof navigator !== 'undefined') {
    const userAgent = navigator.userAgent;
    console.log('[EMQ 10/10] 🖥️ User Agent captured:', {
      userAgent: userAgent.substring(0, 100) + (userAgent.length > 100 ? '...' : ''),
      timestamp: new Date().toISOString()
    });
    return userAgent;
  }
  
  return 'Unknown';
}

// 🎯 Get complete client fingerprint for CAPI
export async function getClientFingerprint(): Promise<{
  client_ip_address?: string;
  client_user_agent?: string;
}> {
  const [clientIP, userAgent] = await Promise.all([
    getClientIPAddress(),
    Promise.resolve(getClientUserAgent())
  ]);
  
  const fingerprint = {
    client_ip_address: clientIP || undefined,
    client_user_agent: userAgent || undefined
  };
  
  console.log('[EMQ 10/10] 🎯 Client fingerprint complete:', {
    hasIP: !!clientIP,
    hasUserAgent: !!userAgent,
    ipSource: clientIP ? 'detected' : 'unavailable',
    timestamp: new Date().toISOString()
  });
  
  return fingerprint;
}

// 🔄 Cache IP address to reduce API calls
let cachedIP: string | null = null;
let ipCacheTime: number = 0;
const IP_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getCachedClientIP(): Promise<string | null> {
  const now = Date.now();
  
  // Return cached IP if still valid
  if (cachedIP && (now - ipCacheTime) < IP_CACHE_DURATION) {
    console.log('[EMQ 10/10] 🔄 Using cached IP:', cachedIP);
    return cachedIP;
  }
  
  // Get fresh IP and cache it
  const freshIP = await getClientIPAddress();
  if (freshIP) {
    cachedIP = freshIP;
    ipCacheTime = now;
  }
  
  return freshIP;
}

// 🎯 Enhanced fingerprint with caching
export async function getEnhancedClientFingerprint(): Promise<{
  client_ip_address?: string;
  client_user_agent?: string;
  ip_source?: string;
  timestamp?: string;
}> {
  const [clientIP, userAgent] = await Promise.all([
    getCachedClientIP(),
    Promise.resolve(getClientUserAgent())
  ]);
  
  const fingerprint = {
    client_ip_address: clientIP || undefined,
    client_user_agent: userAgent || undefined,
    ip_source: clientIP ? 'detected' : 'unavailable',
    timestamp: new Date().toISOString()
  };
  
  console.log('[EMQ 10/10] 🎯 Enhanced client fingerprint:', {
    hasIP: !!clientIP,
    hasUserAgent: !!userAgent,
    ipSource: fingerprint.ip_source,
    timestamp: fingerprint.timestamp
  });
  
  return fingerprint;
}

// 🌍 Get location data from IP (optional enrichment)
export async function getLocationFromIP(ip: string): Promise<{
  country?: string;
  region?: string;
  city?: string;
}> {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      
      const location = {
        country: data.country_code || data.country,
        region: data.region || data.region_name,
        city: data.city
      };
      
      console.log('[EMQ 10/10] 🌍 IP location detected:', {
        ip,
        location,
        timestamp: new Date().toISOString()
      });
      
      return location;
    }
  } catch (error) {
    console.log('[EMQ 10/10] ⚠️ IP location detection failed:', error);
  }
  
  return {};
}
