import { useEffect, useState } from 'react';
import { apiCall } from '@/lib/api';
import { Loader2, Copy, Check, TrendingUp, Award, Activity, Zap } from 'lucide-react';
import PortalLayout from '@/components/PortalLayout';

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

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target <= 0) return;
    const duration = 1200;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count}{suffix}</>;
}

export default function Dashboard() {
  const [profile, setProfile] = useState<MbProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

  const handleCopy = () => {
    if (!profile) return;
    navigator.clipboard.writeText(`https://fulanihairsecrets.com?aff_id=${profile.affiliate_id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <PortalLayout>
        <div className="min-h-[80vh] flex flex-col items-center justify-center">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-[#d4af37]/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#d4af37] animate-spin" />
          </div>
          <p className="font-cinzel tracking-[0.2em] uppercase text-[11px] text-white/40">Loading Dashboard</p>
        </div>
      </PortalLayout>
    );
  }

  if (error) {
    return (
      <PortalLayout>
        <div className="min-h-[80vh] flex items-center justify-center p-8">
          <div className="bg-red-500/5 border border-red-500/20 text-red-200/80 p-8 rounded-2xl max-w-lg text-center backdrop-blur-md">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="font-cinzel text-xl mb-2 text-white">Access Error</h2>
            <p className="font-sans text-sm">{error}</p>
          </div>
        </div>
      </PortalLayout>
    );
  }

  if (!profile) return null;

  return (
    <PortalLayout>
      <div className="p-5 md:p-8 lg:p-10 max-w-5xl mx-auto space-y-8">

        {/* ═══ Welcome Header ═══ */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d0d0a] to-[#0a0a0a] border border-white/[0.06] p-8 md:p-10">
          {/* Decorative mesh */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle,rgba(212,175,55,0.06)_0%,transparent_70%)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-[radial-gradient(circle,rgba(212,175,55,0.03)_0%,transparent_70%)] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#d4af37]/10 px-3 py-1.5 rounded-full mb-4">
                <Award className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="text-[10px] tracking-[0.2em] text-[#d4af37] uppercase font-sans font-semibold">Exclusive Partner</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-cinzel text-white font-bold tracking-wider mb-2">
                Welcome, <span className="text-[#d4af37]">{profile.name.split(' ')[0]}</span>
              </h1>
              <p className="text-white/30 font-sans text-sm">
                Affiliate ID: <span className="text-[#d4af37]/70 tracking-widest font-mono">{profile.affiliate_id}</span>
              </p>
            </div>

            <div className="flex items-center gap-2.5 bg-white/[0.03] border border-white/[0.06] px-5 py-2.5 rounded-full">
              <div className={`w-2.5 h-2.5 rounded-full ${profile.status === 'Active' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-amber-400'}`} />
              <span className="font-sans text-xs tracking-[0.15em] uppercase text-white/50">
                {profile.status}
              </span>
            </div>
          </div>
        </div>

        {/* ═══ Master Link ═══ */}
        <div className="relative rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 md:p-8 overflow-hidden group">
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-[#d4af37]/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#d4af37]" />
            </div>
            <div>
              <h2 className="font-cinzel text-lg text-white">Your Master Link</h2>
              <p className="text-white/30 font-sans text-xs">Share across all campaigns</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mt-5">
            <div className="flex-1 bg-black/40 border border-white/[0.06] rounded-xl px-4 py-3.5 font-mono text-[#d4af37]/80 text-sm break-all flex items-center">
              https://fulanihairsecrets.com?aff_id={profile.affiliate_id}
            </div>
            <button
              onClick={handleCopy}
              className="relative overflow-hidden bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#f0d060] text-black px-7 py-3.5 rounded-xl font-bold font-sans text-xs uppercase tracking-[0.15em] transition-all duration-300 flex items-center justify-center gap-2 group/btn md:w-auto w-full"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
              <span className="relative flex items-center gap-2">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </span>
            </button>
          </div>
        </div>

        {/* ═══ Stats Grid ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Delivery Rate */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 hover:border-[#d4af37]/20 transition-all duration-500 group">
            <div className="flex justify-between items-start mb-5">
              <p className="text-white/30 font-sans uppercase tracking-[0.15em] text-[10px]">Delivery Rate</p>
              <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center group-hover:bg-[#d4af37]/10 transition-colors duration-300">
                <Activity className="w-4 h-4 text-white/20 group-hover:text-[#d4af37] transition-colors duration-300" />
              </div>
            </div>
            <p className="text-3xl font-cinzel text-white mb-4">
              <AnimatedCounter target={profile.delivery_rate} /><span className="text-[#d4af37] text-xl ml-0.5">%</span>
            </p>
            <div className="w-full bg-white/[0.04] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#b8860b] to-[#d4af37] h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${profile.delivery_rate}%` }}
              />
            </div>
          </div>

          {/* Platform */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 hover:border-[#d4af37]/20 transition-all duration-500 group">
            <p className="text-white/30 font-sans uppercase tracking-[0.15em] text-[10px] mb-5">Platform</p>
            <p className="text-2xl font-cinzel text-white">{profile.platform || '—'}</p>
          </div>

          {/* Payout Account */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 hover:border-[#d4af37]/20 transition-all duration-500 group">
            <p className="text-white/30 font-sans uppercase tracking-[0.15em] text-[10px] mb-5">Payout Account</p>
            <p className="text-base font-sans text-white truncate">{profile.bank_account_name || '—'}</p>
            {profile.bank_name && (
              <p className="text-xs text-[#d4af37]/50 mt-1.5 font-mono">
                {profile.bank_name} •••• {profile.bank_account_number?.slice(-4)}
              </p>
            )}
          </div>
        </div>

      </div>
    </PortalLayout>
  );
}
