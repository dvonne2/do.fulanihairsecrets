import { useState, useEffect, lazy, Suspense, useRef } from 'react';
import type { ReactNode } from 'react';
import { useAfterHeroLoad, useIdleLoad } from '@/hooks/useIdleLoad';
import { UrgencyBanner } from '@/components/landing/UrgencyBanner';
import { TopStoryBanner } from '@/components/landing/TopStoryBanner';
import { DisqualificationWarning } from '@/components/landing/DisqualificationWarning';
import { StickyElements } from '@/components/landing/StickyElements';
import { TopIntentPopup } from '@/components/landing/TopIntentPopup';
// Valentine promo ended
// import { ValentineCountdown } from '@/components/ValentineCountdown';

// Lazy load below-fold components
const Footer = lazy(() =>
  import('@/components/landing/Footer').then((m) => ({ default: m.Footer }))
);
const BeforeAfterSection = lazy(() =>
  import('@/components/landing/BeforeAfterSection').then((m) => ({ default: m.BeforeAfterSection }))
);
const Guarantee = lazy(() =>
  import('@/components/landing/Guarantee').then((m) => ({ default: m.Guarantee }))
);
const FAQ = lazy(() => import('@/components/landing/FAQ').then((m) => ({ default: m.FAQ })));
import cashOnDeliveryImg from '@/assets-optimized/products/cash-on-delivery-icon-1024x345-7sgjf338-2-1.webp';

type LazySectionProps = {
  children: ReactNode;
  minHeightClassName?: string;
  rootMargin?: string;
};

const LazySection = ({
  children,
  minHeightClassName = 'min-h-[1px]',
  rootMargin = '800px 0px'
}: LazySectionProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) return;
    const el = ref.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setIsVisible(true);
        }
      },
      { root: null, rootMargin, threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div ref={ref} className={minHeightClassName}>
      {isVisible ? <Suspense fallback={null}>{children}</Suspense> : null}
    </div>
  );
};

const purchaseNotifications = [
  { name: "Hajia F.", location: "Banana Island", product: "6-Month Supply", time: "2 mins ago" },
  { name: "Alhaja M.", location: "Maitama, Abuja", product: "Complete Set", time: "5 mins ago" },
  { name: "Mrs. A.", location: "Lekki Phase 1", product: "Growth Pomade", time: "8 mins ago" },
  { name: "Dr. O.", location: "Victoria Island", product: "6-Month Supply", time: "12 mins ago" },
  { name: "Princess Z.", location: "Kano", product: "Complete System", time: "15 mins ago" },
  { name: "Chief Mrs. N.", location: "Ikoyi", product: "6-Month Supply", time: "18 mins ago" },
  { name: "Hajia B.", location: "Asokoro", product: "Complete Set", time: "23 mins ago" },
  { name: "Mrs. K.", location: "Ikeja GRA", product: "Growth Pomade", time: "27 mins ago" },
  { name: "Obinna", location: "Ikeja", product: "B2GOF Bundle for his wife!", time: "3 mins ago" },
  { name: "Chukwuemeka", location: "Lekki", product: "Premium Bundle for wife", time: "6 mins ago" },
  { name: "Ahmed", location: "Abuja", product: "Complete Set", time: "9 mins ago" },
  { name: "Tunde", location: "Victoria Island", product: "6-Month Supply (gift)", time: "11 mins ago" },
];

const getCountdownToMidnight = () => {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0); // today at 24:00 (start of next day)

  const diffMs = midnight.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
};

