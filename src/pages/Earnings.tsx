import { useEffect, useState } from 'react';
import { apiCall } from '@/lib/api';
import { Loader2, TrendingUp, ShieldAlert, BarChart3, PackageCheck, Banknote, Percent } from 'lucide-react';

interface Earnings {
  total_earned: number;
  pending_amount: number;
  paid_amount: number;
  blocked_amount: number;
  period_label: string;
  orders_delivered: number;
  orders_paid: number;
  conversion_rate: number;
}

export default function Earnings() {
  const [data, setData] = useState<Earnings | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'w' | 'm' | 'all'>('w');

  useEffect(() => {
    setLoading(true);
    (async () => {
      const result = await apiCall<Earnings>(
        'vitalvida.api.media_buyer.get_mb_earnings',
        { period },
        { httpMethod: 'GET' }
      );
      if (result.ok && result.data) setData(result.data);
      setLoading(false);
    })();
  }, [period]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-gold">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-cinzel tracking-widest uppercase text-sm">Calculating...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 text-white">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark font-bold tracking-wider mb-2">
            Earnings Report
          </h1>
          <p className="text-gray-400 font-sans text-sm">
            Financial breakdown for {data.period_label}
          </p>
        </div>

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as any)}
          className="px-6 py-3 bg-black/60 border border-gold/30 rounded-xl text-white font-sans focus:outline-none focus:border-gold appearance-none cursor-pointer backdrop-blur-md"
        >
          <option value="w">This Week</option>
          <option value="m">This Month</option>
          <option value="all">All Time</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card label="Total Earned" amount={data.total_earned} subtitle={data.period_label} icon={<TrendingUp className="w-5 h-5" />} />
        <Card label="Pending Approval" amount={data.pending_amount} subtitle="Awaiting weekly batch" color="yellow" icon={<ClockIcon className="w-5 h-5" />} />
        <Card label="Paid Out" amount={data.paid_amount} subtitle="Deposited to your bank" color="green" icon={<Banknote className="w-5 h-5" />} />
      </div>

      {data.blocked_amount > 0 && (
        <div className="mt-8 bg-red-950/40 border border-red-500/50 p-6 rounded-2xl flex items-start gap-4 backdrop-blur-md animate-pulse-red">
          <ShieldAlert className="w-8 h-8 text-red-400 flex-shrink-0" />
          <div>
            <h3 className="font-cinzel text-red-200 text-lg mb-1">Funds Blocked</h3>
            <p className="text-red-300/80 font-sans text-sm">
              <strong className="text-white">₦{data.blocked_amount.toLocaleString()}</strong> has been flagged by our fraud detection system. 
              Please contact your affiliate manager on WhatsApp to resolve this immediately.
            </p>
          </div>
        </div>
      )}

      <div className="mt-12">
        <h2 className="font-cinzel text-2xl text-white mb-6 flex items-center gap-3">
          <BarChart3 className="text-gold w-6 h-6" />
          Performance Metrics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label="Orders Delivered" value={data.orders_delivered.toString()} icon={<PackageCheck className="w-6 h-6 text-blue-400" />} />
          <StatCard label="Orders Paid" value={data.orders_paid.toString()} icon={<Banknote className="w-6 h-6 text-green-400" />} />
          <StatCard label="Conversion Rate" value={`${data.conversion_rate}%`} icon={<Percent className="w-6 h-6 text-purple-400" />} />
        </div>
      </div>
    </div>
  );
}

function Card({ label, amount, subtitle, color = 'gold', icon }: { label: string; amount: number; subtitle: string; color?: string; icon: React.ReactNode }) {
  const isGreen = color === 'green';
  const isYellow = color === 'yellow';
  
  return (
    <div className={`relative overflow-hidden rounded-3xl p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 ${
      isGreen ? 'bg-green-950/20 border-green-500/20 hover:border-green-500/40' : 
      isYellow ? 'bg-yellow-950/20 border-yellow-500/20 hover:border-yellow-500/40' : 
      'bg-black/60 border-gold/30 hover:border-gold/60'
    } border`}>
      
      <div className="flex justify-between items-start mb-4">
        <p className="text-gray-400 font-sans uppercase tracking-widest text-xs">{label}</p>
        <div className={isGreen ? 'text-green-500' : isYellow ? 'text-yellow-500' : 'text-gold'}>
          {icon}
        </div>
      </div>
      
      <p className="text-4xl font-cinzel text-white mb-2">
        <span className="text-2xl mr-1 text-gray-400">₦</span>
        {amount.toLocaleString()}
      </p>
      
      <div className="text-xs font-sans text-gray-500">{subtitle}</div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-6">
      <div className="bg-black/50 p-4 rounded-xl border border-white/5">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-cinzel text-white mb-1">{value}</div>
        <div className="text-sm font-sans uppercase tracking-widest text-gray-400 text-xs">{label}</div>
      </div>
    </div>
  );
}

function ClockIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
