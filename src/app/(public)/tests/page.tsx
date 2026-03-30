import { Suspense } from 'react';
import { api } from '@/lib/api-client';
import { TestSeries } from '@/types';
import TestCard from '@/components/ui/TestCard';
import TestCardSkeleton from '@/components/ui/TestCardSkeleton';
import TestsFilters from './TestsFilters';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: { q?: string; sortBy?: string; free?: string; page?: string; examTypeId?: string };
}

async function fetchTests(searchParams: PageProps['searchParams']) {
  const qs = new URLSearchParams();
  if (searchParams.q)          qs.set('query',      searchParams.q);
  if (searchParams.sortBy)     qs.set('sortBy',      searchParams.sortBy);
  if (searchParams.examTypeId) qs.set('examTypeId',  searchParams.examTypeId);
  if (searchParams.free === 'true') {
    qs.set('minPrice', '0');
    qs.set('maxPrice', '0');
  }
  qs.set('page',     searchParams.page ?? '1');
  qs.set('pageSize', '20');

  try {
    const res = await api.get<{ items: TestSeries[]; total: number }>(`/api/storefront/tests?${qs}`);
    return { items: res?.items ?? [], total: res?.total ?? 0 };
  } catch {
    return { items: [], total: 0 };
  }
}

export default async function TestsPage({ searchParams }: PageProps) {
  const { items, total } = await fetchTests(searchParams);
  const page    = Number(searchParams.page ?? '1');
  const pageSize = 20;
  const totalPages = Math.ceil(total / pageSize);
  const isFree  = searchParams.free === 'true';
  const q       = searchParams.q ?? '';

  /* ── page title ── */
  let heading   = 'All Tests';
  let subtitle  = 'Explore all available mock tests and practice series';
  if (isFree)                heading = 'Free Tests';
  if (searchParams.sortBy === 'popular')  { heading = 'Most Popular Tests'; subtitle = 'Tests loved by thousands of aspirants'; }
  if (searchParams.sortBy === 'newest')   { heading = 'New Arrivals';        subtitle = 'Freshly published tests — be the first to practice'; }
  if (q)                     { heading = `Results for "${q}"`; subtitle = `${total} test${total !== 1 ? 's' : ''} found`; }

  return (
    <>
      {/* Filter bar (client component) */}
      <Suspense fallback={<div className="h-16 bg-white border-b border-gray-200" />}>
        <TestsFilters total={total} />
      </Suspense>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{heading}</h1>
          {!q && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>

        {/* Grid */}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {items.map(s => <TestCard key={s.id} series={s} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-indigo-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No tests found</h3>
            <p className="text-sm text-gray-500 mb-4">
              {q ? `No results for "${q}". Try a different search term.` : 'No tests are available for the selected filters.'}
            </p>
            <Link href="/tests"
              className="text-sm text-indigo-600 font-medium hover:underline">
              Clear all filters
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            {page > 1 && (
              <Link href={`/tests?${buildPaginationQuery(searchParams, page - 1)}`}
                className="px-4 py-2 text-sm border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                ← Previous
              </Link>
            )}

            <div className="flex items-center gap-1">
              {getPaginationRange(page, totalPages).map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">…</span>
                ) : (
                  <Link key={p}
                    href={`/tests?${buildPaginationQuery(searchParams, Number(p))}`}
                    className={`w-9 h-9 flex items-center justify-center text-sm rounded-xl border transition-colors
                      ${Number(p) === page
                        ? 'bg-indigo-600 text-white border-indigo-600 font-medium'
                        : 'border-gray-300 hover:bg-gray-50 text-gray-700'}`}>
                    {p}
                  </Link>
                )
              )}
            </div>

            {page < totalPages && (
              <Link href={`/tests?${buildPaginationQuery(searchParams, page + 1)}`}
                className="px-4 py-2 text-sm border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                Next →
              </Link>
            )}
          </div>
        )}

      </div>
    </>
  );
}

/* ── helpers ── */

function buildPaginationQuery(params: PageProps['searchParams'], page: number) {
  const qs = new URLSearchParams();
  if (params.q)       qs.set('q',       params.q);
  if (params.sortBy)  qs.set('sortBy',   params.sortBy);
  if (params.free)    qs.set('free',     params.free);
  if (page > 1)       qs.set('page',     String(page));
  return qs.toString();
}

function getPaginationRange(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | '...')[] = [1];
  if (current > 3)  pages.push('...');
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p);
  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
}
