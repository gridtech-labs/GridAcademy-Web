export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mock Tests & Practice Sets for SSC, Banking, Railway, NEET 2026 | GridAcademy',
  description: 'Practice 10,000+ free & paid mock tests for SSC CGL, IBPS PO, RRB NTPC, NEET, UPSC, CUET 2026. Instant results, all-India rank & detailed analytics. Start free today.',
  keywords: 'mock test, free mock test, SSC CGL mock test, IBPS PO mock test, NEET mock test 2026, RRB NTPC mock test, UPSC mock test, CUET mock test 2026, online test series, practice test',
  alternates: { canonical: 'https://www.gridacademy.in/exams' },
  openGraph: {
    title: 'Free Mock Tests for All Government & Entrance Exams | GridAcademy',
    description: 'India\'s fastest-growing exam prep platform. 10,000+ mock tests, instant AI analysis, all-India rank. Free to start.',
    url: 'https://www.gridacademy.in/exams',
    type: 'website',
    images: [{ url: 'https://www.gridacademy.in/og-image.jpg', width: 1200, height: 630 }],
  },
};

import { api } from '@/lib/api-client';
import Link from 'next/link';
import Image from 'next/image';
import { ExamCard, ExamTypeFilter } from '@/types/exam';
import {
  FileText, Zap, Home, BookOpen, Trophy, BarChart2,
  ChevronRight, Search, Star, Users, TrendingUp, Shield,
} from 'lucide-react';

// ── Data fetching ─────────────────────────────────────────────────────────────
async function getAllExams(): Promise<ExamCard[]> {
  try {
    const res = await api.get<ExamCard[]>('/api/exam-pages');
    return Array.isArray(res) ? res : (res as any)?.data ?? [];
  } catch { return []; }
}

async function getExamTypes(): Promise<ExamTypeFilter[]> {
  try {
    const res = await api.get<ExamTypeFilter[]>('/api/exam-pages/exam-types');
    return Array.isArray(res) ? res : (res as any)?.data ?? [];
  } catch { return []; }
}

function stripHtml(html: string | null): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function formatPrice(p: number) {
  return p === 0 ? 'FREE' : `₹${p.toLocaleString('en-IN')}`;
}

