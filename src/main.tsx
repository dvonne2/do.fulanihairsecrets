import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";


// Remove loading placeholder and SEO fallback immediately and multiple times
const removeLoadingScreen = () => {
  const loadingElement = document.querySelector('.loading');
  if (loadingElement) {
    loadingElement.remove();
  }
  const seoFallback = document.getElementById('seo-fallback');
  if (seoFallback) {
    seoFallback.remove();
  }
};

// Remove immediately
removeLoadingScreen();

// Remove again after React mounts
setTimeout(removeLoadingScreen, 100);

// Remove on window load as backup
window.addEventListener('load', removeLoadingScreen);

// Remove on DOM content loaded as another backup
document.addEventListener('DOMContentLoaded', removeLoadingScreen);

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

// Hydrate only on the index route where SSG pre-rendered content matches.
// Other routes (e.g. /thank-you) use createRoot for normal SPA rendering.
const isSSG = rootEl.children.length > 0
  && !rootEl.querySelector('#seo-fallback')
  && !rootEl.querySelector('.loading')
  && window.location.pathname === '/';

if (isSSG) {
  hydrateRoot(rootEl, <App />);
} else {
  createRoot(rootEl).render(<App />);
}
