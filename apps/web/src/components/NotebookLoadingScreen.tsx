import React from 'react';

interface NotebookLoadingScreenProps {
  lang: 'bn' | 'en';
  label?: { bn: string; en: string };
}

export const NotebookLoadingScreen: React.FC<NotebookLoadingScreenProps> = ({
  lang,
  label = {
    bn: 'নমুনা ফাইল খোলা হচ্ছে...',
    en: 'Opening field specimen...'
  }
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="max-w-md mx-auto my-12 p-8 bg-paper hand-border shadow-ink-lg text-center space-y-5 animate-fadeIn"
    >
      {/* Hand-drawn rotating specimen ring + curious alien eyes */}
      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
        <svg
          width="96"
          height="96"
          viewBox="0 0 96 96"
          className="animate-specimen-spin"
          aria-hidden="true"
        >
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke="#14231F"
            strokeWidth="3"
            strokeDasharray="18 10 6 10"
            strokeLinecap="round"
          />
          <circle cx="48" cy="8" r="4" fill="#E9A800" stroke="#14231F" strokeWidth="2" />
        </svg>
        <svg
          width="44"
          height="44"
          viewBox="0 0 44 44"
          className="absolute"
          aria-hidden="true"
        >
          <ellipse cx="22" cy="22" rx="16" ry="18" fill="#A3D9C9" stroke="#14231F" strokeWidth="2.5" />
          <circle cx="16" cy="20" r="3" fill="#14231F" />
          <circle cx="28" cy="20" r="3" fill="#14231F" />
          <circle cx="15" cy="19" r="1" fill="#F3EBDD" />
          <circle cx="27" cy="19" r="1" fill="#F3EBDD" />
        </svg>
      </div>

      <div className="space-y-1">
        <span className="font-mono text-[11px] bg-mustard px-2 py-0.5 font-bold uppercase text-ink">
          FIELD_TRANSIT // PROCESSING
        </span>
        <p className="font-serif font-bold text-xl text-ink pt-1">
          {label[lang]}
        </p>
      </div>
    </div>
  );
};
