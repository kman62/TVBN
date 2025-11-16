# Temecula Valley Business Network Hub

Production-ready scaffold for the Temecula networking app inspired by MNO’s proprietary member experience. The stack is 100% JavaScript/TypeScript-free (JS only) and powered by Next.js 14 (App Router), Tailwind, and Supabase (Postgres, Auth, Realtime, Storage, Edge Functions).

## Features in this commit
- Marketing landing page that highlights the differentiators.
- Member onboarding workflow powered by `react-hook-form` and Supabase inserts.
- Dashboard shell with realtime activity feed, visitor pipeline cards, and visitor CRM table view.
- Supabase schema + row-level security + AI caption Edge Function stub.
- Ops runbook, environment template, and configuration files for Tailwind/PostCSS.

## Getting started
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Environment variables**
   Copy `.env.example` to `.env.local` and supply your Supabase + OpenAI keys.
3. **Supabase**
   - Create a project in the Supabase dashboard.
   - Run the SQL in `supabase/migrations/0001_init.sql`.
   - Deploy the Edge Function in `supabase/functions/create-caption`.
4. **Local development**
   ```bash
   npm run dev
   ```
5. **Production deployment**
   - Deploy the Next.js app to Vercel (or preferred host).
   - Point environment variables to the production Supabase project.

## Roadmap
- Hook up Supabase Auth (email/OAuth) and protect `/app` routes with middleware.
- Add referral logging forms + automation cron jobs (weekly digests, visitor reminders).
- Integrate LivingInTemecula / LocalTemecula directory sync jobs.
- Add analytics dashboard + gamification badges.
