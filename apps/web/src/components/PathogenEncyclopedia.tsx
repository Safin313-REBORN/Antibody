import React, { useEffect } from 'react';
import { TACTIC_DEFINITIONS, ScamTactic } from '@antibody/shared';
import { SpecimenIcon } from './SpecimenIcon';

interface PathogenEncyclopediaProps {
  open: boolean;
  onClose: () => void;
  lang: 'bn' | 'en';
}

export const PathogenEncyclopedia: React.FC<PathogenEncyclopediaProps> = ({
  open,
  onClose,
  lang
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'bn' ? '৬টি স্ক্যাম জীবাণু কোষ' : 'Scam Pathogen Field Guide'}
      className="fixed inset-0 z-50 bg-ink/75 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="max-w-3xl w-full max-h-[85vh] overflow-y-auto bg-paper border-2 border-ink shadow-ink-lg p-6 space-y-4 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b-2 border-ink pb-3">
          <div>
            <span className="font-mono text-xs bg-vermilion text-paper px-2 py-0.5 font-bold uppercase">
              SPECIMEN ARCHIVE // ৬টি প্রধান স্ক্যাম কৌশল
            </span>
            <h2 className="font-serif font-bold text-2xl text-ink mt-1">
              {lang === 'bn' ? 'স্ক্যাম জীবাণু ও অ্যান্টিবডি নির্দেশিকা' : 'Scam Pathogens & Cognitive Antibodies'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-3 font-mono text-xs font-bold border-2 border-ink hover:bg-mustard"
          >
            [ESC]
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(Object.keys(TACTIC_DEFINITIONS) as ScamTactic[]).map((tactic) => {
            const def = TACTIC_DEFINITIONS[tactic];
            return (
              <div key={tactic} className="p-4 bg-[#FAF5EC] border-2 border-ink space-y-2">
                <div className="flex items-center gap-2.5">
                  <SpecimenIcon tactic={tactic} size={34} />
                  <div>
                    <div className="font-serif font-bold text-base text-ink">{def.name[lang]}</div>
                    <div className="font-mono text-[11px] text-faded-ink italic">{def.pathogenName}</div>
                  </div>
                </div>
                <p className="font-sans text-xs text-ink leading-relaxed">{def.description[lang]}</p>
                <div className="p-2 bg-paper border-l-4 border-teal font-mono text-[11px] text-teal font-bold">
                  {def.antibodyRule.action[lang]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
