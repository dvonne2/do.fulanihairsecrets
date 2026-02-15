import shampooImg from '@/assets-optimized/products/shampoo.webp';
import conditionerImg from '@/assets-optimized/products/conditioner.webp';
import pomadeImg from '@/assets-optimized/products/pomade.webp';
import aminaImg from '@/assets-optimized/testimonials/amina.webp';
import blessingImg from '@/assets-optimized/testimonials/blessing.webp';
import founderImg from '@/assets-optimized/products/hajara.webp';

export const ProductSystem = () => {
  const products = [
    {
      step: "STEP 1: CLEANSE",
      name: "Heritage Shampoo",
      size: "500ml · Sulfate-free",
      origin: "🇳🇬 Made in Maiduguri, Nigeria",
      image: shampooImg,
    },
    {
      step: "STEP 2: NOURISH",
      name: "Voluminous Conditioner",
      size: "500ml · Deep moisture",
      origin: "🇳🇪 Wodaabe herbs from Niger",
      image: conditionerImg,
    },
    {
      step: "Step 3: Restore",
      name: "Growth Pomade",
      size: "150g · The magic",
      origin: "🇹🇩🇳🇬 Chad + Nigeria blend",
      image: pomadeImg,
      bestseller: true,
    },
  ];

  const transformations = [
    { name: "Amina O.", location: "Lagos", result: "8 weeks, edges are BACK!", image: aminaImg },
    { name: "Mrs. Folake T.", location: "Victoria Island, Lagos", result: "Shoulder to mid-back in 6 months!", image: blessingImg },
    { name: "Hajia Fatima B.", location: "Abuja", result: "3 months, husband can't stop touching my hair!", image: founderImg },
  ];

  return (
    <section id="collection" className="py-16 md:py-20 royal-blue-gradient relative">
      <div className="absolute inset-0 moroccan-tile"></div>
      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-8">
          <p className="font-cinzel text-sm tracking-[0.4em] uppercase text-gold mb-4">✦ The Royal Collection ✦</p>
          <h2 className="font-cinzel text-2xl md:text-4xl animate-shimmer mb-6">The Complete 3-Step System</h2>
          
          {/* Country Flags */}
          <div className="flex items-center justify-center gap-6 md:gap-8 mb-4">
            {[
              { flag: "🇳🇬", name: "Nigeria" },
              { flag: "🇳🇪", name: "Niger" },
              { flag: "🇹🇩", name: "Chad" },
            ].map((country, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl mb-1">{country.flag}</div>
                <p className="font-sans text-xs text-muted-foreground">{country.name}</p>
              </div>
            ))}
          </div>
          <p className="font-sans text-xs text-white italic">Ingredients sourced from across the Sahel region</p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 md:mb-16">
          {products.map((product, i) => (
            <div 
              key={i} 
              className={`luxury-card rounded-2xl p-6 transition-transform duration-300 hover:scale-[1.02] relative ${product.bestseller ? 'mega-glow border-2 border-gold' : ''}`}
            >
              {product.bestseller && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-destructive text-foreground text-xs font-bold rounded-full z-10 flex items-center gap-1">
                  ⭐ BESTSELLER
                </div>
              )}
              <div className={`h-48 md:h-56 flex items-center justify-center mb-4 relative ${product.bestseller ? 'pomade-glow' : ''}`}>
                <img 
                  src={product.image} 
                  alt={product.name}
                  width={336}
                  height={336}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain drop-shadow-2xl transition-transform duration-300 hover:scale-105"
                  style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.4))' }}
                />
              </div>
              <p className="font-sans text-xs tracking-[0.2em] uppercase text-gold mb-2">{product.step}</p>
              <h3 className="font-cinzel text-lg md:text-xl text-foreground mb-2">{product.name}</h3>
              <p className="font-sans text-xs text-muted-foreground mb-2">{product.size}</p>
              <p className="font-sans text-xs text-muted-foreground mb-4">{product.origin}</p>
              <p className="font-sans text-xs text-gold font-semibold uppercase tracking-[0.18em] mb-1">Part of the Complete System</p>
              <p className="font-sans text-[11px] text-muted-foreground italic">🔗 Best results when all 3 steps are used together</p>
            </div>
          ))}
        </div>

        {/* System importance callout */}
        <div className="max-w-3xl mx-auto mb-8 md:mb-10">
          <div className="rounded-2xl border border-gold/40 bg-card/80 px-6 py-6 md:px-8 md:py-8 shadow-[0_0_40px_rgba(212,175,55,0.18)]">
            <p className="font-cinzel text-base md:text-lg text-gold mb-3 flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              IMPORTANT: These 3 products are designed to work together as a COMPLETE SYSTEM.
            </p>
            <ul className="font-sans text-base md:text-lg text-muted-foreground space-y-1 mb-4 list-disc list-inside">
              <li>Step 1 <span className="font-semibold">CLEANSES</span> and opens follicles</li>
              <li>Step 2 <span className="font-semibold">NOURISHES</span> and strengthens</li>
              <li>Step 3 <span className="font-semibold">RESTORES</span> and activates growth</li>
            </ul>
            <p className="font-sans text-base md:text-lg font-extrabold text-destructive mb-4">
              Using them separately reduces effectiveness by about 60%.
            </p>
            <p className="font-cinzel text-base text-foreground mb-4">
              👑 Get the <span className="text-gold">Complete Bundle</span> for maximum results.
            </p>
            <div className="text-center">
              <a 
                href="#order-form"
                data-form-cta="true"
                className="inline-flex items-center justify-center gap-2 gold-gradient text-background font-sans text-sm md:text-base tracking-wider uppercase px-8 md:px-10 py-3 md:py-3.5 rounded-xl font-bold btn-luxury"
              >
                <span>Order Now</span>
              </a>
            </div>
          </div>
        </div>

        {/* 60-second ritual */}
        <div className="max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="rounded-2xl border border-gold/30 bg-white px-6 py-6 md:px-8 md:py-8 shadow-[0_0_35px_rgba(218,165,32,0.25)]">
            <h3 className="font-cinzel text-lg md:text-2xl text-gold mb-3 md:mb-4 text-center font-black">
              The 60-Second Protocol That Changes Everything
            </h3>
            <p className="font-serif text-lg md:text-2xl text-[#333333] mb-4 text-center">
              Here&apos;s exactly how simple your nightly routine is:
            </p>
            <ol className="list-decimal list-inside space-y-2 font-serif text-lg md:text-2xl text-[#333333] text-left">
              <li>
                Before bed, take a little Fulani Hair Gro™ pomade and apply it directly onto the areas of concern (edges,
                crown, thinning spots).
              </li>
              <li>
                Massage gently with your fingertips for about 30 seconds to help the herbs penetrate the scalp.
              </li>
              <li>
                Cover your head with a silk scarf, silk bonnet, or sleep on a silk pillowcase to reduce friction and
                protect your strands.
              </li>
              <li>
                Go to sleep — no rinsing needed. Wake up one day closer to thicker, fuller hair.
              </li>
            </ol>
          </div>
        </div>

        {/* Transformations */}
        <div className="text-center mb-8">
          <h3 className="font-cinzel text-xl md:text-2xl text-foreground mb-2">Real Transformations</h3>
          <p className="font-sans text-sm text-muted-foreground">Verified customers · Unedited photos</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {transformations.map((item, i) => (
            <div key={i} className="p-4 md:p-6 rounded-xl bg-background/30 border border-gold/30 text-center relative overflow-hidden">
              {/* Small product image in corner */}
              <img 
                src={pomadeImg} 
                alt="Fulani Hair Gro Pomade"
                className="absolute -bottom-2 -right-2 w-12 h-12 object-contain opacity-30"
              />
              <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-gold mb-3 shadow-lg">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-cinzel text-base text-gold">{item.name}</p>
              <p className="font-sans text-xs text-muted-foreground mb-2">{item.location}</p>
              <p className="font-serif text-sm text-foreground italic">"{item.result}"</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a 
            href="#order-form"
            data-form-cta="true"
            className="inline-block gold-gradient text-background font-sans text-sm tracking-widest uppercase px-8 md:px-12 py-4 rounded-xl font-bold btn-luxury"
          >
            Order Now
          </a>
        </div>
      </div>
    </section>
  );
};