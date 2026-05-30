import { useEffect, useState } from 'react';
import { apiCall } from '@/lib/api';

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

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Your Payouts</h1>

      {payouts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No payouts yet.</p>
          <p className="text-sm mt-2">Once orders are delivered + paid, they'll be batched weekly.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payouts.map((p) => (
            <div key={p.batch_name} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">Batch {p.batch_name}</div>
                  <div className="text-sm text-gray-600">
                    Week of {p.week_start} → {p.week_end}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">₦{p.amount.toLocaleString()}</div>
                  <div className={`text-xs mt-1 px-2 py-1 rounded inline-block ${
                    p.status === 'Paid' ? 'bg-green-100 text-green-800' :
                    p.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {p.status}
                  </div>
                </div>
              </div>
              {p.paid_at && (
                <div className="mt-2 text-sm text-gray-600">
                  Paid on {p.paid_at} {p.payment_reference && `(Ref: ${p.payment_reference})`}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
