'use client';

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Flag,
  Clock,
  Send,
  X,
} from 'lucide-react';
import { AttemptStart, AttemptQuestion, AnswerState } from '@/types/exam';

// ── Constants ─────────────────────────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

// Question type enum — must match backend QuestionType enum
const QT_MCQ = 1; // single correct  (MCQ = 1)
const QT_MSQ = 2; // multi correct   (MSQ = 2)
const QT_NAT = 3; // numerical       (NAT = 3)

// Question nav status colours
const STATUS_COLORS = {
  notVisited:        'bg-gray-200 text-gray-600',
  notAnswered:       'bg-red-100 text-red-700 border border-red-300',
  answered:          'bg-green-500 text-white',
  markedForReview:   'bg-orange-400 text-white',
  answeredAndMarked: 'bg-purple-500 text-white',
};

interface Props {
  attempt: AttemptStart;
  token: string;
}

interface Section {
  index: number;
  name: string;
  questions: AttemptQuestion[];
}

// ── Helper ────────────────────────────────────────────────────────────────────
function formatTime(seconds: number): string {
  if (seconds <= 0) return '00:00:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
}

function getNavStatus(
  q: AttemptQuestion,
  ans: AnswerState | undefined,
): keyof typeof STATUS_COLORS {
  const isMarked = ans?.isMarkedForReview ?? q.isMarkedForReview;
  const hasAnswer =
    (ans?.selectedOptionIds?.length ?? 0) > 0 ||
    (ans?.numericalValue !== undefined && ans?.numericalValue !== null);

  if (isMarked && hasAnswer) return 'answeredAndMarked';
  if (isMarked) return 'markedForReview';
  if (hasAnswer) return 'answered';
  if (ans !== undefined || q.isVisited) return 'notAnswered';
  return 'notVisited';
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AttemptEngine({ attempt, token }: Props) {
  const router = useRouter();
  const { attemptId } = attempt;

  // ── Build sections ──────────────────────────────────────────────────────────
  const sections: Section[] = useMemo(() => {
    const map = new Map<number, Section>();
    for (const q of attempt.questions) {
      if (!map.has(q.sectionIndex)) {
        map.set(q.sectionIndex, { index: q.sectionIndex, name: q.sectionName, questions: [] });
      }
      map.get(q.sectionIndex)!.questions.push(q);
    }
    // Sort questions within each section
    const sections: Section[] = [];
    map.forEach((sec) => {
      sec.questions.sort((a: AttemptQuestion, b: AttemptQuestion) => a.displayOrderInSection - b.displayOrderInSection);
      sections.push(sec);
    });
    return sections.sort((a: Section, b: Section) => a.index - b.index);
  }, [attempt.questions]);

  // ── State ───────────────────────────────────────────────────────────────────
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [activeQIdx, setActiveQIdx] = useState(0);

  // answers keyed by questionId (string UUID)
  const [answers, setAnswers] = useState<Record<string, AnswerState>>(() => {
    const init: Record<string, AnswerState> = {};
    for (const sa of attempt.savedAnswers) {
      init[sa.questionId] = {
        questionId: sa.questionId,
        selectedOptionIds: sa.selectedOptionIds ?? [],
        numericalValue: sa.numericalValue,
        isClear: sa.isClear,
        isMarkedForReview: false,
      };
    }
    return init;
  });

  const [timeLeft, setTimeLeft] = useState(
    Math.max(0, attempt.durationSeconds - attempt.secondsElapsed),
  );
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [natInput, setNatInput] = useState('');

  const saveDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeSection = sections[activeSectionIdx];
  const activeQuestion: AttemptQuestion | undefined =
    activeSection?.questions[activeQIdx];

  // ── Sync NAT input when question changes ────────────────────────────────────
  useEffect(() => {
    if (!activeQuestion) return;
    const ans = answers[activeQuestion.questionId];
    setNatInput(
      ans?.numericalValue !== undefined && ans.numericalValue !== null
        ? String(ans.numericalValue)
        : '',
    );
  }, [activeQuestion?.questionId]);

  // ── Timer countdown ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  // ── Mark visited on question view ───────────────────────────────────────────
  useEffect(() => {
    if (!activeQuestion) return;
    const qid = activeQuestion.questionId;
    if (!answers[qid] && !activeQuestion.isVisited) {
      setAnswers(prev => ({
        ...prev,
        [qid]: {
          questionId: qid,
          selectedOptionIds: [],
          isClear: false,
          isMarkedForReview: false,
        },
      }));
    }
    // Fire visited API (fire-and-forget)
    fetch(`${API_BASE}/api/assessment/attempts/${attemptId}/visited/${qid}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }, [activeQuestion?.questionId]);

  // ── Anti-cheat: tab switch ──────────────────────────────────────────────────
  useEffect(() => {
    const onVisibility = () => {
      if (!document.hidden) return;
      setTabSwitchCount(prev => {
        const next = prev + 1;
        // Report violation
        fetch(`${API_BASE}/api/assessment/attempts/${attemptId}/violation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ violationType: 'TabSwitch' }),
        }).catch(() => {});

        if (next >= 3) {
          handleSubmit(true);
        } else {
          setShowTabWarning(true);
        }
        return next;
      });
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // ── Save answer to backend (debounced) ──────────────────────────────────────
  const persistAnswer = useCallback(
    (qid: string, state: AnswerState) => {
      if (saveDebounce.current) clearTimeout(saveDebounce.current);
      saveDebounce.current = setTimeout(() => {
        fetch(`${API_BASE}/api/assessment/attempts/${attemptId}/answer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            questionId: qid,
            selectedOptionIds: state.selectedOptionIds,
            numericalValue: state.numericalValue ?? null,
            isClear: state.isClear,
          }),
        }).catch(() => {});
      }, 500);
    },
    [attemptId, token],
  );

  // ── Answer handlers ─────────────────────────────────────────────────────────
  const updateAnswer = useCallback(
    (qid: string, patch: Partial<AnswerState>) => {
      setAnswers(prev => {
        const base: AnswerState = prev[qid] ?? {
          questionId: qid,
          selectedOptionIds: [],
          isClear: false,
          isMarkedForReview: false,
        };
        const next: AnswerState = { ...base, ...patch, questionId: qid };
        persistAnswer(qid, next);
        return { ...prev, [qid]: next };
      });
    },
    [persistAnswer],
  );

  const handleOptionSelect = (optionId: number) => {
    if (!activeQuestion) return;
    const qid = activeQuestion.questionId;
    const current = answers[qid];
    const selected = current?.selectedOptionIds ?? [];

    if (activeQuestion.questionType === QT_MCQ) {
      // Single correct — toggle off if same
      const newSelected = selected.includes(optionId) ? [] : [optionId];
      updateAnswer(qid, { selectedOptionIds: newSelected, isClear: newSelected.length === 0 });
    } else if (activeQuestion.questionType === QT_MSQ) {
      const newSelected = selected.includes(optionId)
        ? selected.filter(id => id !== optionId)
        : [...selected, optionId];
      updateAnswer(qid, { selectedOptionIds: newSelected, isClear: newSelected.length === 0 });
    }
  };

  const handleNatInput = (value: string) => {
    setNatInput(value);
    if (!activeQuestion) return;
    const qid = activeQuestion.questionId;
    const num = parseFloat(value);
    if (value === '' || value === '-') {
      updateAnswer(qid, { numericalValue: undefined, isClear: true });
    } else if (!isNaN(num)) {
      updateAnswer(qid, { numericalValue: num, isClear: false });
    }
  };

  const handleClearResponse = () => {
    if (!activeQuestion) return;
    const qid = activeQuestion.questionId;
    setNatInput('');
    updateAnswer(qid, { selectedOptionIds: [], numericalValue: undefined, isClear: true });
  };

  const handleMarkForReview = () => {
    if (!activeQuestion) return;
    const qid = activeQuestion.questionId;
    const current = answers[qid];
    updateAnswer(qid, { isMarkedForReview: !current?.isMarkedForReview });

    // API: mark-review
    fetch(`${API_BASE}/api/assessment/attempts/${attemptId}/mark-review/${qid}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});

    goNext();
  };

  // ── Navigation ──────────────────────────────────────────────────────────────
  const navigateTo = (secIdx: number, qIdx: number) => {
    setActiveSectionIdx(secIdx);
    setActiveQIdx(qIdx);
  };

  const goNext = () => {
    if (!activeSection) return;
    if (activeQIdx < activeSection.questions.length - 1) {
      navigateTo(activeSectionIdx, activeQIdx + 1);
    } else if (activeSectionIdx < sections.length - 1) {
      navigateTo(activeSectionIdx + 1, 0);
    }
  };

  const goPrev = () => {
    if (activeQIdx > 0) {
      navigateTo(activeSectionIdx, activeQIdx - 1);
    } else if (activeSectionIdx > 0) {
      const prevSec = sections[activeSectionIdx - 1];
      navigateTo(activeSectionIdx - 1, prevSec.questions.length - 1);
    }
  };

  const isFirst = activeSectionIdx === 0 && activeQIdx === 0;
  const isLast =
    activeSectionIdx === sections.length - 1 &&
    !!activeSection &&
    activeQIdx === activeSection.questions.length - 1;

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (autoSubmit = false) => {
    if (!autoSubmit && !showSubmitDialog) {
      setShowSubmitDialog(true);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/assessment/attempts/${attemptId}/submit`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error('Submission failed');
      router.push(`/attempt/${attemptId}/result`);
    } catch {
      setSubmitting(false);
      if (!autoSubmit) {
        alert('Failed to submit. Please check your connection and try again.');
      }
    }
  };

  // ── Stats for submit dialog ─────────────────────────────────────────────────
  const stats = useMemo(() => {
    let answered = 0, marked = 0, notVisited = 0;
    for (const q of attempt.questions) {
      const ans = answers[q.questionId];
      const status = getNavStatus(q, ans);
      if (status === 'answered' || status === 'answeredAndMarked') answered++;
      if (status === 'markedForReview' || status === 'answeredAndMarked') marked++;
      if (status === 'notVisited') notVisited++;
    }
    return { total: attempt.totalQuestions, answered, marked, notVisited };
  }, [answers, attempt.questions]);

  // ── Timer colour ────────────────────────────────────────────────────────────
  const timerColor =
    timeLeft > 300 ? 'text-gray-700' : timeLeft > 60 ? 'text-orange-600' : 'text-red-600';

  if (!activeSection || !activeQuestion) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        No questions found.
      </div>
    );
  }

  const currentAnswer = answers[activeQuestion.questionId];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 shadow-sm px-4 py-2 flex items-center justify-between shrink-0 z-20">
        <div>
          <p className="text-sm font-bold text-gray-900 truncate max-w-[200px] sm:max-w-md">
            {attempt.testTitle}
          </p>
          <p className="text-xs text-gray-500">
            {attempt.totalQuestions} Questions
            {attempt.negativeMarkingEnabled && ' · Negative marking enabled'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 font-mono font-bold text-base ${timerColor}`}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
          <button
            onClick={() => setShowSubmitDialog(true)}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Submit
          </button>
        </div>
      </div>

      {/* ── Section tabs ────────────────────────────────────────────────────── */}
      {sections.length > 1 && (
        <div className="bg-white border-b border-gray-200 flex overflow-x-auto shrink-0">
          {sections.map((sec, i) => (
            <button
              key={sec.index}
              onClick={() => navigateTo(i, 0)}
              className={`px-5 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                i === activeSectionIdx
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {sec.name}
            </button>
          ))}
        </div>
      )}

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Question panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 md:p-6">

            {/* Question header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full mb-2">
                  {activeQuestion.sectionName} · Q{activeQuestion.displayOrder}
                </span>
                <div className="flex gap-2 text-xs text-gray-500">
                  <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded">
                    +{activeQuestion.marksForCorrect} marks
                  </span>
                  {activeQuestion.negativeMarks > 0 && (
                    <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded">
                      -{activeQuestion.negativeMarks} negative
                    </span>
                  )}
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded capitalize">
                    {activeQuestion.questionType === QT_MCQ ? 'Single Correct' :
                     activeQuestion.questionType === QT_MSQ ? 'Multi Correct' : 'Numerical'}
                  </span>
                </div>
              </div>
            </div>

            {/* Question text */}
            <div
              className="prose prose-sm max-w-none text-gray-900 mb-6"
              dangerouslySetInnerHTML={{ __html: activeQuestion.text }}
            />

            {/* Options / NAT input */}
            {activeQuestion.questionType === QT_NAT ? (
              <div className="max-w-xs">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your answer:
                </label>
                <input
                  type="number"
                  step="any"
                  value={natInput}
                  onChange={e => handleNatInput(e.target.value)}
                  placeholder="Type numerical answer..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-base font-mono focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
                {currentAnswer?.numericalValue !== undefined && (
                  <p className="text-xs text-green-600 mt-1.5 font-medium">
                    Saved: {currentAnswer.numericalValue}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {activeQuestion.options.map(opt => {
                  const isSelected = currentAnswer?.selectedOptionIds?.includes(opt.id) ?? false;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionSelect(opt.id)}
                      className={`w-full flex items-start gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30'
                      }`}
                    >
                      <span className={`shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-gray-300 text-gray-500'
                      }`}>
                        {opt.label}
                      </span>
                      <span
                        className="flex-1 text-sm text-gray-800 leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: opt.text }}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom action bar */}
          <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex gap-2">
              <button
                onClick={handleClearResponse}
                className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
              <button
                onClick={handleMarkForReview}
                className={`px-4 py-2 text-sm rounded-lg flex items-center gap-1.5 transition-colors ${
                  currentAnswer?.isMarkedForReview
                    ? 'bg-orange-500 text-white border border-orange-500'
                    : 'border border-orange-400 text-orange-600 hover:bg-orange-50'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                {currentAnswer?.isMarkedForReview ? 'Marked' : 'Mark & Next'}
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={goPrev}
                disabled={isFirst}
                className="flex items-center gap-1 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </button>
              <button
                onClick={goNext}
                disabled={isLast}
                className="flex items-center gap-1 px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-lg disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar: Question navigation */}
        <div className="hidden md:flex md:flex-col w-64 border-l border-gray-200 bg-white overflow-y-auto shrink-0">
          {/* Legend */}
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Legend</p>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: 'Not Visited', cls: STATUS_COLORS.notVisited },
                { label: 'Not Answered', cls: STATUS_COLORS.notAnswered },
                { label: 'Answered', cls: STATUS_COLORS.answered },
                { label: 'Marked', cls: STATUS_COLORS.markedForReview },
                { label: 'Ans + Marked', cls: STATUS_COLORS.answeredAndMarked },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={`w-4 h-4 rounded-full shrink-0 ${l.cls}`} />
                  <span className="text-[10px] text-gray-600">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sections and question buttons */}
          <div className="flex-1 p-3 space-y-4 overflow-y-auto">
            {sections.map((sec, secIdx) => (
              <div key={sec.index}>
                <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                  {sec.name}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {sec.questions.map((q, qIdx) => {
                    const ans = answers[q.questionId];
                    const status = getNavStatus(q, ans);
                    const isActive = secIdx === activeSectionIdx && qIdx === activeQIdx;
                    return (
                      <button
                        key={q.attemptQuestionId}
                        onClick={() => navigateTo(secIdx, qIdx)}
                        title={`Q${q.displayOrder}`}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all
                          ${STATUS_COLORS[status]}
                          ${isActive ? 'ring-2 ring-indigo-600 ring-offset-1 scale-110' : 'hover:scale-105'}`}
                      >
                        {q.displayOrder}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="p-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs text-center">
            <div className="bg-green-50 rounded-lg p-2">
              <p className="font-bold text-green-700 text-base">{stats.answered}</p>
              <p className="text-green-600">Answered</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-2">
              <p className="font-bold text-orange-700 text-base">{stats.marked}</p>
              <p className="text-orange-600">Marked</p>
            </div>
            <div className="bg-red-50 rounded-lg p-2">
              <p className="font-bold text-red-700 text-base">
                {stats.total - stats.answered - stats.notVisited}
              </p>
              <p className="text-red-600">Not Answered</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="font-bold text-gray-700 text-base">{stats.notVisited}</p>
              <p className="text-gray-500">Not Visited</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab switch warning dialog ────────────────────────────────────────── */}
      {showTabWarning && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
            <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Warning!</h3>
            <p className="text-gray-600 text-sm mb-1">You switched away from the exam.</p>
            <p className="text-red-600 text-sm font-semibold mb-4">
              Warning {tabSwitchCount}/3 — your test will be auto-submitted on the 3rd switch.
            </p>
            <button
              onClick={() => setShowTabWarning(false)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl transition-colors"
            >
              OK, I understand
            </button>
          </div>
        </div>
      )}

      {/* ── Submit confirmation dialog ───────────────────────────────────────── */}
      {showSubmitDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Submit Test?</h3>
            <p className="text-gray-500 text-sm mb-5">You cannot change answers after submitting.</p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-green-700">{stats.answered}</p>
                <p className="text-xs text-green-600 mt-0.5">Answered</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-orange-700">{stats.marked}</p>
                <p className="text-xs text-orange-600 mt-0.5">Marked</p>
              </div>
              <div className="bg-red-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-red-700">
                  {stats.total - stats.answered - stats.notVisited}
                </p>
                <p className="text-xs text-red-600 mt-0.5">Not Answered</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-gray-700">{stats.notVisited}</p>
                <p className="text-xs text-gray-500 mt-0.5">Not Visited</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitDialog(false)}
                disabled={submitting}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 disabled:opacity-50"
              >
                Go Back
              </button>
              <button
                onClick={() => handleSubmit(false)}
                disabled={submitting}
                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                {submitting && (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                )}
                {submitting ? 'Submitting...' : 'Submit Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
