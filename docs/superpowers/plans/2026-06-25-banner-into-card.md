# Fold Best-Park Banner Into #1 Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the separate "Best Park to Visit Right Now" banner and fold its information into a highlighted strip on the #1 ranked card, while collapsing tie-breaker reasoning into that same strip instead of stacking a second note.

**Architecture:** Pure client-side presentation change across three files. `ParkCard` gains a self-contained `TopPickStrip` sub-component that derives all its text from the `park` prop it already receives (no new data threaded in). `RecommendedBanner` is stripped down to only the all-parks-closed message (its only remaining job). `page.tsx` stops always rendering the banner and only renders it when there's no recommendation.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Jest 30 + React Testing Library.

## Global Constraints

- No new dependencies — plain React/TypeScript only.
- No changes to `src/app/api/parks/route.ts`, scoring logic, or the `ScoredPark`/`Recommendation` types.
- No changes to the Go Score bar gradient/coloring.
- No changes to the page header tagline.
- The `TopPickStrip` text must be computed entirely from the `ParkCard`'s own `park` prop — no `Recommendation` object passed into `ParkCard`.
- Time framing tiers (`mins < 60`, `mins < 300`, else) and the `formatTimeUntilClose` rounding behavior must match exactly what `RecommendedBanner`'s deleted `SummaryText` used.

---

### Task 1: Fold the "why" info into the #1 card, with tie-folding

**Files:**
- Modify: `src/components/ParkCard.tsx` (full file shown below)
- Modify: `src/__tests__/components/ParkCard.test.tsx` (full file shown below)

**Interfaces:**
- Consumes: `ScoredPark` type (unchanged) — specifically `avgWaitMinutes`, `score`, `closingTimeMs`, `tiebreakerNote`, all of which already exist on every `ScoredPark` returned by the API.
- Produces: `ParkCard({ park, rank, headlinerNames })` — same signature as before, no change. No other file imports from `ParkCard.tsx` besides `page.tsx`, which doesn't need to change for this task.

- [ ] **Step 1: Write the failing tests**

