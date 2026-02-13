import { useEffect, useRef, useState } from 'react';

export const MaiduguriSecret = () => {
  const [visibleParagraphs, setVisibleParagraphs] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger paragraph reveals
            const paragraphs = [0, 1, 2, 3, 4, 5, 6];
            paragraphs.forEach((p, i) => {
              setTimeout(() => {
                setVisibleParagraphs((prev) => [...prev, p]);
              }, i * 300);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const benefits = [
    "Restore thinning edges",
    "Strengthen the hairline",
    "Keep the hair long, dark, and full",
    "Protect the scalp in harsh heat and dusty winds"
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 md:py-24 overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, hsl(var(--background)), hsl(var(--background)/0.95))'
      }}
    >
      {/* Aged paper texture overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_70%)]" />
      
      {/* Gold decorative border */}
      <div className="absolute inset-4 md:inset-8 border border-gold/20 rounded-lg pointer-events-none" />
      <div className="absolute inset-6 md:inset-12 border border-gold/10 rounded-lg pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 md:px-8 relative z-10">
        {/* Decorative Fulani pattern divider */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent to-gold/50" />
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-1 h-1 rotate-45 bg-gold/60" />
            ))}
          </div>
          <div className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent to-gold/50" />
        </div>

        {/* Secret emoji */}
        <div className="text-center mb-6">
          <span className="text-4xl md:text-5xl animate-pulse">🤫</span>
        </div>

        {/* Main headline */}
        <h2 className="font-cinzel text-2xl md:text-4xl lg:text-5xl text-center mb-2 leading-tight">
          <span className="text-gold">"The Maiduguri Hair Secret My Family</span>
          <br />
          <span className="text-gold">Guarded for 400 Years"</span>
        </h2>
        
        <p className="text-center text-muted-foreground font-serif italic text-lg md:text-xl mb-12">
          (Now in Lagos… Quietly)
        </p>

        {/* Decorative divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mb-12" />

        {/* Story content */}
        <div className="space-y-6 font-serif text-lg md:text-xl text-foreground/90 leading-relaxed">
          <p className={`transition-all duration-700 ${visibleParagraphs.includes(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Let me tell you something most people don't know:
          </p>
          
          <p className={`transition-all duration-700 ${visibleParagraphs.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="text-gold font-semibold">Fulani women don't just "have good hair."</span>
            <br />
            We use a recipe that has been protected inside families for centuries.
          </p>
          
          <p className={`transition-all duration-700 ${visibleParagraphs.includes(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            In my own family, this formula was passed from mother to daughter—
            <span className="text-gold italic"> never written down, never sold, never shared outside our lineage.</span>
          </p>
          
          <p className={`transition-all duration-700 ${visibleParagraphs.includes(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            For <span className="text-gold font-bold">400 years</span>, this exact blend of herbs from the Maiduguri bushes was used to:
          </p>

          <ul className={`space-y-3 pl-4 transition-all duration-700 ${visibleParagraphs.includes(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {benefits.map((benefit, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="text-gold">✦</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <p className={`transition-all duration-700 ${visibleParagraphs.includes(5) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="inline-block bg-[#FDC52D] text-black px-2 py-1">
              No chemicals. No lab tricks.
            </span>
            <br />
            Just the same ancient process, repeated generation after generation.
          </p>
        </div>

        {/* Decorative divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent my-12" />

        {/* Second part of story */}
        <div className={`space-y-6 font-serif text-lg md:text-xl text-foreground/90 leading-relaxed transition-all duration-700 ${visibleParagraphs.includes(6) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p>
            For a long time, this recipe wasn't available to anyone outside my home.
          </p>
          
          <p>
            But after seeing how many women were struggling with breakage, bald spots, and embarrassment…
          </p>
          
          <p className="text-gold font-semibold">
            I made the decision to bottle it—exactly as my ancestors prepared it.
          </p>
        </div>

        {/* Decorative divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent my-12" />

        {/* Gold seal quote */}
        <div className="text-center">
          {/* Wax seal effect */}
          <div className="inline-block relative mb-8">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-gold via-gold/80 to-gold/60 flex items-center justify-center shadow-[0_0_40px_rgba(218,165,32,0.4)] animate-[pulse_4s_ease-in-out_infinite]">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-gold/30 flex items-center justify-center">
                <span className="font-cinzel text-background text-xs md:text-sm font-bold text-center leading-tight">
                  AUTHENTIC<br/>FORMULA
                </span>
              </div>
            </div>
            {/* Shine effect */}
            <div className="absolute top-2 left-6 w-4 h-4 rounded-full bg-white/40 blur-sm" />
          </div>

          <blockquote className="font-cinzel text-xl md:text-2xl lg:text-3xl text-foreground mb-6 leading-relaxed">
            "This is not a copy. Not an imitation.
            <br />
            Not 'inspired by Fulani herbs.'
            <br />
            <span className="text-gold font-bold">It is THE ORIGINAL.</span>"
          </blockquote>

          <div className="space-y-1">
            <p className="font-cinzel text-gold text-lg">— Hajia Hajara</p>
            <p className="text-muted-foreground text-base md:text-lg">Founder, Fulani Hair Gro™</p>
            <p className="text-gold text-sm md:text-lg tracking-widest">Est. 1625 · Maiduguri</p>
          </div>
        </div>
      </div>
    </section>
  );
};
