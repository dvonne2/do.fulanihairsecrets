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
import hajiaMaryamTestimonial from '@/assets-optimized/Hajia Maryam Testimonial.webp';

// Lazy load below-fold components
const HairLossTypesGuide = lazy(() =>
  import('@/components/landing/HairLossTypesGuide').then((m) => ({ default: m.HairLossTypesGuide }))
);
const MaiduguriSecret = lazy(() =>
  import('@/components/landing/MaiduguriSecret').then((m) => ({ default: m.MaiduguriSecret }))
);
const GrandmothersPermission = lazy(() =>
  import('@/components/landing/GrandmothersPermission').then((m) => ({ default: m.GrandmothersPermission }))
);
const LimitedStockWarning = lazy(() =>
  import('@/components/landing/LimitedStockWarning').then((m) => ({ default: m.LimitedStockWarning }))
);
const TrustLogos = lazy(() =>
  import('@/components/landing/TrustLogos').then((m) => ({ default: m.TrustLogos }))
);
const ProblemAgitation = lazy(() =>
  import('@/components/landing/ProblemAgitation').then((m) => ({ default: m.ProblemAgitation }))
);
const FounderStory = lazy(() =>
  import('@/components/landing/FounderStory').then((m) => ({ default: m.FounderStory }))
);
const IndustryTruth = lazy(() =>
  import('@/components/landing/IndustryTruth').then((m) => ({ default: m.IndustryTruth }))
);
const ProductSystem = lazy(() =>
  import('@/components/landing/ProductSystem').then((m) => ({ default: m.ProductSystem }))
);
const Footer = lazy(() =>
  import('@/components/landing/Footer').then((m) => ({ default: m.Footer }))
);

