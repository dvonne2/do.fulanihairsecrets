import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const ASSETS_DIR = resolve(ROOT, 'public', 'assets');

// Images to resize based on PageSpeed Insights
const RESIZE_CONFIG = [
  // Customer review images: displayed at 224x280
  { file: 'mama1.webp', width: 224, height: 280 },
  { file: 'mama2.webp', width: 224, height: 280 },
  { file: 'mama3.webp', width: 224, height: 280 },
  { file: 'mama4.webp', width: 224, height: 280 },
  { file: 'mama5.webp', width: 224, height: 280 },
  // Product images: displayed at ~300x280
  { file: 'circle-pomade.webp', width: 300, height: 280 },
  { file: 'circle-shampoo.webp', width: 300, height: 280 },
  { file: 'circle-conditioner.webp', width: 300, height: 280 },
  // Hero image: displayed at 665x328
  { file: 'hero2.webp', width: 665, height: 328 },
];

async function resizeImage(config) {
  const srcPath = resolve(ASSETS_DIR, config.file);
  const destPath = resolve(ASSETS_DIR, config.file); // Overwrite original

  try {
    const img = sharp(srcPath);
    const metadata = await img.metadata();
    const originalSize = metadata.size;

    const buffer = await img
      .resize(config.width, config.height, { fit: 'cover' })
      .webp({ quality: 85, effort: 6 })
      .toBuffer();

    // Write back to original location
    await sharp(buffer).toFile(destPath);

    const newSize = buffer.length;
    const savings = ((1 - newSize / originalSize) * 100).toFixed(1);

    console.log(
      `✓ ${config.file}: ${(originalSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (${savings}% smaller, ${metadata.width}x${metadata.height} → ${config.width}x${config.height})`
    );

    return { file: config.file, originalSize, newSize, success: true };
  } catch (err) {
    console.error(`✗ ${config.file}: ${err.message}`);
    return { file: config.file, success: false, error: err.message };
  }
}

async function main() {
  console.log('[resize-pagespeed-images] Resizing images to PageSpeed display dimensions…\n');

  const results = [];
  for (const config of RESIZE_CONFIG) {
    const result = await resizeImage(config);
    results.push(result);
  }

  const successful = results.filter(r => r.success);
  const totalOriginal = successful.reduce((s, r) => s + r.originalSize, 0);
  const totalNew = successful.reduce((s, r) => s + r.newSize, 0);

  console.log(`\n[resize-pagespeed-images] Done!`);
  console.log(`  Processed: ${successful.length}/${results.length} images`);
  console.log(`  Total: ${(totalOriginal / 1024).toFixed(0)}KB → ${(totalNew / 1024).toFixed(0)}KB (${((1 - totalNew / totalOriginal) * 100).toFixed(0)}% smaller)`);
}

main();
