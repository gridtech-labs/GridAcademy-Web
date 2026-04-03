import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { api } from '@/lib/api-client';
import { TestSeriesDetail } from '@/types';
import { formatPrice } from '@/lib/utils';
import {
  Star, Clock, FileText, Users, MapPin, Zap,
  CheckCircle, ChevronRight, Building2, BookOpen,
} from 'lucide-react';
import BuyButton from '@/components/test/BuyButton';
import ReviewsList from '@/components/test/ReviewsList';
import TestCard from '@/components/ui/TestCard';
import Link from 'next/link';
import Image from 'next/image';

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
      const ent = await api.get<{ hasAccess: boolean }>(
        `/api/student/entitlement/${series.id}`, token,
      );
      hasAccess = ent?.hasAccess ?? false;
    } catch { /* not purchased */ }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}

      {/* Banner strip */}
      <div className="relative w-full h-44 md:h-56 overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#0f0c29 0%,#1e1b4b 45%,#312e81 80%,#1e3a5f 100%)' }}>
        {series.thumbnailUrl && (
          <Image src={series.thumbnailUrl} alt={series.title} fill
            className="object-cover object-center opacity-20"
            sizes="100vw" unoptimized />
        )}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 70% 50%,rgba(249,115,22,.12),transparent 60%)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 pointer-events-none" />
      </div>

      {/* Info row — overlaps banner */}
      <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e1b4b)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7">
          <div className="flex flex-col md:flex-row gap-5 md:gap-8 items-start md:items-center">

            {/* Thumbnail */}
            <div className="shrink-0 -mt-12 md:-mt-14">
              {series.thumbnailUrl ? (
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden
                  border-4 shadow-2xl bg-white"
                  style={{ borderColor: 'rgba(249,115,22,.4)' }}>
                  <Image src={series.thumbnailUrl} alt={series.title}
                    width={96} height={96}
                    className="w-full h-full object-cover" unoptimized />
                </div>
              ) : (
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-4 shadow-xl
                  flex items-center justify-center text-4xl"
                  style={{ background: 'rgba(249,115,22,.2)', borderColor: 'rgba(249,115,22,.35)' }}>
                  📋
                </div>
              )}
            </div>

            {/* Title + meta */}
            <div className="flex-1 min-w-0">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: 'rgba(249,115,22,.2)', border: '1px solid rgba(249,115,22,.35)', color: '#fdba74' }}>
                  {series.examType}
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full text-indigo-200"
                  style={{ background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)' }}>
                  {series.seriesType}
                </span>
                {series.isFirstTestFree && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1"
                    style={{ background: 'rgba(34,197,94,.2)', border: '1px solid rgba(34,197,94,.35)', color: '#86efac' }}>
                    <Zap className="w-3 h-3" /> Free Trial
                  </span>
                )}
              </div>

              <h1 className="text-xl md:text-2xl font-extrabold text-white leading-tight mb-1">
                {series.title}
              </h1>

              {/* Rating */}
              {series.reviewCount > 0 && (
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${
                        i < Math.round(series.avgRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-indigo-700'
                      }`} />
                    ))}
                  </div>
                  <span className="text-amber-400 font-bold text-sm">{series.avgRating.toFixed(1)}</span>
                  <span className="text-indigo-300/70 text-xs">({series.reviewCount} reviews)</span>
                  <span className="text-indigo-300/50">·</span>
                  <span className="text-indigo-300/70 text-xs flex items-center gap-1">
                    <Users className="w-3 h-3" />{series.purchaseCount.toLocaleString()} students
                  </span>
                </div>
              )}

              {/* Provider */}
              <p className="text-indigo-300/70 text-sm flex items-center gap-1 flex-wrap">
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span>By <strong className="text-indigo-200">{series.providerName}</strong></span>
                {series.providerCity && (
                  <span className="flex items-center gap-0.5">
                    <MapPin className="w-3 h-3" />{series.providerCity}
                  </span>
                )}
              </p>
            </div>

            {/* Price CTA (desktop hero) */}
            <div className="hidden md:block shrink-0 text-right">
              {series.priceInr === 0 ? (
                <p className="text-3xl font-extrabold text-green-400 mb-1">FREE</p>
              ) : (
                <p className="text-3xl font-extrabold text-white mb-1">{formatPrice(series.priceInr)}</p>
              )}
              <p className="text-indigo-300/60 text-xs">Lifetime access</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Breadcrumb ─────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500">
            <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/tests" className="hover:text-orange-500 transition-colors">Tests</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-800 font-medium truncate max-w-[200px]">{series.title}</span>
          </nav>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Left: main content ──────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-8">

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: FileText, label: `${series.testCount} Tests`,         sub: 'in this series' },
                { icon: Clock,    label: `${series.durationMinutes} min`,      sub: 'per test'       },
                { icon: Users,    label: series.language || 'English',         sub: 'language'       },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
                  <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-sm leading-tight truncate">{label}</p>
                    <p className="text-xs text-gray-500">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            {series.description && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-orange-500" />
                  </div>
                  <h2 className="font-bold text-gray-900">About This Test Series</h2>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{series.description}</p>
              </div>
            )}

            {/* What's included */}
            {series.whatIncluded?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </span>
                  What&apos;s Included
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {series.whatIncluded.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exam Pattern */}
            {series.examPattern?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                  <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h2 className="font-bold text-gray-900">Exam Pattern</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-indigo-50 border-b border-indigo-100">
                        {['Section', 'Questions', 'Marks', 'Duration'].map(h => (
                          <th key={h} className="px-4 py-3 text-left font-semibold text-indigo-700">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {series.examPattern.map((row, i) => (
                        <tr key={i} className="hover:bg-orange-50/30 transition-colors">
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
                <h2 className="text-base font-bold text-gray-900 mb-4">Related Test Series</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {series.relatedSeries.slice(0, 3).map(s => <TestCard key={s.id} series={s} />)}
                </div>
              </div>
            )}
          </div>

          {/* ── Right: sticky buy panel ──────────────────────────────────────────── */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="sticky top-20 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">

              {/* Orange accent header */}
              <div className="px-6 py-4"
                style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81)' }}>
                <div className="flex items-end justify-between gap-2">
                  <div>
                    {series.priceInr === 0 ? (
                      <p className="text-3xl font-extrabold text-green-400">FREE</p>
                    ) : (
                      <p className="text-3xl font-extrabold text-white">{formatPrice(series.priceInr)}</p>
                    )}
                    <p className="text-indigo-300/70 text-xs mt-0.5">Lifetime access · {series.testCount} tests</p>
                  </div>
                  {series.priceInr > 0 && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                      style={{ background: 'rgba(249,115,22,.25)', color: '#fdba74', border: '1px solid rgba(249,115,22,.4)' }}>
                      Best Value
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-3">
                <BuyButton series={series} hasAccess={hasAccess} />

                {series.isFirstTestFree && !hasAccess && (
                  <a href={`/exam/${series.id}/1`}
                    className="block w-full text-center py-3 border-2 border-orange-400 text-orange-600 rounded-xl font-semibold text-sm hover:bg-orange-50 transition-colors">
                    Try First Test Free ⚡
                  </a>
                )}

                <div className="pt-3 border-t border-gray-100 space-y-2">
                  {[
                    'Detailed solutions for every question',
                    'All-India Rank & Percentile',
                    'Section-wise performance analysis',
                    'Attempt anytime, anywhere',
                  ].map(f => (
                    <div key={f} className="flex items-start gap-2 text-xs text-gray-600">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
