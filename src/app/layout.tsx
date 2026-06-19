import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'WhichPark?',
  description: "The question isn't if. It's where. Live Walt Disney World crowd levels for locals and Annual Passholders.",
  openGraph: {
    title: 'WhichPark?',
    description: "The question isn't if. It's where. Live Walt Disney World crowd levels for locals and Annual Passholders.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-[#FDF8F0] text-[#1C1008]">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
