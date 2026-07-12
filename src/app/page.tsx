export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { api } from '@/lib/api-client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { ExamCard, ExamTypeFilter } from '@/types/exam';
import {
  FileText, Star, ChevronRight, Zap, User,
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
    <aside className="hidden md:flex flex-col bg-white border-r border-gray-100 overflow-y-auto shadow-sm"
      style={{ width: 260, position: 'sticky', top: 56, height: 'calc(100vh - 56px)' }}>

      {/* Main nav */}
      <div className="p-3 pt-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Main Menu</p>
        <Link href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#1760f4] to-[#1250d0] shadow-sm shadow-blue-200 mb-0.5">
          <Home className="w-4 h-4" /> Home
        </Link>
        <Link href="/exams"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-[#1760f4] transition-all">
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

      {/* Exam type nav */}
      <div className="px-3 pb-3">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2 mt-3">Exam Categories</p>
        {examTypes.map(t => (
          <Link key={t.id} href={`/?category=${encodeURIComponent(t.name)}`}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-[#1760f4] transition-all">
            <span className="text-base leading-none">{examTypeIcon(t.name)}</span>
            <span>{t.name}</span>
            {typeCounts[t.name] ? (
              <span className="ml-auto text-[11px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{typeCounts[t.name]}</span>
            ) : null}
          </Link>
        ))}
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

// ── Right Panel (desktop only) ────────────────────────────────────────────────
function RightPanel({ exams }: { exams: ExamCard[] }) {
  const total    = exams.length;
  const free     = exams.filter(e => e.priceInr === 0).length;
  const tests    = exams.reduce((s, e) => s + e.testCount, 0);
  const featured = exams.filter(e => e.isFeatured).length;

  return (
    <aside className="hidden lg:flex flex-col gap-4 py-6 pr-6"
      style={{ width: 300, position: 'sticky', top: 64, alignSelf: 'flex-start' }}>

      {/* Platform Stats */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 bg-[#1760f4] rounded-full" />
          <h3 className="text-sm font-bold text-gray-800">Platform Stats</h3>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { icon: '📝', num: total,    label: 'Total Exams',  bg: 'bg-blue-50',   text: 'text-blue-600' },
            { icon: '🆓', num: free,     label: 'Free Exams',   bg: 'bg-emerald-50', text: 'text-emerald-600' },
            { icon: '📋', num: tests,    label: 'Mock Tests',   bg: 'bg-violet-50',  text: 'text-violet-600' },
            { icon: '⭐', num: featured, label: 'Featured',     bg: 'bg-amber-50',   text: 'text-amber-600' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl p-3 flex flex-col gap-1`}>
              <span className="text-xl leading-none">{s.icon}</span>
              <p className={`text-xl font-extrabold ${s.text} leading-none mt-1`}>{s.num}</p>
              <p className="text-[11px] text-gray-500 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why GridAcademy */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 bg-[#1760f4] rounded-full" />
          <h3 className="text-sm font-bold text-gray-800">Why GridAcademy?</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: '⚡', title: 'Instant Results' },
            { icon: '🎯', title: 'Latest Pattern' },
            { icon: '🆓', title: 'Mostly Free' },
            { icon: '📊', title: 'Deep Analytics' },
          ].map(f => (
            <div key={f.title} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
              <span className="text-base leading-none shrink-0">{f.icon}</span>
              <p className="text-xs font-semibold text-gray-700 leading-tight">{f.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Provider CTA */}
      <div className="rounded-2xl border border-blue-100 bg-white shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#1760f4] to-[#0a3ba8]" />
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🏫</span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#1760f4]">For Institutes</p>
              <h3 className="text-sm font-extrabold text-gray-900 leading-tight">Are you a coaching institute?</h3>
            </div>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed mb-3">
            Upload tests &amp; reach <span className="font-semibold text-gray-700">lakhs of students</span>. Free to join, no setup fee.
          </p>
          <Link href="/provider/register"
            className="flex items-center justify-center gap-1.5 w-full bg-[#1760f4] text-white font-bold text-sm py-2.5 rounded-xl hover:bg-[#0e4dd4] transition-colors shadow-sm">
            Become a Provider <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}

// ── Card colour palette ────────────────────────────────────────────────────────
const CARD_PALETTES = [
  { bg: 'bg-blue-50',    topBorder: 'border-t-blue-500',    badgeBg: 'bg-blue-100',    badgeText: 'text-blue-700'    },
  { bg: 'bg-indigo-50',  topBorder: 'border-t-indigo-500',  badgeBg: 'bg-indigo-100',  badgeText: 'text-indigo-700'  },
  { bg: 'bg-sky-50',     topBorder: 'border-t-sky-500',     badgeBg: 'bg-sky-100',     badgeText: 'text-sky-700'     },
  { bg: 'bg-violet-50',  topBorder: 'border-t-violet-500',  badgeBg: 'bg-violet-100',  badgeText: 'text-violet-700'  },
  { bg: 'bg-cyan-50',    topBorder: 'border-t-cyan-500',    badgeBg: 'bg-cyan-100',    badgeText: 'text-cyan-700'    },
  { bg: 'bg-teal-50',    topBorder: 'border-t-teal-500',    badgeBg: 'bg-teal-100',    badgeText: 'text-teal-700'    },
  { bg: 'bg-slate-50',   topBorder: 'border-t-slate-400',   badgeBg: 'bg-slate-100',   badgeText: 'text-slate-700'   },
  { bg: 'bg-blue-50',    topBorder: 'border-t-[#1760f4]',   badgeBg: 'bg-blue-100',    badgeText: 'text-blue-800'    },
];

// ── Exam Card ─────────────────────────────────────────────────────────────────
function ExamCardItem({ exam, index }: { exam: ExamCard; index: number }) {
  const p = CARD_PALETTES[index % CARD_PALETTES.length];
  return (
    <Link href={`/exam/${exam.slug}`}
      className={`group flex flex-col rounded-2xl border border-gray-100 border-t-4 ${p.topBorder} ${p.bg}
        hover:shadow-xl hover:shadow-blue-100/60 hover:-translate-y-1 transition-all duration-200 overflow-hidden`}>

      <div className="p-4 flex flex-col gap-3 flex-1">

        {/* Row 1: level badge + featured star */}
        <div className="flex items-center justify-between gap-2 min-h-[26px]">
          {exam.examLevelName ? (
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${p.badgeBg} ${p.badgeText}`}>
              {exam.examLevelName}
            </span>
          ) : <span />}
          {exam.isFeatured && (
            <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
          )}
        </div>

        {/* Row 2: title */}
        <h2 className="text-base font-bold text-gray-900 leading-snug line-clamp-3
          group-hover:text-[#1760f4] transition-colors flex-1">
          {exam.title}
        </h2>

        {/* Row 3: conducting body */}
        <p className="text-xs text-gray-400 truncate font-medium">
          {exam.conductingBody ?? exam.examTypeName ?? exam.category ?? 'Government Exam'}
        </p>

        {/* Row 4: tests count + free/price badge */}
        <div className="flex items-center justify-between pt-3 border-t border-black/[0.06]">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
            <FileText className="w-3.5 h-3.5 shrink-0" />
            {exam.testCount} Test{exam.testCount !== 1 ? 's' : ''}
          </span>
          {exam.priceInr === 0 ? (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-700
              bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              <Zap className="w-3 h-3" />Free
            </span>
          ) : (
            <span className="text-xs font-bold text-gray-700 bg-white border border-gray-200
              px-2.5 py-0.5 rounded-full shadow-sm">
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

          {/* ── Hero banner ── */}
          <div className="relative rounded-2xl overflow-hidden mb-5 bg-gradient-to-br from-[#1760f4] via-[#1454e0] to-[#0a3ba8] p-6 md:p-8 shadow-lg shadow-blue-200/50">
            {/* Decorative circles */}
            <div className="absolute right-0 top-0 w-56 h-56 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4 pointer-events-none" />
            <div className="absolute right-16 bottom-0 w-36 h-36 bg-white/5 rounded-full translate-y-1/2 pointer-events-none" />
            <div className="absolute left-1/2 top-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 pointer-events-none" />
            <div className="relative z-10">
              <h1 className="text-xl md:text-2xl font-extrabold text-white leading-snug mb-2">
                Free Mock Tests for SSC, CUET, Railway, Banking &amp; UPSC Exams
              </h1>
              <p className="text-blue-200 text-sm font-medium mb-4">
                Practice with real exam pattern · Instant results · Section-wise analysis
              </p>
              <form action="/exams" method="GET" className="relative max-w-lg">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  name="q"
                  placeholder="Search exams — SSC CGL, IBPS PO, RRB NTPC..."
                  className="w-full pl-10 pr-20 py-3 rounded-xl text-gray-900 text-sm bg-white/95 shadow-md placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-white/50 transition-all"
                />
                <button type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#1760f4] text-white text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-[#0e4dd4] transition-colors shadow-sm">
                  Search
                </button>
              </form>
            </div>
          </div>

          {/* ── Filter pills ── */}
          <div className="overflow-x-auto scrollbar-hide mb-5 -mx-4 px-4 md:-mx-6 md:px-6">
            <div className="flex items-center gap-2 min-w-max">
              <Link
                href="/"
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all
                  ${activeCategory === ''
                    ? 'bg-[#1760f4] text-white border-[#1760f4] shadow-sm shadow-blue-200'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#1760f4] hover:text-[#1760f4] hover:shadow-sm'
                  }`}>
                All Exams
              </Link>

              {tabExamTypes.map(t => {
                const isActive = t.name === activeCategory;
                return (
                  <Link key={t.id}
                    href={`/?category=${encodeURIComponent(t.name)}`}
                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all
                      ${isActive
                        ? 'bg-[#1760f4] text-white border-[#1760f4] shadow-sm shadow-blue-200'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#1760f4] hover:text-[#1760f4] hover:shadow-sm'
                      }`}>
                    {examTypeIcon(t.name)} {t.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ── Quick stats ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { icon: '📝', num: `${exams.length}+`, label: 'Exams',      gradient: 'from-blue-500 to-[#1760f4]' },
              { icon: '🆓', num: `${exams.filter(e => e.priceInr === 0).length}`, label: 'Free Exams', gradient: 'from-emerald-500 to-teal-600' },
              { icon: '📋', num: `${exams.reduce((s, e) => s + e.testCount, 0)}+`, label: 'Mock Tests', gradient: 'from-violet-500 to-indigo-600' },
              { icon: '🏆', num: '10K+',             label: 'Students',   gradient: 'from-amber-500 to-orange-500' },
            ].map(s => (
              <div key={s.label} className={`bg-gradient-to-br ${s.gradient} rounded-2xl p-4 flex items-center gap-3 shadow-md`}>
                <span className="text-2xl leading-none shrink-0 drop-shadow-sm">{s.icon}</span>
                <div>
                  <p className="text-xl font-extrabold text-white leading-none">{s.num}</p>
                  <p className="text-xs text-white/80 font-medium mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Featured exam banner ── */}
          {featured.length > 0 && (
            <Link href={`/exam/${featured[0].slug}`}
              className="block rounded-2xl overflow-hidden mb-6 group border border-blue-100 bg-white hover:shadow-lg hover:shadow-blue-100/60 transition-all duration-200">
              <div className="relative p-6 md:p-7">
                {/* Blue left accent bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#1760f4] to-[#0a3ba8] rounded-l-2xl" />
                <div className="pl-4 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 mb-3 text-xs font-bold px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1760f4]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1760f4] animate-pulse inline-block"></span>
                    Featured
                  </div>
                  <h2 className="text-gray-900 text-xl md:text-2xl font-extrabold leading-tight mb-2 group-hover:text-[#1760f4] transition-colors">
                    {featured[0].title}
                  </h2>
                  {featured[0].shortDescription && (
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {stripHtml(featured[0].shortDescription)}
                    </p>
                  )}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="bg-[#1760f4] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#0e4dd4] transition-colors shadow-sm shadow-blue-300">
                      Start Preparation
                    </span>
                    <span className="text-gray-600 text-sm font-semibold px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                      View Syllabus
                    </span>
                    <span className={`ml-auto text-sm font-bold ${featured[0].priceInr === 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                      {formatPrice(featured[0].priceInr)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* ── Exam cards grid ── */}
          {latest.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-[#1760f4] rounded-full" />
                  <h2 className="text-base font-bold text-gray-900">
                    {activeCategory ? `${activeCategory} Exams` : 'Explore Exams'}
                  </h2>
                </div>
                <Link href="/exams"
                  className="text-sm font-semibold text-[#1760f4] hover:text-[#0e4dd4] flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full transition-colors hover:bg-blue-100">
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {latest.map((e, i) => <ExamCardItem key={e.id} exam={e} index={i} />)}
              </div>
            </section>
          )}

          {/* ── Career Guide Banner ── */}
          <div className="rounded-2xl bg-gradient-to-r from-[#1760f4] to-[#0a3ba8] p-5 md:p-6 mt-8 mb-6 flex flex-col sm:flex-row sm:items-center gap-4 shadow-lg shadow-blue-200/50 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="text-4xl shrink-0 leading-none relative z-10">🧭</div>
            <div className="flex-1 min-w-0 relative z-10">
              <p className="text-[11px] font-bold uppercase tracking-wider text-blue-200 mb-0.5">
                Free Career Guide
              </p>
              <h3 className="text-base md:text-lg font-extrabold text-white leading-snug">
                Not sure which career to choose? Explore 100 options.
              </h3>
              <p className="text-sm text-blue-100 mt-1">
                Discover paths across 8 personality types — Makers, Thinkers, Builders &amp; more. Most cost ₹0 to start.
              </p>
            </div>
            <div className="flex flex-row sm:flex-col gap-2 shrink-0 relative z-10">
              <Link href="/career-guide/quiz"
                className="inline-flex items-center justify-center gap-1.5 bg-white text-[#1760f4] font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap shadow-sm">
                🎯 Take the Quiz
              </Link>
              <Link href="/career-guide"
                className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap border border-white/20">
                Browse 100 Careers
              </Link>
            </div>
          </div>

          {/* ── Latest Blog Posts ── */}
          {(() => {
            const latestPosts = getAllPosts().slice(0, 5);
            const CAT_COLORS: Record<string, string> = {
              SSC: 'bg-blue-100 text-blue-700 border-blue-200',
              CUET: 'bg-violet-100 text-violet-700 border-violet-200',
              Railway: 'bg-emerald-100 text-emerald-700 border-emerald-200',
              NEET: 'bg-rose-100 text-rose-700 border-rose-200',
              Banking: 'bg-amber-100 text-amber-700 border-amber-200',
              UPSC: 'bg-slate-100 text-slate-700 border-slate-200',
            };
            return (
              <section className="mt-8 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-[#1760f4] rounded-full" />
                    <h2 className="text-base font-bold text-gray-900">Latest from the Blog</h2>
                  </div>
                  <Link href="/blog" className="text-sm font-semibold text-[#1760f4] hover:text-[#0e4dd4] flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full transition-colors hover:bg-blue-100">
                    View all <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="flex flex-col gap-3">
                  {latestPosts.map((post, idx) => {
                    const catCls = CAT_COLORS[post.category] ?? 'bg-blue-100 text-blue-700 border-blue-200';
                    const date = new Date(post.publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

                    if (idx === 0) {
                      return (
                        <Link key={post.slug} href={`/blog/${post.slug}`}
                          className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:border-blue-200 hover:shadow-md hover:shadow-blue-100 transition-all duration-200 p-5 md:p-6">
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1760f4] bg-blue-100 px-2.5 py-1 rounded-full">Featured Article</span>
                            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${catCls}`}>
                              <Tag className="w-2.5 h-2.5" />{post.category}
                            </span>
                            <span className="text-[11px] text-gray-400 ml-auto font-medium">{date}</span>
                          </div>
                          <h3 className="text-base md:text-lg font-extrabold text-gray-900 leading-snug group-hover:text-[#1760f4] transition-colors mb-2">
                            {post.title}
                          </h3>
                          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">{post.excerpt}</p>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                              <Clock className="w-2.5 h-2.5" />{post.readingTimeMinutes} min read
                            </span>
                            <span className="ml-auto flex items-center gap-1 text-xs font-bold text-[#1760f4] group-hover:gap-2 transition-all">
                              Read Article <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </Link>
                      );
                    }

                    return (
                      <Link key={post.slug} href={`/blog/${post.slug}`}
                        className="group flex items-start gap-4 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md hover:shadow-blue-50 transition-all duration-200 p-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${catCls}`}>
                              <Tag className="w-2.5 h-2.5" />{post.category}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                              <Clock className="w-2.5 h-2.5" />{post.readingTimeMinutes} min read
                            </span>
                            <span className="text-[11px] text-gray-400 ml-auto font-medium">{date}</span>
                          </div>
                          <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-[#1760f4] transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#1760f4] transition-colors shrink-0 mt-1" />
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })()}

          {/* ── About + FAQ ── */}
          <section className="mt-10 space-y-6">

            {/* About GridAcademy */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-[#1760f4] rounded-full" />
                <h2 className="text-lg font-extrabold text-gray-900">About GridAcademy</h2>
              </div>

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
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-5 bg-[#1760f4] rounded-full" />
                <h2 className="text-lg font-extrabold text-gray-900">Frequently Asked Questions</h2>
              </div>
              <dl className="divide-y divide-gray-50">
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
                    <summary className="flex items-center justify-between gap-3 font-semibold text-sm text-gray-800 marker:hidden list-none hover:text-[#1760f4] transition-colors">
                      {q}
                      <span className="shrink-0 w-5 h-5 rounded-full bg-blue-50 text-[#1760f4] flex items-center justify-center text-xs group-open:rotate-180 transition-transform">▾</span>
                    </summary>
                    <p className="mt-3 text-sm text-gray-500 leading-relaxed">{a}</p>
                  </details>
                ))}
              </dl>
            </div>
          </section>

          {/* ── Empty state ── */}
          {latest.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-[#1760f4]" />
              </div>
              {activeCategory ? (
                <>
                  <h2 className="text-xl font-semibold text-gray-700">No {activeCategory} Exams Yet</h2>
                  <p className="text-gray-400 mt-2 text-sm max-w-md mx-auto">
                    We&apos;re adding {activeCategory} exams soon. Check back shortly or browse all exams.
                  </p>
                  <Link href="/"
                    className="mt-6 inline-flex items-center gap-2 text-white bg-[#1760f4] px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0e4dd4] transition-colors shadow-sm shadow-blue-300">
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
                    className="mt-6 inline-flex items-center gap-2 text-white bg-[#1760f4] px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0e4dd4] transition-colors shadow-sm shadow-blue-300">
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 grid grid-cols-4"
        style={{ height: 60, boxShadow: '0 -4px 20px rgba(0,0,0,.06)' }}>
        {[
          { icon: <Home className="w-5 h-5" />,     label: 'Home',    href: '/',          active: true },
          { icon: <Search className="w-5 h-5" />,   label: 'Search',  href: '/exams',     active: false },
          { icon: <FileText className="w-5 h-5" />, label: 'Tests',   href: '/tests',     active: false },
          { icon: <User className="w-5 h-5" />, label: 'Profile', href: '/dashboard', active: false },
        ].map(item => (
          <Link key={item.label} href={item.href}
            className={`flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors
              ${item.active ? 'text-[#1760f4]' : 'text-gray-400 hover:text-[#1760f4]'}`}>
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <Footer />
    </>
  );
}
