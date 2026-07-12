import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Register service worker for caching
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        void registration;
      })
      .catch((registrationError) => {
        void registrationError;
      });
  });
}

const rootEl = document.getElementById("root")!;

// Remove splash screen before React mounts
const splash = document.getElementById("splash");
if (splash) splash.remove();
// Also remove the inline <style> for the splash spinner
const splashStyle = rootEl.querySelector("style");
if (splashStyle) splashStyle.remove();

// Use createRoot instead of hydrateRoot to fix hydration mismatch
// SSG HTML doesn't match client Suspense/lazy loading structure
createRoot(rootEl).render(<App />);
