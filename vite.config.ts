import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from 'fs';
import { partytownVite } from '@qwik.dev/partytown/utils';

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
      'robots.txt',
      'proxy/facebook.php',
      'proxy/gtag.php',
      'meta-capi.php'
    ];
    
    criticalFiles.forEach(file => {
      let src, dest;
      if (file.startsWith('proxy/')) {
        // Proxy files are in root directory
        src = path.resolve(__dirname, file);
        dest = path.resolve(__dirname, 'dist', file);
      } else {
        // Other files are in public directory
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

// Custom plugin to make CSS loading non-blocking
const optimizeCssLoading = () => ({
  name: 'optimize-css-loading',
  generateBundle(options, bundle) {
    // Find the HTML file
    const htmlFile = Object.keys(bundle).find(key => key.endsWith('.html'));
    if (htmlFile && bundle[htmlFile].type === 'asset') {
      let htmlSource = bundle[htmlFile].source.toString();
      
      // Replace blocking stylesheet with preload + async load
      htmlSource = htmlSource.replace(
        /<link rel="stylesheet" crossorigin href="([^"]+)">/,
        (match, cssPath) => {
          return `
    <link rel="preload" href="${cssPath}" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="${cssPath}"></noscript>`;
        }
      );
      
      bundle[htmlFile].source = htmlSource;
    }
  }
});

export default defineConfig({
  base: '/',
  plugins: [partytownVite({ dest: path.resolve(__dirname, 'dist', '~partytown') }), react(), copyCriticalFiles(), optimizeCssLoading()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    target: 'es2020',
    minify: 'terser', // Better compression than esbuild
    cssMinify: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 300,
    sourcemap: false, // Disable sourcemaps for production
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs for production
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
          // Core React - critical, loads first
          'react-vendor': ['react', 'react-dom'],
          // Router - critical for navigation
          'router': ['react-router-dom'],
          // React Query - can load in parallel
          'query': ['@tanstack/react-query'],
          // Icons - lazy load (non-critical)
          'icons': ['lucide-react'],
          // Radix UI - split into smaller chunks (avoid circular deps)
          'radix-dialog': ['@radix-ui/react-dialog'],
          'radix-forms': ['@radix-ui/react-label', '@radix-ui/react-select'],
          'radix-ui': ['@radix-ui/react-accordion', '@radix-ui/react-toast', '@radix-ui/react-slot'],
          // Utils - lazy load
          'utils': ['date-fns', 'clsx', 'tailwind-merge'],
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
