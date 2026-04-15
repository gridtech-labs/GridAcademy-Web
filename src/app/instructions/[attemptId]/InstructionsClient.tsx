'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen, Clock, HelpCircle, Layers, BarChart2,
  ShieldAlert, AlertTriangle, CheckSquare, Play, Loader2,
  ChevronLeft,
} from 'lucide-react';
import { AttemptInfo } from '@/types/exam';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

interface Props {
  info: AttemptInfo;
  token: string;
}

export default function InstructionsClient({ info, token }: Props) {
  const router = useRouter();
  const [agreed,  setAgreed]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const totalMaxMarks = info.sections.reduce(
    (sum, s) => sum + s.questionCount * s.marksPerQuestion,
    0,
  );

  const handleStart = async () => {
    if (!agreed) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${API_BASE}/api/assessment/attempts/${info.attemptId}/acknowledge`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.message ?? 'Failed to start test. Please try again.');
      }

      router.push(`/attempt/${info.attemptId}`);
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* Back to dashboard */}
      <button
        onClick={() => router.push('/dashboard')}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-6 text-white">
          <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-1">
            Test Instructions
          </p>
          <h1 className="text-2xl font-extrabold leading-tight mb-4">{info.testTitle}</h1>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-1.5">
              <Clock className="w-4 h-4 text-indigo-200" />
              <span><strong>{info.durationMinutes}</strong> minutes</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-1.5">
              <HelpCircle className="w-4 h-4 text-indigo-200" />
              <span><strong>{info.totalQuestions}</strong> questions</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-1.5">
              <Layers className="w-4 h-4 text-indigo-200" />
              <span><strong>{info.sections.length}</strong> section{info.sections.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-1.5">
              <BarChart2 className="w-4 h-4 text-indigo-200" />
              <span>Passing: <strong>{info.passingPercent}%</strong></span>
            </div>
            {info.negativeMarkingEnabled ? (
              <div className="flex items-center gap-1.5 bg-red-500/30 border border-red-400/40 rounded-xl px-3 py-1.5 text-red-100">
                <AlertTriangle className="w-4 h-4" />
                <span>Negative marking</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-green-500/20 border border-green-400/30 rounded-xl px-3 py-1.5 text-green-100">
                <CheckSquare className="w-4 h-4" />
                <span>No negative marking</span>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">

          {/* ── Section Summary ──────────────────────────────────────────── */}
          <div>
            <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              Section Summary
            </h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-3 text-left">#</th>
                    <th className="px-4 py-3 text-left">Section</th>
                    <th className="px-4 py-3 text-left">Subject</th>
                    <th className="px-4 py-3 text-center">Questions</th>
                    <th className="px-4 py-3 text-center">Marks/Q</th>
                    {info.negativeMarkingEnabled && (
                      <th className="px-4 py-3 text-center">Neg/Q</th>
                    )}
                    <th className="px-4 py-3 text-center">Max Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {info.sections.map((sec, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">{idx + 1}</td>
                      <td className="px-4 py-3 font-semibold text-gray-800">{sec.name}</td>
                      <td className="px-4 py-3 text-gray-500">{sec.subjectName || '—'}</td>
                      <td className="px-4 py-3 text-center text-gray-700">{sec.questionCount}</td>
                      <td className="px-4 py-3 text-center text-green-600 font-semibold">
                        +{sec.marksPerQuestion}
                      </td>
                      {info.negativeMarkingEnabled && (
                        <td className="px-4 py-3 text-center text-red-500 font-semibold">
                          -{sec.negativeMarksPerQuestion}
                        </td>
                      )}
                      <td className="px-4 py-3 text-center font-bold text-gray-900">
                        {sec.questionCount * sec.marksPerQuestion}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 font-semibold text-sm">
                    <td colSpan={3} className="px-4 py-3 text-gray-700">Total</td>
                    <td className="px-4 py-3 text-center text-gray-900">{info.totalQuestions}</td>
                    <td className="px-4 py-3" />
                    {info.negativeMarkingEnabled && <td className="px-4 py-3" />}
                    <td className="px-4 py-3 text-center text-gray-900">{totalMaxMarks}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* ── Instructions ─────────────────────────────────────────────── */}
          <div>
            <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              Instructions
            </h2>
            {info.instructions ? (
              <div
                className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: info.instructions }}
              />
            ) : (
              <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
                <li>Read each question carefully before selecting your answer.</li>
                <li>Each correct answer carries <strong className="text-gray-800">positive marks</strong> as specified per section.</li>
                {info.negativeMarkingEnabled && (
                  <li className="text-red-600 font-medium">
                    Negative marking applies — incorrect answers will deduct marks as specified.
                  </li>
                )}
                <li>Use the question palette on the right to navigate between questions.</li>
                <li>You can <strong className="text-gray-800">mark questions for review</strong> and revisit them later.</li>
                <li>The timer starts as soon as you click <strong className="text-gray-800">Start Test</strong> and cannot be paused.</li>
                <li>The exam will <strong className="text-gray-800">auto-submit</strong> when the time limit is reached.</li>
                <li>Once submitted, your answers <strong className="text-gray-800">cannot be changed</strong>.</li>
              </ol>
            )}
          </div>

          {/* ── Exam Rules ───────────────────────────────────────────────── */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-amber-900 mb-2">Exam Rules</p>
                <ul className="space-y-1 text-sm text-amber-800">
                  <li>• Switching tabs or minimising the browser will be logged as a violation.</li>
                  <li>• Right-click context menu is disabled during the exam.</li>
                  <li>• Copy, paste, and developer-tools keyboard shortcuts are blocked.</li>
                  <li>• The exam will auto-submit if the time limit is reached.</li>
                  <li>• Once submitted, answers cannot be changed.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── Declaration Checkbox ─────────────────────────────────────── */}
          <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 transition-colors
            border-gray-200 hover:border-indigo-300 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50">
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="mt-0.5 w-5 h-5 rounded accent-indigo-600 shrink-0 cursor-pointer"
            />
            <span className="text-sm text-gray-700 leading-relaxed">
              I have read and understood all the instructions and exam rules.
              I agree to abide by them and acknowledge that any violation may result in
              disqualification.
            </span>
          </label>

          {/* ── Error ────────────────────────────────────────────────────── */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* ── Start Button ─────────────────────────────────────────────── */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-gray-400">
              <Clock className="inline w-3.5 h-3.5 mr-1" />
              Timer starts when you click Start Test
            </div>
            <button
              onClick={handleStart}
              disabled={!agreed || loading}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm
                bg-indigo-600 text-white hover:bg-indigo-700
                disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed
                transition-colors shadow-sm"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" />Starting…</>
                : <><Play className="w-4 h-4" />Start Test</>
              }
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
