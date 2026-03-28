import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { api } from '@/lib/api-client';
import { TestSeriesDetail } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Star, Clock, FileText, Users, MapPin, Zap, CheckCircle } from 'lucide-react';
import BuyButton from '@/components/test/BuyButton';
import ReviewsList from '@/components/test/ReviewsList';
import TestCard from '@/components/ui/TestCard';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const series = await api.get<TestSeriesDetail>(`/api/storefront/tests/${params.slug}`);
    return {
      title: `${series?.title} Mock Test Series`,
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
  } catch {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const token = (session?.user as any)?.accessToken;

  // Check if student already purchased this series
  let hasAccess = false;
  if (token) {
    try {
      const ent = await api.get<{ hasAccess: boolean }>(
        `/api/student/entitlement/${series.id}`, token
      );
      hasAccess = ent?.hasAccess ?? false;
    } catch { /* not purchased */ }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-8">

          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500">
            <a href="/" className="hover:text-indigo-600">Home</a>
            <span className="mx-2">/</span>
            <a href={`/exams/${series.examType.toLowerCase()}`} className="hover:text-indigo-600">{series.examType}</a>
            <span className="mx-2">/</span>
            <span className="text-gray-800 truncate">{series.title}</span>
          </nav>

          {/* Hero */}
          <div>
            {series.thumbnailUrl && (
              <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-6 bg-gray-200">
                <img src={series.thumbnailUrl} alt={series.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">{series.examType}</span>
              <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">{series.seriesType}</span>
              {series.isFirstTestFree && (
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Free Trial
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{series.title}</h1>
            <p className="text-gray-500 mt-2">{series.description}</p>

            {/* Rating */}
            {series.reviewCount > 0 && (
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.round(series.avgRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="font-semibold text-gray-800">{series.avgRating.toFixed(1)}</span>
                <span className="text-gray-500 text-sm">({series.reviewCount} reviews)</span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-500 text-sm flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> {series.purchaseCount.toLocaleString()} students
                </span>
              </div>
            )}

            <p className="text-sm text-gray-500 mt-2">
              By <span className="font-semibold text-gray-800">{series.providerName}</span>
              {series.providerCity && <span className="flex items-center gap-1 inline-flex ml-1"><MapPin className="w-3 h-3" />{series.providerCity}</span>}
            </p>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-6 bg-gray-50 rounded-2xl p-5 border border-gray-200">
            {[
              { icon: FileText, label: `${series.testCount} Tests`, sub: 'in this series' },
              { icon: Clock, label: `${series.durationMinutes} min`, sub: 'per test' },
              { icon: Users, label: series.language, sub: 'language' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{label}</p>
                  <p className="text-xs text-gray-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* What's included */}
          {series.whatIncluded?.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">What&apos;s Included</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {series.whatIncluded.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exam Pattern */}
          {series.examPattern?.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Exam Pattern</h2>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-indigo-50 text-indigo-700">
                    <tr>
                      {['Section', 'Questions', 'Marks', 'Duration'].map(h => (
                        <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {series.examPattern.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 font-medium text-gray-800">{row.section}</td>
                        <td className="px-4 py-3 text-gray-600">{row.questions}</td>
                        <td className="px-4 py-3 text-gray-600">{row.marks}</td>
                        <td className="px-4 py-3 text-gray-600">{row.duration ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reviews */}
          <ReviewsList seriesId={series.id} reviews={series.reviews ?? []} />

          {/* Related */}
          {series.relatedSeries?.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Related Test Series</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {series.relatedSeries.slice(0, 3).map(s => <TestCard key={s.id} series={s} />)}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Buy Panel */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="sticky top-20 bg-white rounded-2xl border border-gray-200 shadow-lg p-6 space-y-4">
            {/* Price */}
            <div>
              {series.priceInr === 0 ? (
                <span className="text-3xl font-extrabold text-green-600">FREE</span>
              ) : (
                <div>
                  <span className="text-3xl font-extrabold text-gray-900">{formatPrice(series.priceInr)}</span>
                  <span className="text-sm text-gray-500 ml-2">+ GST</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">Lifetime access · All {series.testCount} tests</p>
            </div>

            <BuyButton series={series} hasAccess={hasAccess} />

            {series.isFirstTestFree && !hasAccess && (
              <a href={`/exam/${series.id}/1`}
                className="block w-full text-center py-3 border border-indigo-600 text-indigo-600 rounded-xl font-semibold text-sm hover:bg-indigo-50 transition-colors">
                Try First Test Free
              </a>
            )}

            <div className="space-y-2 pt-2 border-t border-gray-100">
              {['Detailed solutions for every question', 'All-India Rank & Percentile', 'Section-wise performance analysis', 'Attempt test anytime, anywhere'].map(f => (
                <div key={f} className="flex items-start gap-2 text-xs text-gray-600">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
