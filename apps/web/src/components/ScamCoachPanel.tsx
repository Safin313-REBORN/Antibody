import React, { useState } from 'react';
import { ScamTactic, TACTIC_DEFINITIONS } from '@antibody/shared';

interface ScamCoachPanelProps {
  lang: 'bn' | 'en';
}

export const ScamCoachPanel: React.FC<ScamCoachPanelProps> = ({ lang }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState<{
    explanation: { bn: string; en: string };
    detectedTactics: ScamTactic[];
    disclaimer: { bn: string; en: string };
  } | null>(null);

  const askCoach = async (textToAsk: string) => {
    if (!textToAsk.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/v1/bot/coach/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToAsk })
      });
      if (!res.ok) throw new Error('Coach offline');
      const data = await res.json();
      setReply(data);
    } catch {
      setReply({
        explanation: {
          bn: 'অফলাইন পরামর্শ: যেকোনো বার্তায় তাড়াহুড়ো, ভয়, লটারির লোভ বা ওটিপি চাওয়া হলে সেটি প্রতারণা।',
          en: 'Offline Coach: Any message demanding urgent action, threatening account freeze, or asking for OTP/PIN is a scam.'
        },
        detectedTactics: ['urgency'],
        disclaimer: {
          bn: 'সন্দেহ হলে কল কেটে দিন এবং অফিশিয়াল নম্বরে নিজ থেকে কল করুন।',
          en: 'When in doubt, hang up and call the official number yourself.'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="min-h-[48px] px-4 py-2.5 bg-ink text-paper font-mono text-xs font-bold border-2 border-mustard shadow-ink-blot flex items-center gap-2 hover:bg-ink/90"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E9A800" strokeWidth="2.5" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>{lang === 'bn' ? 'স্ক্যাম কোচ (Ask Coach)' : 'Scam Coach'}</span>
        </button>
      ) : (
        <div className="w-[340px] sm:w-[380px] bg-paper border-2 border-ink shadow-ink-lg p-4 space-y-3">
          <div className="flex justify-between items-center border-b-2 border-ink pb-2">
            <span className="font-mono text-xs font-bold uppercase text-ink">
              {lang === 'bn' ? 'ফিল্ড কোচ // SCAM COACH' : 'FIELD SCAM COACH'}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close Scam Coach"
              className="min-h-[36px] px-2 font-mono text-xs font-bold border border-ink hover:bg-mustard"
            >
              [X]
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => {
                const sample = 'আপনার অ্যাকাউন্ট ফ্রিজ হবে, এখনই ওটিপি দিন!';
                setQuery(sample);
                askCoach(sample);
              }}
              className="text-[11px] font-mono px-2 py-1 bg-[#FAF5EC] border border-ink hover:bg-mustard/30"
            >
              {lang === 'bn' ? 'উদাহরণ: ভুয়ো ওটিপি কল' : 'Sample: Fake OTP Call'}
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              askCoach(query);
            }}
            className="space-y-2"
          >
            <textarea
              rows={2}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                lang === 'bn'
                  ? 'সন্দেহজনক এসএমএস বা প্রশ্ন লিখুন...'
                  : 'Paste a suspicious message or ask a question...'
              }
              className="w-full p-2 bg-[#FAF5EC] border-2 border-ink font-sans text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] py-2 bg-teal text-paper font-mono text-xs font-bold border-2 border-ink shadow-ink-blot"
            >
              {loading
                ? lang === 'bn' ? 'বিশ্লেষণ চলছে...' : 'Analyzing...'
                : lang === 'bn' ? 'বিশ্লেষণ করুন (Analyze)' : 'Analyze Message'}
            </button>
          </form>

          {reply && (
            <div className="p-3 bg-[#FAF5EC] border-2 border-dashed border-ink space-y-2 text-xs" aria-live="polite">
              <p className="font-sans text-ink whitespace-pre-line leading-relaxed">
                {reply.explanation[lang]}
              </p>
              {reply.detectedTactics.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {reply.detectedTactics.map((t) => (
                    <span key={t} className="px-1.5 py-0.5 bg-vermilion text-paper font-mono text-[10px] font-bold">
                      {TACTIC_DEFINITIONS[t].badge[lang]}
                    </span>
                  ))}
                </div>
              )}
              <p className="font-mono text-[11px] text-teal font-bold border-t border-ink/20 pt-1">
                {reply.disclaimer[lang]}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
