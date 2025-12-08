import { AlertTriangle } from 'lucide-react';

interface LimitedStockWarningProps {
  stockCount: number;
}

export const LimitedStockWarning = ({ stockCount }: LimitedStockWarningProps) => {
  const batchNumber = 47;
  const totalInBatch = 150;
  const percentRemaining = Math.round((stockCount / totalInBatch) * 100);

  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      {/* Warning gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-destructive/5 via-background to-gold/5" />

      <div className="max-w-4xl mx-auto px-6 md:px-8 relative z-10">
        {/* Warning header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <AlertTriangle className="w-6 h-6 text-destructive animate-pulse" />
          <h2 className="font-sans text-sm md:text-base font-bold tracking-[0.2em] uppercase text-destructive">
            Extremely Limited Stock
          </h2>
          <AlertTriangle className="w-6 h-6 text-destructive animate-pulse" />
        </div>

        {/* Decorative line */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-destructive/40 to-transparent mb-8" />

        {/* Explanation text */}
        <div className="space-y-4 font-serif text-lg text-foreground/90 leading-relaxed text-center mb-10">
          <p>
            Because the herbs must be <span className="text-gold font-semibold">hand-selected and infused slowly</span>
            <br className="hidden md:block" />
            (the same way my grandmother taught me), only a small batch is ever ready at a time.
          </p>
          <p>
            Once a batch finishes, <span className="text-destructive font-semibold">the next one takes weeks.</span>
          </p>
          <p>
            This is why you don't see Fulani Hair Gro™ everywhere—
            <br className="hidden md:block" />
            <span className="text-gold italic">because it cannot be mass-produced.</span>
          </p>
        </div>

        {/* Batch status card */}
        <div className="bg-card border-2 border-gold/30 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🫙</span>
            <h3 className="font-cinzel text-xl md:text-2xl text-gold">Current Batch Status:</h3>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="h-4 bg-muted rounded-full overflow-hidden border border-gold/20">
              <div 
                className="h-full bg-gradient-to-r from-gold via-gold/80 to-destructive transition-all duration-1000 ease-out rounded-full relative"
                style={{ width: `${percentRemaining}%` }}
              >
                {/* Animated shine */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" />
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-muted-foreground">0</span>
              <span className="text-gold font-bold text-lg">{stockCount} jars remaining</span>
              <span className="text-muted-foreground">{totalInBatch}</span>
            </div>
          </div>

          {/* Batch details */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-gold">Batch #{batchNumber}</span>
              <span>·</span>
              <span>Hand-prepared December 2025</span>
            </div>
            <div className="text-destructive font-semibold">
              Next batch ready: Late January 2026
            </div>
          </div>
        </div>

        {/* Authenticity note */}
        <p className="text-center text-muted-foreground text-sm mt-6 italic">
          Each jar is numbered. Your jar number will be included with your order as proof of authenticity.
        </p>
      </div>
    </section>
  );
};
