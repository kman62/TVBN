# Operational Practices

This document covers the shared operational playbook for the TVBN frontend (Vercel) and backend (Supabase) environments.

## Monitoring

- **Frontend (Vercel)**
  - Enable Vercel Analytics and Web Vitals for every project and monitor them via the Vercel dashboard.
  - Capture build status notifications through GitHub checks. Preview deployments report their status automatically in pull requests.
  - Use a third-party uptime monitor (e.g., Better Stack or UptimeRobot) that hits the production URL every minute. Alerts route to the #alerts Slack channel.
- **Backend (Supabase)**
  - Enable Supabase logs ingestion to your preferred observability platform (e.g., Logflare or DataDog) for long-term retention.
  - Monitor database and auth metrics directly within the Supabase dashboard. Set alerts for CPU usage > 80% sustained over five minutes.
  - Use Supabase Edge Function logs to trace slow API responses.

## Backups

- Supabase automatically takes daily WAL backups. Enable point-in-time recovery (PITR) on the project and perform a weekly snapshot validation by restoring into a temporary instance.
- Export storage buckets weekly using the Supabase CLI `supabase storage list` + `supabase storage download` commands and keep the artifacts in an encrypted S3 bucket.
- For frontend assets served by Vercel, keep the generated `dist/` folder artifacts in GitHub Releases for each tagged version so you can roll back quickly.

## Incident Response

1. **Triage** – Use monitoring alerts to determine blast radius. Acknowledge the incident in Slack within 5 minutes.
2. **Mitigation** – Roll back via Vercel deployment reverts or Supabase PITR restore depending on the affected layer.
3. **Communication** – Update the status page and open an incident ticket that includes a timeline, mitigation details, and action items.
4. **Postmortem** – Within 48 hours, complete a blameless postmortem stored in `/docs/incidents/<date>-<slug>.md`.

## Runbooks

- **Schema changes** – Run `npm run lint && npm run test` locally, then push migrations through Supabase CLI (`supabase db push`). CI blocks merges until lint/tests pass.
- **Environment variables** – All secrets live in GitHub (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD`). Preview secrets mirror production but use sandboxed resources.
- **Access** – Limit Vercel and Supabase admin roles to the platform team. Rotate tokens every 90 days and revoke access for offboarded users immediately.
