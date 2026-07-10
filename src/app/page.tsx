export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { api } from '@/lib/api-client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { ExamCard, ExamTypeFilter } from '@/types/exam';
import {
  FileText, Star, ChevronRight, Zap,
  Home, BookOpen, Trophy, BarChart2, Search, Clock, Tag
} from 'lucide-react';
import { getAllPosts } from '@/lib/blog-posts';

// ── Types ─────────────────────────────────────────────────────────────────────
interface ExamLevel { id: number; name: string; examCount: number; }

// ── Data fetching ─────────────────────────────────────────────────────────────
async function getHomeData(): Promise<{ exams: ExamCard[]; levels: ExamLevel[]; examTypes: ExamTypeFilter[] }> {
  try {
    const [exams, levels, examTypes] = await Promise.all([
      api.get<ExamCard[]>('/api/exam-pages?activeOnly=true').catch(() => [] as ExamCard[]),
      api.get<any>('/api/exam-pages/levels').catch(() => [] as ExamLevel[]),
      api.get<ExamTypeFilter[]>('/api/exam-pages/exam-types').catch(() => [] as ExamTypeFilter[]),
    ]);
    return {
      exams:     Array.isArray(exams)      ? exams      : (exams as any)?.data      ?? [],
      levels:    Array.isArray(levels)     ? levels     : (levels as any)?.data     ?? [],
      examTypes: Array.isArray(examTypes)  ? examTypes  : (examTypes as any)?.data  ?? [],
    };
  } catch {
    return { exams: [], levels: [], examTypes: [] };
  }
}

function stripHtml(html: string | null): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function formatPrice(price: number): string {
  if (price === 0) return 'FREE';
  return `₹${price.toLocaleString('en-IN')}`;
}

function examTypeIcon(name: string | null): string {
  if (!name) return '📝';
  const map: Record<string, string> = {
    'Railway':   '🚂',
    'UPSC':      '🏛️',
    'Banking':   '🏦',
    'SSC':       '👮',
    'GATE':      '🔬',
    'Defence':   '📐',
    'CUET':      '📚',
    'JEE':       '🧪',
    'NEET':      '🩺',
    'State PSC': '🏢',
    'Teaching':  '🎓',
    'Police':    '🚔',
    'Central':   '🏛️',
  };
  return map[name] ?? '📝';
}

