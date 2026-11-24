import React, { useState, useEffect } from 'react';

interface BootAnimationProps {
  onComplete: () => void;
}

export const BootAnimation: React.FC<BootAnimationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [serverStatus, setServerStatus] = useState<string>('Checking...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
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
    const timer4 = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-ink text-[#F3EBDD] font-mono z-50 flex flex-col justify-between p-8 select-none">
      {/* Top terminal banner */}
      <div className="flex justify-between items-center text-xs tracking-widest text-faded-ink border-b border-faded-ink pb-2">
        <span>ANTIBODY FIELD TERMINAL v1.0 // BANGLADESH NODE</span>
        <button
          onClick={onComplete}
          className="text-mustard hover:underline font-bold focus:outline-none focus:ring-2 focus:ring-mustard px-2 py-1"
        >
          [SKIP / এড়িয়ে চলুন]
        </button>
      </div>

      {/* Terminal boot logs */}
      <div className="max-w-xl my-auto space-y-3 text-sm sm:text-base">
        <p className="text-mustard font-bold">
          &gt; SYSTEM_BOOT_SEQ_01
        </p>

        {step >= 1 && (
          <div className="space-y-1.5 animate-fadeIn">
            <p>&gt; Checking antennae sensors... <span className="text-teal font-bold">ok</span></p>
            <p>&gt; Loading Dhaka street telemetry map... <span className="text-teal font-bold">ok</span></p>
            <p>&gt; Loading scam pathogen specimens (6)... <span className="text-teal font-bold">ok</span></p>
            <p>
              &gt; Syncing with secure Dhaka server...{' '}
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
          <div className="pt-6 text-center animate-bounce">
            <span className="rubber-stamp rubber-stamp-danger text-2xl tracking-widest bg-paper text-ink">
              অ্যান্টিবডি / ANTIBODY
            </span>
            <p className="text-xs text-faded-ink mt-2">Field specimen binder opened.</p>
          </div>
        )}
      </div>

      <div className="text-xs text-faded-ink text-center">
        CONFIDENTIAL FIELD RESEARCH // DHAKA STREET COGNITIVE DEFENSE
      </div>
    </div>
  );
};
