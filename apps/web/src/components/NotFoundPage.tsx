import React from 'react';
import { AlienCharacter } from './AlienCharacter';

interface NotFoundPageProps {
  onGoHome: () => void;
  lang: 'bn' | 'en';
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onGoHome, lang }) => {
  return (
    <div className="max-w-xl mx-auto my-10 bg-paper hand-border p-8 shadow-ink-lg text-center space-y-5">
      <span className="rubber-stamp rubber-stamp-danger text-sm">
        404 // SPECIMEN MISSING
      </span>

      <h1
        className="font-serif font-bold text-3xl text-ink riso-misregister"
        data-text={lang === 'bn' ? 'পৃষ্ঠাটি খুঁজে পাওয়া যায়নি' : 'Field Page Not Found'}
      >
        {lang === 'bn' ? 'পৃষ্ঠাটি খুঁজে পাওয়া যায়নি' : 'Field Page Not Found'}
      </h1>

      <div className="flex justify-center">
        <AlienCharacter mood="confused" size={120} />
      </div>

      <p className="font-sans text-base text-faded-ink leading-relaxed">
        {lang === 'bn'
          ? 'আপনি যে নমুনা পাতাটি খুঁজছেন তা এই ফিল্ড নোটবুকে নেই। মূল গবেষণাগারে ফিরে চলুন।'
          : 'The specimen page you requested does not exist in this field notebook. Return to the main lab to continue.'}
      </p>

      <button
        type="button"
        onClick={onGoHome}
        className="min-h-[48px] px-6 py-3 bg-teal text-paper font-mono font-bold text-sm border-2 border-ink shadow-ink-blot hover:bg-teal/90 uppercase tracking-wider"
      >
        {lang === 'bn' ? 'মূল পাতায় ফিরুন (Return Home)' : 'Return to Base'}
      </button>
    </div>
  );
};
