import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  build: {
    // Enable better chunking and optimization
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          // Split vendor chunks for better caching
          if (id.includes("react") || id.includes("react-dom")) {
            return "react-vendor";
          }
          if (id.includes("radix-ui")) {
            return "ui-vendor";
          }
          if (id.includes("lucide")) {
            return "icons-vendor";
          }
          if (id.includes("date-fns") || id.includes("recharts")) {
            return "utils-vendor";
          }
          
          return "vendor";
        },
        // Optimize chunk sizes
      },
    },
    // Enable better compression
    target: "esnext",
    minify: "esbuild",
    sourcemap: false,
    // Optimize assets
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
      "lucide-react",
    ],
  },
}));
