import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import CareerExplorer from '@/components/career/CareerExplorer';
import PageIntro from '@/components/ui/PageIntro';

export const metadata: Metadata = {
  title: '100 Career Options to Explore',
  description:
    'Discover 100 career paths across 8 categories — Makers, Connectors, Thinkers, Builders and more. Find what fits you with our free career quiz.',
};

export default function CareerGuidePage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string; cost?: string };
}) {
  return (
    <div className="bg-white text-ink">
      <PageIntro
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Career guide' }]}
        eyebrow="Free career guide"
        title="100 career paths worth knowing about"
        description="Explore careers across 8 personality types — from Makers and Thinkers to Builders and Healers. Most cost nothing to start exploring."
        aside={
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5">
            <Link href="/career-guide/quiz"
              className="h-12 inline-flex items-center justify-center gap-2 px-6 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark">
              Take the 2-minute quiz <ArrowRight className="w-[17px] h-[17px]" />
            </Link>
            <a href="#careers" className="h-12 inline-flex items-center justify-center px-6 rounded-lg border border-[#d0d5dd] bg-white font-semibold hover:bg-[#f2f4f7]">
              Browse careers
            </a>
          </div>
        }
      />

      <div id="careers" className="scroll-mt-16 max-w-[1328px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <CareerExplorer
          initialCategory={searchParams.category ?? ''}
          initialSearch={searchParams.q ?? ''}
          initialCost={searchParams.cost ?? ''}
        />
      </div>
    </div>
  );
}
