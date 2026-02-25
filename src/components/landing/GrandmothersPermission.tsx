import { useEffect, useRef, useState } from 'react';

export const GrandmothersPermission = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const fullQuote = "";

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
      className="relative py-16 md:py-24 overflow-hidden bg-gray-50"
    >
      {/* Soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-100/50 via-transparent to-gray-100/50" />

      <div className="max-w-3xl mx-auto px-6 md:px-8 relative z-10">
        {/* Decorative aged gold frame */}
        <div className="relative">
          {/* Ornate corner decorations */}
          <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-[#B80F66]/40 rounded-tl-lg" />
          <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-[#B80F66]/40 rounded-tr-lg" />
          <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-[#B80F66]/40 rounded-bl-lg" />
          <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-[#B80F66]/40 rounded-br-lg" />

          {/* Inner decorative border */}
          <div className="absolute inset-2 border border-[#B80F66]/15 rounded-lg pointer-events-none" />

          {/* Content card */}
          <div className="bg-white rounded-xl p-8 md:p-12 border border-gray-200 shadow-sm">
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

                      </div>
        </div>
      </div>
    </section>
  );
};
