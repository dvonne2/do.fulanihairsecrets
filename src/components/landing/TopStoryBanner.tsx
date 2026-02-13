import React, { lazy, Suspense, useEffect, useState, useRef } from 'react';
import { usePrefetch } from '@/hooks/usePrefetch';
import { useAfterHeroLoad } from '@/hooks/useIdleLoad';

const BASE_PATH = import.meta.env.BASE_URL || '/';

// Lazy load heavy images - they're below the fold
const fulaniBenefitsImage = `${BASE_PATH}assets/Gemini_Generated_Image_gj65n6gj65n6gj65-700.webp`;
const fulaniDaysImage = `${BASE_PATH}assets/Gemini_Generated_Image_1knotm1knotm1kno-700.webp`;
const fulaniExpertImage = `${BASE_PATH}assets/Gemini_Generated_Image_xt4o0ixt4o0ixt4o.webp`;
const hajiaMaryamTestimonial = `${BASE_PATH}assets/Hajia Maryam Testimonial.webp`;
const hajiaMaryam2 = `${BASE_PATH}assets/Hajia-Maryam-2.webp`;
const mamaTitiTestimonial1 = `${BASE_PATH}assets/Mama Titi Testimonial1.webp`;
const mamaTiti2 = `${BASE_PATH}assets/Mama Titi 2.webp`;
const heroFulani700 = `${BASE_PATH}assets/hero-fulani-700.webp`;
const heroFulani = `${BASE_PATH}assets/hero-fulani.webp`;
const heroAnimatedWebm = `${BASE_PATH}assets/hero-animated.webm`;
const heroAnimatedMp4 = `${BASE_PATH}assets/hero-animated.mp4`;

// Lazy load OrderForm - 38KB component, preload after hero renders
const OrderForm = lazy(() => import('../OrderFormEmbed'));

