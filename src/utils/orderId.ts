const CHECKOUT_ATTEMPT_ID_KEY = 'fhg_checkout_attempt_id';
const LEGACY_ORDER_ID_KEY = 'fhg_persistent_order_id';

function clientGenerateOrderId(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const rnd = Math.random().toString(36).slice(2, 7);
  return `${yy}${mm}${dd}${hh}${min}-${rnd}`;
}

/**
 * Reuse the same pending ID for retries of the same unfinished checkout.
 * After a successful order the pending key must be cleared so the next
 * checkout receives a brand-new ID.
 */
export function getCheckoutAttemptId(): string {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const urlOrderId = urlParams.get('orderId');
    if (urlOrderId?.trim()) {
      localStorage.setItem(CHECKOUT_ATTEMPT_ID_KEY, urlOrderId.trim());
      return urlOrderId.trim();
    }
  }

  const stored = typeof window !== 'undefined' ? localStorage.getItem(CHECKOUT_ATTEMPT_ID_KEY) : null;
  if (stored?.trim()) return stored.trim();

  const newOrderId = clientGenerateOrderId();
  if (typeof window !== 'undefined') {
    localStorage.setItem(CHECKOUT_ATTEMPT_ID_KEY, newOrderId);
  }
  return newOrderId;
}

export function clearCheckoutAttemptId(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CHECKOUT_ATTEMPT_ID_KEY);
    // Ensure the old permanent-style key can never be reused.
    localStorage.removeItem(LEGACY_ORDER_ID_KEY);
  } catch {}
}
