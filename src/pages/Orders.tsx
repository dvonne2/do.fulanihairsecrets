import { useEffect, useState } from 'react';
import { apiCall } from '@/lib/api';
import { Loader2, Send, Clock, Filter, Package, CheckCircle2 } from 'lucide-react';
import PortalLayout from '@/components/PortalLayout';

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
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);

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
      setToast({ msg: result.data.message || 'Team notified successfully!', type: 'ok' });
    } else {
      setToast({ msg: result.error || result.data?.error || 'Could not nudge team', type: 'err' });
    }
    setNudging(null);
    setTimeout(() => setToast(null), 4000);
  };

  const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
    'Paid': { bg: 'bg-emerald-500/8 border-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400' },
    'Delivered': { bg: 'bg-blue-500/8 border-blue-500/15', text: 'text-blue-400', dot: 'bg-blue-400' },
    'Confirmed': { bg: 'bg-amber-500/8 border-amber-500/15', text: 'text-amber-400', dot: 'bg-amber-400' },
    'default': { bg: 'bg-white/5 border-white/10', text: 'text-white/50', dot: 'bg-white/40' },
  };

  if (loading) {
    return (
      <PortalLayout>
        <div className="min-h-[80vh] flex flex-col items-center justify-center">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-[#d4af37]/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#d4af37] animate-spin" />
          </div>
          <p className="font-cinzel tracking-[0.2em] uppercase text-[11px] text-white/40">Loading Orders</p>
        </div>
      </PortalLayout>
    );
  }

  if (!data) return null;

  return (
    <PortalLayout>
      <div className="p-5 md:p-8 lg:p-10 max-w-5xl mx-auto space-y-6">

        {/* Toast notification */}
        {toast && (
          <div className={`fixed top-20 right-5 z-50 px-5 py-3.5 rounded-xl border backdrop-blur-xl font-sans text-sm flex items-center gap-2.5 animate-slideIn shadow-2xl ${
            toast.type === 'ok'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              : 'bg-red-500/10 border-red-500/20 text-red-300'
          }`}>
            {toast.type === 'ok' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-cinzel text-white font-bold tracking-wider mb-1.5">
              Attributed Orders
            </h1>
            <p className="text-white/30 font-sans text-sm">
              {data.total_count} order{data.total_count !== 1 ? 's' : ''} in <span className="text-white/50">{data.period_label}</span>
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

        {data.orders.length === 0 ? (
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-5">
              <Package className="w-8 h-8 text-white/10" />
            </div>
            <h3 className="font-cinzel text-xl text-white mb-2">No Orders Yet</h3>
            <p className="text-white/30 font-sans text-sm max-w-sm mx-auto">
              When customers purchase using your master link, their orders will appear here in real-time.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25">Order ID</th>
                    <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25">Customer</th>
                    <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25">Status</th>
                    <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25 text-right">Commission</th>
                    <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.orders.map((order) => {
                    const cfg = statusConfig[order.status] || statusConfig['default'];
                    return (
                      <tr key={order.name} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors duration-300">
                        <td className="px-5 py-4 font-mono text-xs text-[#d4af37]/60">{order.name}</td>
                        <td className="px-5 py-4">
                          <div className="text-white text-sm">{order.customer_name}</div>
                          <div className="text-[11px] text-white/20 mt-0.5">{order.package_name}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-[0.1em] uppercase border ${cfg.bg} ${cfg.text}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {order.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right text-sm font-semibold text-white">
                          ₦{order.estimated_commission.toLocaleString()}
                        </td>
                        <td className="px-5 py-4 text-center">
                          {!['Delivered', 'Paid', 'Cancelled', 'Refunded'].includes(order.status) ? (
                            <button
                              onClick={() => handleNudge(order.name)}
                              disabled={nudging === order.name}
                              className="inline-flex items-center justify-center gap-1.5 bg-white/[0.03] hover:bg-[#d4af37]/10 text-white/40 hover:text-[#d4af37] border border-white/[0.06] hover:border-[#d4af37]/20 px-3.5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-[0.1em] transition-all duration-300 disabled:opacity-30"
                            >
                              {nudging === order.name ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Send className="w-3 h-3" />
                              )}
                              {nudging === order.name ? 'Sending' : 'Nudge'}
                            </button>
                          ) : (
                            <span className="text-[10px] text-white/15 uppercase tracking-[0.15em]">Locked</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
