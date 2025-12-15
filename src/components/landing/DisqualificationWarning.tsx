import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DisqualificationWarningProps {
  stockCount: number;
}

export const DisqualificationWarning = ({ stockCount }: DisqualificationWarningProps) => {
  const scrollToOrderForm = () => {
    const el = document.getElementById('order-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      {/* Dark red/black warning background */}
      <div 
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, #1a0000, #0a0000)' }}
      />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10 arabian-pattern" />

      <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
        {/* Warning card */}
        <div className="bg-card/80 backdrop-blur-sm border-2 border-destructive/60 rounded-2xl p-6 md:p-10 shadow-[0_0_50px_rgba(220,38,38,0.2)]">
          {/* Warning header */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-destructive animate-pulse" />
            <h2 className="font-sans text-lg md:text-xl font-bold tracking-widest uppercase text-destructive">
              Important Notice
            </h2>
            <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-destructive animate-pulse" />
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-destructive/40 mb-8" />

          {/* Main warning content */}
          <div className="text-center space-y-6">
            <h3 className="font-cinzel text-2xl md:text-3xl lg:text-4xl text-foreground">
              <span className="text-gold">Fulani Hair Gro™</span> Is For Women With...
            </h3>
            
            <p className="font-serif text-xl md:text-2xl text-foreground/90">
              <span className="text-destructive font-semibold">Serious Hair Loss</span> Who Want Real Results
            </p>
            
            <p className="font-serif text-lg text-muted-foreground">
              Our potent Maiduguri formula delivers <span className="text-gold font-semibold">MAXIMUM STRENGTH</span> hair restoration.
            </p>

            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 md:p-6">
              <p className="font-serif text-foreground/90">
                We currently have <span className="text-gold font-bold">{stockCount} bundles</span> remaining from this batch.
                <br />
                <span className="text-gold font-semibold">Order now before they sell out!</span>
              </p>
            </div>

            {/* Symptoms grid */}
            <div className="mt-8 text-left">
              <h4 className="font-cinzel text-lg md:text-xl text-gold text-center mb-4">
                Reverse It Quick... Here Are Some Symptoms You Might Experience!
              </h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-foreground/90">
                {[
                  'Excessive hair shedding',
                  'Thinning hair',
                  'Receding hairline',
                  'Bald patches',
                  'Widening part',
                  'Miniaturized hair',
                  'Scalp visibility',
                  'Hair breakage',
                  'Itchy scalp',
                  'Scalp tenderness',
                  'Excessive dandruff',
                  'Changes in hair texture',
                  'Slowed hair growth',
                  'Loose hair strands',
                  'Hair loss on other body parts',
                  'Emotional distress',
                ].map((symptom) => (
                  <div key={symptom} className="flex items-start gap-2">
                    <span className="mt-[2px] text-destructive">•</span>
                    <span className="font-serif">{symptom}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-destructive/40 my-8" />

          {/* CTA section */}
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-2 text-gold">
              <span className="text-2xl">🛒</span>
              <h4 className="font-sans text-sm md:text-base font-bold tracking-widest uppercase">
                Ready To Transform Your Hair?
              </h4>
            </div>

            <p className="font-serif text-lg text-foreground/90">
              Get your bundle of <span className="text-gold">Fulani Hair Gro™</span> today
              <br className="hidden md:block" />
              and start your transformation journey.
            </p>

            {/* CTA Button */}
            <Button
              onClick={scrollToOrderForm}
              size="lg"
              className="gold-gradient text-background font-sans text-sm md:text-base tracking-widest uppercase px-8 py-6 hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(218,165,32,0.4),0_0_60px_rgba(220,38,38,0.2)]"
            >
              <span className="mr-2">�</span>
              Order Now — ₦66,750
            </Button>

            {/* Response time */}
            <p className="font-sans text-sm text-muted-foreground flex items-center justify-center gap-2">
              <span>⏱️</span>
              Average response time: Under 5 minutes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
