import { Button } from '@/components/ui/button';

export const WhyWeRestrict = () => {
  const scrollToOrderForm = () => {
    const el = document.getElementById('order-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const reasons = [
    {
      number: "1️⃣",
      title: "LIMITED SUPPLY",
      content: "Each batch takes 6-8 weeks to prepare using traditional methods. We can only produce approximately 150 bundles per batch. Demand far exceeds supply."
    },
    {
      number: "2️⃣",
      title: "MAXIMUM POTENCY",
      content: "Our formula contains concentrated compounds that stimulate aggressive follicle regeneration. This is the strongest natural hair growth formula available."
    },
    {
      number: "3️⃣",
      title: "PROVEN RESULTS",
      content: "We have over 5,247 verified success stories. Women with serious hair loss see the most dramatic transformations with our formula."
    },
    {
      number: "4️⃣",
      title: "MY GRANDMOTHER'S LEGACY",
      content: "\"Give this to women who are suffering and need real help.\" I honor her words by delivering real results.",
      isQuote: true
    }
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0 arabian-pattern opacity-20" />
      
      <div className="max-w-3xl mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <h2 className="font-cinzel text-2xl md:text-3xl text-center text-gold mb-4">
          Why Is This Formula So Special?
        </h2>
        
        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mb-10" />

        <p className="font-serif text-lg text-center text-muted-foreground mb-10">
          Here's what makes Fulani Hair Gro™ different:
        </p>

        {/* Reasons list */}
        <div className="space-y-8 mb-12">
          {reasons.map((reason, index) => (
            <div key={index} className="bg-card/50 border border-gold/20 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <span className="text-2xl">{reason.number}</span>
                <div>
                  <h3 className="font-sans text-sm md:text-base font-bold tracking-widest uppercase text-gold mb-3">
                    {reason.title}
                  </h3>
                  <p className={`font-serif text-lg md:text-2xl text-foreground/90 leading-relaxed ${reason.isQuote ? 'italic text-gold' : ''}`}>
                    {reason.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mb-10" />

        {/* Closing message */}
        <div className="text-center space-y-6">
          <p className="font-serif text-lg text-foreground/90">
            Ready to experience the difference? <span className="text-gold font-semibold">Order yours today</span>.
          </p>

          <Button
            onClick={scrollToOrderForm}
            size="lg"
            className="gold-gradient text-background font-sans text-sm md:text-base tracking-widest uppercase px-8 py-6 hover:scale-105 transition-transform duration-300"
          >
            <span className="mr-2">🛒</span>
            Order Now
          </Button>
        </div>
      </div>
    </section>
  );
};
