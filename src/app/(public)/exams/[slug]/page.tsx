import { Metadata } from 'next';
import { api } from '@/lib/api-client';
import { TestSeries } from '@/types';
import TestCard from '@/components/ui/TestCard';
import ExamListingFilters from '@/components/exam/ExamListingFilters';
import { notFound } from 'next/navigation';

const BASE_URL = 'https://www.gridacademy.in';

const EXAM_META: Record<string, { title: string; description: string }> = {
  // ── Broad category pages ──────────────────────────────────────────────────
  ssc:         { title: 'SSC Mock Tests 2026', description: 'Free SSC CGL, CHSL, MTS and GD Constable mock tests for 2026. Latest pattern, instant results.' },
  banking:     { title: 'Banking Mock Tests 2026', description: 'Free IBPS PO, SBI PO, IBPS Clerk and SBI Clerk mock tests with detailed solutions for 2026.' },
  railways:    { title: 'Railway Mock Tests 2026', description: 'Free RRB NTPC, Group D and ALP mock tests based on the latest 2026 Railway exam pattern.' },
  upsc:        { title: 'UPSC Mock Tests 2026', description: 'Free UPSC Civil Services Prelims GS Paper 1 and CSAT mock tests for 2026.' },
  police:      { title: 'Police Exam Mock Tests 2026', description: 'Free Delhi Police, UP Police and SSC CPO mock tests for 2026 recruitment.' },
  defence:     { title: 'Defence Exam Mock Tests 2026', description: 'Free NDA, CDS and AFCAT mock tests with previous year papers for 2026.' },
  'state-psc': { title: 'State PSC Mock Tests 2026', description: 'Free UPPSC, MPPSC and BPSC mock tests with full-length practice sets for 2026.' },
  teaching:    { title: 'Teaching Exam Mock Tests 2026', description: 'Free CTET, STET, KVS and NVS mock tests based on the latest syllabus.' },
  cuet:        { title: 'CUET Mock Tests 2026', description: 'Free CUET UG 2026 mock tests with real exam pattern, domain subjects and language sections.' },
  neet:        { title: 'NEET UG Mock Tests 2026', description: 'Free NEET UG 2026 mock tests covering Physics, Chemistry and Biology with instant analysis.' },
  // ── Individual exam slugs ─────────────────────────────────────────────────
  'ssc-cgl':      { title: 'SSC CGL Mock Tests 2026', description: 'Free SSC CGL Tier 1 & 2 mock tests for 2026. Previous year papers, practice sets and instant analysis.' },
  'ssc-chsl':     { title: 'SSC CHSL Mock Tests 2026', description: 'Free SSC CHSL Tier 1 & 2 mock tests for 2026 with previous year papers and performance analysis.' },
  'ssc-mts':      { title: 'SSC MTS Mock Tests 2026', description: 'Free SSC MTS mock tests for 2026 based on the latest exam pattern and syllabus.' },
  'ssc-gd':       { title: 'SSC GD Constable Mock Tests 2026', description: 'Free SSC GD Constable mock tests for 2026 with previous year papers and instant results.' },
  'ibps-po':      { title: 'IBPS PO Mock Tests 2026', description: 'Free IBPS PO Prelims and Mains mock tests with detailed solutions for 2026.' },
  'ibps-clerk':   { title: 'IBPS Clerk Mock Tests 2026', description: 'Free IBPS Clerk Prelims and Mains mock tests for 2026 with full-length practice papers.' },
  'sbi-po':       { title: 'SBI PO Mock Tests 2026', description: 'Free SBI PO Prelims and Mains mock tests with detailed performance analysis.' },
  'sbi-clerk':    { title: 'SBI Clerk Mock Tests 2026', description: 'Free SBI Clerk Prelims and Mains mock tests for 2026 with previous year papers.' },
  'rrb-ntpc':     { title: 'RRB NTPC Mock Tests 2026', description: 'Free RRB NTPC CBT 1 & CBT 2 mock tests based on latest 2026 exam pattern.' },
  'rrb-group-d':  { title: 'RRB Group D Mock Tests 2026', description: 'Free RRB Group D mock tests for 2026 with previous year papers and instant results.' },
  'rrb-alp':      { title: 'RRB ALP Mock Tests 2026', description: 'Free RRB Assistant Loco Pilot mock tests for 2026 covering CBT 1, CBT 2 and CBAT.' },
  'upsc-prelims': { title: 'UPSC Prelims Mock Tests 2026', description: 'Free UPSC Prelims GS Paper 1 and CSAT mock tests for 2026.' },
  'cuet-ug':      { title: 'CUET UG Mock Tests 2026', description: 'Free CUET UG 2026 mock tests with real exam pattern, domain subjects and language sections.' },
  'neet-ug':      { title: 'NEET UG Mock Tests 2026', description: 'Free NEET UG 2026 mock tests covering Physics, Chemistry and Biology with instant analysis.' },
};

const CURRENT_YEAR = new Date().getFullYear();

function buildFallbackMeta(slug: string) {
  const name = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return {
    title: `${name} Mock Tests ${CURRENT_YEAR}`,
    description: `Free ${name} mock tests for ${CURRENT_YEAR} on GridAcademy — latest pattern, previous year papers and instant results.`,
  };
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

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const meta = EXAM_META[params.slug] ?? buildFallbackMeta(params.slug);
  const tests = await getTests(params.slug, {});
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `${BASE_URL}/exams/${params.slug}` },
    robots: tests.length > 0
      ? { index: true, follow: true }
      : { index: false, follow: true },
  };
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
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{meta.title.replace(/\s*\|\s*GridAcademy$/, '')}</h1>
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
