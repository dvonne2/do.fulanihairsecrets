import { useState } from 'react';
import shampooImg from '@/assets/products/shampoo.webp';
import conditionerImg from '@/assets/products/conditioner.webp';
import pomadeImg from '@/assets/products/pomade.webp';
import fullBundleImg from '@/assets/products/66750-bundle.webp';

interface PricingSectionProps {
  countdown: { hours: number; minutes: number; seconds: number };
  stockCount: number;
  commitmentChecks: boolean[];
  onCommitmentChange: (index: number) => void;
}

export const PricingSection = ({ countdown, stockCount, commitmentChecks, onCommitmentChange }: PricingSectionProps) => {
  return (
    <section id="order" className="py-16 px-4 text-center bg-[#F9F9F9]">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gold mb-4">
          👑 Ready to Transform Your Hair?
        </h2>
        <p className="text-base md:text-lg text-[#333333] mb-3">
          If you&apos;re unsure, you&apos;re likely a good candidate — 84% of our users see significant improvement.
        </p>
        <p className="text-base md:text-lg text-[#333333] mb-3">
          You don&apos;t need another oil. You don&apos;t need another stylist&apos;s advice. You need consistency — and something that actually works.
        </p>
        <p className="text-lg text-[#333333] mb-8 font-semibold">
          This is that thing. Click below to complete your order securely.
        </p>
        <a 
          href="#order-form"
          data-form-cta="true"
          className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold text-xl px-12 py-5 rounded-xl hover:scale-105 transition-transform shadow-2xl"
        >
          🛒 Order Now
        </a>
        <p className="text-xl text-[#333333] mt-6">
          ✓ Pay on Delivery Available &nbsp;•&nbsp; ✓ 365-Day Guarantee &nbsp;•&nbsp; ✓ Free Shipping on ₦66,750 &amp; ₦215,000 bundles
        </p>
      </div>
    </section>
  );
};
