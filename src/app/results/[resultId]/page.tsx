import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { api } from '@/lib/api-client';
import { TestResult } from '@/types';
import { redirect } from 'next/navigation';
import { formatTimer, calcPercentage } from '@/lib/utils';
import { Trophy, TrendingUp, Clock, Target, Share2, RotateCcw } from 'lucide-react';
import Link from 'next/link';

export default async function ResultPage({ params }: { params: { resultId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  const token = (session.user as any).accessToken;

  let result: TestResult;
  try {
    result = await api.get<TestResult>(`/api/student/results/${params.resultId}`, token);
    if (!result) redirect('/dashboard');
  } catch { redirect('/dashboard'); }

  const scorePercent = calcPercentage(result.score, result.maxScore);
  const isGood = scorePercent >= 70;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`py-10 text-center text-white ${isGood ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-indigo-600 to-purple-700'}`}>
        <div className="text-5xl mb-3">{scorePercent >= 85 ? '🏆' : scorePercent >= 70 ? '🎯' : scorePercent >= 50 ? '📈' : '💪'}</div>
        <h1 className="text-2xl font-bold mb-1">{result.title}</h1>
        <p className="text-white/80 text-sm mb-6">Result Analysis</p>

        {/* Score circle */}
        <div className="inline-flex flex-col items-center bg-white/20 backdrop-blur rounded-2xl px-10 py-6">
          <div className="text-5xl font-extrabold">{result.score}<span className="text-2xl font-normal">/{result.maxScore}</span></div>
          <div className="text-white/90 text-sm mt-1">{scorePercent}% Score</div>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm">
          {[
            { icon: Trophy, label: 'All India Rank', value: `#${result.allIndiaRank.toLocaleString()}` },
            { icon: TrendingUp, label: 'Percentile', value: `${result.percentile}%ile` },
            { icon: Clock, label: 'Time Taken', value: formatTimer(result.timeTakenSeconds) },
            { icon: Target, label: 'Test Takers', value: result.totalTestTakers.toLocaleString() },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center">
              <Icon className="w-4 h-4 text-white/70 mb-1" />
              <div className="font-bold text-lg">{value}</div>
              <div className="text-white/70">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Badges */}
        {result.badges?.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h2 className="font-bold text-gray-900 mb-3">🏅 Badges Earned</h2>
            <div className="flex flex-wrap gap-2">
              {result.badges.map(b => (
                <span key={b} className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-1.5 rounded-full text-sm font-semibold">
                  {b}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Section breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Section-wise Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Section', 'Attempted', 'Correct', 'Wrong', 'Skipped', 'Score', 'Accuracy'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {result.sectionResults.map((s, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-800">{s.sectionName}</td>
                    <td className="px-4 py-3 text-gray-600">{s.attempted}</td>
                    <td className="px-4 py-3 text-green-600 font-semibold">{s.correct}</td>
                    <td className="px-4 py-3 text-red-500">{s.wrong}</td>
                    <td className="px-4 py-3 text-gray-400">{s.skipped}</td>
                    <td className="px-4 py-3 font-bold text-gray-900">{s.score}/{s.maxScore}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${s.accuracy}%` }} />
                        </div>
                        <span className="text-gray-600 text-xs">{s.accuracy}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Answer Key */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Answer Key & Solutions</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {result.questionResults.map((q, i) => (
              <div key={q.questionId} className={`px-6 py-4 ${q.isCorrect ? 'bg-green-50/30' : q.isSkipped ? '' : 'bg-red-50/30'}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5
                    ${q.isCorrect ? 'bg-green-500 text-white' : q.isSkipped ? 'bg-gray-200 text-gray-600' : 'bg-red-500 text-white'}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 font-medium mb-2"
                      dangerouslySetInnerHTML={{ __html: q.questionText }} />
                    <div className="flex flex-wrap gap-4 text-xs">
                      <span className={`font-semibold ${q.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        Your answer: {q.yourAnswer || 'Not attempted'}
                      </span>
                      {!q.isCorrect && (
                        <span className="text-green-600 font-semibold">Correct: {q.correctAnswer}</span>
                      )}
                      <span className={`font-bold ${q.marks > 0 ? 'text-green-600' : q.marks < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                        {q.marks > 0 ? `+${q.marks}` : q.marks} marks
                      </span>
                    </div>
                    {q.solution && (
                      <p className="text-xs text-gray-500 mt-2 italic bg-yellow-50 rounded-lg p-2">
                        💡 {q.solution}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/dashboard"
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
            Back to My Tests
          </Link>
          <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50">
            <RotateCcw className="w-4 h-4" /> Retake Test
          </button>
          <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50">
            <Share2 className="w-4 h-4" /> Share Score
          </button>
        </div>
      </div>
    </div>
  );
}
