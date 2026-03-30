import { api } from '@/lib/api-client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroBanner from '@/components/home/HeroBanner';
import TestCard from '@/components/ui/TestCard';
import SectionHeading from '@/components/ui/SectionHeading';
import Link from 'next/link';
import { BookOpen, Target, BarChart3, Trophy, Users, Zap, ChevronRight } from 'lucide-react';

interface ExamCategory { id: number; name: string; slug: string; emoji: string | null; seriesCount: number; }
interface TestSeries { id: string; title: string; slug: string; examType: string; providerName: string; priceInr: number; isFirstTestFree: boolean; testCount: number; durationMinutes: number; avgRating: number; reviewCount: number; thumbnailUrl: string | null; publishedAt: string | null; }
interface HomeData { examCategories: ExamCategory[]; freeTests: TestSeries[]; topSelling: TestSeries[]; newArrivals: TestSeries[]; }

// Category emoji mapping
const EMOJI_MAP: Record<string, string> = {
  'rrb': '🚂', 'railway': '🚂', 'rail': '🚂',
  'ssc': '📋',
  'ibps': '🏦', 'sbi': '🏦', 'bank': '🏦',
  'upsc': '🏛️', 'ias': '🏛️',
  'police': '👮', 'constable': '👮',
  'defence': '⚔️', 'nda': '⚔️', 'cds': '⚔️',
  'psc': '🗺️', 'state': '🗺️',
  'teaching': '📚', 'ctet': '📚', 'tet': '📚',
  'insurance': '🛡️', 'lic': '🛡️',
};

function getCategoryEmoji(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, emoji] of Object.entries(EMOJI_MAP)) {
    if (lower.includes(key)) return emoji;
  }
  return '📝';
}

// Category background colors (cycling)
const CAT_COLORS = [
  'from-orange-500 to-red-500',
  'from-blue-500 to-indigo-600',
  'from-green-500 to-emerald-600',
  'from-purple-500 to-violet-600',
  'from-pink-500 to-rose-500',
  'from-cyan-500 to-blue-500',
  'from-amber-500 to-orange-500',
  'from-teal-500 to-green-500',
];

async function getHomeData(): Promise<HomeData> {
  try {
    const data = await api.get<{ data: HomeData }>('/api/storefront/home');
    const d = (data as any)?.data ?? data as any;
    return {
      examCategories: d?.examCategories ?? [],
      freeTests:      d?.freeTests      ?? [],
      topSelling:     d?.topSelling     ?? [],
      newArrivals:    d?.newArrivals    ?? [],
    };
  } catch {
    return { examCategories: [], freeTests: [], topSelling: [], newArrivals: [] };
  }
}

