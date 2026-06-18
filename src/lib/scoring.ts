import { Ride } from '@/types';

function avg(nums: number[]): number {
  return nums.length === 0 ? 0 : nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function calculateParkScore(rides: Ride[], headlinerNames: string[]): number {
  const open = rides.filter((r) => r.is_open);
  if (open.length === 0) return 5;

  const headliners = open.filter((r) =>
    headlinerNames.some((h) => r.name.toLowerCase().includes(h.toLowerCase()))
  );

  const headlinerAvg = headliners.length > 0
    ? avg(headliners.map((r) => r.wait_time))
    : avg(open.map((r) => r.wait_time));

  const congestionRate = open.filter((r) => r.wait_time > 45).length / open.length;

  const normalizedHeadliner = Math.min(headlinerAvg / 90, 1);
  const blended = 0.7 * normalizedHeadliner + 0.3 * congestionRate;
  return Math.max(1, Math.min(10, Math.round(blended * 9 + 1)));
}

export function scoreLabel(score: number): string {
  if (score <= 3) return 'Great time to visit';
  if (score <= 6) return 'Moderate crowds';
  return 'Very busy';
}

export function scoreColorClass(score: number): string {
  if (score <= 3) return 'text-emerald-400';
  if (score <= 6) return 'text-amber-400';
  return 'text-rose-400';
}
