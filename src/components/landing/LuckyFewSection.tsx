import { useEffect, useState } from 'react';

interface LuckyFewSectionProps {
  stockCount: number;
}

export const LuckyFewSection = ({ stockCount }: LuckyFewSectionProps) => {
  const [availability, setAvailability] = useState({
    starter: 12,
    complete: 8,
    sixMonth: 7
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setAvailability(prev => ({
          starter: Math.max(3, prev.starter - (Math.random() > 0.7 ? 1 : 0)),
          complete: Math.max(2, prev.complete - (Math.random() > 0.6 ? 1 : 0)),
          sixMonth: Math.max(1, prev.sixMonth - (Math.random() > 0.5 ? 1 : 0))
        }));
      }
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* VIP gold gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-gold/5 to-background" />
      
      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-6 md:px-8 relative z-10">
        {/* Crown icon */}
        <div className="text-center mb-6">
          <span className="text-5xl md:text-6xl">👑</span>
        </div>

        {/* Main headline */}
        <h2 className="font-cinzel text-2xl md:text-4xl lg:text-5xl text-center mb-8 text-gold">
          "You're One of the Lucky Few"
        </h2>

        {/* Decorative divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mb-10" />

        {/* Exclusivity message */}
        <div className="space-y-6 font-serif text-lg md:text-xl text-foreground/90 leading-relaxed text-center mb-12">
          <p>
            Right now, you're seeing this page.
          </p>
          <p className="text-gold">
            That means there's still stock available from the current batch.
          </p>
          <p className="text-muted-foreground">
            Most people who want Fulani Hair Gro™ are told to <span className="text-destructive">"join the waitlist."</span>
            <br />
            Most batches sell out within days of being ready.
            <br />
            Most women never even get the chance to order.
          </p>
          <p className="text-xl md:text-2xl text-foreground font-semibold">
            But you're here. <span className="text-gold">Right now.</span> While it's available.
          </p>
        </div>

        {/* Warning message */}
        <div className="text-center space-y-4 font-serif text-lg text-foreground/80">
          <p>
            Don&apos;t be the woman who "comes back later" and finds the page
            <br className="hidden md:block" />
            showing <span className="text-destructive font-bold">"PROMO HAS ENDED"</span>
          </p>
          <p className="text-muted-foreground italic">
            That woman messages us every single day asking when the next promo will be.
          </p>
          <p className="text-gold font-semibold text-xl">
            Don&apos;t be her. Secure yours now.
          </p>
        </div>

        {/* Waitlist warning badge */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-2">
            <p className="text-destructive text-sm font-semibold">
              ⚠️ If this batch sells out, the waitlist is currently 847 women long.
              <br />
              <span className="text-muted-foreground font-normal">Average wait time: 4-6 weeks.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
