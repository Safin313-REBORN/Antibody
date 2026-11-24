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
                         |  (Node 20+ TypeScript)|
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

## Data Model
- `agents`: Callsign, Argon2id passphrase hash, avatar mood, guest flag.
- `sessions`: Session UUID, agent ID, started/ended times, locale.
- `attempts`: Player action, correctness, latency ms, tactic flags.
- `susceptibility`: Beta distribution parameters (alpha, beta, encounters) per scam tactic.
- `audit_events`: Security and privacy event logging without PII.

## Bayesian Learner Model
- Tracks susceptibility via a Beta posterior per tactic:
  $$\text{Susceptibility Score} = 100 \times \frac{\alpha}{\alpha + \beta}$$
- Successful defense increments $\beta$; falling for scams increments $\alpha$.
- The scenario engine adaptively recommends cases matching high-uncertainty tactics.

## Privacy & Security
- Zero email, phone number, real name, or location collection.
- "Delete My Data" cascades and purges all DB traces immediately.
- Argon2id password hashing, strict CSP, CORS protection, rate limiting.
