# ANTIBODY (অ্যান্টিবডি)

A bilingual (Bangla & English) browser game teaching a naive alien—standing in for any first-time digital user—to survive Dhaka's mobile-money and phone scams.

## Quick Start
```bash
# 1. Copy environment variables
cp .env.example .env

# 2. Install dependencies
pnpm install

# 3. Build shared types & run dev servers
pnpm --filter @antibody/shared build
pnpm dev
```

- API Server: `http://localhost:4000/api/v1`
- Web Client: `http://localhost:3000`

## Environment Variables (`.env.example`)
- `PORT`: API server port (default `4000`)
- `NODE_ENV`: `development` | `production` | `test`
- `JWT_SECRET`: Signing secret for access & refresh JWTs
- `DATABASE_URL`: Path to SQLite database file (default `./data/antibody.sqlite`)

## Verification & Database Commands
```bash
# Typecheck all packages
pnpm -r typecheck

# Run all unit & API integration tests
NODE_ENV=test pnpm -r test

# Build all packages for production
pnpm -r build

# Create a live SQLite backup
pnpm --filter @antibody/api db:backup
```

## Docker Deployment
```bash
docker compose up --build
```

## Credits & Licenses
- **Fonts (SIL Open Font License)**: `Tiro Bangla`, `Hind Siliguri`, `Newsreader`, `IBM Plex Mono` via Google Fonts.
- **Libraries**: React 18, Vite, Tailwind CSS, Fastify, Zod, Argon2, better-sqlite3, Vitest, Supertest.
- **Artwork**: Original custom SVG illustrations created for Antibody.
