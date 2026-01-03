import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const src = path.join(root, 'public', '.htaccess');
const distDir = path.join(root, 'dist');
const dest = path.join(distDir, '.htaccess');

await mkdir(distDir, { recursive: true });
await copyFile(src, dest);
