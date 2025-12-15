import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: "Why does this work better than the luxury products I buy abroad?", a: "Our formula is a 400-year-old Fulani family heirloom that predates modern haircare. Combined with trichological science, it delivers results that luxury brands simply cannot match. Many of our clients have shelves full of expensive Dubai and UK products — this is the one that finally filled in their edges." },
  { q: "How soon will I notice my edges filling in?", a: "Most women notice early changes in clear stages: in the first 2–3 weeks shedding reduces and the scalp feels calmer; by weeks 4–6 tiny baby hairs start appearing along the hairline and thinning spots; by 90 days you can see fuller density and stronger strands if you stay consistent. Full, dramatic transformations continue over 6–12 months." },
  { q: "Is it suitable for hair under hijab?", a: "Absolutely. In fact, it's perfect for covered hair. The formula nourishes deeply without heavy residue." },
  { q: "What if it doesn't work for me?", a: "We offer a 12-month guarantee. If you don't see results, we refund in full — DOUBLE. No questions asked. We are that confident." },
  { 
    q: "What happens when I stop using Fulani Hair Gro?", 
    a: "This is the number one question we get, and it's important. Unlike prescription foams that create dependency, Fulani Hair Gro™ is designed to help restore your follicles' normal function. Once DHT damage is reduced and your follicles are producing healthy hair again, many women simply move to a maintenance routine of 3–4 times per week. The hair you've regained doesn't suddenly fall out, and your follicles remain healthier than before you started. In other words: you're fixing the problem, not just masking it." 
  },
];

export const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-20 royal-blue-gradient relative">
      <div className="absolute inset-0 moroccan-tile"></div>
      <div className="max-w-3xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12">
          <p className="font-cinzel text-sm tracking-[0.4em] uppercase text-gold mb-4">✦ Questions? ✦</p>
          <h2 className="font-cinzel text-2xl md:text-4xl text-foreground">Frequently Asked</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i}
              className="rounded-2xl border border-gold/30 bg-card overflow-hidden"
            >
              <button
                onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                className="w-full p-5 flex items-center justify-between text-left"
              >
                <span className="font-cinzel text-base md:text-lg text-white pr-4">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-gold transition-transform flex-shrink-0 ${activeIndex === i ? 'rotate-180' : ''}`} />
              </button>
              {activeIndex === i && (
                <div className="px-5 pb-5">
                  <div className="ornate-divider mb-4"></div>
                  <p className="font-sans text-sm text-foreground/80 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
