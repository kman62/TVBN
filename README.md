# TVBN

This repository contains Supabase schema migrations, row-level security policies, and Edge Functions that support the TVBN Next.js application. Use the files inside the `supabase` directory to bootstrap a local Supabase project or to apply migrations in CI/CD pipelines.

## Contents

- `supabase/migrations`: SQL migrations that provision the `chapters`, `members`, `activities`, `visitors`, and `content_assets` tables plus helper enums and administrative functions.
- `supabase/functions`: Supabase Edge Functions the Next.js app can call for AI caption generation, scheduled publishing, and weekly digest automation.
- `.env.example`: Environment variable contract for both the Next.js frontend and Edge Functions.

## Edge Functions

Each function exposes a REST-style POST endpoint once deployed with `supabase functions deploy <name>`.

| Function | Purpose |
| --- | --- |
| `ai-caption` | Generates or refreshes captions for the `content_assets` table by calling OpenAI (or a placeholder when no API key is configured). |
| `scheduled-post` | Cron-friendly endpoint that promotes scheduled assets to `PUBLISHED` when their `scheduled_for` timestamp passes. |
| `weekly-digest` | Aggregates the past week of activity across chapters and triggers an email send via your preferred provider. |

## Getting Started

1. Install the Supabase CLI.
2. Copy `.env.example` to `.env` and fill in the required credentials.
3. Run `supabase start` (or point the CLI at an existing project) and then `supabase db reset` to apply the migrations.
4. Deploy Edge Functions with `supabase functions deploy ai-caption`, `supabase functions deploy scheduled-post`, and `supabase functions deploy weekly-digest`.
