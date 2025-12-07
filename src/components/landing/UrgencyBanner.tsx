interface UrgencyBannerProps {
  countdown: { hours: number; minutes: number; seconds: number };
}

export const UrgencyBanner = ({ countdown }: UrgencyBannerProps) => {
  return (
    <div className="fixed top-16 md:top-20 left-0 right-0 z-40 bg-gradient-to-r from-destructive via-red-500 to-destructive py-2 text-center animate-pulse">
      <p className="font-sans text-xs text-foreground px-4">
        🔥 <span className="font-bold">WARNING:</span> Price increases to ₦89,000 in{' '}
        <span className="font-mono font-bold">
          {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
        </span>{' '}
        — Lock in ₦66,750 NOW!
      </p>
    </div>
  );
};
