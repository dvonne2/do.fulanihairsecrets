import { useState, useEffect } from 'react';

interface NavigationProps {
  viewerCount: number;
}

export const Navigation = ({ viewerCount }: NavigationProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Trust Bar */}
      <div style={{
        background: '#000',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        flexWrap: 'wrap',
      }}>
        <span style={{
          color: '#fff',
          fontSize: '12px',
          fontWeight: '600',
          fontFamily: 'Montserrat, sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap',
        }}>
          ♥ 1000+ Happy Customers
        </span>
        <span style={{
          color: '#fff',
          fontSize: '12px',
          fontWeight: '600',
          fontFamily: 'Montserrat, sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap',
        }}>
          🚚 Payment On Delivery
        </span>
        <span style={{
          color: '#fff',
          fontSize: 'clamp(12px, 2.5vw, 16px)',
          fontWeight: '700',
          fontFamily: 'Arvo, serif',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'normal',
          flexWrap: 'wrap',
        }}>
          🛡 Money-Back Guarantee
        </span>
      </div>
      {/* Main Nav */}
      <div className="bg-background/95 border-b-2 border-gold/50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full gold-gradient flex items-center justify-center">
              <span className="font-cinzel text-background font-bold text-sm md:text-lg">F</span>
            </div>
            <div>
              <div className="font-cinzel text-base md:text-2xl tracking-widest">
                <span className="text-foreground">FULANI</span>
                <span className="animate-shimmer ml-1">HAIR GRO™</span>
              </div>
              <p className="font-sans text-[10px] md:text-xs text-gold tracking-widest hidden sm:block">Est. 1625 · Maiduguri, Nigeria</p>
            </div>
          </div>
          
          {/* Right Side */}
          <div className="flex items-center gap-2 md:gap-6">
            {/* Live Viewers */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/20 border border-destructive/50">
              <span className="w-2 h-2 rounded-full bg-destructive animate-pulse"></span>
              <span className="font-sans text-xs text-white">{viewerCount} people viewing</span>
            </div>
            
            {/* CTA Button */}
            <a 
              href="#order-form" 
              data-form-cta="true"
              className="bg-gradient-to-r from-[#5ec239] to-[#4cae4e] text-white px-4 md:px-8 py-2 md:py-3 btn-luxury font-sans text-xs tracking-widest font-bold rounded-lg cta-with-arrow"
            >
              👑 Order Now
              <span className="arrow-indicator"></span>
            </a>
          </div>
        </div>
      </div>
      </div>
    </nav>
  );
};
