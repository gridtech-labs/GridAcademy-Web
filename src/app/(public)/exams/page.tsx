export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Search, X } from 'lucide-react';
import { api } from '@/lib/api-client';
import { ExamCard } from '@/types/exam';
import { STREAMS, StreamKey, streamOf } from '@/lib/streams';
import ExamList from '@/components/exam/ExamList';
import PageIntro from '@/components/ui/PageIntro';

export const metadata: Metadata = {
  title: 'Mock Tests & Practice Sets for SSC, Banking, Railway, NEET 2026',
  description: 'Practice free & paid mock tests for SSC CGL, IBPS PO, RRB NTPC, NEET, UPSC, CUET 2026. Instant results, section-wise scores and a solution for every question. Start free today.',
  keywords: 'mock test, free mock test, SSC CGL mock test, IBPS PO mock test, NEET mock test 2026, RRB NTPC mock test, UPSC mock test, CUET mock test 2026, online test series, practice test',
  alternates: { canonical: 'https://www.gridacademy.in/exams' },
  openGraph: {
    title: 'Free Mock Tests for All Government & Entrance Exams | GridAcademy',
    description: 'Mock tests on the real computer-based exam interface, with instant results and a solution for every question. Free to start.',
    url: 'https://www.gridacademy.in/exams',
    type: 'website',
    images: [{ url: 'https://www.gridacademy.in/og-image.jpg', width: 1200, height: 630 }],
  },
};

// ── Data ──────────────────────────────────────────────────────────────────────
async function getAllExams(): Promise<ExamCard[]> {
  try {
    const res = await api.get<ExamCard[]>('/api/exam-pages');
    return Array.isArray(res) ? res : (res as any)?.data ?? [];
  } catch { return []; }
}

const FAQS = [
  {
    q: 'Are the mock tests on GridAcademy free?',
    a: 'Yes. Most exams on GridAcademy include free mock tests. You can start one with just your email and 10-digit mobile number — no password or payment needed.',
  },
  {
    q: 'How are GridAcademy mock tests different from other platforms?',
    a: 'Tests run on the computer-based exam interface, and the moment you submit you see your score, section-wise correct, incorrect and unattempted counts, and the correct answer with a solution for every question.',
  },
  {
    q: 'Do the mock tests follow the latest 2025–26 exam pattern?',
    a: 'Yes. All mock tests are regularly updated to reflect the latest notification, syllabus, and pattern released by the conducting bodies — NTA, SSC, IBPS, RRB, and others.',
  },
  {
    q: 'Can I take mock tests on my mobile phone?',
    a: 'Absolutely. GridAcademy is fully mobile-optimised. You can attempt, review, and analyse mock tests from any smartphone, tablet, or desktop browser without downloading an app.',
  },
  {
    q: 'What exams does GridAcademy cover?',
    a: 'GridAcademy covers SSC (CGL, CHSL, MTS, CPO), Banking (IBPS PO/Clerk, SBI PO/Clerk), Railway (RRB NTPC, ALP, Group D), UPSC, NEET UG, CUET UG/PG, State PSCs, Defence (NDA, CDS), Teaching (CTET, DSSSB), and many more.',
  },
  {
    q: 'What do I see after submitting a test?',
    a: 'Your result shows your total score and percentage, whether you passed, your accuracy, section-wise correct, incorrect and unattempted counts, the time you took, and the correct answer with a solution for every question.',
  },
];

