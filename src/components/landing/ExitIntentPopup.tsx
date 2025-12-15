import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface ExitIntentPopupProps {
  show: boolean;
  onClose: () => void;
}

export const ExitIntentPopup = ({ show, onClose }: ExitIntentPopupProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const scrollToOrderForm = () => {
    const el = document.getElementById('order-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(
          'fulani_availability_intent',
          JSON.stringify({
            name: name.trim(),
            phone: phone.trim(),
            ts: Date.now(),
          })
        );
      } catch {
        // Fail silently if localStorage is unavailable
      }

      if (Array.isArray((window as any).dataLayer)) {
        (window as any).dataLayer.push({
          event: 'AvailabilityIntent',
          intentSource: 'ExitIntentPopup',
        });
      }
    }

    scrollToOrderForm();
    onClose();
  };

  // ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (show) {
      document.addEventListener('keydown', handleEsc);
    }
    
    return () => document.removeEventListener('keydown', handleEsc);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose} // Click backdrop to close
    >
      <div 
        className="max-w-3xl w-full rounded-2xl p-6 md:p-8 relative bg-card border border-gold/40 shadow-lg"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking popup content
      >
        {/* X Close Button - visible but calm */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-muted/60 hover:bg-muted flex items-center justify-center text-gold hover:text-foreground transition-colors"
          aria-label="Close popup"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1.3fr] gap-6 md:gap-8 items-stretch">
          {/* Left: Visual reassurance */}
          <div className="hidden md:flex flex-col justify-between border border-gold/25 rounded-xl p-4 bg-background/80">
            <div>
              <p className="font-cinzel text-xs tracking-[0.3em] uppercase text-gold mb-2">Fulani Hair Gro</p>
              <h2 className="font-cinzel text-lg text-foreground mb-3">
                Stronger, fuller hair with cash on delivery.
              </h2>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-full max-w-[220px] aspect-[3/4] rounded-xl bg-[#111111] border border-gold/30 flex items-center justify-center overflow-hidden">
                <img
                  src="/assets/products/system-bundle.png"
                  alt="Fulani Hair Gro Complete System"
                  loading="lazy"
                  width={440}
                  height={600}
                  className="object-contain w-full h-full"
                />
              </div>
            </div>

            <div className="mt-4 space-y-1">
              <p className="text-xs font-serif text-foreground/80">
                 Cash on Delivery Available
              </p>
              <p className="text-xs font-serif text-foreground/70">
                 Nationwide delivery while current batch lasts
              </p>
            </div>
          </div>

          {/* Right: Conversion column */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="font-cinzel text-xl md:text-2xl text-gold mb-1">
                Limited Batch Available Today
              </h2>
              <p className="text-xs md:text-sm text-foreground/70 mb-4">
                Due to herbal sourcing and small-batch production, we can only fulfill a limited number of deliveries per day.
              </p>

              <div className="mb-4 space-y-1">
                <p className="text-sm text-foreground/80">
                  <span className="font-semibold">Todays bundle price:</span> 62,750
                </p>
                <p className="text-xs text-foreground/70">Pay on delivery  no upfront payment.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-foreground/80 mb-1" htmlFor="popup-name">
                    Your Name
                  </label>
                  <input
                    id="popup-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-gold/70"
                    placeholder="e.g. Aisha Bello"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground/80 mb-1" htmlFor="popup-phone">
                    Phone Number (WhatsApp preferred)
                  </label>
                  <input
                    id="popup-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-gold/70"
                    placeholder="e.g. 0803 000 0000"
                    required
                  />
                </div>

                <p className="text-[11px] leading-snug text-foreground/70">
                  Well only call or message to confirm availability and delivery to your area. No spam, no pressure to buy.
                </p>

                <button
                  type="submit"
                  data-form-cta="true"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gold text-black font-cinzel text-sm tracking-widest uppercase py-3 font-bold hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-gold/70"
                >
                   Check Availability in My Area
                </button>
              </form>
            </div>

            <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <p className="text-[11px] text-foreground/70">
                 Average confirmation time under 10 minutes.
              </p>
              <p className="text-[11px] text-foreground/80">
                 9 people are checking availability right now.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
