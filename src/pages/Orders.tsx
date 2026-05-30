import { useEffect, useState } from 'react';
import { apiCall } from '@/lib/api';
import { Loader2, Send, Clock, Search, Filter } from 'lucide-react';

interface MbOrder {
  name: string;
  customer_name: string;
  package_name: string;
  status: string;
  order_date: string;
  total: number;
  estimated_commission: number;
  attribution_locked: number;
}

interface OrdersResponse {
  orders: MbOrder[];
  total_count: number;
  period_label: string;
}

export default function Orders() {
  const [data, setData] = useState<OrdersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'w' | 'm' | 'all'>('all');
  const [nudging, setNudging] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    (async () => {
      const result = await apiCall<OrdersResponse>(
        'vitalvida.api.media_buyer.get_mb_orders',
        { period, limit: 30, offset: 0 },
        { httpMethod: 'GET' }
      );

      if (result.ok && result.data) {
        setData(result.data);
      }
      setLoading(false);
    })();
  }, [period]);

  const handleNudge = async (orderName: string) => {
    setNudging(orderName);
    const message = prompt('Optional message to the team (max 200 chars):') || '';

    const result = await apiCall<{ success: boolean; outcome: string; message?: string; error?: string }>(
      'vitalvida.api.media_buyer.nudge_team',
      { order_name: orderName, message },
      { httpMethod: 'POST' }
    );

    if (result.ok && result.data?.success) {
      alert(result.data.message || 'Team notified.');
    } else {
      alert(result.error || result.data?.error || 'Could not nudge team');
    }
    setNudging(null);
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-gold">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-cinzel tracking-widest uppercase text-sm">Fetching Data...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 text-white">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark font-bold tracking-wider mb-2">
            Attributed Orders
          </h1>
          <p className="text-gray-400 font-sans text-sm">
            {data.total_count} order{data.total_count !== 1 ? 's' : ''} captured in {data.period_label}
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Filter className="w-4 h-4 text-gold" />
          </div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="pl-10 pr-8 py-3 bg-black/60 border border-gold/30 rounded-xl text-white font-sans focus:outline-none focus:border-gold appearance-none cursor-pointer backdrop-blur-md"
          >
            <option value="w">This Week</option>
            <option value="m">This Month</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {data.orders.length === 0 ? (
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-16 text-center">
          <Clock className="w-16 h-16 text-gold/30 mx-auto mb-6" />
          <h3 className="font-cinzel text-2xl text-white mb-2">No Orders Yet</h3>
          <p className="text-gray-400 font-sans max-w-md mx-auto">
            When customers purchase using your master link, their orders will appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans">
              <thead className="bg-white/5 border-b border-white/10 uppercase tracking-widest text-xs text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-semibold">Order ID</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Commission</th>
                  <th className="px-6 py-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.orders.map((order) => (
                  <tr key={order.name} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-gold-light">{order.name}</td>
                    <td className="px-6 py-4">
                      <div className="text-white">{order.customer_name}</div>
                      <div className="text-xs text-gray-500">{order.package_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase inline-flex items-center gap-2 ${
                        order.status === 'Paid' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        order.status === 'Delivered' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${order.status === 'Paid' ? 'bg-green-400' : order.status === 'Delivered' ? 'bg-blue-400' : 'bg-yellow-400'}`} />
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-white">
                      ₦{order.estimated_commission.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {!['Delivered', 'Paid', 'Cancelled', 'Refunded'].includes(order.status) ? (
                        <button
                          onClick={() => handleNudge(order.name)}
                          disabled={nudging === order.name}
                          className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-gold/20 text-gold border border-gold/30 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-50 w-full"
                        >
                          {nudging === order.name ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Send className="w-3 h-3" />
                          )}
                          {nudging === order.name ? 'Sending...' : 'Nudge Team'}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-600 uppercase tracking-widest">Locked</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
