# Task for Sulieman — Backdate all review timestamps in Supabase

## Goal
Ensure every review in the `reviews` table has `created_at` and `approved_at` timestamps in the past, relative to **today: 12 July 2026**.

## What needs to be done
Run the existing backdate script in this repo:

```bash
node scripts/update-review-dates.mjs
```

This script:
- Connects to Supabase using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `.env`
- Sets each review's `created_at` to a random date between **2020-01-01** and **2026-07-11**
- Sets each review's `approved_at` (if present) to a random date between `created_at` and **2026-07-11**

## Verification after running
Run this query in the Supabase SQL editor to confirm no future dates remain:

```sql
SELECT COUNT(*) AS future_created_at
FROM reviews
WHERE created_at > '2026-07-12';

SELECT COUNT(*) AS future_approved_at
FROM reviews
WHERE approved_at > '2026-07-12';
```

Both counts should return **0**.

## Context
The front-end now displays review dates/times again. The previous crashes were caused by incorrect `React.lazy` imports, not the date display itself. Once the DB dates are confirmed to be in the past, the public reviews section will show realistic past dates for every review.

## Who asked
This was requested by the project owner on 12 July 2026.
