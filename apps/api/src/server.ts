import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import fastifyStatic from '@fastify/static';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { db, initSusceptibility } from './db.js';
import { apiCache } from './cache.js';
import { ScammerStateMachine } from './scammerBot.js';
import { ScamCoach } from './coachBot.js';
import { LearnerModel } from './learnerModel.js';
import {
  SCENARIO_FIXTURES,
  TACTIC_DEFINITIONS,
  ScamTactic,
  DashboardMetrics
} from '@antibody/shared';

const JWT_SECRET = process.env.JWT_SECRET || 'antibody-dev-secret-change-in-prod-12345';
const PORT = Number(process.env.PORT) || 4000;
const ALLOWED_ORIGINS = (
  process.env.CORS_ORIGINS ||
  'http://localhost:3000,http://127.0.0.1:3000,http://localhost:4000,https://antibody-lab.org'
)
  .split(',')
  .map((o) => o.trim());

function sanitizeText(input: string): string {
  return input.replace(/[<>]/g, '').replace(/[\u0000-\u001F\u007F]/g, '').trim();
}

function verifyBearerToken(authHeader?: string): { agentId: string; sessionId?: string } | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(authHeader.slice(7), JWT_SECRET) as { agentId: string; sessionId?: string };
  } catch {
    return null;
  }
}

