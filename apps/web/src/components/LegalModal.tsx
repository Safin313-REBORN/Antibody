import React, { useEffect } from 'react';

export type LegalDocType = 'privacy' | 'terms' | 'refund' | 'cookie' | 'compliance';

interface LegalModalProps {
  doc: LegalDocType | null;
  onClose: () => void;
  lang: 'bn' | 'en';
  onDeleteData?: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  doc,
  onClose,
  lang,
  onDeleteData
}) => {
  useEffect(() => {
    if (!doc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [doc, onClose]);

  if (!doc) return null;

  const titles: Record<LegalDocType, { bn: string; en: string }> = {
    privacy: { bn: 'গোপনীয়তা নীতি (Privacy Policy)', en: 'Privacy Policy' },
    terms: { bn: 'ব্যবহারের শর্তাবলি (Terms of Service)', en: 'Terms of Service' },
    refund: { bn: 'রিফান্ড নীতি (Refund Policy)', en: 'Refund Policy' },
    cookie: { bn: 'কুকি নীতি (Cookie Policy)', en: 'Cookie Policy' },
    compliance: { bn: 'ব্যবসায়িক তথ্য, লাইসেন্স ও অডিট', en: 'Business Details, Licenses & SDK Audit' }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={titles[doc][lang]}
      className="fixed inset-0 z-50 bg-ink/75 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="max-w-2xl w-full max-h-[85vh] overflow-y-auto bg-paper border-2 border-ink shadow-ink-lg p-6 space-y-4 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start border-b-2 border-ink pb-3">
          <div>
            <span className="font-mono text-[11px] bg-mustard px-2 py-0.5 font-bold uppercase text-ink">
              LEGAL &amp; TRANSPARENCY // {doc.toUpperCase()}
            </span>
            <h2 className="font-serif font-bold text-2xl text-ink mt-1">
              {titles[doc][lang]}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="min-h-[48px] min-w-[48px] font-mono text-xs font-bold border-2 border-ink hover:bg-mustard"
          >
            [ESC]
          </button>
        </div>

        <div className="font-sans text-sm text-ink space-y-3 leading-relaxed">
          {doc === 'privacy' && (
            <>
              <p>
                <strong>Data Minimization:</strong> Antibody collects only the minimum data needed to run your learning session: your chosen fictional callsign, an Argon2id-hashed passphrase (if registered), and your in-game scenario scores.
              </p>
              <p>
                <strong>Zero Sensitive Collection:</strong> We never collect real names, email addresses, phone numbers, national IDs, GPS location, or financial credentials. Guest accounts are automatically purged after 30 days of inactivity.
              </p>
              <p>
                <strong>Email &amp; Unsubscribe Policy:</strong> Because we do not collect email addresses, we send zero marketing emails. Any future optional institutional digest will include a one-click unsubscribe link.
              </p>
              <p>
                <strong>Data Deletion Requests:</strong> You can hard-delete all your server records at any time using the <em>Delete Data</em> button in the header or dashboard.
              </p>
              {onDeleteData && (
                <button
                  type="button"
                  onClick={() => {
                    onDeleteData();
                    onClose();
                  }}
                  className="min-h-[48px] px-4 py-2 bg-vermilion text-paper font-mono text-xs font-bold border-2 border-ink"
                >
                  Submit Immediate Data Deletion Request
                </button>
              )}
            </>
          )}

          {doc === 'terms' && (
            <>
              <p>
                <strong>Educational Simulation Only:</strong> Antibody (অ্যান্টিবডি) is a free scam-awareness educational game. All brands (such as &ldquo;Taka-Pay&rdquo;), phone numbers, SMS alerts, and &ldquo;pretend taka&rdquo; balances are 100% fictional.
              </p>
              <p>
                <strong>No Real Financial Advice:</strong> This tool teaches general cognitive defense against social engineering. If you experience a real financial scam, hang up immediately and contact your bank&rsquo;s official helpline or local authorities.
              </p>
              <p>
                <strong>Age Requirement:</strong> Players under 13 (or 16 where applicable) must have parent or guardian consent before creating a saved callsign.
              </p>
            </>
          )}

          {doc === 'refund' && (
            <>
              <p>
                <strong>100% Free — Zero Hidden Fees:</strong> Antibody is completely free to play. There are no subscriptions, no in-app purchases, no hidden fees, and all &ldquo;Taka-Pay&rdquo; balances are fictional training tokens.
              </p>
              <p>
                <strong>Refund Policy:</strong> Because no real money is charged, no payments are processed. Should an optional institutional workshop license ever be introduced, it will carry an unconditional 14-day full refund guarantee.
              </p>
            </>
          )}

          {doc === 'cookie' && (
            <>
              <p>
                <strong>Strictly Necessary Cookies Only:</strong> We set a single <code>httpOnly</code>, <code>SameSite=Strict</code> refresh token cookie for authenticated sessions, plus <code>sessionStorage</code> / <code>localStorage</code> for boot state and your cookie preference.
              </p>
              <p>
                <strong>No Tracking or Ad Cookies:</strong> We do not use Google Analytics, Meta Pixel, or any cross-site behavioral advertising cookies.
              </p>
            </>
          )}

          {doc === 'compliance' && (
            <>
              <p>
                <strong>Business / Operator Details:</strong> Antibody Cognitive Defense Lab (Educational Open-Source Initiative), Dhaka, Bangladesh. Email:{' '}
                <a href="mailto:contact@antibody-lab.org" className="underline text-teal font-bold">
                  contact@antibody-lab.org
                </a>{' '}
                | Helpline:{' '}
                <a href="tel:+8801600000000" className="underline text-teal font-bold">
                  +880 1600-000000
                </a>.
              </p>
              <p>
                <strong>Third-Party SDK Audit:</strong> Zero third-party analytics, crash-tracking, or ad-tech SDKs are bundled. Backend uses Fastify, Zod, Argon2id, and SQLite. Frontend uses React 18 and Tailwind CSS.
              </p>
              <p>
                <strong>Licensed Fonts &amp; Artwork:</strong> Typography uses SIL Open Font License (OFL) Google Fonts: <em>Tiro Bangla</em>, <em>Hind Siliguri</em>, <em>Newsreader</em>, and <em>IBM Plex Mono</em>. All alien illustrations and pathogen SVGs are original vector artwork created for this project.
              </p>
              <p>
                <strong>Accessibility &amp; Contrast:</strong> Ink <code>#14231F</code> on Paper <code>#F3EBDD</code> achieves &gt;11.2:1 contrast (WCAG AAA); Teal <code>#0E7C7B</code> &gt;5.4:1 (AA); Vermilion <code>#E4422B</code> &gt;4.6:1 (AA). Full keyboard navigation and <code>prefers-reduced-motion</code> are supported.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
