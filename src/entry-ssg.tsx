/**
 * SSG entry point — used at build time by scripts/ssg.mjs.
 * Renders the "/" route to a static HTML string using renderToPipeableStream
 * so Suspense boundaries resolve (lazy-loaded components are included in HTML).
 *
 * Key differences from the client entry (main.tsx):
 *  - Uses StaticRouter instead of BrowserRouter
 *  - Renders Index directly (no React.lazy / Suspense for SSG)
 *  - Skips AnalyticsLoader (browser-only)
 *  - Skips dynamic UI providers (Toaster, Tooltip, Sonner)
 */
import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Writable } from 'node:stream';
import ErrorBoundary from './components/ErrorBoundary';
import Index from './pages/Index';

export function render(url: string = '/'): Promise<string> {
  const queryClient = new QueryClient();

  return new Promise((resolve, reject) => {
    let html = '';
    const writable = new Writable({
      write(chunk, _encoding, callback) {
        html += chunk.toString();
        callback();
      },
      final(callback) {
        resolve(html);
        callback();
      },
    });

    const { pipe, abort } = renderToPipeableStream(
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <StaticRouter location={url}>
            <Routes>
              <Route path="/" element={<Index />} />
            </Routes>
          </StaticRouter>
        </QueryClientProvider>
      </ErrorBoundary>,
      {
        onAllReady() {
          pipe(writable);
        },
        onError(error) {
          reject(error);
        },
      }
    );

    // Fallback: if something hangs, abort after 30s
    setTimeout(() => {
      abort();
      reject(new Error('SSG render timed out after 30s'));
    }, 30000);
  });
}