export default async function HomePage() {
  const { examCategories, freeTests, topSelling, newArrivals } = await getHomeData();

  // All published tests (combine and deduplicate by id)
  const allTests = Array.from(
    new Map([...freeTests, ...topSelling, ...newArrivals].map(t => [t.id, t])).values()
  );

  // Categories with at least 1 test
  const activeCategories = examCategories.filter(c => c.seriesCount > 0);
  // Categories coming soon
  const comingSoonCategories = examCategories.filter(c => c.seriesCount === 0).slice(0, 4);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <HeroBanner />

        {/* ── Available Tests ─────────────────────────────────────────── */}
        {allTests.length > 0 && (
          <section className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
              <SectionHeading
                title="Available Mock Tests"
                subtitle="High-quality tests from verified providers — start practicing today"
                linkHref="/tests"
                linkLabel="View all tests"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
                {allTests.slice(0, 8).map(s => <TestCard key={s.id} series={s as any} />)}
              </div>
            </div>
          </section>
        )}

        {/* ── Exam Categories ─────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <SectionHeading
            title="Browse by Exam Category"
            subtitle="Select your target exam and find the best mock tests"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {activeCategories.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/tests?examTypeId=${cat.id}`}
                className="group relative overflow-hidden rounded-2xl p-5 text-white
                  hover:scale-[1.02] hover:shadow-xl transition-all duration-200">
                <div className={`absolute inset-0 bg-gradient-to-br ${CAT_COLORS[i % CAT_COLORS.length]}`} />
                <div className="relative">
                  <div className="text-3xl mb-3">{getCategoryEmoji(cat.name)}</div>
                  <h3 className="font-bold text-sm leading-snug mb-1">{cat.name}</h3>
                  <p className="text-white/80 text-xs">
                    {cat.seriesCount} {cat.seriesCount === 1 ? 'test series' : 'test series'}
                  </p>
                </div>
                <ChevronRight className="absolute top-3 right-3 w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
              </Link>
            ))}

            {/* Coming soon placeholders */}
            {comingSoonCategories.map((cat) => (
              <div key={cat.id}
                className="relative overflow-hidden rounded-2xl p-5 bg-gray-100 border-2 border-dashed border-gray-200">
                <div className="text-3xl mb-3 grayscale opacity-50">{getCategoryEmoji(cat.name)}</div>
                <h3 className="font-bold text-sm text-gray-500 leading-snug mb-1">{cat.name}</h3>
                <span className="inline-block bg-gray-200 text-gray-500 text-[10px] font-semibold
                  px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Coming Soon
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── How It Works ─────────────────────────────────────────────── */}
        <section className="bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <SectionHeading
              title="How It Works"
              subtitle="Three simple steps to crack your dream exam"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {[
                {
                  step: '01', icon: Target, color: 'bg-indigo-100 text-indigo-600',
                  title: 'Choose Your Exam',
                  desc: 'Browse by exam category — SSC, Railway, Banking, UPSC and more. Find the right test series for your preparation.'
                },
                {
                  step: '02', icon: Zap, color: 'bg-green-100 text-green-600',
                  title: 'Start Practicing',
                  desc: 'Attempt full-length mock tests in a real exam environment with timer, question palette and auto-submit.'
                },
                {
                  step: '03', icon: BarChart3, color: 'bg-purple-100 text-purple-600',
                  title: 'Analyse & Improve',
                  desc: 'Get detailed performance reports, section-wise analysis, and identify your weak areas to improve.'
                },
              ].map(({ step, icon: Icon, color, title, desc }) => (
                <div key={step} className="flex gap-4">
                  <div className="shrink-0">
                    <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 tracking-widest">STEP {step}</span>
                    <h3 className="font-bold text-gray-900 mt-0.5 mb-2">{title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why GridAcademy ──────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <SectionHeading
            title="Why GridAcademy?"
            subtitle="Everything you need to crack your exam — in one place"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
            {[
              { icon: Trophy,    color: 'text-yellow-500 bg-yellow-50', title: 'Top Institutes',    desc: "Tests from India's leading coaching institutes and educators" },
              { icon: BarChart3, color: 'text-blue-500 bg-blue-50',     title: 'Detailed Analysis', desc: 'Section-wise performance, rank & percentile after every attempt' },
              { icon: Zap,       color: 'text-green-500 bg-green-50',   title: 'Real Exam Feel',    desc: 'Actual exam interface with timer, palette & negative marking' },
              { icon: Users,     color: 'text-purple-500 bg-purple-50', title: 'Free to Start',     desc: 'Free tests available for every exam. No credit card needed' },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Provider CTA ─────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12
            text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div className="relative">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-white/80" />
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Are you a coaching institute or educator?
              </h2>
              <p className="text-indigo-100 mb-6 max-w-xl mx-auto text-sm md:text-base">
                Upload your question bank, create mock tests, and earn{' '}
                <strong className="text-white">70% of every sale</strong>.
                Join GridAcademy as a test provider — it&apos;s free to get started.
              </p>
              <Link href="/register/provider"
                className="inline-block bg-white text-indigo-600 font-bold px-8 py-3 rounded-full
                  hover:bg-indigo-50 transition-colors shadow-lg text-sm md:text-base">
                Become a Provider &rarr;
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
