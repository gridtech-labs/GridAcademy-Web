import { api } from '@/lib/api-client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { ExamCard } from '@/types/exam';
import {
  Search, BookOpen, FileText, Star,
  ChevronRight, Zap, TrendingUp, Users, Shield
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface ExamLevel { id: number; name: string; examCount: number; }

// ── Data fetching ─────────────────────────────────────────────────────────────
async function getHomeData(): Promise<{ exams: ExamCard[]; levels: ExamLevel[] }> {
  try {
    const [exams, levels] = await Promise.all([
      api.get<ExamCard[]>('/api/exams?activeOnly=true').catch(() => [] as ExamCard[]),
      api.get<any>('/api/exams/levels').catch(() => [] as ExamLevel[]),
    ]);
    return {
      exams: Array.isArray(exams) ? exams : (exams as any)?.data ?? [],
      levels: Array.isArray(levels) ? levels : (levels as any)?.data ?? [],
    };
  } catch {
    return { exams: [], levels: [] };
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

// ── Featured Banner ───────────────────────────────────────────────────────────
function FeaturedBanner({ exam }: { exam: ExamCard }) {
  const desc = stripHtml(exam.shortDescription);
  return (
    <Link href={`/exam/${exam.slug}`} className="block group">
      <div className="relative h-52 md:h-68 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800">
        {(exam.bannerUrl || exam.thumbnailUrl) && (
          <img src={exam.bannerUrl ?? exam.thumbnailUrl!} alt={exam.title}
            className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-35 transition-opacity" />
        )}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-900" /> Featured
          </span>
          {exam.priceInr === 0 && (
            <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3" /> Free
            </span>
          )}
        </div>
        <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8">
          <div className="max-w-xl">
            {exam.examLevelName && (
              <span className="text-indigo-200 text-xs font-medium uppercase tracking-wide">
                {exam.examLevelName} · {exam.examTypeName ?? exam.conductingBody}
              </span>
            )}
            <h2 className="text-white text-xl md:text-2xl font-bold mt-1 leading-tight group-hover:text-indigo-100 transition-colors">
              {exam.title}
            </h2>
            {desc && (
              <p className="text-indigo-200 text-sm mt-1.5 line-clamp-2 hidden sm:block">{desc}</p>
            )}
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1 text-indigo-200 text-sm">
                <FileText className="w-4 h-4" /> {exam.testCount} Tests
              </span>
              <span className="text-white font-bold text-base">
                {formatPrice(exam.priceInr)}
              </span>
              <span className="ml-auto bg-white text-indigo-700 text-sm font-semibold px-4 py-1.5 rounded-full
                group-hover:bg-indigo-50 transition-colors flex items-center gap-1">
                Start Practicing <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Exam Card ─────────────────────────────────────────────────────────────────
function ExamCardItem({ exam }: { exam: ExamCard }) {
  const desc = stripHtml(exam.shortDescription);
  return (
    <Link href={`/exam/${exam.slug}`}
      className="group flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden
        hover:shadow-md hover:border-indigo-200 transition-all duration-200">
      <div className="relative h-32 bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden shrink-0">
        {exam.thumbnailUrl ? (
          <img src={exam.thumbnailUrl} alt={exam.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-white/40" />
          </div>
        )}
        {exam.examLevelName && (
          <span className="absolute top-2 left-2 bg-white/90 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full">
            {exam.examLevelName}
          </span>
        )}
        {exam.isFeatured && (
          <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">⭐</span>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-indigo-500 font-medium truncate">
          {exam.conductingBody ?? exam.examTypeName ?? 'Government Exam'}
        </p>
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mt-0.5 group-hover:text-indigo-600 transition-colors leading-snug">
          {exam.title}
        </h3>
        {desc && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2 hidden sm:block">{desc}</p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 mt-2">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <FileText className="w-3 h-3" /> {exam.testCount} Tests
          </span>
          <span className={`text-sm font-bold ${exam.priceInr === 0 ? 'text-green-600' : 'text-gray-900'}`}>
            {formatPrice(exam.priceInr)}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const { exams, levels } = await getHomeData();
  const featured     = exams.filter(e => e.isFeatured);
  const latest       = exams.slice(0, 12);
  const activeLevels = levels.filter(l => l.examCount > 0);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">

        {/* ── Compact Hero ─────────────────────────────────────────── */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7 md:py-9">
            <div className="flex flex-col md:flex-row md:items-center gap-5">
              <div className="md:w-1/2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                  India's Exam Prep Platform —{' '}
                  <span className="text-indigo-600">Practice. Perform. Succeed.</span>
                </h1>
                <p className="text-gray-500 mt-2 text-sm md:text-base">
                  Free mock tests for RRB, SSC, Banking, UPSC & more.
                </p>
                <div className="flex gap-3 mt-4">
                  <Link href="/exams"
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-colors">
                    Browse Exams <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link href="/register"
                    className="inline-flex items-center gap-2 border border-indigo-200 text-indigo-600 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-indigo-50 transition-colors">
                    Sign Up Free
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" placeholder="Search exams, mock tests..."
                    className="w-full pl-12 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-full
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm" />
                </div>
                <div className="flex gap-5 mt-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-indigo-400" /> {exams.length}+ Exams</span>
                  <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-indigo-400" /> Free Tests</span>
                  <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-indigo-400" /> Verified</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Category Tabs (Udemy-style) ──────────────────────────── */}
        {activeLevels.length > 0 && (
          <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <nav className="flex items-center overflow-x-auto scrollbar-hide h-11 gap-0">
                <Link href="/exams"
                  className="shrink-0 px-4 h-full flex items-center text-sm font-semibold text-indigo-600
                    border-b-2 border-indigo-600 whitespace-nowrap">
                  All Exams
                </Link>
                {activeLevels.map(level => (
                  <Link key={level.id} href={`/exams?level=${level.id}`}
                    className="shrink-0 px-4 h-full flex items-center text-sm text-gray-600 border-b-2 border-transparent
                      hover:text-gray-900 hover:border-gray-300 transition-colors whitespace-nowrap">
                    {level.name}
                    <span className="ml-1 text-xs text-gray-400">({level.examCount})</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7 space-y-8">

          {/* ── Featured Exam Banner ─────────────────────────────────── */}
          {featured.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2 uppercase tracking-wide">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> Featured
              </h2>
              <FeaturedBanner exam={featured[0]} />
              {featured.length > 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {featured.slice(1, 3).map(e => <ExamCardItem key={e.id} exam={e} />)}
                </div>
              )}
            </section>
          )}

          {/* ── Latest Exams Grid ────────────────────────────────────── */}
          {latest.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-900">
                  {featured.length > 0 ? 'All Exams' : 'Available Exams'}
                </h2>
                <Link href="/exams"
                  className="text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1">
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                {latest.map(e => <ExamCardItem key={e.id} exam={e} />)}
              </div>
            </section>
          )}

          {/* ── Empty state ──────────────────────────────────────────── */}
          {exams.length === 0 && (
            <section className="text-center py-20">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700">Exams Coming Soon</h2>
              <p className="text-gray-400 mt-2 text-sm max-w-md mx-auto">
                We're adding new exams and mock tests. Register to get notified when they go live.
              </p>
              <Link href="/register"
                className="mt-6 inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-indigo-700">
                Get Notified <ChevronRight className="w-4 h-4" />
              </Link>
            </section>
          )}

          {/* ── Provider CTA ─────────────────────────────────────────── */}
          <section className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-700 p-6 md:p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <h2 className="text-lg md:text-xl font-bold">Are you a coaching institute or educator?</h2>
                <p className="text-indigo-200 text-sm mt-1">
                  Upload your question bank, create mock tests and reach lakhs of aspirants across India.
                </p>
              </div>
              <Link href="/provider/register"
                className="shrink-0 bg-white text-indigo-700 px-6 py-2.5 rounded-full text-sm font-bold
                  hover:bg-indigo-50 transition-colors flex items-center gap-2 w-fit">
                <Users className="w-4 h-4" /> Become a Provider
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
