export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { api, UnauthorizedError } from '@/lib/api-client';
import { redirect } from 'next/navigation';
import Link from 'next/link';

// Matches backend MyPerformanceDto
interface SectionResult {
  sectionName: string;
  sectionIndex: number;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  marksObtained: number;
  maxMarks: number;
}

interface PerformanceAttempt {
  attemptId: string;
  testTitle: string;
  submittedAt: string;
  durationSecondsUsed: number;
  totalMarksObtained: number;
  totalMarksPossible: number;
  percentage: number;
  isPassed: boolean;
  passingPercent: number;
  violationCount: number;
  sections: SectionResult[];
}

interface MyPerformance {
  totalAttempts: number;
  passedCount: number;
  failedCount: number;
  averagePercentage: number | null;
  bestPercentage: number | null;
  attempts: PerformanceAttempt[];
}

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  if (m >= 60) return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m`;
  return m > 0 ? `${m}m ${String(s % 60).padStart(2, '0')}s` : `${s}s`;
}

const num = (n: number) => Number(n.toFixed(2)).toLocaleString('en-IN');

export default async function PerformancePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  const token = (session.user as any).accessToken as string;

  let perf: MyPerformance | null = null;
  try {
    perf = await api.get<MyPerformance>('/api/assessment/my-performance', token);
  } catch (e: any) {
    if (e instanceof UnauthorizedError) redirect('/api/auth/signout?callbackUrl=/login');
    console.error('[performance] fetch error:', e?.message);
  }

  if (!perf) {
    return (
      <div className="bg-white border border-line rounded-xl px-6 py-14 text-center">
        <p className="text-lg font-semibold">Couldn’t load your performance</p>
        <p className="text-[15px] text-[#475467] mt-1">Please try again in a moment.</p>
      </div>
    );
  }

  const passRate = perf.totalAttempts > 0 ? Math.round((perf.passedCount / perf.totalAttempts) * 100) : 0;
  const stats = [
    { label: 'Attempts',  value: String(perf.totalAttempts) },
    { label: 'Passed',    value: String(perf.passedCount) },
    { label: 'Pass rate', value: `${passRate}%` },
    { label: 'Average',   value: perf.averagePercentage != null ? `${perf.averagePercentage.toFixed(1)}%` : '—' },
    { label: 'Best',      value: perf.bestPercentage != null ? `${Math.round(perf.bestPercentage)}%` : '—' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white border border-line rounded-xl p-4 md:p-5">
            <dt className="text-[13.5px] text-[#667085]">{s.label}</dt>
            <dd className="font-mono font-semibold text-[26px] leading-tight mt-1">{s.value}</dd>
          </div>
        ))}
      </dl>

      <section className="bg-white border border-line rounded-xl overflow-hidden">
        <h2 className="px-5 py-4 text-[17px] font-semibold border-b border-line">Attempt history</h2>

        {perf.attempts.length === 0 ? (
          <div className="px-6 py-14 text-center flex flex-col items-center gap-3">
            <p className="text-lg font-semibold">No completed tests yet</p>
            <p className="text-[15px] text-[#475467]">Your results appear here after you submit a test.</p>
            <Link href="/dashboard" className="h-11 inline-flex items-center px-5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark mt-1">
              Go to my tests
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-[#eef0f3]">
            {perf.attempts.map(a => (
              <li key={a.attemptId} className="px-5 py-5 flex flex-col gap-3.5">
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-[15.5px] leading-snug">{a.testTitle}</p>
                      <span className={`h-[22px] inline-flex items-center px-2 rounded-full text-[11.5px] font-medium ${a.isPassed ? 'bg-[#e7f6ec] text-[#0b6b31]' : 'bg-[#fee4e2] text-[#b42318]'}`}>
                        {a.isPassed ? 'Passed' : 'Not passed'}
                      </span>
                    </div>
                    <p className="text-[13px] text-[#667085] mt-1.5">
                      {new Date(a.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {formatDuration(a.durationSecondsUsed)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <p className="text-right">
                      <span className="block font-mono font-semibold text-xl leading-none">{num(a.totalMarksObtained)}<span className="text-sm text-[#667085]"> / {num(a.totalMarksPossible)}</span></span>
                      <span className="block text-[12.5px] text-[#667085] mt-1">{num(a.percentage)}%</span>
                    </p>
                    <Link href={`/attempt/${a.attemptId}/result`}
                      className="h-9 inline-flex items-center px-3.5 rounded-[7px] border border-[#d0d5dd] text-sm font-semibold hover:bg-paper">
                      View result
                    </Link>
                  </div>
                </div>

                {a.sections.length > 0 && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {a.sections.map(sec => {
                      const pct = sec.maxMarks > 0 ? Math.max(0, Math.min(100, (sec.marksObtained / sec.maxMarks) * 100)) : 0;
                      return (
                        <div key={sec.sectionIndex} className="rounded-lg bg-paper border border-line px-3.5 py-3">
                          <div className="flex justify-between gap-2 text-sm">
                            <span className="font-medium truncate">{sec.sectionName}</span>
                            <span className="font-mono shrink-0">{num(sec.marksObtained)}/{num(sec.maxMarks)}</span>
                          </div>
                          <div className="h-1.5 rounded bg-[#e4e7ec] overflow-hidden mt-2"><div className="h-1.5 bg-primary" style={{ width: `${pct}%` }} /></div>
                          <p className="font-mono text-[12px] text-[#667085] mt-2">
                            <span className="text-[#0b6b31]">{sec.correct} correct</span> · <span className="text-[#b42318]">{sec.incorrect} wrong</span> · {sec.unattempted} skipped
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
