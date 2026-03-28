'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ExamConfig, ExamQuestion, StudentAnswer, ExamSection } from '@/types';
import { cn } from '@/lib/utils';
import ExamTimer from './ExamTimer';
import QuestionPanel from './QuestionPanel';
import QuestionNavGrid from './QuestionNavGrid';
import SubmitConfirmDialog from './SubmitConfirmDialog';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ChevronLeft, ChevronRight, Flag } from 'lucide-react';

interface Props { config: ExamConfig; token: string; }

export default function ExamEngine({ config, token }: Props) {
  const router = useRouter();

  // ── State ──────────────────────────────────────────────────────────────────
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [activeQIdx, setActiveQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, StudentAnswer>>({});
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const questionStartTime = useRef<number>(Date.now());

  const activeSection: ExamSection = config.sections[activeSectionIdx];
  const activeQuestion: ExamQuestion = activeSection.questions[activeQIdx];

  // ── Mark question as visited when first viewed ─────────────────────────────
  useEffect(() => {
    questionStartTime.current = Date.now();
    setAnswers(prev => {
      const a = prev[activeQuestion.id];
      if (!a || a.status === 'NotVisited') {
        return {
          ...prev,
          [activeQuestion.id]: {
            questionId: activeQuestion.id,
            selectedOptionIds: [],
            status: 'NotAnswered',
            timeSpentSeconds: 0,
          }
        };
      }
      return prev;
    });
  }, [activeQuestion.id]);

  // ── Anti-cheat: tab switch detection ──────────────────────────────────────
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(c => {
          const next = c + 1;
          if (next >= 3) {
            handleSubmit(true);
          } else {
            setShowTabWarning(true);
          }
          return next;
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // ── Answer helpers ─────────────────────────────────────────────────────────
  const updateAnswer = useCallback((questionId: number, update: Partial<StudentAnswer>) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { ...prev[questionId], questionId, ...update }
    }));
  }, []);

  const handleOptionSelect = (optionId: number) => {
    const q = activeQuestion;
    const current = answers[q.id];
    const selected = current?.selectedOptionIds ?? [];

    if (q.questionType === 'SingleCorrect') {
      updateAnswer(q.id, {
        selectedOptionIds: [optionId],
        status: current?.status === 'MarkedForReview' ? 'AnsweredAndMarked' : 'Answered',
      });
    } else if (q.questionType === 'MultipleCorrect') {
      const newSelected = selected.includes(optionId)
        ? selected.filter(id => id !== optionId)
        : [...selected, optionId];
      updateAnswer(q.id, {
        selectedOptionIds: newSelected,
        status: newSelected.length > 0 ? 'Answered' : 'NotAnswered',
      });
    }
  };

  const handleNumericalInput = (value: string) => {
    const num = parseFloat(value);
    updateAnswer(activeQuestion.id, {
      numericalAnswer: isNaN(num) ? undefined : num,
      status: isNaN(num) ? 'NotAnswered' : 'Answered',
    });
  };

  const handleClearResponse = () => {
    updateAnswer(activeQuestion.id, {
      selectedOptionIds: [],
      numericalAnswer: undefined,
      status: 'NotAnswered',
    });
  };

  const handleMarkForReview = () => {
    const current = answers[activeQuestion.id];
    const isAnswered = (current?.selectedOptionIds?.length ?? 0) > 0 || current?.numericalAnswer !== undefined;
    updateAnswer(activeQuestion.id, {
      status: isAnswered ? 'AnsweredAndMarked' : 'MarkedForReview',
    });
    goNext();
  };

  // ── Navigation ─────────────────────────────────────────────────────────────
  const saveTimeSpent = () => {
    const elapsed = Math.round((Date.now() - questionStartTime.current) / 1000);
    setAnswers(prev => ({
      ...prev,
      [activeQuestion.id]: {
        ...prev[activeQuestion.id],
        questionId: activeQuestion.id,
        selectedOptionIds: prev[activeQuestion.id]?.selectedOptionIds ?? [],
        status: prev[activeQuestion.id]?.status ?? 'NotAnswered',
        timeSpentSeconds: (prev[activeQuestion.id]?.timeSpentSeconds ?? 0) + elapsed,
      }
    }));
  };

  const navigateTo = (sectionIdx: number, qIdx: number) => {
    saveTimeSpent();
    setActiveSectionIdx(sectionIdx);
    setActiveQIdx(qIdx);
  };

  const goNext = () => {
    if (activeQIdx < activeSection.questions.length - 1) {
      navigateTo(activeSectionIdx, activeQIdx + 1);
    } else if (activeSectionIdx < config.sections.length - 1) {
      navigateTo(activeSectionIdx + 1, 0);
    }
  };

  const goPrev = () => {
    if (activeQIdx > 0) {
      navigateTo(activeSectionIdx, activeQIdx - 1);
    } else if (activeSectionIdx > 0) {
      const prevSection = config.sections[activeSectionIdx - 1];
      navigateTo(activeSectionIdx - 1, prevSection.questions.length - 1);
    }
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (autoSubmit = false) => {
    if (!autoSubmit && !showSubmitDialog) { setShowSubmitDialog(true); return; }
    saveTimeSpent();
    setSubmitting(true);

    const payload = {
      testId: config.testId,
      answers: Object.values(answers),
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/exam/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.data?.resultId) {
        router.push(`/results/${data.data.resultId}`);
      } else {
        throw new Error('Submission failed');
      }
    } catch {
      setSubmitting(false);
      alert('Failed to submit. Please check your connection and try again.');
    }
  };

  // ── Answer stats for submit dialog ────────────────────────────────────────
  const stats = {
    total: config.totalQuestions,
    answered: Object.values(answers).filter(a =>
      a.status === 'Answered' || a.status === 'AnsweredAndMarked').length,
    marked: Object.values(answers).filter(a =>
      a.status === 'MarkedForReview' || a.status === 'AnsweredAndMarked').length,
    notVisited: config.totalQuestions - Object.values(answers).filter(a =>
      a.status !== 'NotVisited').length,
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">

      {/* ── Top Bar ──────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 shadow-sm px-4 py-2 flex items-center justify-between shrink-0 z-20">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-900 truncate max-w-[200px] sm:max-w-md">{config.title}</span>
          <span className="text-xs text-gray-500">{config.totalQuestions} Questions · {config.totalMarks} Marks</span>
        </div>
        <div className="flex items-center gap-3">
          <ExamTimer
            totalSeconds={config.totalDurationSeconds}
            onExpire={() => handleSubmit(true)}
          />
          <button onClick={() => setShowSubmitDialog(true)}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            Submit
          </button>
        </div>
      </div>

      {/* ── Section Tabs ────────────────────────────────────────────────────── */}
      {config.sections.length > 1 && (
        <div className="bg-white border-b border-gray-200 flex overflow-x-auto shrink-0">
          {config.sections.map((sec, i) => (
            <button key={sec.id}
              onClick={() => navigateTo(i, 0)}
              className={cn(
                'px-5 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                i === activeSectionIdx
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              )}>
              {sec.name}
            </button>
          ))}
        </div>
      )}

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Question area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <QuestionPanel
              question={activeQuestion}
              answer={answers[activeQuestion.id]}
              onOptionSelect={handleOptionSelect}
              onNumericalInput={handleNumericalInput}
            />
          </div>

          {/* Bottom action bar */}
          <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex gap-2">
              <button onClick={handleClearResponse}
                className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50">
                Clear
              </button>
              <button onClick={handleMarkForReview}
                className="px-4 py-2 text-sm border border-orange-400 text-orange-600 rounded-lg hover:bg-orange-50 flex items-center gap-1">
                <Flag className="w-3.5 h-3.5" /> Mark & Next
              </button>
            </div>
            <div className="flex gap-2">
              <button onClick={goPrev}
                className="flex items-center gap-1 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg disabled:opacity-40"
                disabled={activeSectionIdx === 0 && activeQIdx === 0}>
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <button onClick={goNext}
                className="flex items-center gap-1 px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                disabled={activeSectionIdx === config.sections.length - 1 &&
                  activeQIdx === activeSection.questions.length - 1}>
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Question navigation sidebar */}
        <div className="hidden md:block w-64 border-l border-gray-200 bg-white overflow-y-auto shrink-0">
          <QuestionNavGrid
            config={config}
            answers={answers}
            activeSectionIdx={activeSectionIdx}
            activeQIdx={activeQIdx}
            onNavigate={navigateTo}
          />
        </div>
      </div>

      {/* ── Dialogs ──────────────────────────────────────────────────────────── */}
      {showTabWarning && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
            <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Warning!</h3>
            <p className="text-gray-600 text-sm mb-2">You switched tabs or windows.</p>
            <p className="text-red-600 text-sm font-semibold mb-4">
              Warning {tabSwitchCount}/3. Your test will be auto-submitted on the 3rd switch.
            </p>
            <button onClick={() => setShowTabWarning(false)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl">
              OK, I understand
            </button>
          </div>
        </div>
      )}

      {showSubmitDialog && (
        <SubmitConfirmDialog
          stats={stats}
          submitting={submitting}
          onConfirm={() => handleSubmit(false)}
          onCancel={() => setShowSubmitDialog(false)}
        />
      )}
    </div>
  );
}
