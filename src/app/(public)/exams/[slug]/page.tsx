import { Metadata } from 'next';
import { api } from '@/lib/api-client';
import { TestSeries } from '@/types';
import TestSeriesList from '@/components/ui/TestSeriesList';
import ExamListingFilters from '@/components/exam/ExamListingFilters';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import PageIntro from '@/components/ui/PageIntro';

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
  const cleanTitle = meta.title.replace(/\s*\|\s*GridAcademy$/, '');

  return (
    <div className="bg-white text-ink">
      <PageIntro
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Test series', href: '/tests' }, { label: cleanTitle }]}
        title={cleanTitle}
        description={meta.description}
      >
        <div className="mt-2"><ExamListingFilters /></div>
      </PageIntro>

      <div className="max-w-[1328px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {tests.length > 0 ? (
          <TestSeriesList series={tests} />
        ) : (
          <div className="rounded-xl border border-dashed border-[#d0d5dd] px-6 py-14 text-center flex flex-col items-center gap-3">
            <p className="text-lg font-semibold">No test series here yet</p>
            <p className="text-[15px] text-[#475467] max-w-md">No coaching institute has published tests for this exam yet. Check back soon, or browse other exams.</p>
            <div className="flex gap-2 mt-1">
              <Link href="/exams" className="h-11 inline-flex items-center px-5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark">Browse exams</Link>
              <Link href="/provider/register" className="h-11 inline-flex items-center px-5 rounded-lg border border-[#d0d5dd] font-semibold hover:bg-paper">Publish as a provider</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
