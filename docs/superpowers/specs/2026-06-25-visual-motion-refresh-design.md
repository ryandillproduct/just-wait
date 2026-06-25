# Visual & Motion Refresh — Design Spec

## Context

WhichPark? has been functionally solid but visually utilitarian since launch: flat cards, line-art silhouettes, almost no motion beyond a 500ms bar-width transition. The goal of this refresh is to make the app feel more polished and alive — richer visual depth and meaningful motion — without changing the underlying information architecture, scoring logic, or layout structure. This was explored interactively via the brainstorming visual companion; all directions below were approved against live, working mockups (not static images).

## 1. Visual style — "Warm Editorial Plus"

Keep the existing palette (cream `#FDF8F0` background, gold `#F5C842` accent, dark brown `#1C1008` text, Playfair Display + Inter typography). Add depth on top of it:

- Park cards get a soft drop shadow (`box-shadow: 0 4px 16px rgba(28,16,8,0.06)`) that intensifies on hover/press (`0 8px 24px rgba(28,16,8,0.1)`) with a slight lift (`translateY(-2px)`)
- The rank badge becomes a gradient gold circle (`linear-gradient(135deg, #F5C842, #E8A93A)`) instead of a flat fill, with a soft drop shadow of its own
- The Go Score bar fill becomes a gradient (`linear-gradient(90deg, #6FCF97, #34D399)` for high scores, shifting through the existing amber/red stops at lower scores) with a soft glow (`box-shadow: 0 0 12px` in the fill color at reduced opacity) instead of a flat color
- No changes to layout, spacing, or information hierarchy — this is a depth/richness pass, not a restructure

## 2. Iconography

Each park's icon moves from a flat line silhouette (currently rendered directly in muted gold/grey next to the park name, in a `w-12 h-12` / 48px slot) into a **filled icon inside a circular gradient gold badge** (`linear-gradient(135deg, #FBF0DC, #F0DCA8)` background, icon fill `#B8842E`). The badge replaces the existing 48px icon slot on the park card at roughly the same footprint (~52–56px) so the card layout doesn't shift.

All four landmark icons are redrawn as solid-fill shapes (not line art) for this treatment:

- **Magic Kingdom**: Cinderella Castle — five spires of varying height (center tallest with a flag), narrow conical roofs, base block with an arched doorway. (Approved as final — "absolutely nailed it.")
- **EPCOT**: Spaceship Earth — geodesic sphere on three tripod legs. Carried over from the existing silhouette with minimal change (already read well).
- **Hollywood Studios**: Tower of Terror — tiered tower with water-tower cap, narrow upper section, and arched side windows. Carried over with minimal change.
- **Animal Kingdom**: Tree of Life — full redesign. Canopy built from seven overlapping circles at full, even opacity (no opacity layering — that caused uneven dark blotches in review) for a full, rounded crown. Trunk is a solid tapered "vase" shape flaring into a wide base that reads as splayed roots, no separate root pieces or branch lines (those reduced clarity at small size).

The closed/inactive state of each icon keeps its existing muted treatment (lighter fill, no gradient badge) so the open/closed visual distinction is preserved.

## 3. Motion — "Expressive," applied app-wide

Direction chosen after live side-by-side comparison: bouncier, more characterful motion over a flatter "subtle" alternative.

- **Park card list entrance**: cards fade/slide in on load with a slight stagger between each (~0.12s delay per card) using an overshoot easing (`cubic-bezier(.34, 1.56, .64, 1)`) rather than a flat ease-out
- **#1 ranked card**: continuous soft glow pulse (~1.8s cycle) on its drop shadow, drawing the eye to the top pick without being distracting
- **Park icons**: continuous subtle idle pulse (slow scale 1 → 1.15 → 1, ~2.2s cycle, staggered slightly per card so they don't all pulse in unison)
- **Go Score bar fill**: animates in with the same overshoot easing as the card entrance, not a flat linear/ease-out fill
- **Card tap-to-expand** (ride list): currently an instant conditional render; becomes a smooth height transition using the CSS `grid-template-rows: 0fr → 1fr` technique (no JS height measurement needed, no new dependency) with the same overshoot easing
- **Go Score info modal**: entrance becomes a scale + fade bounce-in instead of an instant appear
- **Recommendation banner**: entrance becomes a fade/slide bounce-in on first load, matching the card list's stagger feel
- **Meet the Creator (About) page**: picks up the same visual depth (soft shadow on the photo frame) and a matching bounce-in entrance on load, so it doesn't feel like a flatter, disconnected page

### Accessibility

All continuous/looping animations (icon idle pulse, #1 card glow) and entrance bounces are wrapped in a `prefers-reduced-motion: no-preference` media query. Under reduced motion, entrances fall back to a simple, fast fade (no stagger, no overshoot, no continuous loops).

## 4. Implementation approach

- **No new dependencies.** Everything is achievable with plain CSS `@keyframes` + Tailwind utility classes, consistent with the existing stack (no `framer-motion` or similar).
- New/updated files:
  - `src/components/ParkSilhouette.tsx` — replace existing path data with the four redrawn filled icons; add a badge wrapper (or a sibling component) for the gradient circle background
  - `src/components/ParkCard.tsx` — updated shadow/hover/lift styles, gradient badge + bar, stagger entrance animation (delay derived from rank index), grid-rows expand/collapse transition
  - `src/components/RecommendedBanner.tsx` — entrance animation
  - `src/components/GoScoreInfoModal.tsx` — entrance animation
  - `src/app/about/page.tsx` — matching shadow depth + entrance animation
  - `src/app/globals.css` — new shared `@keyframes` definitions (stagger-in, glow-pulse, icon-pulse, grid-rows expand) and the `prefers-reduced-motion` overrides
- No changes to `src/app/api/parks/route.ts`, scoring logic, or data shapes — this is purely a presentation-layer change.

## Out of scope

- No changes to the underlying Go Score algorithm, tiebreaker logic, or API data
- No changes to copy/wording (covered in prior sessions)
- No native app work (separately discussed and deferred)
