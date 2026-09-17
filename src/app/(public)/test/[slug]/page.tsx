import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { Check, MapPin, Star } from 'lucide-react';
import { authOptions } from '@/lib/auth-options';
import { api } from '@/lib/api-client';
import { TestSeriesDetail } from '@/types';
import { formatPrice } from '@/lib/utils';
import BuyButton from '@/components/test/BuyButton';
import ReviewsList from '@/components/test/ReviewsList';
import TestSeriesList from '@/components/ui/TestSeriesList';
import PageIntro from '@/components/ui/PageIntro';

export async function generateMetadata(
  { params }: { params: { slug: string } },
): Promise<Metadata> {
  try {
    const series = await api.get<TestSeriesDetail>(`/api/storefront/tests/${params.slug}`);
    return {
      title: `${series?.title} | Mock Test Series`,
      description: series?.description?.slice(0, 155),
      openGraph: { images: series?.thumbnailUrl ? [series.thumbnailUrl] : [] },
    };
  } catch {
    return { title: 'Mock Test Series' };
  }
}

export default async function TestDetailPage({ params }: { params: { slug: string } }) {
  let series: TestSeriesDetail;
  try {
    series = await api.get<TestSeriesDetail>(`/api/storefront/tests/${params.slug}`);
    if (!series) notFound();
  } catch { notFound(); }

  const session   = await getServerSession(authOptions);
  const token     = (session?.user as any)?.accessToken;
  let   hasAccess = false;

  if (token) {
    try {
      const ent = await api.get<{ hasAccess: boolean }>(`/api/student/entitlement/${series.id}`, token);
      hasAccess = ent?.hasAccess ?? false;
    } catch { /* not purchased */ }
  }

  const chip = 'h-[26px] inline-flex items-center px-2.5 rounded-full text-[12.5px] font-medium';

  return (
    <div className="bg-white text-ink">
      <PageIntro
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Test series', href: '/tests' }, { label: series.title }]}
        title={series.title}
        description={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px]">
            <span>By <b className="text-ink font-semibold">{series.providerName}</b></span>
            {series.providerCity && <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{series.providerCity}</span>}
            {series.reviewCount > 0 && (
              <span className="inline-flex items-center gap-1">
                <Star className="w-4 h-4 fill-saffron text-saffron" /><b className="text-ink">{series.avgRating.toFixed(1)}</b> ({series.reviewCount} reviews)
              </span>
            )}
          </span>
        }
      >
        <div className="flex flex-wrap gap-2">
          {series.examType && <span className={`${chip} bg-primary-tint text-primary-dark`}>{series.examType}</span>}
          {series.seriesType && <span className={`${chip} bg-[#f2f4f7] text-[#344054]`}>{series.seriesType}</span>}
          {series.isFirstTestFree && <span className={`${chip} bg-[#e7f6ec] text-[#0b6b31]`}>Free preview test</span>}
        </div>
      </PageIntro>

      <div className="max-w-[1328px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-10 grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-12 items-start [&>*]:min-w-0">
        <aside className="lg:order-2 lg:sticky lg:top-20">
          <div className="bg-white border border-line rounded-xl p-5 md:p-6 flex flex-col gap-4 shadow-[0_12px_32px_-14px_rgba(14,23,38,.18)]">
            <div>
              <p className="text-[34px] font-bold leading-tight">
                {series.priceInr === 0 ? <span className="text-[#0b6b31]">Free</span> : formatPrice(series.priceInr)}
              </p>
              <p className="text-sm text-[#475467] mt-0.5">Lifetime access · {series.testCount} test{series.testCount === 1 ? '' : 's'}</p>
            </div>
            <BuyButton series={series} hasAccess={hasAccess} />
            {series.isFirstTestFree && !hasAccess && (
              <a href={`/exam/${series.id}/1`}
                className="h-11 inline-flex items-center justify-center rounded-lg bg-primary-tint text-primary-dark font-semibold hover:bg-[#d6e4fd]">
                Try the first test free
              </a>
            )}
            <ul className="flex flex-col gap-2 pt-3 border-t border-line">
              {['Detailed solutions for every question', 'Score and time taken after every test', 'Section-wise results', 'Attempt anytime, on any device'].map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-[#344054]">
                  <Check className="w-4 h-4 text-[#12803c] mt-0.5 shrink-0" strokeWidth={2.4} />{f}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="lg:order-1 flex flex-col gap-10">
          <dl className="grid grid-cols-3 border-y border-line">
            {[
              ['Tests', String(series.testCount)],
              ['Per test', series.durationMinutes > 0 ? `${series.durationMinutes} min` : '—'],
              ['Language', series.language || 'English'],
            ].map(([k, v], i) => (
              <div key={k} className={`py-4 ${i ? 'pl-4 md:pl-6 border-l border-line' : ''}`}>
                <dt className="text-[13px] text-[#667085]">{k}</dt>
                <dd className="font-mono font-semibold text-lg md:text-xl mt-1 truncate">{v}</dd>
              </div>
            ))}
          </dl>

          {series.description && (
            <section className="flex flex-col gap-3">
              <h2 className="text-xl md:text-2xl font-semibold">About this series</h2>
              <p className="text-base leading-relaxed text-[#344054] max-w-[760px]">{series.description}</p>
            </section>
          )}

          {series.whatIncluded?.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-xl md:text-2xl font-semibold">What’s included</h2>
              <ul className="grid sm:grid-cols-2 gap-2.5">
                {series.whatIncluded.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[15px] text-[#344054]">
                    <Check className="w-[18px] h-[18px] text-[#12803c] shrink-0 mt-0.5" strokeWidth={2.4} />{item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {series.examPattern?.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-xl md:text-2xl font-semibold">Exam pattern</h2>
              <div className="border border-line rounded-xl overflow-x-auto">
                <table className="w-full text-[14.5px]">
                  <thead>
                    <tr className="bg-[#f9fafb] text-[12.5px] text-[#475467] text-left">
                      {['Section', 'Questions', 'Marks', 'Duration'].map(h => <th key={h} className="font-semibold px-4 py-2.5">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {series.examPattern.map((row, i) => (
                      <tr key={i} className="border-t border-[#eef0f3]">
                        <td className="px-4 py-3">{row.section}</td>
                        <td className="px-4 py-3 font-mono">{row.questions}</td>
                        <td className="px-4 py-3 font-mono">{row.marks}</td>
                        <td className="px-4 py-3 font-mono">{row.duration ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <ReviewsList seriesId={series.id} reviews={series.reviews ?? []} />

          {series.relatedSeries?.length > 0 && (
            <section className="flex flex-col gap-4">
              <div className="flex items-end justify-between">
                <h2 className="text-xl md:text-2xl font-semibold">Related test series</h2>
                <Link href="/tests" className="text-[15px] font-semibold text-primary-dark hover:underline">See all</Link>
              </div>
              <TestSeriesList series={series.relatedSeries.slice(0, 3)} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
