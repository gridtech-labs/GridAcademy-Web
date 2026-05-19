'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { QuizQuestion, CategorySlug } from '@/types/career';
import { CAREER_CATEGORIES } from '@/data/careers';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

type QuizState = 'loading' | 'error' | 'intro' | 'question' | 'result';

const CATEGORY_DESCRIPTIONS: Record<CategorySlug, string> = {
  makers:
    'You come alive when you\'re building something real. Whether it\'s furniture, food, fashion, or art — you think with your hands and find deep satisfaction in seeing a finished, tangible creation. The world needs more people like you who turn raw materials into things of beauty and function.',
  connectors:
    'People are your medium. You have a rare ability to read rooms, build trust, and make others feel genuinely seen — and that skill is worth more than any technical degree. Careers that put you at the centre of human interactions will energise rather than drain you.',
  explorers:
    'Walls make you restless. You\'re wired for movement, curiosity, and the kind of learning that only happens under open sky or in unfamiliar terrain. The best version of your career happens outdoors, in the field, or on the road.',
  'screen-workers':
    'Your natural habitat is a screen, and your superpower is creating things that didn\'t exist before — code, videos, designs, data stories. The digital economy rewards exactly the kind of focused, iterative creativity that you bring to every project.',
  thinkers:
    'You can\'t help asking why. Puzzles, patterns, research, and the satisfaction of a correct answer drive you more than most things. Your career sweet spot is anywhere that complex problems need a sharp, systematic mind to untangle them.',
  performers:
    'You come alive in front of an audience. Whether it\'s a camera, a stage, a mic, or a crowd — you have a natural magnetism that draws people in. Your career will thrive wherever expression, entertainment, and storytelling intersect.',
  healers:
    'Other people\'s pain moves you to action. You have deep reserves of empathy, patience, and the drive to genuinely make someone\'s life better — skills that are chronically undervalued but desperately needed. Your career will be measured not in rupees but in lives improved.',
  builders:
    'You see problems as untapped business opportunities. You think in systems, spot gaps in markets, and feel the pull of building something from zero. Entrepreneurship, in whatever form it takes, is not just a career option for you — it\'s almost inevitable.',
};

// Fallback questions used when the API is unreachable
const FALLBACK_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    questionText: 'It\'s a free Saturday afternoon. What sounds most appealing?',
    sortOrder: 1,
    isActive: true,
    options: [
      { id: 1, optionText: 'Build or fix something with my hands', careerCategory: 'makers', sortOrder: 1 },
      { id: 2, optionText: 'Catch up with friends and plan a gathering', careerCategory: 'connectors', sortOrder: 2 },
      { id: 3, optionText: 'Head outdoors — a hike, a park, anywhere open', careerCategory: 'explorers', sortOrder: 3 },
      { id: 4, optionText: 'Work on a personal digital project', careerCategory: 'screen-workers', sortOrder: 4 },
    ],
  },
  {
    id: 2,
    questionText: 'A friend asks for your advice. You\'re most comfortable when:',
    sortOrder: 2,
    isActive: true,
    options: [
      { id: 5, optionText: 'Helping them think through a complex problem step by step', careerCategory: 'thinkers', sortOrder: 1 },
      { id: 6, optionText: 'Listening deeply and making them feel understood', careerCategory: 'healers', sortOrder: 2 },
      { id: 7, optionText: 'Energising them with stories and humor', careerCategory: 'performers', sortOrder: 3 },
      { id: 8, optionText: 'Suggesting a business idea or concrete action plan', careerCategory: 'builders', sortOrder: 4 },
    ],
  },
  {
    id: 3,
    questionText: 'Which of these achievements would make you proudest?',
    sortOrder: 3,
    isActive: true,
    options: [
      { id: 9, optionText: 'A handmade object someone displays in their home', careerCategory: 'makers', sortOrder: 1 },
      { id: 10, optionText: 'An event you organised that people still talk about', careerCategory: 'connectors', sortOrder: 2 },
      { id: 11, optionText: 'A photo from a place most people never reach', careerCategory: 'explorers', sortOrder: 3 },
      { id: 12, optionText: 'An app or website used by thousands of people', careerCategory: 'screen-workers', sortOrder: 4 },
    ],
  },
  {
    id: 4,
    questionText: 'Which environment makes you most productive?',
    sortOrder: 4,
    isActive: true,
    options: [
      { id: 13, optionText: 'A quiet space with a hard problem to crack', careerCategory: 'thinkers', sortOrder: 1 },
      { id: 14, optionText: 'Surrounded by people I\'m genuinely helping', careerCategory: 'healers', sortOrder: 2 },
      { id: 15, optionText: 'On a stage, in front of a camera, or at a mic', careerCategory: 'performers', sortOrder: 3 },
      { id: 16, optionText: 'Building something from scratch with full autonomy', careerCategory: 'builders', sortOrder: 4 },
    ],
  },
  {
    id: 5,
    questionText: 'When you imagine your ideal workday 5 years from now, it looks like:',
    sortOrder: 5,
    isActive: true,
    options: [
      { id: 17, optionText: 'Creating a beautiful object or dish in my own studio', careerCategory: 'makers', sortOrder: 1 },
      { id: 18, optionText: 'Facilitating a meeting that changes someone\'s direction', careerCategory: 'connectors', sortOrder: 2 },
      { id: 19, optionText: 'Working from a forest, beach, or mountain location', careerCategory: 'explorers', sortOrder: 3 },
      { id: 20, optionText: 'Shipping a feature or publishing a video that reaches thousands', careerCategory: 'screen-workers', sortOrder: 4 },
    ],
  },
];

