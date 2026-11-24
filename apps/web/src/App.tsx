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
import { NotebookLoadingScreen } from './components/NotebookLoadingScreen';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { LegalModal, LegalDocType } from './components/LegalModal';
import { NotFoundPage } from './components/NotFoundPage';
import { SiteSearchModal } from './components/SiteSearchModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { FaqAccordion } from './components/FaqAccordion';
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
  | 'dashboard'
  | 'not_found';

const SITE_ORIGIN = 'https://antibody-lab.org';

const STAGE_META: Record<
  Exclude<GameStage, 'boot'>,
  { slug: string; title: string; description: string; crumb: string }
> = {
  auth: {
    slug: '/',
    title: 'Field Agent Registration — Antibody (অ্যান্টিবডি)',
    description: 'Create an anonymous Field Agent ID or play as a guest with zero personal data collection.',
    crumb: 'Agent ID'
  },
  case_intro: {
    slug: '/case-file',
    title: 'Case File 01 — Antibody (অ্যান্টিবডি)',
    description: 'Meet the naive alien arriving in Dhaka with 5,000 pretend taka in Taka-Pay.',
    crumb: 'Case File'
  },
  wallet_sandbox: {
    slug: '/wallet-sandbox',
    title: 'Taka-Pay Wallet Sandbox — Antibody (অ্যান্টিবডি)',
    description: 'Practice safe mobile-money PIN and OTP hygiene in the Taka-Pay sandbox.',
    crumb: 'Wallet Sandbox'
  },
  scam_call: {
    slug: '/scam-call',
    title: 'Live Scam Call Simulation — Antibody (অ্যান্টিবডি)',
    description: 'Experience how a simulated scammer uses urgency and fake authority.',
    crumb: 'Scam Call'
  },
  tactic_xray: {
    slug: '/tactic-xray',
    title: 'Tactic X-Ray Autopsy — Antibody (অ্যান্টিবডি)',
    description: 'Dissect psychological scam pathogens under scientific glass.',
    crumb: 'Tactic X-Ray'
  },
  antibody_builder: {
    slug: '/antibody-lab',
    title: 'Antibody Synthesis Lab — Antibody (অ্যান্টিবডি)',
    description: 'Pair cognitive defense rules against social engineering tactics.',
    crumb: 'Antibody Lab'
  },
  mutation_round: {
    slug: '/mutation-exam',
    title: 'Mutation Exam — Antibody (অ্যান্টিবডি)',
    description: 'Classify real utility alerts and mutated Dhaka scams without false alarms.',
    crumb: 'Mutation Exam'
  },
  dashboard: {
    slug: '/report',
    title: 'Cognitive Resistance Report — Antibody (অ্যান্টিবডি)',
    description: 'Inspect your 6-tactic Bayesian susceptibility map and download your Agent ID.',
    crumb: 'Field Report'
  },
  not_found: {
    slug: '/404',
    title: '404 Specimen Not Found — Antibody (অ্যান্টিবডি)',
    description: 'The requested Antibody field page could not be found.',
    crumb: '404'
  }
} as any;

function resolveStageFromPath(pathname: string): GameStage {
  const clean = pathname.replace(/\/+$/, '') || '/';
  const match = (Object.entries(STAGE_META) as Array<[Exclude<GameStage, 'boot'>, any]>).find(
    ([key, meta]) => key !== 'not_found' && meta.slug === clean
  );
  if (match) return match[0];
  return clean === '/' ? 'auth' : 'not_found';
}

