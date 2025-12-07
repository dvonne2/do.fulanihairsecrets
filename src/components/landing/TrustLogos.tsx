export const TrustLogos = () => {
  const trustItems = [
    "🏥 Dermatologist Approved",
    "🔬 Lab Tested",
    "🌿 100% Natural",
    "🇳🇬 Made in Nigeria",
    "🛡️ Money-Back Guarantee",
    "💳 Pay on Delivery",
  ];

  return (
    <section className="py-4 gold-gradient">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 lg:gap-12 text-center">
          {trustItems.map((item, i) => (
            <p key={i} className="font-sans text-xs text-background font-bold tracking-wider">{item}</p>
          ))}
        </div>
      </div>
    </section>
  );
};