const COVERAGE = [
  { cat: 'SSC',            items: 'CGL, CHSL, MTS, CPO, Stenographer, JE' },
  { cat: 'Banking',        items: 'IBPS PO, IBPS Clerk, SBI PO, SBI Clerk, RBI Grade B' },
  { cat: 'Railway',        items: 'RRB NTPC, ALP, Group D, JE, RPF Constable' },
  { cat: 'NEET / Medical', items: 'NEET UG 2026, AIIMS, JIPMER, State Medical Entrance' },
  { cat: 'CUET',           items: 'CUET UG 2026, CUET PG, Domain Subjects, General Test' },
  { cat: 'UPSC',           items: 'IAS Prelims, CAPF, CDS, NDA, EPFO EO/AO' },
  { cat: 'State PSCs',     items: 'BPSC, UPPSC, MPSC, RPSC, TNPSC, WBPSC' },
  { cat: 'Teaching',       items: 'CTET, DSSSB TGT/PGT, KVS, NVS, HTET, UPTET' },
  { cat: 'Defence',        items: 'NDA, CDS, AFCAT, Agniveer, Indian Coast Guard' },
];

function buildHref(params: { q?: string; category?: string; stream?: string }) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v) sp.set(k, v); });
  const qs = sp.toString();
  return qs ? `/exams?${qs}` : '/exams';
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function ExamsPage({
  searchParams,
}: {
  searchParams?: { category?: string; q?: string; stream?: string };
}) {
  const allExams = await getAllExams();

  const rawQuery = (searchParams?.q ?? '').trim();
  const query = rawQuery.toLowerCase();
  const activeCategory = searchParams?.category ?? '';
  const activeStream = STREAMS.find(s => s.key === searchParams?.stream)?.key as StreamKey | undefined;

  const withTests = allExams.filter(e => e.testCount > 0);
  const filtered = withTests
    .filter(e => !activeCategory || e.examTypeName === activeCategory)
    .filter(e => !activeStream || streamOf(e) === activeStream)
    .filter(e => !query || [e.title, e.conductingBody, e.examTypeName, e.examCategoryName, e.examSubCategoryName]
      .some(v => (v ?? '').toLowerCase().includes(query)))
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));

  const isFiltered = !!(query || activeCategory || activeStream);
  const streamName = activeStream ? STREAMS.find(s => s.key === activeStream)!.name : null;

  const title = query
    ? <>Exams for “{rawQuery}”</>
    : streamName ? `${streamName} mock tests`
    : activeCategory ? activeCategory
    : 'All exams';

  // Unfiltered, the directory reads as one table per stream
  const groups = isFiltered ? [] : STREAMS.map(st => ({ ...st, exams: filtered.filter(e => streamOf(e) === st.key) })).filter(g => g.exams.length > 0);

  const crumbs = [{ label: 'Home', href: '/' }, ...(isFiltered ? [{ label: 'Exams', href: '/exams' }, { label: rawQuery || streamName || activeCategory }] : [{ label: 'Exams' }])];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Mock Tests & Practice Sets | GridAcademy',
        description: 'Browse free & paid mock tests for SSC, Banking, Railway, NEET, UPSC, CUET and more on GridAcademy.',
        url: 'https://www.gridacademy.in/exams',
        provider: { '@type': 'Organization', name: 'GridAcademy', url: 'https://www.gridacademy.in' },
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      }) }} />

      <div className="bg-white text-ink">
        <PageIntro
          crumbs={crumbs}
          eyebrow={isFiltered ? undefined : 'Mock tests on the real exam interface'}
          title={title}
          description={isFiltered
            ? `${filtered.length} exam${filtered.length === 1 ? '' : 's'} found`
            : 'Full-length mock tests for JEE, NEET, CUET and government exams. Start free, and get a solution for every question the moment you submit.'}
          aside={
            <form method="get" action="/exams" role="search" className="relative w-full lg:w-[340px]">
              {activeCategory && <input type="hidden" name="category" value={activeCategory} />}
              {activeStream && <input type="hidden" name="stream" value={activeStream} />}
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#667085] pointer-events-none" />
              <input name="q" type="search" defaultValue={rawQuery} placeholder="Search exams, e.g. SSC CGL" aria-label="Search exams"
                className="w-full h-12 pl-10 pr-24 rounded-lg border border-[#d0d5dd] bg-white text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 px-3.5 rounded-[7px] bg-primary text-white text-sm font-semibold hover:bg-primary-dark">
                Search
              </button>
            </form>
          }
        />

        <div className="max-w-[1328px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 flex flex-col gap-5 md:gap-6">
          {/* Stream tabs */}
          <div className="flex gap-1 border-b border-line overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0" role="tablist" aria-label="Streams">
            {[{ key: undefined, name: 'All' }, ...STREAMS].map(s => {
              const on = s.key === activeStream;
              return (
                <Link key={s.name} href={buildHref({ q: rawQuery, category: activeCategory, stream: s.key })} role="tab" aria-selected={on}
                  className={`h-11 flex items-center px-4 text-[14.5px] font-semibold whitespace-nowrap border-b-[3px] transition-colors ${
                    on ? 'text-primary-dark border-primary' : 'text-[#475467] border-transparent hover:text-ink'
                  }`}>
                  {s.name}
                </Link>
              );
            })}
          </div>

          {activeCategory && (
            <Link href={buildHref({ q: rawQuery, stream: activeStream })}
              className="self-start h-8 inline-flex items-center gap-1.5 pl-3 pr-2 rounded-full bg-ink text-white text-[13px] font-medium">
              {activeCategory} <X className="w-3.5 h-3.5" aria-label="Remove filter" />
            </Link>
          )}

          {filtered.length > 0 ? (
            isFiltered ? <ExamList exams={filtered} /> : (
              <div className="flex flex-col gap-8 md:gap-10">
                {groups.map(g => (
                  <section key={g.key} className="flex flex-col gap-3">
                    <div className="flex items-baseline justify-between gap-3">
                      <h2 className="text-lg md:text-xl font-semibold">{g.name}</h2>
                      <Link href={buildHref({ stream: g.key })} className="text-sm font-semibold text-primary-dark hover:underline whitespace-nowrap">Only {g.name}</Link>
                    </div>
                    <ExamList exams={g.exams} />
                  </section>
                ))}
              </div>
            )
          ) : (
            <div className="rounded-xl border border-dashed border-[#d0d5dd] px-6 py-12 text-center flex flex-col items-center gap-3">
              <p className="text-lg font-semibold">No exams found</p>
              <p className="text-[15px] text-[#475467] max-w-md">
                {rawQuery ? `Nothing matches “${rawQuery}” yet. Try another name, like SSC CGL or NEET.` : 'Tests for this selection are being added.'}
              </p>
              <Link href="/exams" className="h-11 inline-flex items-center gap-1.5 px-5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark mt-1">
                See all exams <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {!isFiltered && (
          <>
            <section className="bg-paper border-y border-line">
              <div className="max-w-[1328px] mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-14 grid lg:grid-cols-[1fr_1.3fr] gap-8 lg:gap-16">
                <div className="flex flex-col gap-3">
                  <p className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-primary-dark">Coverage</p>
                  <h2 className="text-2xl md:text-[30px] font-bold tracking-[-0.015em] leading-tight">Exams we cover</h2>
                  <p className="text-[15px] md:text-base leading-relaxed text-[#475467]">
                    Every test follows the latest exam pattern, marking scheme and time limit. New exams are added after each official notification.
                  </p>
                </div>
                <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                  {COVERAGE.map(item => (
                    <div key={item.cat} className="border-t border-line pt-3">
                      <dt className="font-semibold text-[15px]">{item.cat}</dt>
                      <dd className="text-sm text-[#475467] mt-1 leading-relaxed">{item.items}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>

            <section className="max-w-[880px] mx-auto px-4 md:px-6 py-10 md:py-14">
              <h2 className="text-xl md:text-[28px] font-bold mb-4">Frequently asked questions</h2>
              <div className="bg-white border border-line rounded-xl divide-y divide-line">
                {FAQS.map(f => (
                  <details key={f.q} className="group px-5">
                    <summary className="min-h-[56px] flex items-center justify-between gap-3 font-semibold text-[15px] cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <ChevronRight className="w-4 h-4 text-[#667085] shrink-0 transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="pb-4 text-[15px] leading-relaxed text-[#475467]">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}
