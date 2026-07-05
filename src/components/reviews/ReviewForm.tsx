import { useState } from 'react';
import { useSubmitReview } from '@/hooks/useReviews';

interface ReviewFormProps {
  onSuccess?: () => void;
}

export function ReviewForm({ onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [headline, setHeadline] = useState('');
  const [review, setReview] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const { submit, submitting, error, success } = useSubmitReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submit({
      name,
      location,
      rating,
      headline,
      review,
      photo,
    });
    if (result) {
      setRating(0);
      setHeadline('');
      setReview('');
      setName('');
      setLocation('');
      setEmail('');
      setPhoto(null);
      onSuccess?.();
    }
  };

  return (
    <form className="mt-4 space-y-5 text-left" onSubmit={handleSubmit}>
      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rate your experience <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none"
              aria-label={`Rate ${star} stars`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill={star <= rating ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.5"
                className={star <= rating ? 'text-black' : 'text-gray-300'}
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-500">
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Average'}
            {rating === 4 && 'Good'}
            {rating === 5 && 'Excellent'}
          </span>
        </div>
      </div>

      {/* Headline */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Add a headline <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="Summarize your experience"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>

      {/* Review */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Write a review <span className="text-red-500">*</span>
        </label>
        <textarea
          required
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Tell us what you like or dislike"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
        />
      </div>

      {/* Media Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Add photo <span className="text-gray-500 font-normal">(Optional)</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Upload one image: JPG, PNG, WebP, or GIF (max 5MB)
        </p>
        <p className="text-xs text-gray-500 mb-2">
          {photo ? photo.name : 'No file selected'}
        </p>
        {photoError && <p className="text-xs text-red-600 mb-2">{photoError}</p>}
        <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setPhotoError(null);
              if (file) {
                const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
                const maxSize = 5 * 1024 * 1024;
                if (!allowedTypes.includes(file.type)) {
                  setPhotoError('Only JPG, PNG, WebP, or GIF images are allowed.');
                  setPhoto(null);
                  return;
                }
                if (file.size > maxSize) {
                  setPhotoError('File size must be less than 5MB.');
                  setPhoto(null);
                  return;
                }
              }
              setPhoto(file);
            }}
          />
        </label>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your name <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-1">This will appear publicly with your review</p>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your location <span className="text-gray-500 font-normal">(Optional)</span>
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g., Lagos, Nigeria"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your email address <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-1">
          We&apos;ll send you an email to verify this review came from you.
        </p>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>

      {/* Send Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Sending...' : 'Send'}
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && (
        <p className="text-sm text-green-600">
          Thank you! Your review has been submitted for approval.
        </p>
      )}
    </form>
  );
}
