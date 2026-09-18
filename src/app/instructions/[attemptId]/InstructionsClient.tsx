'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowRight, ChevronLeft, Loader2 } from 'lucide-react';
import { AttemptInfo } from '@/types/exam';
import { StatusLegend } from '@/components/exam/PaletteStatus';
import { GridMark } from '@/components/layout/Logo';
import RichContent from '@/components/ui/RichContent';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

interface Props {
  info: AttemptInfo;
  token: string;
  candidateName?: string;
}

export default function InstructionsClient({ info, token, candidateName }: Props) {
  const router = useRouter();
  const [agreed,  setAgreed]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const totalMaxMarks = info.sections.reduce((sum, s) => sum + s.questionCount * s.marksPerQuestion, 0);

  const handleStart = async () => {
    if (!agreed) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/assessment/attempts/${info.attemptId}/acknowledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
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

  const leave = () => {
    if (window.confirm(
      'Your test attempt is already created and the timer will run.\n\n' +
      'If you leave now you can resume from the dashboard.\n\nLeave anyway?'
    )) router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="h-14 md:h-[60px] bg-ink text-white flex items-center gap-3 px-4 md:px-8">
        <button onClick={leave} className="w-10 h-10 -ml-2 flex items-center justify-center rounded-lg hover:bg-ink-soft" aria-label="Back to dashboard">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <GridMark size={28} />
        <span className="font-semibold text-[15px] md:text-base truncate">{info.testTitle}</span>
        {candidateName && <span className="ml-auto hidden sm:block text-sm text-ink-muted">{candidateName}</span>}
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-6 md:py-9 grid lg:grid-cols-[1fr_400px] lg:grid-rows-[auto_1fr] gap-5 lg:gap-x-8 lg:gap-y-5 items-start">
        <div className="min-w-0 bg-white border border-line rounded-xl p-5 md:px-9 md:py-8 flex flex-col gap-6 order-2 lg:order-none lg:col-start-1 lg:row-start-1 lg:row-span-2">
          <h1 className="text-[22px] md:text-[28px] font-bold leading-tight">Read the instructions carefully</h1>
          <ol className="list-decimal pl-5 flex flex-col gap-3 text-[15px] md:text-base leading-relaxed text-[#344054]">
            <li>The countdown at the top right shows the time left. The test submits itself when it reaches zero.</li>
            <li>Click a question number in the palette to go to it directly. Your answer is saved as soon as you choose it.</li>
            <li><b>Save &amp; Next</b> moves to the next question. <b>Mark for Review &amp; Next</b> flags the question so you can return to it; <b>Clear Response</b> removes your answer.</li>
            <li>For numerical questions, type the answer with the on-screen keypad. Integers and decimals are accepted.</li>
            <li>Questions marked for review that have an answer <b>will</b> be evaluated.</li>
            <li>Switching to another tab or app is recorded. The test is submitted automatically on the third switch.</li>
          </ol>

          <div className="flex flex-col gap-3 p-4 md:p-5 bg-[#f9fafb] rounded-[10px]">
            <p className="font-semibold text-[15px]">The question palette uses these symbols</p>
            <StatusLegend />
          </div>

          {info.instructions && (
            <div className="min-w-0 text-[15px] leading-relaxed text-[#344054]">
              <p className="font-semibold text-ink mb-1.5">From the test author</p>
              <RichContent html={info.instructions} />
            </div>
          )}
        </div>

          <div className="min-w-0 bg-white border border-line rounded-xl p-5 md:p-6 flex flex-col gap-3.5 order-1 lg:order-none lg:col-start-2 lg:row-start-1">
            <p className="text-[17px] font-semibold">Test summary</p>
            <dl className="grid grid-cols-2 gap-2.5">
              {[
                ['Duration', `${info.durationMinutes} min`],
                ['Questions', String(info.totalQuestions)],
                ['Maximum marks', String(totalMaxMarks)],
                ['Pass mark', `${info.passingPercent}%`],
              ].map(([k, v]) => (
                <div key={k} className="bg-[#f9fafb] rounded-lg p-3">
                  <dt className="text-[12.5px] text-[#667085]">{k}</dt>
                  <dd className="font-mono font-semibold text-[19px] mt-1">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f9fafb] text-[12.5px] text-[#475467] text-left">
                    <th className="font-semibold px-2.5 py-2">Section</th>
                    <th className="font-semibold px-2.5 py-2">Q</th>
                    <th className="font-semibold px-2.5 py-2">+</th>
                    {info.negativeMarkingEnabled && <th className="font-semibold px-2.5 py-2">−</th>}
                  </tr>
                </thead>
                <tbody>
                  {info.sections.map((sec, i) => (
                    <tr key={i} className="border-b border-[#eef0f3] last:border-0">
                      <td className="px-2.5 py-2.5">
                        {sec.name}
                        {sec.subjectName && sec.subjectName !== sec.name && <span className="block text-[12.5px] text-[#667085]">{sec.subjectName}</span>}
                      </td>
                      <td className="px-2.5 py-2.5 font-mono">{sec.questionCount}</td>
                      <td className="px-2.5 py-2.5 font-mono text-[#0b6b31]">{sec.marksPerQuestion}</td>
                      {info.negativeMarkingEnabled && <td className="px-2.5 py-2.5 font-mono text-[#b42318]">{sec.negativeMarksPerQuestion}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!info.negativeMarkingEnabled && <p className="text-[13px] text-[#475467]">No negative marking in this test.</p>}
          </div>

          <div className="min-w-0 bg-white border border-line rounded-xl p-5 flex flex-col gap-4 order-3 lg:order-none lg:col-start-2 lg:row-start-2 lg:sticky lg:top-6">
            <label className="flex gap-3 items-start cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 w-[22px] h-[22px] rounded-[5px] accent-[#1760f4] shrink-0 cursor-pointer"
              />
              <span className="text-[14.5px] leading-snug">I have read the instructions and I am ready to begin.</span>
            </label>
            {error && (
              <p className="flex items-center gap-2 text-[13.5px] text-[#b42318] bg-[#fef3f2] border border-[#fecdca] rounded-lg px-3 py-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />{error}
              </p>
            )}
            <button
              onClick={handleStart}
              disabled={!agreed || loading}
              className="h-[50px] rounded-lg bg-primary text-white text-base font-semibold inline-flex items-center justify-center gap-2 hover:bg-primary-dark disabled:bg-[#e4e7ec] disabled:text-[#98a2b3] disabled:cursor-not-allowed"
            >
              {loading ? <><Loader2 className="w-[18px] h-[18px] animate-spin" /> Starting…</> : <>Start test <ArrowRight className="w-[17px] h-[17px]" /></>}
            </button>
          </div>
      </div>
    </div>
  );
}
