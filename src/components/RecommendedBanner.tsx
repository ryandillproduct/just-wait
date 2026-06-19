import { Recommendation } from '@/types';

interface Props {
  recommendation: Recommendation | null;
}

export function RecommendedBanner({ recommendation }: Props) {
  if (!recommendation) {
    return (
      <div className="mb-6 px-5 py-4 rounded-2xl bg-[#F5EFE6] text-center">
        <p className="text-[#B5A898] text-sm">All parks are closed right now.</p>
      </div>
    );
  }

  return (
    <div className="mb-6 px-5 py-4 rounded-2xl bg-[#FDF3D6] border border-[#F5C842]/30">
      <p className="text-xs font-semibold text-[#8B6914] tracking-widest uppercase mb-1">
        🏆 Best Park to Visit Right Now
      </p>
      <p className="font-playfair text-2xl font-bold text-[#1C1008]">
        {recommendation.parkName}
      </p>
      <p className="mt-1 text-sm text-[#8B7355]">
        {recommendation.summary}
      </p>
    </div>
  );
}
