import { Button } from '@/components/ui/button';

interface ApplicationProcessProps {
  stockCount: number;
}

export const ApplicationProcess = ({ stockCount }: ApplicationProcessProps) => {
  const handleStartApplication = () => {
    const message = encodeURIComponent(
      `Hi! I'd like to apply for a jar of Fulani Hair Gro™.\n\nI believe I have Type ____ hair loss.\n\nHere are photos of my current hair situation:\n[Please attach photos]`
    );
    window.open(`https://wa.me/2348101594734?text=${message}`, '_blank');
  };

  const steps = [
    {
      number: "STEP 1",
      icon: "📱",
      title: "Chat with our Hair Specialist",
      description: "Send photos of your hair loss for assessment"
    },
    {
      number: "STEP 2",
      icon: "✅",
      title: "Get approved (takes 5 mins)",
      description: "We confirm you qualify for the formula"
    },
    {
      number: "STEP 3",
      icon: "📦",
      title: "Receive your numbered jar",
      description: "Your jar is reserved and shipped"
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

        {/* Warning box */}
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-6 mb-10 text-center">
          <p className="font-sans text-sm font-bold text-destructive mb-2">
            ⚠️ We reject approximately 30% of applicants.
          </p>
          <p className="font-serif text-muted-foreground">
            If you don't qualify, we'll tell you honestly.
            <br />
            We'd rather lose a sale than waste a jar.
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mb-10" />

        {/* CTA Section */}
        <div className="text-center">
          <Button
            onClick={handleStartApplication}
            size="lg"
            className="gold-gradient text-background font-sans text-sm md:text-base tracking-widest uppercase px-10 py-6 hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(218,165,32,0.4)]"
          >
            <span className="mr-2">💬</span>
            Start Your Application
          </Button>

          <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span>⏱️</span>
              Current wait time: Under 5 minutes
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
