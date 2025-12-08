import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

import alopeciaAreata from '@/assets/hair-types/alopecia-areata.jpg';
import anagenEffluvium from '@/assets/hair-types/anagen-effluvium.jpg';
import androgenicAlopecia from '@/assets/hair-types/androgenic-alopecia.jpg';
import cicatricialAlopecia from '@/assets/hair-types/cicatricial-alopecia.webp';
import tractionAlopecia from '@/assets/hair-types/traction-alopecia.webp';
import nutritionalDeficiency from '@/assets/hair-types/nutritional-deficiency.webp';
import telogenEffluvium from '@/assets/hair-types/telogen-effluvium.jpg';

export const HairLossTypesGuide = () => {
  const handleChatClick = () => {
    const message = encodeURIComponent(
      `Hi! I'd like a FREE hair loss diagnosis.\n\nI think I might have one of these types of hair loss. Here are photos of my current situation:\n\n[Please attach photos]`
    );
    window.open(`https://wa.me/2348101594734?text=${message}`, '_blank');
  };

  const hairLossTypes = [
    {
      id: 1,
      name: "Androgenic Alopecia",
      subtitle: "(Pattern Baldness)",
      image: androgenicAlopecia,
      cause: "Genetics and hormonal imbalances play a big role, causing a gradual reduction in hair volume and strength.",
      solution: "Infused with ancient Fulani herbal secrets, it gently nourishes and protects your hair follicles, reducing the effects of DHT, and promoting fuller, thicker hair naturally.",
      qualifies: true
    },
    {
      id: 2,
      name: "Alopecia Areata",
      subtitle: "(Autoimmune Hair Loss)",
      image: alopeciaAreata,
      cause: "Autoimmune conditions often trigger this type of hair loss, and stress can sometimes be a contributing factor.",
      solution: "Drawing on herbal knowledge passed down for centuries, it soothes inflammation and encourages a healthier scalp environment, helping hair grow back longer and more resilient.",
      qualifies: true
    },
    {
      id: 3,
      name: "Telogen Effluvium",
      subtitle: "(Stress-Related Hair Loss)",
      image: telogenEffluvium,
      cause: "Life events such as illness, surgery, or even emotional stress can disrupt the hair growth cycle, causing temporary thinning.",
      solution: "Powered by the time-tested herbs of the Fulani tribe, it restores essential nutrients to the scalp, gently encouraging hair follicles to re-enter the growth phase and boosting overall hair vitality.",
      qualifies: true
    },
    {
      id: 4,
      name: "Traction Alopecia",
      subtitle: "(Hair Strain)",
      image: tractionAlopecia,
      cause: "Constant pulling or strain weakens the roots, causing hair to thin or break over time.",
      solution: "With deep-penetrating oils sourced from Fulani herbal remedies, it nourishes and strengthens damaged follicles, promoting a healing environment for the scalp and encouraging healthier hair regrowth.",
      qualifies: true
    },
    {
      id: 5,
      name: "Anagen Effluvium",
      subtitle: "(Treatment-Induced Hair Loss)",
      image: anagenEffluvium,
      cause: "Treatments like chemotherapy interfere with the growth phase of hair, causing rapid shedding.",
      solution: "Using potent herbs revered for their regenerative properties for over 400 years, it helps restore scalp health and accelerate the recovery of hair growth post-treatment.",
      qualifies: true
    },
    {
      id: 6,
      name: "Cicatricial Alopecia",
      subtitle: "(Scarring Alopecia)",
      image: cicatricialAlopecia,
      cause: "Inflammatory skin conditions or infections cause permanent damage to the follicles, making it difficult for hair to grow back.",
      solution: "While scarring alopecia is challenging, the ancient Fulani formula works to soothe inflammation, prevent further damage, and support the remaining follicles for optimal hair health.",
      qualifies: true
    },
    {
      id: 7,
      name: "Nutritional Deficiency",
      subtitle: "(Deficiency-Related Hair Loss)",
      image: nutritionalDeficiency,
      cause: "Deficiencies in key nutrients such as biotin, iron, and zinc can impair the hair's strength and growth potential.",
      solution: "Enriched with essential vitamins, minerals, and Fulani herbs, it provides the scalp with what it needs to encourage healthier, longer hair growth, addressing the root cause of deficiency-driven hair loss.",
      qualifies: true
    }
  ];

  const careTips = [
    "Avoid Tight Hairstyles — Constant tension from tight braids, ponytails, or buns can strain your hair follicles",
    "Minimize Heat Styling — Excessive use of heat can weaken and damage your hair",
    "Limit Wearing Wigs Without a Wig Cap — A breathable wig cap helps protect your hair and scalp",
    "Apply Fulani Hair Gro Pomade Daily — Consistency is key for the best results",
    "Use Silk Pillowcase and Bonnet — Cotton pillowcases cause friction and breakage",
    "Massage Your Scalp — Gently massage to stimulate blood flow and help the formula penetrate deeply"
  ];

  const expectations = [
    "Reduced Shedding — Your hair will fall out less frequently",
    "Thicker Strands — Your hair will grow back thicker and longer",
    "Healthier Scalp — Balanced and nourished scalp",
    "Regrowth in Thinning Areas — Dormant follicles reactivated",
    "Significantly Longer Hair — Accelerated growth rate"
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0 arabian-pattern opacity-10" />
      
      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold/80 mb-3">
            Educational Guide
          </p>
          <h2 className="font-cinzel text-2xl md:text-4xl text-gold mb-4">
            7 Types of Hair Loss & How Fulani Hair Gro Helps
          </h2>
          <p className="font-serif text-lg text-foreground/80 max-w-3xl mx-auto">
            Hair loss comes in many forms, each with its own triggers. Our formula is enriched with 400-year-old secret herbs, used for generations by the Fulani tribe in Maiduguri.
          </p>
          <div className="w-32 h-px bg-gold/40 mx-auto mt-6" />
        </div>

        {/* Hair Loss Types Grid */}
        <div className="space-y-8 md:space-y-12 mb-16">
          {hairLossTypes.map((type, index) => (
            <div 
              key={type.id}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 md:gap-10 items-center bg-card/30 rounded-2xl p-6 md:p-8 border border-gold/20`}
            >
              {/* Image */}
              <div className="w-full md:w-2/5 flex-shrink-0">
                <div className="relative rounded-xl overflow-hidden border-2 border-gold/30 shadow-[0_0_30px_rgba(218,165,32,0.15)]">
                  <div className="absolute top-3 left-3 bg-gold text-background px-3 py-1 rounded-full font-sans text-xs font-bold z-10">
                    TYPE {type.id}
                  </div>
                  <img 
                    src={type.image} 
                    alt={type.name}
                    className="w-full h-48 md:h-64 object-cover"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="w-full md:w-3/5 space-y-4">
                <div>
                  <h3 className="font-cinzel text-xl md:text-2xl text-gold">
                    {type.name}
                  </h3>
                  <p className="font-sans text-sm text-muted-foreground">
                    {type.subtitle}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                    <p className="font-sans text-xs uppercase tracking-wider text-destructive mb-1 font-bold">
                      Why It Happens
                    </p>
                    <p className="font-serif text-sm text-foreground/90">
                      {type.cause}
                    </p>
                  </div>

                  <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
                    <p className="font-sans text-xs uppercase tracking-wider text-gold mb-1 font-bold">
                      How Fulani Hair Gro Supports
                    </p>
                    <p className="font-serif text-sm text-foreground/90">
                      {type.solution}
                    </p>
                  </div>
                </div>

                {type.qualifies && (
                  <div className="flex items-center gap-2 text-gold">
                    <Check className="w-5 h-5" />
                    <span className="font-sans text-sm font-bold">You Qualify for Treatment</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mb-12" />

        {/* Why Choose Fulani Hair Gro */}
        <div className="bg-gold/5 border border-gold/20 rounded-2xl p-6 md:p-10 mb-12">
          <h3 className="font-cinzel text-xl md:text-2xl text-gold text-center mb-8">
            Why Choose Fulani Hair Gro?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-gold text-xl">🌿</span>
              <div>
                <p className="font-sans text-sm font-bold text-foreground">Powered by Ancient Wisdom</p>
                <p className="font-serif text-sm text-muted-foreground">Rooted in 400 years of tradition using proven Fulani herbs</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold text-xl">✨</span>
              <div>
                <p className="font-sans text-sm font-bold text-foreground">All-Natural Ingredients</p>
                <p className="font-serif text-sm text-muted-foreground">No harmful chemicals, safe for all hair types</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold text-xl">📈</span>
              <div>
                <p className="font-sans text-sm font-bold text-foreground">Results You Can See</p>
                <p className="font-serif text-sm text-muted-foreground">Notice the difference within weeks</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold text-xl">💪</span>
              <div>
                <p className="font-sans text-sm font-bold text-foreground">Gentle Yet Powerful</p>
                <p className="font-serif text-sm text-muted-foreground">Gentle care with potent results</p>
              </div>
            </div>
          </div>
        </div>

        {/* Care Tips & Expectations in 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Care Tips */}
          <div className="bg-card/50 border border-border/50 rounded-2xl p-6">
            <h3 className="font-cinzel text-lg text-gold mb-4">
              Gentle Hair Care Practices
            </h3>
            <ul className="space-y-3">
              {careTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-gold mt-1 flex-shrink-0" />
                  <span className="font-serif text-sm text-foreground/90">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Expectations */}
          <div className="bg-gold/5 border border-gold/20 rounded-2xl p-6">
            <h3 className="font-cinzel text-lg text-gold mb-4">
              What to Expect
            </h3>
            <ul className="space-y-3">
              {expectations.map((exp, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-gold">✓</span>
                  <span className="font-serif text-sm text-foreground/90">{exp}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 p-3 bg-gold/10 rounded-lg">
              <p className="font-sans text-xs text-gold font-bold text-center">
                ⏱️ Consistency is Key — No hair growth solution works overnight!
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="font-serif text-lg text-foreground/90 mb-4">
            Not sure which type you have?
          </p>
          <Button
            onClick={handleChatClick}
            size="lg"
            className="gold-gradient text-background font-sans text-sm md:text-base tracking-widest uppercase px-8 py-6 hover:scale-105 transition-transform duration-300"
          >
            <span className="mr-2">📸</span>
            Send Us A Photo — FREE Diagnosis
          </Button>
          <p className="font-sans text-xs text-muted-foreground mt-3">
            Takes only 5 minutes • Get honest feedback
          </p>
        </div>
      </div>
    </section>
  );
};
