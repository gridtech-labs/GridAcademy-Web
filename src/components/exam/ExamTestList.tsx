import { Lock } from 'lucide-react';
import { ExamTest } from '@/types/exam';
import FreeTestButton from './FreeTestButton';

interface Props {
  tests: ExamTest[];
  /** Index offset so a filtered or truncated list keeps the series numbering. */
  numbers?: number[];
  examPrice: number;
  hasAccess: boolean;
  isLoggedIn: boolean;
  token?: string;
  callbackUrl: string;
}

/**
 * Test rows for an exam. Free tests start directly; paid tests either start (owned
 * or free exam) or show that they're part of the single exam-level unlock — never
 * a per-test purchase.
 */
export default function ExamTestList({ tests, numbers, examPrice, hasAccess, isLoggedIn, token, callbackUrl }: Props) {
  return (
    <div className="bg-white border border-line rounded-xl overflow-hidden">
      <div className="hidden md:grid grid-cols-[44px_1fr_96px_96px_104px_170px] gap-3 px-4 py-2.5 bg-[#f9fafb] border-b border-line text-[12.5px] font-semibold text-[#475467]">
        <span>#</span><span>Test</span><span>Questions</span><span>Duration</span><span>Attempts</span><span />
      </div>
      <ul className="divide-y divide-[#eef0f3]">
        {tests.map((t, i) => {
          const n = numbers?.[i] ?? i + 1;
          const canStart = t.isFree || hasAccess || examPrice <= 0;
          return (
            <li key={t.testId}
              className="grid grid-cols-[1fr_auto] md:grid-cols-[44px_1fr_96px_96px_104px_170px] gap-x-3 gap-y-2 items-center px-4 py-3.5">
              <span className="hidden md:block font-mono text-sm text-[#667085]">{String(n).padStart(2, '0')}</span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-[15px] leading-snug">{t.title}</span>
                  {t.isFree && (
                    <span className="h-[22px] inline-flex items-center px-2 rounded-full bg-[#e7f6ec] text-[#0b6b31] text-[11.5px] font-medium">Free</span>
                  )}
                </div>
                <p className="md:hidden font-mono text-[12.5px] text-[#667085] mt-1">
                  {t.totalQuestions} Q · {t.durationMinutes} min{t.attemptCount > 0 ? ` · ${t.attemptCount.toLocaleString('en-IN')} attempts` : ''}
                </p>
              </div>
              <span className="hidden md:block font-mono text-sm text-[#475467] whitespace-nowrap">{t.totalQuestions} Q</span>
              <span className="hidden md:block font-mono text-sm text-[#475467] whitespace-nowrap">{t.durationMinutes} min</span>
              <span className="hidden md:block font-mono text-sm text-[#475467]">{t.attemptCount.toLocaleString('en-IN')}</span>
              <div className="md:text-right justify-self-end">
                {canStart ? (
                  <FreeTestButton
                    testId={t.testId}
                    isLoggedIn={isLoggedIn}
                    token={token}
                    callbackUrl={callbackUrl}
                    testTitle={t.title}
                    variant={t.isFree ? 'ghost' : 'primary'}
                    label={t.isFree ? 'Take Free Test' : 'Start Test'}
                  />
                ) : (
                  <a href="#unlock" className="inline-flex items-center gap-1.5 min-h-[36px] text-[13.5px] text-[#667085] hover:text-primary-dark whitespace-nowrap">
                    <Lock className="w-4 h-4" /> In unlock
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
