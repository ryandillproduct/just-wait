# Ride List Visual Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the expanded ride list (`RideList.tsx`) to match the rest of the app's card depth and motion language — soft card rows, a headliner accent stripe, color-coded wait-time chips, and a staggered entrance — plus add a one-line legend explaining the headliner star.

**Architecture:** Two focused component changes. `RideList.tsx` gets new row styling, a `waitTimeChipClass()` helper, and a staggered entrance animation driven by a new `globals.css` keyframe. `ParkCard.tsx` gets one line appended to its existing avg-wait paragraph — no new component, no prop changes.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Jest 30 + React Testing Library.

## Global Constraints

- No new dependencies — plain CSS + Tailwind only.
- No changes to `RideList`'s props/signature (`rides`, `headlinerNames`, `showtimesUrl` unchanged) or to scoring logic.
- No changes to the Showtimes link or static-ride "—" treatment.
- Wait-time chip thresholds: `<= 20` min green, `21–45` min amber, `>= 46` min red. Closed rides get a neutral gray chip with text "Down" (unchanged copy).
- Headliner rows get a 3px gold (`#F5C842`) left border and a star (`★`, color `#E8A93A`) with `aria-label="Headliner attraction"`; non-headliner rows get a 3px transparent left border.
- The legend text appended to `ParkCard.tsx`'s avg-wait line is exactly: `· ★ Headliner attraction` (no equals sign), using the same star color `#E8A93A`.
- All new animations must be gated behind `@media (prefers-reduced-motion: no-preference)`, matching every other animation already in `globals.css`.

**Plan deviation from the spec, noted for the record:** the spec's prose said the row-entrance animation should use `backwards` fill-mode. Every other entrance animation already in this codebase (`cardStaggerIn`, `bounceIn`) actually uses `forwards` — `backwards` only affects the state *during* the animation-delay period, not after the animation completes, so a literal `backwards` implementation would cause each row to snap back to invisible after animating in (since the inner media-query rule's static `opacity: 0` would apply once the animation's hold period ends). This plan uses `forwards`, consistent with the working pattern every other entrance animation in `globals.css` already follows.

---

### Task 1: Restyle RideList rows, wait-time chips, and staggered entrance

