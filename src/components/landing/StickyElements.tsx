import { useState, useEffect, memo } from 'react';

interface StickyElementsProps {
  showStickyBar: boolean;
  viewerCount: number;
  stockCount: number;
  showPurchaseNotif: boolean;
  currentNotif: { name: string; location: string; product: string; time: string };
  scrollProgress: number;
}

export const StickyElements = memo(({
  scrollProgress
}: StickyElementsProps) => {
  const [visible, setVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const form = document.getElementById('order-form');
    if (!form) return;

    // Use IntersectionObserver to detect when order form enters viewport
    // instead of querying getBoundingClientRect on every scroll event
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0.05, rootMargin: '0px' }
    );

    observer.observe(form);
    return () => observer.disconnect();
  }, [mounted]);

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
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            padding: isMobile ? '12px 16px' : '16px 24px',
            paddingBottom: isMobile 
              ? 'max(12px, env(safe-area-inset-bottom))' 
              : 'max(16px, env(safe-area-inset-bottom))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: isMobile ? '12px' : '24px',
            boxShadow: '0 -4px 20px rgba(16, 185, 129, 0.3)',
          }}
        >
          <div style={{ 
            flex: 1, 
            minWidth: 0
          }}>
            <div style={{
              fontSize: isMobile ? '14px' : '18px',
              fontWeight: '700',
              color: '#FFFFFF',
              fontFamily: 'Montserrat, sans-serif',
              lineHeight: '1.3',
              marginBottom: isMobile ? '4px' : '6px'
            }}>
              Get Your Hair Growth Bundle Today
            </div>
            <div style={{
              fontSize: isMobile ? '12px' : '14px',
              color: 'rgba(255, 255, 255, 0.9)',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: '500'
            }}>
              Limited stock available • Free delivery on orders paid before delivery
            </div>
          </div>

          <a
            href="#order-form"
            style={{
              background: '#FFD21F',
              color: '#1a1a1a',
              padding: isMobile ? '10px 20px' : '12px 28px',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: isMobile ? '14px' : '16px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              fontFamily: 'Montserrat, sans-serif',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
            }}
          >
            Buy Now
          </a>
        </div>

        <a
          href="https://wa.me/2348101594734?text=Hi%2C%20I%20need%20help%20with%20my%20order"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'absolute',
            top: isMobile ? '-56px' : '-64px',
            right: '16px',
            background: '#25D366',
            color: '#ffffff',
            padding: isMobile ? '10px 16px' : '12px 20px',
            borderRadius: '9999px',
            fontWeight: '700',
            fontSize: isMobile ? '13px' : '15px',
            textDecoration: 'none',
            fontFamily: 'Montserrat, sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            zIndex: 10000,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.6 6.32A7.85 7.85 0 0 0 12 4a7.94 7.94 0 0 0-7.93 7.93c0 1.4.37 2.76 1.06 3.97l-1.13 4.13 4.23-1.1A7.93 7.93 0 0 0 20 11.93a7.85 7.85 0 0 0-2.4-5.61zm-5.6 12.23a6.56 6.56 0 0 1-3.34-.92l-.24-.14-2.5.65.67-2.43-.16-.26a6.57 6.57 0 0 1 5.57-10.02 6.57 6.57 0 0 1 6.57 6.57 6.57 6.57 0 0 1-5.57 6.55z"/>
            <path d="M14.25 13.18c-.2-.11-1.18-.58-1.36-.65-.18-.06-.32-.09-.45.09-.13.18-.5.65-.61.78-.11.13-.23.15-.42.05-.2-.11-.82-.3-1.56-.96a5.85 5.85 0 0 1-1.08-1.34c-.11-.2 0-.3.08-.4.09-.09.2-.23.3-.35.1-.11.13-.18.2-.3.06-.11.03-.21-.02-.3-.05-.08-.45-1.08-.62-1.48-.16-.39-.33-.34-.45-.35l-.38-.01c-.13 0-.35.05-.53.24-.18.2-.69.67-.69 1.64 0 .96.7 1.9.8 2.03.1.13 1.38 2.11 3.35 2.96.47.2.83.32 1.12.41.47.15.9.13 1.23.08.38-.06 1.18-.48 1.35-.95.16-.46.16-.86.11-.95-.04-.08-.15-.13-.35-.24z"/>
          </svg>
          WhatsApp
        </a>
      </div>
    </>
  );
});
