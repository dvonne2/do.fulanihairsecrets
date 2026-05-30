import { useEffect, useState } from 'react';
import { apiCall } from '@/lib/api';

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

  if (loading) return <div className="p-8">Loading...</div>;
  if (!data) return <div className="p-8">No earnings data</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Earnings</h1>
        <select value={period} onChange={(e) => setPeriod(e.target.value as any)} className="border rounded px-3 py-2">
          <option value="w">This Week</option>
          <option value="m">This Month</option>
          <option value="all">All Time</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card label="Total Earned" amount={data.total_earned} subtitle={data.period_label} />
        <Card label="Pending" amount={data.pending_amount} subtitle="Awaiting batch approval" color="yellow" />
        <Card label="Paid Out" amount={data.paid_amount} subtitle="Already in your bank" color="green" />
      </div>

      {data.blocked_amount > 0 && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-800 p-4 rounded">
          <strong>₦{data.blocked_amount.toLocaleString()}</strong> is blocked due to fraud flags. Contact support.
        </div>
      )}

      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
        <Stat label="Delivered" value={data.orders_delivered.toString()} />
        <Stat label="Paid" value={data.orders_paid.toString()} />
        <Stat label="Conversion" value={`${data.conversion_rate}%`} />
      </div>
    </div>
  );
}

function Card({ label, amount, subtitle, color = 'gold' }: { label: string; amount: number; subtitle: string; color?: string }) {
  return (
    <div className={`border rounded-lg p-6 ${color === 'green' ? 'bg-green-50' : color === 'yellow' ? 'bg-yellow-50' : 'bg-white'}`}>
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-3xl font-bold mt-1">₦{amount.toLocaleString()}</div>
      <div className="text-xs text-gray-500 mt-2">{subtitle}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}
