# Deployment Pipeline and Environments

This document explains how the GitHub Actions workflow, Vercel frontend, and Supabase backend
fit together.

## Branch Strategy

- `main`: protected, production-only. Every merge triggers linting, tests, and deployments.
- `*` feature branches: automatically receive preview environments for both Vercel and
  Supabase via branch-based secrets.

## GitHub Actions Overview

1. **Install** – Uses Node.js 20.x with dependency caching keyed by `package-lock.json`.
2. **Static analysis** – Runs `npm run lint` and `npm run format:check` to gate merges.
3. **Tests** – Executes `npm run test:coverage` for deterministic outputs.
4. **Deploy** – On `main`, pushes the frontend through the Vercel CLI and runs Supabase
   migrations + seeding.

Secrets consumed by the workflow:

| Secret | Purpose |
| --- | --- |
| `VERCEL_TOKEN` | Authenticates the CLI for deployment. |
| `VERCEL_ORG_ID` | Associates deployments with the org. |
| `VERCEL_PROJECT_ID` | Routes deployments to the Vercel project. |
| `SUPABASE_ACCESS_TOKEN` | Allows Supabase CLI to run migrations + backups. |
| `SUPABASE_PROJECT_ID` | Identifies the Supabase instance targeted for release. |
| `SUPABASE_DB_PASSWORD` | Injected at deploy time for migrations. |

Preview branches only require the Vercel token and Supabase access token; production secrets
are marked as protected to avoid accidental use.
