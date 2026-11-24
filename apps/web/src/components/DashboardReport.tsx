import React from 'react';
import { DashboardMetrics, TACTIC_DEFINITIONS, ScamTactic } from '@antibody/shared';
import { AlienCharacter } from './AlienCharacter';
import { SpecimenIcon } from './SpecimenIcon';

interface DashboardReportProps {
  metrics: DashboardMetrics;
  onPlayAgain: () => void;
  onDeleteData: () => void;
  lang: 'bn' | 'en';
}

export const DashboardReport: React.FC<DashboardReportProps> = ({
  metrics,
  onPlayAgain,
  onDeleteData,
  lang
}) => {
  return (
    <div className="max-w-3xl mx-auto my-6 bg-paper hand-border p-6 sm:p-8 shadow-ink-lg space-y-6">
      {/* Header Stamp */}
      <div className="border-b-2 border-ink pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="font-mono text-xs bg-mustard text-ink px-2 py-0.5 font-bold uppercase tracking-wider">
            POSTCARDS TO HOMEWORLD // ঢাকা মাঠ পর্যায় প্রতিবেদন
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-ink mt-1 riso-misregister" data-text="Subject Cognitive Resistance Map">
            Subject Cognitive Resistance Map
          </h2>
          <p className="font-mono text-xs text-faded-ink">
            AGENT: {metrics.agent.callsign} // ID: {metrics.agent.id}
          </p>
        </div>
        <div className="rubber-stamp rubber-stamp-safe text-sm">
          ANTIBODY VERIFIED
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="p-3 bg-[#FAF5EC] border-2 border-ink">
          <div className="text-[10px] text-faded-ink">ACCURACY RATE</div>
          <div className="text-2xl font-bold text-teal">{metrics.accuracyRate}%</div>
        </div>
        <div className="p-3 bg-[#FAF5EC] border-2 border-ink">
          <div className="text-[10px] text-faded-ink">CORRECT CATCHES</div>
          <div className="text-2xl font-bold text-ink">{metrics.correctCatches}</div>
        </div>
        <div className="p-3 bg-[#FAF5EC] border-2 border-ink">
          <div className="text-[10px] text-faded-ink">FALSE ALARMS</div>
          <div className="text-2xl font-bold text-mustard">{metrics.falseAlarms}</div>
        </div>
        <div className="p-3 bg-[#FAF5EC] border-2 border-ink">
          <div className="text-[10px] text-faded-ink">STREAK</div>
          <div className="text-2xl font-bold text-rose">{metrics.streak}🔥</div>
        </div>
      </div>

      {/* Six Tactic Organs Susceptibility Map */}
      <div className="bg-[#FAF5EC] border-2 border-ink p-4 rounded">
        <div className="font-mono text-xs font-bold text-ink mb-3 uppercase tracking-wider flex justify-between">
          <span>মনস্তাত্ত্বিক সংবেদনশীলতা মানচিত্র (Susceptibility 0-100)</span>
          <span className="text-[11px] text-faded-ink">কম স্কোর = বেশি প্রতিরোধ ক্ষমতা</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(Object.keys(metrics.susceptibility) as ScamTactic[]).map((tactic) => {
            const data = metrics.susceptibility[tactic];
            const def = TACTIC_DEFINITIONS[tactic];
            const width = Math.max(10, Math.min(100, data.score));

            return (
              <div key={tactic} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="flex items-center gap-1.5 font-bold">
                    <SpecimenIcon tactic={tactic} size={18} />
                    {def.badge[lang]}
                  </span>
                  <span>{data.score} / 100</span>
                </div>
                {/* Hand ink bar */}
                <div className="w-full h-3 border border-ink bg-paper p-0.5">
                  <div
                    className="h-full bg-vermilion transition-all duration-500"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Homeworld Postcard Closing */}
      <div className="p-4 bg-[#FAF6EE] border-l-4 border-mustard font-sans text-sm text-ink italic space-y-2">
        <p>
          "মানুষ মূর্খ হওয়ার কারণে প্রতারিত হয় না। প্রতারকরা কৃত্রিম তাড়াহুড়ো ও ভুয়া কর্তৃত্ব ধার করে মানুষের স্বাভাবিক বিচারবুদ্ধি সাময়িকভাবে বন্ধ করে দেয়।"
        </p>
        <p className="text-xs font-mono text-faded-ink not-italic">
          — ঢাকা ফিল্ড নোটস, অ্যান্টিবডি প্রকল্প
        </p>
      </div>

      {/* Alien Celebration */}
      <div className="flex justify-center py-2">
        <AlienCharacter mood="proud" hasAntibody={true} size={110} />
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 border-t-2 border-ink pt-4 font-mono text-xs">
        <button
          onClick={onPlayAgain}
          className="px-5 py-3 bg-teal text-paper font-bold border-2 border-ink shadow-ink-blot hover:bg-teal/90 uppercase"
        >
          {lang === 'bn' ? 'পুনরায় অনুশীলন করুন (Play Again)' : 'Run Another Study'}
        </button>

        <button
          onClick={onDeleteData}
          className="px-5 py-3 bg-vermilion/20 text-vermilion font-bold border-2 border-vermilion hover:bg-vermilion/30 uppercase"
        >
          {lang === 'bn' ? 'আমার তথ্য মুছে ফেলুন (Delete My Data)' : 'Purge All My Data'}
        </button>
      </div>
    </div>
  );
};
