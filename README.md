# TVBN

This repository now includes the tooling needed for production-ready workflows:

- **Linting & formatting** powered by ESLint + Prettier.
- **Testing** with Vitest and Testing Library for React components.
- **Automated CI/CD** via GitHub Actions that installs dependencies, runs lint/tests, and
  deploys to Vercel/Supabase when `main` receives new commits.
- **Environment configuration** files for Vercel (`vercel.json`) and Supabase
  (`supabase/config.toml`) plus sample secrets.
- **Operational runbooks** under `docs/` to describe backups, monitoring, and incident
  response.

## Getting Started

```bash
npm install
npm run lint
npm run test
```

Additional scripts:

| Command | Purpose |
| --- | --- |
| `npm run lint:fix` | Auto-fix lint errors when possible. |
| `npm run format` | Apply Prettier formatting to the repo. |
| `npm run format:check` | Validate formatting without changing files. |
| `npm run test:coverage` | Run Vitest with coverage reporting. |
| `npm run typecheck` | Run TypeScript in `--noEmit` mode. |

See `docs/deployment-pipeline.md` for a full walkthrough of the CI/CD process and
`docs/operational-runbooks.md` for operational procedures.
