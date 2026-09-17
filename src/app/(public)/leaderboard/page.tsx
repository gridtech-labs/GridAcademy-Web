import Link from 'next/link';
import { ArrowRight, Trophy } from 'lucide-react';

// Hidden until the API returns real rankings — the page used to show invented students.
export default function LeaderboardPage() {
  return (
    <section className="bg-paper text-ink">
      <div className="max-w-[640px] mx-auto px-4 md:px-6 py-16 md:py-24 flex flex-col items-center text-center gap-5">
        <span className="w-14 h-14 rounded-xl bg-primary-tint text-primary-dark flex items-center justify-center">
          <Trophy className="w-7 h-7" />
        </span>
        <h1 className="text-[28px] md:text-[36px] font-bold leading-tight tracking-[-0.015em]">Leaderboard coming soon</h1>
        <p className="text-base md:text-[17px] leading-relaxed text-[#475467]">
          We&apos;re building rankings from real test attempts. Until then, your result page shows your score,
          section-wise performance and a solution for every question after each test.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link href="/exams"
            className="h-12 inline-flex items-center justify-center gap-2 px-6 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark">
            Find a mock test <ArrowRight className="w-[18px] h-[18px]" />
          </Link>
          <Link href="/dashboard"
            className="h-12 inline-flex items-center justify-center px-6 rounded-lg border border-[#d0d5dd] bg-white font-semibold hover:bg-paper">
            My results
          </Link>
        </div>
      </div>
    </section>
  );
}
