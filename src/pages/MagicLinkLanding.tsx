import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '@/lib/api';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface SessionInfo {
  authenticated: boolean;
  user: string;
  name: string;
  role: string;
  portal: string;
}

export default function MagicLinkLanding() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'checking' | 'success' | 'failed'>('checking');
  const [errorMsg, setErrorMsg] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    (async () => {
      const result = await apiCall<SessionInfo>(
        'vitalvida.api.media_buyer.check_session',
        undefined,
        { httpMethod: 'GET' }
      );

      if (result.ok && result.data?.authenticated) {
        if (result.data.portal !== 'media_buyer') {
          setStatus('failed');
          setErrorMsg(`Your account has role "${result.data.role}" — this portal is for Media Buyers only.`);
          return;
        }

        setUserName(result.data.name?.split(' ')[0] || '');
        setStatus('success');
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        setStatus('failed');
        setErrorMsg(result.error || 'Could not verify your session. Magic link may have expired.');
      }
    })();
  }, [navigate]);

  return (
    <div className="portal-layout min-h-screen bg-[#050505] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(212,175,55,0.06)_0%,transparent_70%)] pointer-events-none" />

      {status === 'checking' && (
        <div className="relative z-10 text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-[#d4af37]/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#d4af37] animate-spin" />
            <div className="absolute inset-3 rounded-full bg-[#0a0a0a] flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-[#d4af37]/60 animate-spin" />
            </div>
          </div>
          <p className="font-cinzel text-white/50 tracking-[0.2em] uppercase text-sm">Authenticating</p>
          <div className="mt-4 flex items-center justify-center gap-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/40 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
            ))}
          </div>
        </div>
      )}

      {status === 'success' && (
        <div className="relative z-10 text-center animate-in fade-in duration-500">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#b8860b]/20 to-[#d4af37]/20 animate-pulse" />
            <div className="absolute inset-2 rounded-full bg-[#0a0a0a] border border-[#d4af37]/30 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-[#d4af37]" />
            </div>
          </div>
          <h1 className="text-3xl font-cinzel text-white font-bold tracking-wider mb-2">
            Welcome back{userName ? `, ${userName}` : ''}
          </h1>
          <p className="text-white/40 font-sans text-sm">Loading your dashboard...</p>
          <div className="mt-6 w-48 h-1 bg-white/[0.05] rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#b8860b] to-[#d4af37] rounded-full animate-[progress_2s_ease-in-out_forwards]" />
          </div>
        </div>
      )}

      {status === 'failed' && (
        <div className="relative z-10 max-w-md w-full text-center animate-in fade-in duration-500">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-red-500/10 animate-pulse" />
            <div className="absolute inset-2 rounded-full bg-[#0a0a0a] border border-red-500/20 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-400/80" />
            </div>
          </div>
          <h1 className="text-2xl font-cinzel text-white font-bold tracking-wider mb-3">Authentication Failed</h1>
          <p className="text-white/40 font-sans text-sm mb-8 leading-relaxed">{errorMsg}</p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#f0d060] text-black px-8 py-3.5 rounded-xl font-bold font-sans text-sm uppercase tracking-[0.1em] transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
          >
            Request New Link
          </button>
        </div>
      )}
    </div>
  );
}
