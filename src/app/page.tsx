export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { api } from '@/lib/api-client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { ExamCard, ExamTypeFilter } from '@/types/exam';
import {
  FileText, Star, ChevronRight, Zap,
  Home, BookOpen, Trophy, BarChart2, Search
} from 'lucide-react';

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

// ── Exam Card ─────────────────────────────────────────────────────────────────
function ExamCardItem({ exam }: { exam: ExamCard }) {
  const icon = examTypeIcon(exam.examTypeName ?? exam.category);
  return (
    <Link href={`/exam/${exam.slug}`}
      className="group flex flex-col bg-white rounded-xl overflow-hidden transition-all duration-200
        border-t-[3px] border-t-transparent border border-gray-200
        hover:shadow-md hover:border-gray-300 hover:border-t-[#1760f4]">

      {/* Thumbnail or icon */}
      <div className="relative h-28 bg-gray-100 overflow-hidden shrink-0">
        {exam.thumbnailUrl ? (
          <Image src={exam.thumbnailUrl} alt={exam.title} fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl">
            {icon}
          </div>
        )}
        {exam.examLevelName && (
          <span className="absolute top-2 left-2 bg-white text-gray-600 text-xs font-semibold px-2 py-0.5 rounded border border-gray-200">
            {exam.examLevelName}
          </span>
        )}
        {exam.isFeatured && (
          <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
            <Star className="w-2.5 h-2.5 inline fill-yellow-900" />
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-gray-500 font-medium truncate">
          {exam.conductingBody ?? exam.examTypeName ?? exam.category ?? 'Government Exam'}
        </p>
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mt-0.5 group-hover:text-[#1760f4] transition-colors leading-snug">
          {exam.title}
        </h3>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 mt-2">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <FileText className="w-3 h-3" /> {exam.testCount} Tests
          </span>
          <span className={`text-sm font-bold ${exam.priceInr === 0 ? 'text-green-600' : 'text-gray-900'}`}>
            {exam.priceInr === 0
              ? <span className="flex items-center gap-0.5"><Zap className="w-3 h-3" />Free</span>
              : formatPrice(exam.priceInr)
            }
          </span>
        </div>
      </div>
    </Link>
  );
}

export const metadata: Metadata = {
  title: "GridAcademy — India's Best Mock Test Platform",
  description:
    "Prepare for SSC, Banking, Railway, UPSC and more with expert-created mock tests.",

  alternates: {
    canonical: "https://www.gridacademy.in/",
  },

  openGraph: {
    title: "GridAcademy — India's Best Mock Test Platform",
    description:
      "Prepare for SSC, Banking, Railway, UPSC and more with expert-created mock tests.",
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

      <Header />

      <div className="flex bg-gray-50 min-h-screen">
        {/* Left Sidebar */}
        <LeftSidebar exams={exams} examTypes={tabExamTypes} />

        {/* Main content */}
        <main className="flex-1 min-w-0 px-4 md:px-6 lg:px-8 py-5 pb-20 md:pb-6">

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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {latest.map(e => <ExamCardItem key={e.id} exam={e} />)}
              </div>
            </section>
          )}

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
