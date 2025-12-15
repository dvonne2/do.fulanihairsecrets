interface UrgencyBannerProps {
  countdown: { hours: number; minutes: number; seconds: number };
}

export const UrgencyBanner = ({ countdown }: UrgencyBannerProps) => {
  return (
    <div className="fixed top-16 md:top-20 left-0 right-0 z-40 bg-gradient-to-r from-destructive via-red-500 to-destructive py-2.5 text-center">
      <p className="font-sans text-xs md:text-sm text-foreground px-4 leading-snug md:leading-tight">
        🔥 <span className="font-bold">PROMO ENDS MIDNIGHT TODAY:</span>{' '}
        <span className="font-mono font-bold">
          {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
        </span>{' '}
        left to lock in <span className="font-bold">buy 2 sets and get 1 FREE</span>.{' '}
        <span className="hidden md:inline font-semibold">
          After midnight this offer disappears.
        </span>
      </p>
    </div>
  );
};
