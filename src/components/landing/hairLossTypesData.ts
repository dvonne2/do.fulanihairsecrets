import alopeciaAreata from '@/assets-optimized/hair-types/alopecia-areata.webp';
import anagenEffluvium from '@/assets-optimized/hair-types/anagen-effluvium.webp';
import androgenicAlopecia from '@/assets-optimized/hair-types/androgenic-alopecia.webp';
import cicatricialAlopecia from '@/assets-optimized/hair-types/cicatricial-alopecia.webp';
import tractionAlopecia from '@/assets-optimized/hair-types/traction-alopecia.webp';
import nutritionalDeficiency from '@/assets-optimized/hair-types/nutritional-deficiency.webp';
import telogenEffluvium from '@/assets-optimized/hair-types/telogen-effluvium.webp';
import bundleImg from '@/assets-optimized/products/bundle-system.webp';
import follicleBeforeAfter from '@/assets-optimized/products/jj-768x756-1.webp';
import hairStrandRepair from '@/assets-optimized/products/jjj-768x735-1.webp';
import denseScalp from '@/assets-optimized/products/jjjj-768x748-1.webp';

export type HairLossType = {
  id: number;
  name: string;
  subtitle: string;
  image: string;
  cause: string;
  solution: string;
  qualifies: boolean;
};

export const hairLossTypes: HairLossType[] = [
  {
    id: 1,
    name: 'Androgenic Alopecia',
    subtitle: '(Pattern Baldness)',
    image: androgenicAlopecia,
    cause:
      'Genetics and hormonal imbalances play a big role, causing a gradual reduction in hair volume and strength.',
    solution:
      'Infused with ancient Fulani herbal secrets, it gently nourishes and protects your hair follicles, reducing the effects of DHT, and promoting fuller, thicker hair naturally.',
    qualifies: true
  },
  {
    id: 2,
    name: 'Alopecia Areata',
    subtitle: '(Autoimmune Hair Loss)',
    image: alopeciaAreata,
    cause:
      'Autoimmune conditions often trigger this type of hair loss, and stress can sometimes be a contributing factor.',
    solution:
      'Drawing on herbal knowledge passed down for centuries, it soothes inflammation and encourages a healthier scalp environment, helping hair grow back longer and more resilient.',
    qualifies: true
  },
  {
    id: 3,
    name: 'Telogen Effluvium',
    subtitle: '(Stress-Related Hair Loss)',
    image: telogenEffluvium,
    cause:
      'Life events such as illness, surgery, or even emotional stress can disrupt the hair growth cycle, causing temporary thinning.',
    solution:
      'Powered by the time-tested herbs of the Fulani tribe, it restores essential nutrients to the scalp, gently encouraging hair follicles to re-enter the growth phase and boosting overall hair vitality.',
    qualifies: true
  },
  {
    id: 4,
    name: 'Traction Alopecia',
    subtitle: '(Hair Strain)',
    image: tractionAlopecia,
    cause: 'Constant pulling or strain weakens the roots, causing hair to thin or break over time.',
    solution:
      'With deep-penetrating oils sourced from Fulani herbal remedies, it nourishes and strengthens damaged follicles, promoting a healing environment for the scalp and encouraging healthier hair regrowth.',
    qualifies: true
  },
  {
    id: 5,
    name: 'Anagen Effluvium',
    subtitle: '(Treatment-Induced Hair Loss)',
    image: anagenEffluvium,
    cause: 'Treatments like chemotherapy interfere with the growth phase of hair, causing rapid shedding.',
    solution:
      'Using potent herbs revered for their regenerative properties for over 400 years, it helps restore scalp health and accelerate the recovery of hair growth post-treatment.',
    qualifies: true
  },
  {
    id: 6,
    name: 'Cicatricial Alopecia',
    subtitle: '(Scarring Alopecia)',
    image: cicatricialAlopecia,
    cause:
      'Inflammatory skin conditions or infections cause permanent damage to the follicles, making it difficult for hair to grow back.',
    solution:
      'While scarring alopecia is challenging, the ancient Fulani formula works to soothe inflammation, prevent further damage, and support the remaining follicles for optimal hair health.',
    qualifies: true
  },
  {
    id: 7,
    name: 'Nutritional Deficiency',
    subtitle: '(Deficiency-Related Hair Loss)',
    image: nutritionalDeficiency,
    cause:
      "Deficiencies in key nutrients such as biotin, iron, and zinc can impair the hair's strength and growth potential.",
    solution:
      'Enriched with essential vitamins, minerals, and Fulani herbs, it provides the scalp with what it needs to encourage healthier, longer hair growth, addressing the root cause of deficiency-driven hair loss.',
    qualifies: true
  }
];

export const careTips: string[] = [
  'Avoid Tight Hairstyles — Constant tension from tight braids, ponytails, or buns can strain your hair follicles',
  'Minimize Heat Styling — Excessive use of heat can weaken and damage your hair',
  'Limit Wearing Wigs Without a Wig Cap — A breathable wig cap helps protect your hair and scalp',
  'Apply Fulani Hair Gro Pomade Daily — Consistency is key for the best results',
  'Use Silk Pillowcase and Bonnet — Cotton pillowcases cause friction and breakage',
  'Massage Your Scalp — Gently massage to stimulate blood flow and help the formula penetrate deeply'
];

export const expectations: string[] = [
  'Reduced Shedding — Your hair will fall out less frequently',
  'Thicker Strands — Your hair will grow back thicker and longer',
  'Healthier Scalp — Balanced and nourished scalp',
  'Regrowth in Thinning Areas — Dormant follicles reactivated',
  'Significantly Longer Hair — Accelerated growth rate'
];

export { bundleImg, follicleBeforeAfter, hairStrandRepair, denseScalp };
