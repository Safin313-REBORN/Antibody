import { describe, it, expect } from 'vitest';
import { TACTIC_DEFINITIONS, SCENARIO_FIXTURES, LABELED_EVAL_FIXTURES } from '../src/index.js';

describe('@antibody/shared taxonomy & fixtures', () => {
  it('defines all 6 scam tactics with bilingual labels and antibody rules', () => {
    const keys = Object.keys(TACTIC_DEFINITIONS);
    expect(keys).toEqual(['urgency', 'authority', 'fear', 'greed', 'secrecy', 'trust_hijack']);
    for (const key of keys) {
      const def = TACTIC_DEFINITIONS[key as keyof typeof TACTIC_DEFINITIONS];
      expect(def.name.bn.length).toBeGreaterThan(0);
      expect(def.name.en.length).toBeGreaterThan(0);
      expect(def.antibodyRule.action.bn.length).toBeGreaterThan(0);
    }
  });

  it('ships 60+ labeled evaluation fixtures with mixed scam and legitimate cases', () => {
    expect(SCENARIO_FIXTURES.length).toBeGreaterThanOrEqual(6);
    expect(LABELED_EVAL_FIXTURES.length).toBeGreaterThanOrEqual(60);
    const scams = LABELED_EVAL_FIXTURES.filter((s) => s.legitimacy === 'scam');
    const legit = LABELED_EVAL_FIXTURES.filter((s) => s.legitimacy === 'legitimate');
    expect(scams.length).toBeGreaterThan(0);
    expect(legit.length).toBeGreaterThan(0);
  });
});
