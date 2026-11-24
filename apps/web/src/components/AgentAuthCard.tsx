import React, { useState } from 'react';
import { AlienCharacter, AlienMood } from './AlienCharacter';
import { AgentProfile } from '@antibody/shared';

interface AgentAuthCardProps {
  onAuthenticated: (agent: AgentProfile, token: string) => void;
  onContinueOffline: () => void;
  onOpenLegal?: (doc: 'privacy' | 'terms') => void;
}

const RANDOM_CALLSIGNS = [
  'Mango Antenna',
  'Shapla Signal',
  'Jamuna Scout',
  'Padma Probe',
  'Rickshaw Rover',
  'Boishakh Beacon'
];

const RANDOM_WORD_BANKS = [
  ['river', 'lamp', 'seven'],
  ['breeze', 'cloud', 'mango'],
  ['tiger', 'bridge', 'green'],
  ['bamboo', 'flute', 'solar']
];

export const AgentAuthCard: React.FC<AgentAuthCardProps> = ({
  onAuthenticated,
  onContinueOffline,
  onOpenLegal
}) => {
  const [tab, setTab] = useState<'guest' | 'register' | 'login'>('guest');
  const [callsign, setCallsign] = useState(RANDOM_CALLSIGNS[0]);
  const [passphrase, setPassphrase] = useState(RANDOM_WORD_BANKS[0].join('-'));
  const [selectedAvatar, setSelectedAvatar] = useState<AlienMood>('curious');
  const [formConsent, setFormConsent] = useState(false);
  const [ageConsent, setAgeConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleGuestPlay = async () => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await fetch('/api/v1/auth/guest', { method: 'POST' });
      if (!res.ok) throw new Error('Could not establish guest session');
      const data = await res.json();
      setSuccessMsg('Guest pass issued! Opening case file...');
      onAuthenticated(data.agent, data.token);
    } catch {
      const fallbackAgent: AgentProfile = {
        id: 'local_guest_' + Math.random().toString(36).substring(2, 7),
        callsign: 'Local Scout',
        avatar: 'curious',
        isGuest: true,
        createdAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString()
      };
      setSuccessMsg('Offline guest pass issued! Opening case file...');
      onAuthenticated(fallbackAgent, 'local-offline-token');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callsign,
          passphrase,
          avatar: selectedAvatar
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      onAuthenticated(data.agent, data.token);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callsign, passphrase })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }
      onAuthenticated(data.agent, data.token);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-8 p-6 bg-paper hand-border shadow-ink-lg">
      {/* Top Notebook Tag */}
      <div className="flex justify-between items-start border-b-2 border-ink pb-3 mb-4">
        <div>
          <span className="font-mono text-xs bg-mustard px-2 py-0.5 font-bold uppercase tracking-wider text-ink">
            SPECIMEN ACCESS PASS // আইডি কার্ড
          </span>
          <h1 className="text-2xl font-serif font-bold text-ink mt-1 riso-misregister" data-text="Field Agent Registration">
            Field Agent Registration
          </h1>
          <p className="text-xs text-faded-ink">
            কোনো ব্যক্তিগত তথ্য (ইমেইল/ফোন নম্বর) সংগ্রহ করা হয় না। কেবল গেমের অগ্রগতি সংরক্ষিত থাকে।
          </p>
        </div>
        <div className="rubber-stamp rubber-stamp-safe text-xs">
          STRICT PRIVACY
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex border-b border-ink/30 mb-6 font-mono text-xs">
        <button
          onClick={() => setTab('guest')}
          className={`px-4 py-2 font-bold transition-all ${
            tab === 'guest'
              ? 'bg-ink text-paper border-t-2 border-x-2 border-ink'
              : 'text-faded-ink hover:text-ink'
          }`}
        >
          1. এক ক্লিকে অতিথি (Guest)
        </button>
        <button
          onClick={() => setTab('register')}
          className={`px-4 py-2 font-bold transition-all ${
            tab === 'register'
              ? 'bg-ink text-paper border-t-2 border-x-2 border-ink'
              : 'text-faded-ink hover:text-ink'
          }`}
        >
          2. নতুন আইডি তৈরি (Create ID)
        </button>
        <button
          onClick={() => setTab('login')}
          className={`px-4 py-2 font-bold transition-all ${
            tab === 'login'
              ? 'bg-ink text-paper border-t-2 border-x-2 border-ink'
              : 'text-faded-ink hover:text-ink'
          }`}
        >
          3. সংরক্ষিত আইডি (Login)
        </button>
      </div>

      {errorMsg && (
        <div role="alert" className="p-3 bg-vermilion/15 border-l-4 border-vermilion text-vermilion text-xs font-mono mb-4">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div role="status" className="p-3 bg-teal/15 border-l-4 border-teal text-teal text-xs font-mono mb-4 font-bold">
          {successMsg}
        </div>
      )}

      {/* Guest Tab */}
      {tab === 'guest' && (
        <div className="space-y-4 text-center py-4">
          <div className="flex justify-center">
            <AlienCharacter mood="curious" size={130} />
          </div>
          <p className="text-sm font-sans text-ink">
            কোনো নাম বা পাসওয়ার্ড ছাড়াই সরাসরি ঢাকা মোবাইল স্ক্যাম গবেষণাগারে প্রবেশ করুন। আপনার ব্রাউজারে ফলাফল সংরক্ষিত থাকবে।
          </p>
          <div className="text-left space-y-2 p-3 bg-[#FAF5EC] border border-ink/40 text-xs font-sans">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formConsent}
                onChange={(e) => setFormConsent(e.target.checked)}
                className="mt-1 w-4 h-4 accent-teal"
              />
              <span>
                I consent to storing only my chosen callsign and game scores (no email/phone/real name) per the{' '}
                <button type="button" onClick={() => onOpenLegal?.('privacy')} className="underline text-teal font-bold">
                  Privacy Policy
                </button>{' '}
                and{' '}
                <button type="button" onClick={() => onOpenLegal?.('terms')} className="underline text-teal font-bold">
                  Terms of Service
                </button>.
              </span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={ageConsent}
                onChange={(e) => setAgeConsent(e.target.checked)}
                className="mt-1 w-4 h-4 accent-teal"
              />
              <span>
                I confirm I am 13+ (or 16+ where required) or have parent/guardian consent to play.
              </span>
            </label>
          </div>

          <button
            type="button"
            onClick={handleGuestPlay}
            disabled={loading || !formConsent || !ageConsent}
            className="w-full min-h-[48px] py-3 bg-teal text-paper font-mono font-bold text-base shadow-ink-blot hover:bg-teal/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all border-2 border-ink"
          >
            {loading ? 'অনুসন্ধান শুরু হচ্ছে...' : 'Play as Guest / অতিথি হিসেবে শুরু করুন'}
          </button>
        </div>
      )}

      {/* Register Tab */}
      {tab === 'register' && (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold text-ink mb-1">
              FIELD CALLSIGN / ডাকনাম (স্বয়ংক্রিয় বা পছন্দসই)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={callsign}
                onChange={(e) => setCallsign(e.target.value)}
                required
                className="flex-1 p-2 bg-[#FAF5EC] border-2 border-ink font-mono text-sm focus:outline-none focus:ring-2 focus:ring-mustard"
              />
              <button
                type="button"
                onClick={() =>
                  setCallsign(RANDOM_CALLSIGNS[Math.floor(Math.random() * RANDOM_CALLSIGNS.length)])
                }
                className="px-3 py-2 border-2 border-ink font-mono text-xs bg-mustard/30 hover:bg-mustard"
              >
                র‌্যান্ডম
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-ink mb-1">
              SECRET 3-WORD PASSPHRASE / ৩ শব্দের গোপন চাবিকাঠি
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                required
                className="flex-1 p-2 bg-[#FAF5EC] border-2 border-ink font-mono text-sm focus:outline-none focus:ring-2 focus:ring-mustard"
              />
              <button
                type="button"
                onClick={() => {
                  const set = RANDOM_WORD_BANKS[Math.floor(Math.random() * RANDOM_WORD_BANKS.length)];
                  setPassphrase(set.join('-'));
                }}
                className="px-3 py-2 border-2 border-ink font-mono text-xs bg-mustard/30 hover:bg-mustard"
              >
                নতুন
              </button>
            </div>
            <p className="text-[11px] text-faded-ink mt-1 font-mono">
              * এটি লিখে রাখুন। কোনো ইমেইল রিকভারি নেই। কেবল এই ৩ শব্দ দিয়ে পুনরায় লগইন করতে পারবেন।
            </p>
          </div>

          {/* Avatar selector */}
          <div>
            <span className="block text-xs font-mono font-bold text-ink mb-2">
              SELECT SPECIMEN MOOD / এলিয়েন ভাবমূর্তি
            </span>
            <div className="flex justify-around bg-paper/60 p-2 border border-ink/40">
              {(['curious', 'trusting', 'confused', 'proud'] as AlienMood[]).map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setSelectedAvatar(m)}
                  className={`p-1 rounded ${selectedAvatar === m ? 'border-2 border-teal bg-teal/10' : 'opacity-60'}`}
                >
                  <AlienCharacter mood={m} size={48} />
                </button>
              ))}
            </div>
          </div>

          <div className="text-left space-y-2 p-3 bg-[#FAF5EC] border border-ink/40 text-xs font-sans">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={formConsent}
                onChange={(e) => setFormConsent(e.target.checked)}
                className="mt-1 w-4 h-4 accent-teal"
              />
              <span>
                I agree to the{' '}
                <button type="button" onClick={() => onOpenLegal?.('privacy')} className="underline text-teal font-bold">
                  Privacy Policy
                </button>{' '}
                (callsign + Argon2id hash + scores only, ৳0 free forever).
              </span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={ageConsent}
                onChange={(e) => setAgeConsent(e.target.checked)}
                className="mt-1 w-4 h-4 accent-teal"
              />
              <span>
                I confirm I meet the minimum age requirement (13+/16+) or have parent/guardian consent.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !formConsent || !ageConsent}
            className="w-full min-h-[48px] py-3 bg-ink text-paper font-mono font-bold text-sm shadow-ink-blot hover:bg-ink/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all border-2 border-ink mt-4"
          >
            {loading ? 'আইডি খোদাই করা হচ্ছে...' : 'Create Agent Card / কার্ড নিশ্চিত করুন'}
          </button>
        </form>
      )}

      {/* Login Tab */}
      {tab === 'login' && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold text-ink mb-1">
              SAVED CALLSIGN / ডাকনাম
            </label>
            <input
              type="text"
              value={callsign}
              onChange={(e) => setCallsign(e.target.value)}
              required
              placeholder="e.g. Mango Antenna"
              className="w-full p-2 bg-[#FAF5EC] border-2 border-ink font-mono text-sm focus:outline-none focus:ring-2 focus:ring-mustard"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-ink mb-1">
              3-WORD PASSPHRASE / ৩ শব্দের পাসফ্রেজ
            </label>
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              required
              placeholder="word-word-word"
              className="w-full p-2 bg-[#FAF5EC] border-2 border-ink font-mono text-sm focus:outline-none focus:ring-2 focus:ring-mustard"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-mustard text-ink font-mono font-bold text-sm shadow-ink-blot hover:bg-mustard/90 transition-all border-2 border-ink mt-2"
          >
            {loading ? 'লগইন যাচাই হচ্ছে...' : 'Resume Study / পূর্বের আইডি দিয়ে শুরু'}
          </button>
        </form>
      )}
    </div>
  );
};
