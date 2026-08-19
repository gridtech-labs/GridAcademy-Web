import { getStory, getStoriesByDate } from '@/lib/current-affairs';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const story = getStory(params.slug);
  if (!story) return { title: 'Not Found' };
  
  return {
    title: `${story.title} | Current Affairs | GridAcademy`,
    description: story.summary,
    openGraph: {
      title: story.title,
      description: story.summary,
      type: 'article',
      publishedTime: story.date,
      tags: story.tags,
    }
  };
}

const categoryColors: Record<string, string> = {
  'Polity & Governance': 'bg-blue-100 text-blue-800',
  'Economy': 'bg-amber-100 text-amber-800',
  'Environment': 'bg-emerald-100 text-emerald-800',
  'Science & Tech': 'bg-violet-100 text-violet-800',
  'International': 'bg-slate-100 text-slate-800',
  'Social Issues': 'bg-rose-100 text-rose-800',
  'Sports': 'bg-orange-100 text-orange-800'
};

export default function StoryDetailPage({ params }: { params: { slug: string } }) {
  const story = getStory(params.slug);
  
  if (!story) {
    notFound();
  }

  const moreFromToday = getStoriesByDate(story.date).filter(s => s.slug !== story.slug);
  const formattedDate = new Date(story.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  // Schema for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: story.title,
    datePublished: story.date,
    dateModified: story.date,
    description: story.summary,
    publisher: {
      '@type': 'Organization',
      name: 'GridAcademy'
    },
    author: {
      '@type': 'Organization',
      name: story.source
    }
  };

  return (
    <>
      
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1 max-w-[1120px] w-full mx-auto px-4 md:px-6 py-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-8">
          <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/current-affairs" className="hover:text-gray-900 transition-colors">Current Affairs</Link>
          <span>/</span>
          <Link href={`/current-affairs/daily/${story.date}`} className="hover:text-gray-900 transition-colors">{formattedDate}</Link>
          <span>/</span>
          <span className="text-gray-900 truncate max-w-[200px] sm:max-w-[400px]">{story.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Main Article */}
          <article className="flex-1 bg-white p-6 md:p-10 rounded-3xl border border-gray-200 shadow-sm">
            
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className={`text-sm font-semibold px-3 py-1 rounded-md ${categoryColors[story.category] || 'bg-gray-100 text-gray-800'}`}>
                  {story.category}
                </span>
                <div className="flex gap-2">
                  {story.examRelevance.map(exam => (
                    <span key={exam} className="text-xs uppercase font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">
                      {exam}
                    </span>
                  ))}
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                {story.imageEmoji} {story.title}
              </h1>
              
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium border-b border-gray-100 pb-6">
                <span className="bg-gray-100 px-2.5 py-1 rounded-md text-gray-700">{story.source}</span>
                <span>•</span>
                <span>{formattedDate}</span>
              </div>
            </header>

            {/* Summary */}
            <div className="bg-blue-50/70 border border-blue-100 p-6 rounded-2xl text-lg md:text-xl text-gray-800 leading-relaxed font-medium mb-10">
              {story.summary}
            </div>

            {/* Why It Matters */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-[#1760f4]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                Why It Matters for Exams
              </h2>
              <div className="border-l-4 border-[#1760f4] pl-5 py-1 text-gray-700 leading-relaxed text-lg">
                {story.whyItMatters}
              </div>
            </div>

            {/* Key Facts */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Facts for Revision</h2>
              <div className="grid gap-4">
                {story.keyFacts.map((fact, index) => (
                  <div key={index} className="flex gap-4 p-5 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-2xl">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-blue-100 text-[#1760f4] flex items-center justify-center font-bold text-base">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 pt-2 leading-relaxed">{fact}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-100">
              <span className="text-sm font-bold text-gray-900 py-1 mr-2">Tags:</span>
              {story.tags.map(tag => (
                <span key={tag} className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
            
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-[340px] shrink-0">
            <div className="sticky top-24">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">More from Today</h3>
                <div className="flex flex-col gap-4">
                  {moreFromToday.slice(0, 5).map(s => (
                    <Link key={s.slug} href={`/current-affairs/${s.slug}`} className="group">
                      <div className="text-xs font-semibold text-[#1760f4] mb-1">{s.category}</div>
                      <h4 className="font-bold text-gray-800 group-hover:text-[#1760f4] transition-colors leading-snug line-clamp-2">
                        {s.title}
                      </h4>
                    </Link>
                  ))}
                  {moreFromToday.length === 0 && (
                    <p className="text-sm text-gray-500">No other stories today.</p>
                  )}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Link href={`/current-affairs/daily/${story.date}`} className="text-sm font-semibold text-[#1760f4] hover:underline flex items-center justify-center">
                    View all stories for {new Date(story.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </Link>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white shadow-lg text-center">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                  📝
                </div>
                <h3 className="text-xl font-bold mb-2">Test Your Knowledge</h3>
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                  Practice with exam-specific mock tests and track your progress against peers.
                </p>
                <Link href="/tests" className="block w-full bg-[#1760f4] hover:bg-[#0e4dd4] transition-colors text-white font-bold py-3 px-4 rounded-xl text-sm">
                  Start Free Mock Test
                </Link>
              </div>
            </div>
          </aside>
          
        </div>
      </main>
    </>
  );
}
