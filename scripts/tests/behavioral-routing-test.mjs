import crypto from 'crypto';
import * as esbuild from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PIXEL_IDS = [
  '220381209723501',
  '2709676702727852',
  '964049967992063',
  '1481974843635740',
];

// ---- globals ----------------------------------------------------------------
Object.defineProperty(globalThis, 'crypto', { value: crypto.webcrypto, configurable: true, writable: true });
globalThis.TextEncoder = TextEncoder;

const storage = {};
globalThis.localStorage = {
  getItem(k) { return storage[k] ?? null; },
  setItem(k, v) { storage[k] = String(v); },
  removeItem(k) { delete storage[k]; }
};
globalThis.document = { cookie: '' };
globalThis.window = {
  localStorage: globalThis.localStorage,
  document: globalThis.document,
  location: { origin: 'https://example.com', pathname: '/', search: '' }
};

let fbqCalls = [];
function makeFbq() {
  fbqCalls = [];
  function fbq(...args) { fbqCalls.push(args); }
  fbq.callMethod = fbq;
  fbq.loaded = true;
  return fbq;
}

let fetchCalls = [];
globalThis.fetch = async (url, opts) => {
  fetchCalls.push([url, opts]);
  return { ok: true, status: 200, text: async () => 'ok', json: async () => ({}) };
};

// ---- load the bundled module ------------------------------------------------
const OUT = '/tmp/metaTracking.mjs';
await esbuild.build({
  entryPoints: [resolve(__dirname, '../../src/utils/metaTracking.ts')],
  bundle: true,
  platform: 'browser',
  format: 'esm',
  outfile: OUT,
  tsconfig: resolve(__dirname, '../../tsconfig.app.json'),
});

const {
  fireThankYouEvents,
  fireViewContent,
  fireAddToCart,
  fireInitiateCheckout,
  fireFormStart,
  firePageViewCAPI,
  fireCartRecovery,
  resetTracking
} = await import(OUT);

// ---- helpers ----------------------------------------------------------------
let pass = 0, fail = 0;
function assert(label, cond) {
  if (cond) { pass++; console.log(`✓ ${label}`); }
  else { fail++; console.error(`✗ ${label}`); }
}

function setup(pixelId) {
  storage['fhg_pixel'] = pixelId;
  resetTracking();
  globalThis.window.fbq = makeFbq();
  globalThis.window.__metaPixelsInitialized = true;
  fetchCalls = [];
}

function parseBody(call) {
  return JSON.parse(call[1].body);
}

// ---- Purchase routing per pixel ---------------------------------------------
for (let i = 1; i <= 4; i++) {
  const pixelId = PIXEL_IDS[i - 1];
  setup(pixelId);
  await fireThankYouEvents({
    orderId: `PIXEL${i}_001`,
    fullName: 'Test User',
    phone: '08012345678',
    email: 'test@example.com',
    packageName: 'Bundle A',
    totalAmount: 10000,
    packageAmount: 10000,
    paymentType: 'POD',
    state: 'Lagos',
    lga: 'Ikeja',
    numItems: 1
  });

  const purchaseTrack = fbqCalls.filter(c => c[0] === 'trackSingle' && c[2] === 'Purchase');
  const purchaseOther = fbqCalls.filter(c => c[0] === 'track' && c[1] === 'Purchase');
  assert(`Pixel ${i} Purchase uses trackSingle exactly once`, purchaseTrack.length === 1);
  assert(`Pixel ${i} Purchase targets pixel ${pixelId}`, purchaseTrack[0]?.[1] === pixelId);
  assert(`Pixel ${i} no general Purchase track`, purchaseOther.length === 0);

  const purchaseFetch = fetchCalls.map(parseBody).filter(b => b.event_name === 'Purchase');
  if (i === 1) {
    assert(`Pixel 1 Purchase CAPI sent`, purchaseFetch.length === 1);
    assert(`Pixel 1 Purchase CAPI event_id matches browser eventID`, purchaseFetch[0].event_id === purchaseTrack[0][4].eventID);
  } else {
    assert(`Pixel ${i} Purchase CAPI NOT sent`, purchaseFetch.length === 0);
  }
}

