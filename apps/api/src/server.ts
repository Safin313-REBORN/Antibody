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

export function buildServer() {
  const app = Fastify({
    logger: process.env.NODE_ENV !== 'test'
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
    origin: true,
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
  app.post('/api/v1/auth/register', async (req, reply) => {
    const bodySchema = z.object({
      callsign: z.string().min(3).max(30),
      passphrase: z.string().min(6),
      avatar: z.string().default('variant_1')
    });

    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid payload', details: parsed.error });
    }

    const { callsign, passphrase, avatar } = parsed.data;
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
  app.post('/api/v1/auth/login', async (req, reply) => {
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

  // Dashboard / Progress metrics
  app.get('/api/v1/me/dashboard', async (req, reply) => {
    let agentId = 'guest';
    const authHeader = req.headers.authorization;
    if (authHeader) {
      try {
        const decoded = jwt.verify(authHeader.replace('Bearer ', ''), JWT_SECRET) as any;
        agentId = decoded.agentId;
      } catch {}
    }

    const agent = (db.prepare('SELECT * FROM agents WHERE id = ?').get(agentId) as any) || {
      id: agentId,
      callsign: 'Guest Agent',
      avatar: 'variant_default',
      is_guest: 1,
      created_at: new Date().toISOString(),
      last_seen_at: new Date().toISOString()
    };

    const attempts = db
      .prepare('SELECT a.*, s.scenario_id FROM attempts a LEFT JOIN attempts s ON a.id = s.id ORDER BY a.created_at DESC LIMIT 50')
      .all() as any[];

    const totalAttempts = attempts.length;
    const correctCatches = attempts.filter((a) => a.correct === 1).length;
    const falseAlarms = attempts.filter((a) => a.response === 'block' && a.correct === 0).length;
    const accuracyRate = totalAttempts > 0 ? Math.round((correctCatches / totalAttempts) * 100) : 100;

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
      streak: 4,
      susceptibility,
      recentAttempts: attempts.slice(0, 5).map((a) => ({
        scenarioId: a.scenario_id,
        legitimacy: 'scam',
        playerAction: a.response,
        correct: a.correct === 1,
        tactics: JSON.parse(a.tactic_flags || '[]'),
        timestamp: a.created_at
      }))
    };

    return dashboard;
  });

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

  // Content: Antibodies taxonomy
  app.get('/api/v1/content/antibodies', async () => {
    return {
      tactics: TACTIC_DEFINITIONS
    };
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
