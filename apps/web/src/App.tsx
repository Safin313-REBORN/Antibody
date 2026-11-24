import React, { useState, useEffect } from 'react';
import { BootAnimation } from './components/BootAnimation';
import { AgentAuthCard } from './components/AgentAuthCard';
import { TakaPaySandbox } from './components/TakaPaySandbox';
import { ScamCallExperience } from './components/ScamCallExperience';
import { TacticXRay } from './components/TacticXRay';
import { AntibodyBuilder } from './components/AntibodyBuilder';
import { MutationRound } from './components/MutationRound';
import { DashboardReport } from './components/DashboardReport';
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
  const [activeScenario, setActiveScenario] = useState<Scenario>(SCENARIO_FIXTURES[0]);

  // Check reduced motion preference or prior boot session
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
    // Quick-jump 4-minute story path
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
    if (token) {
      await fetch('/api/v1/me', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
    }
    setAgent(null);
    setToken(null);
    setStage('auth');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-mustard selection:text-ink">
      {/* Boot Animation Screen */}
      {stage === 'boot' && <BootAnimation onComplete={handleBootComplete} />}

      {/* Global Top Header Bar */}
      {stage !== 'boot' && (
        <header className="border-b-2 border-ink bg-[#FAF5EB] px-4 py-3 flex justify-between items-center text-xs font-mono">
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
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="px-2 py-1 border border-ink hover:bg-mustard font-bold transition-all text-xs"
            >
              {lang === 'bn' ? 'ENGLISH' : 'বাংলা'}
            </button>

            <button
              onClick={handleDemoMode}
              className="px-2.5 py-1 bg-mustard text-ink font-bold border border-ink hover:bg-mustard/80 transition-all text-xs"
            >
              🚀 DEMO STORY
            </button>

            {agent && (
              <span className="hidden md:inline bg-paper px-2 py-1 border border-ink text-faded-ink">
                {agent.callsign}
              </span>
            )}
          </div>
        </header>
      )}

      {/* Main Flow Container */}
      {stage !== 'boot' && (
        <main className="flex-1 container mx-auto px-4 py-4 max-w-4xl">
          {/* Stage 1: Auth */}
          {stage === 'auth' && (
            <AgentAuthCard
              onAuthenticated={handleAuthenticated}
              onContinueOffline={() => setStage('case_intro')}
            />
          )}

          {/* Stage 2: Case File Intro */}
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

              <p className="font-sans text-sm sm:text-base text-ink leading-relaxed">
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
                onClick={() => setStage('wallet_sandbox')}
                className="w-full py-3 bg-teal text-paper font-mono font-bold text-sm border-2 border-ink shadow-ink-blot hover:bg-teal/90 uppercase tracking-wider"
              >
                {lang === 'bn' ? 'গবেষণা শুরু করুন (Begin Study) →' : 'Begin Study →'}
              </button>
            </div>
          )}

          {/* Stage 3: Wallet Sandbox */}
          {stage === 'wallet_sandbox' && (
            <TakaPaySandbox
              balance={walletBalance}
              onFirstTransferComplete={() => setStage('scam_call')}
              lang={lang}
            />
          )}

          {/* Stage 4: Scam Call Climax */}
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

          {/* Stage 5: Tactic X-Ray */}
          {stage === 'tactic_xray' && (
            <TacticXRay
              scenario={activeScenario}
              onContinueToAntibodies={() => setStage('antibody_builder')}
              lang={lang}
            />
          )}

          {/* Stage 6: Build Antibodies */}
          {stage === 'antibody_builder' && (
            <AntibodyBuilder
              tacticsToSolve={activeScenario.tactics}
              onAntibodiesReady={() => setStage('mutation_round')}
              lang={lang}
            />
          )}

          {/* Stage 7: Mutation Round */}
          {stage === 'mutation_round' && (
            <MutationRound
              scenarios={SCENARIO_FIXTURES}
              onRoundComplete={() => setStage('dashboard')}
              lang={lang}
            />
          )}

          {/* Stage 8: Dashboard & Postcard Report */}
          {stage === 'dashboard' && (
            <DashboardReport
              metrics={{
                agent: agent || {
                  id: 'guest_01',
                  callsign: 'Guest Agent',
                  avatar: 'curious',
                  isGuest: true,
                  createdAt: new Date().toISOString(),
                  lastSeenAt: new Date().toISOString()
                },
                totalAttempts: 6,
                correctCatches: 5,
                falseAlarms: 1,
                accuracyRate: 83,
                streak: 4,
                susceptibility: {
                  urgency: { tactic: 'urgency', alpha: 2, beta: 5, score: 28, encounters: 5 },
                  authority: { tactic: 'authority', alpha: 1, beta: 4, score: 20, encounters: 4 },
                  fear: { tactic: 'fear', alpha: 2, beta: 4, score: 33, encounters: 4 },
                  greed: { tactic: 'greed', alpha: 1, beta: 6, score: 14, encounters: 3 },
                  secrecy: { tactic: 'secrecy', alpha: 1, beta: 5, score: 16, encounters: 3 },
                  trust_hijack: { tactic: 'trust_hijack', alpha: 2, beta: 3, score: 40, encounters: 3 }
                },
                recentAttempts: []
              }}
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

      {/* Global Footer */}
      {stage !== 'boot' && (
        <footer className="border-t border-ink/20 py-3 px-4 text-center font-mono text-[11px] text-faded-ink">
          অ্যান্টিবডি (ANTIBODY) // কোনো বাস্তব অর্থ, ব্যক্তি বা সংস্থা জড়িত নয় // কাল্পনিক শিক্ষা প্রটোকল
        </footer>
      )}
    </div>
  );
}
