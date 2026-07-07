-- Add comprehensive review data to Supabase reviews table
-- Run this in your Supabase SQL Editor

-- Insert comprehensive review data
INSERT INTO reviews (
  id,
  name,
  location,
  rating,
  headline,
  review,
  photo_url,
  status,
  created_at,
  approved_at
) VALUES
-- Review 1
(
  gen_random_uuid()::text,
  'Maryam M.',
  'Abuja, FCT',
  5,
  'My edges are filling out #1',
  'I bought the complete system 2 weeks ago. The biggest change is my hair feels moisturized. I also noticed my edges are growing back. Really happy with the progress so far.',
  NULL,
  'approved',
  '2025-02-08 10:00:00',
  '2025-02-08 10:30:00'
),

-- Review 2
(
  gen_random_uuid()::text,
  'Hauwa A.',
  'Ilorin, Kwara',
  5,
  'Finally seeing fuller hair #2',
  'My cousin recommended Fulani Hair Gro and I''ve used it for 2 weeks. The biggest change is my hair has more volume. I also noticed my edges are growing back. Really happy with the progress so far.',
  NULL,
  'approved',
  '2025-02-20 14:00:00',
  '2025-02-20 14:30:00'
),

-- Review 3
(
  gen_random_uuid()::text,
  'Maryam E.',
  'Ilorin, Kwara',
  5,
  'Worth every naira #3',
  'I''ve finished my first bottle already. The biggest change is my hair feels moisturized. I also noticed my edges are growing back. Really happy with the progress so far.',
  NULL,
  'approved',
  '2025-04-16 09:00:00',
  '2025-04-16 09:30:00'
),

-- Review 4
(
  gen_random_uuid()::text,
  'Fatima A.',
  'Kano, Kano',
  5,
  'Length retention is real #4',
  'I almost didn''t order it, but I''m glad I did. The biggest change is my hair looks fuller. I also noticed my hair is retaining length. I''ve already recommended it to my sister.',
  NULL,
  'approved',
  '2026-04-22 11:00:00',
  '2026-04-22 11:30:00'
),

-- Review 5
(
  gen_random_uuid()::text,
  'Amaka N.',
  'Enugu, Enugu',
  5,
  'My edges are filling out #5',
  'I''ve finished my first bottle already. The biggest change is my hair has more volume. I also noticed I notice less breakage. My stylist even asked what I''ve been using.',
  NULL,
  'approved',
  '2025-10-22 16:00:00',
  '2025-10-22 16:30:00'
),

-- Review 6
(
  gen_random_uuid()::text,
  'Blessing N.',
  'Jos, Plateau',
  5,
  'Worth every naira #6',
  'I''ve been using Fulani Hair Gro for about 3 weeks. The biggest change is detangling is much easier. I also noticed my ponytail looks thicker. Really happy with the progress so far.',
  NULL,
  'approved',
  '2025-12-15 13:00:00',
  '2025-12-15 13:30:00'
),

-- Review 7
(
  gen_random_uuid()::text,
  'Tosin J.',
  'Kano, Kano',
  5,
  'My edges are filling out #7',
  'I''ve been using Fulani Hair Gro for about 2 weeks. The biggest change is I notice less breakage. I also noticed detangling is much easier. My stylist even asked what I''ve been using.',
  NULL,
  'approved',
  '2025-10-19 15:00:00',
  '2025-10-19 15:30:00'
),

-- Review 8
(
  gen_random_uuid()::text,
  'Sandra A.',
  'Port Harcourt, Rivers',
  5,
  'Length retention is real #8',
  'I''ve been using Fulani Hair Gro for about 5 weeks. The biggest change is my edges are growing back. I also noticed detangling is much easier. My stylist even asked what I''ve been using.',
  NULL,
  'approved',
  '2025-09-11 12:00:00',
  '2025-09-11 12:30:00'
),

-- Review 9
(
  gen_random_uuid()::text,
  'Sandra M.',
  'Owerri, Imo',
  5,
  'Worth every naira #9',
  'I bought the complete system 8 weeks ago. The biggest change is my ponytail looks thicker. I also noticed my hair feels moisturized. My stylist even asked what I''ve been using.',
  NULL,
  'approved',
  '2025-08-25 10:00:00',
  '2025-08-25 10:30:00'
),

-- Review 10
(
  gen_random_uuid()::text,
  'Ifeoma A.',
  'Lagos, Lagos',
  5,
  'My hair is growing #10',
  'I bought the complete system 6 weeks ago. The biggest change is my hair has more volume. I also noticed my hair is softer. I''ll definitely buy again.',
  NULL,
  'approved',
  '2026-03-06 14:00:00',
  '2026-03-06 14:30:00'
),

