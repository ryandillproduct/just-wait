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
