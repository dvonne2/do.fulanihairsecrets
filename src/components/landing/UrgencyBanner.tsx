interface UrgencyBannerProps {
  countdown: { hours: number; minutes: number; seconds: number };
}

export const UrgencyBanner = ({ countdown }: UrgencyBannerProps) => {
  return (
    <div className="relative md:fixed md:top-0 md:left-0 md:right-0 z-40 bg-gradient-to-r from-[#B80F66] via-[#FF69B4] to-[#B80F66] py-2.5 text-center">
      <div className="max-w-7xl mx-auto px-3">
        <p className="font-sans text-xs md:text-sm text-white leading-snug md:leading-tight">
          ⚡ <span className="font-bold">HURRY!</span> ⚡
        </p>

        <div className="mt-1 space-y-0.5 text-[10px] md:text-xs font-sans font-semibold text-white/95">
          <div>Get ready for stunning, longer hair edges!</div>
        </div>
      </div>
    </div>
  );
};
