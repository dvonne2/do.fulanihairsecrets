import { Button } from '@/components/ui/button';

interface TheOfferProps {
  stockCount: number;
}

export const TheOffer = ({ stockCount }: TheOfferProps) => {
  const handleOrderClick = () => {
    const message = encodeURIComponent(
      `Hi! I want to order the Full Authentic Fulani Hair Gro™ System. I saw there are only ${stockCount} jars remaining and I don't want to miss out!`
    );
    window.open(`https://wa.me/2348101594734?text=${message}`, '_blank');
  };

  const bonuses = [
    {
      icon: "✨",
      title: "FREE Luxury Silk Bonnet",
      description: "Protects your hair while the formula works overnight"
    },
    {
      icon: "✨",
      title: "FREE Hair Growth Ebook",
      description: "My exact routine—what I do every single night"
    },
    {
      icon: "✨",
      title: "FREE Express Shipping",
      description: "On 6-Month Supply orders"
    },
    {
      icon: "✨",
      title: "Pay on Delivery Available",
      description: "Inspect before you pay. Zero risk."
    },
    {
      icon: "✨",
      title: "Numbered Jar Certificate",
      description: "Proof your jar is from an authentic batch"
    }
  ];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Celebratory gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gold/10 via-background to-gold/10" />
      
      {/* Decorative sparkles */}
      <div className="absolute top-10 left-10 text-2xl opacity-60 animate-pulse">✨</div>
      <div className="absolute top-20 right-20 text-3xl opacity-40 animate-pulse delay-300">✨</div>
      <div className="absolute bottom-20 left-1/4 text-xl opacity-50 animate-pulse delay-700">✨</div>
      <div className="absolute bottom-10 right-10 text-2xl opacity-40 animate-pulse delay-500">✨</div>

      <div className="max-w-4xl mx-auto px-6 md:px-8 relative z-10">
        {/* Gift box header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl">🎁</span>
            <h2 className="font-cinzel text-3xl md:text-4xl lg:text-5xl text-gold">
              THE OFFER
            </h2>
            <span className="text-4xl">🎁</span>
          </div>
          <p className="font-serif text-xl md:text-2xl text-foreground">
            Get the Full Authentic Fulani Hair Gro™ System
          </p>
        </div>

        {/* Decorative divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent mb-12" />

        {/* What's included */}
        <div className="text-center mb-10">
          <p className="font-cinzel text-lg md:text-xl text-gold mb-8">Every order comes with:</p>
          
          <div className="space-y-4 max-w-lg mx-auto">
            {bonuses.map((bonus, i) => (
              <div 
                key={i} 
                className="flex items-start gap-4 text-left bg-card/50 backdrop-blur-sm border border-gold/20 rounded-lg p-4 hover:border-gold/40 transition-colors"
              >
                <span className="text-2xl flex-shrink-0">{bonus.icon}</span>
                <div>
                  <p className="font-cinzel text-gold text-lg">{bonus.title}</p>
                  <p className="text-muted-foreground text-sm font-serif italic">
                    ({bonus.description})
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent mb-10" />

        {/* Tagline */}
        <p className="text-center font-serif text-xl md:text-2xl text-foreground/90 italic mb-10">
          "Experience my family's 400-year-old hair growth ritual."
        </p>

        {/* CTA Button */}
        <div className="text-center">
          <Button 
            onClick={handleOrderClick}
            size="lg"
            className="gold-gradient text-background font-cinzel text-lg md:text-xl px-8 md:px-12 py-6 md:py-8 hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(218,165,32,0.4)]"
          >
            <span className="mr-2">👑</span>
            YES! I WANT THE AUTHENTIC FORMULA
            <span className="ml-2">👑</span>
          </Button>

          {/* Stock warning */}
          <div className="mt-6 inline-flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-full px-4 py-2">
            <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <span className="text-destructive font-semibold text-sm">
              Only {stockCount} jars left in this batch
            </span>
          </div>
        </div>

        {/* Batch badge */}
        <div className="flex justify-center mt-8">
          <div className="bg-card border-2 border-gold/40 rounded-lg px-6 py-4 text-center">
            <p className="font-cinzel text-gold text-sm">BATCH #47</p>
            <div className="w-12 h-px bg-gold/40 mx-auto my-2" />
            <p className="text-muted-foreground text-xs">Dec 2025</p>
            <p className="font-mono text-gold text-xs mt-1">
              🫙 #XXX of 150
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
