import { NextResponse } from 'next/server';
import { fetchParkRides } from '@/lib/queueTimes';
import { calculateParkScore, scoreLabel } from '@/lib/scoring';
import { PARKS } from '@/config/parks';
import { HEADLINERS } from '@/config/headliners';
import { ScoredPark } from '@/types';

export const dynamic = 'force-static';
export const revalidate = 300; // 5-minute Vercel edge cache

export async function GET() {
  try {
    const results = await Promise.all(
      PARKS.map(async (park): Promise<ScoredPark> => {
        const allRides = await fetchParkRides(park.id);
        const score = calculateParkScore(allRides, HEADLINERS[park.id] ?? []);
        const openRides = allRides
          .filter((r) => r.is_open)
          .sort((a, b) => b.wait_time - a.wait_time);
        return {
          ...park,
          score,
          label: scoreLabel(score),
          rides: openRides,
        };
      })
    );

    const sorted = [...results].sort((a, b) => a.score - b.score);
    return NextResponse.json({ parks: sorted });
  } catch (err) {
    console.error('Failed to fetch park data:', err);
    return NextResponse.json({ error: 'Failed to load park data' }, { status: 502 });
  }
}
