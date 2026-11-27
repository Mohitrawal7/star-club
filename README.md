# Star Club website

Next.js (App Router), TypeScript and Ant Design.

## Run locally
    npm install
    cp .env.example .env.local
    npm run dev

## Checks
    npm run lint
    npx tsc --noEmit
    npm run build

## Content
Once Supabase is connected, admins manage content at `/admin`. See `SETUP.md`.
Without Supabase, the site uses `src/content/data.ts`. `samples.ts` holds invented placeholders,
which are always hidden on the Vercel production site.

## Database
`supabase/setup.sql` creates tables, access rules and storage. `supabase/tests/` is for a local
PostgreSQL database only (load local-stubs.sql, then setup.sql, then rls.sql). Never run it on Supabase.

## Security
Row Level Security enforces who can read and write. Only the publishable key is used.

## Status
- Built and tested locally: public pages, database setup, admin sign-in, publishing, uploads
- Still required: testing on the real Supabase and Vercel projects (SETUP.md step 6)
