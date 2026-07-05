import { useState } from 'react';
import { useAdminReviews } from '@/hooks/useReviews';
import type { ReviewStatus } from '@/types/reviews';

const ADMIN_PASSWORD_KEY = 'reviews_admin_password';

export default function ReviewsAdmin() {
  const [password, setPassword] = useState(() => {
    return localStorage.getItem(ADMIN_PASSWORD_KEY) || '';
  });
  const [inputPassword, setInputPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(() => {
    return !!localStorage.getItem(ADMIN_PASSWORD_KEY);
  });

  const { reviews, loading, error, refetch, updateStatus, deleteReview } = useAdminReviews(
    authenticated ? password : ''
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPassword(inputPassword);
    localStorage.setItem(ADMIN_PASSWORD_KEY, inputPassword);
    setAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_PASSWORD_KEY);
    setPassword('');
    setInputPassword('');
    setAuthenticated(false);
  };

  const handleStatusChange = async (id: string, status: ReviewStatus) => {
    await updateStatus(id, status);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      await deleteReview(id);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-semibold mb-4">Reviews Admin</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
                aria-label="Admin password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Reviews Admin</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => void refetch()}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {loading && <p className="text-gray-500">Loading reviews...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && reviews.length === 0 && (
          <p className="text-gray-500">No pending reviews to moderate.</p>
        )}

        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-lg p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex text-black">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill={i < review.rating ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className={i < review.rating ? 'text-black' : 'text-gray-300'}
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs font-medium uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {review.status}
                    </span>
                  </div>

                  <h3 className="font-semibold text-lg">{review.headline}</h3>
                  <p className="text-gray-700 mt-1">{review.review}</p>

                  {review.photo_url && (
                    <img
                      src={review.photo_url}
                      alt="Review photo"
                      className="mt-3 w-full max-w-xs h-auto rounded-lg object-cover"
                    />
                  )}

                  <div className="text-sm text-gray-500 mt-3">
                    <span className="font-medium">{review.name}</span>
                    {review.location && <span> — {review.location}</span>}
                    <span className="mx-2">•</span>
                    <span>{new Date(review.created_at).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleStatusChange(review.id, 'approved')}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(review.id, 'rejected')}
                    className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleStatusChange(review.id, 'featured')}
                    className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                  >
                    Feature
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
