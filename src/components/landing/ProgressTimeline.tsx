import result1 from '@/assets-optimized/results/result-1.webp';
import result5 from '@/assets-optimized/results/result-5.webp';
import result8 from '@/assets-optimized/results/result-8.webp';
import result10 from '@/assets-optimized/results/result-10.webp';
import result12 from '@/assets-optimized/results/result-12.webp';
import result14 from '@/assets-optimized/results/result-14.webp';

const stages = [
  { week: "Week 2", image: result1, title: "Shedding Stops", description: "Hair fall reduces by 70%. Scalp feels healthier." },
  { week: "Week 4", image: result5, title: "Baby Hairs Appear", description: "New growth visible at edges and crown." },
  { week: "Week 8", image: result12, title: "Visible Thickness", description: "Hair feels fuller. Others start noticing." },
  { week: "Week 12", image: result10, title: "Major Growth", description: "Significant length and volume gains." },
  { week: "Month 5", image: result8, title: "Full Coverage", description: "Thin spots filled in completely." },
  { week: "Month 6+", image: result14, title: "Full Transformation", description: "Complete restoration. Confidence restored." },
];

export const ProgressTimeline = () => {
  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 arabian-pattern opacity-20" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      
      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-6">
            <span className="text-gold text-sm font-bold">📅 YOUR TRANSFORMATION JOURNEY</span>
          </div>
          <h2 className="font-cinzel text-3xl md:text-5xl text-foreground mb-4">
            Month by <span className="text-gold">Month</span> Results
          </h2>
          <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
            See what happens when you commit to the Fulani Hair Gro system
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {stages.map((stage, i) => (
            <div 
              key={i}
              className="relative group"
            >
              {/* Connector line (hidden on mobile, last item) */}
              {i < stages.length - 1 && (
                <div className="hidden md:block absolute top-1/3 -right-3 w-6 h-0.5 bg-gradient-to-r from-gold to-gold/30 z-20" />
              )}
              
              <div className="rounded-2xl overflow-hidden border-2 border-gold/20 hover:border-gold/60 transition-all duration-300 bg-royal/50">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src={stage.image} 
                    alt={stage.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    decoding="async"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                  
                  {/* Week badge */}
                  <div className="absolute top-3 left-3 px-3 py-1.5 bg-gold text-background text-xs font-bold rounded-full">
                    {stage.week}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <h3 className="font-cinzel text-lg text-gold font-semibold mb-1">{stage.title}</h3>
                  <p className="font-sans text-xs text-muted-foreground">{stage.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10 md:mt-12">
          <p className="font-serif text-lg text-foreground/80 italic mb-4">
            Your Week 2 starts the moment you order
          </p>
          <a 
            href="#order-form"
            data-form-cta="true"
            className="inline-flex items-center gap-2 gold-gradient-animated text-background font-sans text-sm tracking-wider uppercase px-8 py-3 rounded-xl font-bold btn-luxury"
          >
            <span>START MY JOURNEY</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
};
