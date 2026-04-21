// Whitelist of valid media buyer codes. Anything else is rejected.
export const ALLOWED_BUYERS = ["asuquo", "rita", "james"];

// Map each buyer to their dedicated Meta pixel ID.
export const BUYER_PIXEL_MAP = {
  asuquo: "111111111111111",
  rita:   "222222222222222",
  james:  "333333333333333",
};

// Shared base pixel fires on every pageview regardless of buyer.
export const BASE_PIXEL_ID = "999999999999999";

const STORAGE_KEY = "media_buyer";

/**
 * Reads ?mb= from URL, validates against whitelist, falls back to localStorage.
 * Returns { mediaBuyer, pixelId, source } — all strings, possibly empty.
 */
export function resolveAttribution() {
  if (typeof window === "undefined") {
    return { mediaBuyer: "", pixelId: "", source: "" };
  }

  const params = new URLSearchParams(window.location.search);
  const rawMb = (params.get("mb") || "").trim().toLowerCase();
  const safeMb = ALLOWED_BUYERS.includes(rawMb) ? rawMb : "";

  let mediaBuyer = safeMb;
  if (mediaBuyer) {
    try { localStorage.setItem(STORAGE_KEY, mediaBuyer); } catch (_) {}
  } else {
    try { mediaBuyer = localStorage.getItem(STORAGE_KEY) || ""; } catch (_) {}
  }

  const pixelId = BUYER_PIXEL_MAP[mediaBuyer] || "";
  const source = params.get("src") || params.get("source") || "lp_main";

  return { mediaBuyer, pixelId, source };
}
