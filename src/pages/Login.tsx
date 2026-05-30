import { useState } from 'react';
import { apiCall } from '@/lib/api';
import { Loader2, ArrowRight, Sparkles } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');

    const result = await apiCall<{ success: boolean; message: string }>(
      'vitalvida.api.media_buyer_auth.request_new_magic_link',
      { email },
      { httpMethod: 'POST' }
    );

    setSending(false);

    if (result.ok) {
      setSent(true);
    } else {
      setError(result.error || 'Could not send magic link. Try again.');
    }
  };

  if (sent) {
    return (
      <div className="portal-layout min-h-screen bg-[#050505] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-md w-full text-center">
          {/* Animated envelope */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#b8860b]/20 to-[#d4af37]/20 animate-pulse" />
            <div className="absolute inset-2 rounded-xl bg-[#0a0a0a] border border-[#d4af37]/30 flex items-center justify-center">
              <span className="text-4xl">✉️</span>
            </div>
          </div>

          <h1 className="text-3xl font-cinzel text-white font-bold tracking-wider mb-4">
            Check Your <span className="text-[#d4af37]">Inbox</span>
          </h1>
          <p className="text-white/50 font-sans leading-relaxed mb-3 text-sm">
            If <strong className="text-white">{email}</strong> is registered as an affiliate,
            we've sent your exclusive access link.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] px-5 py-2.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]/60" />
            <span className="text-[11px] text-white/40 tracking-wider uppercase font-sans">Single-use · Expires in 7 days</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-layout min-h-screen bg-[#050505] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />
      <div className="absolute top-[-200px] right-[-100px] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(212,175,55,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-50px] w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(212,175,55,0.04)_0%,transparent_70%)] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: 'linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <div className="relative z-10 max-w-[420px] w-full">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#b8860b] to-[#d4af37] flex items-center justify-center">
              <span className="text-black font-bold text-lg font-cinzel">V</span>
            </div>
          </div>
          <h1 className="text-3xl font-cinzel text-white font-bold tracking-[0.15em] uppercase mb-3">
            Affiliate Portal
          </h1>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent mx-auto mb-4" />
          <p className="text-white/40 font-sans text-sm">
            Enter your email to receive a secure, passwordless login link.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[11px] font-sans text-white/40 mb-2.5 tracking-[0.2em] uppercase">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white font-sans text-sm focus:outline-none focus:border-[#d4af37]/50 focus:ring-1 focus:ring-[#d4af37]/20 transition-all duration-300 placeholder-white/20"
                placeholder="your@email.com"
              />
            </div>

            {error && (
              <div className="bg-red-500/5 border border-red-500/20 text-red-300/80 p-3.5 rounded-xl text-sm font-sans text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={sending || !email}
              className="w-full relative overflow-hidden bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#f0d060] text-black py-4 rounded-xl font-bold font-sans text-sm uppercase tracking-[0.15em] disabled:opacity-40 transition-all duration-300 group"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative flex items-center justify-center gap-2">
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Magic Link
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>
        </div>

        <p className="text-center mt-8 font-sans text-sm">
          <span className="text-white/30">Not an affiliate? </span>
          <a href="/affiliate-application" className="text-[#d4af37]/70 hover:text-[#d4af37] transition-colors border-b border-[#d4af37]/20 pb-0.5">
            Apply Here
          </a>
        </p>
      </div>
    </div>
  );
}
