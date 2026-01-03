import React from 'react';
import follicleHealing from '@/assets/products/1756204617-1720026155-giphy (1).webp';

const ingredients = [
  {
    name: 'African Pear (Dacryodes Edulis)',
    icon: '🍐',
    badge: 'NATIVE TO NIGERIA 🇳🇬',
    benefits: [
      'Rich in essential fatty acids for deep scalp nourishment',
      'High in Vitamin E - repairs damaged follicles',
      'Natural emollient - softens and conditions hair',
      'Strengthens hair shaft from root to tip',
    ],
    tagline: "West Africa's secret for silky, unbreakable hair",
  },
  {
    name: 'Wodaabe Butter Elixir™',
    icon: '🧈',
    badge: 'FROM NIGER 🇳🇪',
    benefits: [
      'Deep moisturizing without heaviness',
      'Seals cuticles for maximum shine',
      'Protects against heat and environmental damage',
      'Used by Wodaabe women for centuries',
    ],
    tagline: 'The secret behind the most beautiful hair in the Sahel',
  },
  {
    name: 'Kigelia Africana (Sausage Tree)',
    icon: '🌳',
    badge: 'WEST AFRICAN',
    benefits: [
      'Reactivates dormant hair follicles',
      'Firms and tightens scalp skin',
      'Anti-inflammatory properties',
      'Stimulates keratin production',
    ],
    tagline: "Nature's most powerful follicle activator",
  },
  {
    name: 'Sahel Neem Complex™',
    icon: '🌿',
    badge: 'SAHEL REGION',
    benefits: [
      'Penetrates 3X deeper than argan oil',
      'Antibacterial - eliminates scalp infections',
      'Clears blocked follicles',
      'Balances scalp pH for optimal growth',
    ],
    tagline: 'Deep penetration where other products fail',
  },
  {
    name: 'Fonio Stem Cells',
    icon: '🌾',
    badge: 'ANCIENT GRAIN',
    benefits: [
      'Amino acids that rebuild hair protein',
      'Strengthens hair shaft from inside',
      'Prevents breakage at the molecular level',
      "Rich in cysteine (hair's building block)",
    ],
    tagline: "Africa's oldest grain rebuilding your newest hair",
  },
  {
    name: 'Balanites Aegyptiaca (Desert Date)',
    icon: '🌴',
    badge: 'SAHARA DESERT',
    benefits: [
      'Extreme hydration for dry scalps',
      'Repairs damaged hair cuticles',
      'UV protection for hair',
      'Used by nomadic women for generations',
    ],
    tagline: 'Thrives in the harshest conditions. So will your hair.',
  },
  {
    name: 'Mung Bean Extract',
    icon: '🫛',
    badge: 'PROTEIN RICH',
    benefits: [
      'Rich in proteins that strengthen hair follicles',
      'Contains vitamins A, B, C, and E for scalp nourishment',
      'Promotes collagen production for hair elasticity',
      'Natural DHT blocker - prevents follicle shrinkage',
    ],
    tagline: 'Ancient protein power for modern hair restoration',
  },
  {
    name: 'Capilia Longa™ (Turmeric Root Extract)',
    icon: '🌱',
    badge: 'CLINICALLY TESTED',
    benefits: [
      'Clinically proven to reduce hair loss by 89%',
      'Increases hair density by 52%',
      'Reactivates dormant hair follicles',
      'Extends the hair growth phase (anagen)',
    ],
    tagline: 'The clinically-proven powerhouse behind visible regrowth',
  },
];

export const IngredientsSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-[#F9F9F9] relative overflow-hidden">
      <div className="absolute inset-0 arabian-pattern opacity-10" />
      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-10 md:mb-14">
          <p className="font-cinzel text-sm md:text-base tracking-[0.4em] uppercase mb-3">
            <span className="inline-block bg-[#DAA520] text-black px-4 md:px-6 py-1">
              INGREDIENTS
            </span>
          </p>
          <h2 className="font-cinzel text-2xl md:text-4xl text-[#333333] mb-3">
            The Power Inside Every Bottle
          </h2>
          <p className="font-serif text-base md:text-lg text-[#333333]">
            Ancient African ingredients. Proven results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 md:mb-10">
          {ingredients.map((ingredient) => (
            <div
              key={ingredient.name}
              className="bg-[#111111] border border-gold/30 rounded-2xl p-6 hover:border-gold hover:shadow-[0_0_30px_rgba(218,165,32,0.2)] transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-3xl md:text-4xl">{ingredient.icon}</span>
                <span className="text-[10px] md:text-xs bg-gold/20 text-gold px-2 py-1 rounded-full uppercase tracking-widest">
                  {ingredient.badge}
                </span>
              </div>
              <h3 className="text-gold font-cinzel font-bold text-base md:text-lg mb-2">
                {ingredient.name}
              </h3>
              <ul className="text-gray-100 text-sm md:text-lg space-y-2 mb-4">
                {ingredient.benefits.map((benefit, i) => (
                  <li key={i}>• {benefit}</li>
                ))}
              </ul>
              <p className="text-gold/70 text-sm md:text-lg font-serif italic">
                "{ingredient.tagline}"
              </p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mb-10 md:mb-12">
          <div className="rounded-2xl border border-gold/40 bg-[#111111] px-6 py-6 md:px-8 md:py-8 shadow-[0_0_30px_rgba(218,165,32,0.18)]">
            <h3 className="font-cinzel text-lg md:text-2xl text-gold mb-3 md:mb-4 text-center">
              Reactivate Dormant Follicles
            </h3>
            <p className="font-serif text-lg md:text-3xl text-gray-100 mb-3">
              With DHT blocked and the scalp deeply nourished, follicles that have been "sleeping" can return to their
              normal growth cycle, producing thicker, stronger hair.
            </p>
            <p className="font-serif text-lg md:text-3xl text-gray-100">
              This means your scalp can finally grow <span className="font-semibold">and keep</span> hair—and every new
              strand that comes in has the chance to be thicker, longer, and stronger than before.
            </p>
            <div className="mt-4 flex justify-center">
              <img
                src={follicleHealing}
                alt="Gentle illustration of hair follicles becoming thicker and healthier over time"
                className="w-full max-w-sm md:max-w-md object-contain rounded-xl border border-gold/30"
              />
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="font-serif text-base md:text-lg text-[#333333]">
            400 years of ancestral wisdom. 8 powerful ingredients. 1 complete system.
          </p>
          <a
            href="#order-form"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-amber-500 text-black font-cinzel text-sm md:text-base tracking-widest uppercase px-8 md:px-12 py-4 rounded-xl font-bold hover:scale-105 transition-transform shadow-[0_0_30px_rgba(218,165,32,0.35)]"
          >
            <span>👑 Order Now</span>
          </a>
        </div>
      </div>
    </section>
  );
};
