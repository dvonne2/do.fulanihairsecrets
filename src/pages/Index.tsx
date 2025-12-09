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
import { ProductSystem } from '@/components/landing/ProductSystem';
import { ProtectedRecipe } from '@/components/landing/ProtectedRecipe';
import { WhyWeRestrict } from '@/components/landing/WhyWeRestrict';
import { BundleSection } from '@/components/landing/BundleSection';
import { LuckyFewSection } from '@/components/landing/LuckyFewSection';
import { TheOffer } from '@/components/landing/TheOffer';
import { QualificationGate } from '@/components/landing/QualificationGate';
import { ApplicationProcess } from '@/components/landing/ApplicationProcess';
import { PricingSection } from '@/components/landing/PricingSection';
import { Guarantee } from '@/components/landing/Guarantee';
import { Testimonials } from '@/components/landing/Testimonials';
import { FAQ } from '@/components/landing/FAQ';
import { Footer } from '@/components/landing/Footer';
import { StickyElements } from '@/components/landing/StickyElements';
import { ExitIntentPopup } from '@/components/landing/ExitIntentPopup';

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

const Index = () => {
  // State management
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasShownExit, setHasShownExit] = useState(false);
  const [stockCount, setStockCount] = useState(43);
  const [viewerCount, setViewerCount] = useState(47);
  const [showPurchaseNotif, setShowPurchaseNotif] = useState(false);
  const [currentNotif, setCurrentNotif] = useState(0);
  const [commitmentChecks, setCommitmentChecks] = useState([false, false, false]);
  const [countdown, setCountdown] = useState({ hours: 2, minutes: 47, seconds: 33 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  // Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Viewer count fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => Math.max(30, prev + Math.floor(Math.random() * 7) - 3));
    }, 5000);
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

  // Exit intent
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShownExit) {
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
      setScrollProgress((scrolled / maxScroll) * 100);
      setShowStickyBar(scrolled > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
        <BeforeAfterSection />
        <ProgressTimeline />
        <ProblemAgitation />
        <FounderStory />
        <ProductSystem />
        
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
        
        {/* ORDER SECTION - Show packages */}
        <QualificationGate onQualified={() => setShowPricing(true)} />
        
        {/* Show pricing - always visible after clicking */}
        {showPricing && (
          <PricingSection 
            countdown={countdown}
            stockCount={stockCount}
            commitmentChecks={commitmentChecks}
            onCommitmentChange={handleCommitmentCheck}
          />
        )}
        
        <Guarantee />
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
