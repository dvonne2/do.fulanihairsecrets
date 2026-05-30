import { useEffect, useState } from 'react';
import { apiCall } from '@/lib/api';
import { Loader2, Wallet, Calendar, CheckCircle2, Clock } from 'lucide-react';

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
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-gold">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-cinzel tracking-widest uppercase text-sm">Loading History...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 text-white">
      
      <div className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-3xl md:text-4xl font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark font-bold tracking-wider mb-2 flex items-center gap-4">
          <Wallet className="w-8 h-8 text-gold" />
          Payout History
        </h1>
        <p className="text-gray-400 font-sans text-sm max-w-2xl">
          Weekly batches are automatically generated every Monday for all Delivered & Paid orders from the previous week.
        </p>
      </div>

      {payouts.length === 0 ? (
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-16 text-center shadow-[0_0_40px_rgba(212,175,55,0.05)]">
          <Wallet className="w-16 h-16 text-gold/30 mx-auto mb-6" />
          <h3 className="font-cinzel text-2xl text-white mb-2">No Payouts Yet</h3>
          <p className="text-gray-400 font-sans max-w-md mx-auto">
            Once your attributed orders are marked as Delivered and Paid by the logistics team, they will be batched here for your weekly payout.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {payouts.map((p) => (
            <div key={p.batch_name} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 hover:border-gold/30 transition-colors duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                
                {/* Batch Info */}
                <div className="flex items-start gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-gold hidden md:block">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-cinzel text-xl text-white mb-1">Batch {p.batch_name}</div>
                    <div className="text-sm font-sans tracking-widest uppercase text-gold-light">
                      {p.week_start} <span className="text-gray-500 mx-2">—</span> {p.week_end}
                    </div>
                    {p.paid_at && (
                      <div className="mt-3 text-sm font-sans text-gray-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Deposited on {p.paid_at}
                        {p.payment_reference && (
                          <span className="text-gray-600 ml-2 font-mono text-xs hidden sm:inline">(Ref: {p.payment_reference})</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Amount & Status */}
                <div className="text-left md:text-right w-full md:w-auto border-t border-white/10 md:border-t-0 pt-4 md:pt-0">
                  <div className="text-3xl font-cinzel text-white mb-3">
                    <span className="text-xl mr-1 text-gray-500">₦</span>
                    {p.amount.toLocaleString()}
                  </div>
                  <div className={`text-xs font-bold font-sans tracking-widest uppercase px-4 py-2 rounded-xl inline-flex items-center gap-2 ${
                    p.status === 'Paid' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                    p.status === 'Approved' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  }`}>
                    {p.status === 'Paid' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {p.status}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
