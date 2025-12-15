import { useState, useEffect } from 'react';
import { Navigation } from '@/components/landing/Navigation';
import { UrgencyBanner } from '@/components/landing/UrgencyBanner';
import { HeroSection } from '@/components/landing/HeroSection';
import { DisqualificationWarning } from '@/components/landing/DisqualificationWarning';
import { HairLossTypesGuide } from '@/components/landing/HairLossTypesGuide';
import { MaiduguriSecret } from '@/components/landing/MaiduguriSecret';
import { GrandmothersPermission } from '@/components/landing/GrandmothersPermission';
import { LimitedStockWarning } from '@/components/landing/LimitedStockWarning';
import { SocialProofStrip } from '@/components/landing/SocialProofStrip';
import { TrustLogos } from '@/components/landing/TrustLogos';
import { TransformationGallery } from '@/components/landing/TransformationGallery';
import { BeforeAfterSection } from '@/components/landing/BeforeAfterSection';
import { ProgressTimeline } from '@/components/landing/ProgressTimeline';
import { ProblemAgitation } from '@/components/landing/ProblemAgitation';
import { FounderStory } from '@/components/landing/FounderStory';
import { IndustryTruth } from '@/components/landing/IndustryTruth';
import { ProductSystem } from '@/components/landing/ProductSystem';
import { IngredientsSection } from '@/components/landing/IngredientsSection';
import { ProtectedRecipe } from '@/components/landing/ProtectedRecipe';
import { WhyWeRestrict } from '@/components/landing/WhyWeRestrict';
import { BundleSection } from '@/components/landing/BundleSection';
import { LuckyFewSection } from '@/components/landing/LuckyFewSection';
import { TheOffer } from '@/components/landing/TheOffer';
import { ApplicationProcess } from '@/components/landing/ApplicationProcess';
import { PricingSection } from '@/components/landing/PricingSection';
import { Guarantee } from '@/components/landing/Guarantee';
import { Testimonials } from '@/components/landing/Testimonials';
import { FAQ } from '@/components/landing/FAQ';
import { Footer } from '@/components/landing/Footer';
import { StickyElements } from '@/components/landing/StickyElements';
import { ExitIntentPopup } from '@/components/landing/ExitIntentPopup';
import { PreFormNotice } from '@/components/landing/PreFormNotice';
import cashOnDeliveryImg from '@/assets/products/cash-on-delivery-icon-1024x345-7sgjf338-2-1.webp';
import pointingGif from '@/assets/products/RtaIrAk.gif';

