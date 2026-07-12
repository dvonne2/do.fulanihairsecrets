import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Generate random date between 2020-01-01 and 2026-07-11
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function updateReviewDates() {
  const startDate = new Date('2020-01-01');
  const endDate = new Date('2026-07-11');

  // Fetch all reviews
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('id, created_at, approved_at');

  if (error) {
    console.error('Error fetching reviews:', error);
    process.exit(1);
  }

  console.log(`Found ${reviews.length} reviews to update`);

  for (const review of reviews) {
    const newCreatedAt = randomDate(startDate, endDate);
    const newApprovedAt = review.approved_at 
      ? randomDate(newCreatedAt, endDate) 
      : null;

    const { error: updateError } = await supabase
      .from('reviews')
      .update({
        created_at: newCreatedAt.toISOString(),
        approved_at: newApprovedAt ? newApprovedAt.toISOString() : null,
      })
      .eq('id', review.id);

    if (updateError) {
      console.error(`Error updating review ${review.id}:`, updateError);
    } else {
      console.log(`Updated review ${review.id}: ${newCreatedAt.toISOString()}`);
    }
  }

  console.log('Done updating review dates');
}

updateReviewDates();
