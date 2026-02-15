/**
 * SSG entry point — used at build time by scripts/ssg.mjs.
 * Renders the "/" route to a static HTML string using renderToString.
 *
 * Key differences from the client entry (main.tsx):
 *  - Uses StaticRouter instead of BrowserRouter
 *  - Renders Index directly (no React.lazy / Suspense for SSG)
 *  - Skips AnalyticsLoader (browser-only)
 *  - Skips dynamic UI providers (Toaster, Tooltip, Sonner)
 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from './components/ErrorBoundary';
import Index from './pages/Index';

export function render(url: string = '/'): string {
  const queryClient = new QueryClient();

  const html = renderToString(
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <StaticRouter location={url}>
          <Routes>
            <Route path="/" element={<Index />} />
          </Routes>
        </StaticRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );

  return html;
}
