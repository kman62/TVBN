# TVBN Frontend Platform

This repository houses a minimal Vite + React + TypeScript shell that can be deployed on Vercel and talk to a Supabase backend. The tooling includes ESLint, Prettier, and Vitest with Testing Library so you can build confidently.

## Getting started

```bash
npm install
npm run dev
```

## Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start Vite in development mode. |
| `npm run build` | Type-check the project and produce a production build. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint with the repo rules. |
| `npm run format` | Format the codebase with Prettier. |
| `npm run test` | Execute the Vitest suite once. |
| `npm run test:watch` | Run Vitest in watch mode. |

Environment variables live in `.env` files locally and are provided via GitHub Action secrets in CI/CD. See [`docs/operations.md`](docs/operations.md) for operational practices.
