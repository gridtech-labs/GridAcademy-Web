import type { Metadata } from 'next';
import CareerExplorer from '@/components/career/CareerExplorer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '100 Career Options to Explore | GridAcademy',
  description:
    'Discover 100 career paths across 8 categories — Makers, Connectors, Thinkers, Builders and more. Find what fits you with our free career quiz.',
};

export default function CareerGuidePage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string; cost?: string };
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <span>🧭</span> Career Discovery
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
            100 Career Paths
            <br />
            <span className="text-indigo-200">Nobody Showed You</span>
          </h1>
          <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Explore careers across 8 personality types — from Makers and Thinkers to
            Builders and Healers. Most cost ₹0 to start exploring.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/career-guide/quiz"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
            >
              🎯 Take the Career Quiz
            </Link>
            <a
              href="#careers"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 font-semibold px-6 py-3 rounded-xl transition-colors border border-white/20"
            >
              Browse All 100 Careers ↓
            </a>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
          <span>
            <strong className="text-gray-900">100</strong> careers listed
          </span>
          <span>
            <strong className="text-gray-900">8</strong> personality types
          </span>
          <span>
            <strong className="text-gray-900">70+</strong> free to start
          </span>
          <span>
            <strong className="text-gray-900">5-min</strong> quiz to find your type
          </span>
        </div>
      </div>

      {/* Career explorer */}
      <div id="careers" className="max-w-7xl mx-auto px-4 py-8">
        <CareerExplorer
          initialCategory={searchParams.category ?? ''}
          initialSearch={searchParams.q ?? ''}
          initialCost={searchParams.cost ?? ''}
        />
      </div>
    </div>
  );
}
