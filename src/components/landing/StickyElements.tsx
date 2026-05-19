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
            background: 'linear-gradient(135deg, #6F22F2 0%, #4B16C9 100%)',
            padding: isMobile ? '8px 12px' : '14px 24px',
            paddingBottom: isMobile 
              ? 'max(8px, env(safe-area-inset-bottom))' 
              : 'max(14px, env(safe-area-inset-bottom))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: isMobile ? '10px' : '28px',
            boxShadow: '0 -6px 24px rgba(76, 29, 149, 0.35)',
            minHeight: isMobile ? '64px' : '92px',
            borderTopLeftRadius: isMobile ? 0 : '18px',
            borderTopRightRadius: isMobile ? 0 : '18px',
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: '800',
            fontSize: isMobile ? '11px' : '14px',
            lineHeight: '1',
            flex: '0 0 auto'
          }}>
            <div style={{
              fontSize: isMobile ? '30px' : '44px',
              fontWeight: '900',
              lineHeight: '0.8',
              letterSpacing: '-4px'
            }}>K</div>
            <div>klump</div>
          </div>

          <div style={{
            width: '1px',
            alignSelf: 'stretch',
            background: 'rgba(255,255,255,0.28)'
          }} />

          <div style={{ 
            flex: '1.2', 
            minWidth: 0
          }}>
            <div style={{
              fontSize: isMobile ? '12px' : '18px',
              fontWeight: '800',
              color: '#FFFFFF',
              fontFamily: 'Montserrat, sans-serif',
              lineHeight: '1.2',
              letterSpacing: '0.2px',
              textTransform: 'uppercase'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '2px'
              }}>
                <span style={{
                  fontSize: isMobile ? '12px' : '14px',
                  fontWeight: '800'
                }}>FULANI HAIR GRO BUNDLE</span>
                <span style={{
                  fontSize: isMobile ? '13px' : '22px',
                  fontWeight: '800',
                  textTransform: 'none'
                }}>Pay Small Small with <span style={{ color: '#FFD21F' }}>Klump</span></span>
              </div>
            </div>
          </div>

          <div style={{
            width: '1px',
            alignSelf: 'stretch',
            background: 'rgba(255,255,255,0.28)'
          }} />

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '2px',
            color: '#FFFFFF',
            fontFamily: 'Montserrat, sans-serif',
            flex: '0 0 auto'
          }}>
            <span style={{ fontSize: isMobile ? '10px' : '14px', fontWeight: '700' }}>From as low as</span>
            <span style={{ fontSize: isMobile ? '18px' : '30px', fontWeight: '900', color: '#FFD21F', lineHeight: '1' }}>₦16,687<span style={{ fontSize: isMobile ? '11px' : '18px', color: '#FFD21F' }}>/mo</span></span>
          </div>

          {!isMobile && (
            <>
              <div style={{
                width: '1px',
                alignSelf: 'stretch',
                background: 'rgba(255,255,255,0.28)'
              }} />

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#FFFFFF',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '14px',
                fontWeight: '700',
                lineHeight: '1.2'
              }}>
                <span style={{ fontSize: '28px' }}>🛡</span>
                <span>Interest-free<br />plans available</span>
              </div>
            </>
          )}

          <button
            onClick={scrollToOrderForm}
            data-form-cta="true"
            className="relative overflow-hidden"
            style={{
              flex: isMobile ? '0 0 auto' : '0 0 auto',
              background: '#FFD21F',
              color: '#111111',
              border: 'none',
              borderRadius: isMobile ? '18px' : '999px',
              padding: isMobile ? '10px 14px' : '16px 28px',
              fontSize: isMobile ? '13px' : '18px',
              fontWeight: '800',
              fontFamily: 'Montserrat, sans-serif',
              cursor: 'pointer',
              lineHeight: '1.1',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              minHeight: isMobile ? '36px' : '40px',
              minWidth: isMobile ? '92px' : '140px',
              WebkitTapHighlightColor: 'transparent',
              transition: 'background 0.3s ease, color 0.3s ease',
              animation: isMobile ? 'bling-pulse-buy-mobile 2s ease-in-out infinite' : 'bling-pulse-buy 2s ease-in-out infinite',
              boxShadow: '0 0 20px rgba(255, 210, 31, 0.35)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FFE766';
              e.currentTarget.style.color = '#111111';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#FFD21F';
              e.currentTarget.style.color = '#111111';
            }}
          >
            {/* Clean text without sparkles */}
            <span className="relative z-10" style={{
              fontSize: isMobile ? '12px' : 'inherit',
              display: 'block',
              textAlign: 'center'
            }}>
              {isMobile ? 'Buy Now' : 'Buy Now ❯'}
            </span>
          </button>
          
          {/* Add CSS animations */}
          <style>{`
            @keyframes bling-pulse-buy {
              0%, 100% {
                transform: scale(1);
                opacity: 1;
              }
              50% {
                transform: scale(1.05);
                opacity: 0.9;
              }
            }
            @keyframes bling-pulse-buy-mobile {
              0%, 100% {
                transform: scale(1);
                opacity: 1;
              }
              50% {
                transform: scale(1.03);
                opacity: 0.9;
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
