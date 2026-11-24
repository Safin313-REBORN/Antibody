import React, { useState, useEffect } from 'react';
import { TACTIC_DEFINITIONS, SCENARIO_FIXTURES, ScamTactic } from '@antibody/shared';

interface SiteSearchModalProps {
  open: boolean;
  onClose: () => void;
  lang: 'bn' | 'en';
  onNavigateStage: (stage: 'tactic_xray' | 'antibody_builder' | 'mutation_round' | 'case_intro') => void;
}

export const SiteSearchModal: React.FC<SiteSearchModalProps> = ({
  open,
  onClose,
  lang,
  onNavigateStage
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const q = query.trim().toLowerCase();

  const tacticResults = (Object.keys(TACTIC_DEFINITIONS) as ScamTactic[])
    .map((key) => TACTIC_DEFINITIONS[key])
    .filter(
      (t) =>
        !q ||
        t.name.en.toLowerCase().includes(q) ||
        t.name.bn.includes(q) ||
        t.description.en.toLowerCase().includes(q) ||
        t.antibodyRule.action.en.toLowerCase().includes(q)
    );

  const scenarioResults = SCENARIO_FIXTURES.filter(
    (s) =>
      !q ||
      s.content.title.en.toLowerCase().includes(q) ||
      s.content.title.bn.includes(q) ||
      s.persona.name.en.toLowerCase().includes(q)
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search specimens and defense rules"
      className="fixed inset-0 z-50 bg-ink/75 flex items-start justify-center p-4 pt-16"
      onClick={onClose}
    >
      <div
        className="max-w-xl w-full bg-paper border-2 border-ink shadow-ink-lg p-5 space-y-4 animate-fadeIn max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b-2 border-ink pb-2">
          <span className="font-mono text-xs font-bold uppercase text-ink">
            {lang === 'bn' ? 'নমুনা ও নিয়ম অনুসন্ধান' : 'SEARCH FIELD NOTEBOOK'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] px-2.5 font-mono text-xs font-bold border border-ink hover:bg-mustard"
          >
            [ESC]
          </button>
        </div>

        <input
          type="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={lang === 'bn' ? 'খুঁজুন (যেমন: OTP, Urgency, DESCO)...' : 'Search tactics, cases, or rules...'}
          className="w-full p-2.5 bg-[#FAF5EC] border-2 border-ink font-mono text-sm text-ink"
        />

        <div className="space-y-3">
          {tacticResults.length === 0 && scenarioResults.length === 0 ? (
            <div role="status" className="p-6 text-center bg-[#FAF5EC] border-2 border-dashed border-ink space-y-2">
              <p className="font-mono text-xs font-bold text-ink">
                {lang === 'bn' ? 'কোনো নমুনা খুঁজে পাওয়া যায়নি' : 'No matching specimens found'}
              </p>
              <p className="font-sans text-xs text-faded-ink">
                {lang === 'bn' ? 'অন্য কোনো শব্দ দিয়ে চেষ্টা করুন (যেমন: OTP, Fear, DESCO)।' : 'Try searching for OTP, Urgency, Fear, or DESCO.'}
              </p>
            </div>
          ) : (
            <>
              <div className="font-mono text-[11px] font-bold text-faded-ink uppercase">
                Tactics &amp; Antibodies ({tacticResults.length})
              </div>
          {tacticResults.slice(0, 4).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                onNavigateStage('antibody_builder');
                onClose();
              }}
              className="w-full text-left p-2.5 bg-[#FAF5EC] border border-ink hover:bg-mustard/20 transition-colors"
            >
              <div className="font-mono text-xs font-bold text-ink">{t.name[lang]}</div>
              <div className="font-sans text-xs text-faded-ink">{t.antibodyRule.action[lang]}</div>
            </button>
          ))}

          <div className="font-mono text-[11px] font-bold text-faded-ink uppercase pt-2">
            Case Scenarios ({scenarioResults.length})
          </div>
          {scenarioResults.slice(0, 3).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                onNavigateStage('mutation_round');
                onClose();
              }}
              className="w-full text-left p-2.5 bg-[#FAF5EC] border border-ink hover:bg-teal/15 transition-colors"
            >
              <div className="font-mono text-xs font-bold text-ink">{s.content.title[lang]}</div>
              <div className="font-mono text-[11px] text-faded-ink">{s.channel.toUpperCase()} • {s.legitimacy.toUpperCase()}</div>
            </button>
          ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
