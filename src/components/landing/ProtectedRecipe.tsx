export const ProtectedRecipe = () => {
  const features = [
    "Hand-selected herbs from Maiduguri bushes",
    "Traditional fermentation process (21 days minimum)",
    "Infused under specific conditions",
    "Blessed according to family tradition",
    "Each batch personally approved by Hajia Zainab"
  ];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-background">
      {/* Decorative background */}
      <div className="absolute inset-0 arabian-pattern opacity-30" />
      
      <div className="max-w-3xl mx-auto px-6 md:px-8 relative z-10">
        {/* Certificate-style card */}
        <div className="relative bg-card border-2 border-gold/40 rounded-xl overflow-hidden">
          {/* Ornate gold border pattern */}
          <div className="absolute inset-0 border-[12px] border-double border-gold/20 rounded-xl pointer-events-none" />
          
          {/* Gold wax seal */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-gold via-gold/80 to-gold/60 flex items-center justify-center shadow-lg">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-gold/40 flex items-center justify-center">
                <span className="font-cinzel text-background text-xs font-bold text-center leading-tight">
                  PROTECTED<br/>RECIPE
                </span>
              </div>
            </div>
            {/* Seal shine */}
            <div className="absolute top-2 left-4 w-3 h-3 rounded-full bg-white/50 blur-sm" />
          </div>

          {/* Content */}
          <div className="pt-16 md:pt-20 pb-10 px-6 md:px-12">
            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="font-cinzel text-xl md:text-2xl lg:text-3xl text-gold mb-2">
                Protected Family Recipe
              </h2>
              <div className="w-32 h-px bg-gold/40 mx-auto" />
            </div>

            {/* Main text */}
            <div className="space-y-6 font-serif text-lg text-foreground/90 leading-relaxed text-center mb-10">
              <p className="text-gold font-semibold">
                This formula cannot be replicated by any factory.
              </p>
              <p>
                The exact herb combinations, fermentation times, and infusion methods are known only to our family.
              </p>
              <p>
                What you receive is prepared by hand, in small batches, using the same process my grandmother used, and her grandmother before her.
              </p>
              <p className="text-destructive/80 font-semibold">
                No shortcuts. No substitutions. No compromises.
              </p>
            </div>

            {/* Features list */}
            <div className="space-y-4 max-w-md mx-auto mb-10">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-gold text-lg">✦</span>
                  <span className="font-serif text-foreground/90">{feature}</span>
                </div>
              ))}
            </div>

            {/* Explanation */}
            <div className="text-center space-y-2 font-serif text-muted-foreground italic">
              <p>This is why every jar is numbered.</p>
              <p>This is why we can never mass-produce.</p>
              <p className="text-gold not-italic font-semibold">This is why it actually works.</p>
            </div>

            {/* Footer */}
            <div className="text-center mt-10 pt-6 border-t border-gold/20">
              <span className="text-3xl mb-2 block">🏛️</span>
              <p className="font-cinzel text-gold text-lg">Est. 1625</p>
              <p className="text-muted-foreground text-sm">Maiduguri, Nigeria</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
