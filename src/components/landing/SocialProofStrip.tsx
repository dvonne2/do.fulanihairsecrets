import result1 from '@/assets/results/result-1.webp';
import result2 from '@/assets/results/result-2.webp';
import result3 from '@/assets/results/result-3.webp';
import result4 from '@/assets/results/result-4.webp';
import result5 from '@/assets/results/result-5.webp';
import result6 from '@/assets/results/result-6.webp';
import result7 from '@/assets/results/result-7.webp';
import result8 from '@/assets/results/result-8.webp';
import result11 from '@/assets/results/result-11.webp';
import result12 from '@/assets/results/result-12.webp';
import result13 from '@/assets/results/result-13.webp';
import result14 from '@/assets/results/result-14.webp';
import result15 from '@/assets/results/result-15.webp';
import result16 from '@/assets/results/result-16.webp';
import result17 from '@/assets/results/result-17.webp';
import result18 from '@/assets/results/result-18.webp';
import result19 from '@/assets/results/result-19.webp';
import result20 from '@/assets/results/result-20.webp';
import result22 from '@/assets/results/result-22.webp';
import result23 from '@/assets/results/result-23.webp';
import result24 from '@/assets/results/result-24.webp';

const customers = [
  { image: result1, name: "Amina K.", location: "Lagos" },
  { image: result2, name: "Fatima A.", location: "Abuja" },
  { image: result3, name: "Blessing N.", location: "Port Harcourt" },
  { image: result4, name: "Hajia Maryam", location: "Kano" },
  { image: result5, name: "Chioma E.", location: "Enugu" },
  { image: result6, name: "Aisha B.", location: "Kaduna" },
  { image: result7, name: "Grace O.", location: "Ibadan" },
  { image: result8, name: "Mama Titi", location: "Ikoyi" },
  { image: result11, name: "Yetunde M.", location: "Ogun" },
  { image: result12, name: "Funke A.", location: "V.I. Lagos" },
  { image: result13, name: "Bimpe K.", location: "Benin" },
  { image: result14, name: "Chiamaka D.", location: "Warri" },
  { image: result16, name: "Mrs. Folake T.", location: "Victoria Island, Lagos" },
  { image: result17, name: "Zainab O.", location: "Abuja" },
  { image: result18, name: "Adeola N.", location: "Lagos" },
  { image: result19, name: "Nkechi I.", location: "Onitsha" },
  { image: result20, name: "Ifeoma C.", location: "Enugu" },
  { image: result22, name: "Adaora M.", location: "Lagos" },
  { image: result23, name: "Chika E.", location: "Benin" },
  { image: result24, name: "Nnenna O.", location: "Calabar" },
  // Duplicate for seamless scroll
  { image: result1, name: "Amina K.", location: "Lagos" },
  { image: result2, name: "Fatima A.", location: "Abuja" },
  { image: result3, name: "Blessing N.", location: "Port Harcourt" },
  { image: result4, name: "Hajia Maryam", location: "Kano" },
  { image: result5, name: "Chioma E.", location: "Enugu" },
  { image: result6, name: "Aisha B.", location: "Kaduna" },
  { image: result7, name: "Grace O.", location: "Ibadan" },
  { image: result8, name: "Mama Titi", location: "Ikoyi" },
  { image: result11, name: "Yetunde M.", location: "Ogun" },
  { image: result12, name: "Funke A.", location: "V.I. Lagos" },
  { image: result13, name: "Bimpe K.", location: "Benin" },
  { image: result14, name: "Chiamaka D.", location: "Warri" },
  { image: result16, name: "Mrs. Folake T.", location: "Victoria Island, Lagos" },
  { image: result17, name: "Zainab O.", location: "Abuja" },
  { image: result18, name: "Adeola N.", location: "Lagos" },
  { image: result19, name: "Nkechi I.", location: "Onitsha" },
  { image: result20, name: "Ifeoma C.", location: "Enugu" },
  { image: result22, name: "Adaora M.", location: "Lagos" },
  { image: result23, name: "Chika E.", location: "Benin" },
  { image: result24, name: "Nnenna O.", location: "Calabar" },
];

export const SocialProofStrip = () => {
  return (
    <section className="py-8 md:py-10 bg-background border-y border-gold/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-4 md:mb-6">
        <p className="text-center font-sans text-sm md:text-base text-[#333333] mb-2">
          <span className="text-gold font-semibold">5,247+ Nigerian women</span> have transformed their hair with us
        </p>
        <div className="max-w-3xl mx-auto rounded-2xl border border-gold/30 bg-white px-4 py-4 md:px-8 md:py-6">
          <p className="font-cinzel text-sm md:text-base tracking-[0.3em] uppercase text-gold text-center mb-3 md:mb-4">
            The Numbers That Prove Everything
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 font-sans text-sm md:text-2xl text-[#333333]">
            <p>⚫ <span className="font-semibold">91%</span> saw reduced shedding within 2 weeks</p>
            <p>⚫ <span className="font-semibold">84%</span> noticed new "baby hairs" by week 4</p>
            <p>⚫ <span className="font-semibold">78%</span> reported significantly thicker hair by week 12</p>
            <p>⚫ <span className="font-semibold">88%</span> said it was easier to use than previous treatments</p>
          </div>
          <p className="mt-3 text-center">
            <span className="inline-block bg-[#FDC52D] text-black text-sm md:text-xl px-3 py-1">
              Overall, <span className="font-semibold">84% of women</span> reported a visible improvement in their hair.
            </span>
          </p>
        </div>
      </div>
      
      {/* Auto-scrolling customer photos */}
      <div className="relative">
        {/* Gradient edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        {/* Scrolling container */}
        <div className="flex animate-scroll-left hover:pause-animation">
          {customers.map((customer, i) => (
            <div 
              key={i} 
              className="flex-shrink-0 flex flex-col items-center mx-3 md:mx-4"
            >
              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-gold/40 hover:border-gold transition-colors duration-300 group">
                <img 
                  src={customer.image} 
                  alt={`${customer.name} from ${customer.location}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <p className="font-sans text-xs text-foreground mt-2 whitespace-nowrap">{customer.name}</p>
              <p className="font-sans text-[10px] text-gold">{customer.location}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
