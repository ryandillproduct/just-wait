import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meet the Creator | WhichPark?',
  description: 'Why I built WhichPark? — a Disney local’s answer to "which park should I go to right now?"',
};

export default function About() {
  return (
    <main className="min-h-screen px-4 pt-10 pb-16 max-w-xl mx-auto">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-56 h-72 rounded-2xl overflow-hidden border-2 border-[#F5C842] mb-4">
          <Image
            src="/ryan-headshot.jpg"
            alt="Ryan, creator of WhichPark?"
            width={672}
            height={864}
            quality={90}
            className="w-full h-full object-cover object-[50%_30%]"
            priority
          />
        </div>
        <p className="font-playfair text-2xl font-bold text-[#1C1008]">Meet the Creator</p>
      </div>

      <div className="space-y-4 text-[#5C4A2A] leading-relaxed">
        <p className="font-playfair text-xl font-semibold text-[#1C1008]">Hi, I&apos;m Ryan.</p>
        <p>
          I visit the Disney parks almost every day. Somewhere along the way, I kept running
          into the same problem: every crowd-tracking site out there is built for vacationers
          planning weeks or months ahead, offering &quot;best time to visit in October&quot;
          type advice.
        </p>
        <p>
          But that&apos;s not the question that I, and a lot of locals who visit the parks
          regularly, actually have. We just want to know:{' '}
          <span className="font-semibold text-[#1C1008]">which park should I go to right now?</span>
        </p>
        <p>
          So I built WhichPark? to answer exactly that. Using live data, it factors in things
          locals actually care about, like real crowd levels and ease of access to certain
          parks, including the extra transit steps it takes to actually reach Magic Kingdom&apos;s
          gates. No forecasts. No planning calendars. Just today, and one clear answer:{' '}
          <span className="font-semibold text-[#1C1008]">which park is the best to visit right now.</span>
        </p>
      </div>

      <div className="mt-10 text-center">
        <Link href="/" className="text-sm text-[#8B7355] underline underline-offset-2">
          &larr; Back to today&apos;s rankings
        </Link>
      </div>
    </main>
  );
}
