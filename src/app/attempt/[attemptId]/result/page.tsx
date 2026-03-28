export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { api } from '@/lib/api-client';
import { AttemptResult, QuestionResult } from '@/types/exam';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import ResultAnswerKey from '@/components/exam/ResultAnswerKey';
import {
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
  BarChart2,
  Target,
} from 'lucide-react';

interface PageProps {
  params: { attemptId: string };
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default async function ResultPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/login?callbackUrl=/attempt/${params.attemptId}/result`);

  const token = (session.user as any).accessToken as string;

  let result: AttemptResult;
  try {
    const data = await api.get<AttemptResult>(
      `/api/assessment/attempts/${params.attemptId}/result`,
      token,
    );
    if (!data) redirect('/dashboard');
    result = data;
  } catch {
    redirect('/dashboard');
  }

  const pct = Math.round(result.percentage);
  const scoreColor =
    result.isPassed
      ? 'text-green-600'
      : pct >= 40
      ? 'text-orange-500'
      : 'text-red-600';

  const submittedAt = new Date(result.submittedAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero scorecard ───────────────────────────────────────────────────── */}
      <div className={`${result.isPassed
        ? 'bg-gradient-to-br from-green-600 to-emerald-700'
        : 'bg-gradient-to-br from-indigo-700 to-purple-800'} text-white`}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-yellow-300" />
            <span className="text-sm font-semibold text-white/80">Test Completed</span>
          </div>

          <h1 className="text-xl md:text-2xl font-bold mb-1 line-clamp-2">{result.testTitle}</h1>
          <p className="text-white/70 text-sm mb-6">{result.studentName} &middot; {submittedAt}</p>

          {/* Big percentage */}
          <div className={`text-6xl md:text-7xl font-extrabold mb-2 ${
            result.isPassed ? 'text-white' : 'text-white/90'
          }`}>
            {pct}%
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            {result.isPassed ? (
              <span className="flex items-center gap-1.5 bg-white/20 text-white text-sm font-bold px-4 py-1.5 rounded-full">
                <CheckCircle className="w-4 h-4" />
                Passed
              </span>
            ) : (
              <span className="flex items-center gap-1.5 bg-white/20 text-white text-sm font-bold px-4 py-1.5 rounded-full">
                <XCircle className="w-4 h-4" />
                Not Passed
              </span>
            )}
            <span className="bg-white/10 text-white/80 text-sm px-3 py-1.5 rounded-full">
              Passing: {result.passingPercent}%
            </span>
          </div>

          {/* Quick stats row */}
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
            <div className="bg-white/10 rounded-xl px-4 py-2.5">
              <p className="text-white font-bold text-lg">
                {result.totalMarksObtained} / {result.totalMarksPossible}
              </p>
              <p className="text-white/70 text-xs">Marks</p>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-2.5">
              <p className="text-white font-bold text-lg flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDuration(result.durationSecondsUsed)}
              </p>
              <p className="text-white/70 text-xs">Time Taken</p>
            </div>
            {result.violationCount > 0 && (
              <div className="bg-red-400/30 rounded-xl px-4 py-2.5">
                <p className="text-white font-bold text-lg">{result.violationCount}</p>
                <p className="text-white/70 text-xs">Violations</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── Section breakdown ────────────────────────────────────────────────── */}
        {result.sections.length > 0 && (
          <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-indigo-500" />
              <h2 className="font-bold text-gray-900">Section-wise Breakdown</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
                    <th className="text-left py-3 px-5 font-semibold">Section</th>
                    <th className="text-center py-3 px-3 font-semibold">Attempted</th>
                    <th className="text-center py-3 px-3 font-semibold text-green-600">Correct</th>
                    <th className="text-center py-3 px-3 font-semibold text-red-600">Wrong</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-400">Skipped</th>
                    <th className="text-center py-3 px-3 font-semibold">Score</th>
                    <th className="text-center py-3 px-3 font-semibold">Accuracy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {result.sections.map((sec, i) => {
                    const accuracy = sec.attempted > 0
                      ? Math.round((sec.correct / sec.attempted) * 100)
                      : 0;
                    return (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3.5 px-5 font-medium text-gray-900">{sec.sectionName}</td>
                      <td className="py-3.5 px-3 text-center text-gray-700">{sec.attempted}</td>
                      <td className="py-3.5 px-3 text-center text-green-700 font-semibold">{sec.correct}</td>
                      <td className="py-3.5 px-3 text-center text-red-600 font-semibold">{sec.incorrect}</td>
                      <td className="py-3.5 px-3 text-center text-gray-400">{sec.unattempted}</td>
                      <td className="py-3.5 px-3 text-center font-bold text-gray-900">
                        {sec.marksObtained} / {sec.maxMarks}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                          accuracy >= 70
                            ? 'bg-green-100 text-green-700'
                            : accuracy >= 40
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {accuracy}%
                        </span>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── Answer Key ──────────────────────────────────────────────────────── */}
        {result.questions.length > 0 && (
          <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" />
              <h2 className="font-bold text-gray-900">Answer Key</h2>
              <span className="ml-auto text-xs text-gray-500">
                {result.questions.filter(q => q.isCorrect).length} / {result.questions.length} correct
              </span>
            </div>
            <ResultAnswerKey questions={result.questions} />
          </section>
        )}

        {/* ── Actions ─────────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-4 justify-center pb-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
          >
            Browse More Tests
          </Link>
        </div>
      </div>
    </div>
  );
}
