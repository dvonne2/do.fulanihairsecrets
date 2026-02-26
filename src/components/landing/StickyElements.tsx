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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
            background: '#5ec239',
            padding: isMobile ? '8px 12px' : '10px 16px',
            paddingBottom: isMobile 
              ? 'max(8px, env(safe-area-inset-bottom))' 
              : 'max(10px, env(safe-area-inset-bottom))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: isMobile ? '8px' : '10px',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.25)',
            minHeight: isMobile ? '60px' : '70px',
          }}
        >
          {/* Left: Title + subtitle */}
          <div style={{ 
            flex: '1', 
            minWidth: 0,
            paddingRight: isMobile ? '8px' : '0'
          }}>
            <div style={{
              fontSize: isMobile ? '16px' : '20px',
              fontWeight: '700',
              color: '#FFFFFF',
              fontFamily: 'Montserrat, sans-serif',
              lineHeight: '1.2',
              letterSpacing: '0.3px',
              textTransform: 'uppercase',
              marginBottom: isMobile ? '2px' : '0'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'center',
                gap: isMobile ? '2px' : '4px'
              }}>
                <span style={{
                  fontSize: isMobile ? '14px' : 'inherit',
                  fontWeight: isMobile ? '600' : 'inherit'
                }}>Fulani</span>
                <span style={{
                  fontSize: isMobile ? '12px' : '16px',
                  fontWeight: '600'
                }}>Hair Gro Bundle</span>
              </div>
            </div>
            <div style={{
              fontSize: isMobile ? '11px' : '17px',
              fontWeight: '600',
              color: '#FFFFFF',
              fontFamily: 'Montserrat, sans-serif',
              lineHeight: '1.2',
              textTransform: 'none',
              display: 'block'
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
              flex: isMobile ? '0 0 auto' : '0 0 auto',
              background: '#000000',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: isMobile ? '16px' : '20px',
              padding: isMobile ? '8px 14px' : '10px 18px',
              fontSize: isMobile ? '14px' : '20px',
              fontWeight: '700',
              fontFamily: 'Montserrat, sans-serif',
              cursor: 'pointer',
              lineHeight: '1.1',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              minHeight: isMobile ? '36px' : '40px',
              minWidth: isMobile ? '100px' : 'auto',
              WebkitTapHighlightColor: 'transparent',
              transition: 'background 0.3s ease, color 0.3s ease',
              animation: isMobile ? 'bling-pulse-buy-mobile 2s ease-in-out infinite' : 'bling-pulse-buy 2s ease-in-out infinite',
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
            <span className="relative z-10" style={{
              fontSize: isMobile ? '12px' : 'inherit',
              display: 'block',
              textAlign: 'center'
            }}>
              {isMobile ? 'Buy Now' : 'Click Here To Buy Now'}
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
            @keyframes bling-pulse-buy-mobile {
              0%, 100% {
                transform: scale(1);
                box-shadow: 0 0 15px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 255, 255, 0.3);
              }
              50% {
                transform: scale(1.03);
                box-shadow: 0 0 20px rgba(0, 0, 0, 1), 0 0 40px rgba(255, 255, 255, 0.6);
              }
            }
            
            /* Responsive adjustments */
            @media (max-width: 767px) {
              .sticky-footer-content {
                padding: 8px 12px !important;
              }
            }
            
            @media (max-width: 480px) {
              .sticky-footer-content {
                padding: 6px 10px !important;
                min-height: 56px !important;
              }
            }
          `}</style>
        </div>
      </div>
    </>
  );
};
