import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '@/lib/api';

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

  useEffect(() => {
    // The backend already set the session cookie before redirecting here.
    // We just confirm by calling check_session.
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

        setStatus('success');
        // Brief delay so user sees "Welcome" then redirect
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setStatus('failed');
        setErrorMsg(result.error || 'Could not verify your session. Magic link may have expired.');
      }
    })();
  }, [navigate]);

  if (status === 'checking') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Logging you in...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="max-w-md text-center">
        <div className="text-6xl mb-4">✗</div>
        <h1 className="text-2xl font-bold mb-4">Could not log you in</h1>
        <p className="text-gray-600 mb-6">{errorMsg}</p>
        <button
          onClick={() => navigate('/login')}
          className="bg-gold text-black px-6 py-3 rounded font-semibold"
        >
          Request a new magic link
        </button>
      </div>
    </div>
  );
}
