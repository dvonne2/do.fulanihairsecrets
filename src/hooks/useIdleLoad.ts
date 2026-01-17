import { useState, useEffect } from 'react';

/**
 * Hook to delay component rendering until browser is idle
 * Uses requestIdleCallback with setTimeout fallback
 */
export function useIdleLoad(delay: number = 0): boolean {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // If requestIdleCallback is available, use it
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(
        () => {
          if (delay > 0) {
            setTimeout(() => setShouldLoad(true), delay);
          } else {
            setShouldLoad(true);
          }
        },
        { timeout: 2000 } // Max wait 2 seconds
      );
      return () => window.cancelIdleCallback(id);
    } else {
      // Fallback for Safari - use setTimeout
      const timer = setTimeout(() => setShouldLoad(true), delay + 100);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  return shouldLoad;
}

/**
 * Hook to load components after hero section is interactive
 * Waits for initial paint + idle time
 */
export function useAfterHeroLoad(): boolean {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Wait for first paint, then idle
    const timer = setTimeout(() => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => setShouldLoad(true), { timeout: 1500 });
      } else {
        setShouldLoad(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return shouldLoad;
}