export const TopStoryBanner = () => {
  const thankYouPrefetch = usePrefetch(() => import('@/pages/ThankYou'));
  const [loadVideo, setLoadVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const afterHero = useAfterHeroLoad();

  // Lazy load video after 3 seconds or on any user interaction
  useEffect(() => {
    if (!afterHero) return;
    const timer = setTimeout(() => setLoadVideo(true), 3000);
    const handleInteraction = () => setLoadVideo(true);
    
    window.addEventListener('scroll', handleInteraction, { once: true, passive: true });
    window.addEventListener('touchstart', handleInteraction, { once: true, passive: true });
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [afterHero]);

  useEffect(() => {
    if (!afterHero) return;
    try {
      void import('../OrderFormEmbed');
    } catch (error) {
      console.error('Order form prefetch failed:', error);
    }
  }, [afterHero]);

  // Play video once sources are loaded
  useEffect(() => {
    if (loadVideo && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [loadVideo]);

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
          <h2 className="jandes-headline text-3xl md:text-5xl lg:text-6xl leading-snug text-[#B80F66] uppercase">
            Trusted by Thousands of Women Who Successfully Regrew Their Hair Edges with FULANI HAIR GRO
          </h2>
        </div>

        <p className="mt-6 jandes-quote text-lg md:text-xl text-black max-w-3xl mx-auto leading-relaxed">
          Cheaper Than A Hair Transplant In Turkey
        </p>

        <div className="mt-6">
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet={heroFulani700}
              type="image/webp"
            />
            <source
              srcSet={heroFulani}
              type="image/webp"
            />
            <img
              src={heroFulani}
              alt="Fulani Hair Gro hero"
              width={864}
              height={864}
              className="w-full h-auto hidden"
              {...({ fetchpriority: 'high' } as any)}
            />
          </picture>
          <video
            ref={videoRef}
            autoPlay={loadVideo}
            loop
            muted
            playsInline
            preload="none"
            className="w-full h-auto"
            width={864}
            height={864}
            poster={heroFulani700}
            style={{ backgroundImage: `url(${heroFulani700})`, backgroundSize: 'cover' }}
          >
            {loadVideo && (
              <>
                <source src={heroAnimatedWebm} type="video/webm" />
                <source src={heroAnimatedMp4} type="video/mp4" />
              </>
            )}
          </video>
        </div>

        <div className="mt-8 text-left">
          <p className="font-semibold text-xl md:text-2xl leading-snug text-black">
            The ancient Fulani secret that finally treats the root cause of thinning hair edges
          </p>
          <p className="mt-3 text-base md:text-xl text-black leading-relaxed">
            Fulani Hair Gro is the 400-Year Fulani Secret That Targets The ROOT CAUSE
          </p>
          <p className="mt-3 text-base md:text-xl text-black leading-relaxed">
            Most hair products treat SURFACE (hair strand).
          </p>
          <p className="mt-3 text-base md:text-xl text-black leading-relaxed">
            Fulani Hair Gro targets DHT at the FOLLICLE - the actual hormone that shrinks and kills your hair follicles, causing thinning edges.
          </p>
          <p className="mt-3 text-base md:text-xl text-black leading-relaxed">
            When DHT is blocked and follicles are nourished, DORMANT follicles WAKE UP and start growing again.
          </p>
        </div>

        <div id="order-form-container" className="px-4 md:px-6 max-w-4xl mx-auto mt-6">
          <section
            className="scroll-stopper bg-white px-4 md:px-9 py-9 text-center border-y-6 border-yellow-600 relative overflow-hidden"
          >
            <style>
              {`
                /* GPU-accelerated animations only */
                @keyframes mega-pulse {
                  0%, 100% { transform: scale(1); opacity: 1; }
                  50% { transform: scale(1.02); opacity: 0.95; }
                }
                @keyframes point-bounce {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(8px); }
                }
                .mega-flash {
                  background: #D30000;
                  padding: 28px;
                  border-radius: 16px;
                  margin-bottom: 18px;
                  border: 4px solid #FFFFFF;
                  outline: 4px solid #D30000;
                  will-change: transform;
                }
                .mega-text {
                  color: #FFFFFF;
                  font-size: 34px;
                  font-weight: 900;
                  text-transform: uppercase;
                  letter-spacing: 2px;
                  margin: 0;
                  line-height: 1.2;
                }
                .mega-text .gold {
                  color: #DAA520;
                  display: block;
                  font-size: 40px;
                }
                .hands-row {
                  display: flex;
                  justify-content: center;
                  gap: 12px;
                  margin-bottom: 16px;
                }
                .point-hand {
                  font-size: 44px;
                  will-change: transform;
                }
                .urgency-strip {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 10px;
                  background: #B80F66;
                  padding: 14px 24px;
                  border-radius: 8px;
                  margin-bottom: 16px;
                }
                .urgency-strip-3 {
                  display: grid;
                  grid-template-columns: 1fr 1fr 1fr;
                  gap: 8px;
                  margin-bottom: 16px;
                }
                .urgency-section {
                  background: #B80F66;
                  padding: 12px 8px;
                  border-radius: 8px;
                  text-align: center;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  min-height: 80px;
                }
                .urgency-icon { font-size: 20px; margin-bottom: 4px; }
                .urgency-text {
                  color: #FFFFFF;
                  font-size: 12px;
                  font-weight: 900;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  line-height: 1.2;
                }
                .urgency-text .red { color: #E6E6FA; }

                /* Only animate on desktop for performance */
                @media (min-width: 769px) {
                  .mega-flash { animation: mega-pulse 0.8s ease-in-out infinite; }
                  .point-hand { animation: point-bounce 0.5s ease-in-out infinite; }
                  .point-hand:nth-child(2) { animation-delay: 0.1s; }
                  .point-hand:nth-child(3) { animation-delay: 0.2s; }
                  .point-hand:nth-child(4) { animation-delay: 0.3s; }
                  .point-hand:nth-child(5) { animation-delay: 0.4s; }
                }

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

              <div className="urgency-strip-3">
                <div className="urgency-section">
                  <span className="urgency-icon">🚚</span>
                  <span className="urgency-text">
                    <span className="red font-bold">FREE SHIPPING</span> (pay before delivery orders only)<br/>
                    PRE-PAY ONLY
                  </span>
                </div>
                <div className="urgency-section">
                  <span className="urgency-icon">🌙</span>
                  <span className="urgency-text">
                    <span className="red font-bold">FREE BONNET</span><br/>
                    PRE-PAY ONLY
                  </span>
                </div>
                <div className="urgency-section">
                  <span className="urgency-icon">🎁</span>
                  <span className="urgency-text">
                    <span className="red font-bold">FREE BRUSH</span><br/>
                    PREMIUM PACKAGES
                  </span>
                </div>
              </div>
            </div>

            <div id="order-form">
              {afterHero ? (
                <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center"><span className="text-gold font-semibold">Loading order form...</span></div>}>
                  <OrderForm />
                </Suspense>
              ) : (
                <div className="min-h-[400px]" />
              )}
            </div>
          </section>
        </div>

        <div className="mt-6">
          <img
            src={fulaniBenefitsImage}
            srcSet={`${fulaniBenefitsImage} 700w`}
            sizes="(max-width: 768px) 100vw, 700px"
            alt="Fulani Hair Gro benefits and growth potential"
            className="w-full h-auto"
            width={700}
            height={700}
            loading="lazy"
            decoding="async"
          />
        </div>

        <section className="mt-10 bg-[#B80F66] text-center text-white px-4 py-10 fhg-helvetica">
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
            src={fulaniDaysImage}
            srcSet={`${fulaniDaysImage} 700w`}
            sizes="(max-width: 768px) 100vw, 700px"
            alt="Fulani Hair Gro results from day one to day ten"
            className="w-full h-auto"
            width={700}
            height={700}
            loading="lazy"
            decoding="async"
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
                  width={391}
                  height={710}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="luxury-card rounded-xl overflow-hidden p-3 bg-background/80 border border-gold/30">
                <img
                  src={mamaTitiTestimonial1}
                  alt="WhatsApp testimonial from Mama Titi about her hair transformation"
                  className="w-full h-auto object-contain"
                  width={391}
                  height={709}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="luxury-card rounded-xl overflow-hidden p-3 bg-background/80 border border-gold/30">
                <img
                  src={mamaTiti2}
                  alt="Second WhatsApp testimonial from Mama Titi showing continued results"
                  className="w-full h-auto object-contain"
                  width={391}
                  height={709}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
