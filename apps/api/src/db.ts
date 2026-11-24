import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { ScamTactic } from '@antibody/shared';

const dbPath = process.env.DATABASE_URL || path.join(process.cwd(), 'data', 'antibody.sqlite');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new Database(dbPath);

// Run migrations and ensure schema
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS agents (
    id TEXT PRIMARY KEY,
    callsign TEXT UNIQUE NOT NULL,
    passphrase_hash TEXT,
    avatar TEXT NOT NULL,
    is_guest INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    last_seen_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    agent_id TEXT NOT NULL,
    started_at TEXT NOT NULL,
    ended_at TEXT,
    locale TEXT NOT NULL DEFAULT 'bn',
    FOREIGN KEY(agent_id) REFERENCES agents(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS attempts (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    scenario_id TEXT NOT NULL,
    response TEXT NOT NULL,
    correct INTEGER NOT NULL,
    time_ms INTEGER NOT NULL,
    tactic_flags TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(session_id) REFERENCES sessions(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS susceptibility (
    agent_id TEXT NOT NULL,
    tactic TEXT NOT NULL,
    alpha REAL NOT NULL DEFAULT 1.0,
    beta REAL NOT NULL DEFAULT 1.0,
    encounters INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL,
    PRIMARY KEY(agent_id, tactic),
    FOREIGN KEY(agent_id) REFERENCES agents(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS audit_events (
    id TEXT PRIMARY KEY,
    agent_id TEXT,
    type TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

export function initSusceptibility(agentId: string) {
  const tactics: ScamTactic[] = ['urgency', 'authority', 'fear', 'greed', 'secrecy', 'trust_hijack'];
  const insert = db.prepare(`
    INSERT OR IGNORE INTO susceptibility (agent_id, tactic, alpha, beta, encounters, updated_at)
    VALUES (?, ?, 1.0, 1.0, 0, ?)
  `);
  const now = new Date().toISOString();
  for (const tactic of tactics) {
    insert.run(agentId, tactic, now);
  }
}

// Indexes to prevent full-table scans and N+1 bottlenecks
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_sessions_agent_id ON sessions(agent_id);
  CREATE INDEX IF NOT EXISTS idx_attempts_session_created ON attempts(session_id, created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_audit_events_created ON audit_events(created_at DESC);
`);
