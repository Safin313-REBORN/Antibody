import React, { useState } from 'react';
import { ScamTactic, TACTIC_DEFINITIONS } from '@antibody/shared';
import { AlienCharacter } from './AlienCharacter';
import { SpecimenIcon } from './SpecimenIcon';

interface AntibodyBuilderProps {
  tacticsToSolve: ScamTactic[];
  onAntibodiesReady: () => void;
  lang: 'bn' | 'en';
}

export const AntibodyBuilder: React.FC<AntibodyBuilderProps> = ({
  tacticsToSolve,
  onAntibodiesReady,
  lang
}) => {
  const [pairedRules, setPairedRules] = useState<Record<string, string>>({});
  const [selectedTactic, setSelectedTactic] = useState<ScamTactic | null>(tacticsToSolve[0] || null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePair = (tactic: ScamTactic, ruleId: string) => {
    const expected = TACTIC_DEFINITIONS[tactic].antibodyRule.id;
    if (ruleId !== expected) {
      setFeedback({
        type: 'error',
        text:
          lang === 'bn'
            ? 'এই নিয়মটি নির্বাচিত জীবাণুর সাথে মেলে না। আবার চেষ্টা করুন!'
            : 'That rule does not match the selected pathogen. Try another defense!'
      });
      return;
    }
    setPairedRules((prev) => ({
      ...prev,
      [tactic]: ruleId
    }));
    setFeedback({
      type: 'success',
      text:
        lang === 'bn'
          ? 'সঠিক অ্যান্টিবডি যুক্ত হয়েছে!'
          : 'Antibody locked! Defense rule synthesized.'
    });
  };

  const isComplete = tacticsToSolve.every((t) => pairedRules[t] === TACTIC_DEFINITIONS[t].antibodyRule.id);

  return (
    <div className="max-w-2xl mx-auto my-6 bg-paper hand-border p-6 shadow-ink-lg">
      <div className="border-b-2 border-ink pb-3 mb-4 flex justify-between items-center">
        <div>
          <span className="font-mono text-xs bg-teal text-paper px-2 py-0.5 font-bold uppercase tracking-wider">
            SYNTHESIS LAB // অ্যান্টিবডি প্রস্তুতকরণ
          </span>
          <h1 className="font-serif font-bold text-2xl text-ink mt-1 riso-misregister" data-text="Forge Cognitive Antibodies">
            Forge Cognitive Antibodies
          </h1>
        </div>
        <div className="rubber-stamp rubber-stamp-safe text-xs">
          RULE PROTOCOL
        </div>
      </div>

      <p className="text-sm font-sans text-faded-ink mb-6">
        {lang === 'bn'
          ? 'প্রতিটি স্ক্যাম কৌশলের বিপরীতে সঠিক প্রতিরক্ষা নিয়মটি (অ্যান্টিবডি) যুক্ত করুন। সঠিক নিয়মে যুক্ত হলে এলিয়েনের দেহে রোগ প্রতিরোধ ক্ষমতা জন্ম নেবে।'
          : 'Match each scam pathogen with its precise cognitive antibody rule. Correct pairs fortify the alien’s mental defenses.'}
      </p>

      {feedback && (
        <div
          role={feedback.type === 'error' ? 'alert' : 'status'}
          className={`p-3 mb-4 border-l-4 font-mono text-xs font-bold ${feedback.type === 'error'
            ? 'bg-vermilion/15 border-vermilion text-vermilion'
            : 'bg-teal/15 border-teal text-teal'
            }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Target Specimen Slot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-3">
          <div className="font-mono text-xs font-bold text-ink uppercase">
            1. স্ক্যাম জীবাণু নির্বাচন করুন:
          </div>
          {tacticsToSolve.map((t) => {
            const def = TACTIC_DEFINITIONS[t];
            const isPaired = pairedRules[t] === def.antibodyRule.id;
            return (
              <button
                key={t}
                onClick={() => setSelectedTactic(t)}
                className={`w-full p-3 text-left border-2 border-ink flex items-center justify-between transition-all ${selectedTactic === t
                  ? 'bg-mustard/20 border-mustard font-bold'
                  : 'bg-[#FAF5EC]'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <SpecimenIcon tactic={t} size={28} />
                  <span className="font-mono text-xs">{def.badge[lang]}</span>
                </div>
                {isPaired && (
                  <span className="font-mono text-xs text-teal font-bold">
                    ✓ LOCKED
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Defense Rule Options */}
        <div className="space-y-3">
          <div className="font-mono text-xs font-bold text-ink uppercase">
            2. অ্যান্টিবডি নিয়ম নির্বাচন করুন:
          </div>
          {tacticsToSolve.map((t) => {
            const def = TACTIC_DEFINITIONS[t];
            return (
              <button
                key={def.antibodyRule.id}
                onClick={() => {
                  if (selectedTactic) {
                    handlePair(selectedTactic, def.antibodyRule.id);
                  }
                }}
                className="w-full p-3 text-left bg-paper border-2 border-ink hover:bg-teal/10 transition-all font-mono text-xs group"
              >
                <div className="font-bold text-ink group-hover:text-teal mb-1 flex items-center gap-1.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0E7C7B" strokeWidth="2.5" aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>{def.antibodyRule.mnemonic[lang]}</span>
                </div>
                <div className="text-[11px] text-faded-ink font-sans">
                  {def.antibodyRule.action[lang]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between border-t-2 border-ink pt-4">
        <AlienCharacter mood={isComplete ? 'relieved' : 'curious'} hasAntibody={isComplete} size={80} />

        <button
          onClick={onAntibodiesReady}
          disabled={!isComplete}
          className={`px-6 py-3 font-mono font-bold text-sm border-2 border-ink shadow-ink-blot uppercase tracking-wider transition-all ${isComplete
            ? 'bg-teal text-paper hover:bg-teal/90'
            : 'bg-paper text-faded-ink opacity-50 cursor-not-allowed'
            }`}
        >
          {lang === 'bn' ? 'মিউটেশন রাউন্ড শুরু (Start Mutations) →' : 'Deploy to Field Exam →'}
        </button>
      </div>
    </div>
  );
};
