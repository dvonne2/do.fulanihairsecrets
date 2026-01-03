import { Button } from '@/components/ui/button';

export const HairLossTypesDiagram = () => {
  const handleDiagnoseClick = () => {
    const el = document.getElementById('order-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.hash = '#order-form';
    }
  };

  const hairLossTypes = [
    {
      type: "TYPE 1",
      label: "Normal density",
      description: "Full hairline, no visible thinning",
      qualifies: false,
      icon: "👩🏾",
      status: "Not for you"
    },
    {
      type: "TYPE 2", 
      label: "Early thinning",
      description: "Slight recession, barely noticeable",
      qualifies: false,
      icon: "👩🏾‍🦱",
      status: "Not for you"
    },
    {
      type: "TYPE 3",
      label: "Moderate loss",
      description: "Visible scalp through thinning",
      qualifies: true,
      icon: "😟",
      status: "QUALIFIES"
    },
    {
      type: "TYPE 4",
      label: "Advanced loss",
      description: "Significant bald patches",
      qualifies: true,
      icon: "😢",
      status: "QUALIFIES"
    }
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-background">
      {/* Subtle pattern */}
      <div className="absolute inset-0 arabian-pattern opacity-20" />
      
      <div className="max-w-5xl mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-cinzel text-2xl md:text-4xl text-gold mb-4">
            Which Type of Hair Loss Do You Have?
          </h2>
          <div className="w-32 h-px bg-gold/40 mx-auto" />
        </div>

        {/* Types Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {hairLossTypes.map((item, index) => (
            <div 
              key={index}
              className={`relative rounded-2xl p-4 md:p-6 text-center transition-all duration-300 hover:scale-105 ${
                item.qualifies 
                  ? 'bg-gold/10 border-2 border-gold shadow-[0_0_30px_rgba(218,165,32,0.2)]' 
                  : 'bg-card/50 border border-border/50'
              }`}
            >
              {/* Type label */}
              <p className={`font-sans text-xs tracking-widest uppercase mb-3 ${
                item.qualifies ? 'text-gold' : 'text-muted-foreground'
              }`}>
                {item.type}
              </p>

              {/* Icon/Visual */}
              <div className="text-4xl md:text-5xl mb-4">
                {item.icon}
              </div>

              {/* Description */}
              <p className={`font-serif text-sm md:text-base mb-2 ${
                item.qualifies ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                "{item.label}"
              </p>
              <p className="font-sans text-xs text-muted-foreground mb-4">
                {item.description}
              </p>

              {/* Status badge */}
              <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                item.qualifies 
                  ? 'bg-gold/20 text-gold' 
                  : 'bg-destructive/20 text-destructive'
              }`}>
                <span>{item.qualifies ? '✅' : '❌'}</span>
                <span>{item.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Visual indicator */}
        <div className="flex justify-center items-center gap-8 mb-10">
          <div className="text-center">
            <span className="text-destructive text-xl">↓</span>
            <p className="font-sans text-sm text-muted-foreground">"Too mild"</p>
          </div>
          <div className="hidden md:block w-24 h-px bg-gradient-to-r from-destructive via-muted to-gold" />
          <div className="text-center">
            <span className="text-gold text-xl">↓</span>
            <p className="font-sans text-sm text-gold font-semibold">"You need this"</p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mb-10" />

        {/* CTA Section */}
        <div className="text-center">
          <p className="font-serif text-lg text-foreground/90 mb-4">
            Not sure which type you have?
          </p>

          <Button
            onClick={handleDiagnoseClick}
            size="lg"
            className="border border-gold text-gold bg-transparent font-sans text-sm md:text-base tracking-widest uppercase px-8 py-4 hover:bg-gold/10 transition-transform duration-300"
          >
            <span className="mr-2">📸</span>
            Continue To Order Form
          </Button>
        </div>
      </div>
    </section>
  );
};
