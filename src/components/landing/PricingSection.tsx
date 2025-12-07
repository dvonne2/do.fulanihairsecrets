import { useState } from 'react';
import shampooImg from '@/assets/products/shampoo.jpg';
import conditionerImg from '@/assets/products/conditioner.jpg';
import pomadeImg from '@/assets/products/pomade.png';

interface PricingSectionProps {
  countdown: { hours: number; minutes: number; seconds: number };
  stockCount: number;
  commitmentChecks: boolean[];
  onCommitmentChange: (index: number) => void;
}

export const PricingSection = ({ countdown, stockCount, commitmentChecks, onCommitmentChange }: PricingSectionProps) => {
  const [selectedDelivery, setSelectedDelivery] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('pod');

  const packages = [
    {
      id: 'basic',
      name: 'Starter',
      subtitle: 'Pomade Only',
      price: '₦25,000',
      originalPrice: '₦32,000',
      description: 'Step 3 only — not recommended',
      includes: ['Growth Pomade (150g)'],
      featured: false,
      image: pomadeImg,
    },
    {
      id: 'complete',
      name: '6-MONTH SUPPLY',
      subtitle: 'Buy 2 Get 1 FREE',
      price: '₦66,750',
      originalPrice: '₦214,500',
      discount: '69%',
      badge: '🔥 #1 BEST DEAL - 92% Choose This 🔥',
      description: 'Maximum transformation',
      includes: [
        '3x Heritage Shampoo (500ml)',
        '3x Voluminous Conditioner (500ml)',
        '3x Growth Pomade (150g)',
        '3x Silk Bonnets (₦15,000 value)',
        'Hair Growth Ebook (₦10,000 value)',
        'FREE Express Shipping (₦5,000 value)',
        'VIP WhatsApp Support (₦20,000 value)',
        'Personalized Hair Plan (₦15,000 value)',
      ],
      featured: true,
      images: [shampooImg, conditionerImg, pomadeImg],
    },
    {
      id: 'single',
      name: 'Self Love Plus',
      subtitle: 'Complete System',
      price: '₦32,750',
      originalPrice: '₦71,500',
      description: 'Single 3-step set',
      includes: ['Heritage Shampoo', 'Voluminous Conditioner', 'Growth Pomade'],
      featured: false,
      images: [shampooImg, conditionerImg, pomadeImg],
    },
  ];

  const bonuses = [
    { icon: "🎀", name: "3x Luxury Silk Bonnets", value: "₦15,000", desc: "Protect your hair while you sleep" },
    { icon: "📖", name: "Hair Growth Secrets Ebook", value: "₦10,000", desc: "400 years of Fulani wisdom" },
    { icon: "🚚", name: "FREE Express Shipping", value: "₦5,000", desc: "Get it in 1-2 days" },
    { icon: "📱", name: "VIP WhatsApp Support", value: "₦20,000", desc: "Direct line to hair experts" },
    { icon: "💆‍♀️", name: "Scalp Massage Guide", value: "₦5,000", desc: "Boost absorption by 200%" },
    { icon: "🎯", name: "Personalized Hair Plan", value: "₦15,000", desc: "Custom routine for YOUR hair" },
  ];

  const podCities = ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano', 'Kaduna', 'Benin', 'Warri', 'Enugu', 'Owerri'];

  const getWhatsAppLink = (pkg: string, isPOD: boolean) => {
    const message = isPOD 
      ? `Hi! I want to order ${pkg} with PAY ON DELIVERY. My address is:`
      : `Hi! I just made payment for ${pkg}. Here is my receipt.`;
    return `https://wa.me/2348101594734?text=${encodeURIComponent(message)}`;
  };

  return (
    <section id="order" className="py-16 md:py-20 royal-blue-gradient relative">
      <div className="absolute inset-0 moroccan-tile"></div>
      <div className="max-w-5xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* Countdown Reminder */}
        <div className="mb-8 p-4 rounded-xl bg-destructive/50 border border-destructive text-center">
          <p className="font-sans text-sm text-foreground">
            ⏰ This price expires in:{' '}
            <span className="font-mono font-bold ml-2">
              {String(countdown.hours).padStart(2,'0')}:{String(countdown.minutes).padStart(2,'0')}:{String(countdown.seconds).padStart(2,'0')}
            </span>
          </p>
        </div>

        <div className="text-center mb-8">
          <p className="font-cinzel text-sm tracking-[0.4em] uppercase text-gold mb-4">✦ Choose Your Package ✦</p>
          <h2 className="font-cinzel text-2xl md:text-4xl font-bold">
            <span className="text-foreground">WHY THE COMPLETE SYSTEM</span>
            <br />
            <span className="animate-shimmer">WORKS BETTER TOGETHER</span>
          </h2>
          <p className="font-sans text-muted-foreground mt-4">
            Hair transplant: <span className="line-through text-destructive">₦15,000,000</span> | 
            Our complete system: <span className="text-success font-bold">from ₦32,750</span>
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-12">
          {packages.map((pkg) => (
            <div 
              key={pkg.id}
              className={`rounded-2xl p-6 relative ${pkg.featured ? 'scale-105 mega-glow border-2 border-gold bg-card' : 'bg-card/80 border border-gold/30'}`}
            >
              {pkg.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-destructive text-foreground text-xs font-bold rounded-full whitespace-nowrap animate-pulse z-10">
                  {pkg.badge}
                </div>
              )}
              
              <div className="text-center pt-4">
                {/* Product Image(s) */}
                <div className={`h-32 md:h-40 flex items-center justify-center mb-4 ${pkg.featured ? 'pomade-glow' : ''}`}>
                  {'images' in pkg && pkg.images ? (
                    <div className="flex items-end justify-center gap-2">
                      {pkg.images.map((img, idx) => (
                        <div 
                          key={idx}
                          className={`bg-background/90 rounded-lg p-2 ${
                            idx === 1 ? 'h-28 md:h-36 -mx-1 z-10' : 'h-24 md:h-32'
                          }`}
                        >
                          <img 
                            src={img} 
                            alt={`Product ${idx + 1}`}
                            className="h-full w-auto object-contain transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-background/90 rounded-lg p-3 h-28 md:h-36">
                      <img 
                        src={pkg.image} 
                        alt={pkg.name}
                        className="h-full w-auto object-contain transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  )}
                </div>
                
                <p className="font-cinzel text-lg text-gold mb-1">{pkg.name}</p>
                <p className="font-sans text-xs text-muted-foreground mb-4">{pkg.subtitle}</p>
                
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="font-sans text-sm text-muted-foreground line-through">{pkg.originalPrice}</span>
                  {pkg.discount && (
                    <span className="px-2 py-0.5 bg-success text-foreground text-xs font-bold rounded">
                      SAVE {pkg.discount}
                    </span>
                  )}
                </div>
                <p className="font-cinzel text-3xl md:text-4xl text-gold font-bold mb-4">{pkg.price}</p>
                
                <p className="font-sans text-xs text-muted-foreground mb-4">{pkg.description}</p>
                
                <ul className="text-left space-y-2 mb-6">
                  {pkg.includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 font-sans text-xs text-foreground/80">
                      <span className="text-gold">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                
                <a 
                  href={getWhatsAppLink(pkg.name, true)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full py-3 rounded-xl font-sans text-sm font-bold tracking-wider text-center transition-colors ${
                    pkg.featured 
                      ? 'gold-gradient-animated text-background btn-luxury animate-glow' 
                      : 'bg-gold/20 text-gold border border-gold hover:bg-gold/30'
                  }`}
                >
                  👑 YES! I WANT THIS 👑
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Why 6-Month Supply */}
        <div className="p-6 rounded-2xl bg-card border border-gold/30 mb-8 text-center">
          <h3 className="font-cinzel text-xl text-gold mb-4">💡 Why Smart Women Choose the 6-Month Supply</h3>
          <div className="grid md:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
            {[
              { icon: "📊", title: "Proven Results", desc: "6 months of consistent use shows the BEST transformation results" },
              { icon: "💰", title: "Biggest Savings", desc: "Save ₦147,750 — that's 69% OFF the regular price!" },
              { icon: "🚫", title: "No Re-ordering", desc: "Set it and forget it. No running out mid-transformation." },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-sans text-sm text-foreground font-semibold">{item.title}</p>
                  <p className="font-sans text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bonus Stack */}
        <div className="mb-8 rounded-3xl overflow-hidden border-2 border-destructive" style={{ boxShadow: '0 0 40px hsl(0 84% 60% / 0.3)' }}>
          <div className="bg-gradient-to-r from-destructive via-red-500 to-destructive py-4 px-6 text-center">
            <p className="font-cinzel text-lg md:text-xl text-foreground animate-pulse">
              🎁 ORDER & PAY IN THE NEXT {countdown.hours}h {countdown.minutes}m AND GET ALL THIS FREE! 🎁
            </p>
            <p className="font-sans text-xs text-foreground/80 mt-1">
              *Bonuses only available when you complete your order and payment within the countdown
            </p>
          </div>
          <div className="p-6 bg-card">
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {bonuses.map((bonus, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gold/5 border border-gold/20">
                  <div className="text-3xl">{bonus.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-sans text-sm text-foreground font-semibold">{bonus.name}</p>
                      <span className="px-2 py-0.5 bg-success rounded text-xs text-foreground font-bold">FREE</span>
                    </div>
                    <p className="font-sans text-xs text-muted-foreground">{bonus.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-sans text-sm text-muted-foreground line-through">{bonus.value}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center p-4 rounded-xl bg-gold/10 border border-gold/30">
              <p className="font-sans text-sm text-muted-foreground mb-1">Total Bonus Value:</p>
              <p className="font-cinzel text-3xl text-gold">₦70,000 FREE</p>
              <p className="font-sans text-xs text-destructive mt-2 animate-pulse">⏰ Bonuses expire when timer hits zero!</p>
            </div>
          </div>
        </div>

        {/* First-Time Buyer Code */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-2 border-purple-500/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🌟</div>
              <div>
                <p className="font-cinzel text-lg text-foreground">First-Time Buyer?</p>
                <p className="font-sans text-sm text-purple-300">Use code <span className="font-bold text-gold">FIRSTLOVE</span> for extra ₦3,000 off!</p>
              </div>
            </div>
            <div className="px-6 py-3 rounded-full bg-purple-500/30 border border-purple-400">
              <p className="font-sans text-lg text-foreground font-bold">FIRSTLOVE</p>
            </div>
          </div>
        </div>

        {/* Commitment Checkboxes */}
        <div className="rounded-2xl p-6 mb-8 bg-card border border-gold/30">
          <p className="font-cinzel text-lg text-gold mb-4 text-center">✓ Confirm Your Commitment to Longer, Fuller, Thicker Hair</p>
          <div className="space-y-3 max-w-lg mx-auto">
            {[
              "Yes, I'm ready to stop wasting money on products that don't work",
              "Yes, I understand the 3-Step System works better together",
              "Yes, I want to join 5,247+ women with longer, fuller, thicker hair",
            ].map((text, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gold/5 transition-colors">
                <input 
                  type="checkbox" 
                  checked={commitmentChecks[i]}
                  onChange={() => onCommitmentChange(i)}
                  className="w-5 h-5 accent-gold rounded"
                />
                <span className="font-sans text-sm text-foreground/80">{text}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Delivery Options */}
        <div className="luxury-card rounded-2xl p-6 mb-6">
          <h3 className="font-cinzel text-xl text-center mb-6 text-gold">🚚 Choose Your Delivery</h3>
          <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-2xl mx-auto">
            {[
              { id: 'same-day', label: '⚡ Same Day VIP', price: '₦5,000', desc: 'Get it TODAY (Nationwide)', color: 'text-destructive' },
              { id: 'standard', label: '📦 Standard', price: '₦3,000', desc: '3-5 days nationwide', color: 'text-gold' },
              { id: 'express', label: '🚀 Express', price: '₦4,000', desc: '1-2 days nationwide', color: 'text-success' },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedDelivery(option.id)}
                className={`p-3 md:p-4 rounded-xl border-2 transition-all ${selectedDelivery === option.id ? 'border-gold bg-gold/10' : 'border-gold/30 hover:border-gold/50'}`}
              >
                <p className={`font-cinzel text-xs md:text-sm ${option.color} mb-1`}>{option.label}</p>
                <p className="font-cinzel text-lg md:text-2xl text-foreground">{option.price}</p>
                <p className="font-sans text-[10px] md:text-xs text-muted-foreground">{option.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="luxury-card rounded-2xl p-6 mb-8">
          <h3 className="font-cinzel text-xl text-center mb-6 text-gold">💳 Choose Payment Method</h3>
          <div className="grid md:grid-cols-2 gap-4 max-w-xl mx-auto mb-6">
            <button
              onClick={() => setPaymentMethod('transfer')}
              className={`p-5 rounded-xl border-2 transition-all relative ${paymentMethod === 'transfer' ? 'border-gold bg-gold/10' : 'border-gold/30 hover:border-gold/50'}`}
            >
              <div className="absolute -top-2 -right-2 px-2 py-1 bg-success rounded-full">
                <p className="font-sans text-xs text-foreground font-bold">SAVE ₦1,000</p>
              </div>
              <p className="font-cinzel text-lg text-gold mb-1">🏦 Bank Transfer</p>
              <p className="font-sans text-xs text-muted-foreground">Pay now & get priority processing</p>
              <p className="font-sans text-xs text-success mt-2">✓ ₦1,000 discount applied</p>
            </button>
            <button
              onClick={() => setPaymentMethod('pod')}
              className={`p-5 rounded-xl border-2 transition-all relative ${paymentMethod === 'pod' ? 'border-gold bg-gold/10' : 'border-gold/30 hover:border-gold/50'}`}
            >
              <div className="absolute -top-2 -right-2 px-2 py-1 bg-destructive rounded-full animate-pulse">
                <p className="font-sans text-xs text-foreground font-bold">MOST POPULAR</p>
              </div>
              <p className="font-cinzel text-lg text-gold mb-1">🚚 Pay on Delivery</p>
              <p className="font-sans text-xs text-muted-foreground">Inspect the package, confirm. Available nationwide</p>
              <p className="font-sans text-xs text-gold mt-2">✓ Zero risk · 100% safe</p>
            </button>
          </div>
          
          {/* POD Trust Message */}
          {paymentMethod === 'pod' && (
            <div className="max-w-xl mx-auto p-4 rounded-xl bg-success/20 border border-success/50 mb-4">
              <p className="font-sans text-sm text-success text-center">
                ✅ <span className="font-bold">PAY ON DELIVERY:</span> Our rider will bring your order. Inspect the products, 
                confirm everything is perfect, THEN pay. No upfront payment required!
              </p>
            </div>
          )}

          {/* POD Cities */}
          <div className="max-w-xl mx-auto text-center">
            <p className="font-sans text-xs text-muted-foreground mb-2">Pay on Delivery available in:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {podCities.map((city, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-xs text-gold">{city}</span>
              ))}
            </div>
            <p className="font-sans text-xs text-muted-foreground mt-2">Other locations: Bank transfer with express shipping</p>
          </div>
        </div>

        {/* Payment Details */}
        {paymentMethod === 'transfer' ? (
          <div className="gold-gradient rounded-3xl p-8 md:p-12 text-center">
            <h3 className="font-cinzel text-2xl md:text-3xl mb-6 text-background">🏦 Bank Transfer Details</h3>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-background/20">
                <p className="font-sans text-xs text-background/60 uppercase mb-1">Bank</p>
                <p className="font-cinzel text-xl text-background font-bold">Moniepoint</p>
              </div>
              <div className="p-4 rounded-xl bg-background/20">
                <p className="font-sans text-xs text-background/60 uppercase mb-1">Account Number</p>
                <p className="font-cinzel text-2xl md:text-3xl text-background font-bold">5633783114</p>
              </div>
              <div className="p-4 rounded-xl bg-background/20">
                <p className="font-sans text-xs text-background/60 uppercase mb-1">Account Name</p>
                <p className="font-cinzel text-lg md:text-xl text-background font-bold">Fulani Hair Gro™</p>
              </div>
            </div>
            <p className="font-sans text-sm text-background/70 mb-6">After payment, send screenshot to WhatsApp for instant confirmation</p>
            
            <a 
              href={getWhatsAppLink('6-Month Supply', false)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-success hover:bg-success/90 text-foreground font-sans text-sm tracking-widest uppercase px-8 md:px-12 py-4 md:py-5 rounded-full transition-colors shadow-2xl"
            >
              <span className="text-2xl">📱</span>
              SEND PAYMENT PROOF ON WHATSAPP
            </a>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-green-900 to-emerald-800 rounded-3xl p-8 md:p-12 text-center border-2 border-success">
            <h3 className="font-cinzel text-2xl md:text-3xl mb-4 text-foreground">🚚 Pay on Delivery Selected!</h3>
            <p className="font-sans text-base md:text-lg text-success mb-6">
              Simply place your order on WhatsApp. Pay ONLY when you receive and inspect your products.
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
              {[
                { icon: "📱", text: "1. Order on WhatsApp" },
                { icon: "🚚", text: "2. We deliver to you" },
                { icon: "💵", text: "3. Inspect & pay cash" },
              ].map((step, i) => (
                <div key={i} className="p-4 rounded-xl bg-background/20">
                  <p className="text-3xl mb-2">{step.icon}</p>
                  <p className="font-sans text-xs text-success">{step.text}</p>
                </div>
              ))}
            </div>
            
            <a 
              href={getWhatsAppLink('6-Month Supply for ₦66,750', true)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-foreground hover:bg-foreground/90 text-success font-sans text-base md:text-lg tracking-widest uppercase px-8 md:px-12 py-4 md:py-5 rounded-full transition-colors shadow-2xl font-bold"
            >
              <span className="text-2xl">📱</span>
              ORDER NOW - PAY ON DELIVERY
            </a>
            
            <p className="font-sans text-xs text-success mt-4">
              ✓ No upfront payment · ✓ Inspect before paying · ✓ 100% risk-free
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
