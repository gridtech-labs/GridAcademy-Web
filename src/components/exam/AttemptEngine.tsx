'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ChevronDown, ChevronLeft, ChevronRight, Delete, Flag, LayoutGrid, Loader2, X } from 'lucide-react';
import { AttemptStart, AttemptQuestion, AnswerState } from '@/types/exam';
import { QStatus, STATUS_LABEL, StatusLegend, StatusMark } from './PaletteStatus';

// ── Constants ─────────────────────────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

// Question type enum — must match backend QuestionType enum
const QT_MCQ = 1;
const QT_MSQ = 2;
const QT_NAT = 3;
const QT_TRUE_FALSE = 5;
const QT_ASSERTION_REASON = 7;
const QT_PASSAGE = 8;

const TYPE_LABEL: Record<number, string> = {
  [QT_MCQ]: 'Single correct',
  [QT_MSQ]: 'Multiple correct',
  [QT_NAT]: 'Numerical value',
  [QT_TRUE_FALSE]: 'True / False',
  [QT_ASSERTION_REASON]: 'Assertion – Reason',
  [QT_PASSAGE]: 'Passage based',
};

const SUMMARY_COLUMNS: QStatus[] = ['answered', 'notAnswered', 'marked', 'answeredMarked', 'notVisited'];

interface Props {
  attempt: AttemptStart;
  token: string;
  candidateName?: string;
}

