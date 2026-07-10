import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootEl = document.getElementById("root")!;

// Remove splash screen before React mounts
const splash = document.getElementById("splash");
if (splash) splash.remove();
// Also remove the inline <style> for the splash spinner
const splashStyle = rootEl.querySelector("style");
if (splashStyle) splashStyle.remove();

// Always use createRoot for SPA rendering to avoid hydration issues
createRoot(rootEl).render(<App />);
