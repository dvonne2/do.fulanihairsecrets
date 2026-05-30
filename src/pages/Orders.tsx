import { useEffect, useState } from 'react';
import { apiCall } from '@/lib/api';

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
  const [period, setPeriod] = useState<'w' | 'm' | 'all'>('w');
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

  if (loading) return <div className="p-8">Loading orders...</div>;
  if (!data) return <div className="p-8">No data</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Orders</h1>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as any)}
          className="border rounded px-3 py-2"
        >
          <option value="w">This Week</option>
          <option value="m">This Month</option>
          <option value="all">All Time</option>
        </select>
      </div>

      <p className="text-gray-600 mb-4">
        {data.total_count} order{data.total_count !== 1 ? 's' : ''} in {data.period_label}
      </p>

      {data.orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No orders yet in this period.</p>
          <p className="text-sm mt-2">Share your link to start earning.</p>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Order</th>
              <th>Customer</th>
              <th>Package</th>
              <th>Status</th>
              <th>Est. Commission</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.orders.map((order) => (
              <tr key={order.name} className="border-b">
                <td className="py-2">{order.name}</td>
                <td>{order.customer_name}</td>
                <td>{order.package_name}</td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs ${
                    order.status === 'Paid' ? 'bg-green-100 text-green-800' :
                    order.status === 'Delivered' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td>₦{order.estimated_commission.toLocaleString()}</td>
                <td>
                  {!['Delivered', 'Paid', 'Cancelled', 'Refunded'].includes(order.status) && (
                    <button
                      onClick={() => handleNudge(order.name)}
                      disabled={nudging === order.name}
                      className="text-xs bg-gold text-black px-3 py-1 rounded disabled:opacity-50"
                    >
                      {nudging === order.name ? 'Sending...' : 'Nudge Team'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
