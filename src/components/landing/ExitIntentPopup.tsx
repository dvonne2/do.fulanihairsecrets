interface ExitIntentPopupProps {
  show: boolean;
  onClose: () => void;
}

export const ExitIntentPopup = ({ show, onClose }: ExitIntentPopupProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/95">
      <div className="max-w-md w-full rounded-3xl p-8 md:p-10 relative bg-card border-2 border-gold mega-glow">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-2xl w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          ✕
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="text-6xl md:text-7xl mb-6">😢</div>
          
          <h2 className="font-cinzel text-2xl md:text-3xl text-gold mb-2">WAIT!</h2>
          <p className="font-cinzel text-lg md:text-xl text-foreground mb-4">Don't Leave Empty-Handed</p>
          <p className="font-sans text-sm text-muted-foreground mb-6">
            We noticed you're about to leave. Here's an exclusive offer just for you:
          </p>

          {/* Discount Box */}
          <div className="bg-destructive/20 border-2 border-destructive rounded-2xl p-6 mb-6">
            <p className="font-cinzel text-xl md:text-2xl text-foreground mb-3">EXTRA 10% OFF</p>
            <p className="font-sans text-base text-foreground/80">
              Use code: <span className="text-gold font-bold text-xl">LASTCHANCE10</span>
            </p>
            <p className="font-sans text-sm text-destructive mt-3">⏰ Expires in 10 minutes!</p>
          </div>

          {/* CTA Button */}
          <a 
            href="#order"
            onClick={onClose}
            className="block w-full gold-gradient-animated text-background font-sans text-sm tracking-widest uppercase py-4 rounded-xl font-bold btn-luxury mb-4"
          >
            👑 YES! I WANT THIS 👑
          </a>

          {/* Decline Link */}
          <button 
            onClick={onClose}
            className="font-sans text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            No thanks, I'll pay full price later
          </button>
        </div>
      </div>
    </div>
  );
};
