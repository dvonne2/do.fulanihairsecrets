import result1 from '@/assets/results/result-1.webp';
import result2 from '@/assets/results/result-2.webp';
import result3 from '@/assets/results/result-3.webp';
import result4 from '@/assets/results/result-4.webp';
import result5 from '@/assets/results/result-5.webp';
import result6 from '@/assets/results/result-6.webp';
import result7 from '@/assets/results/result-7.webp';
import result8 from '@/assets/results/result-8.webp';
import result9 from '@/assets/results/result-9.webp';
import result10 from '@/assets/results/result-10.webp';
import result11 from '@/assets/results/result-11.webp';
import result12 from '@/assets/results/result-12.webp';
import result13 from '@/assets/results/result-13.webp';
import result14 from '@/assets/results/result-14.webp';

const footerImages = [result1, result2, result3, result4, result5, result6, result7, result8, result9, result10, result11, result12, result13, result14];

export const Footer = () => {
  return (
    <footer className="py-12 bg-background border-t border-gold/20">
      <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
        {/* Result Images Row */}
        <div className="mb-8">
          <p className="font-serif text-lg text-gold/80 italic mb-4">Your transformation starts today</p>
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
        
        <p className="font-sans text-xs text-gold tracking-widest mb-4">Est. 1625 · Maiduguri, Nigeria</p>
        <p className="font-serif text-foreground/60 italic mb-4">400 years of African beauty wisdom.</p>
        <p className="font-serif text-gold italic mb-6">In honour of Hajia Aissata Cissé 👑❤️</p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
          <p className="font-sans text-sm text-muted-foreground">
            📱 WhatsApp: temporarily unavailable
          </p>
          <span className="hidden md:inline text-muted-foreground">|</span>
          <p className="font-sans text-sm text-muted-foreground">
            🏦 Moniepoint: 5633783114
          </p>
        </div>

        <div className="flex items-center justify-center mb-8">
          <a
            href="#order-form"
            data-form-cta="true"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-amber-500 text-black font-cinzel text-xs md:text-sm tracking-widest uppercase px-8 md:px-10 py-3 rounded-xl font-bold shadow-[0_0_25px_rgba(218,165,32,0.3)] hover:scale-105 transition-transform"
          >
            Go To Order Form
          </a>
        </div>
        
        <div className="ornate-divider mb-6"></div>
        
        <p className="font-sans text-xs text-muted-foreground mb-2">
          © 2025 Fulani Hair Gro™. All Rights Reserved.
        </p>
        <p className="font-sans text-xs text-destructive font-bold mb-4">
          ⚠️ BEWARE OF IMITATIONS. Only purchase from official channels.
        </p>

        <p className="font-sans text-[0.7rem] text-muted-foreground mb-1 leading-snug">
          The contents of this website, text, images, products are sold or distributed by VITALVIDA.NG and protected under the Nigeria
          Copyright Act pursuant to Nigeria and International Copyright Laws. Copy/Edit/Use of our contents without my express written
          permission and you WILL be subject to the maximum fine/penalty imposed by the Law.
        </p>
        <p className="font-sans text-[0.5rem] text-muted-foreground leading-snug">
          This website is not a part of the Facebook website or Facebook Inc. FACEBOOK is a trademark of FACEBOOK, Inc.
        </p>
      </div>
    </footer>
  );
};
