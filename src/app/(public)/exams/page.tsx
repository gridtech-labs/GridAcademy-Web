import { api } from '@/lib/api-client';
import Link from 'next/link';
import Image from 'next/image';
import { ExamCard, ExamTypeFilter } from '@/types/exam';
import {
  FileText, Zap, Home, BookOpen, Trophy, BarChart2,
  ChevronRight, Search, Star
} from 'lucide-react';

// ── Data fetching ─────────────────────────────────────────────────────────────
async function getAllExams(): Promise<ExamCard[]> {
  try {
    const res = await api.get<ExamCard[]>('/api/exams');
    return Array.isArray(res) ? res : (res as any)?.data ?? [];
  } catch { return []; }
}

async function getExamTypes(): Promise<ExamTypeFilter[]> {
  try {
    const res = await api.get<ExamTypeFilter[]>('/api/exams/exam-types');
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

// Generic icon — falls back to 📝 for unknown types
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
function LeftSidebar({
  examTypes,
  active,
  counts,
}: {
  examTypes: ExamTypeFilter[];
  active: string;
  counts: Record<string, number>;
}) {
  return (
    <aside className="hidden md:flex flex-col bg-white border-r border-gray-200 overflow-y-auto shrink-0"
      style={{ width: 260, position: 'sticky', top: 56, height: 'calc(100vh - 56px)' }}>
      <div className="p-3">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 mb-1">Navigation</p>
        <Link href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
          <Home className="w-4 h-4 shrink-0" /> Home
        </Link>
        <Link href="/exams"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-orange-600 bg-orange-50">
          <BookOpen className="w-4 h-4 shrink-0" /> All Exams
        </Link>
        <Link href="/tests"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
          <FileText className="w-4 h-4 shrink-0" />
          <span>Free Tests</span>
          <span className="ml-auto bg-orange-100 text-orange-600 text-xs font-bold px-1.5 py-0.5 rounded-full">Free</span>
        </Link>
        <Link href="/leaderboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
          <Trophy className="w-4 h-4 shrink-0" /> Leaderboard
        </Link>
        <Link href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
          <BarChart2 className="w-4 h-4 shrink-0" /> My Progress
        </Link>
      </div>

      <div className="px-3 pb-3">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 mb-1 mt-2">Filter by Exam Type</p>

        {/* All Exams */}
        <Link href="/exams"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
            ${ active === '' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700 hover:bg-gray-100' }`}>
          <span className="text-base leading-none">📋</span>
          <span>All Exams</span>
        </Link>

        {examTypes.map(et => {
          const isActive = et.name === active;
          return (
            <Link key={et.id}
              href={`/exams?category=${encodeURIComponent(et.name)}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}>
              <span className="text-base leading-none">{categoryIcon(et.name)}</span>
              <span>{et.name}</span>
              {counts[et.name] ? (
                <span className="ml-auto text-xs text-gray-400">{counts[et.name]}</span>
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
      className="group flex flex-col bg-white rounded-xl overflow-hidden transition-all duration-200
        border-t-[3px] border-t-transparent border border-gray-200
        hover:shadow-md hover:border-orange-200 hover:border-t-orange-500">

      <div className="relative h-28 bg-gradient-to-br from-orange-400 to-orange-600 overflow-hidden shrink-0">
        {exam.thumbnailUrl ? (
          <Image src={exam.thumbnailUrl} alt={exam.title} fill
            className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl">
            {categoryIcon(exam.examTypeName)}
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
          {exam.conductingBody ?? exam.examTypeName ?? 'Government Exam'}
        </p>
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mt-0.5 group-hover:text-orange-600 leading-snug">
          {exam.title}
        </h3>
        {exam.shortDescription && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{stripHtml(exam.shortDescription)}</p>
        )}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
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
  const [allExams, examTypes] = await Promise.all([getAllExams(), getExamTypes()]);

  const activeCategory = searchParams?.category ?? '';
  const searchQuery    = (searchParams?.q ?? '').toLowerCase();

  // Filter by examTypeName (dynamic — driven by DB exam types)
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

  // Count per exam type (for sidebar badges)
  const counts: Record<string, number> = {};
  allExams.forEach(e => {
    if (e.examTypeName) counts[e.examTypeName] = (counts[e.examTypeName] ?? 0) + 1;
  });

  const categoryLabel = activeCategory
    ? (examTypes.find(t => t.name === activeCategory)?.name ?? activeCategory)
    : 'All Exams';

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <LeftSidebar examTypes={examTypes} active={activeCategory} counts={counts} />

      <main className="flex-1 min-w-0 px-4 md:px-6 lg:px-8 py-5 pb-24 md:pb-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-orange-500">Home</Link>
          <ChevronRight className="w-3 h-3" />
          {activeCategory ? (
            <>
              <Link href="/exams" className="hover:text-orange-500">All Exams</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-800 font-medium">{activeCategory}</span>
            </>
          ) : (
            <span className="text-gray-800 font-medium">All Exams</span>
          )}
        </nav>

        {/* Filter pills — dynamic from DB */}
        <div className="overflow-x-auto scrollbar-hide mb-5 -mx-4 px-4 md:-mx-0 md:px-0">
          <div className="flex items-center gap-2 min-w-max">
            {/* All */}
            <Link href="/exams"
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors
                ${ activeCategory === ''
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-orange-400 hover:text-orange-600'
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
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-orange-400 hover:text-orange-600'
                    }`}>
                  {categoryIcon(et.name)} {et.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Heading + search */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-bold text-gray-900">{categoryLabel}</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {filtered.length} exam{filtered.length !== 1 ? 's' : ''} found
            </p>
          </div>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map(e => <ExamCardItem key={e.id} exam={e} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">No Exams Found</h2>
            <p className="text-gray-400 mt-2 text-sm max-w-md mx-auto">
              {searchQuery
                ? `No exams match "${searchQuery}". Try a different search.`
                : `No ${activeCategory} exams published yet. Check back soon!`}
            </p>
            <Link href="/exams"
              className="mt-6 inline-block text-orange-500 font-semibold text-sm hover:underline">
              ← View All Exams
            </Link>
          </div>
        )}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 grid grid-cols-4"
        style={{ height: 60 }}>
        <Link href="/"
          className="flex flex-col items-center justify-center gap-0.5 text-xs font-medium text-gray-500 hover:text-orange-500">
          <Home className="w-5 h-5" /> Home
        </Link>
        <Link href="/exams"
          className="flex flex-col items-center justify-center gap-0.5 text-xs font-medium text-orange-500">
          <Search className="w-5 h-5" /> Search
        </Link>
        <Link href="/tests"
          className="flex flex-col items-center justify-center gap-0.5 text-xs font-medium text-gray-500 hover:text-orange-500">
          <FileText className="w-5 h-5" /> Tests
        </Link>
        <Link href="/dashboard"
          className="flex flex-col items-center justify-center gap-0.5 text-xs font-medium text-gray-500 hover:text-orange-500">
          <BookOpen className="w-5 h-5" /> Profile
        </Link>
      </nav>
    </div>
  );
}
