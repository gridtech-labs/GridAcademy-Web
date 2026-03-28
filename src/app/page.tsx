import { api } from '@/lib/api-client';
import { TestSeries } from '@/types';
import { ExamCard } from '@/types/exam';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroBanner from '@/components/home/HeroBanner';
import ExamCategoryBar from '@/components/home/ExamCategoryBar';
import TestCard from '@/components/ui/TestCard';
import TestCardSkeleton from '@/components/ui/TestCardSkeleton';
import SectionHeading from '@/components/ui/SectionHeading';
import ExamLevelSection from '@/components/home/ExamLevelSection';
import Link from 'next/link';

// SSR — fetch on every request so homepage always reflects latest data
async function getHomeData() {
  try {
    const [free, topSelling, newArrivals, exams] = await Promise.all([
      api.get<{ items: TestSeries[] }>('/api/storefront/tests?minPrice=0&maxPrice=0&page=1&pageSize=8'),
      api.get<{ items: TestSeries[] }>('/api/storefront/tests?sortBy=popular&page=1&pageSize=8'),
      api.get<{ items: TestSeries[] }>('/api/storefront/tests?sortBy=newest&page=1&pageSize=8'),
      api.get<ExamCard[]>('/api/exams?activeOnly=true').catch(() => [] as ExamCard[]),
    ]);
    return {
      free:        free?.items        ?? [],
      topSelling:  topSelling?.items  ?? [],
      newArrivals: newArrivals?.items ?? [],
      exams:       Array.isArray(exams) ? exams : [],
    };
  } catch {
    return { free: [], topSelling: [], newArrivals: [], exams: [] };
  }
}

export default async function HomePage() {
  const { free, topSelling, newArrivals, exams } = await getHomeData();

  return (
    <>
      <Header />

      <main className="min-h-screen">

        {/* Hero */}
        <HeroBanner />

        {/* Exam category pills */}
        <ExamCategoryBar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-14">

          {/* Browse Exams — only rendered when there is data */}
          {exams.length > 0 && (
            <section>
              <SectionHeading
                title="Browse Exams"
                subtitle="Explore government exams and get notified about tests, dates and cutoffs"
                linkHref="/exams"
                linkLabel="View all exams"
              />
              <ExamLevelSection exams={exams} />
            </section>
          )}

          {/* Free Tests */}
          <section>
            <SectionHeading
              title="Start for Free"
              subtitle="Try these high-quality mock tests at zero cost — no payment required"
              linkHref="/tests?free=true"
              linkLabel="View all free tests"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
              {free.length > 0
                ? free.map(s => <TestCard key={s.id} series={s} />)
                : Array.from({ length: 4 }).map((_, i) => <TestCardSkeleton key={i} />)
              }
            </div>
          </section>

          {/* Top Selling */}
          <section>
            <SectionHeading
              title="Top Selling Tests"
              subtitle="Most purchased test series by serious aspirants"
              linkHref="/tests?sortBy=popular"
              linkLabel="View all"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
              {topSelling.length > 0
                ? topSelling.map(s => <TestCard key={s.id} series={s} />)
                : Array.from({ length: 4 }).map((_, i) => <TestCardSkeleton key={i} />)
              }
            </div>
          </section>

          {/* New Arrivals */}
          <section>
            <SectionHeading
              title="New Arrivals"
              subtitle="Fresh tests just published — be the first to practice"
              linkHref="/tests?sortBy=newest"
              linkLabel="View all"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
              {newArrivals.length > 0
                ? newArrivals.map(s => <TestCard key={s.id} series={s} />)
                : Array.from({ length: 4 }).map((_, i) => <TestCardSkeleton key={i} />)
              }
            </div>
          </section>

          {/* Provider CTA */}
          <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Are you a coaching institute or educator?
            </h2>
            <p className="text-indigo-100 mb-6 max-w-xl mx-auto">
              Monetize your question bank. Thousands of aspirants are looking for quality tests.
              Join GridAcademy as a test provider and earn <strong>70% of every sale</strong>.
            </p>
            <Link
              href="/register/provider"
              className="inline-block bg-white text-indigo-600 font-bold px-8 py-3 rounded-full
                hover:bg-indigo-50 transition-colors shadow-md">
              Become a Provider &rarr;
            </Link>
          </section>

          {/* Why GridAcademy */}
          <section>
            <SectionHeading
              title="Why GridAcademy?"
              subtitle="Everything you need to crack your exam — in one place"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {[
                { icon: '🏆', title: 'Top Institutes', desc: "Tests curated by India's leading coaching institutes" },
                { icon: '📊', title: 'Detailed Analysis', desc: 'Section-wise performance, rank & percentile after every test' },
                { icon: '⚡', title: 'Real Exam Feel', desc: 'Actual exam interface with timer, question palette & anti-cheat' },
                { icon: '💰', title: 'Affordable Plans', desc: 'Free tests available. Premium series starting at ₹49 only' },
              ].map(f => (
                <div key={f.title}
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}
