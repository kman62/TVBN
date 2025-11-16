# Operational Runbooks

This document captures the production-readiness practices that keep TVBN healthy. Every
runbook is designed for on-call engineers who need quick, actionable steps.

## Backup Strategy

1. **Supabase database snapshots**
   - Nightly logical backups using `supabase db dump --local` are pushed to an encrypted
     storage bucket (`s3://tvbn-backups`).
   - Retention: 14 nightly, 8 weekly, 6 monthly snapshots. Lifecycle policies purge older
     archives automatically.
   - Before schema migrations, trigger `npm run backup:manual` (see Supabase CLI target in
     `supabase/config.toml`) to capture a pre-change snapshot and verify its checksum.
2. **Object storage**
   - Vercel assets are immutable, but user uploads (if any) are synced to the same backup
     bucket using versioned folders per release.
3. **Disaster recovery drills**
   - Quarterly restore tests spin up a temporary Supabase project, import the latest backup,
     and execute smoke tests via `npm run test` to validate data integrity.

## Monitoring and Observability

1. **Frontend (Vercel)**
   - Enable Vercel Analytics + Web Vitals. Alerts trigger if Core Web Vitals regress >10%
     week-over-week.
   - Synthetic availability checks run every 5 minutes from 3 regions via an external
     service (e.g., Checkly). Threshold: alert after 2 consecutive failures.
2. **Backend (Supabase)**
   - Supabase logs are streamed to the central observability stack (OpenTelemetry + Grafana
     Loki). Dashboards track request latency, auth failures, and Postgres health metrics.
   - Use Supabase Status webhooks for incident awareness; alerts fan out to Slack `#alerts`
     via PagerDuty.
3. **User analytics**
   - Client metrics are forwarded to a privacy-safe provider (e.g., PostHog) with sampling
     to minimize noise. Dashboards highlight funnel conversion and error boundaries.

## Incident Response

1. **Triage**
   - A shared rotation receives PagerDuty alerts. The primary acknowledges within 5 minutes
     and opens a Slack incident channel (`#inc-{ticket}`) using the response bot template.
2. **Stabilize**
   - If the issue impacts frontend only, pause Vercel deployments with `vercel env pull` to
     fetch last-known-good settings, then redeploy the previous build via `vercel deploy --prod --archive`.
   - For database incidents, promote the most recent replica or restore the latest verified
     backup. Coordinate with Supabase support if replication lag exceeds 10 minutes.
3. **Communicate**
   - Provide customer-facing updates every 30 minutes in the status page. Internal notes are
     captured in the incident doc (Google Doc template linked from the on-call SOP).
4. **Post-incident**
   - Complete a blameless retrospective within 5 business days. Document action items in
     the `docs/incident-history/` folder and track them as GitHub issues.
