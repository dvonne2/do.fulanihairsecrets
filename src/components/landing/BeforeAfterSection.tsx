import result1 from '@/assets-optimized/results/result-1.webp';
import result2 from '@/assets-optimized/results/result-2.webp';
import result4 from '@/assets-optimized/results/result-4.webp';
import result5 from '@/assets-optimized/results/result-5.webp';
import result11 from '@/assets-optimized/results/result-11.webp';
import result16 from '@/assets-optimized/results/result-16.webp';
import fourteenDayCollage from '@/assets-optimized/products/before-and-after-14-days-2013x2048.webp';

const transformations = [];

export const BeforeAfterSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#B80F66]/10 border border-[#B80F66]/30 mb-6">
            <span className="text-[#B80F66] text-sm font-bold"></span>
          </div>
          <h2 className="font-sans text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            From <span className="text-red-600">Struggling</span> to <span className="text-[#B80F66]">Stunning</span>
          </h2>
          <p className="font-sans text-lg text-gray-500 max-w-2xl mx-auto">
            Real transformations. No filters. No photoshop. Just pure results.
          </p>
        </div>

        {/* Featured 14-day transformation */}
        <div className="mb-8 md:mb-10">
          <div className="rounded-2xl overflow-hidden border-2 border-gray-200">
            <img
              src={fourteenDayCollage}
              alt="Dramatic 14-day before and after hair growth transformation collage"
              className="w-full h-full object-cover"
              decoding="async"
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
              className="group rounded-2xl overflow-hidden border border-gray-200 hover:border-[#B80F66]/40 transition-all duration-300 bg-white shadow-sm"
            >
              {/* Before/After Compare */}
              <div className="relative">
                <div className="grid grid-cols-2">
                  {/* Before placeholder */}
                  <div className="relative aspect-square bg-gray-100 flex items-center justify-center border-r border-gray-200">
                    <div className="text-center p-4">
                      <span className="text-4xl mb-2 block">😔</span>
                      <p className="font-sans text-xs text-gray-500">{item.problem}</p>
                    </div>
                    <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded">
                      BEFORE
                    </div>
                  </div>
                  
                  {/* After image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img 
                      src={item.after} 
                      alt={`${item.name} after transformation`}
                      className="w-full h-full object-cover"
                      decoding="async"
                      loading="lazy"
                      width={600}
                      height={600}
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-green-600 text-white text-[10px] font-bold rounded">
                      AFTER
                    </div>
                  </div>
                </div>
                
                {/* Duration badge */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 px-4 py-2 bg-[#B80F66] text-white text-2xl md:text-3xl font-bold rounded-full shadow-lg z-10">
                  {item.duration}
                </div>
              </div>
              
              {/* Info */}
              <div className="p-4 pt-6 text-center">
                <p className="font-sans text-lg text-[#B80F66] font-semibold">{item.name}</p>
                <div className="flex justify-center gap-0.5 mt-2">
                  {Array(5).fill(0).map((_, j) => (
                    <span key={j} className="text-yellow-500 text-sm">★</span>
                  ))}
                </div>
                <p className="font-sans text-base md:text-lg text-gray-700 mt-3 max-w-xs mx-auto">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="font-sans text-lg text-gray-600 italic mb-4">
            Your "after" photo is waiting to be taken
          </p>
          <a 
            href="#order-form"
            data-form-cta="true"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B80F66] to-[#D30000] text-white font-sans text-sm tracking-wider uppercase px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
          >
            <span>Order Now</span>
          </a>
        </div>
      </div>
    </section>
  );
};
