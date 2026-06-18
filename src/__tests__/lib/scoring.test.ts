import { calculateParkScore, scoreLabel, scoreColorClass } from '@/lib/scoring';
import { Ride } from '@/types';

function makeRide(name: string, wait_time: number, is_open = true): Ride {
  return { id: 1, name, is_open, wait_time, last_updated: '' };
}

const headliners = ['Seven Dwarfs Mine Train', 'Space Mountain'];

describe('calculateParkScore', () => {
  it('returns 1 when all headliners have 0 min wait and no congestion', () => {
    const rides = [
      makeRide('Seven Dwarfs Mine Train', 0),
      makeRide('Space Mountain', 0),
      makeRide('Small Ride', 5),
    ];
    expect(calculateParkScore(rides, headliners)).toBe(1);
  });

  it('returns 10 when headliners average 90+ min and all rides > 45 min', () => {
    const rides = [
      makeRide('Seven Dwarfs Mine Train', 90),
      makeRide('Space Mountain', 95),
      makeRide('Other Ride', 60),
    ];
    expect(calculateParkScore(rides, headliners)).toBe(10);
  });

  it('falls back to all-ride average when no headliners are open', () => {
    const rides = [
      makeRide('Random Ride A', 10),
      makeRide('Random Ride B', 20),
    ];
    // avg = 15, normalizedHeadliner = 15/90 = 0.1667, congestion = 0/2 = 0
    // blended = 0.7 * 0.1667 + 0.3 * 0 = 0.1167 → round(0.1167*9+1) = round(2.05) = 2
    expect(calculateParkScore(rides, headliners)).toBe(2);
  });

  it('ignores closed rides', () => {
    const rides = [
      makeRide('Seven Dwarfs Mine Train', 90),
      makeRide('Space Mountain', 0, false), // closed
    ];
    // Only 1 headliner open: avg=90, congestion=1/1=1.0
    // blended = 0.7*1 + 0.3*1 = 1.0 → score = 10
    expect(calculateParkScore(rides, headliners)).toBe(10);
  });

  it('returns 5 when no rides are open', () => {
    const rides = [makeRide('Seven Dwarfs Mine Train', 0, false)];
    expect(calculateParkScore(rides, headliners)).toBe(5);
  });

  it('clamps output between 1 and 10', () => {
    const rides = [makeRide('Seven Dwarfs Mine Train', 200), makeRide('Space Mountain', 200)];
    expect(calculateParkScore(rides, headliners)).toBe(10);
  });
});

describe('scoreLabel', () => {
  it('returns "Great time to visit" for scores 1-3', () => {
    expect(scoreLabel(1)).toBe('Great time to visit');
    expect(scoreLabel(3)).toBe('Great time to visit');
  });
  it('returns "Moderate crowds" for scores 4-6', () => {
    expect(scoreLabel(4)).toBe('Moderate crowds');
    expect(scoreLabel(6)).toBe('Moderate crowds');
  });
  it('returns "Very busy" for scores 7-10', () => {
    expect(scoreLabel(7)).toBe('Very busy');
    expect(scoreLabel(10)).toBe('Very busy');
  });
});

describe('scoreColorClass', () => {
  it('returns emerald class for 1-3', () => {
    expect(scoreColorClass(1)).toBe('text-emerald-400');
    expect(scoreColorClass(3)).toBe('text-emerald-400');
  });
  it('returns amber class for 4-6', () => {
    expect(scoreColorClass(4)).toBe('text-amber-400');
  });
  it('returns rose class for 7-10', () => {
    expect(scoreColorClass(7)).toBe('text-rose-400');
    expect(scoreColorClass(10)).toBe('text-rose-400');
  });
});