const IngredientsSection = lazy(() =>
  import('@/components/landing/IngredientsSection').then((m) => ({ default: m.IngredientsSection }))
);
const ProtectedRecipe = lazy(() =>
  import('@/components/landing/ProtectedRecipe').then((m) => ({ default: m.ProtectedRecipe }))
);
const WhyWeRestrict = lazy(() =>
  import('@/components/landing/WhyWeRestrict').then((m) => ({ default: m.WhyWeRestrict }))
);
const BundleSection = lazy(() =>
  import('@/components/landing/BundleSection').then((m) => ({ default: m.BundleSection }))
);
const LuckyFewSection = lazy(() =>
  import('@/components/landing/LuckyFewSection').then((m) => ({ default: m.LuckyFewSection }))
);
const TheOffer = lazy(() =>
  import('@/components/landing/TheOffer').then((m) => ({ default: m.TheOffer }))
);
const ApplicationProcess = lazy(() =>
  import('@/components/landing/ApplicationProcess').then((m) => ({ default: m.ApplicationProcess }))
);
const PricingSection = lazy(() =>
  import('@/components/landing/PricingSection').then((m) => ({ default: m.PricingSection }))
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
  const [commitmentChecks, setCommitmentChecks] = useState([false, false, false]);
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

  const handleCommitmentCheck = (index: number) => {
    const newChecks = [...commitmentChecks];
    newChecks[index] = !newChecks[index];
    setCommitmentChecks(newChecks);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {afterHero && (
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
        background: '#000',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        flexWrap: 'wrap',
      }}>
        <span style={{
          color: '#fff',
          fontSize: '12px',
          fontWeight: '600',
          fontFamily: 'Montserrat, sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap',
        }}>
          ♥ 1000+ Happy Customers
        </span>
        <span style={{
          color: '#fff',
          fontSize: '12px',
          fontWeight: '600',
          fontFamily: 'Montserrat, sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap',
        }}>
          🚚 Payment On Delivery
        </span>
        <span style={{
          color: '#fff',
          fontSize: '12px',
          fontWeight: '600',
          fontFamily: 'Montserrat, sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap',
        }}>
          🛡 Money-Back Guarantee
        </span>
      </div>

      {/* Valentine promo ended - countdown removed */}
      <UrgencyBanner countdown={countdown} />
      
      <main>
        <TopStoryBanner />

        {/* Testimonial Image Stack before form */}
        <section className="py-8 px-4 bg-background">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <p className="font-cinzel text-sm tracking-[0.4em] uppercase text-gold mb-4">✦ Real Customer Results ✦</p>
              <h2 className="font-cinzel text-2xl md:text-3xl text-foreground mb-2">See What Our Customers Say</h2>
            </div>
            <div className="luxury-card rounded-3xl p-6 md:p-8 mega-glow">
              <img
                src={hajiaMaryamTestimonial}
                alt="Hajia Maryam Testimonial - Real customer results with Fulani Hair Gro"
                className="w-full h-auto rounded-2xl shadow-2xl"
                width={391}
                height={891}
                loading="lazy"
                decoding="async"
              />
              <div className="mt-6">
                <div className="flex justify-center gap-1 mb-4">
                  {Array(5).fill(0).map((_, j) => <span key={j} className="text-gold text-2xl">★</span>)}
                </div>
                <p className="font-cinzel text-lg text-gold mb-2">Hajia Maryam</p>
                <p className="font-sans text-sm text-white mb-4">Verified Customer • Nigeria</p>
                <p className="font-sans text-xs text-[#B80F66]">✓ Real Results • Real Customer</p>
              </div>
            </div>
          </div>
        </section>

        {/* DISQUALIFICATION WARNING - After the form */}
        <DisqualificationWarning stockCount={stockCount} />

        <LazySection minHeightClassName="min-h-[200px]">
          <>
            <HairLossTypesGuide />
            <MaiduguriSecret />
            <GrandmothersPermission />
            <LimitedStockWarning stockCount={stockCount} />
            <TrustLogos />
          </>
        </LazySection>

        <section className="py-10 bg-background px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-cinzel text-xl md:text-2xl text-gold mb-2">
              Ready to stop hiding your hairline?
            </p>
            <p className="font-serif text-lg md:text-2xl text-foreground/90 mb-4">
              Join thousands of Nigerian women quietly filling in thinning edges and bald spots with the complete Fulani Hair Gro system.
            </p>
            <a
              href="#order-form"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-amber-500 text-black font-cinzel text-2xl md:text-3xl tracking-widest uppercase px-8 md:px-12 py-3 rounded-xl font-bold shadow-[0_0_25px_rgba(218,165,32,0.3)] hover:scale-105 transition-transform"
            >
              Order Now — Cash on Delivery Available
            </a>
          </div>
        </section>

        <LazySection minHeightClassName="min-h-[200px]">
          <>
            <ProblemAgitation />
            <FounderStory />
            <IndustryTruth />
            <ProductSystem />
          </>
        </LazySection>

        <section className="py-10 bg-background px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-cinzel text-xl md:text-2xl text-gold mb-2">
              Now you know why this works.
            </p>
            <p className="font-serif text-lg md:text-3xl text-foreground/90 mb-4">
              The 3-step system is designed to calm your scalp, block DHT, and feed your follicles so your edges can grow back thicker and stronger.
            </p>
            <a
              href="#order-form"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-amber-500 text-black font-cinzel text-xs md:text-sm tracking-widest uppercase px-8 md:px-12 py-3 rounded-xl font-bold shadow-[0_0_25px_rgba(218,165,32,0.3)] hover:scale-105 transition-transform"
            >
              Order Now — Get The Complete Fulani Hair Gro Bundle
            </a>
          </div>
        </section>

        <LazySection minHeightClassName="min-h-[200px]">
          <>
            <IngredientsSection />
            <ProtectedRecipe />
            <WhyWeRestrict />
            <ApplicationProcess stockCount={stockCount} />
            <LuckyFewSection stockCount={stockCount} />
            <TheOffer stockCount={stockCount} />
          </>
        </LazySection>

        {/* Decision point section - leads into pricing */}
        <section className="py-12 md:py-16 bg-background px-4">
          <div className="max-w-5xl mx-auto">
            <p className="font-serif text-base md:text-lg text-gold mb-3 text-center">
              Just 60 seconds that can change your hairline — and how you feel when you look in the mirror.
            </p>
            <div className="text-center mb-8 md:mb-10">
              <h2 className="font-cinzel text-2xl md:text-3xl text-foreground mb-2">Your Decision Point</h2>
              <p className="font-serif text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                Right now, you&apos;re standing at a quiet crossroads. You have three choices:
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {/* Option 1 */}
              <div className="bg-destructive/10 border border-destructive/40 rounded-2xl p-5 md:p-6">
                <h3 className="font-cinzel text-lg md:text-xl text-destructive mb-3">Option 1</h3>
                <ul className="font-serif text-sm md:text-base text-foreground/90 space-y-1.5">
                  <li>• Keep rotating shampoos, oils, and Instagram &quot;miracle products&quot;</li>
                  <li>• Watch your edges thin little by little</li>
                  <li>• Convince yourself it&apos;s hormones, stress, or just age</li>
                </ul>
              </div>

              {/* Option 2 */}
              <div className="bg-destructive/15 border border-destructive/50 rounded-2xl p-5 md:p-6">
                <h3 className="font-cinzel text-lg md:text-xl text-destructive mb-3">Option 2</h3>
                <ul className="font-serif text-sm md:text-base text-foreground/90 space-y-1.5">
                  <li>• Experiment with harsh chemical treatments</li>
                  <li>• Risk itching, burning scalp, or long-term dependency</li>
                  <li>• Hope your hair survives the process</li>
                </ul>
              </div>

              {/* Option 3 */}
              <div className="bg-[#B80F66]/20 border border-[#B80F66] rounded-2xl p-5 md:p-6 shadow-[0_0_30px_rgba(184,15,102,0.35)]">
                <h3 className="font-cinzel text-lg md:text-xl text-[#8A0B50] mb-3">Option 3</h3>
                <ul className="font-serif text-sm md:text-base text-foreground/90 space-y-1.5">
                  <li>• Use Fulani Hair Gro™ — a natural 3-step herbal system rooted in a 400-year-old Fulani tradition</li>
                  <li>• Formulated to calm the scalp, reduce excessive shedding, and restore healthy growth at the edges and crown</li>
                  <li>• No harsh chemicals. No prescription drama. Just consistency.</li>
                </ul>
              </div>
            </div>

            <p className="font-serif text-base md:text-lg text-center text-foreground mb-8">
              The choice is simple. But it&apos;s your choice.
            </p>

            <div className="text-center mb-8 md:mb-10">
              <h3 className="font-cinzel text-xl md:text-2xl text-gold mb-2">
                Join Thousands of Nigerian Women Quietly Growing Their Hair Back
              </h3>
              <p className="font-serif text-sm md:text-base text-foreground/90 max-w-3xl mx-auto">
                Women who were tired of hiding under wigs. Tired of &quot;small small thinning.&quot; Tired of stylists whispering,
                &quot;Madam, your edges…&quot;
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-start mb-8">
              <div className="space-y-2 font-serif text-sm md:text-base text-foreground/90">
                <p className="font-cinzel text-sm tracking-[0.3em] uppercase text-gold mb-1">
                  What To Do Next
                </p>
                <ul className="space-y-1.5">
                  <li>• Fill the form below to check if Fulani Hair Gro™ is still available</li>
                  <li>• Choose your bundle (the 3-month package delivers the best results)</li>
                  <li>• Start your simple hair growth ritual:</li>
                  <li className="pl-4">– Nourish &amp; seal daily with the pomade</li>
                  <li className="pl-4">– Shampoo &amp; condition every 2 weeks</li>
                </ul>
              </div>
              <div className="space-y-2 font-serif text-sm md:text-base text-foreground/90">
                <p className="font-cinzel text-sm tracking-[0.3em] uppercase text-gold mb-1">
                  What To Expect
                </p>
                <ul className="space-y-1.5">
                  <li>• Notice reduced shedding within the first 1–2 weeks</li>
                  <li>• Spot new baby hairs along your edges and hairline (weeks 3–5)</li>
                  <li>• Enjoy visibly fuller, healthier hair with continued use</li>
                </ul>
              </div>
            </div>

            <div className="text-center space-y-3">
              <p className="font-serif text-sm md:text-base text-foreground/90">
                You&apos;re fully protected by our risk-free guarantee. You have nothing to lose — except thinning edges,
                breakage, and that quiet insecurity you&apos;ve been managing for too long.
              </p>
              <p className="font-cinzel text-base md:text-lg text-gold">
                Fulani Hair Gro — Heritage care. Real hair growth. Quiet confidence.
              </p>
            </div>
          </div>
        </section>

        <Suspense fallback={<div className="py-16 text-center">Loading pricing...</div>}>
          <PricingSection 
            countdown={countdown}
            stockCount={stockCount}
            commitmentChecks={commitmentChecks}
            onCommitmentChange={handleCommitmentCheck}
          />
        </Suspense>

        {/* Cash on delivery visuals (text + banner) */}
        <section className="bg-background pb-4 px-4">
          <div className="max-w-3xl mx-auto flex flex-col items-center gap-3 md:gap-4 text-center">
            <p className="font-sans text-base md:text-lg font-semibold text-foreground">
              Pay on Delivery Available
            </p>
            <p className="font-sans text-sm md:text-base text-foreground/90">
              (Inspect package before you pay. Zero risk.)
            </p>
            <img
              src={cashOnDeliveryImg}
              alt="Cash on Delivery available"
              className="w-full max-w-md object-contain"
              width="1024"
              height="345"
            />
          </div>
        </section>

        <LazySection minHeightClassName="min-h-[120px]">
          <Guarantee />
        </LazySection>

        <section className="py-10 bg-background px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-cinzel text-xl md:text-2xl text-gold mb-2">
              Youre covered by a powerful guarantee.
            </p>
            <p className="font-serif text-sm md:text-base text-foreground/90 mb-4">
              Regrow thinning edges and bald spots or get 2x your money back. No arguments. No stress.
            </p>
            <a
              href="#order-form"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-amber-500 text-black font-cinzel text-xs md:text-sm tracking-widest uppercase px-8 md:px-12 py-3 rounded-xl font-bold shadow-[0_0_25px_rgba(218,165,32,0.3)] hover:scale-105 transition-transform"
            >
              Order Now While Bundles Are Still In Stock
            </a>
          </div>
        </section>

        <section className="py-10 bg-background px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-cinzel text-xl md:text-2xl text-gold mb-2">
              Still have a few questions?
            </p>
            <p className="font-serif text-sm md:text-base text-foreground/90 mb-4">
              You can check the most common questions below, but remember — your hairline only changes when you take the first step.
            </p>
            <a
              href="#order-form"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-amber-500 text-black font-cinzel text-xs md:text-sm tracking-widest uppercase px-8 md:px-12 py-3 rounded-xl font-bold shadow-[0_0_25px_rgba(218,165,32,0.3)] hover:scale-105 transition-transform"
            >
              Order Now
            </a>
          </div>
        </section>

        {loadNonCritical && (
          <Suspense fallback={null}>
            <FAQ />
          </Suspense>
        )}
      </main>
      
      {loadNonCritical && (
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