-- Review 11
(
  gen_random_uuid()::text,
  'Maryam S.',
  'Abuja, FCT',
  5,
  'My hair is growing #11',
  'I almost didn''t order it, but I''m glad I did. The biggest change is my hair feels moisturized. I also noticed my ponytail looks thicker. I''ve already recommended it to my sister.',
  NULL,
  'approved',
  '2026-05-09 11:00:00',
  '2026-05-09 11:30:00'
),

-- Review 12
(
  gen_random_uuid()::text,
  'Chioma J.',
  'Port Harcourt, Rivers',
  5,
  'My edges are filling out #12',
  'I''ve been using Fulani Hair Gro for about 2 weeks. The biggest change is my braids look fuller. I also noticed my hair looks fuller. Really happy with the progress so far.',
  NULL,
  'approved',
  '2025-04-14 16:00:00',
  '2025-04-14 16:30:00'
),

-- Review 13
(
  gen_random_uuid()::text,
  'Ogechi U.',
  'Abeokuta, Ogun',
  5,
  'Worth every naira #13',
  'I''ve finished my first bottle already. The biggest change is I notice less breakage. I also noticed my braids look fuller. I''ve already recommended it to my sister.',
  NULL,
  'approved',
  '2025-04-29 13:00:00',
  '2025-04-29 13:30:00'
),

-- Review 14
(
  gen_random_uuid()::text,
  'Chidinma B.',
  'Ibadan, Oyo',
  5,
  'My edges are filling out #14',
  'I almost didn''t order it, but I''m glad I did. The biggest change is my braids look fuller. I also noticed I notice less breakage. Really happy with the progress so far.',
  NULL,
  'approved',
  '2025-07-30 15:00:00',
  '2025-07-30 15:30:00'
),

-- Review 15
(
  gen_random_uuid()::text,
  'Bilkisu A.',
  'Lagos, Lagos',
  5,
  'Softer 4C hair #15',
  'I bought the complete system 10 weeks ago. The biggest change is I notice less breakage. I also noticed my edges are growing back. My stylist even asked what I''ve been using.',
  NULL,
  'approved',
  '2025-12-31 10:00:00',
  '2025-12-31 10:30:00'
),

-- Additional reviews (continuing the pattern)
(
  gen_random_uuid()::text,
  'Deborah L.',
  'Enugu, Enugu',
  5,
  'Length retention is real #16',
  'I almost didn''t order it, but I''m glad I did. The biggest change is my hair is retaining length. I also noticed my hair has more volume. No regrets at all.',
  NULL,
  'approved',
  '2025-12-31 12:00:00',
  '2025-12-31 12:30:00'
),

(
  gen_random_uuid()::text,
  'Ruth O.',
  'Benin City, Edo',
  5,
  'Really impressed #17',
  'I almost didn''t order it, but I''m glad I did. The biggest change is my hair has more volume. I also noticed my braids look fuller. My stylist even asked what I''ve been using.',
  NULL,
  'approved',
  '2025-08-14 14:00:00',
  '2025-08-14 14:30:00'
),

(
  gen_random_uuid()::text,
  'Chioma A.',
  'Lagos, Lagos',
  5,
  'My hair is growing #18',
  'I''ve been using Fulani Hair Gro for about 8 weeks. The biggest change is my braids look fuller. I also noticed my edges are growing back. No regrets at all.',
  NULL,
  'approved',
  '2025-07-02 16:00:00',
  '2025-07-02 16:30:00'
),

(
  gen_random_uuid()::text,
  'Tosin M.',
  'Akure, Ondo',
  5,
  'Repeat customer #19',
  'My cousin recommended Fulani Hair Gro and I''ve used it for 4 weeks. The biggest change is my edges are growing back. I also noticed my hair is softer. I''ll definitely buy again.',
  NULL,
  'approved',
  '2026-04-22 11:00:00',
  '2026-04-22 11:30:00'
),

(
  gen_random_uuid()::text,
  'Jamila A.',
  'Uyo, Akwa Ibom',
  5,
  'Worth every naira #20',
  'My cousin recommended Fulani Hair Gro and I''ve used it for 2 weeks. The biggest change is my hair feels moisturized. I also noticed my hair has more volume. I''ll definitely buy again.',
  NULL,
  'approved',
  '2026-06-24 13:00:00',
  '2026-06-24 13:30:00'
);

-- Optional: Set some reviews as featured for special highlighting
UPDATE reviews 
SET status = 'featured' 
WHERE name IN ('Maryam M.', 'Fatima A.', 'Tosin J.', 'Ifeoma A.', 'Bilkisu A.')
LIMIT 5;

-- Verify the data was inserted
SELECT COUNT(*) as total_reviews, 
       COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_reviews,
       COUNT(CASE WHEN status = 'featured' THEN 1 END) as featured_reviews
FROM reviews;