const Index = () => {
  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Idle load non-critical components to reduce TBT
  const loadNonCritical = useIdleLoad(500); // Load after 500ms idle
  const afterHero = useAfterHeroLoad();

  // const { trackPageView, trackViewContent, trackFormStart } = useMetaPixel(); // Tracking removed
  const hasTrackedPageView = useRef(false);
  
  // State management
  const [stockCount, setStockCount] = useState(43);
  const [viewerCount, setViewerCount] = useState(427);
  const [showPurchaseNotif, setShowPurchaseNotif] = useState(false);
  const [currentNotif, setCurrentNotif] = useState(0);
  const [countdown, setCountdown] = useState(getCountdownToMidnight());
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [showTopIntent, setShowTopIntent] = useState(false);
  const [hasShownTopIntent, setHasShownTopIntent] = useState(false);

  // Countdown Timer - always counts down to local midnight today
  useEffect(() => {
    if (!afterHero) return;
    const timer = setInterval(() => {
      setCountdown(getCountdownToMidnight());
    }, 1000);

    // Set initial value immediately in case the interval hasn't fired yet
    setCountdown(getCountdownToMidnight());

    return () => clearInterval(timer);
  }, [afterHero]);

  // Meta Pixel: PageView and ViewContent on mount
  useEffect(() => {
    if (hasTrackedPageView.current) return;
    // trackPageView(); // Tracking removed
    // CRITICAL FIX: Dynamic ViewContent for whale hunting - capture high-value packages
    setTimeout(() => {
      // Check URL for package selection, default to baseline
      const urlParams = new URLSearchParams(window.location.search);
      const pkg = urlParams.get('pkg') || 'Fulani Hair Gro';
      // trackViewContent(pkg); // Dynamic pricing for whale hunting - Tracking removed
    }, 1000); // Fire after 1 second
    hasTrackedPageView.current = true;
  }, []);

  // Viewer count fluctuation (social proof)
  useEffect(() => {
    if (!afterHero) return;
    const interval = setInterval(() => {
      setViewerCount(prev => {
        const change = Math.floor(Math.random() * 15) - 7; // -7 to +7
        const next = prev + change;
        // Keep between 195 and 956
        return Math.max(195, Math.min(956, next));
      });
    }, 4000); // Update every 4 seconds

    return () => clearInterval(interval);
  }, [afterHero]);

  // Stock decreasing
  useEffect(() => {
    if (!afterHero) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setStockCount(prev => Math.max(7, prev - 1));
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [afterHero]);

  // Purchase notifications
  useEffect(() => {
    if (!afterHero) return;
    const showNotification = () => {
      setCurrentNotif(prev => (prev + 1) % purchaseNotifications.length);
      setShowPurchaseNotif(true);
      setTimeout(() => setShowPurchaseNotif(false), 4000);
    };
    
    const interval = setInterval(showNotification, 8000);
    const firstTimeout = setTimeout(showNotification, 3000);
    return () => {
      clearInterval(interval);
      clearTimeout(firstTimeout);
    };
  }, [afterHero]);

  // Scroll progress + sticky bar
  useEffect(() => {
    if (!afterHero) return;
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
      setScrollProgress(progress);
      setShowStickyBar(scrolled > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [afterHero]);

  // Transactional popup gating (mobile-first): show only after 8s OR 50% scroll depth
  useEffect(() => {
    if (!afterHero) return;
    if (hasShownTopIntent) return;

    const fireTopIntent = () => {
      if (hasShownTopIntent) return;
      setShowTopIntent(true);
      setHasShownTopIntent(true);
    };

    const timer = window.setTimeout(fireTopIntent, 8000);

    const handleScroll = () => {
      if (hasShownTopIntent) return;

      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

      if (progress >= 50) {
        fireTopIntent();
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [afterHero, hasShownTopIntent]);



  // FormStart tracking - fires once per session on first CTA click ONLY (not on form interactions)
  // This prevents FormStart from firing on Step 2
  useEffect(() => {
    if (typeof window === 'undefined') return;

    type WindowWithTracking = Window & {
      dataLayer?: Array<Record<string, unknown>> & {
        push?: (event: Record<string, unknown>) => number;
      };
      fbq?: (...args: unknown[]) => unknown;
    };

    const fireFormStart = () => {
      try {
        if (window.sessionStorage.getItem('formStartFired') === '1') return;
        window.sessionStorage.setItem('formStartFired', '1');
      } catch (error) {
        console.error('sessionStorage unavailable (private browsing mode?):', {
          error: error instanceof Error ? error.message : error
        });
        return; // Don't fire if sessionStorage is unavailable
      }

      (window as WindowWithTracking).dataLayer?.push?.({ event: 'FormStart' });
      // trackFormStart(); // Tracking removed
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      // Only fire FormStart on CTA buttons, NOT on form container clicks
      const cta = target.closest('[data-form-cta="true"]');

      if (cta) {
        fireFormStart();
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {mounted && afterHero && (
        <StickyElements 
          showStickyBar={showStickyBar}
          viewerCount={viewerCount}
          stockCount={stockCount}
          showPurchaseNotif={showPurchaseNotif}
          currentNotif={purchaseNotifications[currentNotif]}
          scrollProgress={scrollProgress}
        />
      )}
      
      {/* Trust Bar */}
      <div style={{
        background: '#000000',
        padding: '4px 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        flexWrap: 'nowrap',
      }}>
        <span style={{
          color: '#FFFFFF',
          fontSize: '16px',
          fontWeight: '700',
          fontFamily: 'Arvo, serif',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap',
        }}>
          ♥ 100,000+ Happy Customers
        </span>
        <span style={{
          color: '#FFFFFF',
          fontSize: '16px',
          fontWeight: '700',
          fontFamily: 'Arvo, serif',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap',
        }}>
          🚚 Payment On Delivery
        </span>
        <span style={{
          color: '#FFFFFF',
          fontSize: 'clamp(12px, 2.5vw, 16px)',
          fontWeight: '700',
          fontFamily: 'Arvo, serif',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'normal',
          flexWrap: 'wrap',
        }}>
          🛡 Money-Back Guarantee
        </span>
        <span style={{
          color: '#FFFFFF',
          fontSize: '16px',
          fontWeight: '700',
          fontFamily: 'Arvo, serif',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap',
        }}>
          📣 Not Sold in Stores
        </span>
      </div>

      {/* FULANI HAIR GRO Branding */}
      <div className="branding-container">
        <div className="branding-center" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a 
            href="#"
            className="branding-text"
            style={{ margin: 0 }}
          >
            FULANI HAIR GRO
          </a>
          <span style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#ffc83d',
            fontFamily: 'Montserrat, sans-serif',
            letterSpacing: '0.3px'
          }}>
          </span>
        </div>
        
        {/* Mobile Verified Review */}
        <div style={{
          display: 'none',
          textAlign: 'center',
          padding: '4px 0',
          fontSize: '12px',
          fontWeight: '600',
          color: '#2c3e50',
          fontFamily: 'Montserrat, sans-serif'
        }} className="md:hidden">
          12,847 Verified Review
        </div>
        
        <a
          href="#order-form"
          data-form-cta="true"
          className="cta-button-right cta-with-arrow"
        >
          Click Here To Buy Now
          <span className="arrow-indicator"></span>
        </a>
      </div>

      {/* Review Stars with Social Proof */}
      <div style={{
        textAlign: 'center',
        padding: '8px 12px 12px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #e9ecef'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#2c3e50',
            fontFamily: 'Montserrat, sans-serif',
            textAlign: 'center'
          }}>
            <span style={{
              color: '#ffc83d',
              letterSpacing: '2px',
              marginRight: '8px'
            }}>
              ★★★★★
            </span>
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#2c3e50',
              marginRight: '12px'
            }}>
              4.89/5
            </span>
            12,847 Verified Reviews
          </div>
        </div>
      </div>

      {/* Valentine promo ended - countdown removed */}
      
      <main>
        <TopStoryBanner />
        
        {mounted && loadNonCritical && (
          <Suspense fallback={null}>
            <Guarantee />
          </Suspense>
        )}

        <DisqualificationWarning stockCount={stockCount} />

        <LazySection minHeightClassName="min-h-[200px]">
          <BeforeAfterSection />
        </LazySection>

        
        {mounted && loadNonCritical && (
          <Suspense fallback={null}>
            <FAQ />
          </Suspense>
        )}
      </main>
      
      {mounted && loadNonCritical && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}
      
      <TopIntentPopup
        show={showTopIntent}
        onClose={() => setShowTopIntent(false)}
      />
    </div>
  );
};

export default Index;
