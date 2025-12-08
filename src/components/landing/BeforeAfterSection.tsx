import result1 from '@/assets/results/result-1.jpg';
import result2 from '@/assets/results/result-2.jpg';
import result3 from '@/assets/results/result-3.jpg';
import result4 from '@/assets/results/result-4.jpg';
import result5 from '@/assets/results/result-5.jpg';
import result6 from '@/assets/results/result-6.jpg';
import result8 from '@/assets/results/result-8.jpg';
import result9 from '@/assets/results/result-9.jpg';
import result10 from '@/assets/results/result-10.jpg';
import result11 from '@/assets/results/result-11.jpg';
import result12 from '@/assets/results/result-12.jpg';
import result14 from '@/assets/results/result-14.jpg';
import result15 from '@/assets/results/result-15.jpg';
import result16 from '@/assets/results/result-16.jpg';
import result19 from '@/assets/results/result-19.jpg';
import result20 from '@/assets/results/result-20.jpg';
import result21 from '@/assets/results/result-21.jpg';
import result22 from '@/assets/results/result-22.jpg';

const transformations = [
  { after: result1, name: "Amina K.", problem: "Severe traction alopecia from braids", duration: "12 weeks" },
  { after: result2, name: "Fatima A.", problem: "Postpartum hair loss", duration: "8 weeks" },
  { after: result3, name: "Blessing N.", problem: "Chemical damage from relaxer", duration: "16 weeks" },
  { after: result4, name: "Hajia Maryam", problem: "Age-related thinning", duration: "10 weeks" },
  { after: result5, name: "Chioma E.", problem: "Stress-induced hair loss", duration: "6 weeks" },
  { after: result6, name: "Aisha B.", problem: "Crown thinning from styling", duration: "14 weeks" },
  { after: result8, name: "Mama Titi", problem: "Menopausal hair changes", duration: "20 weeks" },
  { after: result9, name: "Hauwa B.", problem: "Heat damage recovery", duration: "12 weeks" },
  { after: result10, name: "Adaeze U.", problem: "TWA growth journey", duration: "24 weeks" },
  { after: result11, name: "Yetunde M.", problem: "Edge restoration", duration: "10 weeks" },
  { after: result12, name: "Funke A.", problem: "Edges from tight styles", duration: "2 months" },
  { after: result14, name: "Chiamaka D.", problem: "Overall thinning", duration: "16 weeks" },
  { after: result15, name: "Mrs. Folake T.", problem: "Hormonal hair loss", duration: "18 weeks" },
  { after: result16, name: "Zainab O.", problem: "Styling damage repair", duration: "14 weeks" },
  { after: result19, name: "Nkechi I.", problem: "Breakage from extensions", duration: "10 weeks" },
  { after: result20, name: "Ifeoma C.", problem: "Dry, brittle hair", duration: "12 weeks" },
  { after: result21, name: "Ngozi P.", problem: "Thinning crown area", duration: "16 weeks" },
  { after: result22, name: "Adaora M.", problem: "Natural hair growth", duration: "20 weeks" },
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
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-success text-background text-[10px] font-bold rounded">
                      AFTER
                    </div>
                  </div>
                </div>
                
                {/* Duration badge */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 px-4 py-2 bg-gold text-background text-xs font-bold rounded-full shadow-lg z-10">
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
            href="#order"
            className="inline-flex items-center gap-2 gold-gradient-animated text-background font-sans text-sm tracking-wider uppercase px-8 py-3 rounded-xl font-bold btn-luxury"
          >
            <span>GET MY TRANSFORMATION</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
};
