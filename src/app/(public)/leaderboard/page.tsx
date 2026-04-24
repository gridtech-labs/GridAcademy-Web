'use client';

import { useState } from 'react';
import { Trophy, Medal, Crown, TrendingUp, Users, Star, ChevronDown } from 'lucide-react';

const EXAMS = ['All Exams', 'SSC CGL', 'UPSC Prelims', 'RRB NTPC', 'IBPS PO', 'CUET', 'SBI PO'];

const PERIODS = ['This Week', 'This Month', 'All Time'];

const MOCK_DATA = [
  { rank: 1,  name: 'Aakash Singh',    initials: 'AS', score: 98, tests: 42, accuracy: '94%', badge: '🥇', exam: 'SSC CGL'      },
  { rank: 2,  name: 'Priya Kumari',    initials: 'PK', score: 96, tests: 38, accuracy: '92%', badge: '🥈', exam: 'UPSC Prelims' },
  { rank: 3,  name: 'Ravi Shankar',    initials: 'RS', score: 94, tests: 35, accuracy: '91%', badge: '🥉', exam: 'IBPS PO'      },
  { rank: 4,  name: 'Sunita Devi',     initials: 'SD', score: 91, tests: 31, accuracy: '89%', badge: null,  exam: 'RRB NTPC'    },
  { rank: 5,  name: 'Manoj Yadav',     initials: 'MY', score: 89, tests: 29, accuracy: '88%', badge: null,  exam: 'SSC CGL'     },
  { rank: 6,  name: 'Neha Gupta',      initials: 'NG', score: 87, tests: 27, accuracy: '86%', badge: null,  exam: 'CUET'        },
  { rank: 7,  name: 'Amit Kumar',      initials: 'AK', score: 85, tests: 25, accuracy: '85%', badge: null,  exam: 'UPSC Prelims'},
  { rank: 8,  name: 'Kavita Sharma',   initials: 'KS', score: 83, tests: 24, accuracy: '84%', badge: null,  exam: 'SBI PO'      },
  { rank: 9,  name: 'Deepak Tiwari',   initials: 'DT', score: 81, tests: 22, accuracy: '83%', badge: null,  exam: 'RRB NTPC'    },
  { rank: 10, name: 'Shalini Mishra',  initials: 'SM', score: 79, tests: 21, accuracy: '82%', badge: null,  exam: 'IBPS PO'     },
  { rank: 11, name: 'Rahul Verma',     initials: 'RV', score: 77, tests: 20, accuracy: '81%', badge: null,  exam: 'SSC CGL'     },
  { rank: 12, name: 'Pooja Patel',     initials: 'PP', score: 75, tests: 18, accuracy: '80%', badge: null,  exam: 'CUET'        },
  { rank: 13, name: 'Suresh Nair',     initials: 'SN', score: 73, tests: 17, accuracy: '79%', badge: null,  exam: 'UPSC Prelims'},
  { rank: 14, name: 'Anjali Rao',      initials: 'AR', score: 71, tests: 16, accuracy: '78%', badge: null,  exam: 'SBI PO'      },
  { rank: 15, name: 'Vikram Joshi',    initials: 'VJ', score: 69, tests: 15, accuracy: '77%', badge: null,  exam: 'RRB NTPC'    },
];

const rankStyle: Record<number, string> = {
  1: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  2: 'bg-gray-100 text-gray-700 border-gray-300',
  3: 'bg-orange-100 text-orange-700 border-orange-300',
};