// ── Sidebar (tablet+) ─────────────────────────────────────────────────────────
function LeftSidebar({ exams, examTypes }: { exams: ExamCard[]; examTypes: ExamTypeFilter[] }) {
  const typeCounts: Record<string, number> = {};
  exams.forEach(e => {
    if (e.examTypeName) typeCounts[e.examTypeName] = (typeCounts[e.examTypeName] ?? 0) + 1;
  });

  return (
    <aside className="hidden md:flex flex-col bg-white border-r border-gray-200 overflow-y-auto"
      style={{ width: 260, position: 'sticky', top: 56, height: 'calc(100vh - 56px)' }}>

      {/* Main nav */}
      <div className="p-3">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 mb-1">Main Menu</p>
        <Link href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#1760f4] bg-blue-50">
          <Home className="w-4 h-4" /> Home
        </Link>
        <Link href="/exams"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
          <BookOpen className="w-4 h-4" /> All Exams
        </Link>
        <Link href="/tests"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
          <FileText className="w-4 h-4 shrink-0" />
          <span>Free Tests</span>
          <span className="ml-auto bg-green-100 text-green-700 text-xs font-bold px-1.5 py-0.5 rounded-full">Free</span>
        </Link>
        <Link href="/leaderboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
          <Trophy className="w-4 h-4" /> Leaderboard
        </Link>
        <Link href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
          <BarChart2 className="w-4 h-4" /> My Progress
        </Link>
        <Link href="/career-guide"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
          <span className="text-base leading-none">🧭</span>
          <span>Career Guide</span>
          <span className="ml-auto bg-violet-100 text-violet-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">New</span>
        </Link>
      </div>

      {/* Exam type nav */}
      <div className="px-3 pb-3">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 mb-1 mt-2">Exam Categories</p>
        {examTypes.map(t => (
          <Link key={t.id} href={`/?category=${encodeURIComponent(t.name)}`}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            <span className="text-base leading-none">{examTypeIcon(t.name)}</span>
            <span>{t.name}</span>
            {typeCounts[t.name] ? (
              <span className="ml-auto text-xs text-gray-400">{typeCounts[t.name]}</span>
            ) : null}
          </Link>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-auto p-3">
        <div className="rounded-xl p-4 bg-[#1760f4] text-white text-sm">
          <p className="font-bold mb-1">Are you an educator?</p>
          <p className="text-blue-100 text-xs mb-3">Upload tests &amp; reach lakhs of students.</p>
          <Link href="/provider/register"
            className="block text-center bg-white text-[#1760f4] font-bold text-xs py-2 rounded-lg hover:bg-blue-50 transition-colors">
            Become a Provider
          </Link>
        </div>
      </div>
    </aside>
  );
}

// ── Right Panel (desktop only) ────────────────────────────────────────────────
function RightPanel({ exams }: { exams: ExamCard[] }) {
  const total    = exams.length;
  const free     = exams.filter(e => e.priceInr === 0).length;
  const tests    = exams.reduce((s, e) => s + e.testCount, 0);
  const featured = exams.filter(e => e.isFeatured).length;

  return (
    <aside className="hidden lg:flex flex-col gap-4 py-7 pr-6"
      style={{ width: 300, position: 'sticky', top: 64, maxHeight: 'calc(100vh - 64px)', overflowY: 'auto' }}>

      {/* Platform Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Platform Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '📝', num: total,    label: 'Total Exams' },
            { icon: '🆓', num: free,     label: 'Free Exams' },
            { icon: '📋', num: tests,    label: 'Mock Tests' },
            { icon: '⭐', num: featured, label: 'Featured' },
          ].map(s => (
            <div key={s.label} className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
              <span className="text-xl leading-none">{s.icon}</span>
              <div>
                <p className="text-base font-extrabold text-gray-900 leading-none">{s.num}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Top Performers</h3>
        {[
          { rank: 1, name: 'Aakash Singh', score: '96/100', cls: 'bg-yellow-100 text-yellow-800' },
          { rank: 2, name: 'Priya Kumari', score: '94/100', cls: 'bg-gray-100 text-gray-700' },
          { rank: 3, name: 'Ravi Shankar', score: '91/100', cls: 'bg-gray-100 text-gray-600' },
          { rank: 4, name: 'Sunita Devi',  score: '89/100', cls: 'bg-gray-50 text-gray-500' },
          { rank: 5, name: 'Manoj Yadav',  score: '87/100', cls: 'bg-gray-50 text-gray-500' },
        ].map(p => (
          <div key={p.rank} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shrink-0 ${p.cls}`}>
              {p.rank}
            </span>
            <span className="text-sm font-medium text-gray-800 flex-1 truncate">{p.name}</span>
            <span className="text-sm font-bold text-[#1760f4]">{p.score}</span>
          </div>
        ))}
      </div>

      {/* Upcoming Deadlines */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Upcoming Deadlines</h3>
        {[
          { day: '30', mon: 'Apr', title: 'RRB ALP Application', sub: 'Last date to apply' },
          { day: '25', mon: 'May', title: 'UPSC Prelims 2026',   sub: 'Hall ticket from May 10' },
          { day: '10', mon: 'Jun', title: 'RRB ALP CBT 1',       sub: 'Admit card 7 days prior' },
        ].map(d => (
          <div key={d.title} className="flex gap-3 py-2.5 border-b border-gray-100 last:border-0">
            <div className="shrink-0 rounded-lg px-2.5 py-2 text-center bg-[#1760f4] text-white" style={{ minWidth: 44 }}>
              <span className="block text-lg font-extrabold leading-none">{d.day}</span>
              <span className="text-xs font-semibold">{d.mon}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 leading-snug">{d.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{d.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Provider CTA */}
      <div className="rounded-xl p-5 bg-[#1760f4] text-white">
        <h3 className="text-sm font-bold mb-1">Are you a coaching institute?</h3>
        <p className="text-blue-100 text-xs mb-3">Upload question banks, create mock tests &amp; reach lakhs of students.</p>
        <Link href="/provider/register"
          className="block text-center bg-white text-[#1760f4] font-bold text-sm py-2 rounded-lg hover:bg-blue-50 transition-colors">
          Become a Provider
        </Link>
      </div>
    </aside>
  );
}

// ── Card colour palette (cycles across cards) ────────────────────────────────
const CARD_PALETTES = [
  { bg: 'bg-orange-50',  topBorder: 'border-t-orange-400',  badgeBg: 'bg-orange-100',  badgeText: 'text-orange-700'  },
  { bg: 'bg-amber-50',   topBorder: 'border-t-amber-400',   badgeBg: 'bg-amber-100',   badgeText: 'text-amber-700'   },
  { bg: 'bg-yellow-50',  topBorder: 'border-t-yellow-400',  badgeBg: 'bg-yellow-100',  badgeText: 'text-yellow-700'  },
  { bg: 'bg-lime-50',    topBorder: 'border-t-lime-500',    badgeBg: 'bg-lime-100',    badgeText: 'text-lime-700'    },
  { bg: 'bg-teal-50',    topBorder: 'border-t-teal-500',    badgeBg: 'bg-teal-100',    badgeText: 'text-teal-700'    },
  { bg: 'bg-sky-50',     topBorder: 'border-t-sky-500',     badgeBg: 'bg-sky-100',     badgeText: 'text-sky-700'     },
  { bg: 'bg-indigo-50',  topBorder: 'border-t-indigo-400',  badgeBg: 'bg-indigo-100',  badgeText: 'text-indigo-700'  },
  { bg: 'bg-rose-50',    topBorder: 'border-t-rose-400',    badgeBg: 'bg-rose-100',    badgeText: 'text-rose-700'    },
];

// ── Exam Card ─────────────────────────────────────────────────────────────────
function ExamCardItem({ exam, index }: { exam: ExamCard; index: number }) {
  const p = CARD_PALETTES[index % CARD_PALETTES.length];
  return (
    <Link href={`/exam/${exam.slug}`}
      className={`group flex flex-col rounded-xl border border-gray-200 border-t-4 ${p.topBorder} ${p.bg}
        hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden`}>

      <div className="p-4 flex flex-col gap-3 flex-1">

        {/* Row 1: level badge + featured star */}
        <div className="flex items-center justify-between gap-2 min-h-[26px]">
          {exam.examLevelName ? (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border border-current/10 ${p.badgeBg} ${p.badgeText}`}>
              {exam.examLevelName}
            </span>
          ) : <span />}
          {exam.isFeatured && (
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-400 shrink-0" />
          )}
        </div>

        {/* Row 2: title — allow up to 3 lines so long names fit */}
        <h2 className="text-[26px] font-bold text-gray-900 leading-snug line-clamp-3
          group-hover:text-orange-600 transition-colors flex-1">
          {exam.title}
        </h2>

        {/* Row 3: conducting body */}
        <p className="text-xs text-gray-500 truncate">
          {exam.conductingBody ?? exam.examTypeName ?? exam.category ?? 'Government Exam'}
        </p>

        {/* Row 4: tests count + free/price badge */}
        <div className="flex items-center justify-between pt-2 border-t border-black/[0.06]">
          <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
            <FileText className="w-3.5 h-3.5 shrink-0" />
            {exam.testCount} Test{exam.testCount !== 1 ? 's' : ''}
          </span>
          {exam.priceInr === 0 ? (
            <span className="flex items-center gap-1 text-xs font-bold text-green-700
              bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full">
              <Zap className="w-3 h-3" />Free
            </span>
          ) : (
            <span className="text-xs font-bold text-gray-800 bg-white border border-gray-200
              px-2.5 py-0.5 rounded-full">
              ₹{exam.priceInr.toLocaleString('en-IN')}
            </span>
          )}
        </div>

      </div>
    </Link>
  );
}

export const metadata: Metadata = {
  title: "GridAcademy — Free Mock Tests for SSC, Banking, Railway & UPSC",
  description:
    "Free mock tests for SSC CGL, IBPS PO, RRB NTPC, UPSC, CUET & NEET. Latest 2026 exam pattern, previous year papers, instant results and performance analysis.",

  alternates: {
    canonical: "https://www.gridacademy.in/",
  },

  openGraph: {
    title: "GridAcademy — Free Mock Tests for SSC, Banking, Railway & UPSC",
    description:
      "Free mock tests for SSC CGL, IBPS PO, RRB NTPC, UPSC, CUET & NEET. Latest 2026 exam pattern, previous year papers, instant results and performance analysis.",
    url: "https://www.gridacademy.in/",
    siteName: "GridAcademy",
    images: [
      {
        url: "https://www.gridacademy.in/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function HomePage({ searchParams }: { searchParams?: { category?: string } }) {
  const { exams, examTypes } = await getHomeData();
  const activeCategory = searchParams?.category ?? '';

  const tabExamTypes = examTypes.slice(0, 8);

  const filteredExams = activeCategory
    ? exams.filter(e => e.examTypeName === activeCategory)
    : exams;

  const featured = exams.filter(e => e.isFeatured);
  const latest   = filteredExams.slice(0, 16);

  return (
    <>
      <style>{`
        :root { --topbar-h: 56px; }
      `}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Are GridAcademy mock tests free?",
            acceptedAnswer: { "@type": "Answer", text: "Most mock tests on GridAcademy are completely free. Select premium test series with full solutions and in-depth analytics are available at a nominal fee (starting at ₹7), but every exam page includes at least one free test you can attempt without signing up." },
          },
          {
            "@type": "Question",
            name: "Do I need an account to take a test?",
            acceptedAnswer: { "@type": "Answer", text: "You can browse all exams and view test details without an account. To attempt a test and save your results and progress, you need to sign up — it is free and takes under a minute." },
          },
          {
            "@type": "Question",
            name: "How accurate is the exam pattern used in the mock tests?",
            acceptedAnswer: { "@type": "Answer", text: "All tests are updated to match the latest official exam pattern and syllabus. Our educators track official notifications from SSC, IBPS, RRB, NTA, and other conducting bodies, and update question sets promptly after any pattern change." },
          },
          {
            "@type": "Question",
            name: "Can I review my answers after finishing a test?",
            acceptedAnswer: { "@type": "Answer", text: "Yes. After every test you get an instant result screen with section-wise accuracy, time-per-question analysis, a full answer key, and detailed explanations for each question." },
          },
          {
            "@type": "Question",
            name: "Which exams are currently available on GridAcademy?",
            acceptedAnswer: { "@type": "Answer", text: "GridAcademy currently covers SSC (CGL, CHSL, MTS, GD Constable), Banking (IBPS PO, IBPS Clerk, SBI PO, SBI Clerk), Railway (RRB NTPC, Group D, ALP, RPF), UPSC Prelims, CUET UG, NEET, and various defence and state-level exams." },
          },
        ],
      })}} />

      <Header />

      <div className="flex bg-gray-50 min-h-screen">
        {/* Left Sidebar */}
        <LeftSidebar exams={exams} examTypes={tabExamTypes} />

        {/* Main content */}
        <main className="flex-1 min-w-0 px-4 md:px-6 lg:px-8 py-5 pb-20 md:pb-6">

          {/* ── Page H1 ── */}
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-4">
            Free Mock Tests for SSC, CUET, Railway, Banking &amp; UPSC Exams
          </h1>

          {/* ── Filter pills ── */}
          <div className="overflow-x-auto scrollbar-hide mb-5 -mx-4 px-4 md:-mx-6 md:px-6">
            <div className="flex items-center gap-2 min-w-max">
              <Link
                href="/"
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors
                  ${activeCategory === ''
                    ? 'bg-[#1760f4] text-white border-[#1760f4]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#1760f4] hover:text-[#1760f4]'
                  }`}>
                All Exams
              </Link>

              {tabExamTypes.map(t => {
                const isActive = t.name === activeCategory;
                return (
                  <Link key={t.id}
                    href={`/?category=${encodeURIComponent(t.name)}`}
                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors
                      ${isActive
                        ? 'bg-[#1760f4] text-white border-[#1760f4]'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-[#1760f4] hover:text-[#1760f4]'
                      }`}>
                    {examTypeIcon(t.name)} {t.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ── Hero banner ── */}
          {featured.length > 0 && (
            <Link href={`/exam/${featured[0].slug}`}
              className="block rounded-xl overflow-hidden mb-6 group border border-gray-200 bg-white hover:border-gray-300 transition-colors">
              <div className="relative p-6 md:p-8 border-l-4 border-l-[#1760f4]">
                <div className="max-w-lg">
                  <div className="inline-flex items-center gap-1.5 mb-3 text-xs font-bold px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1760f4]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1760f4] animate-pulse inline-block"></span>
                    Featured
                  </div>
                  <h2 className="text-gray-900 text-xl md:text-2xl font-extrabold leading-tight mb-2">
                    {featured[0].title}
                  </h2>
                  {featured[0].shortDescription && (
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {stripHtml(featured[0].shortDescription)}
                    </p>
                  )}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="bg-[#1760f4] text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-[#0e4dd4] transition-colors">
                      Start Preparation
                    </span>
                    <span className="text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      View Syllabus
                    </span>
                    <span className={`ml-auto text-sm font-bold ${featured[0].priceInr === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {formatPrice(featured[0].priceInr)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* ── Quick stats ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { icon: '📝', num: `${exams.length}+`, label: 'Exams' },
              { icon: '🆓', num: `${exams.filter(e => e.priceInr === 0).length}`, label: 'Free Exams' },
              { icon: '📋', num: `${exams.reduce((s, e) => s + e.testCount, 0)}+`, label: 'Mock Tests' },
              { icon: '🏆', num: '10K+', label: 'Students' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-3 flex items-center gap-3">
                <span className="text-2xl leading-none shrink-0">{s.icon}</span>
                <div>
                  <p className="text-xl font-extrabold text-gray-900 leading-none">{s.num}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Exam cards grid ── */}
          {latest.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-900">
                  {activeCategory ? `${activeCategory} Exams` : 'Explore Exams'}
                </h2>
                <Link href="/exams"
                  className="text-sm font-semibold text-[#1760f4] hover:text-[#0e4dd4] flex items-center gap-1">
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {latest.map((e, i) => <ExamCardItem key={e.id} exam={e} index={i} />)}
              </div>
            </section>
          )}

          {/* ── Career Guide Banner ── */}
          <div className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 p-5 md:p-6 mt-8 mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="text-4xl shrink-0 leading-none">🧭</div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-violet-200 mb-0.5">
                Free Career Guide
              </p>
              <h3 className="text-base md:text-lg font-extrabold text-white leading-snug">
                Not sure which career to choose? Explore 100 options.
              </h3>
              <p className="text-sm text-violet-100 mt-1">
                Discover paths across 8 personality types — Makers, Thinkers, Builders &amp; more. Most cost ₹0 to start.
              </p>
            </div>
            <div className="flex flex-row sm:flex-col gap-2 shrink-0">
              <Link href="/career-guide/quiz"
                className="inline-flex items-center justify-center gap-1.5 bg-white text-violet-700 font-bold text-sm px-4 py-2.5 rounded-lg hover:bg-violet-50 transition-colors whitespace-nowrap shadow-sm">
                🎯 Take the Quiz
              </Link>
              <Link href="/career-guide"
                className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap border border-white/20">
                Browse 100 Careers
              </Link>
            </div>
          </div>

          {/* ── Latest Blog Posts ── */}
          {(() => {
            const latestPosts = getAllPosts().slice(0, 5);
            const CAT_COLORS: Record<string, string> = {
              SSC: 'bg-blue-100 text-blue-700',
              CUET: 'bg-violet-100 text-violet-700',
              Railway: 'bg-green-100 text-green-700',
              NEET: 'bg-red-100 text-red-700',
              Banking: 'bg-amber-100 text-amber-700',
              UPSC: 'bg-slate-100 text-slate-700',
            };
            return (
              <section className="mt-8 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-gray-900">Latest from the Blog</h2>
                  <Link href="/blog" className="text-sm font-semibold text-[#1760f4] hover:text-[#0e4dd4] flex items-center gap-1">
                    View all <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="flex flex-col gap-3">
                  {latestPosts.map(post => {
                    const catCls = CAT_COLORS[post.category] ?? 'bg-orange-100 text-orange-700';
                    const date = new Date(post.publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
                    return (
                      <Link key={post.slug} href={`/blog/${post.slug}`}
                        className="group flex items-start gap-4 bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-sm transition-all duration-200 p-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${catCls}`}>
                              <Tag className="w-2.5 h-2.5" />{post.category}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] text-gray-400">
                              <Clock className="w-2.5 h-2.5" />{post.readingTimeMinutes} min
                            </span>
                            <span className="text-[11px] text-gray-400 ml-auto">{date}</span>
                          </div>
                          <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-orange-600 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-orange-400 transition-colors shrink-0 mt-1" />
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })()}

          {/* ── About + FAQ ── */}
          <section className="mt-10 space-y-8">

            {/* About GridAcademy */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 space-y-6">
              <h2 className="text-lg font-extrabold text-gray-900">About GridAcademy</h2>

              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <p>
                  GridAcademy is India&apos;s fast-growing mock test platform built for government exam aspirants.
                  Whether you are preparing for SSC CGL, IBPS PO, RRB NTPC, UPSC Prelims, CUET, NEET, or RPF Constable,
                  you will find full-length practice papers, previous year question sets, and topic-wise tests — all in one
                  place, mostly free. Every test on GridAcademy is created or curated by educators from reputed coaching
                  institutes across India, so the difficulty and pattern match what you will face on exam day.
                  Thousands of students use GridAcademy every month to benchmark their preparation, find weak spots, and
                  build the speed and accuracy needed to clear competitive exams.
                </p>

                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Exams we cover</h3>
                  <p>
                    GridAcademy covers all major national-level competitive exams. Under <strong>SSC</strong> you will find
                    mock tests for CGL, CHSL, MTS, and GD Constable. For <strong>Banking</strong> aspirants we have IBPS PO,
                    IBPS Clerk, SBI PO, SBI Clerk, and RBI Grade B practice sets. <strong>Railway</strong> preparation is
                    covered through RRB NTPC, RRB Group D, and RRB ALP. <strong>UPSC</strong> aspirants can practice with
                    Prelims GS Paper I and CSAT tests. We also cover <strong>CUET UG</strong> for university admissions,
                    <strong> NEET</strong> for medical entrance, and state-level exams including Delhi Police, RPF Constable,
                    and various State PSC exams. New exams are added within days of an official notification.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Why mock tests matter</h3>
                  <p>
                    Research on exam preparation consistently shows that active practice testing — not just passive reading —
                    is the most effective way to retain information and improve performance under timed conditions.
                    A full-length mock test simulates real exam conditions: time pressure, question variety, and the mental
                    stamina required to stay focused for 60–120 minutes straight. GridAcademy&apos;s tests include a detailed
                    post-attempt analysis that breaks down your accuracy by section, flags questions you answered incorrectly,
                    and compares your score against thousands of other students who took the same paper. This tells you exactly
                    where you are losing marks — so you can fix it before the actual exam, not after. Most tests are free,
                    so there is no barrier to starting your preparation today.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
              <h2 className="text-lg font-extrabold text-gray-900 mb-5">Frequently Asked Questions</h2>
              <dl className="divide-y divide-gray-100">
                {[
                  {
                    q: 'Are GridAcademy mock tests free?',
                    a: 'Most mock tests on GridAcademy are completely free. Select premium test series with full solutions and in-depth analytics are available at a nominal fee (starting at ₹7), but every exam page includes at least one free test you can attempt without signing up.',
                  },
                  {
                    q: 'Do I need an account to take a test?',
                    a: 'You can browse all exams and view test details without an account. To attempt a test and save your results and progress, you need to sign up — it is free and takes under a minute.',
                  },
                  {
                    q: 'How accurate is the exam pattern used in the mock tests?',
                    a: 'All tests are updated to match the latest official exam pattern and syllabus. Our educators track official notifications from SSC, IBPS, RRB, NTA, and other conducting bodies, and update question sets promptly after any pattern change.',
                  },
                  {
                    q: 'Can I review my answers after finishing a test?',
                    a: 'Yes. After every test you get an instant result screen with section-wise accuracy, time-per-question analysis, a full answer key, and detailed explanations for each question so you can learn from your mistakes.',
                  },
                  {
                    q: 'Which exams are currently available on GridAcademy?',
                    a: 'GridAcademy currently covers SSC (CGL, CHSL, MTS, GD Constable), Banking (IBPS PO, IBPS Clerk, SBI PO, SBI Clerk), Railway (RRB NTPC, Group D, ALP, RPF), UPSC Prelims, CUET UG, NEET, and various defence and state-level exams. New exams are added regularly.',
                  },
                ].map(({ q, a }) => (
                  <details key={q} className="group py-4 cursor-pointer list-none">
                    <summary className="flex items-center justify-between gap-3 font-semibold text-sm text-gray-800 marker:hidden list-none">
                      {q}
                      <span className="shrink-0 text-gray-400 group-open:rotate-180 transition-transform">▾</span>
                    </summary>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">{a}</p>
                  </details>
                ))}
              </dl>
            </div>
          </section>

          {/* ── Empty state ── */}
          {latest.length === 0 && (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              {activeCategory ? (
                <>
                  <h2 className="text-xl font-semibold text-gray-700">No {activeCategory} Exams Yet</h2>
                  <p className="text-gray-400 mt-2 text-sm max-w-md mx-auto">
                    We&apos;re adding {activeCategory} exams soon. Check back shortly or browse all exams.
                  </p>
                  <Link href="/"
                    className="mt-6 inline-flex items-center gap-2 text-white bg-[#1760f4] px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#0e4dd4] transition-colors">
                    View All Exams <ChevronRight className="w-4 h-4" />
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-gray-700">Exams Coming Soon</h2>
                  <p className="text-gray-400 mt-2 text-sm max-w-md mx-auto">
                    We&apos;re adding new exams and mock tests. Register to get notified when they go live.
                  </p>
                  <Link href="/register"
                    className="mt-6 inline-flex items-center gap-2 text-white bg-[#1760f4] px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#0e4dd4] transition-colors">
                    Get Notified <ChevronRight className="w-4 h-4" />
                  </Link>
                </>
              )}
            </div>
          )}
        </main>

        {/* Right Panel */}
        <RightPanel exams={exams} />
      </div>

      {/* ── Mobile bottom navigation ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 grid grid-cols-4"
        style={{ height: 60, boxShadow: '0 -2px 10px rgba(0,0,0,.06)' }}>
        {[
          { icon: <Home className="w-5 h-5" />,     label: 'Home',    href: '/',          active: true },
          { icon: <Search className="w-5 h-5" />,   label: 'Search',  href: '/exams',     active: false },
          { icon: <FileText className="w-5 h-5" />, label: 'Tests',   href: '/tests',     active: false },
          { icon: <BookOpen className="w-5 h-5" />, label: 'Profile', href: '/dashboard', active: false },
        ].map(item => (
          <Link key={item.label} href={item.href}
            className={`flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors
              ${item.active ? 'text-[#1760f4]' : 'text-gray-500 hover:text-[#1760f4]'}`}>
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <Footer />
    </>
  );
}
