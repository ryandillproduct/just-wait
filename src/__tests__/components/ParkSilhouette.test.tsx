import { render } from '@testing-library/react';
import { ParkSilhouette } from '@/components/ParkSilhouette';

describe('ParkSilhouette', () => {
  it('renders the Magic Kingdom castle with five turret bodies, a flag, and a ground line', () => {
    const { container } = render(<ParkSilhouette parkKey="magic-kingdom" />);
    // base block + 5 turret bodies + flag + ground line = 8 rects
    expect(container.querySelectorAll('rect').length).toBe(8);
  });

  it('renders the Animal Kingdom tree with a full seven-circle canopy', () => {
    const { container } = render(<ParkSilhouette parkKey="animal-kingdom" />);
    expect(container.querySelectorAll('circle').length).toBe(7);
  });

  it('still renders EPCOT and Hollywood Studios without throwing', () => {
    expect(() => render(<ParkSilhouette parkKey="epcot" />)).not.toThrow();
    expect(() => render(<ParkSilhouette parkKey="hollywood-studios" />)).not.toThrow();
  });
});
