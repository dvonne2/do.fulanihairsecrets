/**
 * 🎯 10/10 EMQ: Client Fingerprint Collection
 * Captures IP and User Agent for perfect browser matching
 */

// 🌐 Get Client IP Address (Server-side proxy needed for accuracy)
export async function getClientIPAddress(): Promise<string | null> {
  // Browser-side IP detection has been disabled.
  // The server-side meta-capi.php endpoint already reads the client IP
  // from incoming request headers, so we no longer call any external
  // IP services from the browser.
  console.log('[EMQ 10/10] 🌐 Skipping client IP detection in browser; using server-side IP instead');
  return null;
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
  // Only capture User Agent from the browser; rely on server for IP.
  const userAgent = getClientUserAgent();
  const fingerprint = {
    client_ip_address: undefined,
    client_user_agent: userAgent || undefined,
    ip_source: 'server_headers',
    timestamp: new Date().toISOString()
  };

  console.log('[EMQ 10/10] 🎯 Enhanced client fingerprint (UA only, no IP lookup):', {
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
  // Browser-side IP geolocation has been disabled to avoid external calls
  // like ipapi.co, ip-api.com, geo.ipify.org, etc. Any IP-based
  // enrichment should be performed server-side using request headers.
  console.log('[Client Fingerprint] 🌍 Skipping IP location lookup in browser for IP:', ip);
  return {};
}
