import { useState } from 'react';
import { useAdminReviews } from '@/hooks/useReviews';
import { reviewsSupabaseBackend } from '@/api/reviewsSupabase';
import type { Review, ReviewStatus } from '@/types/reviews';

const ADMIN_PASSWORD_KEY = 'reviews_admin_password';

interface EditState {
  id: string;
  name: string;
  location: string;
  headline: string;
  review: string;
  rating: number;
}

export default function ReviewsAdmin() {
  const [password, setPassword] = useState(() => localStorage.getItem(ADMIN_PASSWORD_KEY) || '');
  const [inputPassword, setInputPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(() => !!localStorage.getItem(ADMIN_PASSWORD_KEY));
  const [editState, setEditState] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

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

  const handleEditOpen = (review: Review) => {
    setEditState({
      id: review.id,
      name: review.name,
      location: review.location || '',
      headline: review.headline,
      review: review.review,
      rating: review.rating,
    });
    setSaveError('');
  };

  const handleEditSave = async () => {
    if (!editState) return;
    setSaving(true);
    setSaveError('');
    const result = await reviewsSupabaseBackend.updateReviewContent(
      editState.id,
      {
        name: editState.name,
        location: editState.location,
        headline: editState.headline,
        review: editState.review,
        rating: editState.rating,
      },
      password
    );
    setSaving(false);
    if (result.success) {
      setEditState(null);
      void refetch();
    } else {
      setSaveError(result.error || 'Failed to save changes');
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
                type="password"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
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

        {/* Edit Modal */}
        {editState && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg space-y-4">
              <h2 className="text-lg font-semibold">Edit Review</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editState.name}
                  onChange={(e) => setEditState({ ...editState, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={editState.location}
                  onChange={(e) => setEditState({ ...editState, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditState({ ...editState, rating: star })}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill={star <= editState.rating ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className={star <= editState.rating ? 'text-black' : 'text-gray-300'}
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                <input
                  type="text"
                  value={editState.headline}
                  onChange={(e) => setEditState({ ...editState, headline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
                <textarea
                  rows={4}
                  value={editState.review}
                  onChange={(e) => setEditState({ ...editState, review: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
              </div>

              {saveError && <p className="text-red-600 text-sm">{saveError}</p>}

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setEditState(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  disabled={saving}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-5">
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
                      loading="lazy"
                      decoding="async"
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
                    onClick={() => handleEditOpen(review)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Edit
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
