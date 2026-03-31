import { api } from '@/lib/api-client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { ExamCard } from '@/types/exam';
import {
  FileText, Zap, Home, BookOpen, Trophy, BarChart2,
  ChevronRight, Search, Star
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
async function getAllExams(): Promise<ExamCard[]> {
  try {
    const res = await api.get<ExamCard[]>('/api/exams?activeOnly=true');
    return Array.isArray(res) ? res : (res as any)?.data ?? [];
  } catch { return []; }
}

function stripHtml(html: string | null): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function formatPrice(p: number) { return p === 0 ? 'FREE' : `₹${p.toLocaleString('en-IN')}`; }

// ── Category config ───────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: 'All Exams', value: '' },
  { label: '🚂 Railway', value: 'Railway' },
  { label: '🏛️ UPSC', value: 'UPSC' },
  { label: '🏦 Banking', value: 'Banking' },
  { label: '👮 SSC', value: 'SSC' },
  { label: '🔬 GATE', value: 'GATE' },
  { label: '📐 Defence', value: 'Defence' },
];

function categoryIcon(cat: string | null) {
  switch (cat) {
    case 'Railway':  return '🚂';
    case 'UPSC':     return '🏛️';
    case 'Banking':  return '🏦';
    case 'SSC':      return '👮';
    case 'GATE':     return '🔬';
    case 'Defence':  return '📐';
    default:         return '📝';
  }
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function LeftSidebar({ exams, active }: { exams: ExamCard[]; active: string }) {
  const counts: Record<string, number> = {};
  exams.forEach(e => { if (e.category) counts[e.category] = (counts[e.category] ?? 0) + 1; });

  return (
    <aside className="hidden md:flex flex-col bg-white border-r border-gray-200 overflow-y-auto"
      style={{ width: 260, position: 'sticky', top: 56, height: 'calc(100vh - 56px)' }}>
      <div className="p-3">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 mb-1">Navigation</p>
        <Link href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
          <Home className="w-4 h-4" /> Home
        </Link>
        <Link href="/exams"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-orange-600 bg-orange-50">
          <BookOpen className="w-4 h-4" /> All Exams
        </Link>
        <Link href="/tests"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
          <FileText className="w-4 h-4 shrink-0" />
          <span>Free Tests</span>
          <span className="ml-auto bg-orange-100 text-orange-600 text-xs font-bold px-1.5 py-0.5 rounded-full">Free</span>
        </Link>
        <Link href="/leaderboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
          <Trophy className="w-4 h-4" /> Leaderboard
        </Link>
        <Link href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
          <BarChart2 className="w-4 h-4" /> My Progress
        </Link>
      </div>

      <div className="px-3 pb-3">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 mb-1 mt-2">Filter by Category</p>
        {CATEGORIES.map(cat => {
          const isActive = cat.value === active;
          return (
            <Link key={cat.label}
              href={cat.value ? `/exams?category=${cat.value}` : '/exams'}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}>
              <span className="text-base leading-none">{cat.label.split(' ')[0]}</span>
              <span>{cat.value || 'All Exams'}</span>
              {cat.value && counts[cat.value] ? (
                <span className="ml-auto text-xs text-gray-400">{counts[cat.value]}</span>
              ) : null}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto p-3">
        <div className="rounded-xl p-4 text-white text-sm"
          style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}>
          <p className="font-bold mb-1">🏫 Are you an educator?</p>
          <p className="text-orange-100 text-xs mb-3">Upload tests &amp; reach lakhs of students.</p>
          <Link href="/provider/register"
            className="block text-center bg-white text-orange-600 font-bold text-xs py-2 rounded-lg hover:bg-orange-50">
            Become a Provider
          </Link>
        </div>
      </div>
    </aside>
  );
}

// ── Exam Card ─────────────────────────────────────────────────────────────────
function ExamCardItem({ exam }: { exam: ExamCard }) {
  return (
    <Link href={`/exam/${exam.slug}`}
      className="group flex flex-col bg-white rounded-xl border border-gray-200
        hover:shadow-md hover:border-orange-200 transition-all duration-200 overflow-hidden"
      style={{ borderTop: '3px solid transparent' }}
      onMouseEnter={e => (e.currentTarget.style.borderTopColor = '#f97316')}
      onMouseLeave={e => (e.currentTarget.style.borderTopColor = 'transparent')}>
      <div className="relative h-28 bg-gradient-to-br from-orange-400 to-orange-600 overflow-hidden shrink-0">
        {exam.thumbnailUrl ? (
          <Image src={exam.thumbnailUrl} alt={exam.title} fill
            className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl">
            {categoryIcon(exam.category)}
          </div>
        )}
        {exam.examLevelName && (
          <span className="absolute top-2 left-2 bg-white/90 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded-full">
            {exam.examLevelName}
          </span>
        )}
        {exam.isFeatured && (
          <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded-full">
            <Star className="w-2.5 h-2.5 inline fill-yellow-900" />
          </span>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-orange-500 font-medium truncate">
          {exam.conductingBody ?? exam.category ?? 'Government Exam'}
        </p>
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mt-0.5 group-hover:text-orange-600 leading-snug">
          {exam.title}
        </h3>
        {exam.shortDescription && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{stripHtml(exam.shortDescription)}</p>
        )}
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

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function ExamsPage({
  searchParams
}: {
  searchParams?: { category?: string; q?: string }
}) {
  const allExams = await getAllExams();
  const activeCategory = searchParams?.category ?? '';
  const searchQuery    = (searchParams?.q ?? '').toLowerCase();

  // Filter client-side — avoids API category param (needs DB migration to work)
  let filtered = activeCategory
    ? allExams.filter(e => e.category === activeCategory)
    : allExams;

  if (searchQuery) {
    filtered = filtered.filter(e =>
      e.title.toLowerCase().includes(searchQuery) ||
      (e.conductingBody ?? '').toLowerCase().includes(searchQuery)
    );
  }

  const categoryLabel = CATEGORIES.find(c => c.value === activeCategory)?.label ?? 'All Exams';

  return (
    <>
      <style>{`:root{--primary:#f97316;--topbar-h:56px;}`}</style>
      <Header />

      <div className="flex bg-gray-50 min-h-screen">
        <LeftSidebar exams={allExams} active={activeCategory} />

        <main className="flex-1 min-w-0 px-4 md:px-6 lg:px-8 py-5 pb-20 md:pb-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
            <Link href="/" className="hover:text-orange-500">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-800 font-medium">
              {activeCategory ? `${activeCategory} Exams` : 'All Exams'}
            </span>
          </nav>

          {/* Filter pills */}
          <div className="overflow-x-auto scrollbar-hide mb-5 -mx-4 px-4 md:-mx-0 md:px-0">
            <div className="flex items-center gap-2 min-w-max">
              {CATEGORIES.map(cat => {
                const isActive = cat.value === activeCategory;
                return (
                  <Link key={cat.label}
                    href={cat.value ? `/exams?category=${cat.value}` : '/exams'}
                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors
                      ${isActive
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-orange-400 hover:text-orange-600'
                      }`}>
                    {cat.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Page heading */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-bold text-gray-900">{categoryLabel}</h1>
              <p className="text-sm text-gray-400 mt-0.5">{filtered.length} exam{filtered.length !== 1 ? 's' : ''} found</p>
            </div>
            {/* Search input */}
            <form method="get" action="/exams" className="relative hidden sm:block">
              {activeCategory && <input type="hidden" name="category" value={activeCategory} />}
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input name="q" type="text" defaultValue={searchQuery} placeholder="Search exams…"
                className="pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-full
                  focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-300 w-56" />
            </form>
          </div>

          {/* Exam grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map(e => <ExamCardItem key={e.id} exam={e} />)}
            </div>
          ) : (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700">No Exams Found</h2>
              <p className="text-gray-400 mt-2 text-sm max-w-md mx-auto">
                {searchQuery
                  ? `No exams match "${searchQuery}". Try a different search.`
                  : `No ${activeCategory} exams are published yet. Check back soon!`}
              </p>
              <Link href="/exams" className="mt-6 inline-block text-orange-500 font-semibold text-sm hover:underline">
                ← View All Exams
              </Link>
            </div>
          )}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 grid grid-cols-4"
        style={{ height: 60 }}>
        {[
          { icon: <Home className="w-5 h-5" />,     label: 'Home',    href: '/' },
          { icon: <Search className="w-5 h-5" />,   label: 'Search',  href: '/exams' },
          { icon: <FileText className="w-5 h-5" />, label: 'Tests',   href: '/tests' },
          { icon: <BookOpen className="w-5 h-5" />, label: 'Profile', href: '/dashboard' },
        ].map(item => (
          <Link key={item.label} href={item.href}
            className="flex flex-col items-center justify-center gap-0.5 text-xs font-medium text-gray-500 hover:text-orange-500 transition-colors">
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <Footer />
    </>
  );
}
