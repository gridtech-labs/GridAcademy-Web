import { getStoriesByDate, getAllDates } from '@/lib/current-affairs';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { date: string } }) {
  const dateStr = new Date(params.date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  return {
    title: `Current Affairs ${dateStr} for UPSC & SSC | GridAcademy`,
    description: `Read the most important current affairs for ${dateStr}. Handpicked for UPSC, SSC, Banking, Railway, NEET, CUET and other competitive exams.`,
    alternates: { canonical: `https://www.gridacademy.in/current-affairs/daily/${params.date}` },
  };
}

const CAT_COLORS: Record<string, string> = {
  'Polity & Governance': 'bg-blue-100 text-blue-800',
  'Economy':             'bg-amber-100 text-amber-800',
  'Environment':         'bg-emerald-100 text-emerald-800',
  'Science & Tech':      'bg-violet-100 text-violet-800',
  'International':       'bg-slate-100 text-slate-800',
  'Social Issues':       'bg-rose-100 text-rose-800',
  'Sports':              'bg-orange-100 text-orange-800',
};

export default function DailyCurrentAffairsPage({
  params,
  searchParams,
}: {
  params: { date: string };
  searchParams: { s?: string };
}) {
  const { date } = params;
  const stories = getStoriesByDate(date);

  if (!stories.length) notFound();

  const allDates = getAllDates();
  const selectedSlug = searchParams.s || stories[0].slug;
  const activeStory = stories.find((s) => s.slug === selectedSlug) || stories[0];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-[1120px] mx-auto px-4 md:px-6">

        {/* Page heading + date nav */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Daily Current Affairs</h1>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {allDates.slice(0, 7).map((d) => (
              <Link
                key={d}
                href={`/current-affairs/daily/${d}`}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors
                  ${d === date
                    ? 'bg-[#1760f4] text-white shadow-sm shadow-blue-200'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1760f4] hover:text-[#1760f4]'
                  }`}
              >
                {new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </Link>
            ))}
          </div>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Left: Story list ── */}
          <div className="w-full lg:w-[360px] shrink-0 flex flex-col gap-3 lg:max-h-[calc(100vh-220px)] lg:overflow-y-auto pr-1">
            {stories.map((story) => {
              const isActive = story.slug === activeStory.slug;
              return (
                <Link
                  key={story.slug}
                  href={`?s=${story.slug}`}
                  scroll={false}
                  className={`block p-4 rounded-2xl border transition-all duration-150
                    ${isActive
                      ? 'bg-white border-[#1760f4] shadow-md ring-1 ring-[#1760f4]'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                >
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${CAT_COLORS[story.category] ?? 'bg-gray-100 text-gray-800'}`}>
                      {story.category}
                    </span>
                    {story.examRelevance.slice(0, 2).map((exam) => (
                      <span key={exam} className="text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        {exam}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-bold text-gray-900 leading-snug line-clamp-2 mb-1.5 text-sm">
                    {story.imageEmoji} {story.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium">{story.source}</p>
                </Link>
              );
            })}
          </div>

          {/* ── Right: Article detail ── */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">

            {/* Content */}
            <div className="p-6 md:p-8 lg:p-10 flex-1">

              {/* Category + exam pills */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`text-sm font-semibold px-3 py-1 rounded-md ${CAT_COLORS[activeStory.category] ?? 'bg-gray-100 text-gray-800'}`}>
                  {activeStory.category}
                </span>
                {activeStory.examRelevance.map((exam) => (
                  <span key={exam} className="text-xs uppercase font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">
                    {exam}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 leading-tight">
                {activeStory.imageEmoji} {activeStory.title}
              </h2>

              {/* Meta */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-7 font-medium">
                <span>{activeStory.source}</span>
                <span>•</span>
                <span>{new Date(activeStory.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>

              {/* Summary */}
              <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl text-base text-gray-800 leading-relaxed mb-7">
                {activeStory.summary}
              </div>

              {/* Why It Matters */}
              <div className="mb-7">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#1760f4] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Why It Matters for Exams
                </h3>
                <div className="border-l-4 border-[#1760f4] pl-4 text-gray-700 leading-relaxed">
                  {activeStory.whyItMatters}
                </div>
              </div>

              {/* Key Facts */}
              <div className="mb-7">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Key Facts for Revision</h3>
                <div className="grid gap-3">
                  {activeStory.keyFacts.map((fact, index) => (
                    <div key={index} className="flex gap-3 p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl">
                      <div className="shrink-0 w-7 h-7 rounded-full bg-blue-100 text-[#1760f4] flex items-center justify-center font-bold text-xs">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed pt-0.5">{fact}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                {activeStory.tags.map((tag) => (
                  <span key={tag} className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Full article link */}
              <div className="mt-6">
                <Link href={`/current-affairs/${activeStory.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-[#1760f4] hover:underline">
                  View full article →
                </Link>
              </div>
            </div>

            {/* CTA bar */}
            <div className="bg-gray-900 text-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold mb-0.5">Ready to test your knowledge?</h3>
                <p className="text-gray-400 text-sm">Free mock tests — latest 2026 exam pattern.</p>
              </div>
              <Link
                href="/tests"
                className="shrink-0 bg-[#1760f4] hover:bg-[#0e4dd4] transition-colors text-white font-bold py-2.5 px-5 rounded-xl text-sm"
              >
                Practice Mock Tests
              </Link>
            </div>

          </div>
          {/* end right panel */}

        </div>
        {/* end two-column */}

      </div>
    </div>
  );
}