export default function App() {
  const [stage, setStage] = useState<GameStage>('boot');
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [agent, setAgent] = useState<AgentProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState(5000);
  const [activeScenario] = useState<Scenario>(SCENARIO_FIXTURES[0]);
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeLegalDoc, setActiveLegalDoc] = useState<LegalDocType | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);
  const [theme, setTheme] = useState<'paper' | 'night'>(() => {
    try {
      return localStorage.getItem('antibody_theme') === 'night' ? 'night' : 'paper';
    } catch {
      return 'paper';
    }
  });
  const [searchOpen, setSearchOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Dark mode attribute sync
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('antibody_theme', theme);
    } catch {}
  }, [theme]);

  // UTM tracking (non-PII campaign attribution)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const utmSource = params.get('utm_source');
      const utmMedium = params.get('utm_medium');
      const utmCampaign = params.get('utm_campaign');
      if (utmSource || utmMedium || utmCampaign) {
        sessionStorage.setItem(
          'antibody_utm',
          JSON.stringify({ utm_source: utmSource, utm_medium: utmMedium, utm_campaign: utmCampaign })
        );
      }
    } catch {}
  }, []);

  // Scroll progress bar & Back-to-top visibility
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0);
      setShowBackToTop(scrollTop > 240);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Resolve initial route if already booted or if visiting a 404 path directly
  useEffect(() => {
    const initialPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    const resolved = resolveStageFromPath(initialPath);
    if (resolved === 'not_found') {
      setStage('not_found');
      return;
    }
    try {
      const hasBooted = sessionStorage.getItem('antibody_booted');
      if (hasBooted) {
        setStage(resolved);
      }
    } catch {}
  }, []);

  // Listen to browser back/forward navigation
  useEffect(() => {
    const onPop = () => {
      setStage(resolveStageFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Update unique page title, meta description, and canonical link per route
  useEffect(() => {
    if (stage === 'boot') return;
    const meta = (STAGE_META as any)[stage] || STAGE_META.not_found;
    document.title = meta.title;
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute('content', meta.description);
    const canonEl = document.querySelector('link[rel="canonical"]');
    if (canonEl) canonEl.setAttribute('href', `${SITE_ORIGIN}${meta.slug}`);
  }, [stage]);

  const transitionTo = (nextStage: GameStage) => {
    const meta = (STAGE_META as any)[nextStage];
    if (meta && typeof window !== 'undefined' && window.location.pathname !== meta.slug) {
      window.history.pushState({}, '', meta.slug);
    }
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setStage(nextStage);
      return;
    }
    setIsTransitioning(true);
    setTimeout(() => {
      setStage(nextStage);
      setIsTransitioning(false);
    }, 380);
  };

  const handleBootComplete = () => {
    try {
      sessionStorage.setItem('antibody_booted', 'true');
    } catch {}
    const resolved =
      typeof window !== 'undefined' ? resolveStageFromPath(window.location.pathname) : 'auth';
    setStage(resolved);
  };

  const handleAuthenticated = (agentProfile: AgentProfile, authToken: string) => {
    setAgent(agentProfile);
    setToken(authToken);
    transitionTo('case_intro');
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
    transitionTo('case_intro');
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
    setMobileMenuOpen(false);
    setStatusBanner(
      lang === 'bn'
        ? 'আপনার সমস্ত তথ্য স্থায়ীভাবে মুছে ফেলা হয়েছে।'
        : 'All your agent records have been permanently deleted.'
    );
    transitionTo('auth');
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
          transitionTo('dashboard');
          return;
        }
      } catch {}
    }

    setDashboardMetrics(fallbackMetrics);
    transitionTo('dashboard');
  };

  const currentMeta = stage !== 'boot' ? (STAGE_META as any)[stage] || STAGE_META.not_found : null;

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-mustard selection:text-ink">
      {/* Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-mustard focus:text-ink focus:font-mono focus:text-xs focus:font-bold focus:border-2 focus:border-ink"
      >
        Skip to content
      </a>

      {/* Scroll progress bar */}
      {stage !== 'boot' && (
        <div
          aria-hidden="true"
          className="fixed top-0 left-0 right-0 h-1 bg-ink/10 z-40 pointer-events-none no-print"
        >
          <div
            className="h-full bg-mustard origin-left transition-transform duration-75"
            style={{ transform: `scaleX(${scrollProgress})` }}
          />
        </div>
      )}

      {stage === 'boot' && <BootAnimation onComplete={handleBootComplete} />}

      {stage !== 'boot' && (
        <header className="sticky top-0 z-30 border-b-2 border-ink bg-[#FAF5EB] px-4 py-3 flex flex-wrap justify-between items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-3">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                transitionTo('auth');
              }}
              className="font-bold text-ink text-sm sm:text-base tracking-tight flex items-center gap-1.5 hover:underline"
            >
              <span className="w-2.5 h-2.5 bg-vermilion rounded-full inline-block" aria-hidden="true" />
              অ্যান্টিবডি // ANTIBODY
            </a>
            <span className="hidden sm:inline text-faded-ink text-[11px] border-l border-ink/30 pl-2">
              Dhaka Cognitive Specimen Lab
            </span>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="min-h-[40px] px-3 py-1 border border-ink hover:bg-mustard font-bold transition-all text-xs"
            >
              {lang === 'bn' ? 'খুঁজুন (Search)' : 'Search'}
            </button>

            <button
              type="button"
              onClick={() => setTheme(theme === 'paper' ? 'night' : 'paper')}
              aria-label="Toggle dark mode"
              className="min-h-[40px] px-3 py-1 border border-ink hover:bg-mustard font-bold transition-all text-xs"
            >
              {theme === 'paper' ? 'Night Mode' : 'Paper Mode'}
            </button>

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
                <span className="bg-paper px-2 py-1 border border-ink text-faded-ink">
                  {agent.callsign}
                </span>
                <button
                  type="button"
                  onClick={() => setConfirmDeleteOpen(true)}
                  title="Delete my data"
                  className="min-h-[40px] px-2.5 py-1 border border-vermilion text-vermilion hover:bg-vermilion/10 font-bold text-[11px]"
                >
                  {lang === 'bn' ? 'তথ্য মুছুন' : 'Delete Data'}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label="Toggle mobile menu"
            className="md:hidden min-h-[44px] min-w-[44px] px-2.5 py-1 border-2 border-ink bg-paper font-bold text-xs flex items-center gap-1.5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <span>{mobileMenuOpen ? 'CLOSE' : 'MENU'}</span>
          </button>

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <nav
              id="mobile-nav"
              aria-label="Mobile Navigation"
              className="w-full md:hidden border-t-2 border-ink pt-3 mt-2 flex flex-col gap-2"
            >
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="min-h-[48px] px-3 py-2 border-2 border-ink bg-paper text-left font-bold"
              >
                {lang === 'bn' ? 'নমুনা খুঁজুন (Search)' : 'Search Specimens'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTheme(theme === 'paper' ? 'night' : 'paper');
                  setMobileMenuOpen(false);
                }}
                className="min-h-[48px] px-3 py-2 border-2 border-ink bg-paper text-left font-bold"
              >
                {theme === 'paper' ? 'Switch to Night Mode' : 'Switch to Paper Mode'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setLang(lang === 'bn' ? 'en' : 'bn');
                  setMobileMenuOpen(false);
                }}
                className="min-h-[48px] px-3 py-2 border-2 border-ink bg-paper text-left font-bold"
              >
                {lang === 'bn' ? 'Switch to ENGLISH' : 'বাংলায় দেখুন'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleDemoMode();
                }}
                className="min-h-[48px] px-3 py-2 border-2 border-ink bg-mustard text-ink text-left font-bold"
              >
                DEMO STORY (Quick Tour)
              </button>
              {agent && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setConfirmDeleteOpen(true);
                  }}
                  className="min-h-[48px] px-3 py-2 border-2 border-vermilion text-vermilion text-left font-bold"
                >
                  {lang === 'bn' ? `তথ্য মুছুন (${agent.callsign})` : `Delete Data (${agent.callsign})`}
                </button>
              )}
            </nav>
          )}
        </header>
      )}

      {stage !== 'boot' && (
        <main id="main-content" className="flex-1 container mx-auto px-4 py-4 max-w-4xl w-full">
          {statusBanner && (
            <div role="status" className="mb-4 p-3 bg-teal/15 border-l-4 border-teal text-teal font-mono text-xs font-bold flex justify-between items-center">
              <span>{statusBanner}</span>
              <button type="button" onClick={() => setStatusBanner(null)} className="underline ml-2">
                [OK]
              </button>
            </div>
          )}
          {/* Breadcrumbs + Internal Links */}
          {currentMeta && (
            <nav aria-label="Breadcrumb" className="font-mono text-xs text-faded-ink mb-2 flex items-center gap-2">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  transitionTo('auth');
                }}
                className="underline hover:text-ink"
              >
                Home
              </a>
              <span aria-hidden="true">/</span>
              <span className="text-ink font-bold">{currentMeta.crumb}</span>
            </nav>
          )}

          {isTransitioning ? (
            <NotebookLoadingScreen lang={lang} />
          ) : (
            <div key={stage} className="page-turn-enter">
              {stage === 'auth' && (
                <AgentAuthCard
                  onAuthenticated={handleAuthenticated}
                  onContinueOffline={() => transitionTo('case_intro')}
                  onOpenLegal={(doc) => setActiveLegalDoc(doc)}
                />
              )}

              {stage === 'case_intro' && (
                <div className="max-w-xl mx-auto my-8 bg-paper hand-border p-6 shadow-ink-lg space-y-4">
                  <div className="border-b-2 border-ink pb-2">
                    <span className="font-mono text-xs bg-mustard px-2 py-0.5 font-bold uppercase text-ink">
                      CONFIDENTIAL DOSSIER // কেস ফাইল
                    </span>
                    <h1 className="font-serif font-bold text-2xl text-ink mt-2 riso-misregister" data-text="Subject: 1 Alien. Money Exp: None.">
                      Subject: 1 Alien. Money Exp: None.
                    </h1>
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
                    onClick={() => transitionTo('wallet_sandbox')}
                    className="w-full min-h-[48px] py-3 bg-teal text-paper font-mono font-bold text-sm border-2 border-ink shadow-ink-blot hover:bg-teal/90 uppercase tracking-wider"
                  >
                    {lang === 'bn' ? 'গবেষণা শুরু করুন (Begin Study) →' : 'Begin Study →'}
                  </button>
                </div>
              )}

              {stage === 'wallet_sandbox' && (
                <TakaPaySandbox
                  balance={walletBalance}
                  onFirstTransferComplete={() => transitionTo('scam_call')}
                  lang={lang}
                />
              )}

              {stage === 'scam_call' && (
                <ScamCallExperience
                  scenario={activeScenario}
                  onBalanceDrained={() => {
                    setWalletBalance(0);
                    transitionTo('tactic_xray');
                  }}
                  lang={lang}
                />
              )}

              {stage === 'tactic_xray' && (
                <TacticXRay
                  scenario={activeScenario}
                  onContinueToAntibodies={() => transitionTo('antibody_builder')}
                  lang={lang}
                />
              )}

              {stage === 'antibody_builder' && (
                <AntibodyBuilder
                  tacticsToSolve={activeScenario.tactics}
                  onAntibodiesReady={() => transitionTo('mutation_round')}
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
                    transitionTo('case_intro');
                  }}
                  onDeleteData={() => setConfirmDeleteOpen(true)}
                  lang={lang}
                />
              )}

              {stage === 'not_found' && (
                <NotFoundPage onGoHome={() => transitionTo('auth')} lang={lang} />
              )}
            </div>
          )}

          {stage !== 'not_found' && <FaqAccordion lang={lang} />}
        </main>
      )}

      {stage !== 'boot' && stage !== 'auth' && stage !== 'not_found' && <ScamCoachPanel lang={lang} />}

      {/* Floating Contact & Back-to-Top Controls */}
      {stage !== 'boot' && (
        <div className="fixed bottom-4 left-4 z-30 flex items-center gap-2 no-print">
          <a
            href="mailto:contact@antibody-lab.org?subject=Antibody%20Inquiry"
            className="min-h-[44px] px-3 py-2 bg-paper text-ink font-mono text-xs font-bold border-2 border-ink shadow-ink-blot hover:bg-mustard flex items-center gap-1.5"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span>{lang === 'bn' ? 'যোগাযোগ' : 'Contact'}</span>
          </a>

          {showBackToTop && (
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              className="min-h-[44px] px-3 py-2 bg-ink text-paper font-mono text-xs font-bold border-2 border-mustard shadow-ink-blot"
            >
              ↑ TOP
            </button>
          )}
        </div>
      )}

      {stage !== 'boot' && (
        <CookieConsentBanner
          lang={lang}
          onOpenCookiePolicy={() => setActiveLegalDoc('cookie')}
        />
      )}

      <SiteSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        lang={lang}
        onNavigateStage={(target) => transitionTo(target)}
      />

      <ConfirmDeleteModal
        open={confirmDeleteOpen}
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={() => {
          setConfirmDeleteOpen(false);
          handleDeleteData();
        }}
        lang={lang}
      />

      <LegalModal
        doc={activeLegalDoc}
        onClose={() => setActiveLegalDoc(null)}
        lang={lang}
        onDeleteData={agent ? () => setConfirmDeleteOpen(true) : undefined}
      />

      {stage !== 'boot' && (
        <footer className="border-t border-ink/20 py-4 px-4 pb-20 text-center font-mono text-[11px] text-faded-ink space-y-2">
          <div>
            &copy; {new Date().getFullYear()} Antibody Cognitive Defense Lab (অ্যান্টিবডি) // Last updated: 2026-11-25
          </div>
          <div className="flex flex-wrap justify-center items-center gap-3">
            <a href="mailto:contact@antibody-lab.org" className="underline hover:text-ink">
              contact@antibody-lab.org
            </a>
            <span aria-hidden="true">|</span>
            <a href="tel:+8801600000000" className="underline hover:text-ink">
              +880 1600-000000
            </a>
          </div>
          <nav aria-label="Legal and compliance links" className="flex flex-wrap justify-center items-center gap-3">
            <button type="button" onClick={() => setActiveLegalDoc('privacy')} className="underline hover:text-ink">
              Privacy Policy
            </button>
            <button type="button" onClick={() => setActiveLegalDoc('terms')} className="underline hover:text-ink">
              Terms of Service
            </button>
            <button type="button" onClick={() => setActiveLegalDoc('refund')} className="underline hover:text-ink">
              Refund Policy
            </button>
            <button type="button" onClick={() => setActiveLegalDoc('cookie')} className="underline hover:text-ink">
              Cookie Policy
            </button>
            <button type="button" onClick={() => setActiveLegalDoc('compliance')} className="underline hover:text-ink">
              Business, Licenses &amp; SDK Audit
            </button>
            <button type="button" onClick={() => setStage('boot')} className="underline hover:text-ink font-bold">
              {lang === 'bn' ? 'বুট অ্যানিমেশন দেখুন' : 'Replay Boot'}
            </button>
          </nav>
        </footer>
      )}
    </div>
  );
}
