export const ProductSystem = () => {
  const products = [
    {
      step: "Step 1: Cleanse",
      name: "Heritage Shampoo",
      size: "500ml · Sulfate-free",
      origin: "🇳🇬 Made in Maiduguri, Nigeria",
      price: "₦15,000",
      icon: "🧴",
    },
    {
      step: "Step 2: Nourish",
      name: "Voluminous Conditioner",
      size: "500ml · Deep moisture",
      origin: "🇳🇪 Wodaabe herbs from Niger",
      price: "₦15,000",
      icon: "🧴",
    },
    {
      step: "Step 3: Restore",
      name: "Growth Pomade",
      size: "150g · The magic",
      origin: "🇹🇩🇳🇬 Chad + Nigeria blend",
      price: "₦32,000",
      icon: "✨",
      bestseller: true,
    },
  ];

  const transformations = [
    { name: "Amina O.", location: "Lagos", result: "8 weeks, edges are BACK!" },
    { name: "Hajia Fatima B.", location: "Abuja", result: "3 months, husband can't stop touching my hair!" },
    { name: "Blessing E.", location: "Port Harcourt", result: "Shoulder to mid-back in 6 months!" },
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
          <p className="font-sans text-xs text-muted-foreground italic">Ingredients sourced from across the Sahel region</p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 md:mb-16">
          {products.map((product, i) => (
            <div 
              key={i} 
              className={`luxury-card rounded-2xl p-6 hover:scale-[1.02] transition-transform relative ${product.bestseller ? 'mega-glow' : ''}`}
            >
              {product.bestseller && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-destructive text-foreground text-xs font-bold rounded-full">
                  BESTSELLER
                </div>
              )}
              <div className="h-32 md:h-48 flex items-center justify-center mb-4">
                <span className="text-6xl md:text-8xl">{product.icon}</span>
              </div>
              <p className="font-sans text-xs tracking-[0.2em] uppercase text-gold mb-2">{product.step}</p>
              <h3 className="font-cinzel text-lg md:text-xl text-foreground mb-2">{product.name}</h3>
              <p className="font-sans text-xs text-muted-foreground mb-2">{product.size}</p>
              <p className="font-sans text-xs text-muted-foreground mb-4">{product.origin}</p>
              <p className="font-cinzel text-xl text-gold">{product.price}</p>
            </div>
          ))}
        </div>

        {/* Transformations */}
        <div className="text-center mb-8">
          <h3 className="font-cinzel text-xl md:text-2xl text-foreground mb-2">Real Transformations</h3>
          <p className="font-sans text-sm text-muted-foreground">Verified customers · Unedited photos</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {transformations.map((item, i) => (
            <div key={i} className="p-4 md:p-6 rounded-xl bg-background/30 border border-gold/30 text-center">
              <div className="w-16 h-16 mx-auto rounded-full gold-gradient flex items-center justify-center text-2xl mb-3">
                👩🏾
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
            href="#order"
            className="inline-block gold-gradient-animated text-background font-sans text-sm tracking-widest uppercase px-8 md:px-12 py-4 rounded-xl font-bold btn-luxury animate-glow"
          >
            👑 START MY TRANSFORMATION 👑
          </a>
        </div>
      </div>
    </section>
  );
};
