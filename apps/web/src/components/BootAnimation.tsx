import React, { useState, useEffect, useCallback } from 'react';

interface BootAnimationProps {
  onComplete: () => void;
}

export const BootAnimation: React.FC<BootAnimationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
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
          setServerStatus('ok (dhaka-secure-cell online)');
        } else {
          setServerStatus('Server asleep. Playing offline.');
        }
      })
      .catch(() => {
        setServerStatus('Server asleep. Playing offline.');
      });

    // Sequence timers
    const timer1 = setTimeout(() => setStep(1), 600);
    const timer2 = setTimeout(() => setStep(2), 2000);
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 120);

    const timer3 = setTimeout(() => setStep(3), 3400);
    const timer4 = setTimeout(triggerComplete, 5000);

    const onKey = () => triggerComplete();
    window.addEventListener('keydown', onKey);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearInterval(progressInterval);
      window.removeEventListener('keydown', onKey);
    };
  }, [triggerComplete]);

  return (
    <div
      onClick={triggerComplete}
      role="region"
      aria-label="Antibody boot terminal. Click, tap, or press any key to skip."
      className={`fixed inset-0 bg-ink text-[#F3EBDD] font-mono z-50 flex flex-col justify-between p-8 select-none cursor-pointer transition-opacity duration-500 ${
        fadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Top terminal banner */}
      <div className="flex justify-between items-center text-xs tracking-widest text-faded-ink border-b border-faded-ink pb-2">
        <span>ANTIBODY FIELD TERMINAL v1.0 // BANGLADESH NODE</span>
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

      {/* Terminal boot logs */}
      <div className="max-w-xl my-auto space-y-3 text-sm sm:text-base">
        <p className="text-mustard font-bold flex items-center gap-2">
          <span>&gt; SYSTEM_BOOT_SEQ_01</span>
          <span className="inline-block w-2.5 h-4 bg-mustard animate-pulse" aria-hidden="true" />
        </p>

        {step >= 1 && (
          <div className="space-y-1.5 animate-fadeIn">
            <p>&gt; Checking antennae... <span className="text-teal font-bold">ok</span></p>
            <p>&gt; Loading Dhaka street map... <span className="text-teal font-bold">ok</span></p>
            <p>&gt; Loading scam specimens (6)... <span className="text-teal font-bold">ok</span></p>
            <p>
              &gt; Syncing with server...{' '}
              <span className={serverStatus.includes('offline') ? 'text-mustard' : 'text-teal font-bold'}>
                {serverStatus}
              </span>
            </p>
          </div>
        )}

        {step >= 2 && (
          <div className="pt-4 space-y-2">
            <div className="flex justify-between text-xs text-faded-ink">
              <span>INK_BUFFER_SATURATION</span>
              <span>{progress}%</span>
            </div>
            {/* Hand-drawn ink line progress */}
            <div className="w-full h-3 border border-mustard p-0.5">
              <div
                className="h-full bg-mustard transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {step >= 3 && (
          <div className="pt-6 text-center space-y-2 animate-fadeIn">
            {/* Alien antennae peeking over the notebook cover */}
            <svg width="80" height="36" viewBox="0 0 80 36" className="mx-auto" aria-hidden="true">
              <path d="M 30 34 C 26 20, 20 12, 16 6" stroke="#A3D9C9" strokeWidth="3" strokeLinecap="round" fill="none" />
              <circle cx="16" cy="6" r="4" fill="#E9A800" />
              <path d="M 50 34 C 54 20, 60 12, 64 6" stroke="#A3D9C9" strokeWidth="3" strokeLinecap="round" fill="none" />
              <circle cx="64" cy="6" r="4" fill="#E9A800" />
            </svg>
            <div>
              <span className="rubber-stamp rubber-stamp-danger text-2xl tracking-widest bg-paper text-ink">
                অ্যান্টিবডি / ANTIBODY
              </span>
            </div>
            <p className="text-xs text-faded-ink mt-2">Click anywhere or press any key to continue.</p>
          </div>
        )}
      </div>

      <div className="text-xs text-faded-ink text-center">
        CONFIDENTIAL FIELD RESEARCH // DHAKA STREET COGNITIVE DEFENSE
      </div>
    </div>
  );
};