// ---- ViewContent on Pixel 2 (should still CAPI to Pixel 1) ------------------
setup(PIXEL_IDS[1]); // Pixel 2
await fireViewContent({ packageName: 'Bundle A', amount: 1000, email: 'a@b.com', phone: '08012345678' });
const viewTrack = fbqCalls.filter(c => c[0] === 'track' && c[1] === 'ViewContent');
const viewSingle = fbqCalls.filter(c => c[0] === 'trackSingle' && c[2] === 'ViewContent');
const viewFetch = fetchCalls.map(parseBody).filter(b => b.event_name === 'ViewContent');
assert('ViewContent browser uses general track (all pixels)', viewTrack.length === 1 && viewSingle.length === 0);
assert('ViewContent CAPI sent for Pixel 2 audience', viewFetch.length === 1);
assert('ViewContent CAPI event_id matches browser', viewFetch[0]?.event_id === viewTrack[0][3].eventID);

// ---- PageView CAPI on Pixel 3 (should still CAPI to Pixel 1) ----------------
setup(PIXEL_IDS[2]); // Pixel 3
window.__pvEventId = 'pv_test_12345';
await firePageViewCAPI();
const pageViewFetch = fetchCalls.map(parseBody).filter(b => b.event_name === 'PageView');
assert('PageView CAPI sent for Pixel 3', pageViewFetch.length === 1);
assert('PageView CAPI event_id matches', pageViewFetch[0]?.event_id === 'pv_test_12345');

// ---- AddToCart / InitiateCheckout trackSingle -------------------------------
setup(PIXEL_IDS[1]); // Pixel 2
await fireAddToCart({ packageName: 'Bundle A', amount: 1000, email: 'a@b.com', phone: '08012345678' });
const atcTrack = fbqCalls.filter(c => c[0] === 'trackSingle' && c[2] === 'AddToCart');
const atcFetch = fetchCalls.map(parseBody).filter(b => b.event_name === 'AddToCart');
assert('AddToCart uses trackSingle to selected pixel', atcTrack.length === 1 && atcTrack[0][1] === PIXEL_IDS[1]);
assert('AddToCart CAPI NOT sent for Pixel 2', atcFetch.length === 0);

fbqCalls = []; fetchCalls = [];
await fireInitiateCheckout({ packageName: 'Bundle A', amount: 1000, email: 'a@b.com', phone: '08012345678', firstName: 'A', lastName: 'B' });
const icTrack = fbqCalls.filter(c => c[0] === 'trackSingle' && c[2] === 'InitiateCheckout');
const icFetch = fetchCalls.map(parseBody).filter(b => b.event_name === 'InitiateCheckout');
assert('InitiateCheckout uses trackSingle to selected pixel', icTrack.length === 1 && icTrack[0][1] === PIXEL_IDS[1]);
assert('InitiateCheckout CAPI NOT sent for Pixel 2', icFetch.length === 0);

// ---- Custom events trackSingleCustom ----------------------------------------
fbqCalls = []; fetchCalls = [];
await fireFormStart();
const fsTrack = fbqCalls.filter(c => c[0] === 'trackSingleCustom' && c[2] === 'FormStart');
const fsFetch = fetchCalls.map(parseBody).filter(b => b.event_name === 'FormStart');
assert('FormStart uses trackSingleCustom to selected pixel', fsTrack.length === 1 && fsTrack[0][1] === PIXEL_IDS[1]);
assert('FormStart CAPI NOT sent for Pixel 2', fsFetch.length === 0);

fbqCalls = []; fetchCalls = [];
await fireCartRecovery({ orderId: 'CART_001', amount: 1000 });
const crTrack = fbqCalls.filter(c => c[0] === 'trackSingleCustom' && c[2] === 'CartRecovery');
const crFetch = fetchCalls.map(parseBody).filter(b => b.event_name === 'CartRecovery');
assert('CartRecovery uses trackSingleCustom to selected pixel', crTrack.length === 1 && crTrack[0][1] === PIXEL_IDS[1]);
assert('CartRecovery CAPI NOT sent for Pixel 2', crFetch.length === 0);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
