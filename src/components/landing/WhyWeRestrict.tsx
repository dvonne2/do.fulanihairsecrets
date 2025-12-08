import { Button } from '@/components/ui/button';

export const WhyWeRestrict = () => {
  const handleApplyClick = () => {
    const message = encodeURIComponent(
      `Hi! I'd like to apply for a jar of Fulani Hair Gro™.\n\nI understand you're selective about who gets this formula. I believe I qualify.\n\nPlease let me know what information you need.`
    );
    window.open(`https://wa.me/2348101594734?text=${message}`, '_blank');
  };

  const reasons = [
    {
      number: "1️⃣",
      title: "LIMITED SUPPLY",
      content: "Each batch takes 6-8 weeks to prepare using traditional methods. We can only produce approximately 150 jars per batch. Demand far exceeds supply."
    },
    {
      number: "2️⃣",
      title: "POTENCY CONCERNS",
      content: "Our formula contains concentrated compounds that stimulate aggressive follicle regeneration. For someone with mild thinning, this is overkill. For someone with Type 3-4 loss, it's exactly what's needed."
    },
    {
      number: "3️⃣",
      title: "REPUTATION PROTECTION",
      content: "When someone with Type 1 thinning uses our product, they might say \"it didn't do much.\" But they didn't NEED much. When someone with Type 4 loss uses it, they're AMAZED. We'd rather have 100 amazed customers than 1,000 lukewarm ones."
    },
    {
      number: "4️⃣",
      title: "MY GRANDMOTHER'S INSTRUCTIONS",
      content: "\"Don't give this to people who don't need it. Give it to those who are suffering.\" I honor her words.",
      isQuote: true
    }
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0 arabian-pattern opacity-20" />
      
      <div className="max-w-3xl mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <h2 className="font-cinzel text-2xl md:text-3xl text-center text-gold mb-4">
          "Why Don't You Just Sell to Everyone?"
        </h2>
        
        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mb-10" />

        <p className="font-serif text-lg text-center text-muted-foreground mb-10">
          We get asked this a lot. Here's the honest answer:
        </p>

        {/* Reasons list */}
        <div className="space-y-8 mb-12">
          {reasons.map((reason, index) => (
            <div key={index} className="bg-card/50 border border-gold/20 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <span className="text-2xl">{reason.number}</span>
                <div>
                  <h3 className="font-sans text-sm font-bold tracking-widest uppercase text-gold mb-3">
                    {reason.title}
                  </h3>
                  <p className={`font-serif text-foreground/90 leading-relaxed ${reason.isQuote ? 'italic text-gold' : ''}`}>
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
            If you truly need this formula, <span className="text-gold font-semibold">we want YOU to have it</span>.
            <br />
            Not someone who will let it sit in their bathroom unused.
          </p>

          <Button
            onClick={handleApplyClick}
            size="lg"
            className="gold-gradient text-background font-sans text-sm md:text-base tracking-widest uppercase px-8 py-6 hover:scale-105 transition-transform duration-300"
          >
            <span className="mr-2">💬</span>
            Apply For A Jar — Chat With Specialist
          </Button>
        </div>
      </div>
    </section>
  );
};
