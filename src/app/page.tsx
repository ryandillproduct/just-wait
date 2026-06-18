'use client';

import { useEffect, useState, useCallback } from 'react';
import { ApiResponse, ScoredPark, Recommendation } from '@/types';
import { HEADLINERS } from '@/config/headliners';
import { ParkCard } from '@/components/ParkCard';
import { RecommendedBanner } from '@/components/RecommendedBanner';

const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export default function Home() {
  const [parks, setParks] = useState<ScoredPark[]>([]);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadParks = useCallback(async () => {
    try {
      const res = await fetch('/api/parks');
      if (!res.ok) throw new Error('API error');
      const data: ApiResponse = await res.json();
      setParks(data.parks);
      setRecommendation(data.recommendation);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadParks();
    const interval = setInterval(loadParks, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [loadParks]);

  return (
    <main className="min-h-screen px-4 py-12 max-w-2xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="font-playfair text-5xl font-bold text-[#1C1008] tracking-tight">
          Just Wait
        </h1>
        <p className="mt-2 text-[#8B7355] text-xl font-medium tracking-wide">
          Live park crowd levels.
        </p>
        <p className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F5C842]/15 text-[#8B7355] text-xs">
          <span className="text-base" aria-hidden="true">👆</span>
          Tap a park for attraction wait times
        </p>
      </header>

      {loading && (
        <div className="flex justify-center items-center py-24">
          <span className="text-[#B5A898] text-sm animate-pulse">Loading parks…</span>
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-24">
          <p className="text-[#B5A898] text-sm">
            Unable to load wait times. Please try again shortly.
          </p>
        </div>
      )}

      {!loading && !error && (
        <>
          <RecommendedBanner recommendation={recommendation} />
          <div className="space-y-4">
            {parks.map((park, index) => (
              <ParkCard
                key={park.id}
                park={park}
                isBest={index === 0}
                headlinerNames={HEADLINERS[park.id] ?? []}
              />
            ))}
          </div>
        </>
      )}

    </main>
  );
}
