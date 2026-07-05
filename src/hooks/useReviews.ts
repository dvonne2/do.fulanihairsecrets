import { useCallback, useEffect, useState } from 'react';
import { reviewsBackend } from '@/api/reviews';
import type { Review, ReviewStatus, ReviewSubmission } from '@/types/reviews';

export function useApprovedReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reviewsBackend.getApprovedReviews();
      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchReviews();
  }, [fetchReviews]);

  return { reviews, loading, error, refetch: fetchReviews };
}

export function useSubmitReview() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = useCallback(async (submission: ReviewSubmission) => {
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await reviewsBackend.submitReview(submission);
      if (result.success) {
        setSuccess(true);
        return true;
      }
      setError(result.error || 'Failed to submit review');
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  return { submit, submitting, error, success };
}

export function useAdminReviews(adminPassword: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    if (!adminPassword) return;
    setLoading(true);
    setError(null);
    try {
      const data = await reviewsBackend.getPendingReviews(adminPassword);
      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [adminPassword]);

  useEffect(() => {
    void fetchReviews();
  }, [fetchReviews]);

  const updateStatus = useCallback(
    async (id: string, status: ReviewStatus) => {
      const result = await reviewsBackend.updateReviewStatus(id, status, adminPassword);
      if (result.success) {
        await fetchReviews();
      }
      return result;
    },
    [adminPassword, fetchReviews]
  );

  const deleteReview = useCallback(
    async (id: string) => {
      const result = await reviewsBackend.deleteReview(id, adminPassword);
      if (result.success) {
        await fetchReviews();
      }
      return result;
    },
    [adminPassword, fetchReviews]
  );

  return { reviews, loading, error, refetch: fetchReviews, updateStatus, deleteReview };
}
