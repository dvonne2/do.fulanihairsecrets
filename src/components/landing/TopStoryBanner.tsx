import React, { lazy, Suspense, useEffect, useState, useRef } from 'react';
import { usePrefetch } from '@/hooks/usePrefetch';
import { useAfterHeroLoad } from '@/hooks/useIdleLoad';

const BASE_PATH = import.meta.env.BASE_URL || '/';

// Lazy load heavy images - they're below the fold
const fulaniDaysImage = `${BASE_PATH}assets/Gemini_Generated_Image_1knotm1knotm1kno-700.webp`;
const fulaniExpertImage = `${BASE_PATH}assets/Gemini_Generated_Image_xt4o0ixt4o0ixt4o.webp`;
const hajiaMaryamTestimonial = `${BASE_PATH}assets/Hajia%20Maryam%20Testimonial.webp`;
const hajiaMaryam2 = `${BASE_PATH}assets/Hajia-Maryam-2.webp`;
const mamaTitiTestimonial1 = `${BASE_PATH}assets/Mama%20Titi%20Testimonial1.webp`;
const mamaTiti2 = `${BASE_PATH}assets/Mama%20Titi%202.webp`;
const heroFulani = `${BASE_PATH}assets/Real%20Eryka.png`;
const heroMobile = `${BASE_PATH}assets/Real%20Eryka.png`;

// Lazy load OrderForm - 38KB component, preload after hero renders
const OrderForm = lazy(() => import('../OrderFormEmbed'));

