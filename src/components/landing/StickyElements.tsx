import { AlertTriangle } from 'lucide-react';

interface StickyElementsProps {
  showStickyBar: boolean;
  viewerCount: number;
  stockCount: number;
  showPurchaseNotif: boolean;
  currentNotif: { name: string; location: string; product: string; time: string };
  scrollProgress: number;
}

export const StickyElements = ({ 
  showStickyBar, 
  stockCount, 
  showPurchaseNotif, 
  currentNotif,
  scrollProgress 
}: StickyElementsProps) => {
  const scrollToOrderForm = () => {
    const el = document.getElementById('order-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Progress Bar */}
      <div 
        className="progress-bar" 
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Sticky CTA Bar */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-50 bg-background/98 backdrop-blur-md border-t border-gold/30 py-3 px-4 transition-transform duration-300 ${showStickyBar ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-sans text-sm font-bold">{stockCount} bundles remaining</span>
            </div>
            <span className="text-gold/50">|</span>
            <span className="font-sans text-sm text-gold">Limited batch available</span>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-end">
            <button 
              onClick={scrollToOrderForm}
              data-form-cta="true"
              className="gold-gradient text-background font-sans text-xs tracking-widest uppercase px-6 py-3 rounded-lg font-bold whitespace-nowrap shadow-[0_0_14px_rgba(218,165,32,0.25)]"
            >
              🛒 Check Availability in Your Area
            </button>
          </div>
        </div>
      </div>

      {/* Purchase Notification - Positioned above sticky bar */}
      {showPurchaseNotif && (
        <div className="fixed bottom-20 left-4 z-40 animate-slideIn max-w-xs">
          <div className="flex items-center gap-3 bg-foreground text-background p-4 rounded-xl shadow-2xl">
            <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-background font-bold text-sm">
              ✅
            </div>
            <div>
              <p className="font-sans text-sm font-bold">{currentNotif.name} from {currentNotif.location}</p>
              <p className="font-sans text-xs text-background/70">Just ordered {currentNotif.product}</p>
              <p className="font-sans text-xs text-gold">{currentNotif.time}</p>
            </div>
          </div>
        </div>
      )}

      {/* Chat with Hair Specialist - Always available, above sticky CTA */}
      <a
        href="https://web.whatsapp.com/send?phone=2348101594734&text=Hello!%20I%27ll%20like%20to%20make%20a%20purchase%20of%20Fulani%20hair%20Gro.%20How%20do%20I%20proceed%3F%20https%3A%2F%2Ffulanihairsecrets.com%2Forder-form"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-4 md:right-6 z-40 flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 md:px-5 md:py-3 rounded-full shadow-2xl transition-transform hover:scale-105"
      >
        <span className="text-xl">💬</span>
        <span className="font-sans text-xs md:text-sm font-semibold tracking-wide whitespace-nowrap">
          Chat with Hair Growth Specialist
        </span>
      </a>

      {/* Floating Order Button - Only show when sticky bar is NOT visible */}
      {!showStickyBar && (
        <a
          href="#order-form"
          data-form-cta="true"
          className="fixed bottom-6 right-4 md:right-6 z-40 flex items-center gap-3 bg-success hover:bg-success/90 text-foreground px-4 md:px-6 py-3 md:py-4 rounded-full shadow-xl"
        >
          <span className="text-xl md:text-2xl">🛒</span>
          <span className="font-sans text-sm font-bold hidden md:block">Check Availability</span>
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-destructive rounded-full flex items-center justify-center">
            <span className="font-sans text-xs text-foreground font-bold">1</span>
          </span>
        </a>
      )}
    </>
  );
};
