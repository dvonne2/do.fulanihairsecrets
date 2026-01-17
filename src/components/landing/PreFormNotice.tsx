import React from 'react';

export const PreFormNotice: React.FC = () => {
  return (
    <section className="bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-serif text-base md:text-lg text-gold mb-2">
          Accelerate your hair growth. Get Fulani Hair Gro Today.
        </p>
        <p className="font-sans text-2xl md:text-3xl font-extrabold tracking-widest uppercase text-[#D30000] mb-3">
          PLEASE NOTE!!!
        </p>
        <p className="font-sans text-sm md:text-base text-foreground mb-1">
          Please be sure you are <span className="font-bold">FULLY ready</span> for the product &amp; have the money to pay at the point of delivery
          because we&apos;ve limited stock.
        </p>
        <p className="font-sans text-lg md:text-xl font-bold text-foreground mt-3 mb-2">
          Fill The Form To Place Your Order Now
        </p>
        <p className="font-sans text-base md:text-lg font-bold text-foreground mb-4">
          Regrow thinning edges and bald spots — or get 2× your money back.
        </p>
      </div>
    </section>
  );
};
