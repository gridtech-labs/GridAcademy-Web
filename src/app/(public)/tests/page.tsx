import { Suspense } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { TestSeries } from '@/types';
import TestCard from '@/components/ui/TestCard';
import TestsFilters from './TestsFilters';
import PageIntro from '@/components/ui/PageIntro';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: { q?: string; sortBy?: string; free?: string; page?: string; examTypeId?: string };
}

async function fetchTests(searchParams: PageProps['searchParams']) {
  const qs = new URLSearchParams();
  if (searchParams.q)          qs.set('query',      searchParams.q);
  if (searchParams.sortBy)     qs.set('sortBy',     searchParams.sortBy);
  if (searchParams.examTypeId) qs.set('examTypeId', searchParams.examTypeId);
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
  const page       = Number(searchParams.page ?? '1');
  const totalPages = Math.ceil(total / 20);
  const q          = searchParams.q ?? '';

  let heading  = 'Test series';
  let subtitle = 'Mock test series from coaching institutes, with free preview tests and student ratings.';
  if (searchParams.free === 'true') heading = 'Free test series';
  if (searchParams.sortBy === 'popular') heading = 'Popular test series';
  if (searchParams.sortBy === 'newest')  { heading = 'New test series'; subtitle = 'The most recently published series.'; }
  if (q) { heading = `Results for “${q}”`; subtitle = ''; }

  return (
    <div className="bg-white text-ink">
      <PageIntro crumbs={[{ label: 'Home', href: '/' }, { label: 'Test series' }]} title={heading} description={subtitle || undefined}>
        <div className="mt-2">
          <Suspense fallback={<div className="h-11" />}>
            <TestsFilters total={total} />
          </Suspense>
        </div>
      </PageIntro>

      <div className="max-w-[1328px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {items.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {items.map(s => <TestCard key={s.id} series={s} />)}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#d0d5dd] px-6 py-14 text-center flex flex-col items-center gap-3">
            <p className="text-lg font-semibold">No test series found</p>
            <p className="text-[15px] text-[#475467]">{q ? `Nothing matches “${q}”. Try another search.` : 'No series match these filters yet.'}</p>
            <div className="flex gap-2 mt-1">
              <Link href="/tests" className="h-11 inline-flex items-center px-5 rounded-lg border border-[#d0d5dd] font-semibold hover:bg-paper">Clear filters</Link>
              <Link href="/exams" className="h-11 inline-flex items-center px-5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark">Browse exams</Link>
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <nav className="flex justify-center items-center gap-2 mt-10" aria-label="Pagination">
            {page > 1 && (
              <Link href={`/tests?${buildPaginationQuery(searchParams, page - 1)}`}
                className="h-10 inline-flex items-center px-4 rounded-lg border border-[#d0d5dd] text-sm font-semibold hover:bg-paper">Previous</Link>
            )}
            {getPaginationRange(page, totalPages).map((p, i) =>
              p === '...' ? (
                <span key={`e-${i}`} className="px-1 text-[#667085]">…</span>
              ) : (
                <Link key={p} href={`/tests?${buildPaginationQuery(searchParams, Number(p))}`} aria-current={Number(p) === page ? 'page' : undefined}
                  className={`w-10 h-10 inline-flex items-center justify-center rounded-lg text-sm font-semibold ${
                    Number(p) === page ? 'bg-ink text-white' : 'border border-[#d0d5dd] hover:bg-paper'
                  }`}>
                  {p}
                </Link>
              ),
            )}
            {page < totalPages && (
              <Link href={`/tests?${buildPaginationQuery(searchParams, page + 1)}`}
                className="h-10 inline-flex items-center px-4 rounded-lg border border-[#d0d5dd] text-sm font-semibold hover:bg-paper">Next</Link>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}

function buildPaginationQuery(params: PageProps['searchParams'], page: number) {
  const qs = new URLSearchParams();
  if (params.q)      qs.set('q', params.q);
  if (params.sortBy) qs.set('sortBy', params.sortBy);
  if (params.free)   qs.set('free', params.free);
  if (page > 1)      qs.set('page', String(page));
  return qs.toString();
}

function getPaginationRange(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | '...')[] = [1];
  if (current > 3) pages.push('...');
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p);
  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
}
