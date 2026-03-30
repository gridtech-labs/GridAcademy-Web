import { Metadata } from 'next';
import { api } from '@/lib/api-client';
import { TestSeries } from '@/types';
import TestCard from '@/components/ui/TestCard';
import ExamListingFilters from '@/components/exam/ExamListingFilters';
import { notFound } from 'next/navigation';

const EXAM_META: Record<string, { title: string; description: string }> = {
  ssc:       { title: 'SSC Mock Tests', description: 'SSC CGL, CHSL, MTS, GD Constable mock tests' },
  banking:   { title: 'Banking Mock Tests', description: 'IBPS PO, SBI PO, IBPS Clerk, SBI Clerk mock tests' },
  railways:  { title: 'Railway Mock Tests', description: 'RRB NTPC, Group D, ALP mock tests' },
  upsc:      { title: 'UPSC Mock Tests', description: 'UPSC Civil Services Prelims, CSAT mock tests' },
  police:    { title: 'Police Mock Tests', description: 'Delhi Police, UP Police, SSC CPO mock tests' },
  defence:   { title: 'Defence Mock Tests', description: 'NDA, CDS, AFCAT mock tests' },
  'state-psc': { title: 'State PSC Mock Tests', description: 'UPPSC, MPPSC, BPSC mock tests' },
  teaching:  { title: 'Teaching Mock Tests', description: 'CTET, STET, KVS, NVS mock tests' },
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const meta = EXAM_META[params.slug];
  if (!meta) return { title: 'Mock Tests' };
  return { title: meta.title, description: meta.description };
}

async function getTests(slug: string, searchParams: Record<string, string>): Promise<TestSeries[]> {
  try {
    const qs = new URLSearchParams({
      categorySlug: slug,
      sortBy: searchParams.sort ?? 'popular',
      page: searchParams.page ?? '1',
      pageSize: '20',
      ...(searchParams.free === 'true' ? { minPrice: '0', maxPrice: '0' } : {}),
      ...(searchParams.q ? { query: searchParams.q } : {}),
    });
    const result = await api.get<{ data: { items: TestSeries[] } } | TestSeries[]>(`/api/storefront/tests?${qs}`);
    // Handle both response shapes
    const items = (result as any)?.data?.items ?? (result as any)?.items ?? (Array.isArray(result) ? result : []);
    return items as TestSeries[];
  } catch {
    return [];
  }
}

export default async function ExamListingPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: Record<string, string>;
}) {
  const meta = EXAM_META[params.slug];
  if (!meta) notFound();

  const tests = await getTests(params.slug, searchParams) ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{meta.title}</h1>
        <p className="text-gray-500 mt-1">{meta.description}</p>
        <p className="text-sm text-indigo-600 font-medium mt-2">{tests.length} test series available</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar */}
        <aside className="w-full md:w-56 shrink-0">
          <ExamListingFilters />
        </aside>

        {/* Results grid */}
        <div className="flex-1">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-500">{tests.length} results</p>
            <select defaultValue={searchParams.sort ?? 'popular'}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {tests.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {tests.map(s => <TestCard key={s.id} series={s} />)}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-lg font-semibold text-gray-800">No tests found</h3>
              <p className="text-gray-500 mt-2 text-sm">
                Be the first provider to upload {meta.title.toLowerCase()}!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
