import React from 'react';
import cashOnDeliveryImg from '@/assets/products/cash-on-delivery-icon-1024x345-7sgjf338-2-1.webp';
import pointingGif from '@/assets/products/RtaIrAk.gif';

export const PreFormNotice: React.FC = () => {
  return (
    <section className="bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-serif text-base md:text-lg text-gold mb-2">
          Accelerate your hair growth. Get Fulani Hair Gro Today.
        </p>
        <p className="font-sans text-2xl md:text-3xl font-extrabold tracking-widest uppercase text-red-600 mb-3">
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
        <div className="flex flex-col items-center gap-3 md:gap-4">
          <div className="bg-white rounded-md px-4 py-2 mb-1 inline-flex items-center justify-center">
            <img
              src={cashOnDeliveryImg}
              alt="Cash on Delivery available — inspect your package before you pay"
              className="w-full max-w-md object-contain"
            />
          </div>
          <img
            src={pointingGif}
            alt="Animated hand and eyes pointing down toward the order form"
            className="w-full max-w-md object-contain"
          />
        </div>
      </div>
    </section>
  );
};