Replace the entire contents of `src/__tests__/components/ParkCard.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ParkCard } from '@/components/ParkCard';
import { ScoredPark } from '@/types';

const openPark: ScoredPark = {
  id: 6,
  name: 'Magic Kingdom',
  silhouetteKey: 'magic-kingdom',
  showtimesUrl: 'https://disneyworld.disney.go.com/entertainment/magic-kingdom/',
  themeParksId: '75ea578a-adc8-4116-a54d-dccb60765ef9',
  score: 4,
  label: 'Moderate crowds',
  rides: [
    { id: 1, name: 'Seven Dwarfs Mine Train', is_open: true, wait_time: 10, last_updated: '' },
  ],
  hours: '9 AM – 10 PM',
  isOpen: true,
  closingTimeMs: Date.now() + 90 * 60 * 1000, // 90 min from now
  avgWaitMinutes: 20,
  goScore: 7,
  openAttractionCount: 12,
};

const closedPark: ScoredPark = {
  ...openPark,
  isOpen: false,
  hours: null,
  closingTimeMs: null,
  goScore: 0,
};

describe('ParkCard', () => {
  it('renders park name', () => {
    render(<ParkCard park={openPark} rank={1} headlinerNames={[]} />);
    expect(screen.getByText('Magic Kingdom')).toBeInTheDocument();
  });

  it('shows a gradient icon badge background when the park is open', () => {
    render(<ParkCard park={openPark} rank={1} headlinerNames={[]} />);
    expect(screen.getByTestId('icon-badge')).toHaveClass('icon-badge-open');
  });

  it('does not show the gradient icon badge background when the park is closed', () => {
    render(<ParkCard park={closedPark} rank={null} headlinerNames={[]} />);
    expect(screen.getByTestId('icon-badge')).not.toHaveClass('icon-badge-open');
  });

  it('expands ride list wrapper on click', () => {
    render(<ParkCard park={openPark} rank={1} headlinerNames={[]} />);
    expect(screen.getByTestId('ride-list-wrapper')).not.toHaveClass('expand-grid-open');
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('ride-list-wrapper')).toHaveClass('expand-grid-open');
  });

  it('collapses ride list wrapper on second click', () => {
    render(<ParkCard park={openPark} rank={1} headlinerNames={[]} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('ride-list-wrapper')).not.toHaveClass('expand-grid-open');
  });

  it('does not expand for closed parks', () => {
    render(<ParkCard park={closedPark} rank={null} headlinerNames={[]} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('ride-list-wrapper')).not.toHaveClass('expand-grid-open');
  });

  it('applies the stagger entrance animation with a delay based on rank', () => {
    render(<ParkCard park={openPark} rank={2} headlinerNames={[]} />);
    const card = screen.getByTestId('park-card');
    expect(card).toHaveClass('animate-card-stagger-in');
    expect(card.style.animationDelay).toBe('0.12s');
  });

  it('applies the continuous glow pulse only to the #1 ranked card', () => {
    render(<ParkCard park={openPark} rank={1} headlinerNames={[]} />);
    expect(screen.getByTestId('park-card')).toHaveClass('animate-glow-pulse');
  });

  it('does not apply the glow pulse to a lower-ranked card', () => {
    render(<ParkCard park={openPark} rank={2} headlinerNames={[]} />);
    expect(screen.getByTestId('park-card')).not.toHaveClass('animate-glow-pulse');
  });

  it('applies the icon idle pulse when the park is open', () => {
    render(<ParkCard park={openPark} rank={1} headlinerNames={[]} />);
    expect(screen.getByTestId('icon-badge')).toHaveClass('animate-icon-pulse');
  });

  it('does not apply the icon idle pulse when the park is closed', () => {
    render(<ParkCard park={closedPark} rank={null} headlinerNames={[]} />);
    expect(screen.getByTestId('icon-badge')).not.toHaveClass('animate-icon-pulse');
  });

  it('renders a top pick strip with avg wait, crowd score, and time framing for the #1 card', () => {
    render(<ParkCard park={openPark} rank={1} headlinerNames={[]} />);
    const strip = screen.getByTestId('top-pick-strip');
    expect(strip).toHaveTextContent('Top pick right now');
    expect(strip).toHaveTextContent('20 min avg wait, crowd level 4/10');
    expect(strip).toHaveTextContent('About 1 hr 30 min left until close.');
  });

  it('does not render the top pick strip for lower-ranked cards', () => {
    render(<ParkCard park={openPark} rank={2} headlinerNames={[]} />);
    expect(screen.queryByTestId('top-pick-strip')).not.toBeInTheDocument();
  });

  it('shows the imminent-closing time framing when under 60 minutes remain', () => {
    const almostClosed: ScoredPark = { ...openPark, closingTimeMs: Date.now() + 30 * 60 * 1000 };
    render(<ParkCard park={almostClosed} rank={1} headlinerNames={[]} />);
    expect(screen.getByTestId('top-pick-strip')).toHaveTextContent('Only ~30 min left until close.');
  });

  it('renders the standalone tiebreaker note for non-#1 cards as before', () => {
    const tied: ScoredPark = { ...openPark, tiebreakerNote: 'Lower average wait than Hollywood Studios' };
    render(<ParkCard park={tied} rank={2} headlinerNames={[]} />);
    expect(screen.getByText('Lower average wait than Hollywood Studios')).toBeInTheDocument();
    expect(screen.queryByTestId('top-pick-strip')).not.toBeInTheDocument();
  });

  it('folds an average-wait tiebreaker reason into the top pick strip instead of a separate note', () => {
    const tied: ScoredPark = { ...openPark, tiebreakerNote: 'Lower average wait than Hollywood Studios' };
    render(<ParkCard park={tied} rank={1} headlinerNames={[]} />);
    const strip = screen.getByTestId('top-pick-strip');
    expect(strip).toHaveTextContent('edges out Hollywood Studios on average wait');
    expect(screen.queryByText('Lower average wait than Hollywood Studios')).not.toBeInTheDocument();
  });

  it('folds an open-attractions tiebreaker reason into the top pick strip using the right wording', () => {
    const tied: ScoredPark = { ...openPark, tiebreakerNote: 'More open attractions than EPCOT' };
    render(<ParkCard park={tied} rank={1} headlinerNames={[]} />);
    expect(screen.getByTestId('top-pick-strip')).toHaveTextContent('edges out EPCOT on open attractions');
  });
});
```

- [ ] **Step 2: Run tests to verify the new ones fail**

Run: `npx jest src/__tests__/components/ParkCard.test.tsx`
Expected: FAIL — `getByTestId('top-pick-strip')` doesn't exist yet.

- [ ] **Step 3: Replace `src/components/ParkCard.tsx`**

