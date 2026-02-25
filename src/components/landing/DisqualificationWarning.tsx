import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DisqualificationWarningProps {
  stockCount: number;
}

export const DisqualificationWarning = ({ stockCount }: DisqualificationWarningProps) => {
  const scrollToOrderForm = () => {
    const el = document.getElementById('order-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Warning card */}
        <div className="bg-white border-2 border-red-400/60 rounded-2xl p-6 md:p-10 shadow-sm">
          {/* Warning header */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-destructive animate-pulse" />
            <h2 className="font-sans text-lg md:text-xl font-bold tracking-widest uppercase text-destructive">
              Important Notice
            </h2>
            <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-destructive animate-pulse" />
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-destructive/40 mb-8" />

          {/* Main warning content */}
          <div className="text-center space-y-6">
            <h3 className="font-sans text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
              <span className="text-[#B80F66]">Fulani Hair Gro™</span> Is For Women With...
            </h3>
            
            <p className="font-serif text-xl md:text-2xl text-gray-800">
              <span className="text-destructive font-semibold">Serious Hair Loss</span> Who Want Real Results
            </p>
            
            <p className="font-serif text-lg text-muted-foreground">
              Our potent Maiduguri formula delivers <span className="text-[#B80F66] font-semibold">MAXIMUM STRENGTH</span> hair restoration.
            </p>

            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 md:p-6">
              <p className="font-serif text-gray-800">
                We currently have <span className="text-[#B80F66] font-bold">{stockCount} bundles</span> remaining from this batch.
                <br />
                <span className="text-[#B80F66] font-semibold">Order now before they sell out!</span>
              </p>
            </div>

            {/* Symptoms grid */}
            <div className="mt-8 text-left">
              <h3 className="font-sans text-lg md:text-xl font-bold text-[#B80F66] text-center mb-4">
                Reverse It Quick... Here Are Some Symptoms You Might Experience!
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-lg md:text-xl text-gray-800">
                {[
                  'Excessive hair shedding',
                  'Thinning hair',
                  'Receding hairline',
                  'Bald patches',
                  'Widening part',
                  'Miniaturized hair',
                  'Scalp visibility',
                  'Hair breakage',
                  'Itchy scalp',
                  'Scalp tenderness',
                  'Excessive dandruff',
                  'Changes in hair texture',
                  'Slowed hair growth',
                  'Loose hair strands',
                  'Hair loss on other body parts',
                  'Emotional distress',
                ].map((symptom) => (
                  <div key={symptom} className="flex items-start gap-2">
                    <span className="mt-[2px] text-destructive">•</span>
                    <span className="font-serif">{symptom}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
