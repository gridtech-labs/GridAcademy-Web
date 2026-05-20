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
  LayoutGrid,
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
  const [showNavDrawer, setShowNavDrawer] = useState(false);

  const saveDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Tracks the answer waiting to be flushed so navigation never drops a save
  const pendingSave = useRef<{ qid: string; state: AnswerState } | null>(null);
  // Guards against auto-submitting on the very first render when timeLeft === 0
  const hasStartedTimer = useRef(false);

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
  // hasStartedTimer guards against auto-submit firing on the very first render
  // when timeLeft initialises to 0 (e.g. an attempt resumed right at expiry).
  // The server-side page already redirects submitted/timed-out attempts to the
  // result page, so the client never needs to submit before the UI is visible.
  useEffect(() => {
    if (timeLeft <= 0) {
      if (hasStartedTimer.current) handleSubmit(true);
      return;
    }
    hasStartedTimer.current = true;
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

  // ── Save answer to backend (debounced, 500 ms) ──────────────────────────────
  // pendingSave tracks the in-flight payload so navigateTo() can flush it
  // immediately instead of letting the debounce cancel the previous question's save.
  const persistAnswer = useCallback(
    (qid: string, state: AnswerState) => {
      if (saveDebounce.current) clearTimeout(saveDebounce.current);
      pendingSave.current = { qid, state };
      saveDebounce.current = setTimeout(() => {
        const pending = pendingSave.current;
        if (!pending) return;
        pendingSave.current = null;
        fetch(`${API_BASE}/api/assessment/attempts/${attemptId}/answer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            questionId: pending.qid,
            selectedOptionIds: pending.state.selectedOptionIds,
            numericalValue: pending.state.numericalValue ?? null,
            isClear: pending.state.isClear,
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
    if (value === '') {
      updateAnswer(qid, { numericalValue: undefined, isClear: true });
    } else if (value === '-') {
      // User is mid-typing a negative number — keep existing backend state
      // so a 500 ms pause while typing '-5' doesn't wipe the saved answer.
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
    // Flush any pending debounced save immediately so fast question-switching
    // never silently drops the previous question's answer.
    if (saveDebounce.current && pendingSave.current) {
      clearTimeout(saveDebounce.current);
      saveDebounce.current = null;
      const { qid, state } = pendingSave.current;
      pendingSave.current = null;
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
    }
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

  // ── Shared question palette grid (used in both sidebar and drawer) ──────────
  const QuestionPaletteGrid = ({ onSelect }: { onSelect?: () => void }) => (
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
                  onClick={() => { navigateTo(secIdx, qIdx); onSelect?.(); }}
                  aria-label={`Q${q.displayOrder} — ${status}`}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition-all touch-manipulation
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
  );

  return (
    /* h-[100dvh] accounts for iOS browser chrome shrinking the viewport —
       avoids content being cut off under the address bar on mobile Safari. */
    <div className="flex flex-col bg-gray-50" style={{ height: '100dvh' }}>

      {/* ══════════════════════════════════════════════════════════════════════
          TOP BAR
          Desktop: title + "N questions" + timer + Submit button
          Mobile : title + "Q X / N" + big timer (Submit lives in bottom nav)
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white border-b border-gray-200 shadow-sm px-3 md:px-4 py-2 flex items-center justify-between shrink-0 z-20">
        {/* Left: title + progress */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-gray-900 truncate max-w-[180px] sm:max-w-xs md:max-w-md leading-tight">
            {attempt.testTitle}
          </p>
          {/* Mobile: show "Q X / N" inline */}
          <p className="text-xs text-gray-500 md:hidden leading-tight mt-0.5">
            Question <strong className="text-gray-800">{activeQuestion.displayOrder}</strong> of {stats.total}
            {attempt.negativeMarkingEnabled && <span className="text-red-500"> · −ve</span>}
          </p>
          {/* Desktop: show total + negative marking */}
          <p className="hidden md:block text-xs text-gray-500 leading-tight mt-0.5">
            {attempt.totalQuestions} Questions
            {attempt.negativeMarkingEnabled && ' · Negative marking enabled'}
          </p>
        </div>

        {/* Right: timer + submit */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0 ml-2">
          {/* Timer — bigger on mobile since it's the only submit-context clue */}
          <div className={`flex items-center gap-1 font-mono font-bold tabular-nums leading-none
            text-xl md:text-base ${timerColor}`}>
            <Clock className="w-4 h-4 hidden md:block" />
            {formatTime(timeLeft)}
          </div>
          {/* Submit only visible in top bar on desktop; mobile uses bottom nav */}
          <button
            onClick={() => setShowSubmitDialog(true)}
            className="hidden md:flex bg-green-600 hover:bg-green-700 text-white text-sm font-semibold
              px-4 py-2 rounded-lg transition-colors items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Submit
          </button>
        </div>
      </div>

      {/* ── Section tabs (horizontal scroll) ──────────────────────────────────── */}
      {sections.length > 1 && (
        <div className="bg-white border-b border-gray-200 flex overflow-x-auto shrink-0 scrollbar-hide">
          {sections.map((sec, i) => (
            <button
              key={sec.index}
              onClick={() => navigateTo(i, 0)}
              className={`px-4 md:px-5 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors touch-manipulation ${
                i === activeSectionIdx
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {sec.name}
            </button>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          BODY — question panel (left) + sidebar (right, desktop only)
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* ── Question panel ─────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-h-0">

          {/* Scrollable question content
              touch-pan-y: eliminates 300 ms scroll-vs-tap delay on iOS Safari.
              min-h-0 on parent: prevents overflow:hidden from trapping iOS touches. */}
          <div className="flex-1 overflow-y-auto touch-pan-y">
            <div className="px-4 py-4 md:px-6 md:py-6">

              {/* ── Question meta row ── */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    Q {activeQuestion.displayOrder}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    {activeQuestion.sectionName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full">
                    +{activeQuestion.marksForCorrect}
                  </span>
                  {activeQuestion.negativeMarks > 0 && (
                    <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-full">
                      −{activeQuestion.negativeMarks}
                    </span>
                  )}
                </div>
              </div>

              {/* Question type hint — helpful on mobile */}
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {activeQuestion.questionType === QT_MCQ
                  ? 'Single Correct Answer'
                  : activeQuestion.questionType === QT_MSQ
                  ? 'Multiple Correct Answers — select all that apply'
                  : 'Numerical Answer Type'}
              </p>

              {/* ── Passage block ── */}
              {(activeQuestion.passageTitle || activeQuestion.passageText) && (
                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 overflow-hidden">
                  <div className="px-4 py-2 bg-amber-100 border-b border-amber-200 flex items-center gap-2">
                    <span>📖</span>
                    <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                      {activeQuestion.passageTitle ?? 'Read the following passage'}
                    </p>
                  </div>
                  {activeQuestion.passageText && (
                    <div
                      className="px-4 py-3 text-sm text-gray-800 leading-relaxed overflow-y-auto max-h-40 md:max-h-56 touch-pan-y prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: activeQuestion.passageText }}
                    />
                  )}
                </div>
              )}

              {/* ── Question text ──
                  prose-base gives 16 px body text which is readable without zooming.
                  prose-sm was 14 px — too small for exam conditions on a phone. */}
              <div
                className="prose prose-base max-w-none text-gray-900 mb-5 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: activeQuestion.text }}
              />

              {/* ── Answer area ── */}
              {activeQuestion.questionType === QT_NAT ? (
                <div className="max-w-sm">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Enter your answer:
                  </label>
                  <input
                    type="number"
                    step="any"
                    inputMode="decimal"
                    value={natInput}
                    onChange={e => handleNatInput(e.target.value)}
                    placeholder="Type your answer here…"
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl text-xl font-mono
                      focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
                  {currentAnswer?.numericalValue !== undefined ? (
                    <p className="text-sm text-green-600 mt-2 font-semibold">
                      ✓ Saved: {currentAnswer.numericalValue}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400 mt-1.5">No answer saved yet</p>
                  )}
                </div>
              ) : (
                /* pb-6 so the last option clears the mobile bottom nav bar */
                <div className="space-y-3 pb-6">
                  {activeQuestion.options.map(opt => {
                    const isSelected = currentAnswer?.selectedOptionIds?.includes(opt.id) ?? false;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleOptionSelect(opt.id)}
                        /* touch-manipulation removes the 300 ms double-tap delay
                           and prevents scroll-gesture from swallowing taps — iOS Safari critical. */
                        className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl border-2
                          text-left transition-all touch-manipulation active:scale-[0.99] ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                            : 'border-gray-200 bg-white active:bg-gray-50'
                        }`}
                      >
                        {/* Option label circle — 36px, thumb-friendly */}
                        <span className={`shrink-0 w-9 h-9 rounded-full border-2 flex items-center
                          justify-center text-sm font-bold transition-colors ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-gray-300 bg-white text-gray-600'
                        }`}>
                          {opt.label}
                        </span>
                        {/* Option text — text-base for readability */}
                        <span
                          className="flex-1 text-base text-gray-800 leading-snug prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: opt.text }}
                        />
                        {/* Selected tick */}
                        {isSelected && (
                          <svg className="shrink-0 w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    );
                  })}

                  {/* Clear response — small text link below options on mobile */}
                  {currentAnswer && (
                    currentAnswer.selectedOptionIds?.length > 0 ||
                    currentAnswer.numericalValue !== undefined
                  ) && (
                    <button
                      onClick={handleClearResponse}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors touch-manipulation mt-1"
                    >
                      <X className="w-3 h-3" />
                      Clear response
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Desktop bottom action bar ────────────────────────────────────── */}
          <div className="hidden md:flex items-center justify-between gap-2 bg-white border-t border-gray-200 px-4 py-2.5 shrink-0">
            <div className="flex gap-2">
              <button
                onClick={handleClearResponse}
                className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" /> Clear
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
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <button
                onClick={goNext}
                disabled={isLast}
                className="flex items-center gap-1 px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-lg disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              MOBILE BOTTOM NAVIGATION BAR
              4 equal thumb-zone buttons fixed at the bottom of the screen.
              Last question: Next slot turns into a green Submit button.
              ══════════════════════════════════════════════════════════════════ */}
          <div
            className="md:hidden grid grid-cols-4 bg-white border-t-2 border-gray-100 shrink-0"
            style={{ minHeight: 64, paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            {/* ← Prev */}
            <button
              onClick={goPrev}
              disabled={isFirst}
              className="flex flex-col items-center justify-center gap-0.5 py-2 disabled:opacity-30 touch-manipulation active:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
              <span className="text-[10px] font-semibold text-gray-500">Prev</span>
            </button>

            {/* 📋 Questions palette — shows answered / total */}
            <button
              onClick={() => setShowNavDrawer(true)}
              className="flex flex-col items-center justify-center gap-0.5 py-2 bg-indigo-50 touch-manipulation active:bg-indigo-100 transition-colors"
            >
              <LayoutGrid className="w-5 h-5 text-indigo-600" />
              <span className="text-[10px] font-bold text-indigo-600">{stats.answered}/{stats.total}</span>
            </button>

            {/* 🏁 Mark for review */}
            <button
              onClick={handleMarkForReview}
              className={`flex flex-col items-center justify-center gap-0.5 py-2 touch-manipulation transition-colors ${
                currentAnswer?.isMarkedForReview ? 'bg-orange-50 active:bg-orange-100' : 'active:bg-gray-50'
              }`}
            >
              <Flag className={`w-5 h-5 ${currentAnswer?.isMarkedForReview ? 'text-orange-500 fill-orange-100' : 'text-gray-400'}`} />
              <span className={`text-[10px] font-semibold ${currentAnswer?.isMarkedForReview ? 'text-orange-500' : 'text-gray-400'}`}>
                {currentAnswer?.isMarkedForReview ? 'Marked' : 'Mark'}
              </span>
            </button>

            {/* Next → or ✅ Submit (on last question) */}
            <button
              onClick={isLast ? () => setShowSubmitDialog(true) : goNext}
              className={`flex flex-col items-center justify-center gap-0.5 py-2 touch-manipulation transition-colors ${
                isLast ? 'bg-green-600 active:bg-green-700' : 'bg-indigo-600 active:bg-indigo-700'
              }`}
            >
              {isLast
                ? <Send className="w-5 h-5 text-white" />
                : <ChevronRight className="w-5 h-5 text-white" />}
              <span className="text-[10px] font-bold text-white">
                {isLast ? 'Submit' : 'Next'}
              </span>
            </button>
          </div>
        </div>

        {/* ── Sidebar: Question navigation (desktop only) ──────────────────── */}
        <div className="hidden md:flex md:flex-col w-64 border-l border-gray-200 bg-white overflow-y-auto shrink-0">
          {/* Legend */}
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Legend</p>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: 'Not Visited',  cls: STATUS_COLORS.notVisited },
                { label: 'Not Answered', cls: STATUS_COLORS.notAnswered },
                { label: 'Answered',     cls: STATUS_COLORS.answered },
                { label: 'Marked',       cls: STATUS_COLORS.markedForReview },
                { label: 'Ans+Marked',   cls: STATUS_COLORS.answeredAndMarked },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={`w-4 h-4 rounded-full shrink-0 ${l.cls}`} />
                  <span className="text-[10px] text-gray-600">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          <QuestionPaletteGrid />

          {/* Stats */}
          <div className="p-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs text-center shrink-0">
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
                {Math.max(0, stats.total - stats.answered - stats.notVisited)}
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

      {/* ══════════════════════════════════════════════════════════════════════════
          MOBILE: Question palette — full-screen drawer
          ══════════════════════════════════════════════════════════════════════════ */}
      {showNavDrawer && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col bg-white">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Question Palette</h3>
              <p className="text-xs text-gray-500">Tap any question to jump to it</p>
            </div>
            <button
              onClick={() => setShowNavDrawer(false)}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 touch-manipulation"
              aria-label="Close palette"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-4 gap-2 px-4 py-3 border-b border-gray-100 shrink-0">
            {[
              { n: stats.answered,  label: 'Answered',    cls: 'bg-green-50 text-green-700' },
              { n: stats.marked,    label: 'Marked',      cls: 'bg-orange-50 text-orange-700' },
              { n: Math.max(0, stats.total - stats.answered - stats.notVisited), label: 'Not Ans.', cls: 'bg-red-50 text-red-700' },
              { n: stats.notVisited, label: 'Not Seen',   cls: 'bg-gray-50 text-gray-600' },
            ].map(s => (
              <div key={s.label} className={`rounded-xl p-2.5 text-center ${s.cls}`}>
                <p className="text-xl font-extrabold leading-none">{s.n}</p>
                <p className="text-[10px] font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="px-4 py-2.5 border-b border-gray-100 shrink-0">
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              {[
                { label: 'Not Visited',  cls: STATUS_COLORS.notVisited },
                { label: 'Not Answered', cls: STATUS_COLORS.notAnswered },
                { label: 'Answered',     cls: STATUS_COLORS.answered },
                { label: 'Marked',       cls: STATUS_COLORS.markedForReview },
                { label: 'Ans+Marked',   cls: STATUS_COLORS.answeredAndMarked },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={`w-4 h-4 rounded-full shrink-0 ${l.cls}`} />
                  <span className="text-[11px] text-gray-600">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Question grid — thumb-friendly w-11 h-11 buttons */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {sections.map((sec, secIdx) => (
              <div key={sec.index}>
                <p className="text-xs font-bold text-gray-500 mb-2.5 uppercase tracking-wide">
                  {sec.name}
                </p>
                <div className="flex flex-wrap gap-2">
                  {sec.questions.map((q, qIdx) => {
                    const ans = answers[q.questionId];
                    const status = getNavStatus(q, ans);
                    const isActive = secIdx === activeSectionIdx && qIdx === activeQIdx;
                    return (
                      <button
                        key={q.attemptQuestionId}
                        onClick={() => { navigateTo(secIdx, qIdx); setShowNavDrawer(false); }}
                        aria-label={`Q${q.displayOrder} — ${status}`}
                        className={`w-11 h-11 rounded-xl text-sm font-bold touch-manipulation
                          ${STATUS_COLORS[status]}
                          ${isActive ? 'ring-2 ring-indigo-600 ring-offset-2 scale-110' : 'active:scale-95'}`}
                      >
                        {q.displayOrder}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            {/* Bottom spacer for safe area */}
            <div style={{ height: 'env(safe-area-inset-bottom, 16px)' }} />
          </div>
        </div>
      )}

      {/* ── Tab switch warning ───────────────────────────────────────────────── */}
      {showTabWarning && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Warning!</h3>
            <p className="text-gray-600 text-sm mb-1">You switched away from the exam.</p>
            <p className="text-red-600 text-sm font-semibold mb-5">
              {tabSwitchCount}/3 — exam auto-submits on the 3rd switch.
            </p>
            <button
              onClick={() => setShowTabWarning(false)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors touch-manipulation"
            >
              OK, I understand
            </button>
          </div>
        </div>
      )}

      {/* ── Submit confirmation ──────────────────────────────────────────────── */}
      {showSubmitDialog && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Submit Test?</h3>
            <p className="text-gray-500 text-sm mb-5">You cannot change answers after submitting.</p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { n: stats.answered, label: 'Answered', cls: 'bg-green-50', num: 'text-green-700', txt: 'text-green-600' },
                { n: stats.marked,   label: 'Marked',   cls: 'bg-orange-50', num: 'text-orange-700', txt: 'text-orange-600' },
                { n: Math.max(0, stats.total - stats.answered - stats.notVisited), label: 'Not Answered', cls: 'bg-red-50', num: 'text-red-700', txt: 'text-red-600' },
                { n: stats.notVisited, label: 'Not Visited', cls: 'bg-gray-50', num: 'text-gray-700', txt: 'text-gray-500' },
              ].map(s => (
                <div key={s.label} className={`${s.cls} rounded-xl p-3 text-center`}>
                  <p className={`text-2xl font-bold ${s.num}`}>{s.n}</p>
                  <p className={`text-xs mt-0.5 ${s.txt}`}>{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitDialog(false)}
                disabled={submitting}
                className="flex-1 px-4 py-3.5 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 disabled:opacity-50 touch-manipulation"
              >
                Go Back
              </button>
              <button
                onClick={() => handleSubmit(false)}
                disabled={submitting}
                className="flex-1 px-4 py-3.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 touch-manipulation"
              >
                {submitting && (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                )}
                {submitting ? 'Submitting…' : 'Submit Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
