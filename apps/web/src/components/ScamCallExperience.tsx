import React, { useState, useEffect } from 'react';
import { AlienCharacter } from './AlienCharacter';
import { Scenario } from '@antibody/shared';

interface ScamCallExperienceProps {
  scenario: Scenario;
  onBalanceDrained: () => void;
  lang: 'bn' | 'en';
}

export const ScamCallExperience: React.FC<ScamCallExperienceProps> = ({
  scenario,
  onBalanceDrained,
  lang
}) => {
  const [callActive, setCallActive] = useState(false);
  const [dialogueIdx, setDialogueIdx] = useState(0);
  const [isDraining, setIsDraining] = useState(false);
  const [balance, setBalance] = useState(5000);

  const dialogue = scenario.content.dialogue;

  const startCall = () => {
    setCallActive(true);
    setDialogueIdx(0);
  };

  const handleNextDialogue = () => {
    if (dialogueIdx < dialogue.length - 1) {
      setDialogueIdx((prev) => prev + 1);
    } else {
      // Trigger balance drain climax
      setIsDraining(true);
      let currentBal = 5000;
      const interval = setInterval(() => {
        currentBal -= 500;
        if (currentBal <= 0) {
          clearInterval(interval);
          setBalance(0);
          setTimeout(() => {
            onBalanceDrained();
          }, 1500);
        } else {
          setBalance(currentBal);
        }
      }, 100);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-6 bg-paper hand-border p-6 shadow-ink-lg relative">
      <div className="border-b-2 border-ink pb-3 mb-4 flex justify-between items-center">
        <div>
          <span className="font-mono text-xs bg-vermilion text-paper px-2 py-0.5 font-bold uppercase tracking-wider">
            LIVE SIMULATION // লাইভ স্ক্যাম কল
          </span>
          <h1 className="font-serif font-bold text-xl text-ink mt-1">
            {scenario.content.title[lang]}
          </h1>
        </div>
        <div className="font-mono text-sm font-bold text-vermilion">
          ৳ {balance.toLocaleString()}
        </div>
      </div>

      {!callActive ? (
        <div className="text-center py-8 space-y-4">
          <div className="relative inline-block animate-pulse">
            <div className="w-16 h-16 rounded-full bg-vermilion/20 flex items-center justify-center mx-auto border-2 border-vermilion">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E4422B" strokeWidth="2.5">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
          </div>

          <div>
            <div className="font-mono font-bold text-base text-ink">
              {scenario.persona.name[lang]}
            </div>
            <div className="text-xs text-faded-ink font-mono">
              {scenario.persona.role[lang]}
            </div>
          </div>

          <p className="text-xs text-faded-ink max-w-sm mx-auto">
            {lang === 'bn'
              ? 'এলিয়েন প্রথমবার ফোন কল ধরছে। কোনো ধারণা নেই প্রতারক কীভাবে ভয় দেখিয়ে কথা বলে।'
              : 'The naive alien answers its first call, oblivious to social engineering traps.'}
          </p>

          <button
            onClick={startCall}
            className="px-6 py-3 bg-vermilion text-paper font-mono font-bold text-sm shadow-ink-blot hover:bg-vermilion/90 border-2 border-ink uppercase tracking-wider"
          >
            {lang === 'bn' ? 'কল রিসিভ করুন (Receive Call)' : 'Answer Incoming Call'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Subtitled dialogue bubbles */}
          <div className="min-h-[140px] p-4 bg-[#FAF5EB] border-2 border-ink rounded-lg relative">
            <div className="font-mono text-xs font-bold text-faded-ink mb-1 uppercase">
              {dialogue[dialogueIdx].speaker === 'counterpart'
                ? scenario.persona.name[lang]
                : 'Subject (Alien)'}
            </div>

            <p className="text-sm sm:text-base font-sans font-medium text-ink leading-relaxed">
              "{dialogue[dialogueIdx].text[lang]}"
            </p>

            {isDraining && (
              <div className="absolute inset-0 bg-vermilion/90 text-paper flex flex-col items-center justify-center font-mono font-bold p-4 animate-shake">
                <span className="text-xl">! ব্যালেন্স চুরি হয়ে গেল !</span>
                <span className="text-sm">DRAINING TAKA-PAY ACCOUNT... ৳ 0</span>
              </div>
            )}
          </div>

          {/* Alien reaction preview */}
          <div className="flex justify-between items-center px-4">
            <AlienCharacter
              mood={isDraining ? 'panicked' : dialogueIdx === 0 ? 'trusting' : 'confused'}
              size={90}
            />

            {!isDraining && (
              <button
                onClick={handleNextDialogue}
                className="px-4 py-2 bg-mustard text-ink font-mono font-bold text-xs border-2 border-ink shadow-ink-blot hover:bg-mustard/90"
              >
                {dialogueIdx < dialogue.length - 1
                  ? lang === 'bn'
                    ? 'পরের কথা শুনুন →'
                    : 'Next Dialogue →'
                  : lang === 'bn'
                  ? 'ওটিপি বলে দিল! (Reveal OTP)'
                  : 'Alien shares OTP!'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
