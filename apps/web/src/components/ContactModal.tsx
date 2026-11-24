import React, { useState, useEffect } from 'react';

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  lang: 'bn' | 'en';
}

export const ContactModal: React.FC<ContactModalProps> = ({ open, onClose, lang }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim().length < 5) {
      setStatus({
        type: 'error',
        text: lang === 'bn' ? 'অনুগ্রহ করে অন্তত ৫ অক্ষরের বার্তা লিখুন।' : 'Please enter a message of at least 5 characters.'
      });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch('/api/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() || 'Field Visitor', message: message.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      setStatus({
        type: 'success',
        text: lang === 'bn' ? 'আপনার বার্তা সফলভাবে পাঠানো হয়েছে!' : 'Message received! Thank you for contacting Antibody Lab.'
      });
      setName('');
      setMessage('');
    } catch (err: any) {
      setStatus({
        type: 'error',
        text: err.message || 'Could not send message right now.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'bn' ? 'যোগাযোগ ফর্ম' : 'Contact Antibody Lab'}
      className="fixed inset-0 z-50 bg-ink/75 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="max-w-md w-full bg-paper border-2 border-ink shadow-ink-lg p-6 space-y-4 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b-2 border-ink pb-2">
          <h2 className="font-serif font-bold text-2xl text-ink">
            {lang === 'bn' ? 'যোগাযোগ করুন (Contact)' : 'Contact Antibody Lab'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-2.5 font-mono text-xs font-bold border border-ink hover:bg-mustard"
          >
            [ESC]
          </button>
        </div>

        {status && (
          <div
            role={status.type === 'error' ? 'alert' : 'status'}
            className={`p-3 border-l-4 font-mono text-xs font-bold ${
              status.type === 'error'
                ? 'bg-vermilion/15 border-vermilion text-vermilion'
                : 'bg-teal/15 border-teal text-teal'
            }`}
          >
            {status.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block font-mono text-xs font-bold text-ink mb-1">
              {lang === 'bn' ? 'আপনার নাম / ডাকনাম (ঐচ্ছিক)' : 'Name or Callsign (Optional)'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-[#FAF5EC] border-2 border-ink font-mono text-sm"
            />
          </div>

          <div>
            <label className="block font-mono text-xs font-bold text-ink mb-1">
              {lang === 'bn' ? 'বার্তা লিখুন' : 'Message'}
            </label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 bg-[#FAF5EC] border-2 border-ink font-sans text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[48px] bg-teal text-paper font-mono text-xs font-bold border-2 border-ink shadow-ink-blot"
          >
            {loading
              ? lang === 'bn' ? 'পাঠানো হচ্ছে...' : 'Sending...'
              : lang === 'bn' ? 'বার্তা পাঠান (Send Message)' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};
