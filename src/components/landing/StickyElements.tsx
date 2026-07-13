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
      </div>
    </>
  );
});
