/**
 * Image optimization script.
 * Resizes all used .webp images to max 800px wide and compresses under 80KB.
 * Outputs to src/assets-optimized/ preserving subfolder structure.
 * Originals in src/assets/ are untouched.
 *
 * Usage:  node scripts/optimize-images.mjs
 */

import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'fs';
import { resolve, dirname, basename, extname, relative, join } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const ASSETS_DIR = resolve(ROOT, 'src', 'assets');
const OPT_DIR = resolve(ROOT, 'src', 'assets-optimized');

const MAX_WIDTH = 800;
const TARGET_SIZE = 80 * 1024; // 80KB

// Collect all image imports from the codebase
function getUsedImages() {
  const output = execSync(
    `grep -roh "from '@/assets/[^']*'" src/`,
    { cwd: ROOT, encoding: 'utf-8' }
  );
  const paths = [...new Set(
    output.split('\n')
      .filter(Boolean)
      .map(line => line.replace("from '@/assets/", '').replace("'", ''))
  )];
  return paths;
}

async function optimizeImage(relPath) {
  const srcPath = join(ASSETS_DIR, relPath);
  const destPath = join(OPT_DIR, relPath);

  if (!existsSync(srcPath)) {
    console.warn(`  ⚠ Not found: ${relPath}`);
    return { relPath, skipped: true, reason: 'not found' };
  }

  const originalSize = statSync(srcPath).size;
  const ext = extname(relPath).toLowerCase();

  // Only process image files
  if (!['.webp', '.png', '.jpg', '.jpeg'].includes(ext)) {
    return { relPath, skipped: true, reason: 'not an image' };
  }

  // Create output directory
  mkdirSync(dirname(destPath), { recursive: true });

  // If already under target, just copy with resize if needed
  let img = sharp(srcPath);
  const metadata = await img.metadata();
  const needsResize = metadata.width > MAX_WIDTH;

  if (needsResize) {
    img = img.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  // Always output as webp with quality tuning
  // Start at quality 80, reduce if file is still too large
  let quality = 80;
  let buffer;
  let attempts = 0;

  while (attempts < 6) {
    buffer = await img.clone().webp({ quality, effort: 6 }).toBuffer();
    if (buffer.length <= TARGET_SIZE || quality <= 30) break;
    quality -= 10;
    attempts++;
  }

  writeFileSync(destPath, buffer);
  const newSize = buffer.length;
  const savings = ((1 - newSize / originalSize) * 100).toFixed(1);

  const status = newSize > TARGET_SIZE ? '⚠ OVER 80KB' : '✓';
  console.log(
    `  ${status} ${relPath}: ${(originalSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (${savings}% smaller, q=${quality}${needsResize ? `, resized ${metadata.width}→${MAX_WIDTH}` : ''})`
  );

  return { relPath, originalSize, newSize, quality, resized: needsResize };
}

async function main() {
  console.log('[optimize-images] Scanning for used images…');
  const images = getUsedImages();
  console.log(`[optimize-images] Found ${images.length} imported images\n`);

  // Clean output dir
  if (existsSync(OPT_DIR)) {
    execSync(`rm -rf "${OPT_DIR}"`);
  }
  mkdirSync(OPT_DIR, { recursive: true });

  const results = [];
  for (const relPath of images) {
    try {
      const result = await optimizeImage(relPath);
      results.push(result);
    } catch (err) {
      console.error(`  ✗ ${relPath}: ${err.message}`);
      results.push({ relPath, skipped: true, reason: err.message });
    }
  }

  // Summary
  const processed = results.filter(r => !r.skipped);
  const totalOriginal = processed.reduce((s, r) => s + r.originalSize, 0);
  const totalNew = processed.reduce((s, r) => s + r.newSize, 0);
  const overTarget = processed.filter(r => r.newSize > TARGET_SIZE);

  console.log(`\n[optimize-images] Done!`);
  console.log(`  Processed: ${processed.length} images`);
  console.log(`  Total: ${(totalOriginal / 1024 / 1024).toFixed(1)}MB → ${(totalNew / 1024 / 1024).toFixed(1)}MB (${((1 - totalNew / totalOriginal) * 100).toFixed(0)}% smaller)`);
  if (overTarget.length > 0) {
    console.log(`  ⚠ ${overTarget.length} images still over 80KB (complex images at minimum quality)`);
  }
  console.log(`\n  Output: src/assets-optimized/`);
  console.log(`  Next: Update imports from '@/assets/' to '@/assets-optimized/'`);
}

main();