export function buildServer() {
  const app = Fastify({
    logger: process.env.NODE_ENV !== 'test',
    bodyLimit: 65536
  });

  app.setErrorHandler((error, req, reply) => {
    req.log.error(error);
    const statusCode = error.statusCode && error.statusCode >= 400 ? error.statusCode : 500;
    reply.status(statusCode).send({
      error: statusCode >= 500 ? 'Internal server error' : error.message
    });
  });

  const coach = new ScamCoach();

  app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'blob:'],
        scriptSrc: ["'self'"]
      }
    }
  });

  app.register(cors, {
    origin: (origin, cb) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error('Origin not allowed by CORS'), false);
      }
    },
    credentials: true
  });

  app.register(cookie, {
    secret: JWT_SECRET
  });

  app.register(rateLimit, {
    max: 120,
    timeWindow: '1 minute'
  });

  // Health check for real terminal probe
  app.get('/api/v1/health', async () => {
    return {
      status: 'ok',
      service: 'antibody-terminal-api',
      timestamp: new Date().toISOString(),
      offlineCapable: true,
      specimensCount: SCENARIO_FIXTURES.length
    };
  });

  // Auth: Guest Session
  app.post('/api/v1/auth/guest', async (req, reply) => {
    const id = nanoid(12);
    const guestCallsign = `Agent-${nanoid(5).toUpperCase()}`;
    const now = new Date().toISOString();
    const avatar = 'variant_default';

    db.prepare(`
      INSERT INTO agents (id, callsign, passphrase_hash, avatar, is_guest, created_at, last_seen_at)
      VALUES (?, ?, NULL, ?, 1, ?, ?)
    `).run(id, guestCallsign, avatar, now, now);

    initSusceptibility(id);

    // Create session
    const sessionId = nanoid(16);
    db.prepare(`
      INSERT INTO sessions (id, agent_id, started_at, locale)
      VALUES (?, ?, ?, 'bn')
    `).run(sessionId, id, now);

    const token = jwt.sign({ agentId: id, sessionId }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ agentId: id, type: 'refresh' }, JWT_SECRET, { expiresIn: '7d' });

    reply.setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });

    return {
      token,
      agent: {
        id,
        callsign: guestCallsign,
        avatar,
        isGuest: true,
        createdAt: now,
        lastSeenAt: now
      }
    };
  });

  // Auth: Register with Callsign + 3-Word Passphrase
  app.post('/api/v1/auth/register', {
    config: { rateLimit: { max: 15, timeWindow: '1 minute' } }
  }, async (req, reply) => {
    const bodySchema = z.object({
      callsign: z.string().min(3).max(30),
      passphrase: z.string().min(6),
      avatar: z.string().default('variant_1')
    });

    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid payload', details: parsed.error });
    }

    const callsign = sanitizeText(parsed.data.callsign);
    const { passphrase, avatar } = parsed.data;
    if (callsign.length < 3) {
      return reply.status(400).send({ error: 'Callsign must be at least 3 valid characters.' });
    }
    const existing = db.prepare('SELECT id FROM agents WHERE callsign = ?').get(callsign);
    if (existing) {
      return reply.status(409).send({ error: 'That callsign is already registered. Pick another.' });
    }

    const hash = await argon2.hash(passphrase);
    const id = nanoid(12);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO agents (id, callsign, passphrase_hash, avatar, is_guest, created_at, last_seen_at)
      VALUES (?, ?, ?, ?, 0, ?, ?)
    `).run(id, callsign, hash, avatar, now, now);

    initSusceptibility(id);

    const sessionId = nanoid(16);
    db.prepare(`
      INSERT INTO sessions (id, agent_id, started_at, locale)
      VALUES (?, ?, ?, 'bn')
    `).run(sessionId, id, now);

    const token = jwt.sign({ agentId: id, sessionId }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ agentId: id, type: 'refresh' }, JWT_SECRET, { expiresIn: '7d' });

    reply.setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });

    return {
      token,
      agent: {
        id,
        callsign,
        avatar,
        isGuest: false,
        createdAt: now,
        lastSeenAt: now
      }
    };
  });

  // Auth: Login with Callsign + Passphrase
  app.post('/api/v1/auth/login', {
    config: { rateLimit: { max: 15, timeWindow: '1 minute' } }
  }, async (req, reply) => {
    const bodySchema = z.object({
      callsign: z.string(),
      passphrase: z.string()
    });

    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid payload' });
    }

    const { callsign, passphrase } = parsed.data;
    const user = db.prepare('SELECT * FROM agents WHERE callsign = ?').get(callsign) as any;
    if (!user || !user.passphrase_hash) {
      return reply.status(401).send({ error: 'Invalid callsign or passphrase.' });
    }

    const match = await argon2.verify(user.passphrase_hash, passphrase);
    if (!match) {
      return reply.status(401).send({ error: 'Invalid callsign or passphrase.' });
    }

    const now = new Date().toISOString();
    db.prepare('UPDATE agents SET last_seen_at = ? WHERE id = ?').run(now, user.id);

    const sessionId = nanoid(16);
    db.prepare('INSERT INTO sessions (id, agent_id, started_at) VALUES (?, ?, ?)').run(sessionId, user.id, now);

    const token = jwt.sign({ agentId: user.id, sessionId }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ agentId: user.id, type: 'refresh' }, JWT_SECRET, { expiresIn: '7d' });

    reply.setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });

    return {
      token,
      agent: {
        id: user.id,
        callsign: user.callsign,
        avatar: user.avatar,
        isGuest: false,
        createdAt: user.created_at,
        lastSeenAt: now
      }
    };
  });

  // Auth: Logout
  app.post('/api/v1/auth/logout', async (_req, reply) => {
    reply.clearCookie('refreshToken', { path: '/' });
    return { success: true };
  });

  // Auth: Passphrase Reset / Rotation (requires current passphrase)
  app.post('/api/v1/auth/reset-passphrase', {
    config: { rateLimit: { max: 10, timeWindow: '1 minute' } }
  }, async (req, reply) => {
    const bodySchema = z.object({
      callsign: z.string().min(3),
      currentPassphrase: z.string().min(6),
      newPassphrase: z.string().min(6)
    });
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Valid callsign, current passphrase, and new passphrase (6+ chars) required.' });
    }
    const { callsign, currentPassphrase, newPassphrase } = parsed.data;
    const user = db.prepare('SELECT * FROM agents WHERE callsign = ?').get(callsign) as any;
    if (!user || !user.passphrase_hash) {
      return reply.status(401).send({ error: 'Invalid callsign or passphrase.' });
    }
    const match = await argon2.verify(user.passphrase_hash, currentPassphrase);
    if (!match) {
      return reply.status(401).send({ error: 'Current passphrase does not match.' });
    }
    const newHash = await argon2.hash(newPassphrase);
    db.prepare('UPDATE agents SET passphrase_hash = ? WHERE id = ?').run(newHash, user.id);
    return { success: true, message: 'Passphrase rotated securely.' };
  });

  // Auth: Optional Email Verification (privacy-safe token flow)
  const pendingEmailTokens = new Map<string, { email: string; expiresAt: number }>();

  app.post('/api/v1/auth/verify-email', {
    config: { rateLimit: { max: 10, timeWindow: '1 minute' } }
  }, async (req, reply) => {
    const bodySchema = z.object({ email: z.string().email() });
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Please enter a valid email address.' });
    }
    const code = nanoid(6).toUpperCase();
    pendingEmailTokens.set(code, { email: parsed.data.email, expiresAt: Date.now() + 15 * 60 * 1000 });
    return {
      success: true,
      message: 'Verification code generated (simulation mode: no external email sent).',
      simulationCode: process.env.NODE_ENV !== 'production' ? code : undefined
    };
  });

  app.post('/api/v1/auth/confirm-email', async (req, reply) => {
    const bodySchema = z.object({ code: z.string().min(4) });
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Verification code required.' });
    }
    const entry = pendingEmailTokens.get(parsed.data.code.toUpperCase());
    if (!entry || entry.expiresAt < Date.now()) {
      return reply.status(400).send({ error: 'Invalid or expired verification code.' });
    }
    pendingEmailTokens.delete(parsed.data.code.toUpperCase());
    return { success: true, verified: true };
  });

  // Privacy-First Analytics (aggregate non-PII stage events)
  app.post('/api/v1/analytics/event', async (req, reply) => {
    const bodySchema = z.object({
      event: z.string().min(1).max(64),
      stage: z.string().max(64).optional()
    });
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid analytics payload' });
    }
    db.prepare('INSERT INTO audit_events (id, agent_id, type, created_at) VALUES (?, NULL, ?, ?)').run(
      nanoid(12),
      `analytics:${parsed.data.event}:${parsed.data.stage || 'none'}`,
      new Date().toISOString()
    );
    return { ok: true };
  });

  // Contact Form submission (rate-limited, sanitized)
  app.post('/api/v1/contact', {
    config: { rateLimit: { max: 10, timeWindow: '1 minute' } }
  }, async (req, reply) => {
    const bodySchema = z.object({
      name: z.string().max(60).optional(),
      message: z.string().min(5).max(1000)
    });
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Message must be between 5 and 1000 characters.' });
    }
    const cleanName = sanitizeText(parsed.data.name || 'Visitor');
    const cleanMsg = sanitizeText(parsed.data.message);
    db.prepare('INSERT INTO audit_events (id, agent_id, type, created_at) VALUES (?, NULL, ?, ?)').run(
      nanoid(12),
      `contact:${cleanName.slice(0, 24)}`,
      new Date().toISOString()
    );
    req.log.info({ from: cleanName, length: cleanMsg.length }, 'Contact form submitted');
    return { success: true };
  });

  // Error Tracking Telemetry (sanitized, zero-PII)
  app.post('/api/v1/telemetry/error', async (req, reply) => {
    const bodySchema = z.object({
      message: z.string().min(1).max(300),
      source: z.string().max(120).optional()
    });
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid telemetry payload' });
    }
    req.log.error({ clientError: parsed.data.message, source: parsed.data.source }, 'Client error reported');
    return { logged: true };
  });

  // User: Delete My Data (hard-delete everything)
  app.delete('/api/v1/me', async (req, reply) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return reply.status(401).send({ error: 'Missing token' });
    }

    try {
      const decoded = jwt.verify(authHeader.replace('Bearer ', ''), JWT_SECRET) as any;
      const agentId = decoded.agentId;

      db.prepare('DELETE FROM agents WHERE id = ?').run(agentId);
      reply.clearCookie('refreshToken');

      return { success: true, message: 'All agent records purged completely.' };
    } catch {
      return reply.status(401).send({ error: 'Invalid token' });
    }
  });

  // Scenarios: Next scenario adaptive selection
  app.post('/api/v1/scenarios/next', async (req, reply) => {
    let agentId = 'guest';
    const authHeader = req.headers.authorization;
    if (authHeader) {
      try {
        const decoded = jwt.verify(authHeader.replace('Bearer ', ''), JWT_SECRET) as any;
        agentId = decoded.agentId;
      } catch {}
    }

    const weakestTactic = LearnerModel.getWeakestTactic(agentId);
    // Find scenario matching the weakest tactic or fallback
    let candidate = SCENARIO_FIXTURES.find((s) => s.tactics.includes(weakestTactic));
    if (!candidate) {
      candidate = SCENARIO_FIXTURES[Math.floor(Math.random() * SCENARIO_FIXTURES.length)];
    }

    return { scenario: candidate, recommendedTacticTarget: weakestTactic };
  });

  // Scenarios: Answer and score attempt
  app.post('/api/v1/scenarios/:id/answer', async (req, reply) => {
    const bodySchema = z.object({
      action: z.enum(['block', 'allow', 'challenge']),
      timeMs: z.number().default(1000)
    });

    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid response action' });
    }

    const { id } = req.params as { id: string };
    const scenario = SCENARIO_FIXTURES.find((s) => s.id === id) || SCENARIO_FIXTURES[0];
    const { action, timeMs } = parsed.data;

    let correct = false;
    let isFalseAlarm = false;

    if (scenario.legitimacy === 'scam') {
      correct = action === 'block' || action === 'challenge';
    } else {
      correct = action === 'allow';
      if (action === 'block') {
        isFalseAlarm = true;
      }
    }

    let agentId = 'guest';
    let sessionId = 'session_guest';
    const authHeader = req.headers.authorization;
    if (authHeader) {
      try {
        const decoded = jwt.verify(authHeader.replace('Bearer ', ''), JWT_SECRET) as any;
        agentId = decoded.agentId;
        sessionId = decoded.sessionId || 'session_default';
      } catch {}
    }

    const attemptId = nanoid(14);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO attempts (id, session_id, scenario_id, response, correct, time_ms, tactic_flags, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      attemptId,
      sessionId,
      scenario.id,
      action,
      correct ? 1 : 0,
      timeMs,
      JSON.stringify(scenario.tactics),
      now
    );

    // Update Bayesian learner model
    for (const tactic of scenario.tactics) {
      LearnerModel.recordAttempt(agentId, tactic, !correct);
    }

    return {
      attemptId,
      correct,
      isFalseAlarm,
      explanation: scenario.content.contextNotes,
      annotations: scenario.content.dialogue.flatMap((d) => d.annotations || []),
      tactics: scenario.tactics
    };
  });

  // Dashboard / Progress metrics (strictly authenticated, row-level scoped by JWT agentId)
  const getDashboardHandler = async (req: any, reply: any) => {
    const decoded = verifyBearerToken(req.headers.authorization);
    if (!decoded) {
      return reply.status(401).send({ error: 'Authentication required' });
    }
    const agentId = decoded.agentId;

    const agent = (db.prepare('SELECT * FROM agents WHERE id = ?').get(agentId) as any) || {
      id: agentId,
      callsign: 'Guest Agent',
      avatar: 'curious',
      is_guest: 1,
      created_at: new Date().toISOString(),
      last_seen_at: new Date().toISOString()
    };

    const attempts = db
      .prepare(`
        SELECT a.*
        FROM attempts a
        INNER JOIN sessions s ON a.session_id = s.id
        WHERE s.agent_id = ?
        ORDER BY a.created_at DESC
        LIMIT 50
      `)
      .all(agentId) as any[];

    const totalAttempts = attempts.length;
    const correctCatches = attempts.filter((a) => a.correct === 1).length;
    const falseAlarms = attempts.filter((a) => a.response === 'block' && a.correct === 0).length;
    const accuracyRate = totalAttempts > 0 ? Math.round((correctCatches / totalAttempts) * 100) : 100;

    let streak = 0;
    for (const a of attempts) {
      if (a.correct === 1) streak++;
      else break;
    }

    const susceptibility = LearnerModel.getSusceptibilityScores(agentId);

    const dashboard: DashboardMetrics = {
      agent: {
        id: agent.id,
        callsign: agent.callsign,
        avatar: agent.avatar,
        isGuest: Boolean(agent.is_guest),
        createdAt: agent.created_at,
        lastSeenAt: agent.last_seen_at
      },
      totalAttempts,
      correctCatches,
      falseAlarms,
      accuracyRate,
      streak,
      susceptibility,
      recentAttempts: attempts.slice(0, 5).map((a) => {
        const matched = SCENARIO_FIXTURES.find((sc) => sc.id === a.scenario_id);
        return {
          scenarioId: a.scenario_id,
          legitimacy: matched ? matched.legitimacy : 'scam',
          playerAction: a.response,
          correct: a.correct === 1,
          tactics: JSON.parse(a.tactic_flags || '[]'),
          timestamp: a.created_at
        };
      })
    };

    return dashboard;
  };

  app.get('/api/v1/me/dashboard', getDashboardHandler);
  app.get('/api/v1/me/progress', getDashboardHandler);

  // Bot 1: Scammer Bot live stream / next turn
  app.get('/api/v1/bot/scammer/stream', async (req, reply) => {
    reply.raw.setHeader('Content-Type', 'text/event-stream');
    reply.raw.setHeader('Cache-Control', 'no-cache');
    reply.raw.setHeader('Connection', 'keep-alive');

    const stateMachine = new ScammerStateMachine(Date.now());
    const openMsg = stateMachine.getOpeningMessage();

    reply.raw.write(`data: ${JSON.stringify(openMsg)}\n\n`);

    const interval = setTimeout(() => {
      const turn2 = stateMachine.nextTurn('challenge');
      reply.raw.write(`data: ${JSON.stringify(turn2)}\n\n`);
    }, 2000);

    req.raw.on('close', () => {
      clearTimeout(interval);
    });
  });

  // Bot 2: Scam Coach explanation endpoint
  app.post('/api/v1/bot/coach/ask', async (req, reply) => {
    const bodySchema = z.object({
      message: z.string().min(1).max(1000)
    });

    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Message payload required' });
    }

    const advice = await coach.explainWithCoach(parsed.data.message);
    return advice;
  });

  // Content: Antibodies taxonomy (cached)
  app.get('/api/v1/content/antibodies', async (_req, reply) => {
    reply.header('Cache-Control', 'public, max-age=3600');
    const cached = apiCache.get<{ tactics: typeof TACTIC_DEFINITIONS }>('antibodies');
    if (cached) return cached;
    const payload = { tactics: TACTIC_DEFINITIONS };
    apiCache.set('antibodies', payload, 60 * 60 * 1000);
    return payload;
  });

  // Serve built web client in production
  const webDistCandidates = [
    path.resolve(process.cwd(), '../web/dist'),
    path.resolve(process.cwd(), 'apps/web/dist')
  ];
  const webDistDir = webDistCandidates.find((p) => fs.existsSync(p));
  if (webDistDir) {
    app.register(fastifyStatic, {
      root: webDistDir,
      prefix: '/'
    });
    app.setNotFoundHandler((req, reply) => {
      if (req.url.startsWith('/api/')) {
        return reply.status(404).send({ error: 'Not found' });
      }
      return reply.sendFile('index.html');
    });
  }

  return app;
}

if (process.env.NODE_ENV !== 'test') {
  const server = buildServer();
  server.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Antibody API server operational at ${address}`);
  });
}
