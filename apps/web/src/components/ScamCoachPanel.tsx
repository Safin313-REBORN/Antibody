import React, { useState } from 'react';
import { ScamTactic, TACTIC_DEFINITIONS } from '@antibody/shared';

interface ScamCoachPanelProps {
  lang: 'bn' | 'en';
}

interface BotMessage {
  sender: 'user' | 'bot';
  text: string;
  tactics?: ScamTactic[];
  disclaimer?: string;
}

export const ScamCoachPanel: React.FC<ScamCoachPanelProps> = ({ lang }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<BotMessage[]>([
    {
      sender: 'bot',
      text:
        lang === 'bn'
          ? 'হ্যালো! আমি ফিল্ড এজেন্ট বট। কোনো সন্দেহজনক এসএমএস বা কল পেলে এখানে পেস্ট করুন অথবা প্রশ্ন করুন।'
          : 'Hello! I am the Antibody Field Agent Bot. Paste any suspicious SMS/call or ask how to stay safe.'
    }
  ]);

  const askCoach = async (textToAsk: string) => {
    const clean = textToAsk.trim();
    if (!clean) return;
    setHistory((prev) => [...prev, { sender: 'user', text: clean }]);
    setQuery('');
    setLoading(true);
    try {
      const res = await fetch('/api/v1/bot/coach/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: clean })
      });
      if (!res.ok) throw new Error('Coach offline');
      const data = await res.json();
      setHistory((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: data.explanation[lang],
          tactics: data.detectedTactics,
          disclaimer: data.disclaimer[lang]
        }
      ]);
    } catch {
      const lower = clean.toLowerCase();
      const isScamCue =
        lower.includes('otp') ||
        lower.includes('pin') ||
        lower.includes('urgent') ||
        lower.includes('ফ্রিজ') ||
        lower.includes('ওটিপি') ||
        lower.includes('পিন') ||
        lower.includes('লটারি');
      setHistory((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: isScamCue
            ? lang === 'bn'
              ? 'সতর্কতা! এটিতে স্ক্যামের স্পষ্ট লক্ষণ (তাড়াহুড়ো, ভয় বা ওটিপি/পিন দাবি) রয়েছে। কখনোই পিন বা ওটিপি দেবেন না।'
              : 'Caution! Strong scam markers detected (urgency, fear, or OTP/PIN request). Never share OTP or PIN.'
            : lang === 'bn'
            ? 'এতে সরাসরি পিন বা হুমকির চিহ্ন দেখা যাচ্ছে না, তবে অজানা লিংকে ক্লিক করার আগে অফিশিয়াল অ্যাপে যাচাই করুন।'
            : 'No overt OTP/extortion cues detected, but always verify inside your official app before acting.',
          tactics: isScamCue ? ['urgency', 'trust_hijack'] : [],
          disclaimer:
            lang === 'bn'
              ? 'সন্দেহ হলে কল কেটে দিন এবং অফিশিয়াল নম্বরে নিজ থেকে কল করুন।'
              : 'When in doubt, hang up and call the official helpline yourself.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 no-print">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="min-h-[48px] px-4 py-2.5 bg-ink text-paper font-mono text-xs font-bold border-2 border-mustard shadow-ink-blot flex items-center gap-2 hover:bg-ink/90"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E9A800" strokeWidth="2.5" aria-hidden="true">
            <rect x="4" y="7" width="16" height="12" rx="3" />
            <line x1="12" y1="7" x2="12" y2="3" />
            <circle cx="12" cy="3" r="1.5" fill="#E9A800" />
            <circle cx="9" cy="13" r="1.5" fill="#E9A800" />
            <circle cx="15" cy="13" r="1.5" fill="#E9A800" />
          </svg>
          <span>{lang === 'bn' ? 'এজেন্ট বট (Agent Bot)' : 'Field Agent Bot'}</span>
        </button>
      ) : (
        <div className="w-[calc(100vw-2rem)] sm:w-[390px] max-w-full bg-paper border-2 border-ink shadow-ink-lg p-4 space-y-3">
          <div className="flex justify-between items-center border-b-2 border-ink pb-2">
            <span className="font-mono text-xs font-bold uppercase text-ink">
              {lang === 'bn' ? 'এজেন্ট বট // FIELD AGENT BOT' : 'FIELD AGENT BOT // SCAM COACH'}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close Agent Bot"
              className="min-h-[36px] px-2 font-mono text-xs font-bold border border-ink hover:bg-mustard"
            >
              [X]
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => askCoach('আপনার অ্যাকাউন্ট ফ্রিজ হবে, এখনই ওটিপি দিন!')}
              className="text-[11px] font-mono px-2 py-1 bg-[#FAF5EC] border border-ink hover:bg-mustard/30"
            >
              {lang === 'bn' ? 'নমুনা: ভুয়ো ওটিপি কল' : 'Test: Fake OTP Call'}
            </button>
            <button
              type="button"
              onClick={() => askCoach('How does Antibody work?')}
              className="text-[11px] font-mono px-2 py-1 bg-[#FAF5EC] border border-ink hover:bg-mustard/30"
            >
              {lang === 'bn' ? 'গেমটি কীভাবে কাজ করে?' : 'How does this work?'}
            </button>
          </div>

          {/* Chat Thread */}
          <div className="max-h-52 overflow-y-auto space-y-2 pr-1" aria-live="polite">
            {history.map((msg, i) => (
              <div
                key={i}
                className={`p-2.5 text-xs border border-ink space-y-1 ${
                  msg.sender === 'user' ? 'bg-mustard/20 ml-6' : 'bg-[#FAF5EC] mr-4'
                }`}
              >
                <div className="font-mono text-[10px] font-bold text-faded-ink uppercase">
                  {msg.sender === 'user' ? 'YOU' : 'AGENT BOT'}
                </div>
                <p className="font-sans text-ink whitespace-pre-line leading-relaxed">{msg.text}</p>
                {msg.tactics && msg.tactics.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {msg.tactics.map((t) => (
                      <span key={t} className="px-1.5 py-0.5 bg-vermilion text-paper font-mono text-[10px] font-bold">
                        {TACTIC_DEFINITIONS[t].badge[lang]}
                      </span>
                    ))}
                  </div>
                )}
                {msg.disclaimer && (
                  <p className="font-mono text-[10px] text-teal font-bold border-t border-ink/20 pt-1">
                    {msg.disclaimer}
                  </p>
                )}
              </div>
            ))}
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
                  : 'Paste a suspicious message or ask Agent Bot...'
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
                : lang === 'bn' ? 'এজেন্ট বটকে জিজ্ঞাসা করুন (Ask)' : 'Ask Agent Bot'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
