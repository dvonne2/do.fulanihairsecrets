import { useState, useEffect } from 'react';

interface NavigationProps {
  viewerCount: number;
}

export const Navigation = ({ viewerCount }: NavigationProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b-2 border-gold/50">
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
              <p className="font-sans text-[10px] md:text-xs text-gold/60 tracking-widest hidden sm:block">Est. 1625 · Maiduguri, Nigeria</p>
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
              className="gold-gradient text-background px-4 md:px-8 py-2 md:py-3 btn-luxury font-sans text-xs tracking-widest font-bold rounded-lg"
            >
              👑 Order Now
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
