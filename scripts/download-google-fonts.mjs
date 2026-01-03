import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const indexCssPath = path.resolve(projectRoot, 'src/index.css');
const outFontsDir = path.resolve(projectRoot, 'public/fonts');
const outCssPath = path.resolve(projectRoot, 'src/fonts.generated.css');
const fallbackGoogleFontsUrlPath = path.resolve(projectRoot, 'scripts/google-fonts-url.txt');

async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      // A common UA to ensure Google serves woff2
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  return await res.text();
}

async function fetchBytes(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  const buf = Buffer.from(await res.arrayBuffer());
  return buf;
}

function sanitizeFileName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-_.]/g, '');
}

function extractGoogleFontsImportUrl(indexCss) {
  const match = indexCss.match(/@import\s+url\(['\"](https:\/\/fonts\.googleapis\.com[^'\"]+)['\"]\)\s*;/);
  return match?.[1] ?? null;
}

function parseFontFaces(cssText) {
  // Extract each @font-face block
  const blocks = cssText.match(/@font-face\s*\{[\s\S]*?\}/g) ?? [];
  return blocks
    .map((block) => {
      const family = (block.match(/font-family:\s*'([^']+)'/i) ?? [])[1];
      const style = (block.match(/font-style:\s*([^;]+);/i) ?? [])[1]?.trim();
      const weight = (block.match(/font-weight:\s*([^;]+);/i) ?? [])[1]?.trim();
      const unicodeRange = (block.match(/unicode-range:\s*([^;]+);/i) ?? [])[1]?.trim();

      // Prefer woff2
      const urlMatch = block.match(/src:\s*url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)\s*format\('woff2'\)/i);
      const woff2Url = urlMatch?.[1];

      return { block, family, style, weight, unicodeRange, woff2Url };
    })
    .filter((f) => Boolean(f.family && f.style && f.weight && f.woff2Url));
}

async function main() {
  const indexCss = await fs.readFile(indexCssPath, 'utf8');
  let googleCssUrl = extractGoogleFontsImportUrl(indexCss);

  if (!googleCssUrl) {
    try {
      const fallback = await fs.readFile(fallbackGoogleFontsUrlPath, 'utf8');
      googleCssUrl = fallback.trim();
    } catch {
      // ignore
    }
  }

  if (!googleCssUrl) {
    throw new Error(
      `No Google Fonts URL found. Add an @import url('https://fonts.googleapis.com/...') to ${path.relative(projectRoot, indexCssPath)} or put the URL in ${path.relative(projectRoot, fallbackGoogleFontsUrlPath)}.`,
    );
  }

  console.log(`Using Google Fonts CSS: ${googleCssUrl}`);

  const googleCss = await fetchText(googleCssUrl);
  const faces = parseFontFaces(googleCss);

  if (!faces.length) {
    throw new Error('No @font-face blocks with woff2 URLs were found in the fetched Google Fonts CSS.');
  }

  await fs.mkdir(outFontsDir, { recursive: true });

  const generatedBlocks = [];
  const seen = new Set();

  for (const face of faces) {
    const key = `${face.family}|${face.style}|${face.weight}|${face.woff2Url}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const fileBase = sanitizeFileName(`${face.family}-${face.weight}-${face.style}`);
    const fileName = `${fileBase}.woff2`;
    const filePath = path.resolve(outFontsDir, fileName);

    const bytes = await fetchBytes(face.woff2Url);
    await fs.writeFile(filePath, bytes);

    const relUrl = `/fonts/${fileName}`;

    const cssLines = [
      '@font-face {',
      `  font-family: '${face.family}';`,
      `  font-style: ${face.style};`,
      `  font-weight: ${face.weight};`,
      '  font-display: swap;',
      `  src: url('${relUrl}') format('woff2');`,
    ];

    if (face.unicodeRange) {
      cssLines.push(`  unicode-range: ${face.unicodeRange};`);
    }

    cssLines.push('}');

    generatedBlocks.push(cssLines.join('\n'));

    console.log(`Downloaded ${face.family} ${face.weight} ${face.style} -> public/fonts/${fileName}`);
  }

  const outCss = `${generatedBlocks.join('\n\n')}\n`;
  await fs.writeFile(outCssPath, outCss);

  console.log(`\nGenerated ${path.relative(projectRoot, outCssPath)}`);
  console.log('Next steps:');
  console.log('1) Ensure src/index.css imports ./fonts.generated.css and removes the Google Fonts @import');
  console.log('2) Commit public/fonts/*.woff2 and src/fonts.generated.css');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
