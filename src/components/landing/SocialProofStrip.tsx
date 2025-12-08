import result1 from '@/assets/results/result-1.jpg';
import result2 from '@/assets/results/result-2.jpg';
import result3 from '@/assets/results/result-3.jpg';
import result4 from '@/assets/results/result-4.jpg';
import result5 from '@/assets/results/result-5.jpg';
import result6 from '@/assets/results/result-6.jpg';
import result7 from '@/assets/results/result-7.jpg';

const customers = [
  { image: result1, name: "Amina K.", location: "Lagos" },
  { image: result2, name: "Fatima A.", location: "Abuja" },
  { image: result3, name: "Blessing N.", location: "Port Harcourt" },
  { image: result4, name: "Hajia Maryam", location: "Kano" },
  { image: result5, name: "Chioma E.", location: "Enugu" },
  { image: result6, name: "Aisha B.", location: "Kaduna" },
  { image: result7, name: "Grace O.", location: "Ibadan" },
  // Duplicate for seamless scroll
  { image: result1, name: "Amina K.", location: "Lagos" },
  { image: result2, name: "Fatima A.", location: "Abuja" },
  { image: result3, name: "Blessing N.", location: "Port Harcourt" },
  { image: result4, name: "Hajia Maryam", location: "Kano" },
  { image: result5, name: "Chioma E.", location: "Enugu" },
  { image: result6, name: "Aisha B.", location: "Kaduna" },
  { image: result7, name: "Grace O.", location: "Ibadan" },
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