export default function CareerQuiz() {
  const [quizState, setQuizState] = useState<QuizState>('loading');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, CategorySlug>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [winner, setWinner] = useState<CategorySlug | null>(null);

  const fetchQuiz = useCallback(async () => {
    setQuizState('loading');
    try {
      const res = await fetch(`${API_BASE}/api/career-guide/quiz`);
      if (!res.ok) throw new Error('API error');
      const data: QuizQuestion[] = await res.json();
      const active = data
        .filter((q) => q.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      setQuestions(active.length > 0 ? active : FALLBACK_QUESTIONS);
      setQuizState('intro');
    } catch {
      // Use fallback questions instead of hard error
      setQuestions(FALLBACK_QUESTIONS);
      setQuizState('intro');
    }
  }, []);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  const handleStartQuiz = () => {
    setCurrentIndex(0);
    setAnswers({});
    setSelectedOption(null);
    setWinner(null);
    setQuizState('question');
  };

  const handleOptionSelect = (optionId: number, category: CategorySlug) => {
    if (selectedOption !== null) return; // already answered
    setSelectedOption(optionId);

    const currentQuestion = questions[currentIndex];
    const newAnswers = { ...answers, [currentQuestion.id]: category };

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setAnswers(newAnswers);
        setCurrentIndex((i) => i + 1);
        setSelectedOption(null);
      } else {
        // Calculate winner
        const tally: Partial<Record<CategorySlug, number>> = {};
        Object.values(newAnswers).forEach((cat) => {
          tally[cat] = (tally[cat] ?? 0) + 1;
        });
        let topCat: CategorySlug = 'makers';
        let topCount = 0;
        (Object.entries(tally) as [CategorySlug, number][]).forEach(([cat, count]) => {
          if (count > topCount) {
            topCount = count;
            topCat = cat;
          }
        });
        setAnswers(newAnswers);
        setWinner(topCat);
        setQuizState('result');
      }
    }, 400);
  };

  const handleRetake = () => {
    setCurrentIndex(0);
    setAnswers({});
    setSelectedOption(null);
    setWinner(null);
    setQuizState('intro');
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (quizState === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        <p className="text-sm text-gray-500">Loading your quiz…</p>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (quizState === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <span className="text-5xl">⚠️</span>
        <p className="text-lg font-semibold text-gray-800">Couldn't load the quiz</p>
        <p className="text-sm text-gray-500">Please check your connection and try again.</p>
        <button
          onClick={fetchQuiz}
          className="mt-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Intro ────────────────────────────────────────────────────────────────────
  if (quizState === 'intro') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center gap-6">
        <div className="text-6xl">🧭</div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-extrabold text-gray-900">Find Your Career Type</h1>
          <p className="text-gray-500 max-w-sm">
            Answer {questions.length} quick questions and discover which of the 8 career
            personality types fits you best. Takes about 2 minutes.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {CAREER_CATEGORIES.map((cat) => (
            <span
              key={cat.slug}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${cat.color} ${cat.text}`}
            >
              {cat.icon} {cat.label}
            </span>
          ))}
        </div>
        <button
          onClick={handleStartQuiz}
          className="rounded-xl bg-indigo-600 px-8 py-3 text-base font-bold text-white hover:bg-indigo-700 transition-colors shadow-md"
        >
          Start Quiz →
        </button>
      </div>
    );
  }

  // ── Question ─────────────────────────────────────────────────────────────────
  if (quizState === 'question') {
    const question = questions[currentIndex];
    const progress = ((currentIndex) / questions.length) * 100;
    const optionLabels = ['A', 'B', 'C', 'D'];

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-6">
        {/* Progress */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs text-gray-500 font-medium">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% done</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question text */}
        <h2 className="text-xl font-bold text-gray-900 leading-snug">
          {question.questionText}
        </h2>

        {/* Options */}
        <div className="flex flex-col gap-3">
          {question.options
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((option, idx) => {
              const isSelected = selectedOption === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id, option.careerCategory)}
                  disabled={selectedOption !== null}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all duration-150 ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-800 shadow-sm'
                      : selectedOption !== null
                      ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/50'
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {optionLabels[idx]}
                  </span>
                  {option.optionText}
                </button>
              );
            })}
        </div>
      </div>
    );
  }

  // ── Result ───────────────────────────────────────────────────────────────────
  if (quizState === 'result' && winner) {
    const winnerCategory = CAREER_CATEGORIES.find((c) => c.slug === winner)!;
    const description = CATEGORY_DESCRIPTIONS[winner];

    return (
      <div className="flex flex-col gap-6">
        <div
          className={`rounded-2xl border ${winnerCategory.border} ${winnerCategory.color} p-8 flex flex-col items-center text-center gap-4`}
        >
          <div className="text-7xl">{winnerCategory.icon}</div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Your career type is
            </p>
            <h2 className={`text-3xl font-extrabold ${winnerCategory.text}`}>
              You&apos;re a {winnerCategory.label}!
            </h2>
            <p className={`text-base font-medium ${winnerCategory.text} opacity-80`}>
              {winnerCategory.tagline}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-3">What this means for you</h3>
          <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/career-guide?category=${winner}`}
            className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl ${winnerCategory.accent} text-white font-bold px-6 py-3 hover:opacity-90 transition-opacity shadow-sm`}
          >
            Explore {winnerCategory.label} Careers →
          </Link>
          <button
            onClick={handleRetake}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold px-6 py-3 hover:bg-gray-50 transition-colors"
          >
            Retake Quiz
          </button>
        </div>

        <div className="text-center">
          <Link
            href="/career-guide"
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            ← Browse all 100 careers
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
