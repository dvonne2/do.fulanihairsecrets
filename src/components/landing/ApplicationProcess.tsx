import { Button } from '@/components/ui/button';

interface ApplicationProcessProps {
  stockCount: number;
}

export const ApplicationProcess = ({ stockCount }: ApplicationProcessProps) => {
  const handleOrderClick = () => {
    const message = encodeURIComponent(
      `Hi! I'd like to order Fulani Hair Gro™.\n\nPlease send me the available packages and pricing.`
    );
    window.open(`https://wa.me/2348101594734?text=${message}`, '_blank');
  };

  const steps = [
    {
      number: "STEP 1",
      icon: "📱",
      title: "Message Us on WhatsApp",
      description: "Tell us which package you want"
    },
    {
      number: "STEP 2",
      icon: "✅",
      title: "Confirm Your Order",
      description: "We'll confirm availability and delivery details"
    },
    {
      number: "STEP 3",
      icon: "📦",
      title: "Receive Your Jar",
      description: "Pay on delivery - inspect before you pay"
    }
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0 arabian-pattern opacity-20" />
      
      <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-3xl">📋</span>
            <h2 className="font-cinzel text-2xl md:text-3xl text-gold">
              How To Get Your Jar
            </h2>
          </div>
          <div className="w-32 h-px bg-gold/40 mx-auto" />
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="bg-card border border-gold/30 rounded-2xl p-6 text-center hover:border-gold/60 transition-colors"
            >
              <p className="font-sans text-xs tracking-widest uppercase text-muted-foreground mb-4">
                {step.number}
              </p>
              <span className="text-4xl md:text-5xl block mb-4">{step.icon}</span>
              <h3 className="font-cinzel text-lg text-gold mb-2">{step.title}</h3>
              <p className="font-serif text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Info box */}
        <div className="bg-gold/10 border border-gold/30 rounded-xl p-6 mb-10 text-center">
          <p className="font-sans text-sm font-bold text-gold mb-2">
            🚚 Pay On Delivery Available Nationwide
          </p>
          <p className="font-serif text-muted-foreground">
            Inspect your products before you pay.
            <br />
            Same-day delivery in Lagos, 2-3 days nationwide.
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mb-10" />

        {/* CTA Section */}
        <div className="text-center">
          <Button
            onClick={handleOrderClick}
            size="lg"
            className="gold-gradient text-background font-sans text-sm md:text-base tracking-widest uppercase px-10 py-6 hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(218,165,32,0.4)]"
          >
            <span className="mr-2">💬</span>
            Order Now on WhatsApp
          </Button>

          <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span>⏱️</span>
              Response time: Under 5 minutes
            </span>
            <span className="hidden md:inline">|</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              Jars remaining: {stockCount}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
