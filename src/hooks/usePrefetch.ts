import { useCallback, useRef } from 'react';

type Importer = () => Promise<unknown>;

type Handlers = {
  onMouseEnter: () => void;
  onTouchStart: () => void;
  onFocus: () => void;
};

export function usePrefetch(importer: Importer): Handlers {
  const hasPrefetchedRef = useRef(false);

  const prefetch = useCallback(() => {
    if (hasPrefetchedRef.current) return;
    hasPrefetchedRef.current = true;

    try {
      void importer();
    } catch {
      // ignore
    }
  }, [importer]);

  return {
    onMouseEnter: prefetch,
    onTouchStart: prefetch,
    onFocus: prefetch,
  };
}