function categoryIcon(name: string | null) {
  if (!name) return '📝';
  const n = name.toLowerCase();
  if (n.includes('railway') || n.includes('rrb')) return '🚂';
  if (n.includes('upsc') || n.includes('ias')) return '🏛️';
  if (n.includes('bank')) return '🏦';
  if (n.includes('ssc')) return '👮';
  if (n.includes('gate')) return '🔬';
  if (n.includes('defence') || n.includes('nda') || n.includes('cds')) return '📐';
  if (n.includes('police')) return '🚔';
  if (n.includes('teach') || n.includes('tet') || n.includes('ctet')) return '📚';
  if (n.includes('state') || n.includes('psc')) return '🗺️';
  if (n.includes('cuet')) return '🎓';
  if (n.includes('jee') || n.includes('neet')) return '⚗️';
  if (n.includes('mat') || n.includes('cat') || n.includes('mba')) return '💼';
  return '📝';
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function LeftSidebar({ examTypes, active, counts }: {
  examTypes: ExamTypeFilter[];
  active: string;
  counts: Record<string, number>;
}) {
  return (
    <aside className="hidden md:flex flex-col bg-white border-r border-gray-100 overflow-y-auto shadow-sm shrink-0"
      style={{ width: 260, position: 'sticky', top: 56, height: 'calc(100vh - 56px)' }}>

      {/* Main nav */}
      <div className="p-3 pt-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Main Menu</p>
        <Link href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-[#1760f4] transition-all">
          <Home className="w-4 h-4" /> Home
        </Link>
        <Link href="/exams"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#1760f4] to-[#1250d0] shadow-sm shadow-blue-200 mb-0.5">
          <BookOpen className="w-4 h-4" /> All Exams
        </Link>
        <Link href="/tests"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-[#1760f4] transition-all">
          <FileText className="w-4 h-4 shrink-0" />
          <span>Free Tests</span>
          <span className="ml-auto bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">Free</span>
        </Link>
        <Link href="/leaderboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-[#1760f4] transition-all">
          <Trophy className="w-4 h-4" /> Leaderboard
        </Link>
        <Link href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-[#1760f4] transition-all">
          <BarChart2 className="w-4 h-4" /> My Progress
        </Link>
        <Link href="/career-guide"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-[#1760f4] transition-all">
          <span className="text-base leading-none">🧭</span>
          <span>Career Guide</span>
          <span className="ml-auto bg-violet-100 text-violet-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-violet-200">New</span>
        </Link>
      </div>

      {/* Exam categories */}
      <div className="px-3 pb-3 flex-1 overflow-y-auto">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2 mt-3">Exam Categories</p>

        <Link href="/exams"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
            ${ active === '' ? 'bg-blue-50 text-[#1760f4] font-semibold' : 'text-gray-600 hover:bg-blue-50 hover:text-[#1760f4]' }`}>
          <span className="text-base leading-none">📋</span>
          <span>All Exams</span>
        </Link>

        {examTypes.map(et => {
          const isActive = et.name === active;
          return (
            <Link key={et.id}
              href={`/exams?category=${encodeURIComponent(et.name)}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive ? 'bg-blue-50 text-[#1760f4] font-semibold' : 'text-gray-600 hover:bg-blue-50 hover:text-[#1760f4]'}`}>
              <span className="text-base leading-none">{categoryIcon(et.name)}</span>
              <span className="flex-1 truncate">{et.name}</span>
              {counts[et.name] ? (
                <span className="ml-auto text-[11px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">{counts[et.name]}</span>
              ) : null}
            </Link>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-auto p-3">
        <div className="rounded-2xl p-4 bg-gradient-to-br from-[#1760f4] to-[#0a3ba8] text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <p className="font-bold mb-1 text-sm relative z-10">Are you an educator?</p>
          <p className="text-blue-200 text-xs mb-3 relative z-10">Upload tests &amp; reach lakhs of students.</p>
          <Link href="/provider/register"
            className="block text-center bg-white text-[#1760f4] font-bold text-xs py-2 rounded-xl hover:bg-blue-50 transition-colors relative z-10 shadow-sm">
            Become a Provider
          </Link>
        </div>
      </div>
    </aside>
  );
}

// ── Exam Card ─────────────────────────────────────────────────────────────────
function ExamCardItem({ exam }: { exam: ExamCard }) {
  const hasFree = exam.priceInr === 0;
  return (
    <Link href={`/exam/${exam.slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-200
        border border-gray-100 shadow-sm hover:shadow-md hover:border-[#1760f4]/30 hover:-translate-y-0.5">

      <div className="relative h-32 bg-gradient-to-br from-[#1760f4] to-[#0a3ba8] overflow-hidden shrink-0">
        {exam.thumbnailUrl ? (
          <Image src={exam.thumbnailUrl} alt={exam.title} fill
            className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <span className="text-5xl opacity-80">{categoryIcon(exam.examTypeName)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-2 left-2 flex gap-1.5">
          {exam.examLevelName && (
            <span className="bg-white/90 backdrop-blur-sm text-[#1760f4] text-[10px] font-bold px-2 py-0.5 rounded-full">
              {exam.examLevelName}
            </span>
          )}
          {hasFree && (
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              FREE
            </span>
          )}
        </div>
        {exam.isFeatured && (
          <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5 fill-yellow-900" /> Hot
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <p className="text-[10px] text-[#1760f4] font-semibold uppercase tracking-wide truncate">
          {exam.conductingBody ?? exam.examTypeName ?? 'Government Exam'}
        </p>
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mt-0.5 leading-snug group-hover:text-[#1760f4] transition-colors">
          {exam.title}
        </h3>
        {exam.shortDescription && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-1 leading-relaxed">{stripHtml(exam.shortDescription)}</p>
        )}
        <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 mt-auto">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <FileText className="w-3 h-3 text-gray-300" />
            {(exam.testCount ?? 0) > 0 ? `${exam.testCount} Tests` : 'Tests'}
          </span>
          <span className={`text-sm font-bold ${hasFree ? 'text-emerald-600' : 'text-gray-900'}`}>
            {hasFree
              ? <span className="flex items-center gap-0.5"><Zap className="w-3 h-3" />Free</span>
              : formatPrice(exam.priceInr)
            }
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── FAQ for SEO ───────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'Are the mock tests on GridAcademy free?',
    a: 'Yes. GridAcademy offers hundreds of completely free mock tests for SSC CGL, IBPS PO, RRB NTPC, NEET 2026, CUET, and more. No credit card or registration is required to start a free test.',
  },
  {
    q: 'How are GridAcademy mock tests different from other platforms?',
    a: 'GridAcademy uses AI-powered analysis to give you subject-wise accuracy, time-per-question breakdown, and a live All-India Rank after every test — instantly. Most platforms make you wait hours for results.',
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
    q: 'How does the All-India Rank work?',
    a: 'After you submit a test, your score is compared with all other students who have attempted the same test on GridAcademy. Your rank, percentile, and accuracy are calculated instantly and displayed on your result dashboard.',
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function ExamsPage({
  searchParams,
}: {
  searchParams?: { category?: string; q?: string };
}) {
  const [allExams, examTypes] = await Promise.all([getAllExams(), getExamTypes()]);

  const activeCategory = searchParams?.category ?? '';
  const searchQuery    = (searchParams?.q ?? '').toLowerCase();

  let filtered = activeCategory
    ? allExams.filter(e => e.examTypeName === activeCategory)
    : allExams;

  if (searchQuery) {
    filtered = filtered.filter(e =>
      e.title.toLowerCase().includes(searchQuery) ||
      (e.conductingBody ?? '').toLowerCase().includes(searchQuery) ||
      (e.examTypeName ?? '').toLowerCase().includes(searchQuery)
    );
  }

  const counts: Record<string, number> = {};
  allExams.forEach(e => {
    if (e.examTypeName) counts[e.examTypeName] = (counts[e.examTypeName] ?? 0) + 1;
  });

  const totalFree = allExams.filter(e => e.priceInr === 0).length;
  const categoryLabel = activeCategory || 'All Exams';
  const isFiltered = !!activeCategory || !!searchQuery;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Mock Tests & Practice Sets | GridAcademy',
    description: 'Browse 10,000+ free & paid mock tests for SSC, Banking, Railway, NEET, UPSC, CUET and more on GridAcademy.',
    url: 'https://www.gridacademy.in/exams',
    provider: { '@type': 'Organization', name: 'GridAcademy', url: 'https://www.gridacademy.in' },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="flex bg-gray-50 min-h-screen">
        <LeftSidebar examTypes={examTypes} active={activeCategory} counts={counts} />

        <main className="flex-1 min-w-0 pb-24 md:pb-8">

          {/* ── Hero Banner ───────────────────────────────────────── */}
          {!isFiltered && (
            <div className="bg-gradient-to-br from-[#1760f4] via-[#1250d0] to-[#0a3ba8] relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/5 rounded-full" />
              <div className="absolute bottom-0 left-1/3 w-56 h-56 bg-white/5 rounded-full translate-y-1/2" />
              <div className="absolute top-4 right-1/4 w-32 h-32 bg-white/5 rounded-full" />

              <div className="relative z-10 px-4 md:px-6 lg:px-8 py-8 md:py-10">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-xs text-blue-200 mb-5">
                  <Link href="/" className="hover:text-white transition-colors">Home</Link>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-white font-medium">All Exams</span>
                </nav>

                <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                  {/* Left: headline + stats */}
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-3">
                      Free Mock Tests for Every<br className="hidden sm:block" /> Government &amp; Entrance Exam
                    </h1>
                    <p className="text-blue-100 text-sm md:text-base leading-relaxed mb-6 opacity-90 max-w-xl">
                      Practice with India&apos;s most accurate mock tests — updated for 2025–26 exam patterns.
                      Get instant AI analysis, All-India Rank, and detailed subject-wise feedback after every test.
                    </p>

                    {/* Stats row */}
                    <div className="flex flex-wrap gap-4 md:gap-6">
                      {[
                        { icon: FileText,   val: `${allExams.length}+`, label: 'Exam Series' },
                        { icon: Zap,        val: `${totalFree}+`,       label: 'Free Tests'  },
                        { icon: Users,      val: '10K+',                label: 'Students'    },
                        { icon: TrendingUp, val: 'Instant',             label: 'AI Results'  },
                      ].map(s => (
                        <div key={s.label} className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
                            <s.icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-extrabold text-sm leading-none">{s.val}</p>
                            <p className="text-blue-200 text-[10px] font-medium mt-0.5">{s.label}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Popular exams quick-links (from real data) */}
                  {(() => {
                    const popular = [
                      ...allExams.filter(e => e.isFeatured),
                      ...allExams.filter(e => !e.isFeatured),
                    ].slice(0, 5);
                    if (popular.length === 0) return null;
                    return (
                      <div className="hidden lg:block shrink-0 w-72">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                          <p className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                            Popular Exam Series
                          </p>
                          <div className="space-y-2">
                            {popular.map(exam => (
                              <Link key={exam.id} href={`/exam/${exam.slug}`}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors group">
                                <span className="text-base leading-none shrink-0">{categoryIcon(exam.examTypeName)}</span>
                                <span className="text-white text-xs font-semibold flex-1 truncate group-hover:text-blue-100">{exam.title}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-blue-300 group-hover:text-white transition-colors shrink-0" />
                              </Link>
                            ))}
                          </div>
                          <Link href="/exams"
                            className="mt-3 flex items-center justify-center gap-1 text-blue-200 hover:text-white text-xs font-medium transition-colors">
                            View all exams <ChevronRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          <div className="px-4 md:px-6 lg:px-8 py-5">

            {/* Breadcrumb (filtered state) */}
            {isFiltered && (
              <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                <Link href="/" className="hover:text-[#1760f4] transition-colors">Home</Link>
                <ChevronRight className="w-3 h-3 text-gray-300" />
                <Link href="/exams" className="hover:text-[#1760f4] transition-colors">All Exams</Link>
                {activeCategory && (
                  <>
                    <ChevronRight className="w-3 h-3 text-gray-300" />
                    <span className="text-gray-900 font-semibold">{activeCategory}</span>
                  </>
                )}
              </nav>
            )}

            {/* Category filter pills */}
            <div className="overflow-x-auto scrollbar-hide mb-5 -mx-4 px-4 md:-mx-0 md:px-0">
              <div className="flex items-center gap-2 min-w-max">
                <Link href="/exams"
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors
                    ${ activeCategory === ''
                      ? 'bg-[#1760f4] text-white border-[#1760f4]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#1760f4] hover:text-[#1760f4]'
                    }`}>
                  All Exams
                </Link>
                {examTypes.map(et => {
                  const isActive = et.name === activeCategory;
                  return (
                    <Link key={et.id}
                      href={`/exams?category=${encodeURIComponent(et.name)}`}
                      className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors
                        ${isActive
                          ? 'bg-[#1760f4] text-white border-[#1760f4]'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-[#1760f4] hover:text-[#1760f4]'
                        }`}>
                      {categoryIcon(et.name)} {et.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Heading + Search */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                  <div className="w-1 h-5 rounded-full bg-[#1760f4]" />
                  {categoryLabel}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5 ml-3">
                  {filtered.length} exam series available
                </p>
              </div>
              <form method="get" action="/exams" className="relative hidden sm:block">
                {activeCategory && <input type="hidden" name="category" value={activeCategory} />}
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <input name="q" type="text" defaultValue={searchQuery} placeholder="Search exams…"
                  className="pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-full shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-[#1760f4]/30 focus:border-[#1760f4] w-52" />
              </form>
            </div>

            {/* Exam grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {filtered.map(e => <ExamCardItem key={e.id} exam={e} />)}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <BookOpen className="w-14 h-14 text-gray-200 mx-auto mb-4" />
                <h2 className="text-lg font-bold text-gray-700">No Exams Found</h2>
                <p className="text-gray-400 mt-2 text-sm max-w-sm mx-auto">
                  {searchQuery
                    ? `No results for "${searchQuery}". Try a different keyword.`
                    : `No ${activeCategory} exams published yet. Check back soon!`}
                </p>
                <Link href="/exams"
                  className="mt-5 inline-block bg-[#1760f4] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#0e4dd4] transition-colors">
                  View All Exams
                </Link>
              </div>
            )}

            {/* ── SEO Content Section ────────────────────────────── */}
            {!isFiltered && (
              <>
                {/* Why GridAcademy */}
                <section className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-[#1760f4] to-[#0a3ba8]" />
                  <div className="p-6 md:p-8">
                    <h2 className="text-lg font-extrabold text-gray-900 mb-2">
                      India&apos;s Smartest Mock Test Platform for 2025–26
                    </h2>
                    <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-3xl">
                      GridAcademy offers free and premium mock tests for every major government and entrance exam — SSC CGL, IBPS PO,
                      RRB NTPC, NEET 2026, CUET UG, UPSC, State PSCs, and more. Unlike traditional test platforms, GridAcademy uses
                      AI-powered analytics to instantly show your accuracy, speed, and topic-wise weak areas, so you can fix gaps
                      before exam day. Every test follows the latest 2025–26 exam pattern, marking scheme, and time limit.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { icon: Zap,        title: 'Instant AI Results',     desc: 'Get your score, rank & analysis in seconds — not hours.' },
                        { icon: Shield,     title: 'Latest 2026 Pattern',    desc: 'Every test updated after each new official notification.' },
                        { icon: TrendingUp, title: 'All-India Rank',         desc: 'See where you stand among lakhs of aspirants nationwide.' },
                        { icon: Users,      title: '10K+ Students',          desc: 'Join India\'s fastest-growing exam prep community.' },
                      ].map(f => (
                        <div key={f.title} className="bg-blue-50/60 rounded-xl p-4">
                          <div className="w-9 h-9 bg-[#1760f4]/10 rounded-xl flex items-center justify-center mb-3">
                            <f.icon className="w-4.5 h-4.5 text-[#1760f4]" />
                          </div>
                          <p className="text-sm font-bold text-gray-900 mb-1">{f.title}</p>
                          <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Exam category overview */}
                <section className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                  <h2 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-1 h-5 rounded-full bg-[#1760f4]" />
                    Exams We Cover
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-sm text-gray-700">
                    {[
                      { cat: 'SSC Exams', items: 'SSC CGL, CHSL, MTS, CPO, Stenographer, JE' },
                      { cat: 'Banking',   items: 'IBPS PO, IBPS Clerk, SBI PO, SBI Clerk, RBI Grade B' },
                      { cat: 'Railway',   items: 'RRB NTPC, ALP, Group D, JE, RPF Constable' },
                      { cat: 'NEET / Medical', items: 'NEET UG 2026, AIIMS, JIPMER, State Medical Entrance' },
                      { cat: 'CUET',      items: 'CUET UG 2026, CUET PG, Domain Subjects, General Test' },
                      { cat: 'UPSC',      items: 'IAS Prelims, CAPF, CDS, NDA, EPFO EO/AO' },
                      { cat: 'State PSCs', items: 'BPSC, UPPSC, MPSC, RPSC, TNPSC, WBPSC' },
                      { cat: 'Teaching',  items: 'CTET, DSSSB TGT/PGT, KVS, NVS, HTET, UPTET' },
                      { cat: 'Defence',   items: 'NDA, CDS, AFCAT, Agniveer, Indian Coast Guard' },
                    ].map(item => (
                      <div key={item.cat} className="flex gap-2">
                        <span className="text-[#1760f4] font-bold shrink-0 mt-0.5">›</span>
                        <div>
                          <span className="font-semibold text-gray-900">{item.cat}:</span>{' '}
                          <span className="text-gray-500">{item.items}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* FAQ */}
                <section className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-[#1760f4] to-[#0a3ba8]" />
                  <div className="p-6 md:p-8">
                    <h2 className="text-lg font-extrabold text-gray-900 mb-5 flex items-center gap-2">
                      <div className="w-1 h-5 rounded-full bg-[#1760f4]" />
                      Frequently Asked Questions
                    </h2>
                    <div className="space-y-5">
                      {FAQS.map((faq, i) => (
                        <div key={i} className="border-b border-gray-100 last:border-0 pb-5 last:pb-0">
                          <h3 className="text-sm font-bold text-gray-900 mb-1.5">{faq.q}</h3>
                          <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 grid grid-cols-4"
          style={{ height: 60 }}>
          {[
            { href: '/',          icon: Home,      label: 'Home'    },
            { href: '/exams',     icon: Search,    label: 'Exams', active: true },
            { href: '/tests',     icon: FileText,  label: 'Tests'   },
            { href: '/dashboard', icon: BookOpen,  label: 'Profile' },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 text-xs font-medium
                ${item.active ? 'text-[#1760f4]' : 'text-gray-500 hover:text-[#1760f4]'}`}>
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
