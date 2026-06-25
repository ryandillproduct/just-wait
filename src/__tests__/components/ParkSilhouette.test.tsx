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

  it('renders the EPCOT sphere with a highlight circle and three tripod legs', () => {
    const { container } = render(<ParkSilhouette parkKey="epcot" />);
    // main sphere + inner highlight circle = 2 circles
    expect(container.querySelectorAll('circle').length).toBe(2);
    // three filled tripod leg paths
    expect(container.querySelectorAll('path').length).toBe(3);
  });

  it('renders the simplified Hollywood Studios tower with a roof and stepped tiers', () => {
    const { container } = render(<ParkSilhouette parkKey="hollywood-studios" />);
    // roof barrel + narrow top + 3 stepped tiers + 2 elevator-shaft accents + ground line = 7 rects
    expect(container.querySelectorAll('rect').length).toBe(7);
    // roof triangle = 1 path
    expect(container.querySelectorAll('path').length).toBe(1);
  });
});
