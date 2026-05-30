import { useEffect, useState } from 'react';
import { apiCall } from '@/lib/api';

interface MbProfile {
  id: string;
  name: string;
  affiliate_id: string;
  platform: string;
  status: string;
  bank_name: string;
  bank_account_number: string;
  bank_account_name: string;
  commitment_fee_paid: boolean;
  commitment_fee_refunded: boolean;
  joined_date: string;
  delivery_rate: number;
}

export default function Dashboard() {
  const [profile, setProfile] = useState<MbProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const result = await apiCall<MbProfile>(
        'vitalvida.api.media_buyer.get_mb_profile',
        undefined,
        { httpMethod: 'GET' }
      );

      if (result.ok && result.data) {
        setProfile(result.data);
      } else {
        setError(result.error || 'Could not load profile');
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
  if (!profile) return <div className="p-8">No profile found</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {profile.name}</h1>
      <p className="text-gray-600">Affiliate ID: {profile.affiliate_id}</p>
      <p>Status: {profile.status}</p>
      <p>Delivery rate: {profile.delivery_rate}%</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Your Unique Link</h2>
        <div className="bg-gray-100 p-3 rounded font-mono break-all mt-2">
          https://fulanihairsecrets.com?aff_id={profile.affiliate_id}
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(`https://fulanihairsecrets.com?aff_id=${profile.affiliate_id}`)}
          className="mt-2 bg-gold text-black px-4 py-2 rounded"
        >
          Copy Link
        </button>
      </div>
    </div>
  );
}
