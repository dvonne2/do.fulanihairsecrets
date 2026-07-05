# Supabase Reviews System

This project includes a modular review system backed by Supabase.

## Architecture

- **Types**: `src/types/reviews.ts` defines the backend-agnostic interface.
- **Supabase Implementation**: `src/api/reviewsSupabase.ts` implements the interface for Supabase.
- **Public API**: `src/api/reviews.ts` exposes the active backend. Swap `reviewsSupabaseBackend` for another implementation to change backends without touching UI components.
- **UI Components**:
  - `src/components/reviews/ReviewForm.tsx` — public review submission form
  - `src/components/reviews/ReviewsList.tsx` — displays approved reviews
- **Admin Page**: `src/pages/ReviewsAdmin.tsx` — password-protected moderation UI at `/reviews-admin`

## Setup Steps

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Add environment variables

Copy your Supabase URL and anon key from **Project Settings > API** into your `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_REVIEWS_ADMIN_PASSWORD=your-secure-admin-password
```

### 3. Run the SQL setup

Open `supabase_reviews_setup.sql`, replace `your-secure-admin-password` with your actual admin password, then run it in the **Supabase SQL Editor**.

### 4. Create the storage bucket

In the Supabase Dashboard, go to **Storage > New bucket** and create a public bucket named `review-photos`.

### 5. Configure email notifications (optional)

The SQL file includes a commented-out trigger. To enable email notifications:

1. Enable the `pg_net` extension in Supabase.
2. Replace the webhook URL with your own endpoint (Zapier, Make, or custom).
3. Uncomment the trigger and function in the SQL file.

Alternatively, use a Supabase Edge Function or Database Webhook to send emails via Resend, SendGrid, or your preferred provider.

### 6. Access the admin page

Navigate to `/reviews-admin` on your site. Enter the password you set in `VITE_REVIEWS_ADMIN_PASSWORD` and the SQL functions.

## Security Notes

- Admin operations are performed through password-protected PostgreSQL functions using `SECURITY DEFINER`. The admin password is checked server-side.
- The service role key is not exposed in the frontend.
- Public users can only submit pending reviews and read approved/featured reviews.
- Storage bucket is public so approved review photos can be displayed without authentication.

## Replacing Supabase with ERPNext

To switch to ERPNext later:

1. Create `src/api/reviewsERPNext.ts` implementing `ReviewsBackend` from `src/types/reviews.ts`.
2. Update `src/api/reviews.ts` to export the ERPNext implementation.
3. The UI components (`ReviewForm`, `ReviewsList`, `ReviewsAdmin`) do not need to change.
