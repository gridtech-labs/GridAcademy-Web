export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import Link from 'next/link';
import { Check, ChevronRight, Lock } from 'lucide-react';
import { api } from '@/lib/api-client';
import { ExamDetail } from '@/types/exam';
import { getExamPageData } from '@/lib/exam-page-data';
import ExamTestList from '@/components/exam/ExamTestList';
import ExamBuyButton from '@/components/exam/ExamBuyButton';

interface PageProps { params: { slug: string }; searchParams?: { filter?: string } }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const exam = await api.get<ExamDetail>(`/api/exam-pages/${params.slug}`);
    if (!exam) return { title: 'Mock tests' };
    return {
      title: `${exam.title} — all mock tests`,
      description: `All ${exam.tests.length} mock tests for ${exam.title}: questions, duration and attempts for each test.`,
      alternates: { canonical: `https://www.gridacademy.in/exam/${params.slug}/tests` },
    };
  } catch { return { title: 'Mock tests' }; }
}

type Filter = 'all' | 'free' | 'paid';

export default async function ExamTestsPage({ params, searchParams }: PageProps) {
  const { exam, session, token, hasAccess, offers, tests, freeCount, paidCount, showUnlock } =
    await getExamPageData(params.slug);

  const filter: Filter = searchParams?.filter === 'free' || searchParams?.filter === 'paid' ? searchParams.filter : 'all';
  const numbered = tests.map((t, i) => ({ t, n: i + 1 }));
  const visible = numbered.filter(({ t }) => filter === 'all' || (filter === 'free' ? t.isFree : !t.isFree));

  // Summarise the pattern only when every test shares it
  const same = <K extends 'totalQuestions' | 'durationMinutes'>(k: K) =>
    tests.length > 0 && tests.every(t => t[k] === tests[0][k]) ? tests[0][k] : null;
  const q = same('totalQuestions');
  const d = same('durationMinutes');

  const chips: { key: Filter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: tests.length },
    ...(freeCount > 0 ? [{ key: 'free' as Filter, label: 'Free', count: freeCount }] : []),
    ...(paidCount > 0 ? [{ key: 'paid' as Filter, label: 'Paid', count: paidCount }] : []),
  ];
  const callbackUrl = `/exam/${exam.slug}/tests`;

  return (
    <div className="bg-white text-ink">
      <div className="max-w-[1328px] mx-auto px-4 md:px-6 lg:px-8 pt-6 md:pt-7 pb-12 md:pb-14 flex flex-col gap-5 md:gap-6">
        <div className="flex flex-col gap-3">
          <nav className="flex items-center gap-1.5 text-[13.5px] text-[#667085]" aria-label="Breadcrumb">
            <Link href={`/exam/${exam.slug}`} className="hover:text-primary-dark truncate max-w-[70vw]">{exam.title}</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" /><span>Mock tests</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-[26px] md:text-[34px] font-bold tracking-[-0.015em] leading-tight">{exam.title} — mock tests</h1>
              <p className="text-[15px] md:text-base text-[#475467] mt-2">
                {tests.length} test{tests.length === 1 ? '' : 's'}
                {q ? ` · ${q} questions` : ''}{d ? ` · ${d} minutes` : ''}
              </p>
            </div>
            {chips.length > 1 && (
              <div className="flex gap-2">
                {chips.map(c => (
                  <Link key={c.key} href={c.key === 'all' ? callbackUrl : `${callbackUrl}?filter=${c.key}`} scroll={false}
                    className={`h-9 inline-flex items-center px-3.5 rounded-full text-[13.5px] font-medium ${
                      c.key === filter ? 'bg-ink text-white' : 'bg-[#f2f4f7] text-[#344054] hover:bg-[#e4e7ec]'
                    }`}>
                    {c.label} {c.count}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {showUnlock && (
          <div id="unlock" className="scroll-mt-20 grid md:grid-cols-[auto_1fr_minmax(0,380px)] items-center gap-4 md:gap-5 p-4 md:px-5 rounded-xl bg-ink text-white">
            <span className="hidden md:flex w-[42px] h-[42px] rounded-[10px] bg-ink-soft items-center justify-center"><Lock className="w-5 h-5" /></span>
            <div>
              <p className="font-semibold text-base">{paidCount} test{paidCount === 1 ? ' is' : 's are'} part of one unlock</p>
              <p className="text-sm text-ink-muted mt-0.5">One payment for this exam opens every paid test. GST (18%) is shown before you pay.</p>
            </div>
            <ExamBuyButton
              layout="compact" examPageId={exam.id} examTitle={exam.title} examSlug={exam.slug}
              priceInr={exam.priceInr} paidTestCount={paidCount} token={token} offers={offers}
            />
          </div>
        )}
        {exam.priceInr > 0 && hasAccess && (
          <p className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#e7f6ec] text-[#0b6b31] font-semibold text-[15px]">
            <Check className="w-[18px] h-[18px]" strokeWidth={2.4} /> You own this exam · lifetime access to all {tests.length} tests
          </p>
        )}

        {visible.length > 0 ? (
          <ExamTestList
            tests={visible.map(v => v.t)} numbers={visible.map(v => v.n)}
            examPrice={exam.priceInr} hasAccess={hasAccess}
            isLoggedIn={!!session} token={token} callbackUrl={callbackUrl}
          />
        ) : (
          <p className="rounded-xl border border-dashed border-[#d0d5dd] p-8 text-center text-[#475467]">No tests match this filter.</p>
        )}
      </div>
    </div>
  );
}
