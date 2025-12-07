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
  viewerCount, 
  stockCount, 
  showPurchaseNotif, 
  currentNotif,
  scrollProgress 
}: StickyElementsProps) => {
  return (
    <>
      {/* Progress Bar */}
      <div 
        className="progress-bar" 
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Sticky CTA Bar */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t-2 border-gold py-3 px-4 transition-transform duration-300 ${showStickyBar ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-destructive animate-pulse"></span>
              <span className="font-sans text-xs text-muted-foreground">{viewerCount} viewing now</span>
            </div>
            <div className="text-gold font-sans text-sm">
              🔥 <span className="font-bold">6-MONTH SUPPLY:</span> Buy 2 Get 1 FREE!
            </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="text-right">
              <p className="font-sans text-xs text-muted-foreground line-through">₦214,500</p>
              <p className="font-cinzel text-xl text-gold">₦66,750</p>
            </div>
            <a 
              href="#order" 
              className="gold-gradient-animated text-background font-sans text-xs tracking-widest uppercase px-4 md:px-6 py-3 rounded-lg font-bold btn-luxury animate-glow whitespace-nowrap"
            >
              👑 YES! I WANT THIS 👑
            </a>
          </div>
        </div>
      </div>

      {/* Purchase Notification */}
      {showPurchaseNotif && (
        <div className="fixed bottom-24 left-4 z-40 animate-slideIn max-w-xs">
          <div className="flex items-center gap-3 bg-foreground text-background p-4 rounded-xl shadow-2xl">
            <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-background font-bold text-sm">
              ✓
            </div>
            <div>
              <p className="font-sans text-sm font-bold">{currentNotif.name} from {currentNotif.location}</p>
              <p className="font-sans text-xs text-background/70">Just purchased {currentNotif.product}</p>
              <p className="font-sans text-xs text-gold">{currentNotif.time}</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/2348101594734?text=Hi!%20I%20have%20a%20question%20about%20Fulani%20Hair%20Gro"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 flex items-center gap-3 bg-success hover:bg-success/90 text-foreground px-4 md:px-6 py-3 md:py-4 rounded-full shadow-2xl transition-all hover:scale-105"
      >
        <span className="text-xl md:text-2xl">💬</span>
        <span className="font-sans text-sm font-bold hidden md:block">Chat Now</span>
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-destructive rounded-full flex items-center justify-center">
          <span className="font-sans text-xs text-foreground font-bold">1</span>
        </span>
      </a>
    </>
  );
};