**Files:**
- Modify: `src/components/RideList.tsx` (full file shown below)
- Modify: `src/__tests__/components/RideList.test.tsx` (currently stale/broken — fixture is missing the required `showtimesUrl` prop and asserts an `aria-label` that doesn't exist yet; this task replaces the whole file)
- Modify: `src/app/globals.css` (append new keyframe/class, shown below)
- Modify: `src/__tests__/styles/globals.test.ts` (append one new test, shown below)

**Interfaces:**
- Consumes: `.animate-ride-row-in` class from this task's own `globals.css` addition. `Ride` type (unchanged) — uses `id`, `name`, `is_open`, `wait_time`, `isShow`, `isStatic`.
- Produces: `RideList({ rides, headlinerNames, showtimesUrl })` — same signature as before. `ParkCard.tsx` (Task 2) renders `RideList` unchanged and doesn't need to know about any of this task's internals.

- [ ] **Step 1: Write the failing tests**

Append this test to the `describe('globals.css motion utilities', ...)` block in `src/__tests__/styles/globals.test.ts` (after the existing tests, before the closing `});`):

```ts
  it('defines the ride row entrance animation', () => {
    expect(css).toContain('@keyframes rideRowIn');
    expect(css).toContain('.animate-ride-row-in');
  });
```

Replace the entire contents of `src/__tests__/components/RideList.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { RideList } from '@/components/RideList';
import { Ride } from '@/types';

const rides: Ride[] = [
  { id: 1, name: 'Seven Dwarfs Mine Train', is_open: true, wait_time: 60, last_updated: '' },
  { id: 2, name: 'Space Mountain', is_open: true, wait_time: 30, last_updated: '' },
  { id: 3, name: 'Pirates of the Caribbean', is_open: true, wait_time: 10, last_updated: '' },
  { id: 4, name: 'Country Bear Jamboree', is_open: false, wait_time: 0, last_updated: '' },
];
const headlinerNames = ['Seven Dwarfs Mine Train'];
const showtimesUrl = 'https://disneyworld.disney.go.com/entertainment/magic-kingdom/';

describe('RideList', () => {
  it('renders all rides', () => {
    render(<RideList rides={rides} headlinerNames={headlinerNames} showtimesUrl={showtimesUrl} />);
    expect(screen.getByText('Seven Dwarfs Mine Train')).toBeInTheDocument();
    expect(screen.getByText('Space Mountain')).toBeInTheDocument();
  });

  it('shows wait times in minutes', () => {
    render(<RideList rides={rides} headlinerNames={headlinerNames} showtimesUrl={showtimesUrl} />);
    expect(screen.getByText('60 min')).toBeInTheDocument();
    expect(screen.getByText('30 min')).toBeInTheDocument();
  });

  it('marks headliner rides with an aria-label star', () => {
    render(<RideList rides={rides} headlinerNames={headlinerNames} showtimesUrl={showtimesUrl} />);
    expect(screen.getByLabelText('Headliner attraction')).toBeInTheDocument();
  });

  it('applies the red wait-time chip color for waits of 46 minutes or more', () => {
    render(<RideList rides={rides} headlinerNames={headlinerNames} showtimesUrl={showtimesUrl} />);
    const chip = screen.getByText('60 min');
    expect(chip).toHaveClass('bg-[#FCE4E6]');
    expect(chip).toHaveClass('text-[#B3273E]');
  });

  it('applies the amber wait-time chip color for waits between 21 and 45 minutes', () => {
    render(<RideList rides={rides} headlinerNames={headlinerNames} showtimesUrl={showtimesUrl} />);
    const chip = screen.getByText('30 min');
    expect(chip).toHaveClass('bg-[#FEF3D6]');
    expect(chip).toHaveClass('text-[#92660A]');
  });

  it('applies the green wait-time chip color for waits of 20 minutes or less', () => {
    render(<RideList rides={rides} headlinerNames={headlinerNames} showtimesUrl={showtimesUrl} />);
    const chip = screen.getByText('10 min');
    expect(chip).toHaveClass('bg-[#E3F6EC]');
    expect(chip).toHaveClass('text-[#1E8E5A]');
  });

  it('shows a neutral gray chip for closed rides', () => {
    render(<RideList rides={rides} headlinerNames={headlinerNames} showtimesUrl={showtimesUrl} />);
    const chip = screen.getByText('Down');
    expect(chip).toHaveClass('bg-[#F0EBE3]');
  });

  it('gives headliner rows a gold left border and non-headliner rows a transparent one', () => {
    render(<RideList rides={rides} headlinerNames={headlinerNames} showtimesUrl={showtimesUrl} />);
    const rows = screen.getAllByTestId('ride-row');
    expect(rows[0]).toHaveClass('border-l-[#F5C842]'); // Seven Dwarfs Mine Train (headliner)
    expect(rows[1]).toHaveClass('border-l-transparent'); // Space Mountain (not a headliner)
  });

  it('applies a staggered animation delay based on row index', () => {
    render(<RideList rides={rides} headlinerNames={headlinerNames} showtimesUrl={showtimesUrl} />);
    const rows = screen.getAllByTestId('ride-row');
    expect((rows[0] as HTMLElement).style.animationDelay).toBe('0s');
    expect((rows[1] as HTMLElement).style.animationDelay).toBe('0.05s');
    expect((rows[2] as HTMLElement).style.animationDelay).toBe('0.1s');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx jest src/__tests__/components/RideList.test.tsx src/__tests__/styles/globals.test.ts`
Expected: FAIL — `getByLabelText('Headliner attraction')` doesn't exist yet, `getAllByTestId('ride-row')` doesn't exist yet, chip color classes don't exist yet, and `globals.css` doesn't contain `rideRowIn`/`.animate-ride-row-in` yet.

- [ ] **Step 3: Append to `src/app/globals.css`**

Add this block at the end of the file (after the existing `@media (prefers-reduced-motion: reduce) { .expand-grid { ... } }` block):

```css

/* ===== Motion: staggered ride row entrance when a card expands ===== */
@keyframes rideRowIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-ride-row-in {
  opacity: 1;
}
@media (prefers-reduced-motion: no-preference) {
  .animate-ride-row-in {
    opacity: 0;
    animation: rideRowIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
}
```

- [ ] **Step 4: Replace `src/components/RideList.tsx`**

```tsx
import { Ride } from '@/types';

interface Props {
  rides: Ride[];
  headlinerNames: string[];
  showtimesUrl: string;
}

const CHIP_BASE = 'text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0';

// Green ≤20min, amber 21-45min, red 46min+ — see plan's Global Constraints.
function waitTimeChipClass(waitTime: number): string {
  if (waitTime <= 20) return 'bg-[#E3F6EC] text-[#1E8E5A]';
  if (waitTime <= 45) return 'bg-[#FEF3D6] text-[#92660A]';
  return 'bg-[#FCE4E6] text-[#B3273E]';
}

export function RideList({ rides, headlinerNames, showtimesUrl }: Props) {
  function isHeadliner(rideName: string): boolean {
    return headlinerNames.some((h) =>
      rideName.toLowerCase().includes(h.toLowerCase())
    );
  }

  return (
    <ul className="mt-4 space-y-2">
      {rides.map((ride, index) => {
        const headliner = isHeadliner(ride.name);
        return (
          <li
            key={ride.id}
            data-testid="ride-row"
            className={`animate-ride-row-in flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-white shadow-[0_2px_8px_rgba(28,16,8,0.05)] transition-all duration-200 hover:shadow-[0_4px_14px_rgba(28,16,8,0.1)] hover:-translate-y-0.5 border-l-[3px] ${headliner ? 'border-l-[#F5C842]' : 'border-l-transparent'}`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <span className="flex items-center gap-2 text-sm text-[#1C1008] min-w-0">
              {headliner && (
                <span aria-label="Headliner attraction" className="text-[#E8A93A] text-xs">★</span>
              )}
              <span className="truncate">{ride.name}</span>
            </span>
            <span className="flex-shrink-0 ml-3">
              {ride.isShow ? (
                <a
                  href={showtimesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[#8B7355] underline underline-offset-2 hover:text-[#5C4A2A] transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  Showtimes ↗
                </a>
              ) : ride.isStatic ? (
                <span className="text-sm font-semibold text-[#C4B49A]">—</span>
              ) : !ride.is_open ? (
                <span data-testid="wait-chip" className={`${CHIP_BASE} bg-[#F0EBE3] text-[#998a73] tracking-wide uppercase`}>
                  Down
                </span>
              ) : (
                <span data-testid="wait-chip" className={`${CHIP_BASE} ${waitTimeChipClass(ride.wait_time)} tabular-nums`}>
                  {ride.wait_time} min
                </span>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx jest src/__tests__/components/RideList.test.tsx src/__tests__/styles/globals.test.ts`
Expected: PASS (9 tests in `RideList.test.tsx`, 7 tests in `globals.test.ts`)

- [ ] **Step 6: Commit**

```bash
git add src/components/RideList.tsx src/__tests__/components/RideList.test.tsx src/app/globals.css src/__tests__/styles/globals.test.ts
git commit -m "Restyle ride list rows with card shadows, headliner accent, and color-coded wait chips"
```

---

### Task 2: Add the headliner legend to the avg-wait line

**Files:**
- Modify: `src/components/ParkCard.tsx:188-192` (the avg-wait paragraph, shown in context below)
- Modify: `src/__tests__/components/ParkCard.test.tsx`

**Interfaces:**
- Consumes: nothing new — this is a text-only change to JSX already in `ParkCard.tsx`.
- Produces: no signature change. `ParkCard({ park, rank, headlinerNames })` stays exactly as it was.

- [ ] **Step 1: Write the failing test**

Add this test to the `describe('ParkCard', ...)` block in `src/__tests__/components/ParkCard.test.tsx` (after the existing tests, before the closing `});`):

```tsx
  it('shows the headliner legend next to the avg wait line', () => {
    render(<ParkCard park={openPark} rank={1} headlinerNames={[]} />);
    expect(screen.getByText(/Headliner attraction/)).toBeInTheDocument();
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/__tests__/components/ParkCard.test.tsx`
Expected: FAIL — no text matching `/Headliner attraction/` exists yet.

- [ ] **Step 3: Update `src/components/ParkCard.tsx`**

Find this block (the avg-wait paragraph, inside the `ride-list-wrapper` div):

```tsx
              {park.isOpen && park.avgWaitMinutes > 0 && (
                <p className="text-xs text-[#B5A898] mb-3">
                  <span className="font-semibold text-[#8B7355]">{park.avgWaitMinutes} min</span> avg wait across open attractions
                </p>
              )}
```

Replace it with:

```tsx
              {park.isOpen && park.avgWaitMinutes > 0 && (
                <p className="text-xs text-[#B5A898] mb-3">
                  <span className="font-semibold text-[#8B7355]">{park.avgWaitMinutes} min</span> avg wait across open attractions
                  {' '}· <span className="text-[#E8A93A]">★</span> Headliner attraction
                </p>
              )}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/__tests__/components/ParkCard.test.tsx`
Expected: PASS (17 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/ParkCard.tsx src/__tests__/components/ParkCard.test.tsx
git commit -m "Add headliner star legend next to the avg wait line"
```

---

### Task 3: Full verification pass

**Files:** none modified — verification only.

**Interfaces:** N/A.

- [ ] **Step 1: Run the full test suite**

Run: `npx jest`
Expected: All test files under `src/__tests__/components/RideList.test.tsx`, `src/__tests__/styles/globals.test.ts`, and `src/__tests__/components/ParkCard.test.tsx` PASS, along with every other previously-passing suite. `src/__tests__/lib/queueTimes.test.ts` remains a pre-existing, out-of-scope failure unrelated to this plan.

- [ ] **Step 2: Run the production build**

Run: `npm run build`
Expected: Build succeeds with no TypeScript or lint errors.

- [ ] **Step 3: Manually verify in the dev server**

Run: `npm run dev`, open `http://localhost:3000`, tap a park card to expand it, and confirm:
- Ride rows are white cards with a soft shadow, hover lift on desktop.
- Headliner rows (per the `HEADLINERS` config) show a gold left stripe and a star before the name; other rows have no stripe.
- Wait-time chips are colored correctly: a sub-20-minute ride is green, a 21-45-minute ride is amber, a 46+-minute ride is red, and a closed ride shows a gray "Down" chip.
- Rows fade up with a slight stagger each time you expand a card.
- The avg-wait line above the list reads "{X} min avg wait across open attractions · ★ Headliner attraction".
- Enable "Reduce motion" in OS accessibility settings, reload, and confirm the rows appear instantly with no stagger/fade.

- [ ] **Step 4: Push**

```bash
git push origin main
```
