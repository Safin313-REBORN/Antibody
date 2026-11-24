import React, { useState } from 'react';
import { Scenario, TACTIC_DEFINITIONS, ScamTactic } from '@antibody/shared';
import { SpecimenIcon } from './SpecimenIcon';

interface TacticXRayProps {
  scenario: Scenario;
  onContinueToAntibodies: () => void;
  lang: 'bn' | 'en';
}

export const TacticXRay: React.FC<TacticXRayProps> = ({
  scenario,
  onContinueToAntibodies,
  lang
}) => {
  const [selectedTactic, setSelectedTactic] = useState<ScamTactic | null>(
    scenario.tactics[0] || 'urgency'
  );

  return (
    <div className="max-w-2xl mx-auto my-6 bg-paper hand-border p-6 shadow-ink-lg">
      <div className="border-b-2 border-ink pb-3 mb-4 flex justify-between items-center">
        <div>
          <span className="font-mono text-xs bg-mustard text-ink px-2 py-0.5 font-bold uppercase tracking-wider">
            TACTIC X-RAY // কারসাজি বিশ্লেষণ
          </span>
          <h1 className="font-serif font-bold text-2xl text-ink mt-1 riso-misregister" data-text="Autopsy of the Scam Call">
            Autopsy of the Scam Call
          </h1>
        </div>
        <div className="rubber-stamp rubber-stamp-danger text-xs">
          PATHOGEN DETECTED
        </div>
      </div>

      <p className="text-sm font-sans text-faded-ink mb-6">
        {lang === 'bn'
          ? 'কলটি আবার শুনুন। প্রতিটি মিথ্যা বাক্যের পেছনে কোনো না কোনো মনস্তাত্ত্বিক জীবাণু কাজ করছিল। নিচে ক্লিক করে সেগুলো এক্স-রে করুন:'
          : 'Replay the transcript under scientific glass. Select each psychological pathogen to dissect how it blinds cognitive reasoning:'}
      </p>

      {/* Pathogen Specimen Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {scenario.tactics.map((tac) => {
          const def = TACTIC_DEFINITIONS[tac];
          const isSelected = selectedTactic === tac;
          return (
            <button
              key={tac}
              onClick={() => setSelectedTactic(tac)}
              className={`p-3 text-left border-2 border-ink flex items-center gap-3 transition-all ${
                isSelected
                  ? 'bg-ink text-paper shadow-ink-blot -translate-y-0.5'
                  : 'bg-[#FAF5EC] hover:bg-[#F2ECE0]'
              }`}
            >
              <SpecimenIcon tactic={tac} size={32} />
              <div>
                <div className="font-mono font-bold text-xs uppercase">{def.badge[lang]}</div>
                <div className="text-[10px] font-mono opacity-80 italic">{def.pathogenName}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dissected Explanation Pane */}
      {selectedTactic && (
        <div className="bg-[#FAF5EC] border-2 border-dashed border-ink p-4 rounded mb-6 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-vermilion" />
            <h4 className="font-serif font-bold text-lg text-ink">
              {TACTIC_DEFINITIONS[selectedTactic].name[lang]}
            </h4>
          </div>

          <p className="font-sans text-sm text-ink leading-relaxed">
            {TACTIC_DEFINITIONS[selectedTactic].description[lang]}
          </p>

          <div className="bg-paper p-3 border border-ink/40 font-mono text-xs text-faded-ink">
            <span className="font-bold text-ink block mb-1">
              {lang === 'bn' ? 'আসল কথোপকথনে এই কৌশল:' : 'Transcript Excerpt:'}
            </span>
            "{scenario.content.dialogue.flatMap((d) => d.annotations || []).find((a) => a.tactic === selectedTactic)?.targetExcerpt || 'ওটিপি দ্রুত বলুন'}"
          </div>
        </div>
      )}

      <button
        onClick={onContinueToAntibodies}
        className="w-full py-3 bg-teal text-paper font-mono font-bold text-sm border-2 border-ink shadow-ink-blot hover:bg-teal/90 uppercase tracking-wider"
      >
        {lang === 'bn' ? 'অ্যান্টিবডি তৈরি করুন (Build Antibodies) →' : 'Synthesize Antibodies →'}
      </button>
    </div>
  );
};
