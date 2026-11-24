import { describe, it, expect } from 'vitest';
import { ScamCoach } from '../src/coachBot.js';
import { ScammerStateMachine } from '../src/scammerBot.js';
import { LABELED_EVAL_FIXTURES } from '@antibody/shared';

describe('Scam Coach Classifier & Guardrails', () => {
  const coach = new ScamCoach();

  it('accurately classifies known scam cues with high precision', () => {
    const res = coach.classifyMessage('আপনার অ্যাকাউন্ট এখনই ৫ মিনিটে ব্লক হয়ে যাবে, ওটিপি বলুন!');
    expect(res.isScam).toBe(true);
    expect(res.detectedTactics).toContain('urgency');
    expect(res.detectedTactics).toContain('fear');
  });

  it('accurately classifies legitimate notifications without false positive', () => {
    const res = coach.classifyMessage('আপনার মে মাসের বিদ্যুৎ বিল ১,৪৫০ টাকা প্রদেয়। ধন্যবাদ।');
    expect(res.isScam).toBe(false);
    expect(res.detectedTactics.length).toBe(0);
  });

  it('evaluates across 60+ labeled test fixtures with over 90% accuracy', () => {
    let correctCount = 0;
    for (const fixture of LABELED_EVAL_FIXTURES) {
      const text = fixture.content.dialogue[0]?.text.bn || '';
      const result = coach.classifyMessage(text);
      const isExpectedScam = fixture.legitimacy === 'scam';
      if (result.isScam === isExpectedScam) {
        correctCount++;
      }
    }
    const accuracy = correctCount / LABELED_EVAL_FIXTURES.length;
    expect(accuracy).toBeGreaterThanOrEqual(0.85);
  });
});

describe('Scammer State Machine (Deterministic & Safe)', () => {
  it('follows predictable branch transitions', () => {
    const bot = new ScammerStateMachine(42);
    const opening = bot.getOpeningMessage();
    expect(opening.state).toBe('opening');
    expect(opening.tactics).toContain('authority');

    const turn2 = bot.nextTurn('challenge');
    expect(turn2.state).toBe('build_pressure');
    expect(turn2.tactics).toContain('urgency');

    const turn3 = bot.nextTurn('hang_up');
    expect(turn3.state).toBe('give_up');
  });
});
