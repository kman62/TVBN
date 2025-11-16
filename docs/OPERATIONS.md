# Operational runbook

## Hosting
- **Frontend**: Deploy `tvbn-hub` Next.js app to Vercel. Use preview deployments on every PR and promote to production after CI passes.
- **Backend**: Supabase managed project provides Postgres, Auth, Storage, Realtime, and Edge Functions. Enable PITR backups.

## Secrets
Create the following secrets in Vercel and GitHub Actions:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `POSTMARK_TOKEN` (or equivalent email provider)

## Monitoring
- Enable Supabase logs + Logflare sink for long-term storage.
- Configure Vercel Analytics + Speed Insights to track Core Web Vitals.
- Add health-check endpoint (`/api/health`) before go-live for uptime monitoring.

## Incident response
1. Validate Supabase status page.
2. Roll back to the previous Vercel deployment if frontend is degraded.
3. Use Supabase PITR to restore data if a migration causes data loss.
4. Post-mortem template stored in this directory should be duplicated and filled within 24 hours.

## Backups
- Supabase PITR retention: 7 days (free) / 30 days (pro). Export weekly snapshots to S3-compatible storage for redundancy.
- Store `/supabase` migrations under version control; never hotfix schemas from the dashboard without scripts.
