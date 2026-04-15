import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { api, UnauthorizedError } from '@/lib/api-client';
import { redirect } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import {
  BookOpen, Clock, BarChart2, CheckCircle2,
  Play, RotateCcw, Eye, AlertCircle, CalendarClock,
  Trophy,
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DashboardStartButton from '@/components/exam/DashboardStartButton';

// ── Types mirroring StudentTestCardDto from the backend ──────────────────────
interface TestCard {
  assignmentId: string;
  testId: string;
  title: string;
  examTypeName: string;
  durationMinutes: number;
  totalQuestions: number;
  sectionCount: number;
  passingPercent: number;
  negativeMarkingEnabled: boolean;
  availableFrom: string;
  availableTo: string;
  maxAttempts: number;
  attemptsUsed: number;
  attemptsRemaining: number;
  hasInProgressAttempt: boolean;
  inProgressAttemptId?: string;
  lastCompletedAttemptId?: string;
}

// Status helper
function getStatus(t: TestCard, now: Date) {
  const from  = new Date(t.availableFrom);
  const to    = new Date(t.availableTo);
  if (now < from)  return { label: 'Scheduled',   cls: 'bg-yellow-100 text-yellow-700 border-yellow-200'  };
  if (now > to)    return { label: 'Expired',      cls: 'bg-gray-100    text-gray-500   border-gray-200'    };
  if (t.hasInProgressAttempt) return { label: 'In Progress', cls: 'bg-orange-100 text-orange-700 border-orange-200' };
  if (t.attemptsRemaining === 0) return { label: 'Completed', cls: 'bg-blue-100  text-blue-700   border-blue-200'   };
  return { label: 'Available',    cls: 'bg-green-100  text-green-700  border-green-200'  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  const token = (session.user as any).accessToken as string;
  const user  = session.user as any;

  // Fetch the student's test assignments from the LMS
  let tests: TestCard[] = [];
  try {
    tests = await api.get<TestCard[]>('/api/assessment/my-tests', token);
  } catch (e: any) {
    if (e instanceof UnauthorizedError) {
      // Token expired — force re-login to get a fresh token
      redirect('/api/auth/signout?callbackUrl=/login');
    }
    console.error('[dashboard] my-tests fetch error:', e?.message);
    // Other errors: show empty dashboard rather than crashing
  }

  const now = new Date();

  // ── Dashboard stats ────────────────────────────────────────────────────────
  const totalAssigned   = tests.length;
  const completed       = tests.filter(t => t.attemptsUsed > 0 && !t.hasInProgressAttempt && t.attemptsRemaining === 0).length;
  const inProgress      = tests.filter(t => t.hasInProgressAttempt).length;
  const available       = tests.filter(t => {
    const from = new Date(t.availableFrom);
    const to   = new Date(t.availableTo);
    return now >= from && now <= to && !t.hasInProgressAttempt && t.attemptsRemaining > 0;
  }).length;
  const totalAttempts   = tests.reduce((sum, t) => sum + t.attemptsUsed, 0);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

          {/* Welcome */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
            <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0] ?? 'Student'}! 👋</h1>
            <p className="text-indigo-100 text-sm mt-1">Continue your exam preparation</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: BookOpen,     label: 'Tests Assigned', value: totalAssigned,  color: 'text-indigo-600 bg-indigo-50' },
              { icon: CheckCircle2, label: 'Completed',       value: completed,      color: 'text-green-600  bg-green-50'  },
              { icon: Play,         label: 'In Progress',     value: inProgress,     color: 'text-orange-600 bg-orange-50' },
              { icon: BarChart2,    label: 'Total Attempts',  value: totalAttempts,  color: 'text-purple-600 bg-purple-50' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-extrabold text-gray-900">{value}</div>
                <div className="text-xs text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* My Tests */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-indigo-500" />
                My Tests
              </h2>
              <span className="text-xs text-gray-400">{totalAssigned} assigned</span>
            </div>

            {!tests.length ? (
              <div className="text-center py-16">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No tests assigned yet</p>
                <p className="text-sm text-gray-400 mt-1">Your instructor hasn&apos;t assigned any tests yet</p>
                <Link href="/tests"
                  className="inline-block mt-4 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700">
                  Browse Free Tests
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {tests.map(t => {
                  const from   = new Date(t.availableFrom);
                  const to     = new Date(t.availableTo);
                  const status = getStatus(t, now);
                  const isExpired   = now > to;
                  const isScheduled = now < from;
                  const canStart    = !isExpired && !isScheduled && t.attemptsRemaining > 0 && !t.hasInProgressAttempt;

                  return (
                    <div key={t.assignmentId}
                      className={`flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors ${isExpired ? 'opacity-60' : ''}`}>

                      {/* Icon */}
                      <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <p className="font-semibold text-gray-800 text-sm truncate">{t.title}</p>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${status.cls}`}>
                            {status.label}
                          </span>
                          {t.examTypeName && (
                            <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                              {t.examTypeName}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />{t.durationMinutes} min
                          </span>
                          <span className="flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />{t.totalQuestions} Q
                          </span>
                          <span className="flex items-center gap-1">
                            <RotateCcw className="w-3 h-3" />{t.attemptsUsed}/{t.maxAttempts} attempts
                          </span>
                          <span className="flex items-center gap-1">
                            <CalendarClock className="w-3 h-3" />
                            {formatDate(t.availableFrom)} – {formatDate(t.availableTo)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {t.lastCompletedAttemptId && (
                          <Link
                            href={`/attempt/${t.lastCompletedAttemptId}/result`}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors">
                            <Eye className="w-3.5 h-3.5" />Result
                          </Link>
                        )}
                        {t.hasInProgressAttempt && t.inProgressAttemptId && (
                          <Link
                            href={`/attempt/${t.inProgressAttemptId}`}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition-colors">
                            <Play className="w-3.5 h-3.5" />Continue
                          </Link>
                        )}
                        {canStart && (
                          <DashboardStartButton
                            assignmentId={t.assignmentId}
                            token={token}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
