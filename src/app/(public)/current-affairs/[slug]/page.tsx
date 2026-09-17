import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getStory, getStoriesByDate } from '@/lib/current-affairs';
import { caTone, formatCaDate } from '@/lib/ca-tone';
import PageIntro from '@/components/ui/PageIntro';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const story = getStory(params.slug);
  if (!story) return { title: 'Not Found' };
  return {
    title: `${story.title} | Current Affairs`,
    description: story.summary,
    openGraph: {
      title: story.title,
      description: story.summary,
      type: 'article',
      publishedTime: story.date,
      tags: story.tags,
    },
  };
}

export default function StoryDetailPage({ params }: { params: { slug: string } }) {
  const story = getStory(params.slug);
  if (!story) notFound();

  const moreFromToday = getStoriesByDate(story.date).filter(s => s.slug !== story.slug);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: story.title,
        datePublished: story.date,
        dateModified: story.date,
        description: story.summary,
        publisher: { '@type': 'Organization', name: 'GridAcademy' },
        author: { '@type': 'Organization', name: story.source },
      }) }} />

      <div className="bg-white text-ink">
        <PageIntro
          crumbs={[
            { label: 'Home', href: '/' },
            { label: 'Current affairs', href: '/current-affairs' },
            { label: formatCaDate(story.date), href: `/current-affairs/daily/${story.date}` },
          ]}
          title={story.title}
          description={`${story.source} · ${formatCaDate(story.date)}`}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`h-[26px] inline-flex items-center px-2.5 rounded-full text-[12.5px] font-medium ${caTone(story.category)}`}>{story.category}</span>
            {story.examRelevance.map(exam => (
              <span key={exam} className="h-[26px] inline-flex items-center px-2.5 rounded-full bg-white border border-line text-[#344054] text-[12.5px] font-medium">{exam}</span>
            ))}
          </div>
        </PageIntro>

        <div className="max-w-[1180px] mx-auto px-4 md:px-6 py-8 md:py-10 grid lg:grid-cols-[1fr_340px] gap-8 lg:gap-12 items-start [&>*]:min-w-0">
          <article className="flex flex-col gap-7 max-w-[760px]">
            <p className="text-lg md:text-xl leading-relaxed text-[#1d2939]">{story.summary}</p>

            <section className="rounded-lg bg-paper border border-line px-5 py-4">
              <h2 className="font-semibold text-lg mb-1.5">Why it matters for exams</h2>
              <p className="text-base leading-relaxed text-[#344054]">{story.whyItMatters}</p>
            </section>

            <section>
              <h2 className="font-semibold text-xl mb-3">Key facts for revision</h2>
              <ol className="flex flex-col divide-y divide-line border-y border-line">
                {story.keyFacts.map((fact, i) => (
                  <li key={i} className="flex gap-4 py-3.5">
                    <span className="font-mono text-sm text-primary-dark pt-0.5 w-5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-base leading-relaxed text-[#344054]">{fact}</span>
                  </li>
                ))}
              </ol>
            </section>

            <div className="flex flex-wrap gap-2">
              {story.tags.map(tag => (
                <span key={tag} className="h-7 inline-flex items-center px-2.5 rounded-full bg-[#f2f4f7] text-[#475467] text-[12.5px]">#{tag}</span>
              ))}
            </div>
          </article>

          <aside className="flex flex-col gap-5 lg:sticky lg:top-20">
            <div className="border border-line rounded-xl p-5">
              <p className="font-semibold mb-1">More from {formatCaDate(story.date, 'short')}</p>
              {moreFromToday.length > 0 ? moreFromToday.slice(0, 5).map(s => (
                <Link key={s.slug} href={`/current-affairs/${s.slug}`} className="group block py-3 border-t border-line first-of-type:border-0">
                  <span className="block text-[12px] text-[#667085]">{s.category}</span>
                  <span className="block text-[15px] leading-snug mt-0.5 group-hover:text-primary-dark">{s.title}</span>
                </Link>
              )) : <p className="text-sm text-[#667085] py-2">No other stories for this day.</p>}
              <Link href={`/current-affairs/daily/${story.date}`} className="block text-sm font-semibold text-primary-dark hover:underline pt-3 border-t border-line">
                All stories for this day
              </Link>
            </div>
            <div className="rounded-xl bg-ink text-white p-5 flex flex-col gap-3">
              <p className="font-semibold text-lg">Test what you’ve read</p>
              <p className="text-sm text-ink-muted leading-relaxed">Practise with full-length mock tests on the real exam interface.</p>
              <Link href="/exams" className="h-11 inline-flex items-center justify-center rounded-lg bg-primary font-semibold hover:bg-primary-dark">Take a free mock test</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
