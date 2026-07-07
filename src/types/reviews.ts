export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'featured';

export interface Review {
  id: string;
  name: string;
  location?: string | null;
  rating: number;
  headline: string;
  review: string;
  photo_url?: string | null;
  status: ReviewStatus;
  created_at: string;
  approved_at?: string | null;
}

export interface ReviewSubmission {
  name: string;
  location?: string;
  rating: number;
  headline: string;
  review: string;
  photo?: File | null;
}

export interface ReviewUpdate {
  status: ReviewStatus;
}

export interface ReviewEditFields {
  name: string;
  location: string;
  headline: string;
  review: string;
  rating: number;
}

export interface ReviewsBackend {
  submitReview(submission: ReviewSubmission): Promise<{ success: boolean; error?: string }>;
  getApprovedReviews(): Promise<Review[]>;
  getPendingReviews(credential: string): Promise<Review[]>;
  updateReviewStatus(id: string, status: ReviewStatus, credential: string): Promise<{ success: boolean; error?: string }>;
  updateReviewContent(id: string, fields: ReviewEditFields, credential: string): Promise<{ success: boolean; error?: string }>;
  deleteReview(id: string, credential: string): Promise<{ success: boolean; error?: string }>;
  uploadPhoto(file: File): Promise<{ url: string | null; error?: string }>;
}
