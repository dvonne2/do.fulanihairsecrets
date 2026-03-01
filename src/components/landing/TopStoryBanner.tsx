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
          GROW FuLLER, LONGER, THICKER HAIR WITH FULANI HAIR GRO
        </p>
        
        {/* Bundle Image */}
        <div className="mt-6">
          <img
            src={`${BASE_PATH}assets/Gemini_Generated_Image_iupms8iupms8iupm.png`}
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
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> ORDER NOW
          </a>
        </div>

        {/* Is This You? Section */}
        <div className="mt-12 text-center">
          <strong 
            className="block"
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '31px',
              fontWeight: '700',
              fontStyle: 'normal',
              fontVariant: 'normal',
              fontKerning: 'auto',
              fontOpticalSizing: 'auto',
              fontStretch: '100%',
              fontVariationSettings: 'normal',
              fontFeatureSettings: 'normal',
              textTransform: 'uppercase',
              textDecoration: 'none',
              textAlign: 'center',
              textIndent: '0px',
              backgroundColor: '#FFF8DC',
              padding: '12px 24px',
              borderRadius: '8px',
              display: 'inline-block',
              width: 'auto',
              margin: '0 auto'
            }}
          >
            💔 Is This You?
          </strong>
        </div>

        {/* Pain Points Section */}
        <div className="mt-12 text-center" style={{
          color: '#0A0A0A', 
          fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif', 
          fontSize: '21px', 
          lineHeight: '1.6',
          fontWeight: '400',
          fontStyle: 'normal',
          fontVariant: 'normal',
          fontKerning: 'auto',
          fontOpticalSizing: 'auto',
          fontStretch: '100%',
          fontVariationSettings: 'normal',
          fontFeatureSettings: 'normal',
          textTransform: 'none',
          textDecoration: 'none',
          textAlign: 'start',
          textIndent: '0px'
        }}>
          <p style={{marginBottom: '12px'}}>👉🏽 During intimate moments, are you constantly worried your wig might shift… and he'll finally see your real hairline?</p>
          <p style={{marginBottom: '12px'}}>👉🏽 Are your edges disappearing, and you're secretly scared they may never grow back — especially after childbirth or as you've entered menopause?</p>
          <p style={{marginBottom: '12px'}}>👉🏽 After becoming a mum or noticing hormonal changes, did your hair start thinning and never fully recover?</p>
          <p style={{marginBottom: '12px'}}>👉🏽 Have you spent thousands on products that promised growth… yet your hairline is still slowly moving backwards and your hair keeps breaking?</p>
          <p style={{marginBottom: '12px'}}>👉🏽 After braids, did your edges never fully come back?</p>
          <p style={{marginBottom: '12px'}}>👉🏽 Can't you do the hairstyles you really want because they won't properly cover your temple area?</p>
          <p style={{marginBottom: '24px'}}>👉🏽 Can you no longer confidently pack your natural hair without feeling exposed?</p>
        </div>

        {/* HOW IT WORKS Section */}
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
              textDecoration: 'none',
              border: '3px solid #DAA520',
              padding: '12px 24px',
              borderRadius: '8px',
              backgroundColor: '#FFF8DC',
              display: 'inline-block',
              width: 'auto',
              margin: '0 auto'
            }}
          >
            HOW IT WORKS
          </strong>

          {/* Your Journey Section */}
          <div 
            className="mt-8 p-8 rounded-2xl text-center"
            style={{
              backgroundColor: '#FFF5F0', // Light cream/blush color
              border: '1px solid #F3E5D0',
              borderRadius: '16px',
              margin: '32px auto',
              maxWidth: '800px'
            }}
          >
            <h2 
              className="mb-4"
              style={{
                fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
                fontSize: '28px',
                fontWeight: '700',
                textAlign: 'center',
                lineHeight: '1.3'
              }}
            >
              <span style={{ color: '#2C1810', fontWeight: '700' }}>Your Journey to</span>{' '}
              <span style={{ 
                color: '#DAA520', 
                fontWeight: '700', 
                fontStyle: 'italic' 
              }}>
                Fuller, Longer and Healthier Hair
              </span>
            </h2>
            
            <p 
              className="mt-4"
              style={{
                color: '#4A4A4A',
                fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
                fontSize: '16px',
                fontWeight: '400',
                textAlign: 'center',
                lineHeight: '1.6',
                maxWidth: '600px',
                margin: '16px auto 0'
              }}
            >
              Experience the Fulani Hair Gro™ difference throughout your hair journey. Watch as your hair transforms, growing thicker, longer, stronger, and healthier with each passing week.
            </p>
          </div>

          {/* Milestone Cards */}
          <div className="mt-12" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '24px',
              padding: '0 16px'
            }}>
              
              {/* Card 1 - After 1 Month */}
              <div 
                style={{
                  backgroundColor: '#F5E6D3', // Tan/sandy background
                  border: '2px solid #D4A574',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ 
                  color: '#DAA520', 
                  fontSize: '18px', 
                  fontWeight: '700',
                  marginBottom: '8px',
                  textTransform: 'uppercase'
                }}>
                  After 1 Month
                </div>
                <h3 style={{ 
                  color: '#3E2723', // Dark brown
                  fontSize: '20px', 
                  fontWeight: '700',
                  marginBottom: '16px',
                  lineHeight: '1.3'
                }}>
                  Hair Begins to Transform
                </h3>
                <ul style={{ 
                  color: '#4A4A4A',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  margin: '0',
                  paddingLeft: '20px'
                }}>
                  <li>Your hair length and density will start to improve</li>
                  <li>You will start to get more compliments from people</li>
                  <li>Edges will start to grow</li>
                  <li>Hair will be more hydrated</li>
                  <li>Reduction of hair breakage will start to happen</li>
                </ul>
              </div>

              {/* Card 2 - After 3 Months */}
              <div 
                style={{
                  backgroundColor: '#F5E6D3', // Tan/sandy background
                  border: '2px solid #D4A574',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ 
                  color: '#DAA520', 
                  fontSize: '18px', 
                  fontWeight: '700',
                  marginBottom: '8px',
                  textTransform: 'uppercase'
                }}>
                  After 3 Months
                </div>
                <h3 style={{ 
                  color: '#3E2723', // Dark brown
                  fontSize: '20px', 
                  fontWeight: '700',
                  marginBottom: '16px',
                  lineHeight: '1.3'
                }}>
                  Visible Dramatic Results
                </h3>
                <ul style={{ 
                  color: '#4A4A4A',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  margin: '0',
                  paddingLeft: '20px'
                }}>
                  <li>Increase in length, density and thickness</li>
                  <li>You will notice you are more confident about your hair</li>
                  <li>Dandruff is gone</li>
                  <li>Alot of reduction in hair breakage</li>
                  <li>Even fuller hair roots</li>
                  <li>Hair grows 2-3x faster than normal</li>
                </ul>
              </div>

              {/* Card 3 - In 12 Months */}
              <div 
                style={{
                  backgroundColor: '#F5E6D3', // Tan/sandy background
                  border: '2px solid #D4A574',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ 
                  color: '#DAA520', 
                  fontSize: '18px', 
                  fontWeight: '700',
                  marginBottom: '8px',
                  textTransform: 'uppercase'
                }}>
                  In 12 Months
                </div>
                <h3 style={{ 
                  color: '#3E2723', // Dark brown
                  fontSize: '20px', 
                  fontWeight: '700',
                  marginBottom: '16px',
                  lineHeight: '1.3'
                }}>
                  Your Hair, Transformed Forever
                </h3>
                <ul style={{ 
                  color: '#4A4A4A',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  margin: '0',
                  paddingLeft: '20px'
                }}>
                  <li>You won't need to use haircare products as often</li>
                  <li>You'll flaunt your natural long, thick, soft hair</li>
                  <li>You'll feel younger and more confident</li>
                  <li>No more itching of scalp</li>
                  <li>Dandruff free guaranteed</li>
                </ul>
              </div>

            </div>
          </div>

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
          
          <div 
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
            <p style={{ margin: '0 0 12px 0' }}>
              <strong>Shampoo:</strong><br/>
              Apply generously to scalp and hair. Leave for 3–5 minutes. Rinse thoroughly.
            </p>
            
            <p style={{ margin: '0 0 12px 0' }}>
              <strong>Conditioner:</strong><br/>
              Apply to damp hair. Leave for 3–5 minutes. Rinse out.
            </p>
            
            <p style={{ margin: '0 0 0 0' }}>
              <strong>Pomade:</strong><br/>
              Apply to scalp once daily. Massage gently. Do not rinse.
            </p>
          </div>
        </div>

                  </div>

        <div className="mt-8 text-center">
          <strong 
            className="block"
            style={{
              color: '#0A0A0A',
              fontFamily: 'Lato, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '31px',
              fontWeight: '700',
              textAlign: 'center',
              textTransform: 'uppercase',
              textDecoration: 'none',
              border: '3px solid #DAA520',
              padding: '12px 24px',
              borderRadius: '8px',
              backgroundColor: '#FFF8DC',
              display: 'inline-block',
              width: 'auto',
              margin: '0 auto'
            }}
          >
            WHY CHOOSE FULANI HAIR GRO?
          </strong>
          
          <div className="border border-[#E6E6E6] px-6 md:px-14 py-8 md:py-10 mt-6 mb-6">
            <blockquote className="text-center">
              <p className="leading-tight text-[#B80F66] uppercase font-bold relative" style={{ fontSize: '14px' }}>
                <span className="absolute -left-4 -top-2 text-4xl text-[#B80F66] opacity-30">"</span>
                Trusted by Thousands of Women Who Successfully Regrew Their Hair Edges with FULANI HAIR GRO
                <span className="absolute -right-4 -bottom-2 text-4xl text-[#B80F66] opacity-30">"</span>
              </p>
            </blockquote>
          </div>
          
          <p 
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
            Fulani women are known for long hair, right? It's not by luck. It's not by "good genes" only. These women take their hair seriously. Herbs. Oils. Routine. Discipline. It's tradition.
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
          My name is Hajara and I come from the Fulani lineage of women who have kept the secret of growing long, healthy African hair very close to their hearts.

