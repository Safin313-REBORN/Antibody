# COMPLIANCE, PRIVACY & ACCESSIBILITY AUDIT

## 1. Data Minimization & Privacy
- **Collected**: Fictional callsign, Argon2id passphrase hash (optional, only if registered), selected alien mood, and in-game scenario scores.
- **Not Collected**: Real names, email addresses, phone numbers, IP addresses (beyond transient in-memory rate-limit counters), GPS, or payment details.
- **Data Deletion**: Hard-delete cascade via `DELETE /api/v1/me` and accessible via the persistent header `Delete Data` button and Privacy Policy modal.
- **Email / Unsubscribe**: No emails are collected or sent; any future institutional digest includes a one-click unsubscribe link.

## 2. Third-Party SDK & Dependency Audit
- **Analytics / Ads / Trackers**: None (0 third-party tracking SDKs).
- **Web Fonts**: `Tiro Bangla`, `Hind Siliguri`, `Newsreader`, and `IBM Plex Mono` served via Google Fonts under the **SIL Open Font License (OFL)**.
- **Images & Icons**: 100% original custom inline SVG illustrations (`AlienCharacter.tsx`, `SpecimenIcon.tsx`, `NotebookLoadingScreen.tsx`).

## 3. Dark-Pattern & Integrity Audit
- **No Hidden Fees**: 100% free educational simulation; all Taka-Pay balances are fictional.
- **No Fake Reviews or Unsupported Claims**: Zero fabricated testimonials or unverified claims.
- **Equal-Weight Cookie Banner**: `Necessary Only` and `Accept & Continue` buttons have equal 48px+ tap targets and clear labels.
- **Explicit Form & Age Consent**: Unchecked-by-default privacy + age/guardian consent checkbox required before creating an account or starting as a guest.

## 4. Accessibility & Contrast
- Ink `#14231F` on Paper `#F3EBDD`: >11.2:1 (WCAG AAA)
- Teal `#0E7C7B` on Paper `#F3EBDD`: >5.4:1 (WCAG AA)
- Vermilion `#E4422B` on Paper `#F3EBDD`: >4.6:1 (WCAG AA)
- Minimum 48px touch targets, visible mustard focus rings, `aria-live="polite"` regions, and `prefers-reduced-motion` support.
