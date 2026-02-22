import { useState, useEffect } from 'react';

interface StickyElementsProps {
  showStickyBar: boolean;
  viewerCount: number;
  stockCount: number;
  showPurchaseNotif: boolean;
  currentNotif: { name: string; location: string; product: string; time: string };
  scrollProgress: number;
}

export const StickyElements = ({ 
  scrollProgress 
}: StickyElementsProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Hide when user is near the order form (so it doesn't overlap)
      const form = document.getElementById('order-form');
      if (form) {
        const rect = form.getBoundingClientRect();
        // Form is visible on screen — hide the bar
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setVisible(false);
          return;
        }
      }
      setVisible(true);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToOrderForm = () => {
    const el = document.getElementById('order-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Progress Bar */}
      <div 
        className="progress-bar" 
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Sticky CTA Bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s ease',
          pointerEvents: visible ? 'auto' : 'none',
        }}
      >
        <div
          style={{
            background: '#00C853',
            padding: '10px 16px',
            paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.25)',
          }}
        >
          {/* Left: Title + subtitle */}
          <div style={{ flex: '0 1 auto', minWidth: 0 }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '900',
              color: '#000',
              fontFamily: 'Montserrat, sans-serif',
              lineHeight: '1.2',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}>
              Hair Growth Package
            </div>
            <div style={{
              fontSize: '12px',
              fontWeight: '600',
              color: 'rgba(0,0,0,0.7)',
              fontFamily: 'Montserrat, sans-serif',
              lineHeight: '1.3',
            }}>
              Payment On Delivery
            </div>
          </div>

          {/* Center: Offer text */}
          <div style={{
            flex: '1 1 auto',
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: '800',
            color: '#000',
            fontFamily: 'Montserrat, sans-serif',
            lineHeight: '1.3',
            letterSpacing: '0.3px',
          }}>
            Special 60% OFF — ₦66,750
          </div>

          {/* Right: CTA Button */}
          <button
            onClick={scrollToOrderForm}
            data-form-cta="true"
            style={{
              flex: '0 0 auto',
              background: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '20px',
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: '700',
              fontFamily: 'Montserrat, sans-serif',
              cursor: 'pointer',
              lineHeight: '1.2',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              minHeight: '40px',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            Click To Buy Now
          </button>
        </div>
      </div>
    </>
  );
};