```tsx
'use client';

import { useEffect, useState } from 'react';
import { ScoredPark } from '@/types';
import { ParkSilhouette } from './ParkSilhouette';
import { RideList } from './RideList';

interface Props {
  park: ScoredPark;
  rank: number | null;
  headlinerNames: string[];
}

// Green → amber → red for goScore 10→5→0 (higher goScore = greener).
// Returns a two-stop gradient (light → dark of the same hue) plus a glow
// shadow color, instead of a single flat color.
function goScoreBarStyle(goScore: number): { gradient: string; glow: string } {
  const green = { r: 52, g: 211, b: 153 };
  const amber = { r: 251, g: 191, b: 36 };
  const red = { r: 251, g: 113, b: 133 };

  let r, g, b;
  if (goScore >= 5) {
    const t = (goScore - 5) / 5;
    r = Math.round(amber.r + t * (green.r - amber.r));
    g = Math.round(amber.g + t * (green.g - amber.g));
    b = Math.round(amber.b + t * (green.b - amber.b));
  } else {
    const t = goScore / 5;
    r = Math.round(red.r + t * (amber.r - red.r));
    g = Math.round(red.g + t * (amber.g - red.g));
    b = Math.round(red.b + t * (amber.b - red.b));
  }

  const dark = `rgb(${r},${g},${b})`;
  const light = `rgb(${Math.round(r + (255 - r) * 0.45)},${Math.round(g + (255 - g) * 0.45)},${Math.round(b + (255 - b) * 0.45)})`;
  return {
    gradient: `linear-gradient(90deg, ${light}, ${dark})`,
    glow: `0 0 12px rgba(${r},${g},${b},0.5)`,
  };
}

// Matches the rounding RecommendedBanner's deleted SummaryText used to use.
function formatTimeUntilClose(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hrs} hr${hrs > 1 ? 's' : ''}`;
  return `${hrs} hr ${mins} min`;
}

function useLiveMinutesUntilClose(closingTimeMs: number | null): number | null {
  const compute = () =>
    closingTimeMs !== null ? Math.round((closingTimeMs - Date.now()) / 60000) : null;

  const [mins, setMins] = useState<number | null>(compute);

  useEffect(() => {
    setMins(compute());
    const interval = setInterval(() => setMins(compute()), 60000);
    return () => clearInterval(interval);
  }, [closingTimeMs]);

  return mins;
}

function timeFramingSentence(mins: number | null): string {
  if (mins === null) return '';
  if (mins < 60) return ` Only ~${formatTimeUntilClose(mins)} left until close.`;
  if (mins < 300) return ` About ${formatTimeUntilClose(mins)} left until close.`;
  return " There's plenty of time left to enjoy the park.";
}

// route.ts's tiebreakerReason() always returns one of these two exact
// prefixes followed by the losing park's name — parse it back apart so we
// can fold it into the strip's wording instead of showing it as a second note.
function parseTiebreakerNote(note: string): { dimension: string; loserName: string } | null {
  const waitPrefix = 'Lower average wait than ';
  const attractionsPrefix = 'More open attractions than ';
  if (note.startsWith(waitPrefix)) {
    return { dimension: 'average wait', loserName: note.slice(waitPrefix.length) };
  }
  if (note.startsWith(attractionsPrefix)) {
    return { dimension: 'open attractions', loserName: note.slice(attractionsPrefix.length) };
  }
  return null;
}

function TopPickStrip({ park }: { park: ScoredPark }) {
  const mins = useLiveMinutesUntilClose(park.closingTimeMs);
  const tie = park.tiebreakerNote ? parseTiebreakerNote(park.tiebreakerNote) : null;

  return (
    <div data-testid="top-pick-strip" className="mt-2 rounded-lg bg-[#FDF3D6] px-2.5 py-2">
      <p className="text-[11px] leading-snug text-[#1C1008]">
        <span className="font-bold text-[#8B6914]">
          {tie
            ? `Top pick right now — edges out ${tie.loserName} on ${tie.dimension}.`
            : 'Top pick right now —'}
        </span>{' '}
        {park.avgWaitMinutes} min avg wait, crowd level {park.score}/10.
        {timeFramingSentence(mins)}
      </p>
    </div>
  );
}

