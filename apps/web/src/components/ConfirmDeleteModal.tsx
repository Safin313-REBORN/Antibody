import React, { useEffect } from 'react';

interface ConfirmDeleteModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  lang: 'bn' | 'en';
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  open,
  onCancel,
  onConfirm,
  lang
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'bn' ? 'তথ্য মুছে ফেলার নিশ্চিতকরণ' : 'Confirm Data Deletion'}
      className="fixed inset-0 z-50 bg-ink/80 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="max-w-md w-full bg-paper border-2 border-vermilion shadow-ink-lg p-6 space-y-4 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="rubber-stamp rubber-stamp-danger text-xs">
          IRREVERSIBLE ACTION
        </span>
        <h2 className="font-serif font-bold text-2xl text-ink">
          {lang === 'bn' ? 'আপনার সমস্ত তথ্য মুছে ফেলবেন?' : 'Delete All Your Agent Data?'}
        </h2>
        <p className="font-sans text-sm text-faded-ink leading-relaxed">
          {lang === 'bn'
            ? 'এটি আপনার কলসাইন, সেশন এবং সমস্ত গেম স্কোর সার্ভার থেকে স্থায়ীভাবে মুছে ফেলবে।'
            : 'This will permanently purge your callsign, sessions, and susceptibility scores from the server.'}
        </p>
        <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-[48px] px-4 py-2 bg-paper text-ink font-bold border-2 border-ink hover:bg-mustard/20"
          >
            {lang === 'bn' ? 'বাতিল করুন' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-h-[48px] px-4 py-2 bg-vermilion text-paper font-bold border-2 border-ink hover:bg-vermilion/90"
          >
            {lang === 'bn' ? 'হ্যাঁ, মুছে ফেলুন' : 'Confirm Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};
