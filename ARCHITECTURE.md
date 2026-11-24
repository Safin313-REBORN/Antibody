# ARCHITECTURE & SPECIFICATIONS: ANTIBODY (অ্যান্টিবডি)

## System Architecture
```
                         +-----------------------+
                         |      Web Client       |
                         |   (React 18 + Vite)   |
                         +-----------+-----------+
                                     |
                          REST & SSE | JSON / Cookies
                                     v
                         +-----------------------+
                         |     Fastify API       |
                         |  (Node 22+ TypeScript)|
                         +-----+-----------+-----+
                               |           |
             +-----------------+           +-----------------+
             v                                               v
+------------------------+                     +------------------------+
|  SQLite / WAL Database |                     |   Deterministic Bots   |
|  - Agents & Sessions   |                     |  - Scammer State Mach. |
|  - Bayesian Learner    |                     |  - Grounded Coach Bot  |
+------------------------+                     +------------------------+
```

## Data Model & Backups
- `agents`: Callsign, Argon2id passphrase hash, avatar mood, guest flag.
- `sessions`: Session UUID, agent ID, started/ended times, locale.
- `attempts`: Player action, correctness, latency ms, tactic flags.
- `susceptibility`: Beta distribution parameters (`alpha`, `beta`, `encounters`) per scam tactic.
- `audit_events`: Non-PII aggregate analytics and security events.
- **Backups**: Online SQLite snapshots via `pnpm --filter @antibody/api db:backup` (`apps/api/src/backup.ts`).

## API Reference (`/api/v1`)
- `GET /health` — Server health & specimen count.
- `POST /auth/guest`, `POST /auth/register`, `POST /auth/login`, `POST /auth/logout` — Authentication.
- `POST /auth/reset-passphrase` — Authenticated/current-phrase passphrase rotation.
- `POST /auth/verify-email`, `POST /auth/confirm-email` — Optional privacy-safe email verification.
- `DELETE /me` — Hard-deletes all records for the authenticated agent.
- `GET /me/progress`, `GET /me/dashboard` — Row-level scoped (`WHERE agent_id = ?`) Bayesian metrics.
- `POST /scenarios/next`, `POST /scenarios/:id/answer` — Adaptive scenario selection & scoring.
- `GET /bot/scammer/stream` — SSE stream for deterministic Scammer Bot.
- `POST /bot/coach/ask` — Grounded Scam Coach classifier & explainer.
- `GET /content/antibodies` — Bilingual tactic & defense taxonomy.
- `POST /analytics/event`, `POST /telemetry/error` — Zero-PII stage analytics & client error telemetry.

## Security & Threat Notes
- **Row-Level Ownership**: All `/me/*` and deletion queries scope strictly by `agentId` from verified JWTs.
- **Bot Guardrails**: Scammer Bot is a deterministic state machine with fictional brands only; Scam Coach treats pasted messages strictly as untrusted data and includes official-helpline reminders.
- **Hardening**: Argon2id hashing, Helmet CSP, strict CORS, per-route rate limiting (`15/min` on auth, `10/min` on reset/verify), and zero frontend API keys.
