import { Button } from '@/components/ui/button';

interface ApplicationProcessProps {
  stockCount: number;
}

export const ApplicationProcess = ({ stockCount }: ApplicationProcessProps) => {
  const scrollToOrderForm = () => {
    const el = document.getElementById('order-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const steps = [
    {
      number: 'STEP 1',
      icon: '🛒',
      title: 'Order Right Now To Get Yours',
      description: 'Place your order today while stock is still available.',
    },
    {
      number: 'STEP 2',
      icon: '📞',
      title: "We'll Call You To Confirm Your Order",
      description: 'Our team will call you to confirm your details and answer any questions.',
    },
    {
      number: 'STEP 3',
      icon: '📦',
      title: "We'll Process & Send Your Product",
      description: 'Your Fulani Hair Gro™ bundle is carefully packed and dispatched.',
    },
    {
      number: 'STEP 4',
      icon: '🚚',
      title: 'Receive Your Product (1-2 Days)',
      description: 'Receive your order, inspect it, and pay on delivery.',
    },
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
              How We Work
            </h2>
          </div>
          <p className="font-serif text-sm md:text-base text-muted-foreground mb-3">
            How To Get Your Fulani Hair Gro™ — 400 Years Old Hair Grow Secret Today (BEFORE WE RUN OUT OF STOCK)
          </p>
          <div className="w-32 h-px bg-gold/40 mx-auto" />
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
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
            🚚 Pay on Delivery Available
          </p>
          <p className="font-serif text-muted-foreground">
            (Inspect package before you pay. Zero risk.)
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mb-10" />

        {/* CTA Section */}
        <div className="text-center">
          <Button
            onClick={scrollToOrderForm}
            size="lg"
            className="gold-gradient text-background font-sans text-base md:text-lg tracking-widest uppercase px-10 py-6 hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(218,165,32,0.4)]"
          >
            <span className="mr-2">🛒</span>
            Click Here To Order Now
          </Button>

          <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span>⏱️</span>
              Response time: Under 5 minutes
            </span>
            <span className="hidden md:inline">|</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              Bundles remaining: {stockCount}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
