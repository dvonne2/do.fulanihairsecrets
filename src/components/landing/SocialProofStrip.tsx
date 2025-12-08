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

const customers = [
  { image: result1, name: "Amina K.", location: "Lagos" },
  { image: result2, name: "Fatima A.", location: "Abuja" },
  { image: result3, name: "Blessing N.", location: "Port Harcourt" },
  { image: result4, name: "Hajia Maryam", location: "Kano" },
  { image: result5, name: "Chioma E.", location: "Enugu" },
  { image: result6, name: "Aisha B.", location: "Kaduna" },
  { image: result7, name: "Grace O.", location: "Ibadan" },
  { image: result8, name: "Mama Titi", location: "Ikoyi" },
  { image: result9, name: "Hauwa B.", location: "Kaduna" },
  { image: result10, name: "Adaeze U.", location: "Owerri" },
  { image: result11, name: "Yetunde M.", location: "Ogun" },
  { image: result12, name: "Funke A.", location: "V.I. Lagos" },
  { image: result13, name: "Bimpe K.", location: "Benin" },
  { image: result14, name: "Chiamaka D.", location: "Warri" },
  { image: result15, name: "Mrs. Folake T.", location: "Ikoyi" },
  { image: result16, name: "Zainab O.", location: "Abuja" },
  { image: result17, name: "Temi A.", location: "Lekki" },
  { image: result18, name: "Adeola N.", location: "Lagos" },
  { image: result19, name: "Nkechi I.", location: "Onitsha" },
  { image: result20, name: "Ifeoma C.", location: "Enugu" },
  { image: result21, name: "Ngozi P.", location: "Owerri" },
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
  { image: result9, name: "Hauwa B.", location: "Kaduna" },
  { image: result10, name: "Adaeze U.", location: "Owerri" },
  { image: result11, name: "Yetunde M.", location: "Ogun" },
  { image: result12, name: "Funke A.", location: "V.I. Lagos" },
  { image: result13, name: "Bimpe K.", location: "Benin" },
  { image: result14, name: "Chiamaka D.", location: "Warri" },
  { image: result15, name: "Mrs. Folake T.", location: "Ikoyi" },
  { image: result16, name: "Zainab O.", location: "Abuja" },
  { image: result17, name: "Temi A.", location: "Lekki" },
  { image: result18, name: "Adeola N.", location: "Lagos" },
  { image: result19, name: "Nkechi I.", location: "Onitsha" },
  { image: result20, name: "Ifeoma C.", location: "Enugu" },
  { image: result21, name: "Ngozi P.", location: "Owerri" },
  { image: result22, name: "Adaora M.", location: "Lagos" },
  { image: result23, name: "Chika E.", location: "Benin" },
  { image: result24, name: "Nnenna O.", location: "Calabar" },
];

export const SocialProofStrip = () => {
  return (
    <section className="py-6 md:py-8 bg-background border-y border-gold/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <p className="text-center font-sans text-sm text-muted-foreground mb-4">
          <span className="text-gold font-semibold">5,247+ Nigerian women</span> have transformed their hair with us
        </p>
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
