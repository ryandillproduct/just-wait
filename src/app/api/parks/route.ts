import { NextResponse } from 'next/server';
import { fetchParkRides } from '@/lib/queueTimes';
import { calculateParkScore, scoreLabel } from '@/lib/scoring';
import { PARKS } from '@/config/parks';
import { HEADLINERS } from '@/config/headliners';
import { ATTRACTIONS } from '@/config/attractions';
import { ScoredPark } from '@/types';

export const dynamic = 'force-static';
export const revalidate = 300;

export async function GET() {
  try {
    const results = await Promise.all(
      PARKS.map(async (park): Promise<ScoredPark> => {
        const allRides = await fetchParkRides(park.id);
        const attractionConfig = ATTRACTIONS[park.id] ?? [];

        // Remove single rider lines entirely
        const withoutSingleRider = allRides.filter(
          (r) => !r.name.toLowerCase().includes('single rider')
        );

        // Match against curated list and tag shows
        const curated = withoutSingleRider
          .filter((r) => r.is_open)
          .map((r) => {
            const config = attractionConfig.find((a) =>
              r.name.toLowerCase().includes(a.name.toLowerCase())
            );
            if (!config) return null;
            return { ...r, isShow: config.isShow };
          })
          .filter((r): r is NonNullable<typeof r> => r !== null)
          .sort((a, b) => a.name.localeCompare(b.name));

        // Only use non-show rides for scoring
        const ridesForScoring = curated.filter((r) => !r.isShow);
        const score = calculateParkScore(ridesForScoring, HEADLINERS[park.id] ?? []);

        return {
          ...park,
          score,
          label: scoreLabel(score),
          rides: curated,
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
