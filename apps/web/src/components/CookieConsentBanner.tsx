import React, { useState, useEffect } from 'react';

interface CookieConsentBannerProps {
  lang: 'bn' | 'en';
  onOpenCookiePolicy: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  lang,
  onOpenCookiePolicy
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('antibody_cookie_consent');
      if (!saved) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const handleChoice = (choice: 'necessary' | 'all') => {
    try {
      localStorage.setItem('antibody_cookie_consent', choice);
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={lang === 'bn' ? 'কুকি সম্মতি বিজ্ঞপ্তি' : 'Cookie Consent Notice'}
      className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-40 bg-paper border-2 border-ink shadow-ink-lg p-4 space-y-3 animate-fadeIn"
    >
      <div className="flex justify-between items-start gap-2 border-b border-ink/20 pb-2">
        <span className="font-mono text-xs font-bold uppercase text-ink bg-mustard px-2 py-0.5">
          {lang === 'bn' ? 'কুকি ও গোপনীয়তা' : 'COOKIE & PRIVACY NOTICE'}
        </span>
        <button
          type="button"
          onClick={onOpenCookiePolicy}
          className="font-mono text-xs underline text-teal hover:text-ink font-bold"
        >
          {lang === 'bn' ? 'কুকি নীতি পড়ুন' : 'Cookie Policy'}
        </button>
      </div>

      <p className="font-sans text-xs sm:text-sm text-ink leading-relaxed">
        {lang === 'bn'
          ? 'আমরা কোনো বিজ্ঞাপন বা ট্র্যাকিং কুকি ব্যবহার করি না। শুধুমাত্র সেশন চালু রাখতে ও বুট অ্যানিমেশন মনে রাখতে অপরিহার্য কুকি ব্যবহৃত হয়।'
          : 'We use zero advertising or third-party tracking cookies. Only strictly necessary session cookies and storage are used to keep you signed in.'}
      </p>

      {/* Equal-prominence buttons — zero dark patterns */}
      <div className="grid grid-cols-2 gap-2 font-mono text-xs">
        <button
          type="button"
          onClick={() => handleChoice('necessary')}
          className="min-h-[48px] px-3 py-2 bg-paper text-ink font-bold border-2 border-ink hover:bg-mustard/20"
        >
          {lang === 'bn' ? 'শুধু প্রয়োজনীয় কুকি' : 'Necessary Only'}
        </button>
        <button
          type="button"
          onClick={() => handleChoice('all')}
          className="min-h-[48px] px-3 py-2 bg-teal text-paper font-bold border-2 border-ink hover:bg-teal/90"
        >
          {lang === 'bn' ? 'সম্মত হচ্ছি (Accept)' : 'Accept & Continue'}
        </button>
      </div>
    </div>
  );
};
