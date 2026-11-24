import React, { useState, useEffect, useCallback } from 'react';

interface BootAnimationProps {
  onComplete: () => void;
}

const TERMINAL_LINES = [
  { label: 'ANTIBODY FIELD TERMINAL v1.0', status: '' },
  { label: 'Checking antennae...', status: 'ok' },
  { label: 'Loading Dhaka street map...', status: 'ok' },
  { label: 'Loading scam specimens (6)...', status: 'ok' }
];

export const BootAnimation: React.FC<BootAnimationProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'cursor' | 'typing' | 'ink' | 'cover' | 'open'>('cursor');
  const [visibleLines, setVisibleLines] = useState(0);
  const [serverStatus, setServerStatus] = useState<string>('Checking...');
  const [progress, setProgress] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);

  const triggerComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setFadingOut(true);
      const t = setTimeout(triggerComplete, 600);
      return () => clearTimeout(t);
    }

    // Real health check ping
    fetch('/api/v1/health')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.status === 'ok') {
          setServerStatus('ok');
        } else {
          setServerStatus('Server asleep. Playing offline.');
        }
      })
      .catch(() => {
        setServerStatus('Server asleep. Playing offline.');
      });

    // 0.0 - 0.6s: Cursor blink -> 0.6 - 2.0s: Sequential line reveal
    const t1 = setTimeout(() => {
      setPhase('typing');
      setVisibleLines(1);
    }, 600);
    const tLine2 = setTimeout(() => setVisibleLines(2), 900);
    const tLine3 = setTimeout(() => setVisibleLines(3), 1200);
    const tLine4 = setTimeout(() => setVisibleLines(4), 1500);
    const tLine5 = setTimeout(() => setVisibleLines(5), 1800);

    // 2.0 - 3.4s: Hand-drawn ink line & paper blot
    const t2 = setTimeout(() => setPhase('ink'), 2000);
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 8;
      });
    }, 95);

    // 3.4 - 4.4s: Notebook cover slides in, stamp lands, antennae peek
    const t3 = setTimeout(() => setPhase('cover'), 3400);

    // 4.4 - 5.0s: Cover opens smoothly into login
    const t4 = setTimeout(() => setPhase('open'), 4400);
    const tDone = setTimeout(triggerComplete, 5000);

    const onKey = () => triggerComplete();
    window.addEventListener('keydown', onKey);

    return () => {
      clearTimeout(t1);
      clearTimeout(tLine2);
      clearTimeout(tLine3);
      clearTimeout(tLine4);
      clearTimeout(tLine5);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(tDone);
      clearInterval(progressInterval);
      window.removeEventListener('keydown', onKey);
    };
  }, [triggerComplete]);

  const showPaper = phase === 'cover' || phase === 'open';

  return (
    <div
      onClick={triggerComplete}
      role="region"
      aria-label="Antibody boot terminal. Click, tap, or press any key to skip."
      className={`fixed inset-0 font-mono z-50 flex flex-col justify-between p-6 sm:p-8 select-none cursor-pointer overflow-hidden transition-opacity duration-500 ${
        showPaper ? 'bg-paper text-ink' : 'bg-ink text-[#F3EBDD]'
      } ${fadingOut || phase === 'open' ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Expanding paper ink-blot transition at end of progress */}
      {phase === 'ink' && progress >= 96 && (
        <div
          aria-hidden="true"
          className="fixed inset-0 m-auto w-[120vmax] h-[120vmax] rounded-full bg-paper pointer-events-none animate-ink-blot z-0"
        />
      )}

      {/* Top terminal banner */}
      <div className="relative z-10 flex justify-between items-center text-xs tracking-widest border-b border-faded-ink/50 pb-2">
        <span className="text-faded-ink">ANTIBODY FIELD TERMINAL v1.0 // DHAKA NODE</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerComplete();
          }}
          className="min-h-[48px] text-mustard hover:underline font-bold px-3 py-2"
        >
          [SKIP / এড়িয়ে চলুন]
        </button>
      </div>

      {/* Center Stage */}
      <div className="relative z-10 max-w-xl w-full mx-auto my-auto">
        {!showPaper ? (
          <div className="space-y-3 text-sm sm:text-base">
            {/* 0.0 - 0.6s blinking mustard cursor */}
            <p className="text-mustard font-bold flex items-center gap-2">
              <span>&gt;</span>
              <span className="inline-block w-2.5 h-5 bg-mustard animate-pulse" aria-hidden="true" />
            </p>

            {/* 0.6 - 2.0s sequential bilingual terminal lines */}
            <div className="space-y-1.5">
              {TERMINAL_LINES.slice(0, visibleLines).map((line, idx) => (
                <p key={idx} className="animate-fadeIn">
                  &gt; {line.label}{' '}
                  {line.status && <span className="text-teal font-bold">{line.status}</span>}
                </p>
              ))}
              {visibleLines >= 5 && (
                <p className="animate-fadeIn">
                  &gt; Syncing with server...{' '}
                  <span className={serverStatus.includes('offline') ? 'text-mustard' : 'text-teal font-bold'}>
                    {serverStatus}
                  </span>
                </p>
              )}
            </div>

            {/* 2.0 - 3.4s hand-drawn ink line progress */}
            {phase === 'ink' && (
              <div className="pt-5 space-y-2 animate-fadeIn">
                <div className="flex justify-between text-xs text-faded-ink">
                  <span>INK_LINE_CALIBRATION</span>
                  <span>{Math.min(100, progress)}%</span>
                </div>
                <div className="w-full h-3 border border-mustard p-0.5">
                  <div
                    className="h-full bg-mustard origin-left transition-transform duration-100"
                    style={{ transform: `scaleX(${Math.min(100, progress) / 100})` }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          /* 3.4 - 4.4s Notebook cover slides in, stamp lands, antennae peek */
          <div className="animate-cover-slide bg-[#FAF5EC] hand-border notebook-edge p-8 text-center space-y-4">
            <svg width="96" height="44" viewBox="0 0 96 44" className="mx-auto animate-antennae-look" aria-hidden="true">
              <path d="M 36 40 C 31 24, 24 14, 18 7" stroke="#14231F" strokeWidth="3" strokeLinecap="round" fill="none" />
              <circle cx="18" cy="7" r="4.5" fill="#E9A800" stroke="#14231F" strokeWidth="2" />
              <path d="M 60 40 C 65 24, 72 14, 78 7" stroke="#14231F" strokeWidth="3" strokeLinecap="round" fill="none" />
              <circle cx="78" cy="7" r="4.5" fill="#E9A800" stroke="#14231F" strokeWidth="2" />
            </svg>

            <div className="animate-stamp-thud">
              <span
                className="rubber-stamp rubber-stamp-danger text-2xl sm:text-3xl tracking-widest bg-paper text-ink riso-misregister"
                data-text="অ্যান্টিবডি / ANTIBODY"
              >
                অ্যান্টিবডি / ANTIBODY
              </span>
            </div>

            <p className="text-xs font-mono text-faded-ink pt-2">
              XENOBIOLOGIST FIELD NOTEBOOK // OPENING CASE FILE...
            </p>
          </div>
        )}
      </div>

      <div className="relative z-10 text-xs text-faded-ink text-center">
        Click, tap, or press any key to skip // ক্লিক বা যেকোনো কী চাপুন
      </div>
    </div>
  );
};
