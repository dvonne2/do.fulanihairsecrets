import result1 from '@/assets/results/result-1.webp';
import result2 from '@/assets/results/result-2.webp';
import result3 from '@/assets/results/result-3.webp';
import result4 from '@/assets/results/result-4.webp';
import result5 from '@/assets/results/result-5.webp';
import result6 from '@/assets/results/result-6.webp';
import result8 from '@/assets/results/result-8.webp';
import result11 from '@/assets/results/result-11.webp';
import result12 from '@/assets/results/result-12.webp';
import result14 from '@/assets/results/result-14.webp';
import result16 from '@/assets/results/result-16.webp';
import result17 from '@/assets/results/result-17.webp';
import result19 from '@/assets/results/result-19.webp';
import result20 from '@/assets/results/result-20.webp';
import result22 from '@/assets/results/result-22.webp';
import fourteenDayCollage from '@/assets/products/before-and-after-14-days-2013x2048.webp';

const transformations = [
  {
    after: result1,
    name: "Amina K.",
    problem: "Severe traction alopecia from braids",
    duration: "3 months",
    caption: "Edges filled back in after 3 months of gentle Fulani Hair Gro routine."
  },
  {
    after: result2,
    name: "Fatima A.",
    problem: "Postpartum hair loss",
    duration: "2 months",
    caption: "Post-baby shedding calmed and volume returned in just 2 months."
  },
  {
    after: result3,
    name: "Blessing N.",
    problem: "Chemical damage from relaxer",
    duration: "4 months",
    caption: "Relaxer-damaged hair looks fuller and healthier after 4 months."
  },
  {
    after: result4,
    name: "Hajia Maryam",
    problem: "Age-related thinning",
    duration: "2.5 months",
    caption: "Age-related thinning softened and density improved in 2½ months."
  },
  {
    after: result5,
    name: "Chioma E.",
    problem: "Stress-induced hair loss",
    duration: "1.5 months",
    caption: "Stress breakage reduced and hairline looks stronger in 6 weeks."
  },
  {
    after: result6,
    name: "Aisha B.",
    problem: "Crown thinning from styling",
    duration: "3.5 months",
    caption: "Thin crown filled in gradually over 3½ months of consistent use."
  },
  {
    after: result8,
    name: "Mama Titi",
    problem: "Menopausal hair changes",
    duration: "5 months",
    caption: "Menopause-related thinning improved with steady growth over 5 months."
  },
  {
    after: result11,
    name: "Yetunde M.",
    problem: "Edge restoration",
    duration: "2.5 months",
    caption: "Bald edges now covered with new growth in about 10 weeks."
  },
  {
    after: result12,
    name: "Funke A.",
    problem: "Edges from tight styles",
    duration: "2 months",
    caption: "Tight-style damage reversed and edges look fuller in 2 months."
  },
  {
    after: result14,
    name: "Chiamaka D.",
    problem: "Overall thinning",
    duration: "4 months",
    caption: "Overall thinning replaced with thicker strands over 4 months."
  },
  {
    after: result16,
    name: "Mrs. Folake T.",
    problem: "Hormonal hair loss",
    duration: "4.5 months",
    caption: "Hormonal shedding slowed and fullness returned in 4½ months."
  },
  {
    after: result17,
    name: "Zainab O.",
    problem: "Styling damage repair",
    duration: "3.5 months",
    caption: "Broken, over-styled hair looks smoother and denser after 3½ months."
  },
  {
    after: result19,
    name: "Nkechi I.",
    problem: "Breakage from extensions",
    duration: "2.5 months",
    caption: "Extension breakage reduced and length retained in about 10 weeks."
  },
  {
    after: result20,
    name: "Ifeoma C.",
    problem: "Dry, brittle hair",
    duration: "3 months",
    caption: "Dry, brittle strands now softer and fuller after 3 months."
  },
  {
    after: result22,
    name: "Adaora M.",
    problem: "Natural hair growth",
    duration: "5 months",
    caption: "Slow natural growth sped up with visible length in 5 months."
  },
];

export const BeforeAfterSection = () => {
  return (
    <section className="py-16 md:py-24 bg-royal relative overflow-hidden">
      <div className="absolute inset-0 moroccan-tile opacity-20" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-6">
            <span className="text-gold text-sm font-bold">✨ BEFORE & AFTER</span>
          </div>
          <h2 className="font-cinzel text-3xl md:text-5xl text-foreground mb-4">
            From <span className="text-destructive">Struggling</span> to <span className="text-gold">Stunning</span>
          </h2>
          <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
            Real transformations. No filters. No photoshop. Just pure results.
          </p>
        </div>

        {/* Featured 14-day transformation */}
        <div className="mb-8 md:mb-10">
          <div className="rounded-2xl overflow-hidden border-2 border-gold/60 bg-background/10">
            <img
              src={fourteenDayCollage}
              alt="Dramatic 14-day before and after hair growth transformation collage"
              className="w-full h-full object-cover"
              loading="lazy"
              width={1200}
              height={600}
            />
          </div>
        </div>

        {/* Before/After Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transformations.map((item, i) => (
            <div 
              key={i}
              className="group rounded-2xl overflow-hidden border-2 border-gold/20 hover:border-gold/60 transition-all duration-300 bg-background/10 backdrop-blur-sm"
            >
              {/* Before/After Compare */}
              <div className="relative">
                <div className="grid grid-cols-2">
                  {/* Before placeholder */}
                  <div className="relative aspect-square bg-muted flex items-center justify-center border-r border-gold/20">
                    <div className="text-center p-4">
                      <span className="text-4xl mb-2 block">😔</span>
                      <p className="font-sans text-xs text-muted-foreground">{item.problem}</p>
                    </div>
                    <div className="absolute top-2 left-2 px-2 py-1 bg-destructive/80 text-foreground text-[10px] font-bold rounded">
                      BEFORE
                    </div>
                  </div>
                  
                  {/* After image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img 
                      src={item.after} 
                      alt={`${item.name} after transformation`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width={600}
                      height={600}
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-success text-background text-[10px] font-bold rounded">
                      AFTER
                    </div>
                  </div>
                </div>
                
                {/* Duration badge */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 px-4 py-2 bg-gold text-background text-2xl md:text-3xl font-bold rounded-full shadow-lg z-10">
                  {item.duration}
                </div>
              </div>
              
              {/* Info */}
              <div className="p-4 pt-6 text-center">
                <p className="font-cinzel text-lg text-gold font-semibold">{item.name}</p>
                <div className="flex justify-center gap-0.5 mt-2">
                  {Array(5).fill(0).map((_, j) => (
                    <span key={j} className="text-gold text-sm">★</span>
                  ))}
                </div>
                <p className="font-serif text-lg md:text-xl text-foreground/90 mt-3 max-w-xs mx-auto">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="font-serif text-lg text-foreground/80 italic mb-4">
            Your "after" photo is waiting to be taken
          </p>
          <a 
            href="#order-form"
            data-form-cta="true"
            className="inline-flex items-center gap-2 gold-gradient text-background font-sans text-sm tracking-wider uppercase px-8 py-3 rounded-xl font-bold btn-luxury"
          >
            <span>Order Now</span>
          </a>
        </div>
      </div>
    </section>
  );
};