I was born and bred in Ogbomosho, Nigeria, but my family comes from the Fula tribe bordering Nigeria and Chad. As a little girl, I watched the women in my family use organic and traditional beauty secrets to care for their hair and skin. But me being a tomboy, I never bothered to learn those secrets (I regret it… lol).
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
          Fast forward after my second baby… ah.

My hair disgraced me.

My edges vanished. Both sides smooth like I polished it. Proper Iya eko situation. My scalp was itching like crazy. The dandruff was not small flakes o. The type that if you scratch, blood will almost come out. My hair became thin. Flat. No volume.

I panicked.

I bought premium shampoos. I did treatments. I went to my trichologist friend (yes, the same one that is now my co-founder). She checked everything and said it was hormones. She said stop wigs. Stop combing too much. Eat vegetables.

I did all that.
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
          Still nothing.

By the time I turned 33, my grandfather passed. We travelled to Maiduguri for the burial. Very emotional time.

Two days after the burial, my grandmother — 72 years old o — woke me up early morning and handed me one local shampoo and one pomade.

She just said, "Use it once a week. Don't stop."

That's it.

No big explanation.

I said okay.

I started using it consistently.

Before I knew it, the itching reduced. The dandruff cleared. Small small hairs started showing. My edges started filling up again. My hair became thicker.

