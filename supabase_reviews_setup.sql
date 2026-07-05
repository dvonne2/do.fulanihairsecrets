-- Supabase Reviews System Setup
-- Run this in the Supabase SQL Editor

-- 1. Create the reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  headline TEXT NOT NULL,
  review TEXT NOT NULL,
  photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'featured')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMPTZ
);

-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 2. RLS Policies

-- Allow anyone to insert a review (submitted as pending)
CREATE POLICY "Allow public to submit reviews"
  ON public.reviews
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending');

-- Allow anyone to read approved or featured reviews
CREATE POLICY "Allow public to read approved reviews"
  ON public.reviews
  FOR SELECT
  TO anon, authenticated
  USING (status IN ('approved', 'featured'));

-- Admin operations are handled by PostgreSQL functions below (not direct table access)

-- 3. Create the review-photos storage bucket
-- Go to Supabase Dashboard > Storage > New bucket, name it "review-photos", make it public.
-- Then run the storage policies below.

-- 4. Storage RLS Policies for review-photos bucket
CREATE POLICY "Allow public uploads to review-photos"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'review-photos');

CREATE POLICY "Allow public read access to review-photos"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'review-photos');

-- 5. Admin helper functions (password-protected)
-- Replace 'your-secure-admin-password' with your actual admin password.

CREATE OR REPLACE FUNCTION public.get_pending_reviews(admin_password TEXT)
RETURNS SETOF public.reviews
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF admin_password != 'your-secure-admin-password' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  RETURN QUERY SELECT * FROM public.reviews WHERE status = 'pending' ORDER BY created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_review_status(
  review_id UUID,
  new_status TEXT,
  admin_password TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF admin_password != 'your-secure-admin-password' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  IF new_status NOT IN ('pending', 'approved', 'rejected', 'featured') THEN
    RAISE EXCEPTION 'Invalid status';
  END IF;

  UPDATE public.reviews
  SET status = new_status,
      approved_at = CASE WHEN new_status IN ('approved', 'featured') THEN NOW() ELSE approved_at END
  WHERE id = review_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_review(
  review_id UUID,
  admin_password TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF admin_password != 'your-secure-admin-password' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  DELETE FROM public.reviews WHERE id = review_id;
END;
$$;

-- 6. Email notification on new review submission
-- This requires the pg_net extension and a webhook URL (Zapier, Make, or your own endpoint).
-- Replace 'https://your-webhook-url.com/new-review' with your webhook URL.

-- Uncomment and configure if pg_net is available:
-- CREATE OR REPLACE FUNCTION public.notify_new_review()
-- RETURNS TRIGGER
-- LANGUAGE plpgsql
-- SECURITY DEFINER
-- AS $$
-- BEGIN
--   PERFORM net.http_post(
--     url := 'https://your-webhook-url.com/new-review',
--     body := jsonb_build_object(
--       'id', NEW.id,
--       'name', NEW.name,
--       'rating', NEW.rating,
--       'headline', NEW.headline,
--       'review', NEW.review,
--       'created_at', NEW.created_at
--     )
--   );
--   RETURN NEW;
-- END;
-- $$;
--
-- CREATE TRIGGER on_review_submitted
--   AFTER INSERT ON public.reviews
--   FOR EACH ROW
--   EXECUTE FUNCTION public.notify_new_review();
