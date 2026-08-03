# Omni Shop

Internal/demo IT equipment storefront built with Next.js App Router, React 19, TypeScript, and Tailwind CSS.

Cart, checkout, and orders are **demo-only** and persist in the browser via `localStorage` (not a real backend or payment system).

## Prerequisites

- Node.js 20+
- npm

## Setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Purpose |
|----------|---------|
| `OPENAI_API_KEY` | Powers `/api/search-intent` |
| `ANTHROPIC_API_KEY` | Powers NowAssist chat (`/api/nowassist`) |
| `SITE_ACCESS_PASSWORD` | Password required to access the app |
| `AUTH_SECRET` | Signs the HttpOnly session cookie (use a long random string) |

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Unauthenticated visits redirect to `/login`.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |

## Architecture notes

- **Auth:** Middleware + signed HttpOnly cookie (`SITE_ACCESS_PASSWORD` / `AUTH_SECRET`). Password is never shipped to the client bundle.
- **Catalog:** Static data under `src/data/`; shared helpers in `src/data/products.ts`.
- **Search:** Local scoring via `/api/ai-product-search`; OpenAI intent parsing via `/api/search-intent` (rate-limited, Zod-validated).
- **NowAssist:** Floating chat (bottom-right) powered by Claude. Try: “I need a laptop for video editing”.
- **UI:** Custom Tailwind components (not ShadCN).

## Deployment (Vercel)

Set the same env vars in the Vercel project settings. See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md).

## Known follow-ups

- Next.js 15.x reaches end-of-life on **October 21, 2026** — plan a Next.js 16 upgrade after this remediation pass.
- In-memory API rate limits reset on cold starts and are not shared across instances (adequate for a demo gate only).
