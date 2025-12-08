interface ExitIntentPopupProps {
  show: boolean;
  onClose: () => void;
}

export const ExitIntentPopup = ({ show, onClose }: ExitIntentPopupProps) => {
  const handleChatClick = () => {
    const message = encodeURIComponent(
      `Hi! I was looking at Fulani Hair Gro™ but I'm not sure if I qualify.\n\nCan you help me with a FREE hair assessment?\n\n[I'll send photos of my problem areas]`
    );
    window.open(`https://wa.me/2348101594734?text=${message}`, '_blank');
    onClose();
  };

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
          <h2 className="font-cinzel text-xl md:text-2xl text-gold mb-2">Wait — Before You Leave...</h2>
          
          {/* Divider */}
          <div className="w-full h-px bg-gold/40 my-6" />
          
          <p className="font-cinzel text-lg text-foreground mb-6">
            Are you sure you don't qualify?
          </p>
          
          <div className="space-y-4 text-left mb-8">
            <p className="font-serif text-foreground/90">
              Many women <span className="text-gold">THINK</span> their hair loss is "not that bad."
            </p>
            <p className="font-serif text-muted-foreground">
              Then they see photos of Type 3 loss and realize:
              <br />
              <span className="text-gold italic">"Oh. That's exactly what I have."</span>
            </p>
            
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 mt-4">
              <p className="font-serif text-foreground/90 text-sm">
                <span className="text-destructive">If you're hiding your edges...</span>
                <br />
                <span className="text-destructive">If you avoid certain hairstyles...</span>
                <br />
                <span className="text-destructive">If you've cried about your hair...</span>
              </p>
              <p className="font-cinzel text-gold mt-3 font-semibold">
                You probably qualify.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gold/40 mb-6" />

          <p className="font-serif text-muted-foreground text-sm mb-6">
            Let our specialist take a look. It's free. No obligation.
          </p>

          {/* CTA Button */}
          <button 
            onClick={handleChatClick}
            className="block w-full gold-gradient-animated text-background font-sans text-sm tracking-widest uppercase py-4 rounded-xl font-bold btn-luxury mb-4"
          >
            💬 Chat Now — Free Hair Assessment
          </button>

          {/* Benefits */}
          <div className="space-y-2 text-left text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <span>⏱️</span>
              <span>Takes only 5 minutes</span>
            </p>
            <p className="flex items-center gap-2">
              <span>📸</span>
              <span>Just send a photo of your problem areas</span>
            </p>
            <p className="flex items-center gap-2">
              <span>✅</span>
              <span>Get honest feedback (we'll tell you if you DON'T need it)</span>
            </p>
          </div>

          {/* Decline Link */}
          <button 
            onClick={onClose}
            className="font-sans text-xs text-muted-foreground hover:text-foreground transition-colors mt-6"
          >
            No thanks, I'll leave
          </button>
        </div>
      </div>
    </div>
  );
};
