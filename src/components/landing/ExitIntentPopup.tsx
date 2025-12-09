import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ExitIntentPopupProps {
  show: boolean;
  onClose: () => void;
}

export const ExitIntentPopup = ({ show, onClose }: ExitIntentPopupProps) => {
  const handleOrderClick = () => {
    const message = encodeURIComponent(
      `Hi! I'd like to order Fulani Hair Gro™. Please send me the available packages.`
    );
    window.open(`https://wa.me/2348101594734?text=${message}`, '_blank');
    onClose();
  };

  // ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (show) {
      document.addEventListener('keydown', handleEsc);
    }
    
    return () => document.removeEventListener('keydown', handleEsc);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose} // Click backdrop to close
    >
      <div 
        className="max-w-sm w-full rounded-2xl p-6 md:p-8 relative bg-card border-2 border-gold shadow-[0_0_60px_rgba(218,165,32,0.3)] max-h-[400px] md:max-h-[350px]"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking popup content
      >
        {/* X Close Button - Large and visible */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center text-gold hover:text-foreground transition-colors"
          aria-label="Close popup"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content - Short and punchy */}
        <div className="text-center">
          <h2 className="font-cinzel text-xl md:text-2xl text-gold mb-1">
            Wait — Before You Leave... 👑
          </h2>
          
          <p className="font-cinzel text-lg text-foreground mt-4 mb-4">
            Don't miss out on your transformation!
          </p>
          
          <div className="text-left space-y-1 mb-4 px-2">
            <p className="font-serif text-foreground/80">
              <span className="text-gold">✓ 5,247+ happy customers</span>
            </p>
            <p className="font-serif text-foreground/80">
              <span className="text-gold">✓ 365-day money-back guarantee</span>
            </p>
          </div>
          
          <p className="font-cinzel text-gold font-semibold mb-6">
            Order now — limited stock available!
          </p>

          {/* CTA Button */}
          <button 
            onClick={handleOrderClick}
            className="w-full gold-gradient text-background font-sans text-sm tracking-widest uppercase py-4 rounded-xl font-bold hover:scale-105 transition-transform"
          >
            💬 Order Now on WhatsApp
          </button>

          {/* Response time */}
          <p className="text-muted-foreground text-sm mt-3 mb-4">
            ⏱️ Response in under 5 minutes
          </p>

          {/* Decline Link */}
          <button 
            onClick={onClose}
            className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors underline"
          >
            No thanks, I'll leave
          </button>
        </div>
      </div>
    </div>
  );
};
