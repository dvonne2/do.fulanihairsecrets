import { useEffect, useRef, useState } from 'react';

export const GrandmothersPermission = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const fullQuote = `"When I told my grandmother I wanted to share our family's formula with other women, she was silent for a long time.

Then she looked at me and said:

'If you do this, do it right. Do not let them change it. Do not let them add chemicals. Do not let anyone mass-produce it in a factory.

If our secret helps other women feel beautiful, then you have my blessing.'

That conversation changed everything.

Now, every bundle I make honors her words."`;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!isVisible) return;
    
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullQuote.length) {
        setTypedText(fullQuote.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 25);

    return () => clearInterval(timer);
  }, [isVisible, fullQuote]);

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 md:py-24 overflow-hidden bg-[#333333]"
    >
      {/* Soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-gold/5" />

      <div className="max-w-3xl mx-auto px-6 md:px-8 relative z-10">
        {/* Decorative aged gold frame */}
        <div className="relative">
          {/* Ornate corner decorations */}
          <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-gold/60 rounded-tl-lg" />
          <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-gold/60 rounded-tr-lg" />
          <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-gold/60 rounded-bl-lg" />
          <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-gold/60 rounded-br-lg" />

          {/* Inner decorative border */}
          <div className="absolute inset-2 border border-gold/20 rounded-lg pointer-events-none" />

          {/* Content card */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-8 md:p-12 border border-gold/10">
            {/* Quote content with typewriter effect */}
            <div 
              className="font-serif text-xl md:text-2xl text-foreground/90 leading-relaxed whitespace-pre-line min-h-[400px]"
              style={{ fontStyle: 'italic' }}
            >
              {isVisible ? (
                <>
                  {typedText}
                  <span className="animate-pulse text-gold">|</span>
                </>
              ) : (
                <span className="opacity-0">{fullQuote}</span>
              )}
            </div>

            {/* Memorial section */}
            <div className={`mt-12 pt-8 border-t border-gold/20 text-center transition-all duration-1000 delay-[8000ms] ${typedText.length >= fullQuote.length ? 'opacity-100' : 'opacity-0'}`}>
              <p className="font-serif text-muted-foreground text-base md:text-lg mb-2">In loving memory of</p>
              <p className="font-cinzel text-gold text-xl md:text-2xl mb-1">
                Hajia Aissata Cissé 👑❤️
              </p>
              <p className="font-serif text-muted-foreground italic text-base md:text-lg">
                My grandmother. My teacher. My reason.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
