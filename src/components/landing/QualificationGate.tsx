import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface QualificationGateProps {
  onQualified: () => void;
}

export const QualificationGate = ({ onQualified }: QualificationGateProps) => {
  const [checks, setChecks] = useState([false, false, false]);
  const allChecked = checks.every(Boolean);

  const handleChatClick = () => {
    const message = encodeURIComponent(
      `Hi! I'm not sure if I qualify for Fulani Hair Gro™.\n\nCan you help me determine if this product is right for my hair loss situation?`
    );
    window.open(`https://wa.me/2348101594734?text=${message}`, '_blank');
  };

  const qualifications = [
    {
      id: "type3-4",
      label: "Yes, I have Type 3 or Type 4 hair loss"
    },
    {
      id: "tried-products",
      label: "Yes, I have tried multiple products with no results"
    },
    {
      id: "committed",
      label: "Yes, I am committed to the full 90-day protocol"
    }
  ];

  const conditions = [
    "Type 3 Hair Loss (Visible scalp through thinning)",
    "Type 4 Hair Loss (Significant bald patches)",
    "Chronic traction alopecia",
    "Post-partum hair loss",
    "Menopausal hair thinning",
    "Stress-induced shedding (Telogen Effluvium)"
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden" id="qualify">
      {/* Dark warning background */}
      <div 
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, hsl(var(--background)), #0a0505, hsl(var(--background)))' }}
      />

      <div className="max-w-3xl mx-auto px-4 md:px-6 relative z-10">
        {/* Stop icon */}
        <div className="text-center mb-6">
          <span className="text-6xl md:text-7xl">🚫</span>
        </div>

        {/* Header */}
        <h2 className="font-cinzel text-2xl md:text-4xl text-center text-destructive mb-4">
          STOP Before You Order
        </h2>

        {/* Divider */}
        <div className="w-full h-px bg-destructive/40 mb-10" />

        {/* Warning message */}
        <div className="text-center space-y-6 mb-10">
          <p className="font-serif text-lg md:text-xl text-foreground">
            <span className="text-gold">Fulani Hair Gro™</span> is <span className="text-destructive font-semibold">NOT</span> for everyone.
          </p>
          
          <p className="font-serif text-lg text-muted-foreground">
            This formula was designed for women with <span className="text-destructive">SERIOUS</span> hair loss:
          </p>

          {/* Conditions list */}
          <div className="bg-card/50 border border-gold/20 rounded-xl p-6 text-left max-w-md mx-auto">
            {conditions.map((condition, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <span className="text-gold">✓</span>
                <span className="font-serif text-foreground/90">{condition}</span>
              </div>
            ))}
          </div>

          <p className="font-serif text-lg text-muted-foreground italic">
            If you only have "slightly thin" hair or just want "a bit more volume,"
            <br className="hidden md:block" />
            this product is <span className="text-destructive font-semibold">TOO POTENT</span> for you.
          </p>

          <p className="font-serif text-destructive">
            We don't want to waste a jar on someone who doesn't truly need it.
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gold/40 mb-10" />

        {/* Qualification checkboxes */}
        <div className="bg-card border-2 border-gold/40 rounded-2xl p-6 md:p-8">
          <h3 className="font-sans text-sm md:text-base font-bold tracking-widest uppercase text-gold text-center mb-8">
            Do You Qualify?
          </h3>

          <div className="space-y-4 mb-8">
            {qualifications.map((qual, index) => (
              <div 
                key={qual.id}
                className="flex items-center gap-4 p-4 bg-background/50 rounded-xl border border-border/50 hover:border-gold/40 transition-colors cursor-pointer"
                onClick={() => {
                  const newChecks = [...checks];
                  newChecks[index] = !newChecks[index];
                  setChecks(newChecks);
                }}
              >
                <Checkbox 
                  id={qual.id}
                  checked={checks[index]}
                  onCheckedChange={(checked) => {
                    const newChecks = [...checks];
                    newChecks[index] = checked as boolean;
                    setChecks(newChecks);
                  }}
                  className="border-gold data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                />
                <label 
                  htmlFor={qual.id}
                  className="font-serif text-foreground cursor-pointer flex-1"
                >
                  {qual.label}
                </label>
              </div>
            ))}
          </div>

          {/* Note */}
          {!allChecked && (
            <p className="text-center text-muted-foreground text-sm mb-6 italic">
              [All boxes must be checked to proceed]
            </p>
          )}

          {/* Primary CTA */}
          <Button
            onClick={onQualified}
            disabled={!allChecked}
            size="lg"
            className={`w-full font-sans text-sm md:text-base tracking-widest uppercase py-6 transition-all duration-300 ${
              allChecked 
                ? 'gold-gradient text-background hover:scale-105 shadow-[0_0_30px_rgba(218,165,32,0.4)]' 
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            <span className="mr-2">{allChecked ? '✅' : '🔒'}</span>
            {allChecked ? "I Qualify — Show Me The Packages" : "Complete All Requirements Above"}
          </Button>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 my-6">
            <div className="h-px w-16 bg-border" />
            <span className="text-muted-foreground text-sm">OR</span>
            <div className="h-px w-16 bg-border" />
          </div>

          {/* Secondary CTA */}
          <Button
            onClick={handleChatClick}
            variant="outline"
            size="lg"
            className="w-full border-gold/40 text-gold hover:bg-gold/10 font-sans text-sm tracking-widest uppercase py-6"
          >
            <span className="mr-2">💬</span>
            Not Sure? Chat With A Specialist First
          </Button>
        </div>
      </div>
    </section>
  );
};
