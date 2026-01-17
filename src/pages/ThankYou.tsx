import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Check, Package, Truck, Phone, CreditCard, Crown, Download, Play, Target, MessageCircle, Mail, PhoneCall, Copy, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMetaPixel } from '@/hooks/useMetaPixel';

import result1 from '@/assets/results/result-1.webp';
import result2 from '@/assets/results/result-2.webp';
import result3 from '@/assets/results/result-3.webp';
import shampoo from '@/assets/products/shampoo.webp';
import conditioner from '@/assets/products/conditioner.webp';
import pomade from '@/assets/products/pomade.webp';
import founderImg from '@/assets/products/hajara.webp';
import amina from '@/assets/testimonials/amina.webp';
import blessing from '@/assets/testimonials/blessing.webp';

const ThankYou = () => {
  const { trackPurchase } = useMetaPixel();
  const hasTrackedPurchase = useRef(false);
  const [orderNumber] = useState(() => {
    if (typeof window !== 'undefined') {
      // Use entry_id from URL (WPForms Entry ID) as the single source of truth
      const params = new URLSearchParams(window.location.search);
      const orderId = params.get('orderId');
      if (orderId && orderId.trim().length > 0) {
        return orderId;
      }
      const entryId = params.get('entry_id');
      if (entryId && entryId.trim().length > 0) {
        return entryId;
      }
      // Log when entry_id is missing for debugging
      console.error('Order ID (entry_id) missing from URL:', {
        url: window.location.href,
        searchParams: window.location.search
      });
    }
    // Fallback when no entry_id is available
    return 'UNKNOWN';
  });
  const [savingsAnimated, setSavingsAnimated] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Confetti explosion on load
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#DAA520', '#FFD700', '#ffffff']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#DAA520', '#FFD700', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Animate savings counter
    const targetSavings = 15493250;
    const duration2 = 2000;
    const startTime = Date.now();
    
    const animateSavings = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration2, 1);
      setSavingsAnimated(Math.floor(progress * targetSavings));
      if (progress < 1) requestAnimationFrame(animateSavings);
    };
    setTimeout(animateSavings, 1000);
  }, []);

  // Meta Pixel: Purchase on mount (with order data)
  useEffect(() => {
    if (hasTrackedPurchase.current) return;
    if (!orderNumber || orderNumber === 'UNKNOWN') return;

    type StoredOrder = {
      orderId?: string;
      fullName?: string;
      phone?: string;
      email?: string;
      packageName?: string;
      packageAmount?: number;
      deliveryFee?: number;
      totalAmount?: number;
      state?: string;
      lga?: string;
      address?: string;
    };

    let stored: StoredOrder | null = null;
    try {
      const raw = window.sessionStorage.getItem('fhg_order_data');
      if (raw) stored = JSON.parse(raw) as StoredOrder;
    } catch {
      stored = null;
    }

    const merged: StoredOrder = {
      ...stored,
      orderId: orderNumber,
    };

    trackPurchase({
      orderId: merged.orderId,
      fullName: merged.fullName,
      email: merged.email,
      phone: merged.phone,
      packageName: merged.packageName,
      packagePrice: merged.packageAmount,
      deliveryFee: merged.deliveryFee,
      totalAmount: merged.totalAmount,
      state: merged.state,
      lga: merged.lga,
      address: merged.address,
    });

    hasTrackedPurchase.current = true;
  }, [orderNumber, trackPurchase]);

  useEffect(() => {
    try {
      if (window.top !== window.self) {
        window.top.location.href = window.location.href;
      }
    } catch (error) {
      console.error('Iframe breakout failed (cross-origin restriction):', {
        currentUrl: window.location.href,
        error: error instanceof Error ? error.message : error
      });
    }
  }, []);

  // Force GTM + Pixel pageview on SPA navigation to /thank-you
  useEffect(() => {
    type WindowWithDataLayer = Window & {
      dataLayer?: Array<Record<string, unknown>>;
    };

    const w = window as WindowWithDataLayer;
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({
      event: 'virtualPageview',
      page: '/thank-you',
    });
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount);
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText('fulaniharigro.com/ref/QUEEN2024');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    { q: "What if my order doesn't arrive?", a: "Every order is tracked. You'll receive WhatsApp updates at every stage. If anything goes wrong, we reship immediately at our cost." },
    { q: "What if it doesn't work for me?", a: "You're protected by our 365-day DOUBLE money-back guarantee. If you don't see results, we refund 2X what you paid. No questions." },
    { q: "How do I use the products correctly?", a: "Your ebook and VIP group have everything. Plus, we'll send a personalized routine within 24 hours. You'll know exactly what to do." },
    { q: "Can I change my delivery address?", a: "Yes! WhatsApp us immediately with your new address." },
    { q: "When will I see results?", a: "Most women notice reduced shedding Week 1, baby hairs Week 3, visible transformation Month 2-3. Check the timeline above!" }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Floating gold particles background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gold/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* SECTION 1: CELEBRATION HERO */}
      <section className="py-16 px-4 text-center relative">
        <div className="max-w-4xl mx-auto">
          {/* Animated Checkmark */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center animate-[scale-in_0.5s_ease-out]">
            <Check className="w-12 h-12 text-black" strokeWidth={3} />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-green-500 mb-2">✓ ORDER CONFIRMED!</h1>
          <p className="text-3xl md:text-4xl font-cinzel text-gold mb-2">Congratulations, Queen! 👑</p>
          <p className="text-xl text-gray-300 mb-4">"You Just Made the Best Decision for Your Hair"</p>
          
          <div className="text-gray-400 mb-8">
            <p>Order ID: {orderNumber}</p>
            <p>{new Date().toLocaleDateString('en-NG', { month: 'long', day: 'numeric', year: 'numeric' })} • {new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>

          <p className="text-xl md:text-2xl bg-gradient-to-r from-gold via-amber-400 to-gold bg-clip-text text-transparent font-semibold max-w-3xl mx-auto mb-8">
            "While others are still struggling with products that don't work, you just invested in 400 years of PROVEN results."
          </p>

          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            You're now 1 of 15,248 Nigerian Queens with amazing hair incoming!
          </div>
        </div>
      </section>

      {/* SECTION 2: INSTANT VALIDATION */}
      <section className="py-16 px-4 bg-[#111]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-cinzel text-center text-gold mb-12">You Made The Right Choice. Here's Proof:</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#0a0a0a] border-2 border-gold rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-gold mb-2">Join The Winners</h3>
              <p className="text-gray-300 mb-4">92% of women who use the complete system see visible results within 8 weeks</p>
              <div className="w-full bg-gray-800 rounded-full h-3">
                <div className="bg-gradient-to-r from-gold to-amber-500 h-3 rounded-full transition-all duration-1000" style={{ width: '92%' }} />
              </div>
            </div>

            <div className="bg-[#0a0a0a] border-2 border-green-500 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-green-400 mb-2">Smart Investment</h3>
              <p className="text-gray-300">You just saved <span className="text-green-400 font-bold">₦179,250</span> compared to buying individually. That's a Chanel bag worth of savings! 👜</p>
            </div>

            <div className="bg-[#0a0a0a] border-2 border-gold rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold text-gold mb-2">Zero Risk</h3>
              <p className="text-gray-300">Protected by our 365-day DOUBLE money-back guarantee. If it doesn't work → You get 2X your money back</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: SMART CHOICE CALCULATOR */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto bg-[#111] border-2 border-gold rounded-3xl p-8">
          <h2 className="text-2xl font-cinzel text-gold mb-8 flex items-center gap-2">
            💰 YOUR SMART CHOICE BREAKDOWN
          </h2>
          
          <p className="text-gray-400 mb-6">What you would have spent:</p>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 line-through">6 months of salon treatments</span>
              <span className="text-gray-500 line-through">₦360,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 line-through">Products that don't work</span>
              <span className="text-gray-500 line-through">₦200,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 line-through">Hair transplant (Turkey)</span>
              <span className="text-gray-500 line-through">₦15,000,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 line-through">Emotional stress</span>
              <span className="text-gray-500 line-through">PRICELESS</span>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6 mb-6">
            <div className="flex justify-between items-center text-xl">
              <span className="text-white">Your investment today:</span>
              <span className="text-green-400 font-bold">₦66,750</span>
            </div>
          </div>

          <div className="border-t-2 border-gold pt-6 text-center">
            <p className="text-gray-400 mb-2">🧠 YOUR SMART SAVINGS:</p>
            <p className="text-4xl md:text-5xl font-bold text-gold">{formatCurrency(savingsAnimated)}+</p>
            <p className="text-amber-400 mt-4 italic">"You didn't spend money. You SAVED money."</p>
          </div>
        </div>
      </section>

      {/* SECTION 4: WHAT HAPPENS NEXT */}
      <section className="py-16 px-4 bg-[#111]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-cinzel text-center text-gold mb-12">Your Transformation Journey Starts NOW</h2>
          
          <div className="space-y-0">
            {[
              { icon: Check, title: 'ORDER CONFIRMED', time: 'Just now', desc: 'Your order is locked in', active: true },
              { icon: Package, title: 'PACKAGING', time: 'Within 24 hours', desc: 'Our team is preparing your products with care' },
              { icon: Truck, title: 'SHIPPING', time: '1-3 business days', desc: 'Your package is on its way!' },
              { icon: Phone, title: 'DELIVERY CALL', time: '30 mins before arrival', desc: 'Our rider will call to confirm' },
              { icon: CreditCard, title: 'PAY & RECEIVE', time: 'Delivery day', desc: 'Inspect your products, then pay. Simple!' },
              { icon: Crown, title: 'TRANSFORMATION BEGINS', time: 'Same day', desc: 'Start your journey to longer, fuller hair!' }
            ].map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${step.active ? 'bg-green-500' : 'bg-[#222] border border-gold/50'}`}>
                    <step.icon className={`w-6 h-6 ${step.active ? 'text-white' : 'text-gold'}`} />
                  </div>
                  {i < 5 && <div className="w-0.5 h-16 bg-gold/30" />}
                </div>
                <div className="pb-8">
                  <p className={`font-bold ${step.active ? 'text-green-400' : 'text-gold'}`}>{step.title}</p>
                  <p className="text-sm text-gray-400">{step.time}</p>
                  <p className="text-gray-300">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-green-500/20 border border-green-500/50 rounded-2xl p-6 mt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-green-400">📍 Delivering to: <span className="text-white">Lagos, Nigeria</span></p>
                <p className="text-green-400">📅 Expected arrival: <span className="text-white">December 10-12, 2025</span></p>
                <p className="text-green-400">📱 Tracking sent via WhatsApp</p>
              </div>
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                TRACK YOUR ORDER
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: ORDER SUMMARY */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-cinzel text-center text-gold mb-12">Here's Everything Coming Your Way:</h2>
          
          <div className="bg-[#111] border border-gold/30 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold text-gold mb-4">YOUR 6-MONTH TRANSFORMATION SUPPLY:</h3>
            <div className="space-y-4">
              {[
                { img: shampoo, name: 'Heritage Shampoo (500ml)', qty: 'x3' },
                { img: conditioner, name: 'Voluminous Conditioner (500ml)', qty: 'x3' },
                { img: pomade, name: 'Growth Pomade (150g)', qty: 'x3' }
              ].map((product, i) => (
                <div key={i} className="flex items-center gap-4">
                  <img src={product.img} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                  <span className="flex-1 text-gray-300">{product.name}</span>
                  <span className="text-gold">{product.qty}</span>
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111] border border-green-500/30 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold text-green-400 mb-4">🎁 YOUR FREE BONUSES:</h3>
            <div className="space-y-3">
              {[
                { icon: '🎀', name: '3x Luxury Silk Bonnets', value: '₦15,000' },
                { icon: '📖', name: 'Hair Growth Secrets Ebook', value: '₦10,000' },
                { icon: '📱', name: 'VIP WhatsApp Support', value: '₦20,000' },
                { icon: '💆', name: 'Scalp Massage Guide', value: '₦5,000' },
                { icon: '🎯', name: 'Personalized Hair Plan', value: '₦15,000' }
              ].map((bonus, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-2xl">{bonus.icon}</span>
                  <span className="flex-1 text-gray-300">{bonus.name}</span>
                  <span className="text-gray-500">{bonus.value}</span>
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111] rounded-2xl p-6 text-center">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Total Value:</span>
              <span className="text-gray-400">₦246,000</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-white">You Paid:</span>
              <span className="text-white">₦66,750</span>
            </div>
            <div className="border-t border-gray-700 pt-4 flex justify-between items-center">
              <span className="text-xl font-bold text-green-400">YOU SAVED:</span>
              <span className="text-3xl font-bold text-green-400">₦179,250 💰</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: WHAT TO EXPECT */}
      <section className="py-16 px-4 bg-[#111]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-cinzel text-center text-gold mb-12">Get Ready For These Changes:</h2>
          
          <div className="space-y-6">
            {[
              { title: 'WEEK 1-2: The Foundation', items: ['Reduced hair shedding', 'Scalp feels cleaner and healthier', 'Less itching and irritation'], tip: 'Check your brush — less hair already!' },
              { title: 'WEEK 3-4: The Excitement Begins', items: ['Baby hairs appearing around edges', 'Hair feels stronger when styling', 'Less breakage during detangling'], tip: 'Look closely at your hairline — see them?' },
              { title: 'MONTH 2-3: Others Start Noticing', items: ['Visible new growth', 'Fuller, thicker appearance', 'Compliments start coming'], tip: 'Your hairdresser will ask what you\'re using' },
              { title: 'MONTH 4-6: Full Transformation', items: ['Dramatic transformation complete', 'Edges fully restored', 'Length you haven\'t seen in years'], tip: 'Time for that \'AFTER\' photo! 📸' }
            ].map((phase, i) => (
              <div key={i} className="bg-[#0a0a0a] border border-gold/30 rounded-2xl p-6">
                <h3 className="text-gold font-bold mb-4">{phase.title}</h3>
                <div className="space-y-2 mb-4">
                  {phase.items.map((item, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-gold/50 rounded" />
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-amber-400 text-sm">💡 "{phase.tip}"</p>
              </div>
            ))}
          </div>

          <div className="bg-gold/10 border border-gold/30 rounded-2xl p-6 mt-8 text-center">
            <p className="text-gold">📱 Screenshot this timeline!</p>
            <p className="text-gray-300">Check off each milestone as you hit it.</p>
            <p className="text-amber-400">We LOVE when customers send us their progress! 💕</p>
          </div>
        </div>
      </section>

      {/* SECTION 7: WELCOME TO THE FAMILY */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#111] border border-gold/30 rounded-3xl p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <img 
                src={founderImg}
                alt="Hajiya Hajara - Founder, Fulani Hair Gro"
                className="w-32 h-32 rounded-full border-4 border-gold object-cover" 
              />
              <div>
                <p className="text-2xl text-gold mb-4">"Welcome, Queen! 👑</p>
                <p className="text-gray-300 mb-4">You're not just a customer — you're family now.</p>
                <p className="text-gray-300 mb-4">We're personally invested in YOUR transformation. That's why we offer 365-day guarantees, VIP WhatsApp support, and check in on your progress.</p>
                <p className="text-gray-300 mb-4">Your hair journey matters to us. We can't wait to see your results!</p>
                <p className="text-gray-400 italic">With love,</p>
                <p className="text-gold font-cinzel text-xl">Hajiya Hajara</p>
                <p className="text-gray-400 text-sm">Founder, Fulani Hair Gro™</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 text-center">
            <div className="bg-[#111] rounded-xl p-4">
              <p className="text-3xl font-bold text-gold">5,248+</p>
              <p className="text-gray-400 text-sm">Happy Queens</p>
            </div>
            <div className="bg-[#111] rounded-xl p-4">
              <p className="text-3xl font-bold text-gold">98.7%</p>
              <p className="text-gray-400 text-sm">Would Recommend</p>
            </div>
            <div className="bg-[#111] rounded-xl p-4">
              <p className="text-3xl font-bold text-gold">100,000+</p>
              <p className="text-gray-400 text-sm">Products Delivered</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: DIGITAL BONUSES */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-cinzel text-center text-gold mb-4">📲 Your Digital Bonuses Are Ready</h2>
          <p className="text-center text-gray-400 mb-12">Access NOW!</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#111] border border-gold/30 rounded-2xl p-6 text-center">
              <Download className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gold mb-2">Hair Growth Secrets Ebook</h3>
              <p className="text-gray-400 text-sm mb-4">"47 pages of expert tips for faster, healthier growth"</p>
              <Button className="w-full bg-gold hover:bg-amber-600 text-black">DOWNLOAD NOW</Button>
            </div>

            <div className="bg-[#111] border border-gold/30 rounded-2xl p-6 text-center">
              <Play className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gold mb-2">Scalp Massage Video Guide</h3>
              <p className="text-gray-400 text-sm mb-4">"5-minute routine that boosts blood flow by 200%"</p>
              <Button className="w-full bg-gold hover:bg-amber-600 text-black">WATCH NOW</Button>
            </div>

            <div className="bg-[#111] border border-gold/30 rounded-2xl p-6 text-center">
              <Target className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gold mb-2">Personalized Hair Plan</h3>
              <p className="text-gray-400 text-sm mb-4">"Custom routine sent within 24 hours via WhatsApp"</p>
              <Button className="w-full bg-gold hover:bg-amber-600 text-black">TAKE HAIR QUIZ</Button>
            </div>
          </div>

          <p className="text-center text-amber-400 mt-8">Start learning NOW so you're ready to maximize results the moment your products arrive! ⚡</p>
        </div>
      </section>

      {/* SECTION 10: TESTIMONIALS */}
      <section className="py-16 px-4 bg-[#111]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-cinzel text-center text-gold mb-12">You're In Great Company</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { img: amina, name: 'Hajia Amina B.', loc: 'Kano, Nigeria', quote: "I was nervous after ordering. Was this really going to work? 4 months later, I'm SO glad I trusted my gut. Best decision ever." },
              { img: blessing, name: 'Mrs. Blessing O.', loc: 'Lagos, Nigeria', quote: "The moment I got my package, I knew this was different. The quality, the smell, everything screams PREMIUM." },
              { img: founderImg, name: 'Chidinma E.', loc: 'Port Harcourt, Nigeria', quote: "I've ordered 3 times now. First for myself, then my mom, then my sister. We're all obsessed!" }
            ].map((t, i) => (
              <div key={i} className="bg-[#0a0a0a] border border-gold/30 rounded-2xl p-6">
                <div className="text-amber-400 mb-4">★★★★★</div>
                <p className="text-gray-300 text-sm mb-4 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="text-gold font-semibold">{t.name}</p>
                    <p className="text-gray-400 text-sm">{t.loc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#0a0a0a] rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 flex items-center gap-4">
              <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center text-gray-500">BEFORE</div>
              <span className="text-gold text-2xl">→</span>
              <img src={result1} alt="After" className="w-24 h-24 rounded-lg object-cover" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-gold font-semibold">Amina O. — 8 weeks after ordering</p>
              <p className="text-amber-400">"This could be you in 2 months! 📸"</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11: SUPPORT */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-cinzel text-center text-gold mb-12">Questions? We're Here For You 24/7</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <a href="https://wa.me/2348101594734" className="bg-[#111] border border-green-500/30 rounded-2xl p-6 text-center hover:border-green-500 transition-colors">
              <MessageCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">WHATSAPP</h3>
              <p className="text-gray-400 mb-2">08101594734</p>
              <p className="text-green-400 text-sm">Response: Under 2 hours</p>
            </a>

            <div className="bg-[#111] border border-gold/30 rounded-2xl p-6 text-center">
              <Mail className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">EMAIL</h3>
              <p className="text-gray-400 mb-2">admin@fulanihairsecrets.com</p>
              <p className="text-amber-400 text-sm">Response: Within 24hrs</p>
            </div>

            <a href="tel:+2348101594734" className="bg-[#111] border border-gold/30 rounded-2xl p-6 text-center hover:border-gold transition-colors">
              <PhoneCall className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">CALL US</h3>
              <p className="text-gray-400 mb-2">08101594734</p>
              <p className="text-amber-400 text-sm">Hours: 9am-6pm Mon-Sat</p>
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 12: FAQ */}
      <section className="py-16 px-4 bg-[#111]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-cinzel text-center text-gold mb-12">Quick Answers For Peace of Mind</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#0a0a0a] border border-gold/30 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="text-gold font-semibold">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-5 h-5 text-gold" /> : <ChevronDown className="w-5 h-5 text-gold" />}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-300">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 13: REFERRAL */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-cinzel text-center text-gold mb-8">💰 Share The Secret, Get Rewarded</h2>
          
          <div className="bg-[#111] border-2 border-gold rounded-3xl p-8">
            <h3 className="text-xl font-bold text-center text-gold mb-6">EARN ₦5,000 FOR EVERY FRIEND WHO ORDERS</h3>
            
            <div className="bg-[#0a0a0a] rounded-xl p-4 flex items-center justify-between mb-6">
              <span className="text-gray-300 text-sm md:text-base truncate">fulaniharigro.com/ref/QUEEN2024</span>
              <Button onClick={copyReferralLink} variant="outline" size="sm" className="border-gold text-gold hover:bg-gold hover:text-black">
                {copied ? 'Copied!' : <><Copy className="w-4 h-4 mr-1" /> Copy</>}
              </Button>
            </div>

            <div className="space-y-2 mb-6 text-gray-300">
              <p>1️⃣ Share your link with friends</p>
              <p>2️⃣ They get ₦3,000 off their first order</p>
              <p>3️⃣ You get ₦5,000 credited to your account</p>
              <p>4️⃣ Use credits for your next order!</p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center mb-6">
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                <Share2 className="w-4 h-4 mr-2" /> Share on WhatsApp
              </Button>
              <Button variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white">
                Share on Instagram
              </Button>
              <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
                Share on Facebook
              </Button>
            </div>

            <p className="text-center text-amber-400 text-sm">"23 queens earned over ₦50,000 last month just by sharing!"</p>
          </div>
        </div>
      </section>

      {/* SECTION 14: COMMITMENT */}
      <section className="py-16 px-4 bg-[#111]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-cinzel text-center text-gold mb-8">Before You Go — Make This Promise to Yourself</h2>
          
          <div className="bg-[#0a0a0a] border-2 border-gold rounded-3xl p-8">
            <p className="text-xl text-gray-300 mb-6">"I, <span className="border-b border-gold/50 px-8">____________</span>, commit to my hair transformation.</p>
            
            <p className="text-gold mb-4">I will:</p>
            <div className="space-y-2 mb-6">
              {['Use the Complete System consistently for 90 days', 'Follow the routine every night', 'Trust the process, even when I doubt', 'Take progress photos every 2 weeks', 'Celebrate my wins, no matter how small'].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gold/20 border border-gold rounded flex items-center justify-center">
                    <Check className="w-3 h-3 text-gold" />
                  </div>
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>

            <p className="text-gold mb-4">My hair goal:</p>
            <div className="space-y-2 mb-8">
              {['Restore my edges', 'Stop shedding & breakage', 'Grow longer hair', 'Get thicker, fuller hair', 'All of the above'].map((goal, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-gold rounded-full" />
                  <span className="text-gray-300">{goal}</span>
                </div>
              ))}
            </div>

            <Button className="w-full bg-gradient-to-r from-gold to-amber-600 hover:from-amber-600 hover:to-gold text-black text-lg py-6">
              👑 I COMMIT TO MY TRANSFORMATION 👑
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 15: FINAL MOTIVATION */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 z-0">
          <img src={result2} alt="Beautiful hair" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="text-2xl md:text-4xl font-cinzel text-white leading-relaxed mb-8">
            Your Last Bad Hair Day Was Yesterday.
          </p>
          <div className="space-y-2 text-lg md:text-xl text-gray-300 mb-8">
            <p>Every day from now, your hair gets better.</p>
            <p>Every week, you'll see progress.</p>
            <p>Every month, more transformation.</p>
            <p className="text-gold font-semibold">In 6 months, you won't recognize yourself.</p>
          </div>
          <p className="text-2xl text-gold mb-4">Welcome to the family, Queen. 👑</p>
          <p className="text-gray-300 italic">Your journey starts the moment your package arrives.</p>
          <p className="text-gray-300 italic">We can't wait to see your results.</p>
          <p className="text-gold mt-8">— The Fulani Hair Gro™ Family</p>
        </div>
      </section>

      {/* SECTION 16: STICKY FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#111] border-t border-gold/30 p-4 z-50">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-400">
            📦 Order ID: {orderNumber} • Est. Delivery: Dec 10-12
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black text-xs">
              TRACK ORDER
            </Button>
            <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white text-xs">
              WHATSAPP SUPPORT
            </Button>
            <Button size="sm" variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black text-xs hidden md:inline-flex">
              DOWNLOAD BONUSES
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom padding for sticky footer */}
      <div className="h-24" />
    </div>
  );
};

export default ThankYou;
