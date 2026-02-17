import { createRoot, hydrateRoot } from "react-dom/client";
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

// Hydrate on the index route where SSG pre-rendered content exists.
// Other routes (e.g. /thank-you) use createRoot for normal SPA rendering.
const isSSG = rootEl.children.length > 0 && window.location.pathname === '/';

if (isSSG) {
  hydrateRoot(rootEl, <App />);
} else {
  createRoot(rootEl).render(<App />);
}
