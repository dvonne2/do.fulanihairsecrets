import result1 from '@/assets-optimized/results/result-1.webp';
import result2 from '@/assets-optimized/results/result-2.webp';
import result3 from '@/assets-optimized/results/result-3.webp';
import result4 from '@/assets-optimized/results/result-4.webp';
import result5 from '@/assets-optimized/results/result-5.webp';
import result6 from '@/assets-optimized/results/result-6.webp';
import result7 from '@/assets-optimized/results/result-7.webp';
import result8 from '@/assets-optimized/results/result-8.webp';
import result9 from '@/assets-optimized/results/result-9.webp';
import result10 from '@/assets-optimized/results/result-10.webp';
import result11 from '@/assets-optimized/results/result-11.webp';
import result12 from '@/assets-optimized/results/result-12.webp';
import result13 from '@/assets-optimized/results/result-13.webp';
import result14 from '@/assets-optimized/results/result-14.webp';

const footerImages = [result1, result2, result3, result4, result5, result6, result7, result8, result9, result10, result11, result12, result13, result14];

export const Footer = () => {
  return (
    <footer className="py-12 border-t border-gray-200 footer-green">
      <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
        {/* Result Images Row */}
        <div className="mb-8">
          <p className="font-sans text-lg text-[#B80F66] italic mb-4">Your transformation starts today</p>
          <div className="flex justify-center gap-2 md:gap-3 flex-wrap">
            {footerImages.map((img, i) => (
              <div 
                key={i} 
                className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-gray-300 hover:border-[#B80F66] transition-colors duration-300"
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

        <div className="w-full h-px bg-gray-200 mb-6"></div>
        
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#B80F66] flex items-center justify-center">
            <span className="font-sans text-white font-bold text-lg">F</span>
          </div>
          <div>
            <div className="font-sans text-lg font-bold tracking-widest">
              <span className="text-gray-900">FULANI</span>
              <span className="text-[#B80F66]"> HAIR GRO™</span>
            </div>
          </div>
        </div>
        
        <p className="font-sans text-xs text-[#B80F66] tracking-widest mb-4">Maiduguri, Nigeria</p>
        <p className="font-sans text-gray-500 italic mb-4">400 years of African beauty wisdom.</p>
        <p className="font-sans text-[#B80F66] italic mb-6">In honour of Hajia Aissata Cissé 👑❤️</p>
        
        <div className="text-center space-y-2 mb-6">
          <p className="font-sans text-xs text-gray-500 leading-relaxed">
            This Site Is Not A Part Of The Facebook Website Or Facebook Inc. Additionally, This Site Is Not Endorsed By Facebook In Any Way. FACEBOOK Is A Trademark Of FACEBOOK, Inc.
          </p>
          <p className="font-sans text-xs text-gray-500">
            © 2025, Fulani Hair Gro | Policy | Terms
          </p>
          <p className="font-sans text-xs text-gray-500 leading-relaxed">
            The contents of this website, text, images, products are sold or distributed by Fulani Hair Gro and protected under the Nigeria Copyright Act pursuant to Nigeria and International Copyright Laws. Copy/Edit/Use of our contents without my express written permission and you WILL be subject to the maximum fine/penalty imposed by the Law.
          </p>
        </div>
        
        <div className="flex items-center justify-center mb-8">
          <a
            href="#order-form"
            data-form-cta="true"
            className="relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#5ec239] to-[#4cae4e] text-white font-sans text-xs md:text-sm tracking-widest uppercase px-8 md:px-10 py-3 rounded-xl font-bold hover:scale-105 transition-all duration-300 overflow-hidden group"
            style={{
              animation: 'bling-pulse 2s ease-in-out infinite',
              boxShadow: '0 0 20px rgba(184, 15, 102, 0.5), 0 0 40px rgba(184, 15, 102, 0.3)'
            }}
          >
            {/* Animated sparkles */}
            <span className="absolute inset-0 overflow-hidden rounded-xl">
              <span className="absolute top-0 left-0 w-2 h-2 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: '0s', top: '20%', left: '10%' }}></span>
              <span className="absolute top-0 right-0 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.5s', top: '30%', right: '15%' }}></span>
              <span className="absolute bottom-0 left-0 w-2 h-2 bg-yellow-200 rounded-full animate-ping" style={{ animationDelay: '1s', bottom: '25%', left: '20%' }}></span>
              <span className="absolute bottom-0 right-0 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '1.5s', bottom: '20%', right: '10%' }}></span>
            </span>
            
            {/* Shimmer effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 group-hover:translate-x-full transition-transform duration-1000 ease-out"
              style={{ transform: 'translateX(-100%)' }}
            ></span>
            
            {/* Text with glow */}
            <span className="relative z-10 drop-shadow-lg" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.8)' }}>
              Go To Order Form
            </span>
          </a>
        </div>
        
        {/* Add CSS animations */}
        <style>{`
          @keyframes bling-pulse {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 0 20px rgba(184, 15, 102, 0.5), 0 0 40px rgba(184, 15, 102, 0.3);
            }
            50% {
              transform: scale(1.02);
              box-shadow: 0 0 30px rgba(184, 15, 102, 0.8), 0 0 60px rgba(184, 15, 102, 0.4);
            }
          }
        `}</style>
        
        <div className="w-full h-px bg-gray-200 mb-6"></div>
        
        <p className="font-sans text-xs text-gray-500 mb-2">
          © 2025 Fulani Hair Gro™. All Rights Reserved.
        </p>
        <p className="font-sans text-xs text-red-600 font-bold mb-4">
          ⚠️ BEWARE OF IMITATIONS. Only purchase from official channels.
        </p>

        <p className="font-sans text-[0.7rem] text-gray-400 mb-1 leading-snug">
          The contents of this website, text, images, products are sold or distributed by VITALVIDA.NG and protected under the Nigeria
          Copyright Act pursuant to Nigeria and International Copyright Laws. Copy/Edit/Use of our contents without my express written
          permission and you WILL be subject to the maximum fine/penalty imposed by the Law.
        </p>
        <p className="font-sans text-[0.5rem] text-gray-400 leading-snug">
          This website is not a part of the Facebook website or Facebook Inc. FACEBOOK is a trademark of FACEBOOK, Inc.
        </p>
      </div>
    </footer>
  );
};
