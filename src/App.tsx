import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { AnalyticsLoader } from "@/components/AnalyticsLoader";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";

const ThankYou = React.lazy(() => import("./pages/ThankYou"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => {
  const [uiReady, setUiReady] = useState(false);
  const [TooltipProviderComp, setTooltipProviderComp] = useState<React.ComponentType<{ children: React.ReactNode }> | null>(null);
  const [ToasterComp, setToasterComp] = useState<React.ComponentType | null>(null);
  const [SonnerComp, setSonnerComp] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setUiReady(true), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!uiReady) return;
    let cancelled = false;
    void import('@/components/ui/tooltip').then((m) => {
      if (!cancelled) setTooltipProviderComp(() => m.TooltipProvider);
    });
    void import('@/components/ui/toaster').then((m) => {
      if (!cancelled) setToasterComp(() => m.Toaster);
    });
    void import('@/components/ui/sonner').then((m) => {
      if (!cancelled) setSonnerComp(() => m.Toaster);
    });
    return () => {
      cancelled = true;
    };
  }, [uiReady]);

  const Providers = useMemo(() => {
    if (!TooltipProviderComp) return ({ children }: { children: React.ReactNode }) => <>{children}</>;
    return ({ children }: { children: React.ReactNode }) => <TooltipProviderComp>{children}</TooltipProviderComp>;
  }, [TooltipProviderComp]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Providers>
          {ToasterComp ? <ToasterComp /> : null}
          {SonnerComp ? <SonnerComp /> : null}
          <BrowserRouter>
            <AnalyticsLoader />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route
                path="/thank-you"
                element={
                  <Suspense fallback={<LoadingSpinner label="Loading…" />}>
                    <ThankYou />
                  </Suspense>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route
                path="*"
                element={
                  <Suspense fallback={<LoadingSpinner label="Loading…" />}>
                    <NotFound />
                  </Suspense>
                }
              />
            </Routes>
          </BrowserRouter>
        </Providers>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
