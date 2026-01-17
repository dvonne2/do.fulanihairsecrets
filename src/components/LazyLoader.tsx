import React, { Suspense, lazy } from 'react';

interface LazyLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LazyLoader = ({ children, fallback = <div>Loading...</div> }: LazyLoaderProps) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

export const lazyLoad = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) => {
  return lazy(importFunc);
};
