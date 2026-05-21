export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { api, UnauthorizedError } from '@/lib/api-client';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  BarChart2, Trophy, CheckCircle2, XCircle, TrendingUp,
  Clock, Eye, BookOpen, Target, Layers,
} from 'lucide-react';

// ── Types matching backend MyPerformanceDto ───────────────────────────────────

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
  const sec = s % 60;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    return `${h}h ${m % 60}m`;
  }
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Accuracy ring as a simple SVG arc
function AccuracyRing({ pct, passed }: { pct: number; passed: boolean }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" className="shrink-0">
      <circle cx="30" cy="30" r={r} fill="none" stroke="#e5e7eb" strokeWidth="5" />
      <circle
        cx="30" cy="30" r={r}
        fill="none"
        stroke={passed ? '#22c55e' : '#ef4444'}
        strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 30 30)"
      />
      <text x="30" y="35" textAnchor="middle" fontSize="11" fontWeight="700"
        fill={passed ? '#16a34a' : '#dc2626'}>
        {Math.round(pct)}%
      </text>
    </svg>
  );
}

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
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <BarChart2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600 font-medium">Could not load performance data</p>
        <p className="text-sm text-gray-400 mt-1">Please try again later</p>
      </div>
    );
  }

  const passRate = perf.totalAttempts > 0
    ? Math.round((perf.passedCount / perf.totalAttempts) * 100)
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-indigo-500" />
          Test Performance
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Your overall results and attempt history
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          {
            label: 'Total Attempts',
            value: perf.totalAttempts,
            icon: BookOpen,
            color: 'text-indigo-600 bg-indigo-50',
          },
          {
            label: 'Passed',
            value: perf.passedCount,
            icon: CheckCircle2,
            color: 'text-green-600 bg-green-50',
          },
          {
            label: 'Failed',
            value: perf.failedCount,
            icon: XCircle,
            color: 'text-red-500 bg-red-50',
          },
          {
            label: 'Pass Rate',
            value: `${passRate}%`,
            icon: Target,
            color: 'text-purple-600 bg-purple-50',
          },
          {
            label: 'Best Score',
            value: perf.bestPercentage != null ? `${Math.round(perf.bestPercentage)}%` : '—',
            icon: Trophy,
            color: 'text-amber-600 bg-amber-50',
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 ${color}`}>
              <Icon className="w-4.5 h-4.5" />
            </div>
            <div className="text-2xl font-extrabold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Average score banner (only when there are attempts) */}
      {perf.averagePercentage != null && perf.totalAttempts > 0 && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-5 text-white flex items-center gap-4">
          <TrendingUp className="w-8 h-8 text-indigo-200 shrink-0" />
          <div>
            <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest">Average Score</p>
            <p className="text-3xl font-extrabold mt-0.5">
              {perf.averagePercentage.toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      {/* Attempt history */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            Attempt History
          </h2>
          <span className="text-xs text-gray-400">{perf.attempts.length} total</span>
        </div>

        {perf.attempts.length === 0 ? (
          <div className="text-center py-16">
            <BarChart2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No completed tests yet</p>
            <p className="text-sm text-gray-400 mt-1">Your results will appear here after you complete a test</p>
            <Link
              href="/dashboard"
              className="inline-block mt-4 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700"
            >
              Go to My Tests
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {perf.attempts.map(attempt => {
              const pct    = Math.round(attempt.percentage);
              const passed = attempt.isPassed;

              return (
                <div key={attempt.attemptId} className="px-6 py-5 hover:bg-gray-50 transition-colors">

                  {/* Row top: score ring + info + result link */}
                  <div className="flex items-start gap-4">
                    <AccuracyRing pct={attempt.percentage} passed={passed} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 text-sm leading-snug truncate">
                            {attempt.testTitle}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDuration(attempt.durationSecondsUsed)}
                            </span>
                            <span>{formatDate(attempt.submittedAt)}</span>
                            <span className="font-semibold text-gray-700">
                              {attempt.totalMarksObtained} / {attempt.totalMarksPossible} marks
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                            passed
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-red-50 text-red-600 border-red-200'
                          }`}>
                            {passed ? '✓ Passed' : '✗ Failed'}
                          </span>
                          <Link
                            href={`/attempt/${attempt.attemptId}/result`}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View Result
                          </Link>
                        </div>
                      </div>

                      {/* Section breakdown */}
                      {attempt.sections.length > 0 && (
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {attempt.sections.map(sec => {
                            const accuracy = sec.attempted > 0
                              ? Math.round((sec.correct / sec.attempted) * 100)
                              : 0;
                            return (
                              <div key={sec.sectionIndex}
                                className="bg-gray-50 rounded-xl px-3 py-2.5 text-xs border border-gray-100">
                                <div className="flex items-center gap-1 mb-1.5">
                                  <Layers className="w-3 h-3 text-gray-400 shrink-0" />
                                  <span className="font-semibold text-gray-700 truncate">{sec.sectionName}</span>
                                </div>
                                <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-gray-500">
                                  <span className="text-green-600 font-semibold">✓ {sec.correct}</span>
                                  <span className="text-red-500 font-semibold">✗ {sec.incorrect}</span>
                                  <span>— {sec.unattempted}</span>
                                  <span className="ml-auto font-semibold text-gray-700">
                                    {sec.marksObtained}/{sec.maxMarks}
                                  </span>
                                </div>
                                {sec.attempted > 0 && (
                                  <div className="mt-1.5 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-indigo-500 rounded-full"
                                      style={{ width: `${accuracy}%` }}
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
