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

      <button
        type="button"
        onClick={scrollToOrderForm}
        data-form-cta="true"
        aria-label="Go to order form"
        className="fixed bottom-24 right-4 md:bottom-8 md:right-6 z-[9999] flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-success hover:bg-success/90 shadow-2xl border border-success/30 active:scale-95 transition-transform"
      >
        <span className="text-2xl md:text-3xl text-[#333333]">🛒</span>
      </button>
    </>
  );
};
