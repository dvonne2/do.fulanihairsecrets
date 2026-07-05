import { reviewsSupabaseBackend } from './reviewsSupabase';
import type { ReviewsBackend } from '@/types/reviews';

export const reviewsBackend: ReviewsBackend = reviewsSupabaseBackend;

export { reviewsSupabaseBackend };
export * from '@/types/reviews';
