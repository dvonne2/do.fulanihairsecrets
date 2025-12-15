export const Guarantee = () => {
  return (
    <section className="py-16 md:py-20 bg-background relative">
      <div className="absolute inset-0 arabian-pattern"></div>
      <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
        <div className="luxury-card rounded-3xl p-8 md:p-12 text-center mega-glow">
          <div className="inline-block px-6 py-2 rounded-full bg-destructive text-foreground font-bold text-sm mb-6 animate-pulse">
            ⚡ DOUBLE YOUR MONEY BACK ⚡
          </div>
          
          <div className="w-24 h-24 mx-auto rounded-full gold-gradient flex items-center justify-center text-4xl mb-6 relative">
            🛡️
            <span className="absolute -bottom-1 -right-1 px-2 py-1 bg-gold text-background text-xs font-bold rounded-full">2X</span>
          </div>
          
          <h2 className="font-cinzel text-2xl md:text-3xl text-gold mb-4">DOUBLE Money-Back Guarantee</h2>
          <p className="font-sans text-foreground/80 mb-4 max-w-2xl mx-auto">
            Try Fulani Hair Gro™ risk-free for 365 days. If you don't see visible hair growth, 
            we'll give you DOUBLE your money back.
          </p>
          <p className="font-sans text-foreground/80 mb-8 max-w-2xl mx-auto">
            We take this risk because we've seen it work on thousands of Nigerian women — including cases worse than yours.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: "✓", title: "Use All Products", desc: "Try everything for 365 days" },
              { icon: "✓", title: "No Questions Asked", desc: "Just send us a message" },
              { icon: "✓", title: "Get 2X Refund", desc: "We pay for your disappointment" },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-success/20 border border-success/50">
                <span className="text-2xl text-success mb-2 block">{item.icon}</span>
                <p className="font-cinzel text-base text-foreground mb-1">{item.title}</p>
                <p className="font-sans text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <p className="font-sans text-xs text-muted-foreground mb-1">Your risk:</p>
              <p className="font-cinzel text-2xl text-success">₦0</p>
            </div>
            <div className="text-center">
              <p className="font-sans text-xs text-muted-foreground mb-1">Our risk:</p>
              <p className="font-cinzel text-2xl text-destructive">₦133,500</p>
            </div>
          </div>
          
          <p className="font-sans text-xs text-muted-foreground italic">
            We've issued less than 0.3% refunds because it simply works.
          </p>
        </div>
      </div>
    </section>
  );
};
