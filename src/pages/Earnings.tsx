import { useEffect, useState } from 'react';
import { apiCall } from '@/lib/api';
import { Loader2, TrendingUp, ShieldAlert, BarChart3, PackageCheck, Banknote, Percent, Filter } from 'lucide-react';
import PortalLayout from '@/components/PortalLayout';

interface EarningsData {
  total_earned: number;
  pending_amount: number;
  paid_amount: number;
  blocked_amount: number;
  period_label: string;
  orders_delivered: number;
  orders_paid: number;
  conversion_rate: number;
}

function AnimatedAmount({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const safeTarget = typeof target === 'number' && !isNaN(target) ? target : 0;
  useEffect(() => {
    if (safeTarget <= 0) { setCount(0); return; }
    const duration = 1000;
    const steps = 30;
    const increment = safeTarget / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= safeTarget) {
        setCount(safeTarget);
        clearInterval(timer);
      } else {
        setCount(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [safeTarget]);
  return <>{count.toLocaleString()}</>;
}

export default function Earnings() {
  const [data, setData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'w' | 'm' | 'all'>('all');

  useEffect(() => {
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const result = await apiCall<EarningsData>(
          'vitalvida.api.media_buyer.get_mb_earnings',
          { period },
          { httpMethod: 'GET' }
        );
        if (result.ok && result.data) {
          setData(result.data);
        } else {
          setError(result.error || 'Could not load earnings data');
        }
      } catch (e: any) {
        setError(e?.message || 'Unexpected error loading earnings');
      }
      setLoading(false);
    })();
  }, [period]);

  if (loading) {
    return (
      <PortalLayout>
        <div className="min-h-[80vh] flex flex-col items-center justify-center">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-[#d4af37]/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#d4af37] animate-spin" />
          </div>
          <p className="font-cinzel tracking-[0.2em] uppercase text-[11px] text-white/40">Calculating Earnings</p>
        </div>
      </PortalLayout>
    );
  }

  if (error || !data) {
    return (
      <PortalLayout>
        <div className="p-5 md:p-8 lg:p-10 max-w-5xl mx-auto">
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-5">
              <TrendingUp className="w-8 h-8 text-white/10" />
            </div>
            <h3 className="font-cinzel text-xl text-white mb-2">No Earnings Data</h3>
            <p className="text-white/30 font-sans text-sm max-w-sm mx-auto mb-6">
              {error || 'Earnings data will appear here once your orders are processed.'}
            </p>
            <button onClick={() => setPeriod('all')} className="text-[#d4af37]/60 hover:text-[#d4af37] font-sans text-sm border-b border-[#d4af37]/20 pb-0.5 transition-colors">
              Refresh
            </button>
          </div>
        </div>
      </PortalLayout>
    );
  }

  const cards = [
    { label: 'Total Earned', amount: data.total_earned || 0, subtitle: data.period_label || 'All Time', icon: TrendingUp, accent: '#d4af37' },
    { label: 'Pending Approval', amount: data.pending_amount || 0, subtitle: 'Awaiting weekly batch', icon: Loader2, accent: '#f59e0b' },
    { label: 'Paid Out', amount: data.paid_amount || 0, subtitle: 'Deposited to your bank', icon: Banknote, accent: '#34d399' },
  ];

  const metrics = [
    { label: 'Orders Delivered', value: String(data.orders_delivered || 0), icon: PackageCheck, accent: '#60a5fa' },
    { label: 'Orders Paid', value: String(data.orders_paid || 0), icon: Banknote, accent: '#34d399' },
    { label: 'Conversion Rate', value: `${data.conversion_rate || 0}%`, icon: Percent, accent: '#a78bfa' },
  ];

  return (
    <PortalLayout>
      <div className="p-5 md:p-8 lg:p-10 max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-cinzel text-white font-bold tracking-wider mb-1.5">
              Earnings Report
            </h1>
            <p className="text-white/30 font-sans text-sm">
              Financial breakdown for <span className="text-white/50">{data.period_label || 'All Time'}</span>
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Filter className="w-3.5 h-3.5 text-[#d4af37]/50" />
            </div>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              className="pl-9 pr-6 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm font-sans focus:outline-none focus:border-[#d4af37]/30 appearance-none cursor-pointer"
            >
              <option value="w">This Week</option>
              <option value="m">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        {/* Revenue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map(({ label, amount, subtitle, icon: Icon, accent }) => (
            <div key={label} className="relative rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 hover:border-white/[0.12] transition-all duration-500 group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${accent}10 0%, transparent 70%)` }} />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-white/25 font-sans uppercase tracking-[0.15em] text-[10px]">{label}</p>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300"
                    style={{ backgroundColor: `${accent}10` }}>
                    <Icon className="w-4 h-4" style={{ color: accent }} />
                  </div>
                </div>
                <p className="text-3xl font-cinzel text-white mb-1.5">
                  <span className="text-lg mr-0.5 text-white/30">₦</span>
                  <AnimatedAmount target={amount} />
                </p>
                <p className="text-[11px] font-sans text-white/20">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Blocked funds warning */}
        {(data.blocked_amount || 0) > 0 && (
          <div className="bg-red-500/5 border border-red-500/15 p-5 rounded-2xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="font-cinzel text-red-200 text-sm mb-1">Funds Blocked</h3>
              <p className="text-red-300/50 font-sans text-xs leading-relaxed">
                <strong className="text-white">₦{(data.blocked_amount || 0).toLocaleString()}</strong> has been flagged.
                Contact your affiliate manager on WhatsApp.
              </p>
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[#d4af37]/10 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-[#d4af37]" />
            </div>
            <h2 className="font-cinzel text-lg text-white">Performance Metrics</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metrics.map(({ label, value, icon: Icon, accent }) => (
              <div key={label} className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 flex items-center gap-4 hover:border-white/[0.1] transition-colors duration-300">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${accent}10` }}>
                  <Icon className="w-5 h-5" style={{ color: accent }} />
                </div>
                <div>
                  <div className="text-xl font-cinzel text-white">{value}</div>
                  <div className="text-[10px] font-sans uppercase tracking-[0.15em] text-white/25 mt-0.5">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
