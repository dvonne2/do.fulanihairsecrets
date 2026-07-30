import { readFileSync, existsSync } from 'fs';
import { runInThisContext } from 'vm';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const PIXEL_IDS = [
  '220381209723501',
  '2709676702727852',
  '964049967992063',
  '1481974843635740'
];
const NUMBER_TO_ID = { '1': PIXEL_IDS[0], '2': PIXEL_IDS[1], '3': PIXEL_IDS[2], '4': PIXEL_IDS[3] };

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const source = readFileSync(resolve(repoRoot, 'public/analytics-deferred.js'), 'utf8');

function runScenario(query, storage = {}) {
  global.fbq = (...args) => { (global.__fbqCalls ||= []).push(args); };
  global.ttq = { load: () => {}, page: () => {} };
  global.localStorage = {
    data: storage,
    getItem(k) { return this.data[k] ?? null; },
    setItem(k, v) { this.data[k] = v; }
  };
  global.window = {
    localStorage: global.localStorage,
    location: { search: query }
  };
  global.__fbqCalls = [];
  runInThisContext(source, { filename: 'public/analytics-deferred.js' });
  return {
    selected: global.window.__fhgSelectedPixelId,
    number: global.window.__fhgPixelNumber,
    storage: global.localStorage.data,
    calls: global.__fbqCalls
  };
}

let pass = 0;
let fail = 0;
function assert(label, condition) {
  if (condition) { pass++; console.log(`✓ ${label}`); }
  else { fail++; console.error(`✗ ${label}`); }
}

const cases = [
  { q: '', exp: '1', desc: 'default to Pixel 1' },
  { q: '?pixel=1', exp: '1', desc: 'pixel=1' },
  { q: '?pixel=2', exp: '2', desc: 'pixel=2' },
  { q: '?pixel=3', exp: '3', desc: 'pixel=3' },
  { q: '?pixel=4', exp: '4', desc: 'pixel=4' },
  { q: '?pixel=5', init: { fhg_pixel: PIXEL_IDS[2] }, exp: '3', desc: 'invalid param keeps stored Pixel 3' },
  { q: '', init: { fhg_pixel: PIXEL_IDS[3] }, exp: '4', desc: 'no param keeps stored Pixel 4' },
  { q: '?pixel=2', init: { fhg_pixel: PIXEL_IDS[3] }, exp: '2', desc: 'valid param overrides stored Pixel 4' },
];

for (const c of cases) {
  const r = runScenario(c.q, c.init || {});
  const expectedId = NUMBER_TO_ID[c.exp];
  assert(`${c.desc}: selected pixel = Pixel ${c.exp}`, r.selected === expectedId);
  assert(`${c.desc}: stored fhg_pixel matches`, r.storage.fhg_pixel === expectedId);
}

// Verify PageView is fired to all 4 pixels
const r1 = runScenario('?pixel=2');
const initCalls = r1.calls.filter(c => c[0] === 'init');
const pageView = r1.calls.find(c => c[0] === 'track' && c[1] === 'PageView');
assert('PageView fired once', !!pageView);
assert('All 4 pixels initialized', initCalls.length === 4 && PIXEL_IDS.every(id => initCalls.some(c => c[1] === id)));

assert('dist/analytics-deferred.js was generated', existsSync(resolve(repoRoot, 'dist/analytics-deferred.js')));

try {
  const grepTrack = execSync('grep -R "trackSingle" dist/assets/*.js 2>/dev/null | head -5', { encoding: 'utf8', cwd: repoRoot });
  assert('Built bundle contains trackSingle', grepTrack.includes('trackSingle'));
} catch {
  assert('Built bundle contains trackSingle', false);
}

try {
  const grepFhg = execSync('grep -R "fhg_pixel" dist/assets/*.js 2>/dev/null | head -5', { encoding: 'utf8', cwd: repoRoot });
  assert('Built bundle references fhg_pixel', grepFhg.includes('fhg_pixel'));
} catch {
  assert('Built bundle references fhg_pixel', false);
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
