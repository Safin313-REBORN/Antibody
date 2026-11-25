import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { buildServer } from '../src/server.js';
import { db } from '../src/db.js';

describe('Antibody API Integration Tests', () => {
  const app = buildServer();

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/health returns ok and specimen count', async () => {
    const res = await request(app.server).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.specimensCount).toBeGreaterThanOrEqual(6);
  });

  it('supports full guest auth -> answer -> dashboard -> delete lifecycle', async () => {
    const guestRes = await request(app.server).post('/api/v1/auth/guest');
    expect(guestRes.status).toBe(200);
    expect(guestRes.body.token).toBeTruthy();
    expect(guestRes.body.agent.isGuest).toBe(true);

    const token = guestRes.body.token;

    // Answer a scam scenario correctly
    const ansScam = await request(app.server)
      .post('/api/v1/scenarios/scen_01_taka_pay_pin_call/answer')
      .set('Authorization', `Bearer ${token}`)
      .send({ action: 'block', timeMs: 950 });
    expect(ansScam.status).toBe(200);
    expect(ansScam.body.correct).toBe(true);
    expect(ansScam.body.isFalseAlarm).toBe(false);

    // Answer a legitimate scenario with block -> false alarm
    const ansLegit = await request(app.server)
      .post('/api/v1/scenarios/scen_04_legit_utility_bill/answer')
      .set('Authorization', `Bearer ${token}`)
      .send({ action: 'block', timeMs: 800 });
    expect(ansLegit.status).toBe(200);
    expect(ansLegit.body.correct).toBe(false);
    expect(ansLegit.body.isFalseAlarm).toBe(true);

    // Dashboard reflects exact attempts for this agent
    const dashRes = await request(app.server)
      .get('/api/v1/me/dashboard')
      .set('Authorization', `Bearer ${token}`);
    expect(dashRes.status).toBe(200);
    expect(dashRes.body.totalAttempts).toBe(2);
    expect(dashRes.body.correctCatches).toBe(1);
    expect(dashRes.body.falseAlarms).toBe(1);
    expect(dashRes.body.accuracyRate).toBe(50);

    // Delete my data hard-deletes agent AND cascades to sessions, attempts, and susceptibility
    const agentId = guestRes.body.agent.id;
    const delRes = await request(app.server)
      .delete('/api/v1/me')
      .set('Authorization', `Bearer ${token}`);
    expect(delRes.status).toBe(200);
    expect(delRes.body.success).toBe(true);

    const remainingSessions = db.prepare('SELECT COUNT(*) as c FROM sessions WHERE agent_id = ?').get(agentId) as any;
    const remainingSuscept = db.prepare('SELECT COUNT(*) as c FROM susceptibility WHERE agent_id = ?').get(agentId) as any;
    expect(remainingSessions.c).toBe(0);
    expect(remainingSuscept.c).toBe(0);
  });

  it('supports register, duplicate rejection, login, and logout', async () => {
    const callsign = `TestAlien_${Date.now()}`;
    const passphrase = 'river-lamp-seven';

    const regRes = await request(app.server)
      .post('/api/v1/auth/register')
      .send({ callsign, passphrase, avatar: 'proud' });
    expect(regRes.status).toBe(200);
    expect(regRes.body.agent.callsign).toBe(callsign);

    const dupRes = await request(app.server)
      .post('/api/v1/auth/register')
      .send({ callsign, passphrase, avatar: 'curious' });
    expect(dupRes.status).toBe(409);

    const loginRes = await request(app.server)
      .post('/api/v1/auth/login')
      .send({ callsign, passphrase });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeTruthy();

    const logoutRes = await request(app.server).post('/api/v1/auth/logout');
    expect(logoutRes.status).toBe(200);

    // Cleanup
    await request(app.server)
      .delete('/api/v1/me')
      .set('Authorization', `Bearer ${loginRes.body.token}`);
  });

  it('POST /api/v1/bot/coach/ask classifies and explains safely', async () => {
    const res = await request(app.server)
      .post('/api/v1/bot/coach/ask')
      .send({ message: 'জরুরি! আপনার অ্যাকাউন্ট ফ্রিজ হবে, এখনই ওটিপি দিন!' });
    expect(res.status).toBe(200);
    expect(res.body.detectedTactics).toContain('urgency');
    expect(res.body.disclaimer.en).toContain('verified helpline');
  });

  it('supports passphrase rotation, email verification, analytics, and error telemetry', async () => {
    const callsign = `ResetAlien_${Date.now()}`;
    await request(app.server)
      .post('/api/v1/auth/register')
      .send({ callsign, passphrase: 'river-lamp-seven', avatar: 'curious' });

    const resetRes = await request(app.server)
      .post('/api/v1/auth/reset-passphrase')
      .send({ callsign, currentPassphrase: 'river-lamp-seven', newPassphrase: 'breeze-cloud-mango' });
    expect(resetRes.status).toBe(200);
    expect(resetRes.body.success).toBe(true);

    const verifyRes = await request(app.server)
      .post('/api/v1/auth/verify-email')
      .send({ email: 'scout@antibody-lab.org' });
    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.simulationCode).toBeTruthy();

    const confirmRes = await request(app.server)
      .post('/api/v1/auth/confirm-email')
      .send({ code: verifyRes.body.simulationCode });
    expect(confirmRes.status).toBe(200);
    expect(confirmRes.body.verified).toBe(true);

    const analyticsRes = await request(app.server)
      .post('/api/v1/analytics/event')
      .send({ event: 'page_view', stage: 'case_intro' });
    expect(analyticsRes.status).toBe(200);

    const errRes = await request(app.server)
      .post('/api/v1/telemetry/error')
      .send({ message: 'Test client telemetry', source: 'vitest' });
    expect(errRes.status).toBe(200);
  });

  it('enforces 401 on /me/dashboard without token, sanitizes XSS, and caches /content/antibodies', async () => {
    const unauth = await request(app.server).get('/api/v1/me/dashboard');
    expect(unauth.status).toBe(401);

    const xssCallsign = `<b>Ali_${Date.now().toString().slice(-5)}</b>`;
    const reg = await request(app.server)
      .post('/api/v1/auth/register')
      .send({ callsign: xssCallsign, passphrase: 'river-lamp-seven', avatar: 'curious' });
    expect(reg.status).toBe(200);
    expect(reg.body.agent.callsign).not.toContain('<');
    expect(reg.body.agent.callsign).not.toContain('>');

    const cached = await request(app.server).get('/api/v1/content/antibodies');
    expect(cached.status).toBe(200);
    expect(cached.headers['cache-control']).toContain('max-age=3600');

    const contactRes = await request(app.server)
      .post('/api/v1/contact')
      .send({ name: 'Dhaka Tester', message: 'Testing the contact form submission!' });
    expect(contactRes.status).toBe(200);
    expect(contactRes.body.success).toBe(true);

    // Unauthenticated /scenarios/:id/answer works statelessly without foreign key errors
    const statelessAns = await request(app.server)
      .post('/api/v1/scenarios/scen_01_taka_pay_pin_call/answer')
      .send({ action: 'block', timeMs: 500 });
    expect(statelessAns.status).toBe(200);
    expect(statelessAns.body.correct).toBe(true);

    // Refresh token rotation via httpOnly cookie
    const agentWithCookie = request.agent(app.server);
    await agentWithCookie.post('/api/v1/auth/guest');
    const refreshRes = await agentWithCookie.post('/api/v1/auth/refresh');
    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.token).toBeTruthy();
  });
});