const purchaseNotifications = [
  { name: "Hajia F.", location: "Banana Island", product: "6-Month Supply", time: "2 mins ago" },
  { name: "Alhaja M.", location: "Maitama, Abuja", product: "Complete Set", time: "5 mins ago" },
  { name: "Mrs. A.", location: "Lekki Phase 1", product: "Growth Pomade", time: "8 mins ago" },
  { name: "Dr. O.", location: "Victoria Island", product: "6-Month Supply", time: "12 mins ago" },
  { name: "Princess Z.", location: "Kano", product: "Complete System", time: "15 mins ago" },
  { name: "Chief Mrs. N.", location: "Ikoyi", product: "6-Month Supply", time: "18 mins ago" },
  { name: "Hajia B.", location: "Asokoro", product: "Complete Set", time: "23 mins ago" },
  { name: "Mrs. K.", location: "Ikeja GRA", product: "Growth Pomade", time: "27 mins ago" },
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
  // State management
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasShownExit, setHasShownExit] = useState(false);
  const [stockCount, setStockCount] = useState(43);
  const [viewerCount, setViewerCount] = useState(427);
  const [showPurchaseNotif, setShowPurchaseNotif] = useState(false);
  const [currentNotif, setCurrentNotif] = useState(0);
  const [commitmentChecks, setCommitmentChecks] = useState([false, false, false]);
  const [countdown, setCountdown] = useState(getCountdownToMidnight());
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Countdown Timer - always counts down to local midnight today
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdownToMidnight());
    }, 1000);

    // Set initial value immediately in case the interval hasn't fired yet
    setCountdown(getCountdownToMidnight());

    return () => clearInterval(timer);
  }, []);

  // Viewer count fluctuation (social proof)
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => {
        const change = Math.floor(Math.random() * 15) - 7; // -7 to +7
        const next = prev + change;
        // Keep between 195 and 956
        return Math.max(195, Math.min(956, next));
      });
    }, 4000); // Update every 4 seconds

    return () => clearInterval(interval);
  }, []);

  // Stock decreasing
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setStockCount(prev => Math.max(7, prev - 1));
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Purchase notifications
  useEffect(() => {
    const showNotification = () => {
      setCurrentNotif(prev => (prev + 1) % purchaseNotifications.length);
      setShowPurchaseNotif(true);
      setTimeout(() => setShowPurchaseNotif(false), 4000);
    };
    
    const interval = setInterval(showNotification, 15000);
    const firstTimeout = setTimeout(showNotification, 5000);
    return () => {
      clearInterval(interval);
      clearTimeout(firstTimeout);
    };
  }, []);

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % 6);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Exit intent (desktop only)
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Ignore on mobile/tablet
      if (window.innerWidth < 1024) return;
      if (hasShownExit) return;

      if (e.clientY <= 0) {
        setShowExitIntent(true);
        setHasShownExit(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShownExit]);

  // Scroll progress + sticky bar
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
      setScrollProgress(progress);
      setShowStickyBar(scrolled > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll trigger for popup at 55%
  useEffect(() => {
    const handleScroll = () => {
      if (hasShownExit) return;

      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

      if (progress >= 55) {
        setShowExitIntent(true);
        setHasShownExit(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasShownExit]);

  // Time trigger at 22 seconds
  useEffect(() => {
    if (hasShownExit) return;

    const timer = setTimeout(() => {
      if (!hasShownExit) {
        setShowExitIntent(true);
        setHasShownExit(true);
      }
    }, 22000);

    return () => clearTimeout(timer);
  }, [hasShownExit]);

  // FormStart tracking - fires once per session on first CTA or form interaction
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isDebug = window.location.search.includes('meta_debug=1');

    const fireFormStart = () => {
      try {
        if (window.sessionStorage.getItem('formStartFired') === '1') return;
        window.sessionStorage.setItem('formStartFired', '1');
      } catch {
        // sessionStorage may be unavailable; fail quietly but still try to fire events
      }

      (window as any).dataLayer?.push?.({ event: 'FormStart' });
      (window as any).fbq?.('trackCustom', 'FormStart');

      if (isDebug) {
        // eslint-disable-next-line no-console
        console.log('FormStart fired');
      }
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const cta = target.closest('[data-form-cta="true"]');
      const formContainer = target.closest('#order-form-container');

      if (cta || formContainer) {
        fireFormStart();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleCommitmentCheck = (index: number) => {
    const newChecks = [...commitmentChecks];
    newChecks[index] = !newChecks[index];
    setCommitmentChecks(newChecks);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <StickyElements 
        showStickyBar={showStickyBar}
        viewerCount={viewerCount}
        stockCount={stockCount}
        showPurchaseNotif={showPurchaseNotif}
        currentNotif={purchaseNotifications[currentNotif]}
        scrollProgress={scrollProgress}
      />
      
      <Navigation viewerCount={viewerCount} />
      <UrgencyBanner countdown={countdown} />
      
      <main>
        <HeroSection 
          countdown={countdown} 
          stockCount={stockCount} 
          viewerCount={viewerCount} 
        />
        
        {/* DISQUALIFICATION WARNING - Right after hero (biggest impact) */}
        <DisqualificationWarning stockCount={stockCount} />
        
        {/* Pre-form notice + embedded order form (pulled near top for faster access) */}
        <PreFormNotice />
        <div id="order-form-container" className="px-4 md:px-6 max-w-4xl mx-auto">
          <iframe
            id="order-form"
            src="https://fulanihairsecrets.com/order-form/"
            style={{ width: '100%', border: 'none' }}
            scrolling="yes"
            title="Order Form"
          />
        </div>

        {/* 7 HAIR LOSS TYPES GUIDE - Educational self-diagnosis */}
        <HairLossTypesGuide />

        {/* THE MAIDUGURI SECRET - Emotional heart */}
        <MaiduguriSecret />
        
        {/* GRANDMOTHER'S PERMISSION */}
        <GrandmothersPermission />
        
        {/* EXTREMELY LIMITED STOCK */}
        <LimitedStockWarning stockCount={stockCount} />
        
        <SocialProofStrip />
        <TrustLogos />
        <TransformationGallery />

        <section className="py-10 bg-background px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-cinzel text-xl md:text-2xl text-gold mb-2">
              Ready to stop hiding your hairline?
            </p>
            <p className="font-serif text-sm md:text-base text-foreground/90 mb-4">
              Join thousands of Nigerian women quietly filling in thinning edges and bald spots with the complete Fulani Hair Gro system.
            </p>
            <a
              href="#order-form"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-amber-500 text-black font-cinzel text-xs md:text-sm tracking-widest uppercase px-8 md:px-12 py-3 rounded-xl font-bold shadow-[0_0_25px_rgba(218,165,32,0.3)] hover:scale-105 transition-transform"
            >
              Click Here To Order Fulani Hair Gro Now — Cash on Delivery Available
            </a>
          </div>
        </section>

        <BeforeAfterSection />
        <ProgressTimeline />
        <ProblemAgitation />
        <FounderStory />
        <IndustryTruth />

        <ProductSystem />

        <section className="py-10 bg-background px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-cinzel text-xl md:text-2xl text-gold mb-2">
              Now you know why this works.
            </p>
            <p className="font-serif text-sm md:text-base text-foreground/90 mb-4">
              The 3-step system is designed to calm your scalp, block DHT, and feed your follicles so your edges can grow back thicker and stronger.
            </p>
            <a
              href="#order-form"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-amber-500 text-black font-cinzel text-xs md:text-sm tracking-widest uppercase px-8 md:px-12 py-3 rounded-xl font-bold shadow-[0_0_25px_rgba(218,165,32,0.3)] hover:scale-105 transition-transform"
            >
              Click Here To Get The Complete Fulani Hair Gro Bundle Today
            </a>
          </div>
        </section>

        <IngredientsSection />
        
        {/* PROTECTED RECIPE - After products/ingredients */}
        <ProtectedRecipe />
        
        {/* WHY WE RESTRICT SALES */}
        <WhyWeRestrict />
        
        <BundleSection />
        
        {/* APPLICATION PROCESS */}
        <ApplicationProcess stockCount={stockCount} />
        
        {/* YOU'RE ONE OF THE LUCKY FEW - Before pricing */}
        <LuckyFewSection stockCount={stockCount} />
        
        {/* THE OFFER - Before pricing */}
        <TheOffer stockCount={stockCount} />
        
        <Testimonials
          activeIndex={activeTestimonial} 
          onSetActive={setActiveTestimonial} 
        />

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
              <div className="bg-emerald-900/20 border border-emerald-500 rounded-2xl p-5 md:p-6 shadow-[0_0_30px_rgba(16,185,129,0.35)]">
                <h3 className="font-cinzel text-lg md:text-xl text-emerald-400 mb-3">Option 3</h3>
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

        {/* Pricing and embedded order form - always visible */}
        <PricingSection 
          countdown={countdown}
          stockCount={stockCount}
          commitmentChecks={commitmentChecks}
          onCommitmentChange={handleCommitmentCheck}
        />

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
            />
          </div>
        </section>

        <Guarantee />

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
              Click Here To Order Now While Bundles Are Still In Stock
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
              Skip Ahead And Complete Your Order Now
            </a>
          </div>
        </section>

        <FAQ />
      </main>
      
      <Footer />
      
      <ExitIntentPopup 
        show={showExitIntent} 
        onClose={() => setShowExitIntent(false)} 
      />
    </div>
  );
};

export default Index;
