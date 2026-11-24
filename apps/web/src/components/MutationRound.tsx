import React, { useState } from 'react';
import { Scenario } from '@antibody/shared';
import { AlienCharacter } from './AlienCharacter';

interface MutationRoundProps {
  scenarios: Scenario[];
  onRoundComplete: (results: { correct: number; falseAlarms: number }) => void;
  lang: 'bn' | 'en';
}

export const MutationRound: React.FC<MutationRoundProps> = ({
  scenarios,
  onRoundComplete,
  lang
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [stamp, setStamp] = useState<'CAUGHT' | 'FALSE ALARM' | 'MISSED' | null>(null);
  const [stats, setStats] = useState({ correct: 0, falseAlarms: 0 });

  const activeScenario = scenarios[currentIdx] || scenarios[0];

  const handleAction = (action: 'block' | 'allow') => {
    let resultStamp: 'CAUGHT' | 'FALSE ALARM' | 'MISSED';
    let isCorrect = false;
    let isFalseAlarm = false;

    if (activeScenario.legitimacy === 'scam') {
      if (action === 'block') {
        resultStamp = 'CAUGHT';
        isCorrect = true;
      } else {
        resultStamp = 'MISSED';
      }
    } else {
      if (action === 'allow') {
        resultStamp = 'CAUGHT';
        isCorrect = true;
      } else {
        resultStamp = 'FALSE ALARM';
        isFalseAlarm = true;
      }
    }

    setStamp(resultStamp);

    const nextStats = {
      correct: stats.correct + (isCorrect ? 1 : 0),
      falseAlarms: stats.falseAlarms + (isFalseAlarm ? 1 : 0)
    };
    setStats(nextStats);

    // Call API answer recording
    fetch(`/api/v1/scenarios/${activeScenario.id}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, timeMs: 1200 })
    }).catch(() => {});

    setTimeout(() => {
      setStamp(null);
      if (currentIdx < scenarios.length - 1) {
        setCurrentIdx((prev) => prev + 1);
      } else {
        onRoundComplete(nextStats);
      }
    }, 1200);
  };

  return (
    <div className="max-w-xl mx-auto my-6 bg-paper hand-border p-6 shadow-ink-lg relative">
      <div className="border-b-2 border-ink pb-3 mb-4 flex justify-between items-center">
        <div>
          <span className="font-mono text-xs bg-rose text-paper px-2 py-0.5 font-bold uppercase tracking-wider">
            MUTATION ROUND // ক্ষেত্র পরীক্ষণ
          </span>
          <h3 className="font-serif font-bold text-xl text-ink mt-1">
            {lang === 'bn' ? `নমুনা নং ${currentIdx + 1} / ${scenarios.length}` : `Specimen ${currentIdx + 1} of ${scenarios.length}`}
          </h3>
        </div>
        <div className="font-mono text-xs font-bold text-faded-ink">
          {activeScenario.channel.toUpperCase()}
        </div>
      </div>

      {/* Message card */}
      <div className="bg-[#FAF5EC] border-2 border-ink p-5 rounded-lg mb-6 relative min-h-[160px] flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-2 font-mono text-xs font-bold text-faded-ink">
            <span>{activeScenario.persona.name[lang]}</span>
            <span>{activeScenario.persona.role[lang]}</span>
          </div>

          <p className="font-sans text-base text-ink leading-relaxed">
            {activeScenario.content.dialogue[0]?.text[lang]}
          </p>
        </div>

        {/* Rubber Stamp Overlay on Decision */}
        {stamp && (
          <div className="absolute inset-0 flex items-center justify-center bg-paper/60 backdrop-blur-xs">
            <span
              className={`rubber-stamp text-2xl font-black ${
                stamp === 'CAUGHT'
                  ? 'rubber-stamp-safe'
                  : stamp === 'FALSE ALARM'
                  ? 'rubber-stamp-warn'
                  : 'rubber-stamp-danger'
              }`}
            >
              {stamp}
            </span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleAction('block')}
          disabled={stamp !== null}
          className="py-3 bg-vermilion text-paper font-mono font-bold text-sm border-2 border-ink shadow-ink-blot hover:bg-vermilion/90 uppercase tracking-wider"
        >
          {lang === 'bn' ? '🛑 ব্লক করুন (BLOCK / SCAM)' : '🛑 BLOCK (SCAM)'}
        </button>

        <button
          onClick={() => handleAction('allow')}
          disabled={stamp !== null}
          className="py-3 bg-teal text-paper font-mono font-bold text-sm border-2 border-ink shadow-ink-blot hover:bg-teal/90 uppercase tracking-wider"
        >
          {lang === 'bn' ? '✅ গ্রহণ করুন (ALLOW / LEGIT)' : '✅ ALLOW (LEGIT)'}
        </button>
      </div>

      <div className="mt-4 flex justify-between items-center text-xs font-mono text-faded-ink border-t border-ink/20 pt-2">
        <span>সতর্কতা: বৈধ বার্তা ব্লক করলে FALSE ALARM হবে</span>
        <AlienCharacter mood="curious" size={50} />
      </div>
    </div>
  );
};
