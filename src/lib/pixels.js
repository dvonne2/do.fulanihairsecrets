import { BASE_PIXEL_ID, BUYER_PIXEL_MAP } from "./mediaBuyer";

let initialized = false;

/**
 * Initialize the base pixel + every buyer pixel once on page load.
 * Multiple fbq('init', ...) calls are supported by Meta.
 */
export function initPixels() {
  if (initialized || typeof window === "undefined" || !window.fbq) return;

  window.fbq("init", BASE_PIXEL_ID);
  Object.values(BUYER_PIXEL_MAP).forEach((id) => window.fbq("init", id));
  window.fbq("track", "PageView");
  initialized = true;
}

/**
 * Fire a Lead event on the BASE pixel + the specific buyer's pixel only.
 * Uses trackSingle to avoid spamming every pixel with every event.
 */
export function trackLead(pixelId, params = {}) {
  if (typeof window === "undefined" || !window.fbq) return;

  window.fbq("trackSingle", BASE_PIXEL_ID, "Lead", params);
  if (pixelId && pixelId !== BASE_PIXEL_ID) {
    window.fbq("trackSingle", pixelId, "Lead", params);
  }
}

export function trackPurchase(pixelId, params = {}) {
  if (typeof window === "undefined" || !window.fbq) return;

  window.fbq("trackSingle", BASE_PIXEL_ID, "Purchase", params);
  if (pixelId && pixelId !== BASE_PIXEL_ID) {
    window.fbq("trackSingle", pixelId, "Purchase", params);
  }
}
