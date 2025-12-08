import result1 from '@/assets/results/result-1.jpg';
import result2 from '@/assets/results/result-2.jpg';
import result3 from '@/assets/results/result-3.jpg';
import result4 from '@/assets/results/result-4.jpg';
import result5 from '@/assets/results/result-5.jpg';
import result6 from '@/assets/results/result-6.jpg';
import result7 from '@/assets/results/result-7.jpg';
import result8 from '@/assets/results/result-8.jpg';
import result9 from '@/assets/results/result-9.jpg';
import result10 from '@/assets/results/result-10.jpg';
import result11 from '@/assets/results/result-11.jpg';
import result12 from '@/assets/results/result-12.jpg';
import result13 from '@/assets/results/result-13.jpg';
import result14 from '@/assets/results/result-14.jpg';
import result15 from '@/assets/results/result-15.jpg';
import result16 from '@/assets/results/result-16.jpg';
import result17 from '@/assets/results/result-17.png';
import result18 from '@/assets/results/result-18.jpg';
import result19 from '@/assets/results/result-19.jpg';
import result20 from '@/assets/results/result-20.jpg';
import result21 from '@/assets/results/result-21.jpg';
import result22 from '@/assets/results/result-22.jpg';
import result23 from '@/assets/results/result-23.jpg';
import result24 from '@/assets/results/result-24.jpg';

const transformations = [
  { image: result1, name: "Amina K.", location: "Lagos", duration: "3 months", highlight: "Edges fully restored" },
  { image: result2, name: "Fatima A.", location: "Abuja", duration: "6 months", highlight: "Triple the volume" },
  { image: result3, name: "Blessing N.", location: "Port Harcourt", duration: "4 months", highlight: "Length retention" },
  { image: result4, name: "Hajia Maryam", location: "Kano", duration: "5 months", highlight: "Healthy gray growth" },
  { image: result5, name: "Chioma E.", location: "Enugu", duration: "3 months", highlight: "Thickness restored" },
  { image: result6, name: "Aisha B.", location: "Kaduna", duration: "4 months", highlight: "Crown fullness" },
  { image: result7, name: "Grace O.", location: "Ibadan", duration: "2 months", highlight: "Breakage stopped" },
  { image: result8, name: "Mama Titi", location: "Ikoyi", duration: "8 months", highlight: "Silver queen goals" },
  { image: result9, name: "Hauwa B.", location: "Kaduna", duration: "5 months", highlight: "Gray hair thriving" },
  { image: result10, name: "Adaeze U.", location: "Owerri", duration: "4 months", highlight: "Massive volume" },
  { image: result11, name: "Yetunde M.", location: "Ogun", duration: "6 months", highlight: "Protective styling" },
  { image: result12, name: "Funke A.", location: "V.I. Lagos", duration: "3 months", highlight: "Sleek edges" },
  { image: result13, name: "Bimpe K.", location: "Benin", duration: "7 months", highlight: "Kinks growth" },
  { image: result14, name: "Chiamaka D.", location: "Warri", duration: "4 months", highlight: "Full afro" },
  { image: result15, name: "Mrs. Folake T.", location: "Ikoyi", duration: "5 months", highlight: "Elegant fullness" },
  { image: result16, name: "Zainab O.", location: "Abuja", duration: "4 months", highlight: "Luxurious volume" },
  { image: result17, name: "Temi A.", location: "Lekki", duration: "6 months", highlight: "Silky length" },
  { image: result18, name: "Adeola N.", location: "Lagos", duration: "3 months", highlight: "Edge restoration" },
  { image: result19, name: "Nkechi I.", location: "Onitsha", duration: "4 months", highlight: "Natural thickness" },
  { image: result20, name: "Ifeoma C.", location: "Enugu", duration: "5 months", highlight: "Healthy shine" },
  { image: result21, name: "Ngozi P.", location: "Owerri", duration: "3 months", highlight: "Complete system" },
  { image: result22, name: "Adaora M.", location: "Lagos", duration: "6 months", highlight: "Massive afro" },
  { image: result23, name: "Chika E.", location: "Benin", duration: "4 months", highlight: "Volume boost" },
  { image: result24, name: "Nnenna O.", location: "Calabar", duration: "8 months", highlight: "Length goals" },
];

export const TransformationGallery = () => {
  return (
    <section className="py-16 md:py-24 bg-royal relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 arabian-pattern opacity-30" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-6">
            <span className="text-gold text-sm font-bold">📸 REAL RESULTS</span>
          </div>
          <h2 className="font-cinzel text-3xl md:text-5xl text-foreground mb-4">
            <span className="animate-shimmer">Transformation Gallery</span>
          </h2>
          <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
            Real women. Real results. Unedited photos from verified customers across Nigeria.
          </p>
        </div>

        {/* Masonry-style Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {transformations.map((item, i) => (
            <div 
              key={i} 
              className={`group relative rounded-2xl overflow-hidden border-2 border-gold/20 hover:border-gold/60 transition-all duration-500 ${
                i === 0 || i === 3 ? 'md:row-span-2' : ''
              }`}
            >
              <div className={`relative ${i === 0 || i === 3 ? 'aspect-[3/5]' : 'aspect-[3/4]'}`}>
                <img 
                  src={item.image} 
                  alt={`${item.name} - ${item.highlight}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
                
                {/* Duration badge */}
                <div className="absolute top-3 right-3 px-2 py-1 bg-success/90 text-background text-xs font-bold rounded-full">
                  {item.duration}
                </div>
                
                {/* Customer info */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-cinzel text-lg text-gold font-semibold">{item.name}</p>
                  <p className="font-sans text-xs text-muted-foreground mb-1">{item.location}</p>
                  <p className="font-sans text-sm text-foreground italic">"{item.highlight}"</p>
                </div>
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gold/5" />
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-gold/20 to-transparent" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="mt-12 md:mt-16 p-6 md:p-8 rounded-2xl bg-background/20 border border-gold/30 backdrop-blur-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "5,247+", label: "Happy Customers" },
              { value: "97%", label: "See Results in 30 Days" },
              { value: "4.9★", label: "Average Rating" },
              { value: "<0.3%", label: "Refund Rate" },
            ].map((stat, i) => (
              <div key={i}>
                <p className="font-cinzel text-2xl md:text-3xl text-gold font-bold">{stat.value}</p>
                <p className="font-sans text-xs md:text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10 md:mt-12">
          <p className="font-serif text-lg text-foreground/80 italic mb-6">
            Ready to be our next success story?
          </p>
          <a 
            href="#order"
            className="inline-flex items-center gap-3 gold-gradient-animated text-background font-sans text-base tracking-wider uppercase px-10 py-4 rounded-xl font-bold btn-luxury animate-glow"
          >
            <span>👑</span>
            <span>START MY TRANSFORMATION</span>
            <span>👑</span>
          </a>
        </div>
      </div>
    </section>
  );
};
