import { useState, useEffect } from 'react';
import { useApprovedReviews } from '@/hooks/useReviews';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function ReviewsList() {
  const { reviews, loading, error } = useApprovedReviews();
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [withMediaOnly, setWithMediaOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  const filteredReviews = reviews.filter((review) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      review.headline.toLowerCase().includes(query) ||
      review.review.toLowerCase().includes(query) ||
      review.name.toLowerCase().includes(query);
    const matchesRating =
      ratingFilter === 'all' || review.rating === parseInt(ratingFilter, 10);
    const matchesMedia = !withMediaOnly || !!review.photo_url;
    return matchesSearch && matchesRating && matchesMedia;
  });

  const reviewsWithMedia = filteredReviews.filter((review) => review.photo_url);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, ratingFilter, withMediaOnly]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + reviewsPerPage);

  if (loading) {
    return (
      <div className="py-8 text-center text-gray-500">Loading reviews...</div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-500">
        Failed to load reviews. Please try again later.
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="mt-8 text-left">
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-500 text-sm">No reviews yet. Be the first to share your experience!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6 text-left">
      {/* Reviews with media gallery */}
      {reviewsWithMedia.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-3">
            Reviews with media
          </h4>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {reviewsWithMedia.map((review) => (
              <img
                key={review.id}
                src={review.photo_url}
                alt={`Photo from ${review.name}`}
                className="w-32 h-32 object-cover rounded-lg flex-shrink-0 bg-gray-100"
              />
            ))}
          </div>
        </div>
      )}

      {/* Search and filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search reviews"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-full border-gray-300 text-sm"
          />
        </div>

        <div className="relative">
          <select
            aria-label="Filter by rating"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="h-10 appearance-none rounded-full border border-gray-300 bg-white px-4 pr-9 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="all">Rating</option>
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
            <option value="2">2 stars</option>
            <option value="1">1 star</option>
          </select>
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        <label className="inline-flex items-center gap-2 h-10 rounded-full border border-gray-300 px-4 text-sm text-gray-700 cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={withMediaOnly}
            onChange={(e) => setWithMediaOnly(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
          />
          With media
        </label>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <p className="text-sm text-gray-500">No reviews match your filters.</p>
        ) : (
          paginatedReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-lg p-4 text-left"
            >
              <div className="flex items-start gap-3 mb-2">
                {/* Reviewer Avatar */}
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  {review.photo_url ? (
                    <img
                      src={review.photo_url}
                      alt={`${review.name}'s avatar`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {review.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
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
                {review.status === 'featured' && (
                  <span className="text-xs font-medium bg-yellow-500 text-white px-2 py-0.5 rounded-full">
                    Featured
                  </span>
                )}
              </div>

                  <h4 className="font-semibold text-gray-900 mb-1">{review.headline.replace(/#\d+$/, '').trim()}</h4>
                  <p className="text-gray-700 text-sm mb-3">{review.review}</p>

                  {/* Review photo (separate from avatar) */}
                  {review.photo_url && (
                    <img
                      src={review.photo_url}
                      alt="Review photo"
                      className="w-full max-w-xs h-auto rounded-lg mb-3 object-cover"
                    />
                  )}

                  <div className="text-xs text-gray-500">
                    <span className="font-medium text-gray-700">{review.name}</span>
                    {review.location && <span> — {review.location}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded border text-sm ${
                currentPage === page
                  ? 'bg-black text-white border-black'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
