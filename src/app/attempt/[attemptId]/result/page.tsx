export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { api } from '@/lib/api-client';
import { AttemptResult } from '@/types/exam';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import ResultAnswerKey from '@/components/exam/ResultAnswerKey';
import {
  CheckCircle, XCircle, Clock, Trophy,
  BarChart2, Target, Home, RefreshCw,
} from 'lucide-react';

interface PageProps { params: { attemptId: string } }

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
      `/api/assessment/attempts/${params.attemptId}/result`, token,
    );
    if (!data) redirect('/dashboard');
    result = data;
  } catch { redirect('/dashboard'); }

  const pct         = Math.round(result.percentage);
  const submittedAt = new Date(result.submittedAt).toLocaleString('en-IN', {
    dateStyle: 'medium', timeStyle: 'short',
  });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero scorecard ─────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg,#0f0c29 0%,#1e1b4b 45%,#312e81 80%,#1e3a5f 100%)' }}>
        {/* Decorative glow */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: result.isPassed
              ? 'radial-gradient(ellipse at 50% 0%,rgba(34,197,94,.18),transparent 60%)'
              : 'radial-gradient(ellipse at 50% 0%,rgba(249,115,22,.15),transparent 60%)' }} />

          <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-12 text-center relative z-10">

            {/* Test title */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-orange-400" />
              <span className="text-orange-300 text-sm font-semibold uppercase tracking-wide">Test Completed</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white mb-1 line-clamp-2">{result.testTitle}</h1>
            <p className="text-indigo-300/70 text-sm mb-8">{result.studentName} · {submittedAt}</p>

            {/* Score ring */}
            <div className="inline-flex flex-col items-center justify-center w-36 h-36 rounded-full mb-6 relative"
              style={{
                background: result.isPassed
                  ? 'linear-gradient(135deg,rgba(34,197,94,.25),rgba(16,185,129,.15))'
                  : 'linear-gradient(135deg,rgba(249,115,22,.2),rgba(239,68,68,.15))',
                border: `3px solid ${result.isPassed ? 'rgba(34,197,94,.4)' : 'rgba(249,115,22,.4)'}`,
                boxShadow: result.isPassed
                  ? '0 0 40px rgba(34,197,94,.2)'
                  : '0 0 40px rgba(249,115,22,.2)',
              }}>
              <span className="text-5xl font-extrabold text-white leading-none">{pct}%</span>
              <span className="text-xs text-white/60 mt-1">Score</span>
            </div>

            {/* Pass / Fail badge */}
            <div className="flex items-center justify-center gap-3 mb-6">
              {result.isPassed ? (
                <span className="flex items-center gap-1.5 text-sm font-bold px-5 py-2 rounded-full"
                  style={{ background: 'rgba(34,197,94,.2)', border: '1px solid rgba(34,197,94,.4)', color: '#86efac' }}>
                  <CheckCircle className="w-4 h-4" /> Passed
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-sm font-bold px-5 py-2 rounded-full"
                  style={{ background: 'rgba(239,68,68,.2)', border: '1px solid rgba(239,68,68,.4)', color: '#fca5a5' }}>
                  <XCircle className="w-4 h-4" /> Not Passed
                </span>
              )}
              <span className="text-sm px-3 py-2 rounded-full text-indigo-200"
                style={{ background: 'rgba(255,255,255,.08)' }}>
                Passing: {result.passingPercent}%
              </span>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: 'Marks', value: `${result.totalMarksObtained} / ${result.totalMarksPossible}` },
                { label: 'Time Taken', value: formatDuration(result.durationSecondsUsed), icon: Clock },
                ...(result.violationCount > 0 ? [{ label: 'Violations', value: String(result.violationCount), warn: true }] : []),
              ].map((s: any) => (
                <div key={s.label} className="rounded-2xl px-5 py-3 text-center"
                  style={{ background: s.warn ? 'rgba(239,68,68,.2)' : 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.1)' }}>
                  <p className="text-white font-bold text-lg flex items-center justify-center gap-1">
                    {s.icon && <s.icon className="w-4 h-4 text-indigo-300" />}
                    {s.value}
                  </p>
                  <p className="text-indigo-300/70 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Details ────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Section breakdown */}
        {result.sections.length > 0 && (
          <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                <BarChart2 className="w-4 h-4 text-indigo-600" />
              </div>
              <h2 className="font-bold text-gray-900">Section-wise Breakdown</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide border-b border-gray-100">
                    <th className="text-left py-3 px-5 font-semibold">Section</th>
                    <th className="text-center py-3 px-3 font-semibold">Attempted</th>
                    <th className="text-center py-3 px-3 font-semibold text-green-700">Correct</th>
                    <th className="text-center py-3 px-3 font-semibold text-red-600">Wrong</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-400">Skipped</th>
                    <th className="text-center py-3 px-3 font-semibold">Score</th>
                    <th className="text-center py-3 px-3 font-semibold">Accuracy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {result.sections.map((sec, i) => {
                    const accuracy = sec.attempted > 0
                      ? Math.round((sec.correct / sec.attempted) * 100) : 0;
                    return (
                      <tr key={i} className="hover:bg-orange-50/30 transition-colors">
                        <td className="py-3.5 px-5 font-medium text-gray-900">{sec.sectionName}</td>
                        <td className="py-3.5 px-3 text-center text-gray-700">{sec.attempted}</td>
                        <td className="py-3.5 px-3 text-center text-green-700 font-semibold">{sec.correct}</td>
                        <td className="py-3.5 px-3 text-center text-red-600 font-semibold">{sec.incorrect}</td>
                        <td className="py-3.5 px-3 text-center text-gray-400">{sec.unattempted}</td>
                        <td className="py-3.5 px-3 text-center font-bold text-gray-900">
                          {sec.marksObtained} / {sec.maxMarks}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            accuracy >= 70 ? 'bg-green-100 text-green-700'
                            : accuracy >= 40 ? 'bg-yellow-100 text-yellow-700'
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

        {/* Answer key */}
        {result.questions.length > 0 && (
          <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-indigo-600" />
              </div>
              <h2 className="font-bold text-gray-900">Answer Key</h2>
              <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
                {result.questions.filter(q => q.isCorrect).length} / {result.questions.length} correct
              </span>
            </div>
            <ResultAnswerKey questions={result.questions} />
          </section>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pb-6">
          <Link href="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
          <Link href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors">
            <RefreshCw className="w-4 h-4" />
            Browse More Tests
          </Link>
        </div>
      </div>
    </div>
  );
}
