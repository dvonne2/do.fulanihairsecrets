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

// Longer delay on mobile for faster initial paint
const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
const defaultDelay = isMobile ? 6000 : 3000;

export function AnalyticsLoader({ delayMs = defaultDelay }: Props) {
  const location = useLocation();
  const hasLoadedRef = useRef(false);
  const lastTrackedPathRef = useRef<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const load = () => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    try {
      window.dataLayer = window.dataLayer || [];

      const initialPath = window.location.pathname + window.location.search;
      window.dataLayer.push({ event: 'page_view', page_path: initialPath });
      lastTrackedPathRef.current = initialPath;
      setIsLoaded(true);
    } catch (error) {
      console.error('GTM initialization failed:', {
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
