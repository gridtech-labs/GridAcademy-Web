import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { api, UnauthorizedError } from '@/lib/api-client';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import DashboardStartButton from '@/components/exam/DashboardStartButton';

// Mirrors StudentTestCardDto from the backend
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

function getStatus(t: TestCard, now: Date) {
  if (now < new Date(t.availableFrom)) return { label: 'Scheduled',   cls: 'bg-[#fef3dc] text-[#8a5200]' };
  if (now > new Date(t.availableTo))   return { label: 'Expired',     cls: 'bg-[#f2f4f7] text-[#475467]' };
  if (t.hasInProgressAttempt)          return { label: 'In progress', cls: 'bg-primary-tint text-primary-dark' };
  if (t.attemptsRemaining === 0)       return { label: 'Completed',   cls: 'bg-[#e7f6ec] text-[#0b6b31]' };
  return { label: 'Available', cls: 'bg-[#e7f6ec] text-[#0b6b31]' };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  const token = (session.user as any).accessToken as string;

  let tests: TestCard[] = [];
  try {
    tests = await api.get<TestCard[]>('/api/assessment/my-tests', token);
  } catch (e: any) {
    if (e instanceof UnauthorizedError) redirect('/api/auth/signout?callbackUrl=/login');
    console.error('[dashboard] my-tests fetch error:', e?.message);
  }

  const now = new Date();
  const stats = [
    { label: 'Tests',        value: tests.length },
    { label: 'Completed',    value: tests.filter(t => t.attemptsUsed > 0 && !t.hasInProgressAttempt && t.attemptsRemaining === 0).length },
    { label: 'In progress',  value: tests.filter(t => t.hasInProgressAttempt).length },
    { label: 'Attempts',     value: tests.reduce((sum, t) => sum + t.attemptsUsed, 0) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <dl className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white border border-line rounded-xl p-4 md:p-5">
            <dt className="text-[13.5px] text-[#667085]">{s.label}</dt>
            <dd className="font-mono font-semibold text-[26px] md:text-[30px] leading-tight mt-1">{s.value}</dd>
          </div>
        ))}
      </dl>

      <section className="bg-white border border-line rounded-xl overflow-hidden">
        <h2 className="px-5 py-4 text-[17px] font-semibold border-b border-line">My tests</h2>

        {tests.length === 0 ? (
          <div className="px-6 py-14 text-center flex flex-col items-center gap-3">
            <p className="text-lg font-semibold">No tests yet</p>
            <p className="text-[15px] text-[#475467] max-w-sm">Tests you start or unlock appear here, so you can continue them and see your results.</p>
            <Link href="/dashboard/available" className="h-11 inline-flex items-center px-5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark mt-1">
              Find a mock test
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-[#eef0f3]">
            {tests.map(t => {
              const to = new Date(t.availableTo);
              const status = getStatus(t, now);
              const isExpired = now > to;
              const canStart = !isExpired && now >= new Date(t.availableFrom) && t.attemptsRemaining > 0 && !t.hasInProgressAttempt;
              return (
                <li key={t.assignmentId} className={`px-5 py-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-5 ${isExpired ? 'opacity-60' : ''}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-[15.5px] leading-snug">{t.title}</p>
                      <span className={`h-[22px] inline-flex items-center px-2 rounded-full text-[11.5px] font-medium ${status.cls}`}>{status.label}</span>
                    </div>
                    <p className="font-mono text-[12.5px] text-[#667085] mt-1.5">
                      {t.totalQuestions} Q · {t.durationMinutes} min · {t.attemptsUsed}/{t.maxAttempts} attempts ·{' '}
                      {/* Exam tests are lifetime access — the API sends a year-9999 end date */}
                      <span className="font-sans">{to.getUTCFullYear() >= 9999 ? 'Lifetime access' : `${formatDate(t.availableFrom)} – ${formatDate(t.availableTo)}`}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {t.lastCompletedAttemptId && (
                      <Link href={`/attempt/${t.lastCompletedAttemptId}/result`}
                        className="h-9 inline-flex items-center px-3.5 rounded-[7px] border border-[#d0d5dd] text-sm font-semibold hover:bg-paper">
                        View result
                      </Link>
                    )}
                    {t.hasInProgressAttempt && t.inProgressAttemptId && (
                      <Link href={`/attempt/${t.inProgressAttemptId}`}
                        className="h-9 inline-flex items-center px-3.5 rounded-[7px] bg-primary text-white text-sm font-semibold hover:bg-primary-dark">
                        Continue test
                      </Link>
                    )}
                    {canStart && <DashboardStartButton assignmentId={t.assignmentId} token={token} />}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
