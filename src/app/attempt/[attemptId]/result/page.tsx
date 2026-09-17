export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { authOptions } from '@/lib/auth-options';
import { api } from '@/lib/api-client';
import { AttemptResult } from '@/types/exam';
import Header from '@/components/layout/Header';
import ResultAnswerKey from '@/components/exam/ResultAnswerKey';

interface PageProps { params: { attemptId: string } }

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`;
  if (m > 0) return `${m}m ${String(s).padStart(2, '0')}s`;
  return `${s}s`;
}

const num = (n: number) => Number(n.toFixed(2)).toLocaleString('en-IN');

export default async function ResultPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/login?callbackUrl=/attempt/${params.attemptId}/result`);

  const token = (session.user as any).accessToken as string;
  let result: AttemptResult;
  try {
    const data = await api.get<AttemptResult>(`/api/assessment/attempts/${params.attemptId}/result`, token);
    if (!data) redirect('/dashboard');
    result = data;
  } catch { redirect('/dashboard'); }

  const submittedAt = new Date(result.submittedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  const attempted = result.sections.reduce((n, s) => n + s.attempted, 0);
  const correct = result.sections.reduce((n, s) => n + s.correct, 0);
  const unattempted = result.sections.reduce((n, s) => n + s.unattempted, 0);
  const totalQuestions = result.sections.reduce((n, s) => n + s.totalQuestions, 0) || result.questions.length;
  const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-paper text-ink">
        <div className="max-w-[1240px] mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col gap-5 md:gap-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-[13.5px] text-[#667085]">Result · submitted {submittedAt}</p>
              <h1 className="text-2xl md:text-[32px] font-bold leading-tight mt-1.5">{result.testTitle}</h1>
            </div>
            <div className="flex gap-2.5">
              <Link href="/dashboard" className="h-11 inline-flex items-center px-[18px] rounded-lg border border-[#d0d5dd] bg-white font-semibold text-[15px] hover:bg-paper">
                My dashboard
              </Link>
              <Link href="/dashboard/available" className="h-11 inline-flex items-center px-[18px] rounded-lg bg-primary text-white font-semibold text-[15px] hover:bg-primary-dark">
                Find next test
              </Link>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr] gap-3 md:gap-4">
            <div className="col-span-2 lg:col-span-1 rounded-xl bg-ink text-white p-5 md:p-[22px] flex flex-col gap-2">
              <p className="text-[13.5px] text-ink-muted">Score</p>
              <p className="font-mono font-semibold leading-none text-[40px] md:text-[44px]">
                {num(result.totalMarksObtained)}<span className="text-[22px] text-ink-muted"> / {num(result.totalMarksPossible)}</span>
              </p>
              <div className="flex items-center gap-2 flex-wrap mt-1">
                <span className={`h-[26px] inline-flex items-center px-2.5 rounded-full text-[12.5px] font-semibold ${result.isPassed ? 'bg-[#12803c] text-white' : 'bg-[#d92d20] text-white'}`}>
                  {result.isPassed ? 'Passed' : 'Not passed'}
                </span>
                <span className="text-[13.5px] text-ink-muted">{num(result.percentage)}% · pass mark {num(result.passingPercent)}%</span>
              </div>
            </div>
            {[
              ['Accuracy', `${accuracy.toFixed(1)}%`, `${correct} correct of ${attempted} attempted`],
              ['Attempted', `${attempted}/${totalQuestions}`, `${unattempted} left unattempted`],
              ['Time used', formatDuration(result.durationSecondsUsed), result.negativeMarkingEnabled ? 'Negative marking applied' : 'No negative marking'],
            ].map(([k, v, s]) => (
              <div key={k} className="rounded-xl bg-white border border-line p-4 md:p-[22px] flex flex-col gap-1.5 md:gap-2">
                <p className="text-[13.5px] text-[#667085]">{k}</p>
                <p className="font-mono font-semibold text-2xl md:text-[32px] leading-tight">{v}</p>
                <p className="text-[12.5px] md:text-[13.5px] text-[#475467]">{s}</p>
              </div>
            ))}
          </div>

          {result.violationCount > 0 && (
            <p className="flex items-center gap-2.5 text-sm text-[#8a5200] bg-[#fef3dc] rounded-lg px-4 py-3">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {result.violationCount} tab switch{result.violationCount === 1 ? ' was' : 'es were'} recorded during this test.
            </p>
          )}

          {/* Section-wise */}
          {result.sections.length > 0 && (
            <section className="bg-white border border-line rounded-xl overflow-hidden">
              <h2 className="px-5 py-[18px] text-[17px] font-semibold">Section-wise</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-[14.5px] min-w-[640px]">
                  <thead>
                    <tr className="bg-[#f9fafb] border-y border-line text-[12.5px] text-[#475467] text-left">
                      <th className="font-semibold px-5 py-2.5">Section</th>
                      <th className="font-semibold px-3 py-2.5">Marks</th>
                      <th className="font-semibold px-3 py-2.5 w-[200px]"><span className="sr-only">Marks bar</span></th>
                      <th className="font-semibold px-3 py-2.5">Correct</th>
                      <th className="font-semibold px-3 py-2.5">Incorrect</th>
                      <th className="font-semibold px-3 py-2.5">Unattempted</th>
                      <th className="font-semibold px-3 py-2.5">Accuracy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.sections.map(sec => {
                      const pct = sec.maxMarks > 0 ? Math.max(0, Math.min(100, (sec.marksObtained / sec.maxMarks) * 100)) : 0;
                      return (
                        <tr key={sec.sectionIndex} className="border-b border-[#eef0f3] last:border-0">
                          <td className="px-5 py-3.5 font-semibold">{sec.sectionName}</td>
                          <td className="px-3 py-3.5 font-mono whitespace-nowrap">{num(sec.marksObtained)}/{num(sec.maxMarks)}</td>
                          <td className="px-3 py-3.5">
                            <div className="h-2 rounded bg-[#eef1f5] overflow-hidden"><div className="h-2 bg-primary" style={{ width: `${pct}%` }} /></div>
                          </td>
                          <td className="px-3 py-3.5 font-mono text-[#0b6b31]">{sec.correct}</td>
                          <td className="px-3 py-3.5 font-mono text-[#b42318]">{sec.incorrect}</td>
                          <td className="px-3 py-3.5 font-mono text-[#475467]">{sec.unattempted}</td>
                          <td className="px-3 py-3.5 font-mono">{sec.attempted > 0 ? `${Math.round((sec.correct / sec.attempted) * 100)}%` : '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Answers & solutions */}
          {result.questions.length > 0 && (
            <section className="bg-white border border-line rounded-xl overflow-hidden">
              <h2 className="px-5 pt-[18px] pb-1 text-[17px] font-semibold">Answers &amp; solutions</h2>
              <ResultAnswerKey questions={result.questions} />
            </section>
          )}
        </div>
      </main>
    </>
  );
}
