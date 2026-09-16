'use client';

import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { QuestionResult } from '@/types/exam';

const QT_NAT = 3;

type Filter = 'all' | 'correct' | 'incorrect' | 'unattempted';

interface Props {
  questions: QuestionResult[];
}

function outcome(q: QuestionResult): Exclude<Filter, 'all'> {
  if (!q.isAttempted) return 'unattempted';
  return q.isCorrect ? 'correct' : 'incorrect';
}

const OUTCOME_CHIP: Record<Exclude<Filter, 'all'>, string> = {
  correct:     'bg-[#e7f6ec] text-[#0b6b31]',
  incorrect:   'bg-[#fee4e2] text-[#b42318]',
  unattempted: 'bg-[#f2f4f7] text-[#475467]',
};

const fmtMarks = (n: number) => (n > 0 ? `+${n}` : n < 0 ? `−${Math.abs(n)}` : '0');

export default function ResultAnswerKey({ questions }: Props) {
  const counts = useMemo(() => {
    const c = { all: questions.length, correct: 0, incorrect: 0, unattempted: 0 };
    questions.forEach(q => { c[outcome(q)]++; });
    return c;
  }, [questions]);

  // Wrong answers are the most useful to review first
  const [filter, setFilter] = useState<Filter>(counts.incorrect > 0 ? 'incorrect' : 'all');
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const visible = questions.filter(q => filter === 'all' || outcome(q) === filter);

  const toggle = (order: number) => setExpanded(prev => {
    const next = new Set(prev);
    if (next.has(order)) next.delete(order); else next.add(order);
    return next;
  });

  const chips: [Filter, string][] = [['all', 'All'], ['correct', 'Correct'], ['incorrect', 'Incorrect'], ['unattempted', 'Unattempted']];

  return (
    <div>
      <div className="flex gap-2 px-4 md:px-5 py-3 border-b border-line overflow-x-auto scrollbar-hide">
        {chips.map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)} aria-pressed={filter === key}
            className={`h-9 px-3.5 rounded-full text-[13.5px] font-medium whitespace-nowrap ${
              filter === key ? 'bg-ink text-white' : 'bg-[#f2f4f7] text-[#344054] hover:bg-[#e4e7ec]'
            }`}>
            {label} {counts[key]}
          </button>
        ))}
      </div>

      {visible.length === 0 && <p className="px-5 py-8 text-center text-[#475467]">No questions here.</p>}

      <ul className="divide-y divide-[#eef0f3]">
        {visible.map(q => {
          const o = outcome(q);
          const isOpen = expanded.has(q.displayOrder);
          return (
            <li key={q.displayOrder}>
              <button onClick={() => toggle(q.displayOrder)} aria-expanded={isOpen}
                className="w-full flex items-start gap-3 px-4 md:px-7 py-4 text-left hover:bg-[#fafbfc]">
                <span className="font-bold text-[15px] w-10 shrink-0 pt-0.5">Q{q.displayOrder}</span>
                <span className="flex-1 min-w-0 flex flex-col gap-2">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="h-[26px] inline-flex items-center px-2.5 rounded-full bg-[#f2f4f7] text-[#344054] text-[12.5px] font-medium">
                      {q.sectionName}{q.questionType === QT_NAT ? ' · Numerical' : ''}
                    </span>
                    <span className={`h-[26px] inline-flex items-center px-2.5 rounded-full text-[12.5px] font-medium capitalize ${OUTCOME_CHIP[o]}`}>
                      {o}{o !== 'unattempted' ? ` · ${fmtMarks(q.marksAwarded)}` : ''}
                    </span>
                  </span>
                  {!isOpen && <span className="q-html text-[15px] text-[#344054] line-clamp-2" dangerouslySetInnerHTML={{ __html: q.questionText }} />}
                </span>
                <ChevronDown className={`w-[18px] h-[18px] text-[#667085] shrink-0 mt-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {isOpen && (
                <div className="px-4 md:px-7 pb-6 md:pl-[80px] flex flex-col gap-3.5">
                  <div className="q-html text-base md:text-[17px] leading-[1.7] overflow-x-auto" dangerouslySetInnerHTML={{ __html: q.questionText }} />

                  {q.questionType === QT_NAT ? (
                    <div className="flex flex-wrap gap-3">
                      <div className={`rounded-[10px] border-[1.5px] px-4 py-2.5 min-w-[140px] ${
                        o === 'unattempted' ? 'border-line' : q.isCorrect ? 'border-[#12803c] bg-[#ecfdf3]' : 'border-[#d92d20] bg-[#fef3f2]'
                      }`}>
                        <p className="text-[12.5px] text-[#667085]">Your answer</p>
                        <p className="font-mono font-semibold text-lg">
                          {q.studentNumericalValue !== undefined && q.studentNumericalValue !== null ? q.studentNumericalValue : '—'}
                        </p>
                      </div>
                      <div className="rounded-[10px] border-[1.5px] border-[#12803c] bg-[#ecfdf3] px-4 py-2.5 min-w-[140px]">
                        <p className="text-[12.5px] text-[#667085]">Correct answer</p>
                        <p className="font-mono font-semibold text-lg">
                          {q.correctNumericalAnswer !== undefined && q.correctNumericalAnswer !== null ? q.correctNumericalAnswer : '—'}
                        </p>
                      </div>
                    </div>
                  ) : q.options.length > 0 && (
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {q.options.map(opt => {
                        const yours = q.studentSelectedOptionIds?.includes(opt.id);
                        const tone = opt.isCorrect ? 'border-[#12803c] bg-[#ecfdf3]' : yours ? 'border-[#d92d20] bg-[#fef3f2]' : 'border-[#d0d5dd] bg-white';
                        const note = opt.isCorrect && yours ? 'Correct · yours' : opt.isCorrect ? 'Correct' : yours ? 'Your answer' : '';
                        return (
                          <div key={opt.id} className={`flex items-start gap-3 px-3.5 py-2.5 rounded-[10px] border-[1.5px] ${tone}`}>
                            <span className="w-7 h-7 shrink-0 rounded-full border-[1.5px] border-[#98a2b3] flex items-center justify-center text-[13px] font-semibold">{opt.label}</span>
                            <span className="q-html flex-1 min-w-0 text-[15px] md:text-base pt-0.5" dangerouslySetInnerHTML={{ __html: opt.text }} />
                            {note && (
                              <span className={`text-[12.5px] font-semibold whitespace-nowrap pt-1 ${opt.isCorrect ? 'text-[#0b6b31]' : 'text-[#b42318]'}`}>{note}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {q.solution && (
                    <div className="px-4 py-3.5 bg-[#f9fafb] rounded-[10px]">
                      <p className="text-sm font-semibold mb-1.5">Solution</p>
                      <div className="q-html text-[15px] md:text-base leading-[1.75] overflow-x-auto" dangerouslySetInnerHTML={{ __html: q.solution }} />
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
