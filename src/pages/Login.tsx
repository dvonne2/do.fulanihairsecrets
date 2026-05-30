import { useState } from 'react';
import { apiCall } from '@/lib/api';

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
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">📧</div>
          <h1 className="text-2xl font-bold mb-4">Check your email</h1>
          <p className="text-gray-600 mb-6">
            If <strong>{email}</strong> is registered as an affiliate, we've sent a magic link.
            Check your inbox (and spam folder).
          </p>
          <p className="text-sm text-gray-500">
            The link expires in 7 days and works only once.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2">Affiliate Portal Login</h1>
        <p className="text-gray-600 mb-6">
          Enter your registered email. We'll send a magic link to log you in — no password needed.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="your@email.com"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={sending || !email}
            className="w-full bg-gold text-black py-3 rounded font-semibold disabled:opacity-50"
          >
            {sending ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Not an affiliate yet?{' '}
          <a href="/affiliate-application" className="text-gold underline">
            Apply here
          </a>
        </p>
      </div>
    </div>
  );
}
