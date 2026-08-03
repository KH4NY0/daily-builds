# Lukhanyo Radebe — Daily Builds Link Hub

A small Next.js starter for the public home behind the Instagram bio.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## First setup steps

1. Replace the temporary `https://formspree.io/f/YOUR_FORM_ID` in `app/submit/page.tsx` with a real Formspree or Tally endpoint.
2. Build the Day 01 planner at `/planner` or replace its `liveUrl` in `lib/builds.ts` with the deployed app URL.
3. Add a new object to `lib/builds.ts` for every daily release.
4. Deploy to Vercel.

The site intentionally begins as a local data-driven archive. Move it to a CMS or database only when the daily-build routine has proven what fields and workflows are genuinely needed.
