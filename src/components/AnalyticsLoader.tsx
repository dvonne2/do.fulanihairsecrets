import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

type Props = {
  delayMs?: number;
};

const GTM_SCRIPT_ID = 'gtm-script';

function injectScriptOnce({ id, src }: { id: string; src: string }) {
  if (document.getElementById(id)) return;
  const script = document.createElement('script');
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

export function AnalyticsLoader({ delayMs = 3000 }: Props) {
  const location = useLocation();
  const hasLoadedRef = useRef(false);
  const lastTrackedPathRef = useRef<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const gtmId = import.meta.env.VITE_GTM_ID || 'GTM-P7F7447';

  const load = () => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    try {
      window.dataLayer = window.dataLayer || [];

      injectScriptOnce({
        id: GTM_SCRIPT_ID,
        src: `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`,
      });

      const initialPath = window.location.pathname + window.location.search;
      window.dataLayer.push({ event: 'page_view', page_path: initialPath });
      lastTrackedPathRef.current = initialPath;
      setIsLoaded(true);
    } catch (error) {
      console.error('GTM initialization failed:', {
        gtmId,
        error: error instanceof Error ? error.message : error
      });
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(load, delayMs);

    const onFirstInteraction = () => {
      window.clearTimeout(timer);
      load();
    };

    const opts: AddEventListenerOptions = { passive: true };

    window.addEventListener('scroll', onFirstInteraction, opts);
    window.addEventListener('click', onFirstInteraction, opts);
    window.addEventListener('touchstart', onFirstInteraction, opts);
    window.addEventListener('keydown', onFirstInteraction);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onFirstInteraction);
      window.removeEventListener('click', onFirstInteraction);
      window.removeEventListener('touchstart', onFirstInteraction);
      window.removeEventListener('keydown', onFirstInteraction);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delayMs]);

  useEffect(() => {
    if (!isLoaded) return;

    const pagePath = location.pathname + location.search;

    if (lastTrackedPathRef.current === pagePath) return;
    lastTrackedPathRef.current = pagePath;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'page_view', page_path: pagePath });
  }, [isLoaded, location.pathname, location.search]);

  return null;
}
