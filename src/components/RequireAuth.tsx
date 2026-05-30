import { useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '@/lib/api';

interface Props {
  children: ReactNode;
}

interface SessionInfo {
  authenticated: boolean;
  user: string;
  name: string;
  role: string;
  portal: string;
}

export default function RequireAuth({ children }: Props) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    (async () => {
      const result = await apiCall<SessionInfo>(
        'vitalvida.api.media_buyer.check_session',
        undefined,
        { httpMethod: 'GET' }
      );

      if (result.ok && result.data?.authenticated && result.data.portal === 'media_buyer') {
        setAuthed(true);
      } else {
        navigate('/login');
      }
      setChecking(false);
    })();
  }, [navigate]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  return authed ? <>{children}</> : null;
}
