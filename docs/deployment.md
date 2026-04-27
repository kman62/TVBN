# Deployment & Environment Configuration

## Frontend (Vercel)

- Import the repository into Vercel and select **Vite** as the framework preset.
- Set the following environment variables for production, preview, and development scopes:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Generate a **Vercel Access Token**, **Org ID**, and **Project ID** and store them as GitHub Action secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID`.
- Preview deployments are triggered from `.github/workflows/preview.yml`; the workflow posts the preview URL back on the pull request via a sticky comment.

## Backend (Supabase)

- Link the repo to a Supabase project using `supabase link --project-ref <project-id>`.
- Create a `SUPABASE_ACCESS_TOKEN` from the Supabase dashboard and save it as a GitHub secret along with:
  - `SUPABASE_PROJECT_ID`
  - `SUPABASE_DB_PASSWORD`
  - `SUPABASE_DB_URL` (connection string for the preview database)
- The preview workflow runs `supabase db push` against the preview database on every pull request so schema changes are validated before merge.

## Local development

- Duplicate `.env.example` to `.env` and supply your Supabase project URL + anon key.
- Run `npm install` (requires npm registry access) followed by `npm run dev`.
- The same `.env` variables are injected by Vercel during production builds via `vercel.json`.
