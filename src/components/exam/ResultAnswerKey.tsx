'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, MinusCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { QuestionResult } from '@/types/exam';

// Question type enum — must match backend QuestionType enum
const QT_MCQ = 1; // single correct  (MCQ = 1)
const QT_MSQ = 2; // multi correct   (MSQ = 2)
const QT_NAT = 3; // numerical       (NAT = 3)

interface Props {
  questions: QuestionResult[];
}

export default function ResultAnswerKey({ questions }: Props) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggle = (order: number) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(order)) next.delete(order);
      else next.add(order);
      return next;
    });
  };

  return (
    <div className="divide-y divide-gray-100">
      {questions.map((q, idx) => {
        const isOpen    = expanded.has(q.displayOrder);
        const isSkipped = !q.isAttempted;

        const statusIcon = isSkipped ? (
          <MinusCircle className="w-5 h-5 text-gray-400 shrink-0" />
        ) : q.isCorrect ? (
          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500 shrink-0" />
        );

        const marksLabel = isSkipped
          ? 'Skipped'
          : q.marksAwarded > 0
          ? `+${q.marksAwarded}`
          : String(q.marksAwarded);

        const marksColor = isSkipped
          ? 'text-gray-400 bg-gray-50'
          : q.marksAwarded > 0
          ? 'text-green-700 bg-green-50'
          : q.marksAwarded < 0
          ? 'text-red-700 bg-red-50'
          : 'text-gray-500 bg-gray-50';

        return (
          <div key={q.displayOrder}>
            {/* Accordion header */}
            <button
              onClick={() => toggle(q.displayOrder)}
              className="w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
            >
              {statusIcon}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="text-xs font-semibold text-gray-500">Q{idx + 1}</span>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${marksColor}`}>
                    {isSkipped ? 'Skipped' : `${marksLabel} / ${q.maxMarks} marks`}
                  </span>
                  {/* Prompt for wrong / skipped */}
                  {!q.isCorrect && (
                    <span className="text-xs text-indigo-600 font-medium">
                      ↓ {isOpen ? 'Hide' : 'See correct answer'}
                    </span>
                  )}
                </div>
                <div
                  className="text-sm text-gray-800 line-clamp-2 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: q.questionText }}
                />
              </div>
              {isOpen ? (
                <ChevronUp className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
              )}
            </button>

            {/* Accordion body */}
            {isOpen && (
              <div className="px-5 pb-5 bg-gray-50 border-t border-gray-100">

                {/* ── MCQ / MSQ Options ── */}
                {(q.questionType === QT_MCQ || q.questionType === QT_MSQ) && q.options.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {q.options.map(opt => {
                      // Use opt.isCorrect directly from backend (most reliable)
                      const isYours   = q.studentSelectedOptionIds?.includes(opt.id);
                      const isCorrect = opt.isCorrect;

                      let cls  = 'border-gray-200 bg-white text-gray-700';
                      let badge: React.ReactNode = null;

                      if (isCorrect && isYours) {
                        cls   = 'border-green-400 bg-green-50 text-green-900';
                        badge = (
                          <span className="text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap">
                            ✓ Your Answer — Correct
                          </span>
                        );
                      } else if (isCorrect) {
                        cls   = 'border-green-400 bg-green-50 text-green-900';
                        badge = (
                          <span className="text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap">
                            ✓ Correct Answer
                          </span>
                        );
                      } else if (isYours) {
                        cls   = 'border-red-300 bg-red-50 text-red-900';
                        badge = (
                          <span className="text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap">
                            ✗ Your Answer — Wrong
                          </span>
                        );
                      }

                      return (
                        <div key={opt.id} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border ${cls}`}>
                          <span className="font-bold text-xs shrink-0 w-5 text-center">
                            {opt.label}
                          </span>
                          <div className="flex-1 min-w-0 flex items-center flex-wrap gap-1">
                            <span
                              className="text-sm prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{ __html: opt.text }}
                            />
                            {badge}
                          </div>
                          {isCorrect && <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />}
                          {isYours && !isCorrect && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ── NAT answer ── */}
                {q.questionType === QT_NAT && (
                  <div className="mt-4 flex gap-4 flex-wrap">
                    {/* Student's answer */}
                    <div className={`rounded-xl border px-5 py-3 min-w-[120px]`} style={{
                      borderColor: isSkipped ? '#e5e7eb' : q.isCorrect ? '#86efac' : '#fca5a5',
                      background:  isSkipped ? '#fff'    : q.isCorrect ? '#f0fdf4' : '#fff1f2',
                    }}>
                      <p className="text-xs text-gray-500 mb-1 font-medium">Your Answer</p>
                      <p className={`font-bold text-xl ${
                        isSkipped
                          ? 'text-gray-400 italic text-sm'
                          : q.isCorrect
                          ? 'text-green-700'
                          : 'text-red-700'
                      }`}>
                        {isSkipped
                          ? 'Not attempted'
                          : q.studentNumericalValue !== undefined && q.studentNumericalValue !== null
                          ? q.studentNumericalValue
                          : '—'}
                      </p>
                    </div>

                    {/* Correct answer */}
                    <div className="rounded-xl border border-green-300 bg-green-50 px-5 py-3 min-w-[120px]">
                      <p className="text-xs text-gray-500 mb-1 font-medium">Correct Answer</p>
                      <p className="font-bold text-xl text-green-700">
                        {q.correctNumericalAnswer !== undefined && q.correctNumericalAnswer !== null
                          ? q.correctNumericalAnswer
                          : <span className="text-sm italic text-gray-400">Not set</span>}
                      </p>
                    </div>
                  </div>
                )}

                {/* ── Solution ── */}
                {q.solution && (
                  <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                    <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide mb-2">Solution</p>
                    <div
                      className="text-sm text-gray-700 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: q.solution }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
