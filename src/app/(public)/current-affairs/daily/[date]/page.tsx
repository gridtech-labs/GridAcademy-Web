import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { getStoriesByDate, getAllDates } from '@/lib/current-affairs';
import { caTone, formatCaDate } from '@/lib/ca-tone';
import PageIntro from '@/components/ui/PageIntro';

export async function generateMetadata({ params }: { params: { date: string } }) {
  const dateStr = formatCaDate(params.date);
  return {
    title: `Current Affairs ${dateStr} for UPSC & SSC`,
    description: `Read the most important current affairs for ${dateStr}. Handpicked for UPSC, SSC, Banking, Railway, NEET, CUET and other competitive exams.`,
    alternates: { canonical: `https://www.gridacademy.in/current-affairs/daily/${params.date}` },
  };
}

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
  const activeStory = stories.find(s => s.slug === searchParams.s) ?? stories[0];

  return (
    <div className="bg-white text-ink">
      <PageIntro
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Current affairs' }]}
        eyebrow="Daily current affairs"
        title={formatCaDate(date)}
        description="Exam-relevant news with key facts for revision — for UPSC, SSC, Banking, Railways and more."
      >
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 mt-1" aria-label="Choose a date">
          {allDates.slice(0, 10).map(d => (
            <Link key={d} href={`/current-affairs/daily/${d}`} aria-current={d === date ? 'date' : undefined}
              className={`h-9 inline-flex items-center px-3.5 rounded-full text-[13.5px] font-medium whitespace-nowrap ${
                d === date ? 'bg-ink text-white' : 'bg-white border border-line text-[#344054] hover:bg-[#f2f4f7]'
              }`}>
              {formatCaDate(d, 'short')}
            </Link>
          ))}
        </div>
      </PageIntro>

      <div className="max-w-[1180px] mx-auto px-4 md:px-6 py-6 md:py-8 grid lg:grid-cols-[360px_1fr] gap-5 lg:gap-8 items-start [&>*]:min-w-0">
        <nav className="flex flex-col border border-line rounded-xl overflow-hidden lg:sticky lg:top-20" aria-label="Stories">
          {stories.map(story => {
            const on = story.slug === activeStory.slug;
            return (
              <Link key={story.slug} href={`?s=${story.slug}`} scroll={false} aria-current={on ? 'true' : undefined}
                className={`flex flex-col gap-1.5 px-4 py-3.5 border-b border-line last:border-0 border-l-[3px] ${
                  on ? 'bg-primary-tint/50 border-l-primary' : 'border-l-transparent hover:bg-paper'
                }`}>
                <span className="flex items-center gap-2 flex-wrap">
                  <span className={`h-[22px] inline-flex items-center px-2 rounded-full text-[11.5px] font-medium ${caTone(story.category)}`}>{story.category}</span>
                  <span className="text-[12px] text-[#667085]">{story.examRelevance.slice(0, 3).join(' · ')}</span>
                </span>
                <span className={`text-[15px] leading-snug ${on ? 'font-semibold' : 'font-medium'}`}>{story.title}</span>
              </Link>
            );
          })}
        </nav>

        <article className="border border-line rounded-xl p-5 md:p-8 flex flex-col gap-6">
          <header className="flex flex-col gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`h-[26px] inline-flex items-center px-2.5 rounded-full text-[12.5px] font-medium ${caTone(activeStory.category)}`}>{activeStory.category}</span>
              {activeStory.examRelevance.map(exam => (
                <span key={exam} className="h-[26px] inline-flex items-center px-2.5 rounded-full bg-[#f2f4f7] text-[#344054] text-[12.5px] font-medium">{exam}</span>
              ))}
            </div>
            <h2 className="text-2xl md:text-[30px] font-bold leading-tight tracking-[-0.01em]">{activeStory.title}</h2>
            <p className="text-[13.5px] text-[#667085]">{activeStory.source} · {formatCaDate(activeStory.date)}</p>
          </header>

          <p className="text-[17px] leading-relaxed text-[#1d2939]">{activeStory.summary}</p>

          <section className="rounded-lg bg-paper border border-line px-4 md:px-5 py-4">
            <h3 className="font-semibold mb-1.5">Why it matters for exams</h3>
            <p className="text-[15.5px] leading-relaxed text-[#344054]">{activeStory.whyItMatters}</p>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-3">Key facts for revision</h3>
            <ol className="flex flex-col divide-y divide-line border-y border-line">
              {activeStory.keyFacts.map((fact, i) => (
                <li key={i} className="flex gap-3.5 py-3">
                  <span className="font-mono text-sm text-primary-dark pt-0.5 w-5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[15.5px] leading-relaxed text-[#344054]">{fact}</span>
                </li>
              ))}
            </ol>
          </section>

          <div className="flex flex-wrap gap-2">
            {activeStory.tags.map(tag => (
              <span key={tag} className="h-7 inline-flex items-center px-2.5 rounded-full bg-[#f2f4f7] text-[#475467] text-[12.5px]">#{tag}</span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-5 border-t border-line">
            <Link href={`/current-affairs/${activeStory.slug}`} className="inline-flex items-center gap-1 text-[15px] font-semibold text-primary-dark hover:underline">
              Open full article <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/exams" className="sm:ml-auto h-11 inline-flex items-center justify-center px-5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark">
              Practise with a mock test
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
