import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { AnalyticsLoader } from "@/components/AnalyticsLoader";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import ErrorBoundary from "@/components/ErrorBoundary";
// Valentine promo ended - components hidden
// import { ValentineAnnouncement } from "@/components/ValentineAnnouncement";
// import { FloatingHearts } from "@/components/FloatingHearts";
import Index from "./pages/Index";

// Affiliate Portal Pages
import Login from "./pages/Login";
import MagicLinkLanding from "./pages/MagicLinkLanding";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Earnings from "./pages/Earnings";
import Payouts from "./pages/Payouts";
import Links from "./pages/Links";
import RequireAuth from "./components/RequireAuth";
import ReviewsAdmin from "./pages/ReviewsAdmin";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: any[]) => void;
  }
}

const ThankYou = React.lazy(() => import("./pages/ThankYou"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => {
  const [uiReady, setUiReady] = useState(false);
  const [TooltipProviderComp, setTooltipProviderComp] = useState<React.ComponentType<{ children: React.ReactNode }> | null>(null);
  const [ToasterComp, setToasterComp] = useState<React.ComponentType | null>(null);
  const [SonnerComp, setSonnerComp] = useState<React.ComponentType | null>(null);

  // Load GA4 script dynamically to avoid unsafe redirect errors
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-KC7KTLQW03';
    script.async = true;
    script.onerror = () => {
      console.log('GA4 script failed to load');
    };
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', 'G-KC7KTLQW03');
  }, []);

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
          <BrowserRouter basename="/" future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            {/* Valentine promo ended - components removed */}
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
              {/* Affiliate Portal Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/media-buyer" element={<MagicLinkLanding />} />

              {/* Affiliate Portal Protected Routes */}
              <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
              <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />
              <Route path="/earnings" element={<RequireAuth><Earnings /></RequireAuth>} />
              <Route path="/payouts" element={<RequireAuth><Payouts /></RequireAuth>} />
              <Route path="/links" element={<RequireAuth><Links /></RequireAuth>} />
              <Route path="/reviews-admin" element={<ReviewsAdmin />} />

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
