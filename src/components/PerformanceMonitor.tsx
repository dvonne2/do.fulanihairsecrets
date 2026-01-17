import { useEffect } from 'react';

interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
}

export const PerformanceMonitor = () => {
  useEffect(() => {
    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        void entry;
      });
    });

    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });

    // Preload critical resources
    const preloadCriticalResources = () => {
      const criticalImages = document.querySelectorAll('img[fetchpriority="high"]');
      criticalImages.forEach((img) => {
        const src = (img as HTMLImageElement).src;
        if (src && !document.querySelector(`link[rel="preload"][href="${src}"]`)) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.href = src;
          link.as = 'image';
          document.head.appendChild(link);
        }
      });
    };

    // Run after DOM is ready
    if (document.readyState === 'complete') {
      preloadCriticalResources();
    } else {
      document.addEventListener('DOMContentLoaded', preloadCriticalResources);
    }

    return () => {
      observer.disconnect();
    };
  }, []);
};
