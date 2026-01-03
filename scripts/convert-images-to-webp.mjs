import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();

const TARGET_DIRS = [
  path.join(ROOT, 'public'),
  path.join(ROOT, 'src', 'assets'),
];

const EXT_RE = /\.(jpe?g|png)$/i;

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function* walk(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    // Skip common noise
    if (entry.name === '.DS_Store') continue;
    if (entry.name === 'node_modules') continue;
    if (entry.name === 'dist') continue;

    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

function formatBytes(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let v = bytes;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}

async function convertOne(inputPath) {
  if (!EXT_RE.test(inputPath)) return null;

  const outPath = inputPath.replace(EXT_RE, '.webp');
  const inStat = await fs.stat(inputPath);

  // Don't overwrite if webp already exists
  if (await fileExists(outPath)) {
    const outStat = await fs.stat(outPath);
    return {
      inputPath,
      outPath,
      inputBytes: inStat.size,
      outputBytes: outStat.size,
      skipped: true,
    };
  }

  // WebP conversion
  await sharp(inputPath)
    .webp({ quality: 80 })
    .toFile(outPath);

  const outStat = await fs.stat(outPath);

  return {
    inputPath,
    outPath,
    inputBytes: inStat.size,
    outputBytes: outStat.size,
    skipped: false,
  };
}

async function main() {
  console.log('Scanning for .jpg/.jpeg/.png in:');
  for (const dir of TARGET_DIRS) console.log(`- ${dir}`);

  const results = [];

  for (const dir of TARGET_DIRS) {
    for await (const filePath of walk(dir)) {
      if (!EXT_RE.test(filePath)) continue;
      try {
        const r = await convertOne(filePath);
        if (r) results.push(r);
      } catch (err) {
        console.error(`Failed: ${filePath}`);
        console.error(err);
      }
    }
  }

  let totalIn = 0;
  let totalOut = 0;
  let converted = 0;
  let skipped = 0;

  for (const r of results) {
    totalIn += r.inputBytes;
    totalOut += r.outputBytes;

    const delta = r.inputBytes - r.outputBytes;
    const pct = r.inputBytes > 0 ? (delta / r.inputBytes) * 100 : 0;

    if (r.skipped) {
      skipped++;
      console.log(`SKIP  ${path.relative(ROOT, r.inputPath)} -> ${path.relative(ROOT, r.outPath)} (${formatBytes(r.outputBytes)} already exists)`);
    } else {
      converted++;
      console.log(
        `DONE  ${path.relative(ROOT, r.inputPath)} -> ${path.relative(ROOT, r.outPath)}  ` +
          `${formatBytes(r.inputBytes)} -> ${formatBytes(r.outputBytes)}  ` +
          `saved ${formatBytes(Math.max(0, delta))} (${pct.toFixed(1)}%)`
      );
    }
  }

  const totalDelta = totalIn - totalOut;
  const totalPct = totalIn > 0 ? (totalDelta / totalIn) * 100 : 0;

  console.log('');
  console.log(`Converted: ${converted}`);
  console.log(`Skipped (webp already exists): ${skipped}`);
  console.log(`Total: ${results.length}`);
  console.log(`Overall: ${formatBytes(totalIn)} -> ${formatBytes(totalOut)} (saved ${formatBytes(Math.max(0, totalDelta))}, ${totalPct.toFixed(1)}%)`);
}

main();
