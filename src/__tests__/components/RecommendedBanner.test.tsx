import { render, screen } from '@testing-library/react';
import { RecommendedBanner } from '@/components/RecommendedBanner';
import { Recommendation } from '@/types';

const recommendation: Recommendation = {
  parkId: 6,
  parkName: 'Magic Kingdom',
  avgWaitMinutes: 20,
  crowdScore: 4,
  closingTimeMs: null,
  opener: 'Magic Kingdom is our top pick right now',
};

describe('RecommendedBanner', () => {
  it('applies the bounce-in entrance when showing a recommendation', () => {
    render(<RecommendedBanner recommendation={recommendation} />);
    expect(screen.getByTestId('recommended-banner')).toHaveClass('animate-bounce-in');
  });

  it('applies the bounce-in entrance on the all-parks-closed message', () => {
    render(<RecommendedBanner recommendation={null} />);
    expect(screen.getByTestId('recommended-banner')).toHaveClass('animate-bounce-in');
  });
});
