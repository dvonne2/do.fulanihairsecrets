import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from 'fs';
import { partytownVite } from '@builder.io/partytown/utils';

// Custom plugin to copy critical files to dist root
const copyCriticalFiles = () => ({
  name: 'copy-critical-files',
  writeBundle() {
    const criticalFiles = [
      'index.html',
      'manifest.json',
      'sw.js',
      '.htaccess',
      'favicon.ico',
      'robots.txt'
    ];
    
    criticalFiles.forEach(file => {
      const src = path.resolve(__dirname, 'public', file);
      const dest = path.resolve(__dirname, 'dist', file);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
      }
    });
  }
});

export default defineConfig({
  plugins: [partytownVite({ dest: path.resolve(__dirname, 'dist', '~partytown') }), react(), copyCriticalFiles()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    target: 'es2020',
    minify: 'esbuild',
    cssMinify: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React - must load first
          'react-vendor': ['react', 'react-dom'],
          // Router - loads after React
          'router': ['react-router-dom'],
          // React Query - can load in parallel
          'query': ['@tanstack/react-query'],
          // Icons - lazy load
          'icons': ['lucide-react'],
          // Radix UI components - lazy load
          'radix': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-dialog',
            '@radix-ui/react-label',
            '@radix-ui/react-select',
            '@radix-ui/react-slot',
            '@radix-ui/react-toast',
          ],
        },
        // Put ALL assets in /assets/ folder
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name?.split('.').pop() || '';
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(extType)) {
            return `assets/[name]-[hash][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(extType)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    // Copy publicDir for static assets (fonts, hero images)
    copyPublicDir: true,
  },
  publicDir: 'public',
});