That was when I realized… these women were not playing all these years.

With my grandmother's blessing, I carried that same herbal combination and worked with my co-founder (London-trained trichologist) to refine it properly with science.

So when you choose Fulani Hair Gro, you're not buying vibes.

You're using something that:

Fulani women have used for generations.
I personally used when my own hair was failing me.
And we have now refined with proper scientific knowledge.

This thing is not hype.
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
          It's heritage with sense.
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
          And if it brought my edges back from the dead, imagine what it can do for you.
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
          — Hajara 😌
        </p>

        {/* Additional CTA Button */}
        <div className="mt-8 text-center">
          <a
            href="#order-form"
            data-form-cta="true"
            className="flex items-center justify-center gap-2 bg-[#5ec239] text-white font-semibold px-10 md:px-14 py-4 rounded-xl shadow-lg hover:scale-105 transition-transform w-full"
            style={{ fontSize: '20px' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> ORDER NOW
          </a>
        </div>
        
        
                
        {/* Product Information */}
        
        
                
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
          Why Women Are Switching to Fulani Hair Gro
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
          These group of herbs are plucked from the bushes in Maiduguri and has been a heirloom amongst the women in my Fulani family for centuries. People think Fulani women have naturally long hair and that is partly the truth but any woman can have naturally long hair if she uses the right herbs in her hair.
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
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> ORDER NOW
          </a>
        </div>

                
        {/* Real Results Section */}
        <div style={{ marginTop: '48px', marginBottom: '32px' }}>
          <h2 style={{
            color: '#0A0A0A',
            fontFamily: 'Arvo, serif',
            fontSize: '32px',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '32px',
            textTransform: 'none'
          }}>
            Real Results From Real Women
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* Card 1: Split image with before/after labels */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={`${BASE_PATH}assets/fhg1.webp`}
                  alt="Before and After Results 1"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  loading="lazy"
                />
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  display: 'flex',
                  height: '40px'
                }}>
                  <div style={{
                    flex: '1',
                    background: '#F5E6D3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#3E2723'
                  }}>
                    BEFORE
                  </div>
                  <div style={{
                    flex: '1',
                    background: '#DAA520',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#ffffff'
                  }}>
                    AFTER
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Split image with before/after labels */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={`${BASE_PATH}assets/fhg4.webp`}
                  alt="Before and After Results 2"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  loading="lazy"
                />
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  display: 'flex',
                  height: '40px'
                }}>
                  <div style={{
                    flex: '1',
                    background: '#F5E6D3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#3E2723'
                  }}>
                    BEFORE
                  </div>
                  <div style={{
                    flex: '1',
                    background: '#DAA520',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#ffffff'
                  }}>
                    AFTER
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Split image with before/after labels */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={`${BASE_PATH}assets/fhg5.webp`}
                  alt="Before and After Results 3"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  loading="lazy"
                />
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  display: 'flex',
                  height: '40px'
                }}>
                  <div style={{
                    flex: '1',
                    background: '#F5E6D3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#3E2723'
                  }}>
                    BEFORE
                  </div>
                  <div style={{
                    flex: '1',
                    background: '#DAA520',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#ffffff'
                  }}>
                    AFTER
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Split image with before/after labels */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={`${BASE_PATH}assets/images20.jpeg`}
                  alt="Before and After Results 4"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  loading="lazy"
                />
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  display: 'flex',
                  height: '40px'
                }}>
                  <div style={{
                    flex: '1',
                    background: '#F5E6D3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#3E2723'
                  }}>
                    BEFORE
                  </div>
                  <div style={{
                    flex: '1',
                    background: '#DAA520',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#ffffff'
                  }}>
                    AFTER
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5: Split image with before/after labels */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={`${BASE_PATH}assets/result1.png`}
                  alt="Before and After Results 5"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  loading="lazy"
                />
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  display: 'flex',
                  height: '40px'
                }}>
                  <div style={{
                    flex: '1',
                    background: '#F5E6D3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#3E2723'
                  }}>
                    BEFORE
                  </div>
                  <div style={{
                    flex: '1',
                    background: '#DAA520',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#ffffff'
                  }}>
                    AFTER
                  </div>
                </div>
              </div>
            </div>

            {/* Card 6: Split image with before/after labels */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={`${BASE_PATH}assets/result2.png`}
                  alt="Before and After Results 6"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  loading="lazy"
                />
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  display: 'flex',
                  height: '40px'
                }}>
                  <div style={{
                    flex: '1',
                    background: '#F5E6D3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#3E2723'
                  }}>
                    BEFORE
                  </div>
                  <div style={{
                    flex: '1',
                    background: '#DAA520',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#ffffff'
                  }}>
                    AFTER
                  </div>
                </div>
              </div>
            </div>

            {/* Card 7: Split image with before/after labels */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={`${BASE_PATH}assets/result3.png`}
                  alt="Before and After Results 7"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  loading="lazy"
                />
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  display: 'flex',
                  height: '40px'
                }}>
                  <div style={{
                    flex: '1',
                    background: '#F5E6D3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#3E2723'
                  }}>
                    BEFORE
                  </div>
                  <div style={{
                    flex: '1',
                    background: '#DAA520',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#ffffff'
                  }}>
                    AFTER
                  </div>
                </div>
              </div>
            </div>

            {/* Card 8: Split image with before/after labels */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={`${BASE_PATH}assets/result4.png`}
                  alt="Before and After Results 8"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  loading="lazy"
                />
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  display: 'flex',
                  height: '40px'
                }}>
                  <div style={{
                    flex: '1',
                    background: '#F5E6D3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#3E2723'
                  }}>
                    BEFORE
                  </div>
                  <div style={{
                    flex: '1',
                    background: '#DAA520',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#ffffff'
                  }}>
                    AFTER
                  </div>
                </div>
              </div>
            </div>
          </div>
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
            <h3 style={{
              color: '#ffffff',
              fontFamily: 'Georgia, serif',
              fontSize: '18px',
              fontWeight: '600',
              fontStyle: 'italic',
              textAlign: 'center',
              marginBottom: '8px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              lineHeight: '1.4'
            }}>
              You're One Step Away From Getting a Product That Will Make Your Hair{' '}
              <span style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#FFD700'
              }}>
                Longer and Fuller
              </span>.
            </h3>
            
            <h2 style={{
              color: '#fff',
              textAlign: 'center',
              fontWeight: '800',
              letterSpacing: '-0.5px',
              fontSize: '28px',
              margin: '0 0 16px'
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
                <svg xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto 18px' }}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
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
                  Click the <b><u><a href="#order-form" onClick={(e) => { e.preventDefault(); document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} style={{ color: '#14532d', cursor: 'pointer', textDecoration: 'underline' }}>Buy Now</a></u></b> button to order from us via our website form or our WhatsApp or call
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

                <div className="grid grid-cols-1 gap-2">
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

        {/* 1ezgif-4-7ec1374048a8 (2) GIF */}
        <div className="mt-10 flex justify-center">
          <img
            src={`${BASE_PATH}assets/1ezgif-4-7ec1374048a8%20(2).gif`}
            alt="1ezgif"
            className="w-auto h-auto"
            style={{ maxWidth: '900px !important', width: '900px !important' }}
            loading="lazy"
          />
        </div>

        <section className="mt-10 bg-[#B80F66] text-center text-white px-4 py-10 fhg-helvetica">
          <div className="max-w-4xl mx-auto space-y-6">
            undefined
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
      </div>
    </div>
    </section>
  );
};
