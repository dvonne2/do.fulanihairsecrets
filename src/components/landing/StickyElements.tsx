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
  const handleOrderClick = () => {
    const message = encodeURIComponent(
      `Hi! I'd like to order Fulani Hair Gro™.\n\nPlease send me the available packages and pricing.`
    );
    window.open(`https://wa.me/2348101594734?text=${message}`, '_blank');
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
              <span className="font-sans text-sm font-bold">{stockCount} jars remaining</span>
            </div>
            <span className="text-gold/50">|</span>
            <span className="font-sans text-sm text-gold">Limited batch available</span>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-end">
            <button 
              onClick={handleOrderClick}
              className="gold-gradient text-background font-sans text-xs tracking-widest uppercase px-6 py-3 rounded-lg font-bold hover:scale-105 transition-transform whitespace-nowrap shadow-[0_0_20px_rgba(218,165,32,0.3)]"
            >
              💬 Order Now on WhatsApp
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

      {/* Floating WhatsApp Button - Only show when sticky bar is NOT visible */}
      {!showStickyBar && (
        <a
          href="https://wa.me/2348101594734?text=Hi!%20I'd%20like%20to%20order%20Fulani%20Hair%20Gro%E2%84%A2."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-4 md:right-6 z-40 flex items-center gap-3 bg-success hover:bg-success/90 text-foreground px-4 md:px-6 py-3 md:py-4 rounded-full shadow-2xl transition-all hover:scale-105"
        >
          <span className="text-xl md:text-2xl">💬</span>
          <span className="font-sans text-sm font-bold hidden md:block">Order Now</span>
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-destructive rounded-full flex items-center justify-center">
            <span className="font-sans text-xs text-foreground font-bold">1</span>
          </span>
        </a>
      )}
    </>
  );
};
