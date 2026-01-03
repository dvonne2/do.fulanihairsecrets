interface UrgencyBannerProps {
  countdown: { hours: number; minutes: number; seconds: number };
}

export const UrgencyBanner = ({ countdown }: UrgencyBannerProps) => {
  return (
    <div className="relative md:fixed md:top-0 md:left-0 md:right-0 z-40 bg-gradient-to-r from-destructive via-red-500 to-destructive py-2.5 text-center">
      <div className="max-w-7xl mx-auto px-3">
        <p className="font-sans text-xs md:text-sm text-foreground leading-snug md:leading-tight">
          🔥 <span className="font-bold">PROMO ENDS MIDNIGHT:</span>{' '}
          <span className="font-mono font-bold">
            {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
          </span>{' '}
          left to lock in <span className="font-bold">Buy 2, Get 1 FREE</span>
        </p>

        <div className="mt-1 space-y-0.5 text-[10px] md:text-xs font-sans font-semibold text-white/95">
          <div>A 400-year-old Fulani family secret, passed down since 1625</div>
          <div>Trusted by 10,000+ Nigerian women</div>
        </div>
      </div>
    </div>
  );
};
