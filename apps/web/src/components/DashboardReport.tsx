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
  const handleDownloadIdCard = () => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="260" viewBox="0 0 480 260">
      <rect width="480" height="260" fill="#F3EBDD" stroke="#14231F" stroke-width="6"/>
      <rect x="16" y="16" width="448" height="36" fill="#14231F"/>
      <text x="28" y="40" font-family="monospace" font-size="15" font-weight="bold" fill="#E9A800">ANTIBODY FIELD AGENT ID // DHAKA NODE</text>
      <text x="28" y="90" font-family="monospace" font-size="14" fill="#5B6B63">CALLSIGN:</text>
      <text x="28" y="114" font-family="serif" font-size="24" font-weight="bold" fill="#14231F">${metrics.agent.callsign}</text>
      <text x="28" y="155" font-family="monospace" font-size="14" fill="#5B6B63">ACCURACY: ${metrics.accuracyRate}%  |  STREAK: ${metrics.streak}</text>
      <rect x="28" y="185" width="180" height="42" fill="none" stroke="#0E7C7B" stroke-width="3" stroke-dasharray="6 4"/>
      <text x="42" y="212" font-family="monospace" font-size="16" font-weight="bold" fill="#0E7C7B">ANTIBODY VERIFIED</text>
    </svg>`;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `antibody-id-${metrics.agent.callsign.toLowerCase().replace(/\s+/g, '-')}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReadAloud = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const text =
      lang === 'bn'
        ? `অ্যান্টিবডি প্রতিবেদন। এজেন্ট ${metrics.agent.callsign}। সঠিকতা ${metrics.accuracyRate} শতাংশ। মানুষ মূর্খ হওয়ার কারণে প্রতারিত হয় না।`
        : `Antibody report for agent ${metrics.agent.callsign}. Accuracy ${metrics.accuracyRate} percent. Humans are not fooled because they are foolish; scammers borrow urgency and authority to switch off thinking.`;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
    window.speechSynthesis.speak(utter);
  };

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
          <div className="text-2xl font-bold text-rose flex items-center gap-1.5">
            <span>{metrics.streak}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D94F8A" strokeWidth="2.5" aria-hidden="true">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Six Tactic Organs Susceptibility Map */}
      <div className="bg-[#FAF5EC] border-2 border-ink p-4 rounded">
        <div className="font-mono text-xs font-bold text-ink mb-3 uppercase tracking-wider flex justify-between flex-wrap gap-2">
          <span>মনস্তাত্ত্বিক সংবেদনশীলতা মানচিত্র (Susceptibility 0-100)</span>
          <span className="text-[11px] text-faded-ink">কম স্কোর = বেশি প্রতিরোধ ক্ষমতা</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(Object.keys(metrics.susceptibility) as ScamTactic[]).map((tactic, idx) => {
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
                <div className="w-full h-3 border border-ink bg-paper p-0.5">
                  <div
                    className="h-full bg-vermilion transition-all duration-500"
                    style={{ width: `${width}%`, transitionDelay: `${idx * 80}ms` }}
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
          {lang === 'bn'
            ? '"মানুষ মূর্খ হওয়ার কারণে প্রতারিত হয় না। প্রতারকরা কৃত্রিম তাড়াহুড়ো ও ভুয়া কর্তৃত্ব ধার করে মানুষের স্বাভাবিক বিচারবুদ্ধি সাময়িকভাবে বন্ধ করে দেয়।"'
            : '"Humans are not fooled because they are foolish. Scammers borrow urgency and authority to switch off thinking."'}
        </p>
        <div className="flex justify-between items-center pt-1">
          <p className="text-xs font-mono text-faded-ink not-italic">
            — ঢাকা ফিল্ড নোটস, অ্যান্টিবডি প্রকল্প
          </p>
          <button
            type="button"
            onClick={handleReadAloud}
            className="min-h-[36px] px-3 py-1 border border-ink font-mono text-xs not-italic hover:bg-mustard/30"
          >
            {lang === 'bn' ? 'শুনুন (Read Aloud)' : 'Read Aloud'}
          </button>
        </div>
      </div>

      {/* Alien Celebration */}
      <div className="flex justify-center py-2">
        <AlienCharacter mood="proud" hasAntibody={true} size={110} />
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 border-t-2 border-ink pt-4 font-mono text-xs">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onPlayAgain}
            className="min-h-[48px] px-5 py-3 bg-teal text-paper font-bold border-2 border-ink shadow-ink-blot hover:bg-teal/90 uppercase"
          >
            {lang === 'bn' ? 'পুনরায় অনুশীলন (Play Again)' : 'Play Again'}
          </button>

          <button
            type="button"
            onClick={handleDownloadIdCard}
            className="min-h-[48px] px-5 py-3 bg-mustard text-ink font-bold border-2 border-ink shadow-ink-blot hover:bg-mustard/90 uppercase"
          >
            {lang === 'bn' ? 'আইডি কার্ড সেভ করুন (Save ID Card)' : 'Save ID Card'}
          </button>
        </div>

        <button
          type="button"
          onClick={onDeleteData}
          className="min-h-[48px] px-5 py-3 bg-vermilion/20 text-vermilion font-bold border-2 border-vermilion hover:bg-vermilion/30 uppercase"
        >
          {lang === 'bn' ? 'আমার তথ্য মুছে ফেলুন (Delete My Data)' : 'Delete My Data'}
        </button>
      </div>
    </div>
  );
};
