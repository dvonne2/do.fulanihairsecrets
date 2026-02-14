import { createRoot } from "react-dom/client";
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

createRoot(document.getElementById("root")!).render(<App />);
