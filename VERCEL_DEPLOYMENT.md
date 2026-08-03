# Vercel Deployment Guide

This project is deployed on Vercel with automatic deployments from GitHub.

## How It Works

### Automatic Deployment

- Every push to the `main` branch automatically deploys to Vercel
- Pull requests create preview deployments
- No manual deployment needed

### Current URLs

- **Production**: Check the Vercel project dashboard for the live URL
- **Preview**: Auto-generated per pull request

## Access Protection

The app is gated by a **server-side password** (middleware + HttpOnly cookie).

### Configure on Vercel

In the Vercel project → Settings → Environment Variables, set:

| Variable | Notes |
|----------|-------|
| `SITE_ACCESS_PASSWORD` | Shared access password |
| `AUTH_SECRET` | Long random secret for signing session cookies |
| `OPENAI_API_KEY` | Required for AI search intent |
| `ANTHROPIC_API_KEY` | Required for NowAssist chat |

Never commit real secrets. Do not put the password in source or docs.

### To change the password

1. Update `SITE_ACCESS_PASSWORD` in Vercel (and locally in `.env.local`)
2. Redeploy (or wait for the next push to `main`)

## Local Development

```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev
npm run build
npm start
```

## Project Structure

- `src/` — Source code
- `src/components/` — React components
- `src/app/` — Next.js App Router pages and API routes
- `src/middleware.ts` — Auth gate
- `public/` — Static assets

## Configuration Files

- `next.config.ts` — Next.js configuration
- `tailwind.config.js` — Tailwind CSS configuration
- `package.json` — Dependencies and scripts

## Deployment

### Automatic (recommended)

- Push to `main` → production deploy
- Open a PR → preview deploy

### Manual

```bash
npm i -g vercel
vercel --prod
```

## Security Features

- Server-side password check (`POST /api/auth/login`)
- Signed HttpOnly session cookie
- Middleware protection for pages and `/api/*` (except login)
- Zod validation + basic rate limiting on search APIs

## Features

- Product catalog and comparison
- Demo shopping cart / checkout / orders (`localStorage`)
- AI-assisted search
- Responsive Tailwind UI

## Support

- Vercel Dashboard: https://vercel.com/dashboard
- GitHub Repository: https://github.com/emonterrubio/omni-shop
- Local Development: `npm run dev`
