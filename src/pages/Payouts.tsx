import { useEffect, useState } from 'react';
import { apiCall } from '@/lib/api';
import { Loader2, Wallet, Calendar, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import PortalLayout from '@/components/PortalLayout';

interface Payout {
  batch_name: string;
  status: string;
  amount: number;
  paid_at: string | null;
  payment_reference: string | null;
  week_start: string;
  week_end: string;
}

export default function Payouts() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const result = await apiCall<{ payouts: Payout[] }>(
        'vitalvida.api.media_buyer.get_mb_payouts',
        undefined,
        { httpMethod: 'GET' }
      );
      if (result.ok && result.data) setPayouts(result.data.payouts || []);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <PortalLayout>
        <div className="min-h-[80vh] flex flex-col items-center justify-center">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-[#d4af37]/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#d4af37] animate-spin" />
          </div>
          <p className="font-cinzel tracking-[0.2em] uppercase text-[11px] text-white/40">Loading Payouts</p>
        </div>
      </PortalLayout>
    );
  }

  const statusStyles: Record<string, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
    'Paid': { bg: 'bg-emerald-500/8 border-emerald-500/15', text: 'text-emerald-400', icon: CheckCircle2 },
    'Approved': { bg: 'bg-blue-500/8 border-blue-500/15', text: 'text-blue-400', icon: ArrowRight },
    'default': { bg: 'bg-amber-500/8 border-amber-500/15', text: 'text-amber-400', icon: Clock },
  };

  return (
    <PortalLayout>
      <div className="p-5 md:p-8 lg:p-10 max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-[#d4af37]/10 flex items-center justify-center">
              <Wallet className="w-4.5 h-4.5 text-[#d4af37]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-cinzel text-white font-bold tracking-wider">
              Payout History
            </h1>
          </div>
          <p className="text-white/30 font-sans text-sm ml-12">
            Weekly batches generated every Monday for Delivered & Paid orders.
          </p>
        </div>

        {payouts.length === 0 ? (
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-5">
              <Wallet className="w-8 h-8 text-white/10" />
            </div>
            <h3 className="font-cinzel text-xl text-white mb-2">No Payouts Yet</h3>
            <p className="text-white/30 font-sans text-sm max-w-sm mx-auto">
              Once your attributed orders are marked as Delivered and Paid, they will be batched here for your weekly payout.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {payouts.map((p, i) => {
              const cfg = statusStyles[p.status] || statusStyles['default'];
              const StatusIcon = cfg.icon;
              return (
                <div key={p.batch_name} className="relative rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 md:p-7 hover:border-white/[0.1] transition-all duration-300 group overflow-hidden">
                  {/* Timeline connector */}
                  {i < payouts.length - 1 && (
                    <div className="hidden md:block absolute left-[43px] bottom-0 w-px h-3 bg-white/[0.06] translate-y-full z-10" />
                  )}

                  {/* Hover glow */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(circle,rgba(212,175,55,0.03)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                    {/* Left: Batch info */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[#d4af37]/50 flex-shrink-0">
                        <Calendar className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="font-cinzel text-base text-white mb-1">{p.batch_name}</div>
                        <div className="text-xs font-sans tracking-wider text-white/30">
                          {p.week_start} <span className="text-white/10 mx-1">→</span> {p.week_end}
                        </div>
                        {p.paid_at && (
                          <div className="mt-2.5 text-xs font-sans text-white/25 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500/60" />
                            Deposited {p.paid_at}
                            {p.payment_reference && (
                              <span className="text-white/15 ml-1 font-mono text-[10px]">Ref: {p.payment_reference}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Amount & Status */}
                    <div className="text-left md:text-right w-full md:w-auto border-t border-white/[0.04] md:border-t-0 pt-4 md:pt-0">
                      <div className="text-2xl font-cinzel text-white mb-2.5">
                        <span className="text-base mr-0.5 text-white/30">₦</span>
                        {p.amount.toLocaleString()}
                      </div>
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold font-sans tracking-[0.1em] uppercase px-3 py-1.5 rounded-full border ${cfg.bg} ${cfg.text}`}>
                        <StatusIcon className="w-3 h-3" />
                        {p.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
