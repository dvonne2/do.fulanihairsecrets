export const ProblemAgitation = () => {
  const problems = [
    "😢 Edges disappearing despite expensive products",
    "😰 Embarrassed to style your hair up",
    "💸 Wasted money on solutions that don't work",
    "😔 Losing confidence because of thinning hair",
    "🤦‍♀️ Considering painful, expensive transplants",
    "😞 Feel like you've tried everything",
  ];

  return (
    <section className="py-16 md:py-20 royal-blue-gradient relative">
      <div className="absolute inset-0 moroccan-tile"></div>
      <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10 text-center">
        <h2 className="font-cinzel text-2xl md:text-4xl mb-8">
          <span className="text-destructive">Are You Experiencing Any of These?</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {problems.map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-background/30 border border-destructive/30">
              <span className="text-2xl">{item.split(' ')[0]}</span>
              <p className="font-sans text-base md:text-lg text-foreground/80 text-left">{item.substring(item.indexOf(' ') + 1)}</p>
            </div>
          ))}
        </div>
        <p className="font-serif text-lg md:text-xl text-gold italic">
          "If you said yes to any of these, you're exactly who we created Fulani Hair Gro™ for..."
        </p>
      </div>
    </section>
  );
};
