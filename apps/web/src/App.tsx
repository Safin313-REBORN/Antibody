import React, { useState, useEffect } from 'react';
import { BootAnimation } from './components/BootAnimation';
import { AgentAuthCard } from './components/AgentAuthCard';
import { TakaPaySandbox } from './components/TakaPaySandbox';
import { ScamCallExperience } from './components/ScamCallExperience';
import { TacticXRay } from './components/TacticXRay';
import { AntibodyBuilder } from './components/AntibodyBuilder';
import { MutationRound } from './components/MutationRound';
import { DashboardReport } from './components/DashboardReport';
import { ScamCoachPanel } from './components/ScamCoachPanel';
import {
  AgentProfile,
  DashboardMetrics,
  Scenario,
  SCENARIO_FIXTURES
} from '@antibody/shared';

export type GameStage =
  | 'boot'
  | 'auth'
  | 'case_intro'
  | 'wallet_sandbox'
  | 'scam_call'
  | 'tactic_xray'
  | 'antibody_builder'
  | 'mutation_round'
  | 'dashboard';

export default function App() {
  const [stage, setStage] = useState<GameStage>('boot');
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [agent, setAgent] = useState<AgentProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState(5000);
  const [activeScenario] = useState<Scenario>(SCENARIO_FIXTURES[0]);
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    try {
      const hasBooted = sessionStorage.getItem('antibody_booted');
      if (hasBooted) {
        setStage('auth');
      }
    } catch {}
  }, []);

  const handleBootComplete = () => {
    try {
      sessionStorage.setItem('antibody_booted', 'true');
    } catch {}
    setStage('auth');
  };

  const handleAuthenticated = (agentProfile: AgentProfile, authToken: string) => {
    setAgent(agentProfile);
    setToken(authToken);
    setStage('case_intro');
  };

  const handleDemoMode = () => {
    const demoAgent: AgentProfile = {
      id: 'demo_scout_01',
      callsign: 'Dhaka Scout',
      avatar: 'curious',
      isGuest: true,
      createdAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString()
    };
    setAgent(demoAgent);
    setStage('case_intro');
  };

  const handleDeleteData = async () => {
    if (token && token !== 'local-offline-token') {
      await fetch('/api/v1/me', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
    }
    setAgent(null);
    setToken(null);
    setDashboardMetrics(null);
    setWalletBalance(5000);
    setStage('auth');
  };

  const handleRoundComplete = async (results: { correct: number; falseAlarms: number; total: number }) => {
    const fallbackAccuracy = results.total > 0 ? Math.round((results.correct / results.total) * 100) : 100;
    const fallbackMetrics: DashboardMetrics = {
      agent: agent || {
        id: 'guest_01',
        callsign: 'Guest Agent',
        avatar: 'curious',
        isGuest: true,
        createdAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString()
      },
      totalAttempts: results.total,
      correctCatches: results.correct,
      falseAlarms: results.falseAlarms,
      accuracyRate: fallbackAccuracy,
      streak: results.correct,
      susceptibility: {
        urgency: { tactic: 'urgency', alpha: 2, beta: 5, score: 28, encounters: 5 },
        authority: { tactic: 'authority', alpha: 1, beta: 4, score: 20, encounters: 4 },
        fear: { tactic: 'fear', alpha: 2, beta: 4, score: 33, encounters: 4 },
        greed: { tactic: 'greed', alpha: 1, beta: 6, score: 14, encounters: 3 },
        secrecy: { tactic: 'secrecy', alpha: 1, beta: 5, score: 16, encounters: 3 },
        trust_hijack: { tactic: 'trust_hijack', alpha: 2, beta: 3, score: 40, encounters: 3 }
      },
      recentAttempts: []
    };

    if (token && token !== 'local-offline-token') {
      try {
        const res = await fetch('/api/v1/me/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = (await res.json()) as DashboardMetrics;
          setDashboardMetrics(data);
          setStage('dashboard');
          return;
        }
      } catch {}
    }

    setDashboardMetrics(fallbackMetrics);
    setStage('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-mustard selection:text-ink">
      {stage === 'boot' && <BootAnimation onComplete={handleBootComplete} />}

      {stage !== 'boot' && (
        <header className="border-b-2 border-ink bg-[#FAF5EB] px-4 py-3 flex flex-wrap justify-between items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="font-bold text-ink text-sm sm:text-base tracking-tight flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-vermilion rounded-full inline-block" />
              অ্যান্টিবডি // ANTIBODY
            </span>
            <span className="hidden sm:inline text-faded-ink text-[11px] border-l border-ink/30 pl-2">
              Dhaka Cognitive Specimen Lab
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="min-h-[40px] px-3 py-1 border border-ink hover:bg-mustard font-bold transition-all text-xs"
            >
              {lang === 'bn' ? 'ENGLISH' : 'বাংলা'}
            </button>

            <button
              type="button"
              onClick={handleDemoMode}
              className="min-h-[40px] px-3 py-1 bg-mustard text-ink font-bold border border-ink hover:bg-mustard/80 transition-all text-xs flex items-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>DEMO STORY</span>
            </button>

            {agent && (
              <div className="flex items-center gap-1.5">
                <span className="hidden md:inline bg-paper px-2 py-1 border border-ink text-faded-ink">
                  {agent.callsign}
                </span>
                <button
                  type="button"
                  onClick={handleDeleteData}
                  title="Delete my data"
                  className="min-h-[40px] px-2.5 py-1 border border-vermilion text-vermilion hover:bg-vermilion/10 font-bold text-[11px]"
                >
                  {lang === 'bn' ? 'তথ্য মুছুন' : 'Delete Data'}
                </button>
              </div>
            )}
          </div>
        </header>
      )}

      {stage !== 'boot' && (
        <main className="flex-1 container mx-auto px-4 py-4 max-w-4xl">
          {stage === 'auth' && (
            <AgentAuthCard
              onAuthenticated={handleAuthenticated}
              onContinueOffline={() => setStage('case_intro')}
            />
          )}

          {stage === 'case_intro' && (
            <div className="max-w-xl mx-auto my-8 bg-paper hand-border p-6 shadow-ink-lg space-y-4">
              <div className="border-b-2 border-ink pb-2">
                <span className="font-mono text-xs bg-mustard px-2 py-0.5 font-bold uppercase text-ink">
                  CONFIDENTIAL DOSSIER // কেস ফাইল
                </span>
                <h2 className="font-serif font-bold text-2xl text-ink mt-2 riso-misregister" data-text="Subject: 1 Alien. Money Exp: None.">
                  Subject: 1 Alien. Money Exp: None.
                </h2>
              </div>

              <p className="font-sans text-base text-ink leading-relaxed">
                {lang === 'bn'
                  ? 'মহাকাশ থেকে আসা এই কৌতূহলী প্রাণীটি ঢাকার রাস্তায় পা রেখেছে। তার হাতে তুলে দেওয়া হয়েছে একটি সিমুলেটেড ওয়ালেট অ্যাপ: "টাকা-পে" এবং ৫,০০০ কাল্পনিক টাকা। কিন্তু ঢাকার ফোনে ঘুরে বেড়ায় নিত্যনতুন বাটপাড়ি ও প্রতারক দল।'
                  : 'A naive extraterrestrial lands in Dhaka. Armed with a simulated wallet app "Taka-Pay" and 5,000 pretend taka, the alien knows nothing of urgency traps, fake police calls, or social engineering.'}
              </p>

              <div className="p-3 bg-[#FAF5EB] border-l-4 border-teal text-xs font-mono text-faded-ink">
                {lang === 'bn'
                  ? 'আপনার লক্ষ্য: এলিয়েনকে বিভিন্ন স্ক্যামের মুখে পড়তে দেওয়া, কৌশলগুলো এক্স-রে করা এবং তার মনে স্থায়ী "অ্যান্টিবডি" তৈরি করে দেওয়া।'
                  : 'Your Goal: Observe the alien encounter scams, inspect the tactic X-rays, and forge cognitive antibodies.'}
              </div>

              <button
                type="button"
                onClick={() => setStage('wallet_sandbox')}
                className="w-full min-h-[48px] py-3 bg-teal text-paper font-mono font-bold text-sm border-2 border-ink shadow-ink-blot hover:bg-teal/90 uppercase tracking-wider"
              >
                {lang === 'bn' ? 'গবেষণা শুরু করুন (Begin Study) →' : 'Begin Study →'}
              </button>
            </div>
          )}

          {stage === 'wallet_sandbox' && (
            <TakaPaySandbox
              balance={walletBalance}
              onFirstTransferComplete={() => setStage('scam_call')}
              lang={lang}
            />
          )}

          {stage === 'scam_call' && (
            <ScamCallExperience
              scenario={activeScenario}
              onBalanceDrained={() => {
                setWalletBalance(0);
                setStage('tactic_xray');
              }}
              lang={lang}
            />
          )}

          {stage === 'tactic_xray' && (
            <TacticXRay
              scenario={activeScenario}
              onContinueToAntibodies={() => setStage('antibody_builder')}
              lang={lang}
            />
          )}

          {stage === 'antibody_builder' && (
            <AntibodyBuilder
              tacticsToSolve={activeScenario.tactics}
              onAntibodiesReady={() => setStage('mutation_round')}
              lang={lang}
            />
          )}

          {stage === 'mutation_round' && (
            <MutationRound
              scenarios={SCENARIO_FIXTURES}
              token={token}
              onRoundComplete={handleRoundComplete}
              lang={lang}
            />
          )}

          {stage === 'dashboard' && dashboardMetrics && (
            <DashboardReport
              metrics={dashboardMetrics}
              onPlayAgain={() => {
                setWalletBalance(5000);
                setStage('case_intro');
              }}
              onDeleteData={handleDeleteData}
              lang={lang}
            />
          )}
        </main>
      )}

      {stage !== 'boot' && stage !== 'auth' && <ScamCoachPanel lang={lang} />}

      {stage !== 'boot' && (
        <footer className="border-t border-ink/20 py-3 px-4 text-center font-mono text-[11px] text-faded-ink">
          অ্যান্টিবডি (ANTIBODY) // কোনো বাস্তব অর্থ, ব্যক্তি বা সংস্থা জড়িত নয় // কাল্পনিক শিক্ষা প্রটোকল
        </footer>
      )}
    </div>
  );
}