export function ParkCard({ park, rank, headlinerNames }: Props) {
  const [expanded, setExpanded] = useState(false);
  const fillPercent = park.isOpen ? (park.goScore / 10) * 100 : 0;
  const { gradient: barGradient, glow: barGlow } = goScoreBarStyle(park.goScore);

  return (
    <div
      data-testid="park-card"
      className={`relative rounded-2xl bg-white overflow-hidden shadow-[0_4px_16px_rgba(28,16,8,0.06)] transition-all duration-200 hover:shadow-[0_8px_24px_rgba(28,16,8,0.1)] hover:-translate-y-0.5 ${rank !== null ? 'animate-card-stagger-in' : ''} ${rank === 1 ? 'animate-glow-pulse' : ''}`}
      style={rank !== null ? { animationDelay: `${(rank - 1) * 0.12}s` } : undefined}
    >
      {rank !== null && (
        <div
          className="absolute top-2 left-2 w-6 h-6 rounded-full shadow-[0_2px_8px_rgba(232,169,58,0.5)] flex items-center justify-center z-10"
          style={{ background: 'linear-gradient(135deg, #F5C842, #E8A93A)' }}
        >
          <span className="text-xs font-bold text-[#1C1008] leading-none">{rank}</span>
        </div>
      )}
      <button
        onClick={() => park.isOpen && setExpanded((v) => !v)}
        className={`w-full text-left p-5 flex items-center gap-4 ${park.isOpen ? '' : 'cursor-default'}`}
        aria-expanded={expanded}
        aria-disabled={!park.isOpen}
      >
        <div
          data-testid="icon-badge"
          className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${park.isOpen ? 'icon-badge-open animate-icon-pulse' : ''}`}
          style={park.isOpen ? { background: 'linear-gradient(135deg, #FBF0DC, #F0DCA8)' } : undefined}
        >
          <ParkSilhouette
            parkKey={park.silhouetteKey}
            className="w-8 h-8"
            style={{ color: park.isOpen ? '#B8842E' : '#DDD8D0' }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <p className={`font-playfair text-lg font-semibold truncate ${park.isOpen ? 'text-[#1C1008]' : 'text-[#B5A898]'}`}>
              {park.name}
            </p>
          </div>
          {(park.hours || !park.isOpen) && (
            <p className="text-xs text-[#B5A898] mt-0.5">
              {park.isOpen ? park.hours : park.hours ? `Closed · ${park.hours}` : 'Closed'}
            </p>
          )}
          {park.isOpen && (
            <>
              <div className="mt-2 w-full h-1.5 rounded-full bg-[#EDE8E1] overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${fillPercent}%`,
                    background: barGradient,
                    boxShadow: barGlow,
                    transition: 'width 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.5s ease',
                  }}
                />
              </div>
              <p className="text-xs text-[#B5A898] mt-1">Go Score · {(Math.round(park.goScore * 2) / 2).toFixed(1)}/10</p>
              {rank === 1 ? (
                <TopPickStrip park={park} />
              ) : (
                park.tiebreakerNote && (
                  <p className="text-xs text-[#B5A898] mt-0.5 italic">{park.tiebreakerNote}</p>
                )
              )}
            </>
          )}
        </div>
      </button>

      <div
        data-testid="ride-list-wrapper"
        className={`expand-grid ${expanded && park.isOpen ? 'expand-grid-open' : ''}`}
      >
        <div>
          <div className="px-5 pb-5">
            <div className="border-t border-black/[0.06] pt-4">
              {park.isOpen && park.avgWaitMinutes > 0 && (
                <p className="text-xs text-[#B5A898] mb-3">
                  <span className="font-semibold text-[#8B7355]">{park.avgWaitMinutes} min</span> avg wait across open attractions
                </p>
              )}
              <RideList rides={park.rides} headlinerNames={headlinerNames} showtimesUrl={park.showtimesUrl} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest src/__tests__/components/ParkCard.test.tsx`
Expected: PASS (16 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/ParkCard.tsx src/__tests__/components/ParkCard.test.tsx
git commit -m "Fold top-pick info and tiebreaker reasoning into the #1 ranked card"
```

---

### Task 2: Simplify RecommendedBanner to only the all-parks-closed message

**Files:**
- Modify: `src/components/RecommendedBanner.tsx` (full file shown below)
- Modify: `src/__tests__/components/RecommendedBanner.test.tsx` (full file shown below)

**Interfaces:**
- Consumes: nothing — the component now takes no props.
- Produces: `RecommendedBanner()` — no props (was `RecommendedBanner({ recommendation })`). `page.tsx` (Task 3) is the only consumer and is updated in the next task to stop passing a prop and to only render this component when there's no recommendation.

- [ ] **Step 1: Write the failing/updated tests**

