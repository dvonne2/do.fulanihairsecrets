interface TestimonialsProps {
  activeIndex: number;
  onSetActive: (index: number) => void;
}

const testimonials = [
  { name: "Hajia Fatima Al-Maktoum", location: "Banana Island, Lagos", text: "Wallahi, I've spent millions on products from Dubai, London, everywhere. This is the ONLY thing that actually works. My stylist at the Four Seasons couldn't believe my edges.", initials: "HF" },
  { name: "Chief (Mrs.) Adaeze Okonkwo", location: "Maitama, Abuja", text: "When I say this product is worth more than its weight in gold, I mean it. Finally, a Nigerian brand that matches my standards.", initials: "AO" },
  { name: "Alhaja Maryam Ibrahim", location: "Ikoyi, Lagos", text: "I was about to fly to Turkey for a transplant. ₦15 million! My daughter said try this first. SubhanAllah, look at my hair now.", initials: "MI" },
  { name: "Dr. (Mrs.) Oluwaseun Adeleke", location: "Lekki Phase 1", text: "As a consultant dermatologist, I'm very particular. This formula is scientifically sound AND it works. I recommend it to my VIP patients.", initials: "OA" },
  { name: "Princess Zainab Sanusi", location: "Kano / Dubai", text: "I split my time between Nigeria and UAE. Trust me, nothing in Dubai Mall compares. My edges are FULL again.", initials: "ZS" },
  { name: "Otunba (Mrs.) Nike Adeyemi", location: "Victoria Island", text: "At my age, I thought my hair glory days were over. This pomade proved me wrong. My grandchildren say I look 20 years younger!", initials: "NA" },
];

export const Testimonials = ({ activeIndex, onSetActive }: TestimonialsProps) => {
  return (
    <section id="results" className="py-16 md:py-20 bg-background relative">
      <div className="absolute inset-0 arabian-pattern"></div>
      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12">
          <p className="font-cinzel text-sm tracking-[0.4em] uppercase text-gold mb-4">✦ Real Results ✦</p>
          <h2 className="font-cinzel text-2xl md:text-4xl">
            <span className="text-foreground">5,247 Five-Star Reviews</span>
          </h2>
          <p className="font-sans text-gold/60 mt-2">Verified purchases only</p>
        </div>

        {/* Featured Review */}
        <div className="luxury-card rounded-3xl p-8 md:p-12 mb-8 text-center mega-glow">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center text-background font-bold text-xl">
              {testimonials[activeIndex].initials}
            </div>
          </div>
          <div className="flex justify-center gap-1 mb-4">
            {Array(5).fill(0).map((_, j) => <span key={j} className="text-gold text-2xl">★</span>)}
          </div>
          <p className="font-serif text-xl md:text-2xl italic text-foreground/90 mb-6 max-w-3xl mx-auto">
            "{testimonials[activeIndex].text}"
          </p>
          <p className="font-cinzel text-lg text-gold">{testimonials[activeIndex].name}</p>
          <p className="font-sans text-xs text-gold/60">{testimonials[activeIndex].location}</p>
          <p className="font-sans text-xs text-success mt-2">✓ Verified Purchase</p>
          
          <div className="flex justify-center gap-3 mt-6">
            {testimonials.map((_, i) => (
              <button 
                key={i} 
                onClick={() => onSetActive(i)} 
                className={`w-3 h-3 rounded-full transition-all ${activeIndex === i ? 'bg-gold scale-150' : 'bg-gold/30'}`} 
              />
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.slice(0, 6).map((review, i) => (
            <div key={i} className="luxury-card rounded-xl p-6 hover:scale-[1.02] transition-transform">
              <div className="flex gap-1 mb-3">{Array(5).fill(0).map((_, j) => <span key={j} className="text-gold">★</span>)}</div>
              <p className="font-sans text-sm text-muted-foreground mb-4">"{review.text}"</p>
              <div className="ornate-divider mb-3"></div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-cinzel text-sm text-gold">{review.name}</p>
                  <p className="font-sans text-xs text-gold/50">{review.location}</p>
                </div>
                <span className="text-xs text-success">✓ Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
