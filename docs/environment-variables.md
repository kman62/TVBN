# Environment Variables

The project is designed to keep secrets scoped to the platform that needs them.

## Vercel Frontend

Configuration lives in `vercel.json`. Secrets are referenced using the `@` notation so they
must be created through the Vercel dashboard/CLI (`vercel env add`).

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public Supabase URL used by the client. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key for client-side requests. |
| `SENTRY_DSN` | Optional error monitoring endpoint. |

- **Preview deployments** pull from `preview` scope secrets so branches can test changes.
- **Production** uses protected secrets that only deploy from `main` may access.

## Supabase Backend

See `supabase/.env.example` for the CLI-friendly format. Required variables:

| Variable | Description |
| --- | --- |
| `SUPABASE_ACCESS_TOKEN` | Personal access token for CLI automation. |
| `SUPABASE_DB_PASSWORD` | Database password, injected at runtime for migrations. |
| `SUPABASE_PROJECT_ID` | Unique ID of the Supabase project. |
| `SUPABASE_DB_BRANCH` | (Optional) Branch for preview environments. |

The `supabase/config.toml` file keeps project metadata and links CLI targets to the correct
remote instance.
