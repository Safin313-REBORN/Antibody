# DESIGN SYSTEM & ART DIRECTION: ANTIBODY (অ্যান্টিবডি)

## 1. Visual Metaphor
"Xenobiologist's field notebook meets Dhaka hand-painted street signage."
- World texture: Scuffed warm paper, halftone dot matrix, ink blots.
- The Device: A mobile handset presented under observation glass.
- Pathogens: Scam tactics represented as biological micro-organisms.
- Colors: Direct Dhaka rickshaw and enamel sign palette, strictly flat (zero gradients, zero AI glow).

## 2. Color Palette (WCAG AA/AAA Certified)
- **Paper**: `#F3EBDD` (Warm notebook fiber background)
- **Ink**: `#14231F` (Deep carbon ink; Night Mode background)
- **Faded Ink**: `#5B6B63` (Field notes, secondary labels)
- **Vermilion**: `#E4422B` (Scam / Danger / Pathogens)
- **Mustard**: `#E9A800` (Warning / Stamps / Highlights / Focus rings)
- **Teal**: `#0E7C7B` (Safe / Cognitive Antibodies)
- **Rose**: `#D94F8A` (Alien biological accents)

## 3. Typography & Spacing
- **Headings (Bangla)**: Tiro Bangla
- **Body & UI (Bangla)**: Hind Siliguri (`18px` base on mobile, `1.7` line-height)
- **Headings (Latin)**: Newsreader
- **Labels & System Codes**: IBM Plex Mono
- **Touch Targets**: `48px` minimum height on all primary controls.

## 4. Motion Tokens
- **Entrances**: `cubic-bezier(0.2, 0.8, 0.2, 1)`
- **Exits**: `cubic-bezier(0.4, 0, 1, 1)`
- **Reduced Motion**: `@media (prefers-reduced-motion: reduce)` disables transforms and collapses boot to a `600ms` fade.

## 5. Hand-Crafted Anti-AI Rules
- No glassmorphism, no purple/blue gradients, no uniform pill buttons, no emoji.
- Misregistration offset (1–2px riso layer split) on critical stamps.
- Hand-drawn wobbly borders (`hand-border`) and custom layered SVG alien character.
- Print stylesheet (`@media print`) formats reports cleanly on paper.
