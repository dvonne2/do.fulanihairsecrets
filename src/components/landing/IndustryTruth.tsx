import React from 'react';
import dhtDiagram from '@/assets/products/1756204944-ChatGPT Image Aug 7, 2025, 08_55_46 PM.webp';
import follicleCloseup from '@/assets/products/1756205536-3704559303182528.webp';

export const IndustryTruth: React.FC = () => {
  return (
    <section className="py-16 md:py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 arabian-pattern opacity-10" />
      <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
        <div className="luxury-card rounded-3xl p-6 md:p-10 space-y-6 font-sans text-foreground/90 leading-relaxed text-base md:text-lg">
          <p className="font-cinzel text-base md:text-lg tracking-[0.3em] uppercase text-gold text-center">
            The Truth The Hair Industry Will Never Admit
          </p>

          <div className="bg-background/70 border border-gold/30 rounded-2xl px-4 py-4 md:px-6 md:py-5">
            <h3 className="font-cinzel text-lg md:text-2xl text-gold mb-2 text-center">
              Why Fulani Hair Gro Works When Others Fail
            </h3>
            <ul className="list-none space-y-2 font-serif text-sm md:text-base text-foreground/90 text-left md:text-center">
              <li>🌿 <span className="font-semibold">Targets follicle dormancy</span> — goes beyond the hair strand to where growth is controlled.</li>
              <li>🔥 <span className="font-semibold">Activates blood flow at thinning edges</span> so weak follicles start receiving fresh nourishment again.</li>
              <li>🧬 <span className="font-semibold">Restores the scalp environment for regrowth</span> by calming irritation and reducing DHT pressure.</li>
            </ul>
          </div>

          <p>
            The major hair companies <span className="font-semibold">know</span> about DHT in women. I&apos;ve personally seen
            internal documents from a major beauty corporation (I can&apos;t name them for legal reasons) showing they&apos;ve known
            about female DHT since the late 80s.
          </p>
          <p>
            DHT (dihydrotestosterone) is a powerful hormone that shrinks and weakens hair follicles over time. When DHT locks onto
            the follicles at your hairline and crown, it slowly chokes them, causing thinning, shedding, and eventually patches that
            refuse to grow back.
          </p>
          <p className="font-serif text-base md:text-lg text-gold/90">
            In simple terms: <span className="font-semibold">DHT is the quiet hormone that keeps telling your hair to fall out and not grow back.</span>
          </p>

          <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-center">
            <div className="bg-background/60 rounded-2xl border border-gold/20 p-3 md:p-4 flex items-center justify-center">
              <img
                src={dhtDiagram}
                alt="Simple illustration showing how DHT affects hair follicles before and after treatment"
                className="w-full max-w-xs md:max-w-sm object-contain"
              />
            </div>
            <div className="bg-background/60 rounded-2xl border border-gold/20 p-3 md:p-4 flex items-center justify-center">
              <img
                src={follicleCloseup}
                alt="Close-up illustration of a healthy hair follicle after DHT is controlled"
                className="w-full max-w-xs md:max-w-sm object-contain"
              />
            </div>
          </div>
          <p>
            For years, most people believed DHT was only a "men&apos;s problem." The truth is that many women—especially after childbirth,
            in their 30s, 40s, and beyond—also experience DHT-related hair loss. Once you understand that, everything changes, because it
            means your hair loss isn&apos;t just stress, age, or bad luck… there&apos;s a real, addressable cause.
          </p>
          <p>
            So why haven&apos;t they created solutions that truly target it for women? Simple:
            <span className="font-semibold"> there&apos;s more money in keeping you dependent on products that don&apos;t work.</span>
          </p>

          <ul className="list-disc list-inside space-y-1 text-base md:text-lg">
            <li>
              That popular prescription foam everyone talks about? It mostly boosts blood flow temporarily. The moment you
              stop, the shedding comes back within weeks. Perfect strategy for a life-long customer.
            </li>
            <li>
              Those expensive hair supplements that come as four big horse pills a day? They might give you stronger nails,
              but they don&apos;t meaningfully block DHT at the follicle.
            </li>
            <li>
              Professional in-clinic treatments that cost hundreds of thousands of naira? They stimulate growth for a while
              but rarely address the hormonal root cause—so you keep going back.
            </li>
          </ul>

          <p>
            The entire industry is designed to keep women trapped in a cycle of
            <span className="font-semibold"> expensive, temporary, ineffective treatments.</span>
          </p>
          <p>
            The key insight for me as a practitioner was this:
            <span className="font-semibold"> any ingredients that could help had to be applied directly to the scalp</span>,
            right where DHT is attacking the follicles—not just swallowed in a pill and prayed over.
          </p>
          <p>
            And that is why I got my co-founder, a Trichologist, to work on Fulani Hair Gro with me. While I brought the 400-year-old ancient herbal hair growth formula, she brought the science — and together we bottled science and nature for you as a 3‑in‑1 hair growth protocol that truly works.
          </p>
        </div>
      </div>
    </section>
  );
};
