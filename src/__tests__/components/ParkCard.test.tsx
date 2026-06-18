import { render, screen, fireEvent } from '@testing-library/react';
import { ParkCard } from '@/components/ParkCard';
import { ScoredPark } from '@/types';

const park: ScoredPark = {
  id: 6,
  name: 'Magic Kingdom',
  silhouetteKey: 'magic-kingdom',
  score: 2,
  label: 'Great time to visit',
  rides: [
    { id: 1, name: 'Seven Dwarfs Mine Train', is_open: true, wait_time: 10, last_updated: '' },
  ],
};

describe('ParkCard', () => {
  it('renders park name', () => {
    render(<ParkCard park={park} isBest={false} headlinerNames={[]} />);
    expect(screen.getByText('Magic Kingdom')).toBeInTheDocument();
  });

  it('does not render a crown badge', () => {
    render(<ParkCard park={park} isBest={true} headlinerNames={[]} />);
    expect(screen.queryByLabelText('Top park pick')).not.toBeInTheDocument();
  });

  it('expands ride list on click', () => {
    render(<ParkCard park={park} isBest={false} headlinerNames={[]} />);
    expect(screen.queryByText('Seven Dwarfs Mine Train')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Seven Dwarfs Mine Train')).toBeInTheDocument();
  });

  it('collapses ride list on second click', () => {
    render(<ParkCard park={park} isBest={false} headlinerNames={[]} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button'));
    expect(screen.queryByText('Seven Dwarfs Mine Train')).not.toBeInTheDocument();
  });
});
