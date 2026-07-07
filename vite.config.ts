import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from 'fs';
import { partytownVite } from '@qwik.dev/partytown/utils';

const copyCriticalFiles = () => ({
  name: 'copy-critical-files',
  writeBundle() {
    const criticalFiles = [
      'manifest.json',
      'sw.js',
      '.htaccess',
      'favicon.ico',
      'robots.txt',
      'proxy/facebook.php',
      'meta-capi.php'
    ];

    criticalFiles.forEach(file => {
      let src, dest;
      if (file.startsWith('proxy/')) {
        src = path.resolve(__dirname, file);
        dest = path.resolve(__dirname, 'dist', file);
      } else {
        src = path.resolve(__dirname, 'public', file);
        dest = path.resolve(__dirname, 'dist', file);
      }
      const destDir = path.dirname(dest);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
      }
    });
  }
});

export default defineConfig({
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: 'https://94.72.104.4',
        changeOrigin: true,
        headers: {
          'Host': 'vitalvida.systemforce.ng'
        },
        secure: false,
      }
    }
  },
  plugins: [
    partytownVite({ dest: path.resolve(__dirname, 'dist', '~partytown') }),
    react(),
    copyCriticalFiles()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    target: 'es2020',
    minify: 'terser',
    cssMinify: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 300,
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      }
    },
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'query': ['@tanstack/react-query'],
          'icons': ['lucide-react'],
          'radix-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-label',
            '@radix-ui/react-select',
            '@radix-ui/react-accordion',
            '@radix-ui/react-toast',
            '@radix-ui/react-slot'
          ],
          'utils': ['date-fns', 'clsx', 'tailwind-merge'],
        },
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
    copyPublicDir: true,
  },
  publicDir: 'public',
});
