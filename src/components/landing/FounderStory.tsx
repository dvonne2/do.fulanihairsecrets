export const FounderStory = () => {
  const timeline = [
    { week: "Week 1", result: "Itching stops", icon: "✨", color: "border-blue-500/50" },
    { week: "Week 3", result: "Baby hairs appear", icon: "🌱", color: "border-success/50" },
    { week: "Week 8", result: "Visible growth", icon: "🌿", color: "border-gold/50" },
    { week: "Month 3", result: "Full restoration", icon: "👑", color: "border-gold" },
  ];

  return (
    <section className="py-16 md:py-20 bg-background relative">
      <div className="absolute inset-0 arabian-pattern"></div>
      <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12">
          <p className="font-cinzel text-sm tracking-[0.4em] uppercase text-gold mb-4">✦ The Story ✦</p>
          <h2 className="font-cinzel text-2xl md:text-4xl">
            <span className="text-foreground">How A Grandmother's</span>
            <br />
            <span className="animate-shimmer">400-Year Secret Changed Everything</span>
          </h2>
        </div>

        <div className="luxury-card rounded-3xl p-6 md:p-12 mb-8">
          {/* Founder Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center text-2xl">
              👩🏾‍🦱
            </div>
            <div>
              <p className="font-cinzel text-xl text-gold">Hajara's Story</p>
              <p className="font-sans text-xs text-muted-foreground">Founder, Fulani Hair Gro™</p>
            </div>
          </div>
          
          <div className="space-y-4 font-sans text-foreground/80 leading-relaxed">
            <p>
              <span className="font-cinzel text-3xl text-gold">"</span>After my second baby, I lost my edges completely. 
              They called it <span className="italic text-destructive">"Iya Eko"</span> — and it broke my heart.
            </p>
            <p>
              I spent <span className="text-gold font-bold">over ₦2 million</span> on products from Dubai, London, everywhere. 
              Nothing worked. I was about to book a ₦15 million hair transplant in Turkey.
            </p>
            <p>
              Then my <span className="text-gold font-bold">72-year-old grandmother</span> in Maiduguri gave me a clay pot 
              containing our family's 400-year-old secret formula...
            </p>
            <p className="text-lg md:text-xl text-foreground font-serif italic">
              Within 3 weeks, I saw baby hairs. Within 3 months, my edges were completely restored. 
              My hairdresser couldn't believe it.
            </p>
            <p>
              Today, over <span className="text-gold font-bold">100,000 women</span> have experienced the same transformation. 
              Now it's your turn.
            </p>
            <p className="font-serif italic text-gold">
              — Hajara, Founder 👑❤️
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {timeline.map((item, i) => (
            <div key={i} className={`text-center p-4 md:p-6 luxury-card rounded-xl border-2 ${item.color}`}>
              <span className="text-3xl mb-2 block">{item.icon}</span>
              <p className="font-sans text-xs tracking-widest uppercase text-gold/60 mb-1">{item.week}</p>
              <p className="font-cinzel text-base md:text-lg text-foreground">{item.result}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