interface Section {
  index: number;
  name: string;
  questions: AttemptQuestion[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatTime(seconds: number): string {
  if (seconds <= 0) return '00:00:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
}

function hasAnswer(ans: AnswerState | undefined) {
  return (ans?.selectedOptionIds?.length ?? 0) > 0 ||
    (ans?.numericalValue !== undefined && ans?.numericalValue !== null);
}

function isMarked(q: AttemptQuestion, ans: AnswerState | undefined) {
  return ans?.isMarkedForReview ?? q.isMarkedForReview;
}

function getStatus(q: AttemptQuestion, ans: AnswerState | undefined): QStatus {
  const marked = isMarked(q, ans);
  const answered = hasAnswer(ans);
  if (marked && answered) return 'answeredMarked';
  if (marked) return 'marked';
  if (answered) return 'answered';
  if (ans !== undefined || q.isVisited) return 'notAnswered';
  return 'notVisited';
}

function emptyCounts(): Record<QStatus, number> {
  return { notVisited: 0, notAnswered: 0, answered: 0, marked: 0, answeredMarked: 0 };
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AttemptEngine({ attempt, token, candidateName }: Props) {
  const router = useRouter();
  const { attemptId } = attempt;

  const sections: Section[] = useMemo(() => {
    const map = new Map<number, Section>();
    for (const q of attempt.questions) {
      if (!map.has(q.sectionIndex)) map.set(q.sectionIndex, { index: q.sectionIndex, name: q.sectionName, questions: [] });
      map.get(q.sectionIndex)!.questions.push(q);
    }
    const list: Section[] = [];
    map.forEach(sec => {
      sec.questions.sort((a, b) => a.displayOrderInSection - b.displayOrderInSection);
      list.push(sec);
    });
    return list.sort((a, b) => a.index - b.index);
  }, [attempt.questions]);

  // ── State ───────────────────────────────────────────────────────────────────
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [activeQIdx, setActiveQIdx] = useState(0);

  // answers keyed by questionId (string UUID)
  const [answers, setAnswers] = useState<Record<string, AnswerState>>(() => {
    const byId = new Map(attempt.questions.map(q => [q.questionId, q]));
    const init: Record<string, AnswerState> = {};
    for (const sa of attempt.savedAnswers) {
      init[sa.questionId] = {
        questionId: sa.questionId,
        selectedOptionIds: sa.selectedOptionIds ?? [],
        numericalValue: sa.numericalValue ?? undefined,
        isClear: sa.isClear,
        // Keep review marks across a reload
        isMarkedForReview: sa.isMarkedForReview ?? byId.get(sa.questionId)?.isMarkedForReview ?? false,
      };
    }
    return init;
  });

  const [timeLeft, setTimeLeft] = useState(Math.max(0, attempt.durationSeconds - attempt.secondsElapsed));
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [natInput, setNatInput] = useState('');
  const [showPalette, setShowPalette] = useState(false);
  const [paletteSectionIdx, setPaletteSectionIdx] = useState(0);
  const [passageOpen, setPassageOpen] = useState(false);

  const saveDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Tracks the answer waiting to be flushed so navigation never drops a save
  const pendingSave = useRef<{ qid: string; state: AnswerState } | null>(null);
  // Guards against auto-submitting on the very first render when timeLeft === 0
  const hasStartedTimer = useRef(false);

  const activeSection = sections[activeSectionIdx];
  const activeQuestion: AttemptQuestion | undefined = activeSection?.questions[activeQIdx];

  // ── Sync NAT input when question changes ────────────────────────────────────
  useEffect(() => {
    if (!activeQuestion) return;
    const ans = answers[activeQuestion.questionId];
    setNatInput(ans?.numericalValue !== undefined && ans.numericalValue !== null ? String(ans.numericalValue) : '');
    setPassageOpen(false);
  }, [activeQuestion?.questionId]);

  // ── Timer countdown ─────────────────────────────────────────────────────────
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
        [qid]: { questionId: qid, selectedOptionIds: [], isClear: false, isMarkedForReview: activeQuestion.isMarkedForReview },
      }));
    }
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
        fetch(`${API_BASE}/api/assessment/attempts/${attemptId}/violation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ violationType: 'TabSwitch' }),
        }).catch(() => {});
        if (next >= 3) handleSubmit(true);
        else setShowTabWarning(true);
        return next;
      });
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // ── Save answer to backend (debounced, 500 ms) ──────────────────────────────
  const postAnswer = useCallback((qid: string, state: AnswerState) => {
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
  }, [attemptId, token]);

  const persistAnswer = useCallback((qid: string, state: AnswerState) => {
    if (saveDebounce.current) clearTimeout(saveDebounce.current);
    pendingSave.current = { qid, state };
    saveDebounce.current = setTimeout(() => {
      const pending = pendingSave.current;
      if (!pending) return;
      pendingSave.current = null;
      postAnswer(pending.qid, pending.state);
    }, 500);
  }, [postAnswer]);

  const flushPendingSave = () => {
    if (saveDebounce.current && pendingSave.current) {
      clearTimeout(saveDebounce.current);
      saveDebounce.current = null;
      const { qid, state } = pendingSave.current;
      pendingSave.current = null;
      postAnswer(qid, state);
    }
  };

  // ── Answer handlers ─────────────────────────────────────────────────────────
  const updateAnswer = useCallback((qid: string, patch: Partial<AnswerState>) => {
    setAnswers(prev => {
      const base: AnswerState = prev[qid] ?? { questionId: qid, selectedOptionIds: [], isClear: false, isMarkedForReview: false };
      const next: AnswerState = { ...base, ...patch, questionId: qid };
      persistAnswer(qid, next);
      return { ...prev, [qid]: next };
    });
  }, [persistAnswer]);

  /** The server only toggles, so call it only when the mark actually changes. */
  const setReviewMark = (q: AttemptQuestion, marked: boolean) => {
    const qid = q.questionId;
    if (isMarked(q, answers[qid]) === marked) return;
    setAnswers(prev => ({
      ...prev,
      [qid]: { ...(prev[qid] ?? { questionId: qid, selectedOptionIds: [], isClear: false }), isMarkedForReview: marked },
    }));
    fetch(`${API_BASE}/api/assessment/attempts/${attemptId}/mark-review/${qid}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  };

  const isMulti = activeQuestion?.questionType === QT_MSQ;
  const isNumerical = activeQuestion?.questionType === QT_NAT;

  const handleOptionSelect = (optionId: number) => {
    if (!activeQuestion) return;
    const qid = activeQuestion.questionId;
    const selected = answers[qid]?.selectedOptionIds ?? [];
    const next = isMulti
      ? (selected.includes(optionId) ? selected.filter(id => id !== optionId) : [...selected, optionId])
      : (selected.includes(optionId) ? [] : [optionId]);
    updateAnswer(qid, { selectedOptionIds: next, isClear: next.length === 0 });
  };

  const handleNatInput = (value: string) => {
    if (!/^-?\d*\.?\d*$/.test(value)) return;
    setNatInput(value);
    if (!activeQuestion) return;
    const qid = activeQuestion.questionId;
    const num = parseFloat(value);
    if (value === '') {
      updateAnswer(qid, { numericalValue: undefined, isClear: true });
    } else if (value === '-' || value === '.' || value === '-.') {
      // Mid-typing — keep the saved answer until there's a number
    } else if (!isNaN(num)) {
      updateAnswer(qid, { numericalValue: num, isClear: false });
    }
  };

  const pressKey = (key: string) => {
    if (key === 'back') return handleNatInput(natInput.slice(0, -1));
    if (key === 'clear') return handleNatInput('');
    if (key === '-') return handleNatInput(natInput.startsWith('-') ? natInput.slice(1) : `-${natInput}`);
    handleNatInput(natInput + key);
  };

  const handleClearResponse = () => {
    if (!activeQuestion) return;
    setNatInput('');
    updateAnswer(activeQuestion.questionId, { selectedOptionIds: [], numericalValue: undefined, isClear: true });
  };

  // ── Navigation ──────────────────────────────────────────────────────────────
  const navigateTo = (secIdx: number, qIdx: number) => {
    // Flush any pending save so fast question-switching never drops an answer
    flushPendingSave();
    setActiveSectionIdx(secIdx);
    setActiveQIdx(qIdx);
  };

  const goNext = () => {
    if (!activeSection) return;
    if (activeQIdx < activeSection.questions.length - 1) navigateTo(activeSectionIdx, activeQIdx + 1);
    else if (activeSectionIdx < sections.length - 1) navigateTo(activeSectionIdx + 1, 0);
  };

  const goPrev = () => {
    if (activeQIdx > 0) navigateTo(activeSectionIdx, activeQIdx - 1);
    else if (activeSectionIdx > 0) navigateTo(activeSectionIdx - 1, sections[activeSectionIdx - 1].questions.length - 1);
  };

  const handleSaveAndNext = () => {
    if (!activeQuestion) return;
    setReviewMark(activeQuestion, false);
    goNext();
  };

  const handleMarkAndNext = () => {
    if (!activeQuestion) return;
    setReviewMark(activeQuestion, true);
    goNext();
  };

  const isFirst = activeSectionIdx === 0 && activeQIdx === 0;
  const isLast = activeSectionIdx === sections.length - 1 && !!activeSection && activeQIdx === activeSection.questions.length - 1;

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (autoSubmit = false) => {
    if (!autoSubmit && !showSubmitDialog) {
      setShowSubmitDialog(true);
      return;
    }
    flushPendingSave();
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/assessment/attempts/${attemptId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Submission failed');
      router.push(`/attempt/${attemptId}/result`);
    } catch {
      setSubmitting(false);
      if (!autoSubmit) alert('Failed to submit. Please check your connection and try again.');
    }
  };

  // ── Counts ──────────────────────────────────────────────────────────────────
  const sectionCounts = useMemo(() => sections.map(sec => {
    const c = emptyCounts();
    for (const q of sec.questions) c[getStatus(q, answers[q.questionId])]++;
    return c;
  }), [sections, answers]);

  const totalCounts = useMemo(() => {
    const t = emptyCounts();
    for (const c of sectionCounts) (Object.keys(t) as QStatus[]).forEach(k => { t[k] += c[k]; });
    return t;
  }, [sectionCounts]);

  const answeredIn = (i: number) => sectionCounts[i].answered + sectionCounts[i].answeredMarked;

  const timerTone = timeLeft > 300 ? 'text-white' : timeLeft > 60 ? 'text-saffron' : 'text-[#fda29b]';

  if (!activeSection || !activeQuestion) {
    return <div className="flex items-center justify-center h-screen text-[#475467]">No questions found.</div>;
  }

  const currentAnswer = answers[activeQuestion.questionId];
  const hasPassage = !!(activeQuestion.passageTitle || activeQuestion.passageText);
  const typeLabel = TYPE_LABEL[activeQuestion.questionType] ?? 'Question';
  const canUseOptions = !isNumerical && activeQuestion.options.length > 0;

  // ── Pieces ──────────────────────────────────────────────────────────────────
  const paletteGrid = (secIdx: number, onPick?: () => void, cell: [number, number] = [44, 40]) => (
    <div className="grid grid-cols-5 gap-x-2 gap-y-3 justify-items-center">
      {sections[secIdx].questions.map((q, qIdx) => {
        const status = getStatus(q, answers[q.questionId]);
        const current = secIdx === activeSectionIdx && qIdx === activeQIdx;
        return (
          <button
            key={q.attemptQuestionId}
            onClick={() => { navigateTo(secIdx, qIdx); onPick?.(); }}
            aria-label={`Question ${q.displayOrder}: ${STATUS_LABEL[status]}`}
            aria-current={current ? 'true' : undefined}
            className="touch-manipulation rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <StatusMark status={status} size={cell} current={current}>{q.displayOrder}</StatusMark>
          </button>
        );
      })}
    </div>
  );

  const questionHeader = (
    <div className="flex items-center gap-2.5 md:gap-3 flex-wrap">
      <span className="text-[17px] md:text-xl font-bold">Question {activeQuestion.displayOrder}</span>
      <span className="h-[22px] md:h-[26px] inline-flex items-center px-2.5 rounded-full bg-[#f2f4f7] text-[#344054] text-[11.5px] md:text-[12.5px] font-medium">{typeLabel}</span>
      <span className="ml-auto text-[13px] md:text-sm text-[#475467]">
        <span className="hidden sm:inline">Marks </span>
        <b className="text-[#12803c]">+{activeQuestion.marksForCorrect}</b>
        {activeQuestion.negativeMarks > 0 && <> <b className="text-[#b42318]">−{activeQuestion.negativeMarks}</b></>}
      </span>
    </div>
  );

  const answerArea = isNumerical ? (
    <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
      <div className="w-full max-w-[320px] flex flex-col gap-2.5">
        <label htmlFor="nat-answer" className="text-sm font-medium">Your answer</label>
        <input
          id="nat-answer"
          value={natInput}
          readOnly
          inputMode="none"
          placeholder="Use the keypad"
          onKeyDown={e => {
            if (/^[0-9.]$/.test(e.key)) { e.preventDefault(); pressKey(e.key); }
            else if (e.key === '-') { e.preventDefault(); pressKey('-'); }
            else if (e.key === 'Backspace') { e.preventDefault(); pressKey('back'); }
          }}
          className="h-[52px] rounded-[9px] border-2 border-primary px-4 font-mono text-[22px] font-semibold placeholder:text-[15px] placeholder:font-sans placeholder:font-normal placeholder:text-[#98a2b3] focus:outline-none focus:ring-4 focus:ring-primary/15"
        />
        <div className="grid grid-cols-3 gap-2">
          {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.', '-'].map(k => (
            <button key={k} type="button" onClick={() => pressKey(k)}
              className="h-11 rounded-lg border border-[#d0d5dd] bg-white font-mono text-[17px] font-medium active:bg-paper hover:bg-paper touch-manipulation"
              aria-label={k === '-' ? 'Minus sign' : k === '.' ? 'Decimal point' : k}>
              {k === '-' ? '−' : k}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => pressKey('back')}
            className="h-11 rounded-lg border border-[#d0d5dd] bg-white text-sm font-medium inline-flex items-center justify-center gap-1.5 hover:bg-paper touch-manipulation">
            <Delete className="w-4 h-4" /> Backspace
          </button>
          <button type="button" onClick={() => pressKey('clear')}
            className="h-11 rounded-lg border border-[#d0d5dd] bg-white text-sm font-medium hover:bg-paper touch-manipulation">
            Clear all
          </button>
        </div>
      </div>
      <p className="hidden md:block max-w-[340px] px-4 py-3.5 bg-[#f9fafb] rounded-[10px] text-sm leading-relaxed text-[#475467]">
        Numerical answer. Enter digits, a decimal point or a minus sign with the keypad — as in the computer-based exam.
      </p>
    </div>
  ) : canUseOptions ? (
    <div className="flex flex-col gap-2.5" role={isMulti ? 'group' : 'radiogroup'} aria-label="Options">
      {isMulti && <p className="text-[13px] text-[#475467] -mt-1">Select all correct options.</p>}
      {activeQuestion.options.map(opt => {
        const selected = currentAnswer?.selectedOptionIds?.includes(opt.id) ?? false;
        return (
          <button
            key={opt.id}
            onClick={() => handleOptionSelect(opt.id)}
            role={isMulti ? 'checkbox' : 'radio'}
            aria-checked={selected}
            className={`w-full flex items-center gap-3.5 px-4 py-3 min-h-[56px] rounded-[10px] border-[1.5px] text-left touch-manipulation transition-colors ${
              selected ? 'border-primary bg-[#f0f5ff]' : 'border-[#d0d5dd] bg-white hover:border-[#98a2b3]'
            }`}
          >
            <span className={`w-7 h-7 shrink-0 flex items-center justify-center text-[13px] font-semibold border-[1.5px] ${isMulti ? 'rounded-md' : 'rounded-full'} ${
              selected ? 'bg-primary border-primary text-white' : 'border-[#98a2b3] text-[#344054]'
            }`}>
              {opt.label}
            </span>
            <span className="q-html flex-1 min-w-0 text-base md:text-[17px] leading-normal" dangerouslySetInnerHTML={{ __html: opt.text }} />
          </button>
        );
      })}
    </div>
  ) : (
    <p className="px-4 py-3 rounded-lg bg-[#fef3dc] text-[#8a5200] text-sm">
      This question type can’t be answered on this screen yet. Use Save &amp; Next to move on.
    </p>
  );

  const passageBody = hasPassage && (
    <>
      <p className="font-semibold text-[15px]">{activeQuestion.passageTitle ?? 'Read the passage'}</p>
      {activeQuestion.passageText && (
        <div className="q-html text-base md:text-[17px] leading-[1.8] text-[#1d2939]" dangerouslySetInnerHTML={{ __html: activeQuestion.passageText }} />
      )}
    </>
  );

  const questionBlock = (
    <div className="flex flex-col gap-4">
      <div className="q-html text-[17px] md:text-lg leading-[1.75] overflow-x-auto" dangerouslySetInnerHTML={{ __html: activeQuestion.text }} />
      {answerArea}
    </div>
  );

  // ── Layout ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col bg-white text-ink" style={{ height: '100dvh' }}>
      {/* Top bar */}
      <header className="h-14 md:h-[60px] bg-ink text-white flex items-center gap-3 md:gap-5 pl-3 pr-2 md:px-6 shrink-0">
        <span className="hidden md:flex w-7 h-7 rounded-[7px] bg-primary items-center justify-center font-bold shrink-0">G</span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm md:text-base truncate leading-tight">{attempt.testTitle}</p>
          {candidateName && <p className="hidden md:block text-[12.5px] text-ink-muted truncate">Candidate: {candidateName}</p>}
        </div>
        <div className="flex items-center gap-2.5 bg-ink-soft rounded-lg px-2.5 md:px-3.5 py-1.5 md:py-2" role="timer" aria-live="off">
          <span className="hidden md:inline text-[12.5px] text-ink-muted">Time left</span>
          <span className={`font-mono font-semibold text-[17px] md:text-[22px] tabular-nums ${timerTone}`}>{formatTime(timeLeft)}</span>
        </div>
        <button
          onClick={() => { setPaletteSectionIdx(activeSectionIdx); setShowPalette(true); }}
          className="lg:hidden w-11 h-11 rounded-lg bg-ink-soft flex items-center justify-center"
          aria-label="Open question palette"
        >
          <LayoutGrid className="w-5 h-5" />
        </button>
      </header>

      <div className="flex flex-1 min-h-0">
        <div className="flex-1 flex flex-col min-w-0">
          {/* Section tabs */}
          <nav className="flex items-center gap-1.5 lg:gap-0.5 px-3 lg:px-6 py-2 lg:py-0 border-b border-line overflow-x-auto scrollbar-hide shrink-0" aria-label="Sections">
            {sections.map((sec, i) => {
              const on = i === activeSectionIdx;
              return (
                <button key={sec.index} onClick={() => navigateTo(i, 0)} aria-current={on ? 'true' : undefined}
                  className={`shrink-0 whitespace-nowrap font-semibold transition-colors touch-manipulation
                    h-9 px-3 rounded-full text-[13.5px] lg:rounded-none lg:h-11 lg:px-4 lg:text-[14.5px] lg:border-b-[3px] flex items-center gap-2 ${
                    on
                      ? 'bg-primary text-white lg:bg-transparent lg:text-primary-dark lg:border-primary'
                      : 'bg-[#f2f4f7] text-[#344054] lg:bg-transparent lg:text-[#475467] lg:border-transparent hover:text-ink'
                  }`}>
                  {sec.name}
                  <span className={`font-mono text-xs lg:h-[22px] lg:inline-flex lg:items-center lg:px-2 lg:rounded-full ${
                    on ? 'lg:bg-primary-tint lg:text-primary-dark' : 'lg:bg-[#f2f4f7]'
                  }`}>
                    {answeredIn(i)}<span className="hidden lg:inline">/{sec.questions.length}</span>
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Question area */}
          {hasPassage ? (
            <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden touch-pan-y">
              {/* Desktop: passage left */}
              <section className="hidden lg:flex w-1/2 flex-col gap-3.5 px-8 py-6 bg-[#fbfcfd] border-r border-line overflow-y-auto" aria-label="Passage">
                {passageBody}
              </section>
              {/* Mobile: collapsible passage on top */}
              <section className="lg:hidden bg-[#fbfcfd] border-b border-line px-4 py-3 flex flex-col gap-2" aria-label="Passage">
                <button onClick={() => setPassageOpen(o => !o)} className="flex items-center gap-2 min-h-[36px] text-left" aria-expanded={passageOpen}>
                  <span className="h-[22px] inline-flex items-center px-2 rounded-full bg-primary-tint text-primary-dark text-[11.5px] font-medium">Passage</span>
                  <span className="ml-auto text-[13.5px] font-semibold text-primary-dark inline-flex items-center gap-1">
                    {passageOpen ? 'Collapse' : 'Expand'} <ChevronDown className={`w-4 h-4 transition-transform ${passageOpen ? 'rotate-180' : ''}`} />
                  </span>
                </button>
                <div className={passageOpen ? 'flex flex-col gap-2' : 'flex flex-col gap-2 max-h-[11rem] overflow-hidden [mask-image:linear-gradient(to_bottom,black_70%,transparent)]'}>{passageBody}</div>
              </section>
              <section className="lg:w-1/2 px-4 py-4 lg:px-8 lg:py-6 flex flex-col gap-4 lg:overflow-y-auto">
                {questionHeader}
                <div className="h-px bg-line hidden lg:block" />
                {questionBlock}
              </section>
            </div>
          ) : (
            <div className="flex-1 min-h-0 overflow-y-auto touch-pan-y">
              <div className="px-4 py-4 lg:px-10 lg:py-6 flex flex-col gap-4 max-w-[980px]">
                {questionHeader}
                <div className="h-px bg-line hidden lg:block" />
                {questionBlock}
              </div>
            </div>
          )}

          {/* Action bar — desktop */}
          <div className="hidden lg:flex h-[72px] items-center gap-3 px-6 border-t border-line bg-white shrink-0">
            <button onClick={handleMarkAndNext}
              className="h-11 px-[18px] rounded-lg border border-[#6941c6] text-[#5b34b0] font-semibold text-[15px] inline-flex items-center gap-2 hover:bg-[#f4f0fd]">
              <Flag className="w-[17px] h-[17px]" /> Mark for Review &amp; Next
            </button>
            <button onClick={handleClearResponse}
              className="h-11 px-[18px] rounded-lg border border-[#d0d5dd] font-semibold text-[15px] hover:bg-paper">
              Clear Response
            </button>
            <div className="flex-1" />
            <button onClick={goPrev} disabled={isFirst}
              className="h-11 px-[18px] rounded-lg border border-[#d0d5dd] font-semibold text-[15px] inline-flex items-center gap-1.5 hover:bg-paper disabled:opacity-40">
              <ChevronLeft className="w-[17px] h-[17px]" /> Back
            </button>
            <button onClick={isLast ? () => { handleSaveAndNext(); setShowSubmitDialog(true); } : handleSaveAndNext}
              className="h-11 min-w-[160px] px-[18px] rounded-lg bg-[#12803c] hover:bg-[#0e6b32] text-white font-semibold text-[15px] inline-flex items-center justify-center gap-1.5">
              {isLast ? 'Save & Submit' : <>Save &amp; Next <ChevronRight className="w-[17px] h-[17px]" /></>}
            </button>
          </div>

          {/* Action bar — mobile */}
          <div className="lg:hidden border-t border-line bg-white px-3 pt-2.5 flex flex-col gap-2 shrink-0"
            style={{ paddingBottom: 'max(10px, env(safe-area-inset-bottom))' }}>
            <div className="grid grid-cols-[1.5fr_1fr] gap-2">
              <button onClick={handleMarkAndNext}
                className="h-11 px-2 rounded-lg border border-[#6941c6] text-[#5b34b0] font-semibold text-[13.5px] inline-flex items-center justify-center gap-1.5 touch-manipulation">
                <Flag className="w-4 h-4 shrink-0" /> Mark for Review &amp; Next
              </button>
              <button onClick={handleClearResponse}
                className="h-11 px-2 rounded-lg border border-[#d0d5dd] font-semibold text-[13.5px] touch-manipulation">
                Clear Response
              </button>
            </div>
            <div className="grid grid-cols-[1fr_2.2fr] gap-2">
              <button onClick={goPrev} disabled={isFirst}
                className="h-12 rounded-lg border border-[#d0d5dd] font-semibold text-[15px] inline-flex items-center justify-center gap-1 disabled:opacity-40 touch-manipulation">
                <ChevronLeft className="w-[17px] h-[17px]" /> Back
              </button>
              <button onClick={isLast ? () => { handleSaveAndNext(); setShowSubmitDialog(true); } : handleSaveAndNext}
                className="h-12 rounded-lg bg-[#12803c] active:bg-[#0e6b32] text-white font-semibold text-base touch-manipulation">
                {isLast ? 'Save & Submit' : 'Save & Next'}
              </button>
            </div>
          </div>
        </div>

        {/* Palette — desktop */}
        <aside className="hidden lg:flex w-[360px] shrink-0 flex-col border-l border-line bg-[#f9fafb]" aria-label="Question palette">
          <div className="px-[22px] py-[18px] border-b border-line">
            <StatusLegend counts={sectionCounts[activeSectionIdx]} compact />
          </div>
          <div className="px-[22px] pt-4 pb-2.5 flex items-center justify-between">
            <span className="font-semibold text-sm">{activeSection.name} · {activeSection.questions.length} questions</span>
            <span className="text-[12.5px] text-[#667085]">Choose a question</span>
          </div>
          <div className="px-[22px] pt-2 pb-5 flex-1 overflow-y-auto">{paletteGrid(activeSectionIdx)}</div>
          <div className="px-[22px] py-4 border-t border-line bg-white">
            <button onClick={() => setShowSubmitDialog(true)}
              className="w-full h-11 rounded-lg bg-ink hover:bg-ink-soft text-white font-semibold text-[15px]">
              Submit test
            </button>
          </div>
        </aside>
      </div>

      {/* Palette — mobile bottom sheet */}
      {showPalette && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-ink/50" onClick={e => { if (e.target === e.currentTarget) setShowPalette(false); }}>
          <div className="bg-white rounded-t-2xl max-h-[88dvh] flex flex-col" role="dialog" aria-modal="true" aria-label="Question palette">
            <div className="flex justify-center pt-2"><span className="w-10 h-1 rounded-full bg-[#d0d5dd]" /></div>
            <div className="flex items-center pl-4 pr-2 py-1">
              <p className="flex-1 font-semibold text-[17px]">Question palette</p>
              <button onClick={() => setShowPalette(false)} className="w-11 h-11 flex items-center justify-center" aria-label="Close palette">
                <X className="w-[22px] h-[22px]" />
              </button>
            </div>
            <div className="px-4 pb-3 border-b border-line">
              <StatusLegend counts={sectionCounts[paletteSectionIdx]} compact />
            </div>
            {sections.length > 1 && (
              <div className="flex gap-1.5 px-4 py-3 overflow-x-auto scrollbar-hide">
                {sections.map((sec, i) => (
                  <button key={sec.index} onClick={() => setPaletteSectionIdx(i)}
                    className={`h-9 px-3 rounded-full text-[13.5px] font-semibold whitespace-nowrap ${
                      i === paletteSectionIdx ? 'bg-primary text-white' : 'bg-[#f2f4f7] text-[#344054]'
                    }`}>
                    {sec.name}
                  </button>
                ))}
              </div>
            )}
            <div className="px-4 py-3 overflow-y-auto flex-1">{paletteGrid(paletteSectionIdx, () => setShowPalette(false), [48, 44])}</div>
            <div className="px-4 pt-3 border-t border-line" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
              <button onClick={() => { setShowPalette(false); setShowSubmitDialog(true); }}
                className="w-full h-[50px] rounded-lg bg-ink text-white font-semibold text-base">
                Submit test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab switch warning */}
      {showTabWarning && (
        <div className="fixed inset-0 bg-ink/60 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl p-6 w-full sm:max-w-sm text-center" role="alertdialog" aria-modal="true">
            <AlertTriangle className="w-11 h-11 text-saffron mx-auto mb-3" />
            <h3 className="text-lg font-bold mb-2">You left the test screen</h3>
            <p className="text-[15px] text-[#475467] mb-1">Switching tabs or apps is recorded.</p>
            <p className="text-[15px] font-semibold text-[#b42318] mb-5">{tabSwitchCount} of 3 — the test submits on the third switch.</p>
            <button onClick={() => setShowTabWarning(false)} className="w-full h-12 rounded-lg bg-primary text-white font-semibold">
              Back to the test
            </button>
          </div>
        </div>
      )}

      {/* Submit confirmation */}
      {showSubmitDialog && (
        <div className="fixed inset-0 bg-ink/55 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white w-full sm:max-w-[820px] rounded-t-2xl sm:rounded-[14px] p-5 sm:px-8 sm:py-7 flex flex-col gap-4 max-h-[92dvh] overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="submit-title">
            <div className="flex items-center justify-between gap-3">
              <h2 id="submit-title" className="text-xl sm:text-2xl font-bold">Submit your test?</h2>
              <span className="font-mono font-semibold text-[15px] text-[#b42318]">{formatTime(timeLeft)} left</span>
            </div>
            <p className="text-[15px] text-[#475467]">You can’t change any answer after submitting. Here is where you stand:</p>
            <div className="border border-line rounded-xl overflow-x-auto">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="bg-[#f9fafb] text-[12.5px] text-[#475467]">
                    <th className="text-left font-semibold px-3.5 py-2.5">Section</th>
                    <th className="font-semibold px-2 py-2.5">Total</th>
                    {SUMMARY_COLUMNS.map(k => (
                      <th key={k} className="font-semibold px-2 py-2.5 w-[92px]">
                        {k === 'answeredMarked' ? 'Ans. & marked' : k === 'marked' ? 'Marked' : STATUS_LABEL[k]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sections.map((sec, i) => (
                    <tr key={sec.index} className="border-t border-[#eef0f3]">
                      <td className="px-3.5 py-3">{sec.name}</td>
                      <td className="px-2 py-3 text-center font-mono">{sec.questions.length}</td>
                      {SUMMARY_COLUMNS.map(k => (
                        <td key={k} className={`px-2 py-3 text-center font-mono ${k === 'notVisited' && sectionCounts[i][k] > 0 ? 'text-[#b42318] font-semibold' : ''}`}>
                          {sectionCounts[i][k]}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {sections.length > 1 && (
                    <tr className="border-t border-line bg-[#f9fafb] font-semibold">
                      <td className="px-3.5 py-3">Total</td>
                      <td className="px-2 py-3 text-center font-mono">{attempt.questions.length}</td>
                      {SUMMARY_COLUMNS.map(k => <td key={k} className="px-2 py-3 text-center font-mono">{totalCounts[k]}</td>)}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {totalCounts.marked > 0 && (
              <p className="flex items-center gap-2.5 text-sm text-[#8a5200] bg-[#fef3dc] rounded-lg px-3.5 py-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {totalCounts.marked} question{totalCounts.marked === 1 ? ' is' : 's are'} marked for review without an answer — {totalCounts.marked === 1 ? 'it' : 'they'} won’t be scored.
              </p>
            )}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 sm:gap-3">
              <button onClick={() => setShowSubmitDialog(false)} disabled={submitting}
                className="h-12 px-5 rounded-lg border border-[#d0d5dd] font-semibold text-[15px] disabled:opacity-50">
                Go back to test
              </button>
              <button onClick={() => handleSubmit(false)} disabled={submitting}
                className="h-12 px-5 rounded-lg bg-ink hover:bg-ink-soft text-white font-semibold text-[15px] inline-flex items-center justify-center gap-2 disabled:opacity-70">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? 'Submitting…' : 'Submit test'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
