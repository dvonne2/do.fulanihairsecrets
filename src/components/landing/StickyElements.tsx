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
            background: '#DAA520',
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
              fontSize: '20px',
              fontWeight: '700',
              color: '#FFFFFF',
              fontFamily: 'Montserrat, sans-serif',
              lineHeight: '1.3',
              letterSpacing: '0.3px',
              textTransform: 'uppercase',
              textDecoration: 'none',
              textIndent: '0px',
              fontStyle: 'normal',
              fontVariant: 'normal',
              fontKerning: 'auto',
              fontOpticalSizing: 'auto',
              fontStretch: '100%',
              fontVariationSettings: 'normal',
              fontFeatureSettings: 'normal',
              padding: '8px 0'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '4px'
              }} className="md:flex-row md:items-center md:gap-4px" style={{
                flexDirection: 'column',
                alignItems: 'center',
                gap: '24px'
              }}>
                <span>Fulani</span>
                <span style={{
                  fontSize: '16px',
                  fontWeight: '600'
                }}> Hair Gro Bundle</span>
              </div>
            </div>
            <div style={{
              fontSize: '17px',
              fontWeight: '600',
              color: '#FFFFFF',
              fontFamily: 'Montserrat, sans-serif',
              lineHeight: '1.3',
              fontStyle: 'normal',
              fontVariant: 'normal',
              fontKerning: 'auto',
              fontOpticalSizing: 'auto',
              fontStretch: '100%',
              fontVariationSettings: 'normal',
              fontFeatureSettings: 'normal',
              textTransform: 'none',
              textDecoration: 'none',
              textAlign: 'left',
              textIndent: '0px',
              background: 'rgba(0, 0, 0, 0)'
            }}>
              Payment On Delivery
            </div>
          </div>

          {/* Right: CTA Button */}
          <button
            onClick={scrollToOrderForm}
            data-form-cta="true"
            className="relative overflow-hidden"
            style={{
              flex: '0 0 auto',
              background: '#000000',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '20px',
              padding: '10px 18px',
              fontSize: '20px',
              fontWeight: '700',
              fontFamily: 'Montserrat, sans-serif',
              cursor: 'pointer',
              lineHeight: '1.2',
              textAlign: 'right',
              whiteSpace: 'nowrap',
              minHeight: '40px',
              WebkitTapHighlightColor: 'transparent',
              fontStyle: 'normal',
              fontVariant: 'normal',
              fontKerning: 'auto',
              fontOpticalSizing: 'auto',
              fontStretch: '100%',
              fontVariationSettings: 'normal',
              fontFeatureSettings: 'normal',
              textTransform: 'none',
              textDecoration: 'none',
              textIndent: '0px',
              transition: 'background 0.3s ease, color 0.3s ease',
              animation: 'bling-pulse-buy 2s ease-in-out infinite',
              boxShadow: '0 0 20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 255, 255, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FFFFFF';
              e.currentTarget.style.color = '#000000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#000000';
              e.currentTarget.style.color = '#FFFFFF';
            }}
          >
            {/* Clean text without sparkles */}
            <span className="relative z-10">
              Click Here To Buy Now
            </span>
          </button>
          
          {/* Add CSS animations */}
          <style>{`
            @keyframes bling-pulse-buy {
              0%, 100% {
                transform: scale(1);
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 255, 255, 0.3);
              }
              50% {
                transform: scale(1.05);
                box-shadow: 0 0 30px rgba(0, 0, 0, 1), 0 0 60px rgba(255, 255, 255, 0.6);
              }
            }
          `}</style>
        </div>
      </div>
    </>
  );
};
