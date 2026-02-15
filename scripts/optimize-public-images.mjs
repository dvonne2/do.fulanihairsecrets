/**
 * Optimize public/assets/ images in-place.
 * Resizes to max 800px wide and compresses webp under 80KB.
 * Backs up originals to public/assets-backup/ first.
 *
 * Usage:  node scripts/optimize-public-images.mjs
 */

import sharp from 'sharp';
import { mkdirSync, existsSync, statSync, readdirSync, copyFileSync, writeFileSync } from 'fs';
import { resolve, join, extname, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const PUBLIC_ASSETS = resolve(ROOT, 'public', 'assets');
const BACKUP_DIR = resolve(ROOT, 'assets-backup');

const MAX_WIDTH = 800;
const TARGET_SIZE = 80 * 1024; // 80KB

function walkDir(dir, exts) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(full, exts));
    } else if (exts.includes(extname(entry.name).toLowerCase())) {
      results.push(full);
    }
  }
  return results;
}

async function optimizeFile(filePath) {
  const originalSize = statSync(filePath).size;
  if (originalSize <= TARGET_SIZE) {
    return { filePath, skipped: true, reason: 'already under 80KB' };
  }

  const rel = relative(PUBLIC_ASSETS, filePath);

  // Backup original
  const backupPath = join(BACKUP_DIR, rel);
  mkdirSync(resolve(backupPath, '..'), { recursive: true });
  copyFileSync(filePath, backupPath);

  let img = sharp(filePath);
  const metadata = await img.metadata();
  const needsResize = metadata.width > MAX_WIDTH;

  if (needsResize) {
    img = img.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  let quality = 80;
  let buffer;
  let attempts = 0;

  while (attempts < 6) {
    buffer = await img.clone().webp({ quality, effort: 6 }).toBuffer();
    if (buffer.length <= TARGET_SIZE || quality <= 30) break;
    quality -= 10;
    attempts++;
  }

  writeFileSync(filePath, buffer);
  const newSize = buffer.length;
  const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
  const status = newSize > TARGET_SIZE ? '⚠ OVER 80KB' : '✓';

  console.log(
    `  ${status} ${rel}: ${(originalSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (${savings}% smaller, q=${quality}${needsResize ? `, resized ${metadata.width}→${MAX_WIDTH}` : ''})`
  );

  return { filePath, originalSize, newSize, quality, resized: needsResize };
}

async function main() {
  console.log('[optimize-public] Scanning public/assets/ for images over 80KB…\n');

  const allImages = walkDir(PUBLIC_ASSETS, ['.webp', '.png', '.jpg', '.jpeg']);
  const oversize = allImages.filter(f => statSync(f).size > TARGET_SIZE);

  console.log(`  Found ${allImages.length} images total, ${oversize.length} over 80KB\n`);

  if (oversize.length === 0) {
    console.log('  Nothing to optimize!');
    return;
  }

  mkdirSync(BACKUP_DIR, { recursive: true });

  const results = [];
  for (const filePath of oversize) {
    try {
      results.push(await optimizeFile(filePath));
    } catch (err) {
      console.error(`  ✗ ${relative(PUBLIC_ASSETS, filePath)}: ${err.message}`);
    }
  }

  const processed = results.filter(r => !r.skipped);
  const totalOrig = processed.reduce((s, r) => s + r.originalSize, 0);
  const totalNew = processed.reduce((s, r) => s + r.newSize, 0);
  const overTarget = processed.filter(r => r.newSize > TARGET_SIZE);

  console.log(`\n[optimize-public] Done!`);
  console.log(`  Processed: ${processed.length} images`);
  console.log(`  Total: ${(totalOrig / 1024 / 1024).toFixed(1)}MB → ${(totalNew / 1024 / 1024).toFixed(1)}MB (${((1 - totalNew / totalOrig) * 100).toFixed(0)}% smaller)`);
  if (overTarget.length > 0) {
    console.log(`  ⚠ ${overTarget.length} images still over 80KB at minimum quality`);
  }
  console.log(`  Originals backed up to: public/assets-backup/`);
}

main();
