import { render, screen } from '@testing-library/react';
import About from '@/app/about/page';

describe('About page', () => {
  it('applies a bounce-in entrance to the header block', () => {
    render(<About />);
    expect(screen.getByTestId('about-header')).toHaveClass('animate-bounce-in');
  });

  it('applies a soft shadow to the photo frame', () => {
    render(<About />);
    expect(screen.getByTestId('about-photo-frame')).toHaveClass('shadow-[0_8px_24px_rgba(28,16,8,0.12)]');
  });
});