Replace the entire contents of `src/__tests__/components/RecommendedBanner.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { RecommendedBanner } from '@/components/RecommendedBanner';

describe('RecommendedBanner', () => {
  it('applies the bounce-in entrance on the all-parks-closed message', () => {
    render(<RecommendedBanner />);
    expect(screen.getByTestId('recommended-banner')).toHaveClass('animate-bounce-in');
  });

  it('shows the all-parks-closed message', () => {
    render(<RecommendedBanner />);
    expect(
      screen.getByText('All parks are closed right now. Check back once the parks reopen for live rankings.')
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to confirm current behavior**

Run: `npx jest src/__tests__/components/RecommendedBanner.test.tsx`
Expected: PASS — `next/jest` uses SWC, not full type-checking, so calling `<RecommendedBanner />` without the `recommendation` prop doesn't fail at test time; `recommendation` is simply `undefined`, which is falsy, so the *old* component's closed-message branch (unchanged markup) already satisfies both tests. This task's real change is removing the now-dead winner-rendering branch, helpers, and the `recommendation` prop itself — Task 3's `npm run build` is what actually catches a prop-signature mismatch, since `next build` runs full TypeScript checking. Proceed to Step 3 regardless.

- [ ] **Step 3: Replace `src/components/RecommendedBanner.tsx`**

```tsx
export function RecommendedBanner() {
  return (
    <div
      data-testid="recommended-banner"
      className="mb-6 px-5 py-4 rounded-2xl bg-[#F5EFE6] text-center animate-bounce-in"
    >
      <p className="text-[#B5A898] text-sm">
        All parks are closed right now. Check back once the parks reopen for live rankings.
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest src/__tests__/components/RecommendedBanner.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/RecommendedBanner.tsx src/__tests__/components/RecommendedBanner.test.tsx
git commit -m "Simplify RecommendedBanner to only the all-parks-closed message"
```

---

### Task 3: Stop rendering the banner when there's a recommendation

**Files:**
- Modify: `src/app/page.tsx:68` (single line change, full surrounding context shown below)

**Interfaces:**
- Consumes: `RecommendedBanner()` from Task 2 (no props).
- Produces: no change to `Home`'s own behavior/exports — this is a leaf change in the JSX tree.

- [ ] **Step 1: Update `src/app/page.tsx`**

Find this line (currently line 68, immediately after the `{!loading && !error && (` block opens):

```tsx
          <RecommendedBanner recommendation={recommendation} />
```

Replace it with:

```tsx
          {!recommendation && <RecommendedBanner />}
```

No other lines in `page.tsx` change. The `Recommendation` import on line 5 and the `recommendation` state variable stay exactly as they are — `recommendation` is still passed nowhere else, but it's still read here in the new conditional, and `ParkCard` still relies on `park.tiebreakerNote`/`park.avgWaitMinutes`/etc. for the #1 card's strip, all of which come from `parks`, not `recommendation`.

- [ ] **Step 2: Verify manually**

Run: `npm run build`
Expected: build succeeds with no TypeScript errors (confirms `RecommendedBanner`'s new no-props signature matches this call site).

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "Only render RecommendedBanner when all parks are closed"
```

---

### Task 4: Full verification pass

**Files:** none modified — verification only.

**Interfaces:** N/A.

- [ ] **Step 1: Run the full test suite**

Run: `npx jest`
Expected: All test files under `src/__tests__/components/ParkCard.test.tsx` and `src/__tests__/components/RecommendedBanner.test.tsx` PASS, along with every other previously-passing suite (`ParkSilhouette.test.tsx`, `globals.test.ts`, `GoScoreInfoModal.test.tsx`, `about.test.tsx`, `scoring.test.ts`). `RideList.test.tsx` and `queueTimes.test.ts` remain pre-existing, out-of-scope failures unrelated to this plan.

- [ ] **Step 2: Run the production build**

Run: `npm run build`
Expected: Build succeeds with no TypeScript or lint errors.

- [ ] **Step 3: Manually verify in the dev server**

Run: `npm run dev`, open `http://localhost:3000`, and confirm:
- No separate banner/card appears above the ranked list when at least one park is open.
- The #1 ranked card shows the gold-tinted strip with "Top pick right now" plus avg wait, crowd level, and time-until-close framing, updating live.
- If two parks currently display the same Go Score, confirm the #1 card's strip says "edges out {name} on {average wait|open attractions}" and that the #2 (and lower) card still shows its own separate italic tiebreaker note unchanged.
- Temporarily simulate the all-parks-closed state (e.g. by checking behavior outside park operating hours, or by temporarily returning `recommendation: null` from the API in a local test) and confirm the simplified closed message still appears in the banner's old spot.

- [ ] **Step 4: Push**

```bash
git push origin main
```
