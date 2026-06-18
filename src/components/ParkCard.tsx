'use client';

import { useState } from 'react';
import { ScoredPark } from '@/types';
import { scoreColorClass } from '@/lib/scoring';
import { ParkSilhouette } from './ParkSilhouette';
import { RideList } from './RideList';

interface Props {
  park: ScoredPark;
  isBest: boolean;
  headlinerNames: string[];
}

export function ParkCard({ park, isBest, headlinerNames }: Props) {
  const [expanded, setExpanded] = useState(false);
  const scoreColor = scoreColorClass(park.score);

  return (
    <div className="relative rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl overflow-hidden">
      {isBest && (
        <span
          aria-label="Top park pick"
          className="absolute top-3 right-3 text-[#F5C842] text-xl"
          title="Top park pick right now"
        >
          👑
        </span>
      )}

      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left p-6 flex items-center gap-5"
        aria-expanded={expanded}
      >
        <ParkSilhouette
          parkKey={park.silhouetteKey}
          className="w-14 h-14 text-white/20 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="font-playfair text-xl text-white font-semibold truncate">
            {park.name}
          </p>
          <p className="text-sm text-white/50 mt-0.5">{park.label}</p>
        </div>
        <div className="flex-shrink-0 text-right">
          <span className={`font-playfair text-5xl font-bold ${scoreColor}`}>
            {park.score}
          </span>
          <p className="text-xs text-white/40 mt-1">/ 10</p>
        </div>
      </button>

      {expanded && (
        <div className="px-6 pb-6">
          <div className="border-t border-white/10 pt-4">
            <RideList rides={park.rides} headlinerNames={headlinerNames} />
          </div>
        </div>
      )}
    </div>
  );
}
