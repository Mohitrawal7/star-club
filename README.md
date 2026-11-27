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
Until the database and admin area are built, content lives in `src/content/`.
`data.ts` holds confirmed information. `samples.ts` holds invented placeholders,
which are always hidden on the Vercel production site.

## Deploy to Vercel
Import the GitHub repository in Vercel (framework: Next.js).
Set `SITE_URL` to the live address. Keep `SITE_LAUNCHED=false` until the launch checklist passes.
Do not set secrets in the code or commit `.env.local`.

## Status
- Done: project setup, theme, public pages
- Not built yet: Supabase database, sign-in, admin area, uploads
