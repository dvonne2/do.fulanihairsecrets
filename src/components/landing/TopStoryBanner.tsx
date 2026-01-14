import React from 'react';
import fulaniBenefitsImage from '/Gemini_Generated_Image_gj65n6gj65n6gj65.webp';
import fulaniTestimonialImage from '/Gemini_Generated_Image_fd8rz1fd8rz1fd8r.webp';
import fulaniDaysImage from '/gemini-1knotm.png';
import fulaniExpertImage from '/Gemini_Generated_Image_xt4o0ixt4o0ixt4o.webp';
import hajiaMaryamTestimonial from '/Hajia Maryam Testimonial.webp';
import hajiaMaryam2 from '/Hajia-Maryam-2.webp';
import mamaTitiTestimonial1 from '/Mama Titi Testimonial1.webp';
import mamaTiti2 from '/Mama Titi 2.webp';
import { usePrefetch } from '@/hooks/usePrefetch';
import OrderForm from '../OrderFormEmbed';

export const TopStoryBanner = () => {
  const thankYouPrefetch = usePrefetch(() => import('@/pages/ThankYou'));

  return (
    <section
      id="hero"
      className="bg-white px-4 pt-10 pb-6 mt-10 md:pt-12 md:pb-8 md:mt-12"
      {...thankYouPrefetch}
    >
      <div className="max-w-5xl mx-auto text-center">
        <p className="jandes-eyebrow text-black mb-6">
          "Within 14 days of using Fulani Hair Gro, I began noticing tiny stubs on my edges." — Mrs. Ololade, Ikoyi
        </p>
        <div className="border border-[#E6E6E6] px-6 md:px-14 py-8 md:py-10">
          <h1 className="jandes-headline text-3xl md:text-5xl lg:text-6xl leading-snug text-[#000000] uppercase">
            Trusted by Thousands of Women Who Successfully Regrew Their Hair Edges with FULANI HAIR GRO
          </h1>
        </div>

        <p className="mt-6 jandes-quote text-lg md:text-xl text-black max-w-3xl mx-auto leading-relaxed">
          Cheaper Than A Hair Transplant In Turkey
        </p>

        <div className="mt-6">
          <picture>
            {/* Mobile: Use static image for faster loading */}
            <source media="(max-width: 768px)" srcSet="/hero-fulani.png" />
            {/* Desktop: Use animated GIF */}
            <source media="(min-width: 769px)" srcSet="/hero-animated.gif" />
            {/* Fallback to animated GIF */}
            <img
              src="/hero-animated.gif"
              alt="Fulani Hair Gro system packshot"
              className="w-full h-auto"
              loading="eager"
              decoding="async"
              width={1200}
              height={1219}
            />
          </picture>
        </div>

        <div className="mt-8 text-left">
          <p className="font-semibold text-xl md:text-2xl leading-snug text-black">
            The ancient Fulani secret that finally treats the root cause of thinning hair edges
          </p>
          <p className="mt-3 text-base md:text-xl text-black leading-relaxed">
            I formulated Fulani Hair Gro to do exactly what the women in my family taught me—nourish weak roots, support fuller-looking edges, and gently encourage new growth along the hairline. It's the same scalp-focused system, now bottled for you.
          </p>
        </div>

        <div id="order-form-container" className="px-4 md:px-6 max-w-4xl mx-auto mt-6">
          <section
            className="scroll-stopper bg-white px-4 md:px-9 py-9 text-center border-y-6 border-yellow-600 relative overflow-hidden"
          >
            <style>
              {`
                .scroll-stopper::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background: linear-gradient(90deg, transparent, rgba(218, 165, 32, 0.1), transparent);
                  animation: sweep 2s linear infinite;
                  pointer-events: none;
                }
                @keyframes sweep {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(100%); }
                }
                @keyframes mega-pulse {
                  0%, 100% {
                    transform: scale(1);
                    box-shadow: 0 0 0 4px #FFFFFF, 0 0 0 8px #FF0000, 0 10px 40px rgba(255, 0, 0, 0.5);
                  }
                  50% {
                    transform: scale(1.03);
                    box-shadow: 0 0 0 4px #FFFFFF, 0 0 0 8px #DAA520, 0 15px 50px rgba(255, 0, 0, 0.6);
                  }
                }
                @keyframes gold-flash {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.7; }
                }
                @keyframes point-bounce {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(10px); }
                }
                @keyframes shake-subtle {
                  0%, 100% { transform: translateX(0); }
                  25% { transform: translateX(-2px); }
                  75% { transform: translateX(2px); }
                }
                @keyframes spin-icon {
                  0%, 100% { transform: rotate(-10deg); }
                  50% { transform: rotate(10deg); }
                }
                .mega-flash {
                  background: #FF0000;
                  padding: 28px;
                  border-radius: 16px;
                  margin-bottom: 18px;
                  animation: mega-pulse 0.6s ease-in-out infinite;
                  box-shadow: 0 0 0 4px #FFFFFF, 0 0 0 8px #FF0000, 0 10px 40px rgba(255, 0, 0, 0.5);
                }
                .mega-text {
                  color: #FFFFFF;
                  font-size: 34px;
                  font-weight: 900;
                  text-transform: uppercase;
                  letter-spacing: 2px;
                  margin: 0;
                  line-height: 1.2;
                  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                }
                .mega-text .gold {
                  color: #DAA520;
                  display: block;
                  font-size: 40px;
                  animation: gold-flash 0.5s ease-in-out infinite;
                }
                .hands-row {
                  display: flex;
                  justify-content: center;
                  gap: 12px;
                  margin-bottom: 16px;
                }
                .point-hand {
                  font-size: 44px;
                  animation: point-bounce 0.4s ease-in-out infinite;
                }
                .point-hand:nth-child(2) { animation-delay: 0.1s; }
                .point-hand:nth-child(3) { animation-delay: 0.2s; }
                .point-hand:nth-child(4) { animation-delay: 0.3s; }
                .point-hand:nth-child(5) { animation-delay: 0.4s; }
                .urgency-strip {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 10px;
                  background: #1a1a1a;
                  padding: 14px 24px;
                  border-radius: 8px;
                  margin-bottom: 16px;
                  animation: shake-subtle 0.3s ease-in-out infinite;
                }
                .urgency-icon {
                  font-size: 26px;
                  animation: spin-icon 1s ease-in-out infinite;
                }
                .urgency-text {
                  color: #FFFFFF;
                  font-size: 15px;
                  font-weight: 900;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                }
                .urgency-text .red { color: #FF2A2A; }

                @media (max-width: 480px) {
                  .mega-text { font-size: 26px; }
                  .mega-text .gold { font-size: 30px; }
                  .point-hand { font-size: 34px; }
                }
              `}
            </style>

            <div className="max-w-[550px] mx-auto relative z-10">
              <div className="mega-flash">
                <p className="mega-text">
                  ⚡ STOP! ⚡
                  <span className="gold">ORDER HERE NOW</span>
                </p>
              </div>

              <div className="hands-row">
                <span className="point-hand">👇</span>
                <span className="point-hand">👇</span>
                <span className="point-hand">👇</span>
                <span className="point-hand">👇</span>
                <span className="point-hand">👇</span>
              </div>

              <div className="urgency-strip">
                <span className="urgency-icon">⚠️</span>
                <span className="urgency-text">
                  <span className="red">Limited Stock</span> — Order Before Sold Out
                </span>
              </div>
            </div>

            <div id="order-form">
              <OrderForm />
            </div>
          </section>
        </div>

        <div className="mt-6">
          <img
            src={fulaniBenefitsImage}
            alt="Fulani Hair Gro benefits and growth potential"
            className="w-full h-auto"
            width={2048}
            height={2048}
            loading="lazy"
          />
        </div>

        <section className="mt-10 bg-[#DAA520] text-center text-white px-4 py-10 fhg-helvetica">
          <div className="max-w-4xl mx-auto space-y-6">
            <p className="font-semibold text-3xl md:text-4xl leading-snug">
              No more scarves, wigs, or mascara just to hide your hairline
            </p>

            <div className="text-xl md:text-2xl leading-relaxed font-normal space-y-4">
              <p>
                What if you could stop covering up and start showing off your edges?
              </p>
              <p>
                Without wasting money on treatments that don't work. Without changing your lifestyle. Without extra supplements or complicated routines.
              </p>
              <p>
                This 400-year-old Fulani family secret helped me restore my edges in just 14 days—and it can do the same for you.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-6 bg-gray-200 flex items-center justify-center w-full h-auto">
          <img
            src="/gemini-1knotm.png"
            alt="Fulani Hair Gro results from day one to day ten"
            className="w-full h-auto"
            width={2048}
            height={2048}
          />
        </div>

        <section className="mt-10 text-left">
          <h2 className="jandes-headline fhg-gold-heading uppercase mb-4">
            THIS WORKS FOR HAIR (EDGE) LOSS PROBLEMS SUCH AS:
          </h2>

          <ul className="space-y-2 fhg-gold-body list-none">
            <li>👩🏾‍🦱 Thinning hairline and weak edges from tight wigs and braids</li>
            <li>👩🏾‍🦱 Receding edges after childbirth or hormonal changes</li>
            <li>👩🏾‍🦱 Patchy bald spots around the temples and nape</li>
            <li>👩🏾‍🦱 Dry, flaky scalp that makes hair break from the root</li>
            <li>👩🏾‍🦱 Traction alopecia from years of fixing frontals and Ghana weaving</li>
            <li>👩🏾‍🦱 Stress-related shedding around the hairline</li>
            <li>👩🏾‍🦱 Slow-growing edges that refuse to fill in no matter what you try</li>
          </ul>
        </section>

        <section className="mt-10 text-left">
          <h2 className="jandes-headline fhg-gold-heading uppercase mb-4">
            USING THIS FULANI HAIR GRO SYSTEM CORRECTLY WILL:
          </h2>

          <ul className="space-y-2 fhg-gold-body list-none">
            <li>• Help safely support fuller-looking edges and a stronger hairline over time</li>
            <li>• Nourish weak follicles along the temples, nape and front hairline</li>
            <li>• Reduce breakage and shedding caused by tight wigs, braids and relaxers</li>
            <li>• Encourage softer, thicker new growth around your edges</li>
            <li>• Improve scalp comfort so styles feel less tight and irritating</li>
            <li>• Help your natural hairline look healthier and more filled-in in under 14 days of use</li>
          </ul>
        </section>

        <div className="mt-10">
          <img
            src={fulaniExpertImage}
            alt="Fulani Hair Gro specialist holding the product system"
            className="w-full h-auto"
            width={2048}
            height={2048}
            loading="lazy"
          />
        </div>

        <section className="mt-10 text-center">
          <h2 className="jandes-headline text-2xl md:text-3xl text-[#0c7a2e] mb-6">
            A Consultant Trichologist's honest opinion on Fulani Hair Gro
          </h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            <p className="jandes-quote leading-relaxed text-black">
              My name is <span className="font-semibold">Dr. Adaeze Nwosu</span>. I'm a
              <span className="font-semibold"> Consultant Trichologist at LUTH</span>, and I've spent years helping
              women with hair loss.
            </p>
            <p className="jandes-quote leading-relaxed text-black">
              Every week, I see the same heartbreak—women sitting in my office, avoiding eye contact, ashamed to show
              me their edges. They've tried expensive treatments. They've tried every product on the market. Nothing
              worked. Some are ready to give up completely.
            </p>
            <p className="jandes-quote leading-relaxed text-black">
              So when I first heard about Fulani Hair Gro, I was skeptical. Very skeptical. I've seen countless
              'miracle' hair products come and go. An herbal formula promising visible results? I've heard that story
              before.
            </p>
            <p className="jandes-quote leading-relaxed text-black">
              But something made me curious—the 400-year history behind it. This wasn't some lab-created formula. It
              was ancestral knowledge, passed down through generations of Fulani women known for their hair.
            </p>
            <p className="jandes-quote leading-relaxed text-black">
              I decided to recommend it to a few patients who had tried everything else. What did they have to lose?
            </p>
            <p className="jandes-quote leading-relaxed text-black">
              Within weeks, I started getting calls. Photos. Thank-you messages. Women who had given up hope were
              seeing new growth along their hairlines. Edges that had been bare for years were filling in.
            </p>
            <p className="jandes-quote leading-relaxed text-black">
              I don't endorse products lightly. My reputation depends on results, not promises. But Fulani Hair Gro
              earned my recommendation—and it continues to prove me right with every patient I refer.
            </p>
            <p className="jandes-quote leading-relaxed text-black">
              If you're struggling with thinning edges and nothing has worked, I understand your frustration. But
              don't give up yet. This one is different.
            </p>
          </div>
        </section>

        <div className="mt-10 max-w-5xl mx-auto">
          <div className="border-2 border-red-500 border-dotted rounded-2xl py-6 px-3 md:px-6">
            <p className="font-sans text-sm md:text-base font-semibold text-black mb-5 text-center">
              Reviews From Our Happy Nigerian Women
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="luxury-card rounded-xl overflow-hidden p-3 bg-background/80 border border-gold/30">
                <img
                  src={hajiaMaryamTestimonial}
                  alt="WhatsApp testimonial from Hajia Maryam about her edges and confidence"
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
              </div>
              <div className="luxury-card rounded-xl overflow-hidden p-3 bg-background/80 border border-gold/30">
                <img
                  src={hajiaMaryam2}
                  alt="Second WhatsApp testimonial from Hajia Maryam showing product and regrowth update"
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
              </div>
              <div className="luxury-card rounded-xl overflow-hidden p-3 bg-background/80 border border-gold/30">
                <img
                  src={mamaTitiTestimonial1}
                  alt="WhatsApp testimonial from Mama Titi about her hair transformation"
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
              </div>
              <div className="luxury-card rounded-xl overflow-hidden p-3 bg-background/80 border border-gold/30">
                <img
                  src={mamaTiti2}
                  alt="Second WhatsApp testimonial from Mama Titi showing continued results"
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
