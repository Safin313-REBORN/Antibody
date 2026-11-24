import { db, initSusceptibility } from './db.js';
import { ScamTactic, SusceptibilityScore } from '@antibody/shared';

export class LearnerModel {
  // Update Beta distribution parameters on observation
  // if correct (identified or avoided correctly): beta += 1 (decreases susceptibility)
  // if incorrect (fell for scam or false alarm on legitimate): alpha += 1 (increases susceptibility)
  public static recordAttempt(
    agentId: string,
    tactic: ScamTactic,
    wasVulnerable: boolean
  ): void {
    initSusceptibility(agentId);

    const row = db
      .prepare('SELECT alpha, beta, encounters FROM susceptibility WHERE agent_id = ? AND tactic = ?')
      .get(agentId, tactic) as { alpha: number; beta: number; encounters: number } | undefined;

    let alpha = row ? row.alpha : 1.0;
    let beta = row ? row.beta : 1.0;
    let encounters = row ? row.encounters + 1 : 1;

    if (wasVulnerable) {
      alpha += 1.0;
    } else {
      beta += 1.0;
    }

    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO susceptibility (agent_id, tactic, alpha, beta, encounters, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(agent_id, tactic) DO UPDATE SET
        alpha = excluded.alpha,
        beta = excluded.beta,
        encounters = excluded.encounters,
        updated_at = excluded.updated_at
    `).run(agentId, tactic, alpha, beta, encounters, now);
  }

  public static getSusceptibilityScores(agentId: string): Record<ScamTactic, SusceptibilityScore> {
    initSusceptibility(agentId);

    const rows = db
      .prepare('SELECT tactic, alpha, beta, encounters FROM susceptibility WHERE agent_id = ?')
      .all(agentId) as Array<{ tactic: ScamTactic; alpha: number; beta: number; encounters: number }>;

    const result = {} as Record<ScamTactic, SusceptibilityScore>;

    for (const r of rows) {
      // Mean of Beta(alpha, beta) is alpha / (alpha + beta)
      // Score in 0..100
      const mean = r.alpha / (r.alpha + r.beta);
      const score = Math.round(mean * 100);
      result[r.tactic] = {
        tactic: r.tactic,
        alpha: r.alpha,
        beta: r.beta,
        score,
        encounters: r.encounters
      };
    }

    return result;
  }

  // Select next tactic favoring highest susceptibility or highest uncertainty
  public static getWeakestTactic(agentId: string): ScamTactic {
    const scores = this.getSusceptibilityScores(agentId);
    let highestTactic: ScamTactic = 'urgency';
    let highestScore = -1;

    for (const tactic of Object.keys(scores) as ScamTactic[]) {
      const item = scores[tactic];
      if (item.score > highestScore) {
        highestScore = item.score;
        highestTactic = tactic;
      }
    }

    return highestTactic;
  }
}