export default function LeaderboardPage() {
  const [exam,   setExam]   = useState('All Exams');
  const [period, setPeriod] = useState('This Month');

  const filtered = exam === 'All Exams'
    ? MOCK_DATA
    : MOCK_DATA.filter(r => r.exam === exam);

  const top3 = filtered.slice(0, 3);
  const rest  = filtered.slice(3);

  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Trophy className="w-8 h-8 text-yellow-300" />
            <h1 className="text-3xl sm:text-4xl font-bold">Leaderboard</h1>
          </div>
          <p className="text-orange-100 text-base max-w-xl mx-auto">
            Top performers across GridAcademy&apos;s mock test platform. Keep practising to climb the ranks!
          </p>

          {/* Stats strip */}
          <div className="flex justify-center gap-6 mt-6 text-center">
            {[
              { icon: Users,      label: 'Active Students', val: '12,400+' },
              { icon: Star,       label: 'Tests Attempted',  val: '98,000+' },
              { icon: TrendingUp, label: 'Avg. Score Jump',  val: '+18%'   },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="bg-white/15 rounded-xl px-4 py-3">
                <p className="text-lg font-bold">{val}</p>
                <p className="text-orange-100 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 items-center">
          {/* Exam filter */}
          <div className="flex flex-wrap gap-2">
            {EXAMS.map(e => (
              <button key={e} onClick={() => setExam(e)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  exam === e
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                }`}>
                {e}
              </button>
            ))}
          </div>

          {/* Period filter */}
          <div className="ml-auto flex gap-2">
            {PERIODS.map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  period === p
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No results for this filter yet.</p>
          </div>
        ) : (
          <>
            {/* Top 3 podium */}
            {top3.length >= 3 && (
              <div className="grid grid-cols-3 gap-3 mb-8 items-end">
                {/* 2nd */}
                <div className="flex flex-col items-center bg-white rounded-2xl border border-gray-200 shadow-sm p-4 pb-5">
                  <span className="text-2xl mb-1">🥈</span>
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-sm mb-2">
                    {top3[1].initials}
                  </div>
                  <p className="font-semibold text-gray-900 text-sm text-center truncate w-full text-center">{top3[1].name}</p>
                  <p className="text-orange-500 font-bold text-lg">{top3[1].score}</p>
                  <p className="text-xs text-gray-400">{top3[1].exam}</p>
                  <div className="mt-2 w-full bg-gray-100 rounded-lg py-1 text-center text-xs text-gray-500">Rank #2</div>
                </div>

                {/* 1st — taller */}
                <div className="flex flex-col items-center bg-gradient-to-b from-yellow-50 to-orange-50 rounded-2xl border-2 border-orange-300 shadow-md p-4 pb-5 -mt-4">
                  <Crown className="w-6 h-6 text-yellow-500 mb-1" />
                  <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-base mb-2 shadow">
                    {top3[0].initials}
                  </div>
                  <p className="font-bold text-gray-900 text-sm text-center truncate w-full text-center">{top3[0].name}</p>
                  <p className="text-orange-500 font-bold text-xl">{top3[0].score}</p>
                  <p className="text-xs text-gray-500">{top3[0].exam}</p>
                  <div className="mt-2 w-full bg-orange-100 rounded-lg py-1 text-center text-xs text-orange-700 font-semibold">🏆 Rank #1</div>
                </div>

                {/* 3rd */}
                <div className="flex flex-col items-center bg-white rounded-2xl border border-gray-200 shadow-sm p-4 pb-5">
                  <span className="text-2xl mb-1">🥉</span>
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-sm mb-2">
                    {top3[2].initials}
                  </div>
                  <p className="font-semibold text-gray-900 text-sm text-center truncate w-full text-center">{top3[2].name}</p>
                  <p className="text-orange-500 font-bold text-lg">{top3[2].score}</p>
                  <p className="text-xs text-gray-400">{top3[2].exam}</p>
                  <div className="mt-2 w-full bg-gray-100 rounded-lg py-1 text-center text-xs text-gray-500">Rank #3</div>
                </div>
              </div>
            )}

            {/* Full table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="grid grid-cols-12 text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3 border-b border-gray-100 bg-gray-50">
                <div className="col-span-1">Rank</div>
                <div className="col-span-4">Student</div>
                <div className="col-span-3">Exam</div>
                <div className="col-span-2 text-center">Score</div>
                <div className="col-span-1 text-center hidden sm:block">Tests</div>
                <div className="col-span-1 text-center hidden sm:block">Accuracy</div>
              </div>

              {filtered.map((row, i) => (
                <div key={row.rank}
                  className={`grid grid-cols-12 items-center px-4 py-3 border-b border-gray-50 last:border-0 transition-colors hover:bg-orange-50/40 ${
                    i < 3 ? 'bg-orange-50/20' : ''
                  }`}>
                  {/* Rank */}
                  <div className="col-span-1">
                    <span className={`inline-flex w-7 h-7 items-center justify-center rounded-full text-xs font-bold border ${
                      rankStyle[row.rank] ?? 'bg-gray-50 text-gray-500 border-gray-200'
                    }`}>
                      {row.badge ?? row.rank}
                    </span>
                  </div>

                  {/* Name */}
                  <div className="col-span-4 flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      row.rank === 1 ? 'bg-orange-500 text-white' :
                      row.rank === 2 ? 'bg-gray-300 text-gray-700' :
                      row.rank === 3 ? 'bg-orange-200 text-orange-800' :
                                       'bg-gray-100 text-gray-600'
                    }`}>
                      {row.initials}
                    </div>
                    <span className="text-sm font-semibold text-gray-800 truncate">{row.name}</span>
                  </div>

                  {/* Exam */}
                  <div className="col-span-3">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full truncate">{row.exam}</span>
                  </div>

                  {/* Score */}
                  <div className="col-span-2 text-center">
                    <span className="text-sm font-bold text-orange-500">{row.score}%</span>
                  </div>

                  {/* Tests */}
                  <div className="col-span-1 text-center hidden sm:block">
                    <span className="text-sm text-gray-600">{row.tests}</span>
                  </div>

                  {/* Accuracy */}
                  <div className="col-span-1 text-center hidden sm:block">
                    <span className="text-sm text-green-600 font-medium">{row.accuracy}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-center text-white">
              <p className="font-bold text-lg mb-1">Want to see your name here?</p>
              <p className="text-orange-100 text-sm mb-4">Take more mock tests and improve your rank on the leaderboard.</p>
              <a href="/exams"
                className="inline-block bg-white text-orange-600 font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-orange-50 transition">
                Browse Mock Tests
              </a>
            </div>
          </>
        )}
      </div>
    </>
  );
}
