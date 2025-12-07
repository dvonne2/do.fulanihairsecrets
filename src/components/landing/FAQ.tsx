import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: "What makes this different from products I buy in Dubai?", a: "Our formula is a 400-year-old Fulani family heirloom that predates modern haircare. Combined with trichological science, it delivers results that luxury brands simply cannot match. Many of our clients have shelves full of expensive products — this is the one that actually works." },
  { q: "How soon can I see results?", a: "Most clients notice reduced shedding in Week 1, baby hairs by Week 3, and significant growth by Month 2-3. Full transformation typically occurs within 12 months of consistent use." },
  { q: "Is it suitable for hair under hijab?", a: "Absolutely. In fact, it's perfect for covered hair. The formula nourishes deeply without heavy residue." },
  { q: "What if it doesn't work for me?", a: "We offer a 12-month guarantee. If you don't see results, we refund in full — DOUBLE. No questions asked. We are that confident." },
  { q: "Why is pre-payment cheaper?", a: "Pre-payment allows us to prioritize your order, include exclusive gifts, and pass savings to you. It's our way of rewarding trust." },
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
                <span className="font-cinzel text-base md:text-lg text-gold pr-4">{faq.q}</span>
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
