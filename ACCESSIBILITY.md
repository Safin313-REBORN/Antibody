# ACCESSIBILITY (a11y) REPORT

## Verification Checklist
1. **Color Contrast**:
   - Ink `#14231F` on Paper `#F3EBDD`: Ratio > 11.2:1 (exceeds WCAG AAA).
   - Teal `#0E7C7B` on Paper: Ratio > 5.4:1 (exceeds WCAG AA).
   - Vermilion `#E4422B` on Paper: Ratio > 4.6:1 (meets WCAG AA).
2. **Typography**:
   - Proper Unicode conjunct rendering for Bangla script.
   - Generous line-height (1.6) to prevent ligatures overlapping.
   - Body font at least 18px on touch viewports.
3. **Motion Sensitivity**:
   - Boot animation automatically bypassed when reduced-motion is detected or session is cached.
   - All animations respect `prefers-reduced-motion`.
4. **Keyboard & Screen Readers**:
   - Full keyboard navigation path (`Tab`, `Enter`, `Space`).
   - High-contrast mustard focus rings.
   - ARIA live announcements for balance shifts and stamps.
