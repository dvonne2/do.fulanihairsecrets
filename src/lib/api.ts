/**
 * VitalVida Media Buyer Portal — API Client
 *
 * Single source of truth for all backend calls.
 * Handles:
 *  - Base URL configuration
 *  - Session cookie credentials
 *  - Frappe's {message: ...} response unwrapping
 *  - Error normalization
 *  - 401 → redirect to login
 *  - Request timeout
 */

// Base URL — points to the ERPNext backend
const API_BASE = import.meta.env.VITE_ERPNEXT_BASE_URL || (import.meta.env.DEV ? '' : 'https://vitalvida.systemforce.ng');

const DEFAULT_TIMEOUT_MS = 15000;  // 15 seconds

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
  code?: number;
}

/**
 * Generic API caller — handles all Frappe-specific quirks.
 *
 * Usage:
 *   const result = await apiCall<MbProfile>('vitalvida.api.media_buyer.get_mb_profile');
 *   if (result.ok) { setProfile(result.data); }
 *   else { setError(result.error); }
 */
export async function apiCall<T = any>(
  method: string,
  params?: Record<string, any>,
  options?: { httpMethod?: 'GET' | 'POST'; timeout?: number }
): Promise<ApiResponse<T>> {
  const httpMethod = options?.httpMethod || 'POST';
  const timeout = options?.timeout || DEFAULT_TIMEOUT_MS;

  // Build URL
  const url = `${API_BASE}/api/method/${method}`;

  // Build request init
  const init: RequestInit = {
    method: httpMethod,
    credentials: 'include',  // CRITICAL — sends session cookie
    headers: {
      'Content-Type': 'application/json',
      'X-Frappe-CSRF-Token': getCsrfToken() || '',
    },
  };

  if (httpMethod === 'POST' && params) {
    init.body = JSON.stringify(params);
  }

  // Timeout via AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  init.signal = controller.signal;

  try {
    let finalUrl = url;
    if (httpMethod === 'GET' && params) {
      const query = new URLSearchParams(params).toString();
      finalUrl = `${url}?${query}`;
    }

    const response = await fetch(finalUrl, init);
    clearTimeout(timeoutId);

    // Handle 401 — session expired / not authenticated
    if (response.status === 401 || response.status === 403) {
      // Redirect to login page (or trigger logout flow)
      window.location.href = '/login?session_expired=1';
      return { ok: false, error: 'Session expired', code: response.status };
    }

    // Handle non-JSON responses (shouldn't happen but defensive)
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('json')) {
      return {
        ok: false,
        error: `Unexpected response type: ${contentType}`,
        code: response.status,
      };
    }

    const body = await response.json();

    // Frappe error response shape
    if (!response.ok) {
      const errorMsg = body?.message || body?.exception || `HTTP ${response.status}`;
      return { ok: false, error: errorMsg, code: response.status };
    }

    // Frappe success response shape: { message: <actual_data> }
    const data = body?.message;

    // Some Frappe endpoints return errors INSIDE message
    // e.g. { message: { error: "Not authenticated", code: 401 } }
    if (data && typeof data === 'object' && 'error' in data) {
      if (data.code === 401 || data.code === 403) {
        window.location.href = '/login?session_expired=1';
      }
      return { ok: false, error: data.error, code: data.code };
    }

    return { ok: true, data: data as T };

  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return { ok: false, error: 'Request timeout' };
    }
    return { ok: false, error: err?.message || 'Network error' };
  }
}

/**
 * Extract CSRF token from cookie (Frappe sets `csrf_token` cookie on login).
 */
function getCsrfToken(): string | null {
  const match = document.cookie.match(/csrf_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Logout — clears session on backend and redirects.
 */
export async function logout() {
  try {
    await fetch(`${API_BASE}/api/method/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch {}
  window.location.href = '/login';
}
