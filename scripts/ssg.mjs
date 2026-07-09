/**
 * SSG build script.
 * Uses Vite's ssrLoadModule to load the React app in Node,
 * renders the "/" route to static HTML via renderToString,
 * then injects it into dist/index.html replacing the SEO fallback.
 *
 * Usage:  node scripts/ssg.mjs
 * Called automatically by the "build" npm script after vite build.
 */

import { createServer } from 'vite';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const DIST_INDEX = resolve(ROOT, 'dist', 'index.html');

async function ssg() {
  console.log('[ssg] Starting static site generation…');

  // Create a Vite dev server in SSR mode (middleware mode, no HTTP server)
  const vite = await createServer({
    root: ROOT,
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'warn',
    optimizeDeps: { noDiscovery: true },
  });

  try {
    // Load the SSG entry through Vite's module graph (handles TS, JSX, aliases, etc.)
    const { render } = await vite.ssrLoadModule('/src/entry-ssg.tsx');

    // Render the index route to HTML
    const appHtml = render('/');
    console.log(`[ssg] Rendered ${(appHtml.length / 1024).toFixed(1)} KB of HTML`);

    // Read the built dist/index.html
    let html = readFileSync(DIST_INDEX, 'utf-8');

    // Replace everything inside <div id="root">...</div> with the pre-rendered HTML.
    // The pattern matches from <div id="root"> to the closing </div> before the script tag.
    // We need to be careful to preserve the closing </div> and the script tag.
    const rootOpenTag = '<div id="root">';
    const rootStart = html.indexOf(rootOpenTag);
    if (rootStart === -1) {
      console.error('[ssg] Could not find <div id="root"> in dist/index.html');
      return;
    }

    // Find the matching closing </div> for #root.
    // In the built HTML the entry script follows immediately:
    //   </div>\n    <script type="module" crossorigin src="...">
    const scriptTag = html.indexOf('<script type="module"', rootStart);
    if (scriptTag === -1) {
      // Fallback: look for </body> instead
      const bodyClose = html.indexOf('</body>', rootStart);
      if (bodyClose === -1) {
        console.error('[ssg] Could not locate end of #root content');
        return;
      }
      var rootEndTag = html.lastIndexOf('</div>', bodyClose);
    } else {
      var rootEndTag = html.lastIndexOf('</div>', scriptTag);
    }
    if (rootEndTag === -1) {
      console.error('[ssg] Could not find closing </div> for #root');
      return;
    }

    // Replace the content between <div id="root"> and its closing </div>
    const before = html.slice(0, rootStart + rootOpenTag.length);
    const after = html.slice(rootEndTag);
    html = before + appHtml + after;

    writeFileSync(DIST_INDEX, html, 'utf-8');
    console.log(`[ssg] Wrote pre-rendered index.html (${(html.length / 1024).toFixed(1)} KB total)`);
  } catch (err) {
    console.error('[ssg] FAILED:', err.message);
    if (err.stack) console.error(err.stack);
    console.error('[ssg] SSG failed — build cannot proceed without pre-rendered HTML.');
    process.exit(1);
  } finally {
    await vite.close();
  }
}

ssg();