export const TopStoryBanner = () => {
  const thankYouPrefetch = usePrefetch(() => import('@/pages/ThankYou'));
  const afterHero = useAfterHeroLoad();

  useEffect(() => {
    if (!afterHero) return;
    try {
      void import('../OrderFormEmbed');
    } catch (error) {
      console.error('Order form prefetch failed:', error);
    }
  }, [afterHero]);

  
  return (
    <section
      id="hero"
      className="bg-white px-4 pt-2 pb-4 mt-0 md:pt-3 md:pb-6 md:mt-0"
      {...thankYouPrefetch}
    >
      <div className="mx-auto text-center">
        <p className="jandes-eyebrow text-black mb-6">
          GROW YOUR FuLLER LONGER THICKER HAIR WITH FULANI HAIR GRO
        </p>
        <div className="border border-[#E6E6E6] px-6 md:px-14 py-8 md:py-10">
          <h7 className="jandes-headline text-2xl md:text-3xl lg:text-4xl leading-tight text-[#B80F66] uppercase font-bold">
            Trusted by Thousands of Women Who Successfully Regrew Their Hair Edges with FULANI HAIR GRO
          </h7>
        </div>

        {/* Bundle Image */}
        <div className="mt-6">
          <img
            src={`${BASE_PATH}assets/66750-bundle.webp`}
            alt="Product Bundle"
            className="w-full h-auto"
            loading="lazy"
          />
        </div>

        {/* ChatGPT Image */}
        <div className="mt-6">
          <img
            src={`${BASE_PATH}assets/ChatGPT%20Image%20Feb%2024,%202026,%2011_21_10%20PM.png`}
            alt="ChatGPT Image"
            className="w-full h-auto"
            loading="lazy"
          />
        </div>

        <p className="mt-6 jandes-quote text-lg md:text-xl text-black max-w-3xl mx-auto leading-relaxed">
          Cheaper Than A Hair Transplant In Turkey
        </p>

        {/* Hero CTA — moved here */}
        <div className="mt-6 text-center">
          <a
            href="#order-form"
            data-form-cta="true"
            className="flex items-center justify-center gap-2 bg-[#5ec239] text-white font-semibold px-10 md:px-14 py-4 rounded-xl shadow-lg hover:scale-105 transition-transform w-full cta-with-arrow"
            style={{ fontSize: '20px' }}
          >
            🛒 ORDER NOW
          </a>
        </div>

        {/* WHAT TO EXPECT Section */}
        <div className="mt-12 text-center">
          <strong 
            className="block"
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '31px',
              fontWeight: '700',
              textAlign: 'center',
              textTransform: 'uppercase',
              textDecoration: 'none'
            }}
          >
            WHAT TO EXPECT
          </strong>

          {/* After 1 Month of Use */}
          <p 
            className="mt-6 text-center"
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '18px',
              fontWeight: '600',
              textTransform: 'none',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            After 1 month of use - Your hair length and density will start to improve.<br/>
            You will start to get more compliments from people.<br/>
            Edges will start to grow.<br/>
            Hair will be more hydrated.<br/>
            Reduction of hair breakage will start to happen.
          </p>

        {/* Download (5) Image */}
        <div className="mt-6 flex justify-center">
          <img
            src={`${BASE_PATH}assets/download%20(5).avif`}
            alt="Download"
            className="w-auto h-auto max-w-md"
            style={{ maxWidth: '400px' }}
            loading="lazy"
          />
        </div>

          {/* Additional Benefits Bullet Points */}
          <ul className="mt-6 list-none p-0">
            <li 
              style={{
                color: '#0A0A0A',
                fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
                fontSize: '16px',
                fontWeight: '400',
                textTransform: 'none',
                textDecoration: 'none',
                textAlign: 'center'
              }}
            >
              • You will get an increase in length, density, thickness in your hair
            </li>
            <li 
              style={{
                color: '#0A0A0A',
                fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
                fontSize: '16px',
                fontWeight: '400',
                textTransform: 'none',
                textDecoration: 'none',
                textAlign: 'center'
              }}
            >
              • You will notice you are more confident about your hair
            </li>
            <li 
              style={{
                color: '#0A0A0A',
                fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
                fontSize: '16px',
                fontWeight: '400',
                textTransform: 'none',
                textDecoration: 'none',
                textAlign: 'center'
              }}
            >
              • You will notice dandruff is gone
            </li>
            <li 
              style={{
                color: '#0A0A0A',
                fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
                fontSize: '16px',
                fontWeight: '400',
                textTransform: 'none',
                textDecoration: 'none',
                textAlign: 'center'
              }}
            >
              • You will notice alot of reduction in hair breakage
            </li>
            <li 
              style={{
                color: '#0A0A0A',
                fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
                fontSize: '16px',
                fontWeight: '400',
                textTransform: 'none',
                textDecoration: 'none',
                textAlign: 'center'
              }}
            >
              • You will notice even fuller hair roots
            </li>
            <li 
              style={{
                color: '#0A0A0A',
                fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
                fontSize: '16px',
                fontWeight: '400',
                textTransform: 'none',
                textDecoration: 'none',
                textAlign: 'center'
              }}
            >
              • Hair has grown 2-3 times faster than the normal growing speed
            </li>
          </ul>

        {/* Download (6) Image */}
        <div className="mt-6 flex justify-center">
          <img
            src={`${BASE_PATH}assets/download%20(6).avif`}
            alt="Download"
            className="w-auto h-auto max-w-md"
            style={{ maxWidth: '400px' }}
            loading="lazy"
          />
        </div>

        {/* 12 Months Benefits */}
        <p 
          className="mt-6 text-center"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
            fontSize: '18px',
            fontWeight: '600',
            textTransform: 'none',
            textDecoration: 'none',
            textAlign: 'center'
          }}
        >
          In 12 months time
        </p>
        
        <ul className="mt-6 list-none p-0">
          <li 
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              textTransform: 'none',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            • You won't need to use haircare products as often
          </li>
          <li 
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              textTransform: 'none',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            • You'll flaunt your natural long, thick, soft hair
          </li>
          <li 
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              textTransform: 'none',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            • You'll feel younger and more confident
          </li>
          <li 
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              textTransform: 'none',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            • No More itching of scalp
          </li>
          <li 
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              textTransform: 'none',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            • Dandruff free guaranteed
          </li>
        </ul>

        {/* Download (9) Image */}
        <div className="mt-6 flex justify-center">
          <img
            src={`${BASE_PATH}assets/download%20(9).avif`}
            alt="Download"
            className="w-auto h-auto max-w-lg"
            style={{ maxWidth: '600px' }}
            loading="lazy"
          />
        </div>

        {/* HOW TO USE Section */}
        <div className="mt-12 text-center">
          <strong 
            className="block"
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '24px',
              fontWeight: '700',
              textAlign: 'center',
              textTransform: 'uppercase',
              textDecoration: 'none'
            }}
          >
            HOW TO USE:
          </strong>
          
          <p 
            className="mt-6 text-left"
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              textTransform: 'none',
              textDecoration: 'none',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            For best results, apply shampoo generously (as regularly as you like) to your scalp & hair and leave it on for around 5 minutes, allowing the ingredients to deeply saturate your tresses then wash off.<br/><br/>
            apply hair pomade to your scalp once a week and massage throughly, allowing the ingredients to deeply saturate your tresses
          </p>
        </div>

          {/* Expectations Bullet Points */}
          <ul className="mt-6 list-none p-0">
            <li 
              style={{
                color: '#0A0A0A',
                fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
                fontSize: '16px',
                fontWeight: '400',
                textTransform: 'none',
                textDecoration: 'none',
                textAlign: 'center'
              }}
            >
              • Your scalp will feel nice and clear
            </li>
            <li 
              style={{
                color: '#0A0A0A',
                fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
                fontSize: '16px',
                fontWeight: '400',
                textTransform: 'none',
                textDecoration: 'none',
                textAlign: 'center'
              }}
            >
              • Hair maybe visually more plumped & hydrated
            </li>
          </ul>
        </div>

        <div className="mt-8 text-left">
          <p className="font-semibold text-xl md:text-2xl leading-snug text-black">
            The ancient Fulani secret that finally treats the root cause of thinning hair edges
          </p>
          <p 
            className="mt-3"
            style={{
              color: '#0A0A0A',
              fontFamily: 'Arvo, serif',
              fontSize: '16px',
              fontWeight: '300',
              textAlign: 'center',
              lineHeight: '1.6',
              textDecoration: 'none',
              textTransform: 'none'
            }}
          >
            The Secret behind the Fulani Hair Gro is actually a 400 year old family heirloom hair growth system used by the people of Fula or Fulani tribe known for their long hair and hair growth portions using herbs from the bushes in Maiduguri.
          </p>
          
          {/* Download Image */}
          <div className="mt-6">
            <img
              src={`${BASE_PATH}assets/download.avif`}
              alt="Download"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
          
          <p 
            className="mt-6"
            style={{
              color: '#0A0A0A',
              fontFamily: 'Arvo, serif',
              fontSize: '16px',
              fontWeight: '300',
              textAlign: 'center',
              lineHeight: '1.6',
              textDecoration: 'none',
              textTransform: 'none'
            }}
          >
            The Fula or Fulani people of Africa are nomads and the women are known for their long hair because they take a lot of pride in their beautiful luscious long hair.
          </p>
        </div>

        {/* Guarantee Bullet Points */}
        <div className="mt-6 text-center">
          <div className="inline-flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              <span className="text-black font-medium">PAYMENT ON DELIVERY</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              <span className="text-black font-medium">30 Days Money Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              <span className="text-black font-medium">Grows Hair Like Magic</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              <span className="text-black font-medium">1-Year Hair Growth Expert Support</span>
            </div>
          </div>
        </div>

        {/* Limited Time Sale Banner */}
        <div className="mt-4 text-center">
          <span 
            style={{
              color: '#ff0000',
              fontWeight: '700',
              fontStyle: 'normal',
              fontVariant: 'normal',
              fontKerning: 'auto',
              fontOpticalSizing: 'auto',
              fontStretch: '100%',
              fontVariationSettings: 'normal',
              fontFeatureSettings: 'normal',
              textTransform: 'none',
              textDecoration: 'none',
              textAlign: 'left',
              textIndent: '0px',
              fontSize: '18px',
              letterSpacing: '0.5px'
            }}
          >
            LIMITED TIME - SALE ENDS TONIGHT
          </span>
        </div>

        {/* ChatGPT Image above first CTA */}
        <div className="mt-6 flex justify-center">
          <img
            src={`${BASE_PATH}assets/ChatGPT%20Image%20Feb%2024,%202026,%2011_59_50%20PM.png`}
            alt="ChatGPT Image"
            className="w-auto h-auto"
            style={{ maxWidth: '900px !important', width: '900px !important' }}
            loading="lazy"
          />
        </div>

        {/* Benefits Bullet Points */}
        <div className="mt-6 text-left">
            <div className="inline-flex flex-col items-start gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[#B80F66">•</span>
                <span className="text-black font-medium">Intense Shine</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#B80F66">•</span>
                <span className="text-black font-medium">Damage Defence</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#B80F66">•</span>
                <span className="text-black font-medium">Volume Builder</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#B80F66">•</span>
                <span className="text-black font-medium">Length Producer</span>
              </div>
            </div>
          </div>
          
          {/* Guarantee Bullet Points */}
          <div className="mt-6 text-center">
            <div className="inline-flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✅</span>
                <span className="text-black font-medium">PAYMENT ON DELIVERY</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✅</span>
                <span className="text-black font-medium">30 Days Money Back Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✅</span>
                <span className="text-black font-medium">Grows Hair Like Magic</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✅</span>
                <span className="text-black font-medium">1-Year Hair Growth Expert Support</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Hajara Personal Story */}
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          My name is Hajara and I come from the Fulani lineage of women who have found and kept the secret for growing long healthy African hair. Even though my ancestors have kept this secret very close to their heart.
        </p>

        {/* Download (1) Image */}
        <div className="mt-6">
          <img
            src={`${BASE_PATH}assets/download%20(1).avif`}
            alt="Download"
            className="w-full h-auto"
            loading="lazy"
          />
        </div>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          I have my grandma's blessing to help women with this combination of herbs that my ancestors have used to grow their hair for centuries.
        </p>

        {/* Fulani GIF */}
        <div className="mt-6">
          <img
            src={`${BASE_PATH}assets/fulani_gif_480x480.gif`}
            alt="Fulani GIF"
            className="w-full h-auto"
            loading="lazy"
          />
        </div>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          My co-founder (a London trained tricologist) and I have successfully combined modern science and African herbs to create unique products that doesn't just work now but as worked for centuries.
        </p>

        {/* Download (2) Image */}
        <div className="mt-6">
          <img
            src={`${BASE_PATH}assets/download%20(2).avif`}
            alt="Download"
            className="w-full h-auto"
            loading="lazy"
          />
        </div>

        {/* Additional CTA Button */}
        <div className="mt-8 text-center">
          <a
            href="#order-form"
            data-form-cta="true"
            className="flex items-center justify-center gap-2 bg-[#5ec239] text-white font-semibold px-10 md:px-14 py-4 rounded-xl shadow-lg hover:scale-105 transition-transform w-full"
            style={{ fontSize: '20px' }}
          >
            Click Here To Order Now and Get<br/>• 1 Hair Bonnet<br/>• 1 Hair Detangler Spray
          </a>
        </div>
        
        <strong 
          className="mt-6 block"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
            fontSize: '31px',
            fontWeight: '700',
            textAlign: 'center',
            textTransform: 'uppercase',
            textDecoration: 'none'
          }}
        >
            WHAT TO EXPECT
          </strong>

            {/* Download (3) Image */}
            {/* <div className="mt-6 flex justify-center">
              <img
                src={`${BASE_PATH}assets/download%20(3).avif`}
                alt="Download"
                className="w-auto h-auto max-w-md"
                style={{ maxWidth: '400px' }}
                loading="lazy"
              />
            </div> */}
            
            {/* Expectations Bullet Points */}
            <ul className="mt-6 list-none p-0">
              <li 
                style={{
                  color: '#0A0A0A',
                  fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
                  fontSize: '16px',
                  fontWeight: '400',
                  textTransform: 'none',
                  textDecoration: 'none',
                  textAlign: 'center'
                }}
              >
                • Your scalp will feel nice and clear
              </li>
              <li 
                style={{
                  color: '#0A0A0A',
                  fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
                  fontSize: '16px',
                  fontWeight: '400',
                  textTransform: 'none',
                  textDecoration: 'none',
                  textAlign: 'center'
                }}
              >
                • Hair maybe visually more plumped & hydrated
              </li>
            </ul>

        {/* 1a GIF */}
        <div className="mt-6 flex justify-center">
          <img
            src={`${BASE_PATH}assets/1a.gif`}
            alt="1a GIF"
            className="w-auto h-auto max-w-md"
            style={{ maxWidth: '400px' }}
            loading="lazy"
          />
        </div>

        {/* Download (4) Image */}
        <div className="mt-6 flex justify-center">
          <img
            src={`${BASE_PATH}assets/download%20(4).avif`}
            alt="Download"
            className="w-auto h-auto max-w-md"
            style={{ maxWidth: '400px' }}
            loading="lazy"
          />
        </div>
        
        {/* After 1 Month Section */}
        <p 
          className="mt-6 text-center"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
            fontSize: '18px',
            fontWeight: '600',
            textTransform: 'none',
            textDecoration: 'none',
            textAlign: 'center'
          }}
        >
          After 1 month:
        </p>
        
        {/* Additional Benefits Bullet Points */}
        <ul className="mt-6 list-none p-0">
          <li 
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              textTransform: 'none',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            • Your hair length and density will start to improve
          </li>
          <li 
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              textTransform: 'none',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            • You will start to get more compliments from people
          </li>
          <li 
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              textTransform: 'none',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            • Edges will start to grow
          </li>
          <li 
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              textTransform: 'none',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            • Hair will be more hydrated
          </li>
          <li 
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              textTransform: 'none',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            • Reduction of hair breakage will start to happen
          </li>
        </ul>

        {/* Download (5) Image */}
        <div className="mt-6 flex justify-center">
          <img
            src={`${BASE_PATH}assets/download%20(5).avif`}
            alt="Download"
            className="w-auto h-auto max-w-md"
            style={{ maxWidth: '400px' }}
            loading="lazy"
          />
        </div>

        {/* Download (7) Image */}
        <div className="mt-6 flex justify-center">
          <img
            src={`${BASE_PATH}assets/download%20(7).avif`}
            alt="Download"
            className="w-auto h-auto max-w-md"
            style={{ maxWidth: '400px' }}
            loading="lazy"
          />
        </div>
        
        {/* Week 2-3 Benefits Bullet Points */}
        <ul className="mt-6 list-none p-0">
          <li 
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              textTransform: 'none',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            • You will get an increase in length, density, thickness in your hair
          </li>
          <li 
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              textTransform: 'none',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            • You will notice you are more confident about your hair
          </li>
          <li 
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              textTransform: 'none',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            • You will notice dandruff is gone
          </li>
          <li 
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              textTransform: 'none',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            • You will notice alot of reduction in hair breakage
          </li>
          <li 
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              textTransform: 'none',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            • You will notice even fuller hair roots
          </li>
          <li 
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              textTransform: 'none',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            • Hair has grown 2-3 times faster than the normal growing speed
          </li>
        </ul>

        {/* Additional Long-term Benefits */}
        <ul className="mt-6 list-none p-0">
          <li 
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              textTransform: 'none',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            • You won't need to use haircare products as often
          </li>
          <li 
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              textTransform: 'none',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            • You'll flaunt your natural long, thick, soft hair
          </li>
          <li 
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              textTransform: 'none',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            • You'll feel younger and more confident
          </li>
          <li 
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              textTransform: 'none',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            • No More itching of scalp
          </li>
          <li 
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              textTransform: 'none',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            • Dandruff free guaranteed
          </li>
        </ul>

        {/* HOW TO USE Section */}
        <div className="mt-12 text-center">
          <strong 
            className="block"
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '24px',
              fontWeight: '700',
              textAlign: 'center',
              textTransform: 'uppercase',
              textDecoration: 'none'
            }}
          >
            HOW TO USE:
          </strong>
          
          <p 
            className="mt-6 text-left"
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              textTransform: 'none',
              textDecoration: 'none',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            For best results, apply shampoo generously (as regularly as you like) to your scalp & hair and leave it on for around 5 minutes, allowing the ingredients to deeply saturate your tresses then wash off.<br/><br/>
            apply hair pomade to your scalp once a week and massage throughly, allowing the ingredients to deeply saturate your tresses
          </p>
        </div>

        {/* Download (6) Image */}
        <div className="mt-6 flex justify-center">
          <img
            src={`${BASE_PATH}assets/download%20(6).avif`}
            alt="Download"
            className="w-auto h-auto max-w-md"
            style={{ maxWidth: '400px' }}
            loading="lazy"
          />
        </div>

        {/* Download (8) Image */}
        <div className="mt-6 flex justify-center">
          <img
            src={`${BASE_PATH}assets/download%20(8).avif`}
            alt="Download"
            className="w-auto h-auto max-w-md"
            style={{ maxWidth: '400px' }}
            loading="lazy"
          />
        </div>
        
        {/* Long-term Benefits Bullet Points */}
        <ul className="mt-6 list-none p-0">
          <li 
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              textTransform: 'none',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            • You will get 2x more hair length and density
          </li>
          <li 
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              textTransform: 'none',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            • You will be able to style your hair in different ways
          </li>
          <li 
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              textTransform: 'none',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            • You will feel more beautiful and confident
          </li>
          <li 
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              textTransform: 'none',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            • You will get more attention from people
          </li>
          <li 
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              textTransform: 'none',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            • You will be able to go out without feeling self conscious
          </li>
        </ul>

        {/* Download (9) Image */}
        <div className="mt-6 flex justify-center">
          <img
            src={`${BASE_PATH}assets/download%20(9).avif`}
            alt="Download"
            className="w-auto h-auto max-w-lg"
            style={{ maxWidth: '600px' }}
            loading="lazy"
          />
        </div>

        {/* Download (10) Image */}
        <div className="mt-6 flex justify-center">
          <img
            src={`${BASE_PATH}assets/download%20(10).avif`}
            alt="Download"
            className="w-auto h-auto max-w-lg"
            style={{ maxWidth: '600px' }}
            loading="lazy"
          />
        </div>
        
        {/* Product Information */}
        <p 
          className="mt-6 text-center"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
            fontSize: '16px',
            fontWeight: '400',
            textTransform: 'none',
            textDecoration: 'none',
            textAlign: 'center'
          }}
        >
          Net Shampoo Content: 500ml<br/>
          Net Pomade Content: 150ml
        </p>

        {/* Download (11) Image */}
        <div className="mt-6 flex justify-center">
          <img
            src={`${BASE_PATH}assets/download%20(11).avif`}
            alt="Download"
            className="w-auto h-auto"
            style={{ maxWidth: '900px !important', width: '900px !important' }}
            loading="lazy"
          />
        </div>

        {/* 1ezgif Image */}
        <div className="mt-6 flex justify-center">
          <img
            src={`${BASE_PATH}assets/1ezgif-4-7ec1374048a8%20(2).gif`}
            alt="1ezgif"
            className="w-auto h-auto"
            style={{ maxWidth: '900px !important', width: '900px !important' }}
            loading="lazy"
          />
        </div>
        
        <strong 
          className="mt-6 block"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
            fontSize: '31px',
            fontWeight: '700',
            textAlign: 'center',
            textTransform: 'uppercase',
            textDecoration: 'none'
          }}
        >
          WHY DOES IT WORK?
        </strong>
        
        <strong 
          className="mt-6 block"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '700',
            textAlign: 'left',
            textTransform: 'none',
            textDecoration: 'none'
          }}
        >
          FULANI HAIR GRO PROPRIETARY BLEND
          <br />
          (family secret)
        </strong>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'left',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          This group of herbs are plucked from the bushes in Maiduguri and has been a heirloom amongst the women in my Fulani family for centuries. People think Fulani women have naturally long hair and that is partly the truth but any woman can have naturally long hair if she uses the right herbs in her hair.
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'left',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          Even though my ancestors have kept this secret very close to their heart. I have my grandma's blessing to help women with this combination of herbs that my ancestors have used to grow their hair for centuries.
        </p>

        {/* Mung Bean and Red Clover Image */}
        <div className="mt-6 flex justify-center">
          <img
            src={`${BASE_PATH}assets/MungBeanandRedClover_2_75x.webp`}
            alt="Mung Bean and Red Clover"
            className="w-auto h-auto"
            style={{ maxWidth: '900px !important', width: '900px !important' }}
            loading="lazy"
          />
        </div>
        
        <strong 
          className="mt-6 block"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '700',
            textAlign: 'center',
            textTransform: 'none',
            textDecoration: 'none'
          }}
        >
          MUNG BEAN & RED CLOVER
        </strong>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          In clinical studies, shown to help inhibit the production of hair damaging DHT and and inflammatory cytokines while fortifying the cell matrix of the derma papilla*
        </p>

        {/* Turmeric Image */}
        <div className="mt-6 flex justify-center">
          <img
            src={`${BASE_PATH}assets/Turmeric_1_75x.webp`}
            alt="Turmeric"
            className="w-auto h-auto"
            style={{ maxWidth: '900px !important', width: '900px !important' }}
            loading="lazy"
          />
        </div>
        
        <strong 
          className="mt-6 block"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '700',
            textAlign: 'center',
            textTransform: 'none',
            textDecoration: 'none'
          }}
        >
          CURCUMIN
        </strong>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          In clinical studies, highly concentrated proteins secreted from the stem cells of the turmeric root have been shown to increase the delivery of 1GF-1 & miRNA-31 to the derma papilla which helps lengthen the hair's growth (anagen) phase.*
        </p>

        {/* Tobacco Image */}
        <div className="mt-6 flex justify-center overflow-visible">
          <img
            src={`${BASE_PATH}assets/Tobacco_1_75x.webp`}
            alt="Tobacco"
            className="w-auto h-auto"
            style={{ 
              maxWidth: '2500px !important', 
              width: '2500px !important',
              minWidth: '2000px !important',
              height: 'auto !important',
              display: 'block !important',
              transform: 'scale(1.5) !important'
            }}
            loading="lazy"
          />
        </div>
        
        <strong 
          className="mt-6 block"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '700',
            textAlign: 'center',
            textTransform: 'none',
            textDecoration: 'none'
          }}
        >
          NICOTIANA BENTHAMIANA
        </strong>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          plant-based proteins cultivated and harvested from northern Nigeria have been shown to significantly increase the density of hair roots (by up to 50%)*.
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          *https://www.ncbi.nlm.nih.gov/pubmed/23449130
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          *https://www.ncbi.nlm.nih.gov/pubmed/23098745
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          *https://www.ncbi.nlm.nih.gov/pubmed/23098745
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          **https://www.ncbi.nlm.nih.gov/pubmed/27213821
        </p>
        
        <strong 
          className="mt-6 block"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '20px',
            fontWeight: '700',
            textAlign: 'center',
            textTransform: 'none',
            textDecoration: 'none'
          }}
        >
          Size
        </strong>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          Net Shampoo Content: 500ml
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          Net Conditioner Content: 500ml
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          Net Pomade Content: 150ml
        </p>

        {/* Download (11) Image */}
        <div className="mt-6 flex justify-center">
          <img
            src={`${BASE_PATH}assets/download%20(11).avif`}
            alt="Download"
            className="w-auto h-auto"
            style={{ maxWidth: '900px !important', width: '900px !important' }}
            loading="lazy"
          />
        </div>

                
        <strong 
          className="mt-6 block"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
            fontSize: '31px',
            fontWeight: '400',
            textAlign: 'center',
            textTransform: 'uppercase',
            textDecoration: 'none'
          }}
        >
          OUR PROMISE
        </strong>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          In 12 month's or less, your hair will look longer and much better.
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          We guarantee luscious hair within 12 months.
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          This is why we created Fulani Hair Gro. This is our promise.
        </p>
        
        <strong 
          className="mt-6 block"
          style={{
            color: '#FFFFFF',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '700',
            textAlign: 'center',
            textTransform: 'none',
            textDecoration: 'none'
          }}
        >
          #LOVEFULANIHAIRGRO
        </strong>

        {/* 1ezgif-4-7ec1374048a8 (2) GIF */}
        <div className="mt-6 flex justify-center">
          <img
            src={`${BASE_PATH}assets/1ezgif-4-7ec1374048a8%20(2).gif`}
            alt="1ezgif"
            className="w-auto h-auto"
            style={{ maxWidth: '900px !important', width: '900px !important' }}
            loading="lazy"
          />
        </div>
        
        {/* Our Happy Customers Section */}
        <div className="mt-12 mb-8">
          {/* Hero Image */}
          <div className="mb-6">
            <picture>
              <source
                media="(max-width: 767px)"
                srcSet={heroMobile}
                type="image/png"
              />
              <source
                srcSet={heroFulani}
                type="image/png"
              />
              <img
                src={heroFulani}
                alt="Fulani Hair Gro hero"
                width={864}
                height={864}
                className="w-full h-auto"
                {...({ fetchpriority: 'high' } as any)}
              />
            </picture>
          </div>

          <h2 
            className="text-center mb-4"
            style={{
              color: '#0A0A0A',
              fontFamily: 'Arvo, serif',
              fontSize: '32px',
              fontWeight: '700',
              textAlign: 'center',
              textTransform: 'none',
              textDecoration: 'none',
              lineHeight: '1.2'
            }}
          >
            Our Happy Customers Who Love FULANI HAIR GRO
          </h2>
          
          <p 
            className="text-center"
            style={{
              color: '#666',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '18px',
              fontWeight: '400',
              textAlign: 'center',
              lineHeight: '1.5',
              marginTop: '8px',
              marginBottom: '24px'
            }}
          >
            Real Reviews From Happy Customers
          </p>

          {/* 3 Customer Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Customer Box 1 - Video */}
            <div style={{
              background: '#fff',
              border: '2px solid #DAA520',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
              boxShadow: 'none'
            }}>
              <div style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                overflow: 'hidden',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/myJDa7s6O5w?si=Ji6uQgEZo2CbWflm"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '8px'
                  }}
                />
              </div>
              <h3 style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '18px',
                fontWeight: '700',
                color: '#0A0A0A',
                marginBottom: '8px'
              }}>
                Customer Video Review
              </h3>
              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.5',
                fontStyle: 'italic'
              }}>
                "Watch real customer testimonials and see the amazing results for yourself!"
              </p>
            </div>

            {/* Customer Box 2 - Video */}
            <div style={{
              background: '#fff',
              border: '2px solid #DAA520',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
              boxShadow: 'none'
            }}>
              <div style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                overflow: 'hidden',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/xJ4vGH2i48g?si=0yJtHDM5TFhSR6xc"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '8px'
                  }}
                />
              </div>
              <h3 style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '18px',
                fontWeight: '700',
                color: '#0A0A0A',
                marginBottom: '8px'
              }}>
                Customer Success Story
              </h3>
              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.5',
                fontStyle: 'italic'
              }}>
                "See how Fulani Hair Gro transformed this customer's hair growth journey!"
              </p>
            </div>

            {/* Customer Box 3 - Video */}
            <div style={{
              background: '#fff',
              border: '2px solid #DAA520',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
              boxShadow: 'none'
            }}>
              <div style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                overflow: 'hidden',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/LNkhqS3-Kxo?si=Lji748md9VrLgMRA"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '8px'
                  }}
                />
              </div>
              <h3 style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '18px',
                fontWeight: '700',
                color: '#0A0A0A',
                marginBottom: '8px'
              }}>
                Customer Transformation
              </h3>
              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.5',
                fontStyle: 'italic'
              }}>
                "Watch this incredible hair transformation journey with Fulani Hair Gro!"
              </p>
            </div>
          </div>
        </div>

        {/* Green CTA Button before WHAT IS THE FULANI HAIR GRO? */}
        <div className="mt-6 text-center">
          <a
            href="#order-form"
            data-form-cta="true"
            className="flex items-center justify-center gap-2 bg-[#5ec239] text-white font-semibold px-10 md:px-14 py-4 rounded-xl shadow-lg hover:scale-105 transition-transform w-full"
            style={{ fontSize: '20px' }}
          >
            Click Here To Order Now and Get<br/>• 1 Hair Bonnet<br/>• 1 Hair Detangler Spray
          </a>
        </div>

        <strong 
          className="mt-6 block"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '24px',
            fontWeight: '300',
            textAlign: 'center',
            textTransform: 'none',
            textDecoration: 'none'
          }}
        >
          WHAT IS THE FULANI HAIR GRO?
        </strong>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '18px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          If you want to achieve amazing hair length, thickness and shine then you have to give your hair that luxury hair care.
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '18px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          The Fulani Hair GRO provides that for you!
        </p>
        
        <strong 
          className="mt-6 block"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Lato, sans-serif',
            fontSize: '28px',
            fontWeight: '100',
            textAlign: 'justify',
            textTransform: 'none',
            textDecoration: 'underline'
          }}
        >
          OUR STORY
        </strong>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'justify',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          My name is Hajara and even though I was born and bred in Ogbomosho, Nigeria - my family come from the Fula tribe bordering Nigeria & Chad . As a little girl I watched the women in my family use organic and traditional beauty secrets to improve and maintain their beauty but me being a tomboy, I never bothered to learn these secrets (I regret it....Lol) .
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'justify',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          Anyway fast-forward to my 29th birthday after my second baby I realised my very beautiful hair was starting to thin - in fact I had no edges anymore, my hair was becoming Iya eko (both sides of edges gone)
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'justify',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          I tried everything from premium hair shampoos to treatment from my trichologist friend (now my co-founder).
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'justify',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          Nothing worked!
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'justify',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          She concluded it is imbalance in my hormones that was causing this hair loss.
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'justify',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          She advised that I stop combing my hair and wearing wigs - and eat more green vegetables if I wanted to save my own hair. Which I did but ....
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'justify',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          NOTHING WORKED!!
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'justify',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          By my 33rd birthday my grandfather passed on and we all had to travel to Maiduguri for his burial, a truly painful time for us especially because I had not been to visit for over 10 years - I always promised to visit but just did not have the time because of work
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'justify',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          Anyway back to my story, got to Maduguri and we successfully buried grandpa, 2 days after the burial my grandmother a 72 year old woman woke me up and gave me a local organic shampoo and a pomade for my hair. She promised that if I wash my hair at least once a week with the shampoo and oil my scalp with the pomade once a week too that my hair will grow back. I thanked her (she is sweet)
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '22px',
            fontWeight: '300',
            textAlign: 'justify',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          The exact problem I was facing
        </p>
        
        <ul className="mt-6" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li 
            className="mb-2"
            style={{
              color: '#0A0A0A',
              fontFamily: 'Arvo, serif',
              fontSize: '16px',
              fontWeight: '300',
              textAlign: 'center',
              lineHeight: '1.6',
              textDecoration: 'none',
              textTransform: 'none'
            }}
          >
            Thick dandruff - I had terrible dandruff the type that when you scratch it off blood comes out and it itches like crazy
          </li>
        </ul>

        {/* Download (14) Image */}
        <div className="mt-6 flex justify-center">
          <img
            src={`${BASE_PATH}assets/download%20(14).avif`}
            alt="Download"
            className="w-auto h-auto"
            style={{ maxWidth: '900px !important', width: '900px !important' }}
            loading="lazy"
          />
        </div>
        
        <ul className="mt-6" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li 
            className="mb-2"
            style={{
              color: '#0A0A0A',
              fontFamily: 'Arvo, serif',
              fontSize: '16px',
              fontWeight: '300',
              textAlign: 'center',
              lineHeight: '1.6',
              textDecoration: 'none',
              textTransform: 'none'
            }}
          >
            Thinning edges - the two sides of my head looked like the back of a porcelain plate - shinny with no single hair
          </li>
          <li 
            className="mb-2"
            style={{
              color: '#0A0A0A',
              fontFamily: 'Arvo, serif',
              fontSize: '16px',
              fontWeight: '300',
              textAlign: 'center',
              lineHeight: '1.6',
              textDecoration: 'none',
              textTransform: 'none'
            }}
          >
            Decreased hair thickness - the volume in my hair was gone and the hair was limp and lifeless.
          </li>
        </ul>

        {/* Download (2) Image */}
        <div className="mt-6 flex justify-center">
          <img
            src={`${BASE_PATH}assets/download%20(2).avif`}
            alt="Download"
            className="w-auto h-auto"
            style={{ maxWidth: '900px !important', width: '900px !important' }}
            loading="lazy"
          />
        </div>
        
        <ul className="mt-6" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li 
            className="mb-2"
            style={{
              color: '#0A0A0A',
              fontFamily: 'Arvo, serif',
              fontSize: '16px',
              fontWeight: '300',
              textAlign: 'center',
              lineHeight: '1.6',
              textDecoration: 'none',
              textTransform: 'none'
            }}
          >
            Increased hair coarseness - my hair had become very coarse and unmanageable
          </li>
        </ul>

        {/* Download (15) Image */}
        <div className="mt-6 flex justify-center">
          <img
            src={`${BASE_PATH}assets/download%20(15).avif`}
            alt="Download"
            className="w-auto h-auto"
            style={{ maxWidth: '900px !important', width: '900px !important' }}
            loading="lazy"
          />
        </div>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'justify',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          By now I felt nothing will grow my hair and least of all - some local grandma hair concoction, yet I was desperate enough to try anything
        </p>

        {/* Download (16) Image */}
        <div className="mt-6 flex justify-center">
          <img
            src={`${BASE_PATH}assets/download%20(16).avif`}
            alt="Download"
            className="w-auto h-auto"
            style={{ maxWidth: '900px !important', width: '900px !important' }}
            loading="lazy"
          />
        </div>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'justify',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          so I did as she instructed, I used her shampoo and conditioner every 2 weeks and used the pomade once a day and massaged it into my scalp
        </p>

        {/* Bundle System Image */}
        <div className="mt-6 flex justify-center">
          <img
            src={`${BASE_PATH}assets/bundle-system.webp`}
            alt="Bundle System"
            className="w-auto h-auto"
            style={{ maxWidth: '900px !important', width: '900px !important' }}
            loading="lazy"
          />
        </div>
        
        {/* CTA Button before The Miracle */}
        <div className="mt-8 flex justify-center">
          <button 
            onClick={() => {
              const orderForm = document.getElementById('order-form');
              if (orderForm) {
                orderForm.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: '600',
              letterSpacing: '0.5px'
            }}
          >
            Click Here to Start Your Hair Recovery Journey →
          </button>
        </div>
        
        <strong 
          className="mt-6 block"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '28px',
            fontWeight: '300',
            textAlign: 'center',
            textTransform: 'none',
            textDecoration: 'none'
          }}
        >
          The Miracle
        </strong>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          I peeled off every dandruff with a metal object (cheap spoon) then washed my hair with the shampoo and then applied the pomade.
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          Within a short time,
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          My hair edges grew back tremendously
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          The dandruff disappeared
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          The hair volume was restored even thicker
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          Hair became very soft and easy to manage
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          Friends started asking me what the secret was so I had my grandma send some down packs to Lagos for me from Maiduguri and I gave a few friends too...... Guess what!!
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          the same miracle happened to their own hair
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          It grew back tremendously, thickened and shined.
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          I realised I was on to something so I travelled back to Maiduguri to learn the secret of what she used and every ingredient is from the bush, dried and mixed - it is all natural and organic yet worked with incredible results. My tricologist friend was astonished by the result and begged to partner with me - she raised the funds and also the science to make it even better.
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          That is how we managed to marry modern science and african traditional herbs to produce a great product that works
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          Fulani Hair GRO is in honour of my grandma - Hajia Aissata Cissé ❤
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          In loving memory of
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          Hajia Aissata Cissé 👑❤️
        </p>
        
        <p 
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          My grandmother. My teacher. My reason.
        </p>

        {/* WhatsApp Testimonials */}
        <div className="mt-10 max-w-5xl mx-auto">
          <div className="border-2 border-red-500 border-dotted rounded-2xl py-6 px-3 md:px-6">
            <p className="font-sans text-sm md:text-base font-semibold text-black mb-5 text-center">
              Reviews From Our Happy Nigerian Women
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl overflow-hidden p-3 bg-white border border-gray-200 shadow-sm">
                <img
                  src={hajiaMaryamTestimonial}
                  alt="WhatsApp testimonial from Hajia Maryam about her edges and confidence"
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
              </div>
              <div className="rounded-xl overflow-hidden p-3 bg-white border border-gray-200 shadow-sm">
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
              <div className="rounded-xl overflow-hidden p-3 bg-white border border-gray-200 shadow-sm">
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
              <div className="rounded-xl overflow-hidden p-3 bg-white border border-gray-200 shadow-sm">
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

        {/* How To Place Your Order Section */}
        <section className="relative overflow-hidden" style={{
          padding: '80px 18px 90px',
          background: 'linear-gradient(180deg, #B88900 0%, #D4AF37 45%, #8A6400 100%)',
          position: 'relative'
        }}>
          {/* Subtle depth/vignette */}
          <div style={{
            position: 'absolute',
            inset: '-40px',
            background: 'radial-gradient(circle at 50% 20%, rgba(255,255,255,0.12), rgba(0,0,0,0.22) 70%)',
            pointerEvents: 'none'
          }} />
          
          <div style={{ position: 'relative', maxWidth: '980px', margin: '0 auto' }}>
            <h2 style={{
              color: '#fff',
              textAlign: 'center',
              fontWeight: '800',
              letterSpacing: '-0.5px',
              fontSize: 'clamp(34px, 4.2vw, 62px)',
              margin: '0 0 46px'
            }}>
              How To Place Your Order
            </h2>

            {/* Step Cards */}
            <div style={{ maxWidth: '920px', margin: '0 auto' }}>
              {/* Step 1 */}
              <div style={{
                background: '#ffffff',
                border: '4px solid #F2A6A1',
                borderRadius: '28px',
                boxShadow: '0 18px 40px rgba(0,0,0,0.18)',
                padding: '44px 28px',
                textAlign: 'center',
                margin: '0 auto 40px'
              }}>
                <div style={{
                  fontSize: '58px',
                  lineHeight: '1',
                  marginBottom: '18px',
                  color: '#0B2C6B',
                  filter: 'saturate(1.05)'
                }}>
                  🛒
                </div>
                <h3 style={{
                  margin: '0 0 14px',
                  color: '#111111',
                  fontWeight: '900',
                  letterSpacing: '0.3px',
                  fontSize: 'clamp(20px, 2.2vw, 34px)',
                  textTransform: 'uppercase'
                }}>
                  ORDER RIGHT NOW TO GET YOURS
                </h3>
                <p style={{
                  margin: '0',
                  color: '#4b4b4b',
                  fontSize: 'clamp(16px, 1.5vw, 20px)',
                  lineHeight: '1.55'
                }}>
                  Click the <b><u>Buy Now</u></b> button to order from us via our website form or our WhatsApp or call
                </p>
              </div>

              {/* Step 2 */}
              <div style={{
                background: '#ffffff',
                border: '4px solid #F2A6A1',
                borderRadius: '28px',
                boxShadow: '0 18px 40px rgba(0,0,0,0.18)',
                padding: '44px 28px',
                textAlign: 'center',
                margin: '0 auto 40px'
              }}>
                <div style={{
                  fontSize: '58px',
                  lineHeight: '1',
                  marginBottom: '18px',
                  color: '#0B2C6B',
                  filter: 'saturate(1.05)'
                }}>
                  📞
                </div>
                <h3 style={{
                  margin: '0 0 14px',
                  color: '#111111',
                  fontWeight: '900',
                  letterSpacing: '0.3px',
                  fontSize: 'clamp(20px, 2.2vw, 34px)',
                  textTransform: 'uppercase'
                }}>
                  WE'LL CONFIRM YOUR ORDER
                </h3>
                <p style={{
                  margin: '0',
                  color: '#4b4b4b',
                  fontSize: 'clamp(16px, 1.5vw, 20px)',
                  lineHeight: '1.55'
                }}>
                  We'll call to confirm your order and start processing your order very immediately.
                </p>
              </div>

              {/* Step 3 */}
              <div style={{
                background: '#ffffff',
                border: '4px solid #F2A6A1',
                borderRadius: '28px',
                boxShadow: '0 18px 40px rgba(0,0,0,0.18)',
                padding: '44px 28px',
                textAlign: 'center',
                margin: '0 auto 40px'
              }}>
                <div style={{
                  fontSize: '58px',
                  lineHeight: '1',
                  marginBottom: '18px',
                  color: '#0B2C6B',
                  filter: 'saturate(1.05)'
                }}>
                  🚚
                </div>
                <h3 style={{
                  margin: '0 0 14px',
                  color: '#111111',
                  fontWeight: '900',
                  letterSpacing: '0.3px',
                  fontSize: 'clamp(20px, 2.2vw, 34px)',
                  textTransform: 'uppercase'
                }}>
                  WE'LL SEND YOUR PRODUCT
                </h3>
                <p style={{
                  margin: '0',
                  color: '#4b4b4b',
                  fontSize: 'clamp(16px, 1.5vw, 20px)',
                  lineHeight: '1.55'
                }}>
                  We'll send the product to you with the fastest delivery service in your state.
                </p>
              </div>

              {/* Step 4 */}
              <div style={{
                background: '#ffffff',
                border: '4px solid #F2A6A1',
                borderRadius: '28px',
                boxShadow: '0 18px 40px rgba(0,0,0,0.18)',
                padding: '44px 28px',
                textAlign: 'center',
                margin: '0 auto 0'
              }}>
                <div style={{
                  fontSize: '58px',
                  lineHeight: '1',
                  marginBottom: '18px',
                  color: '#0B2C6B',
                  filter: 'saturate(1.05)'
                }}>
                  😊
                </div>
                <h3 style={{
                  margin: '0 0 14px',
                  color: '#111111',
                  fontWeight: '900',
                  letterSpacing: '0.3px',
                  fontSize: 'clamp(20px, 2.2vw, 34px)',
                  textTransform: 'uppercase'
                }}>
                  RECEIVE & PAY (1-3 DAYS)
                </h3>
                <p style={{
                  margin: '0',
                  color: '#4b4b4b',
                  fontSize: 'clamp(16px, 1.5vw, 20px)',
                  lineHeight: '1.55'
                }}>
                  We'll send your product to your doorstep. We offer payment on delivery (cash/transfer).
                </p>
              </div>
            </div>

          {/* ORDER FORM — placed right after RECEIVE & PAY step */}
          <div id="order-form-container" className="px-4 md:px-6 max-w-4xl mx-auto mt-10">
            <section className="bg-white px-4 md:px-9 py-9 text-center border-y-4 border-[#B80F66] relative overflow-hidden">
              <div className="max-w-[550px] mx-auto mb-6">
                {/* Bold Pricing Section */}
                <section className="relative overflow-hidden mb-8" style={{
                  padding: '60px 18px',
                  background: '#FFFFFF',
                  position: 'relative',
                  margin: '-40px -20px 40px -20px',
                  borderRadius: '12px'
                }}>
                  {/* Subtle depth/vignette */}
                  <div style={{
                    position: 'absolute',
                    inset: '-20px',
                    background: 'radial-gradient(circle at center, transparent 60%, rgba(0,0,0,0.15) 100%)',
                    pointerEvents: 'none'
                  }} />
                  
                  <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    {/* Main Headline */}
                    <h2 style={{
                      color: '#333333',
                      textAlign: 'center',
                      fontWeight: '900',
                      letterSpacing: '1px',
                      fontSize: 'clamp(20px, 3vw, 32px)',
                      marginBottom: '12px',
                      textTransform: 'uppercase',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}>
                      HOW MUCH IS THE FULANI HAIR GRO SET?
                    </h2>

                    {/* Sub-headline */}
                    <p style={{
                      color: '#333333',
                      textAlign: 'center',
                      fontWeight: '700',
                      fontSize: 'clamp(14px, 2vw, 18px)',
                      marginBottom: '30px',
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                    }}>
                      Exclusive Launch Sales Promo – Limited Slots Only
                    </p>

                    {/* Price Layout */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                      {/* Old Price */}
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <span style={{
                          fontSize: 'clamp(24px, 3vw, 36px)',
                          fontWeight: '700',
                          color: '#2C1810',
                          fontFamily: 'Georgia, serif',
                          position: 'relative',
                          display: 'inline-block'
                        }}>
                          WAS ₦55,000
                        </span>
                        {/* Strike-through line */}
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '-8px',
                          right: '-8px',
                          height: '3px',
                          background: '#DC2626',
                          transform: 'rotate(-5deg)',
                          transformOrigin: 'center',
                          animation: 'strikeThrough 2s ease-in-out infinite'
                        }} />
                      </div>

                      {/* New Price */}
                      <div style={{
                        position: 'relative',
                        display: 'inline-block',
                        padding: '16px 32px',
                        borderRadius: '50%',
                        background: 'transparent',
                        border: '3px solid #D4AF37',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                      }}>
                        <span style={{
                          fontSize: 'clamp(36px, 4.5vw, 56px)',
                          fontWeight: '900',
                          color: '#0B5E20',
                          textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          display: 'block',
                          animation: 'priceBounce 0.6s ease-out'
                        }}>
                          NOW ₦32,750
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Add global styles for animation */}
                <style>{`
                  @keyframes priceBounce {
                    0% { transform: scale(0.8); opacity: 0; }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); opacity: 1; }
                  }
                  @keyframes strikeThrough {
                    0% { 
                      transform: scaleX(0) rotate(-5deg);
                      opacity: 0;
                    }
                    25% {
                      transform: scaleX(1.1) rotate(-5deg);
                      opacity: 1;
                    }
                    50% { 
                      transform: scaleX(1) rotate(-5deg);
                      opacity: 1;
                    }
                    75% {
                      transform: scaleX(1) rotate(-5deg);
                      opacity: 1;
                    }
                    100% { 
                      transform: scaleX(0) rotate(-5deg);
                      opacity: 0;
                    }
                  }
                `}</style>

                {/* Download (12) Image */}
                <div className="mb-6 flex justify-center">
                  <img
                    src={`${BASE_PATH}assets/download%20(12).avif`}
                    alt="Download"
                    className="w-auto h-auto"
                    style={{ maxWidth: '900px !important', width: '900px !important' }}
                    loading="lazy"
                  />
                </div>

                <p className="font-semibold text-2xl md:text-3xl text-black mb-2">
                  Choose Your Preferred Bundle Below
                </p>
                <p className="text-base text-gray-600 mb-4">
                  Select a bundle, fill in your details, and we'll deliver to your doorstep.
                </p>
                <div className="grid grid-cols-1 gap-2">
                  <button 
                    onClick={() => {
                      const orderForm = document.getElementById('order-form');
                      if (orderForm) {
                        orderForm.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="bg-[#DAA520] hover:bg-[#B8860B] transition-all duration-300 transform hover:scale-105 rounded-lg py-4 px-4 text-center cursor-pointer shadow-lg hover:shadow-xl"
                  >
                    <span className="text-white text-lg font-bold uppercase block">FREE SHIPPING</span>
                    <span className="text-white/80 text-lg font-bold block">Pay Before Delivery Only</span>
                    <span className="text-white text-sm font-normal block mt-1">Click to Order Now →</span>
                  </button>
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
          </div>
        </section>

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

        
        <section className="mt-10 text-center">
          {/* Expert Image */}
          <div className="mt-6 flex justify-center">
            <img
              src={`${BASE_PATH}assets/Gemini_Generated_Image_xt4o0ixt4o0ixt4o.webp`}
              alt="Expert"
              className="w-auto h-auto"
              style={{ maxWidth: '900px !important', width: '900px !important' }}
              loading="lazy"
            />
          </div>

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
    </section>
  );
};
