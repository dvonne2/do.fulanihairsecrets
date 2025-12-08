import result1 from '@/assets/results/result-1.jpg';
import result2 from '@/assets/results/result-2.jpg';
import result3 from '@/assets/results/result-3.jpg';
import result4 from '@/assets/results/result-4.jpg';
import result5 from '@/assets/results/result-5.jpg';
import result6 from '@/assets/results/result-6.jpg';
import result7 from '@/assets/results/result-7.jpg';

const footerImages = [result1, result2, result3, result4, result5, result6, result7];

export const Footer = () => {
  return (
    <footer className="py-12 bg-background border-t border-gold/20">
      <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
        {/* Result Images Row */}
        <div className="mb-8">
          <p className="font-serif text-sm text-gold/80 italic mb-4">Your transformation starts today</p>
          <div className="flex justify-center gap-2 md:gap-3 flex-wrap">
            {footerImages.map((img, i) => (
              <div 
                key={i} 
                className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-gold/40 hover:border-gold transition-colors duration-300"
              >
                <img 
                  src={img} 
                  alt={`Happy customer ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="ornate-divider mb-6"></div>
        
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center">
            <span className="font-cinzel text-background font-bold text-lg">F</span>
          </div>
          <div>
            <div className="font-cinzel text-xl tracking-widest">
              <span className="text-foreground">FULANI</span>
              <span className="text-gold"> HAIR GRO™</span>
            </div>
          </div>
        </div>
        
        <p className="font-sans text-xs text-gold/60 tracking-widest mb-4">Est. 1625 · Maiduguri, Nigeria</p>
        <p className="font-serif text-foreground/60 italic mb-4">400 years of African beauty wisdom.</p>
        <p className="font-serif text-gold italic mb-6">In honour of Hajia Aissata Cissé 👑❤️</p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
          <a 
            href="https://wa.me/2348101594734"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-sm text-success hover:text-success/80 transition-colors"
          >
            📱 WhatsApp: 08101594734
          </a>
          <span className="hidden md:inline text-muted-foreground">|</span>
          <p className="font-sans text-sm text-muted-foreground">
            🏦 Moniepoint: 5633783114
          </p>
        </div>
        
        <div className="ornate-divider mb-6"></div>
        
        <p className="font-sans text-xs text-muted-foreground mb-2">
          © 2025 Fulani Hair Gro™. All Rights Reserved.
        </p>
        <p className="font-sans text-xs text-destructive font-bold">
          ⚠️ BEWARE OF IMITATIONS. Only purchase from official channels.
        </p>
      </div>
    </footer>
  );
};
