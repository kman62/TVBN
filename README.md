# TVBN Platform Scaffold

This repository houses the foundational Next.js 14 App Router project for the TVBN platform. It includes shared UI primitives, a basic onboarding route group, and helper utilities so upcoming modules (activity feed, visitor CRM, content studio) can iterate quickly.

## Getting started

1. Install dependencies (requires Node 18+):
   ```bash
   npm install
   ```
2. Create an `.env.local` based on the provided example.
3. Run the development server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` – start Next.js in development mode.
- `npm run build` – create a production build.
- `npm run start` – run the production build.
- `npm run lint` – run ESLint with the Next.js configuration.

## Project structure

- `app/` – App Router routes, layouts, and page-level UI.
- `components/` – shared UI primitives (navigation, cards, layout helpers).
- `lib/` – Supabase helpers and small utilities/state stores.
- `public/` – static assets.

## Styling & UI

Tailwind CSS is configured globally via `app/globals.css` with a small design system expressed through CSS variables. Navigation, cards, and layout components live in `components/` for reuse across future product areas.

## Authentication helpers

`lib/supabase-browser.js` and `lib/supabase-server.js` centralize Supabase client creation so both the client and server components can authenticate consistently. Update the `.env.local` file with your Supabase project details before making network calls.
