import { Check } from 'lucide-react';
import { OptimizedImage } from '@/components/OptimizedImage';
import {
  hairLossTypes,
  careTips,
  expectations,
  bundleImg,
  hairStrandRepair,
  denseScalp
} from './hairLossTypesData';

export const HairLossTypesGuide = () => {
  return (
    <section className="py-16 md:py-24 bg-white fhg-helvetica">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-sans font-extrabold text-xs tracking-[0.3em] uppercase text-gold mb-3">
            Educational Guide
          </p>
          <h2 className="font-cinzel text-2xl md:text-4xl text-[#D30000] mb-4">
            7 Types of Hair Loss & How Fulani Hair Gro Helps
          </h2>
          <p className="font-serif text-lg text-[#333333] max-w-3xl mx-auto">
            Hair loss comes in many forms, each with its own triggers. Our formula is enriched with 400-year-old secret herbs, used for generations by the Fulani tribe in Maiduguri.
          </p>
          <div className="w-32 h-px bg-gold/40 mx-auto mt-6" />
        </div>

        {/* Medical diagram strip */}
        <div className="mb-10 md:mb-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-card/40 border border-gold/25 rounded-2xl p-3 flex items-center justify-center">
            <OptimizedImage
              src={bundleImg}
              alt="Fulani Hair Gro complete product system"
              className="w-full max-w-xs object-contain"
              width={480}
              height={472}
            />
          </div>
          <div className="bg-card/40 border border-gold/25 rounded-2xl p-3 flex items-center justify-center">
            <OptimizedImage
              src={hairStrandRepair}
              alt="Diagram of a repaired, stronger hair strand"
              className="w-full max-w-xs object-contain"
              width={480}
              height={459}
            />
          </div>
          <div className="bg-card/40 border border-gold/25 rounded-2xl p-3 flex items-center justify-center">
            <OptimizedImage
              src={denseScalp}
              alt="Illustration of a scalp filled with many healthy hair strands"
              className="w-full max-w-xs object-contain"
              width={480}
              height={468}
            />
          </div>
        </div>

        {/* Hair Loss Types Grid */}
        <div className="space-y-8 md:space-y-12 mb-16">
          {hairLossTypes.map((type, index) => (
            <div 
              key={type.id}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 md:gap-10 items-center bg-white rounded-2xl p-6 md:p-8 border border-gold/40 shadow-sm`}
            >
              {/* Image */}
              <div className="w-full md:w-2/5 flex-shrink-0">
                <div className="relative rounded-xl overflow-hidden border-2 border-gold/30 shadow-[0_0_30px_rgba(218,165,32,0.15)]">
                  <div className="absolute top-3 left-3 bg-gold text-background px-3 py-1 rounded-full font-sans text-xs font-bold z-10">
                    TYPE {type.id}
                  </div>
                  <OptimizedImage
                    src={type.image}
                    alt={type.name}
                    className="w-full h-48 md:h-64 object-cover"
                    width={640}
                    height={512}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="w-full md:w-3/5 space-y-4">
                <div>
                  <h3 className="font-cinzel text-2xl md:text-3xl">
                    <span className="inline-block bg-[#FF1493] text-white px-3 md:px-4 py-1">
                      {type.name}
                    </span>
                  </h3>
                  <p className="font-sans text-sm md:text-base text-[#333333]/80">
                    {type.subtitle}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="bg-destructive/20 border border-destructive/40 rounded-lg p-5 md:p-6">
                    <p className="font-sans text-base md:text-lg uppercase tracking-wider text-destructive mb-2 font-bold">
                      Why It Happens
                    </p>
                    <p className="font-serif text-xl md:text-2xl text-[#333333]">
                      {type.cause}
                    </p>
                  </div>

                  <div className="bg-gold/20 border border-gold/50 rounded-lg p-5 md:p-6">
                    <p className="font-sans text-base md:text-lg uppercase tracking-wider text-gold mb-2 font-bold">
                      How Fulani Hair Gro Supports
                    </p>
                    <p className="font-serif text-xl md:text-3xl text-[#333333]">
                      {type.solution}
                    </p>
                  </div>
                </div>

                {type.qualifies && (
                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-[#F2B705] text-xl">✓</span>
                    <div className="flex items-center gap-3">
                      <span className="inline-block bg-[#FDC52D] text-black font-sans font-bold text-sm md:text-base px-4 py-1">
                        Treatable with Fulani Hair Gro™
                      </span>
                      <div className="w-9 h-9 rounded-full bg-white shadow-[0_0_18px_rgba(218,165,32,0.55)] flex items-center justify-center">
                        <OptimizedImage
                          src={bundleImg}
                          alt="Fulani Hair Gro product"
                          className="w-7 h-7 object-contain rounded-full"
                          width={28}
                          height={28}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mb-12" />

        {/* Why Choose Fulani Hair Gro */}
        <div className="bg-white border border-gold/20 rounded-2xl p-6 md:p-10 mb-12">
          <h3 className="font-cinzel font-extrabold text-xl md:text-2xl text-center mb-8">
            <span className="inline-block bg-[#FF1493] text-black px-4 md:px-6 py-1">
              Why Choose Fulani Hair Gro?
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-gold text-xl">🌿</span>
              <div>
                <p className="font-sans text-sm font-bold text-[#333333]">Powered by Ancient Wisdom</p>
                <p className="font-serif text-lg md:text-3xl text-[#333333]">
                  Rooted in 400 years of tradition using proven Fulani herbs
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold text-xl">✨</span>
              <div>
                <p className="font-sans text-sm font-bold text-[#333333]">All-Natural Ingredients</p>
                <p className="font-serif text-lg md:text-3xl text-[#333333]">No harmful chemicals, safe for all hair types</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold text-xl">📈</span>
              <div>
                <p className="font-sans text-sm font-bold text-[#333333]">Results You Can See</p>
                <p className="font-serif text-lg md:text-3xl text-[#333333]">Notice the difference within weeks</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold text-xl">💪</span>
              <div>
                <p className="font-sans text-sm font-bold text-[#333333]">Gentle Yet Powerful</p>
                <p className="font-serif text-lg md:text-3xl text-[#333333]">Gentle care with potent results</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Care Tips */}
          <div className="bg-white border border-border/50 rounded-2xl p-6">
            <h3 className="font-cinzel text-xl md:text-2xl text-gold mb-4">
              Gentle Hair Care Practices
            </h3>
            <ul className="space-y-3">
              {careTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-gold mt-1 flex-shrink-0" />
                  <span className="font-serif text-lg md:text-xl text-[#333333]">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Expectations */}
          <div className="bg-gold/5 border border-gold/20 rounded-2xl p-6">
            <h3 className="font-cinzel text-xl md:text-2xl text-gold mb-4">
              What to Expect
            </h3>
            <ul className="space-y-3">
              {expectations.map((exp, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-gold">✓</span>
                  <span className="font-serif text-lg md:text-xl text-[#333333]">{exp}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 p-3 bg-gold/10 rounded-lg">
              <p className="font-sans text-lg md:text-3xl text-gold font-bold text-center">
                ⏱️ Consistency is Key — No hair growth solution works overnight!
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="font-serif text-lg text-[#333333] mb-4">
            Not sure which type you have?
          </p>
          <a
            href="#order-form"
            data-form-cta="true"
            className="inline-flex items-center justify-center bg-gradient-to-r from-[#15803d] to-[#4cae4e] text-white fhg-helvetica text-sm md:text-base tracking-widest uppercase px-8 py-6 rounded-md hover:scale-105 transition-transform duration-300 border border-[#4cae4e]"
          >
            <span className="mr-2">📸</span>
            Continue To Order Form
          </a>
          <p className="font-sans text-xs text-[#333333] mt-3">
            Takes only 5 minutes • Get honest feedback
          </p>
        </div>
      </div>
    </section>
  );
};
