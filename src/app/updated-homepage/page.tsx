export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { api } from '@/lib/api-client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getAllPosts } from '@/lib/blog-posts';
import { ExamCard, ExamTypeFilter } from '@/types/exam';
import {
  ArrowRight, BarChart3, BookOpen, Brain, BriefcaseBusiness,
  CheckCircle2, ChevronDown, Clock3, Compass, FileCheck2,
  FileText, GraduationCap, Landmark, LineChart, Medal,
  MonitorSmartphone, PieChart, Play, ShieldCheck, Sparkles,
  Star, Target, Trophy, Users, Zap, Tag, Clock,
} from 'lucide-react';

// ── Data ──────────────────────────────────────────────────────────────────────
interface ExamLevel { id: number; name: string; examCount: number; }

async function getData() {
  try {
    const [exams, examTypes] = await Promise.all([
      api.get<ExamCard[]>('/api/exam-pages?activeOnly=true').catch(() => [] as ExamCard[]),
      api.get<ExamTypeFilter[]>('/api/exam-pages/exam-types').catch(() => [] as ExamTypeFilter[]),
    ]);
    return {
      exams:     Array.isArray(exams)     ? exams     : (exams as any)?.data     ?? [],
      examTypes: Array.isArray(examTypes) ? examTypes : (examTypes as any)?.data ?? [],
    };
  } catch {
    return { exams: [], examTypes: [] };
  }
}

function stripHtml(html: string | null): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

// ── Static content ─────────────────────────────────────────────────────────────
const HERO_BULLETS = [
  { id: 'syllabus',  label: 'Latest syllabus & real exam pattern' },
  { id: 'analytics', label: 'Instant analytics after every attempt' },
  { id: 'free',      label: 'Mostly free tests for major exams' },
];

const FEATURES = [
  { id: 'instant-results', title: 'Instant Results',   desc: 'Know your score, time usage and accuracy the moment you submit.',          icon: <Zap className="h-5 w-5" /> },
  { id: 'latest-pattern',  title: 'Latest Pattern',    desc: 'Practice papers are aligned with current syllabus and exam format.',       icon: <FileCheck2 className="h-5 w-5" /> },
  { id: 'leaderboard',     title: 'Leaderboard',       desc: 'Benchmark your preparation against aspirants across India.',               icon: <Trophy className="h-5 w-5" /> },
  { id: 'deep-analysis',   title: 'Deep Analysis',     desc: 'Spot weak areas with section-wise performance and attempt patterns.',      icon: <PieChart className="h-5 w-5" /> },
  { id: 'solutions',       title: 'Detailed Solutions',desc: 'Review concept-backed solutions instead of only checking answers.',        icon: <BookOpen className="h-5 w-5" /> },
  { id: 'mostly-free',     title: 'Mostly Free',       desc: 'Start serious preparation without a paywall blocking your first test.',    icon: <Sparkles className="h-5 w-5" /> },
  { id: 'major-exams',     title: 'All Major Exams',   desc: 'SSC, Railway, Banking, CUET, NEET, UPSC, Defence and State PSC.',         icon: <Target className="h-5 w-5" /> },
  { id: 'mobile-ready',    title: 'Mobile Ready',      desc: 'Attempt tests and review performance smoothly on any screen.',             icon: <MonitorSmartphone className="h-5 w-5" /> },
];

const HOW_IT_WORKS = [
  { id: 'signup',   title: 'Sign Up Free',         desc: 'Create your GridAcademy account in under a minute.' },
  { id: 'choose',   title: 'Choose Exam',           desc: 'Pick SSC, CUET, NEET, Railway or another target.' },
  { id: 'attempt',  title: 'Attempt Mock Test',     desc: 'Practice in a timed, exam-like interface.' },
  { id: 'analysis', title: 'View Instant Analysis', desc: 'See score, accuracy, rank and weak topics.' },
  { id: 'repeat',   title: 'Improve and Repeat',    desc: 'Review solutions and come back stronger.' },
];

const FAQS = [
  { id: 'free-tests',       question: 'Are GridAcademy mock tests free?',               answer: 'Most GridAcademy mock tests are free to start, including popular exam practice sets and previous year papers. Some provider-led premium batches may be added separately.' },
  { id: 'account',          question: 'Do I need an account to take a test?',           answer: 'Yes. A free account helps save your attempts, analysis, rank history and recommended next steps across devices.' },
  { id: 'pattern',          question: 'How accurate is the exam pattern?',              answer: 'Tests are created or curated around the latest syllabus, official notifications and previous year paper patterns so practice feels close to the real exam.' },
  { id: 'review',           question: 'Can I review my answers after finishing?',       answer: 'Yes. You can review correct and incorrect answers, detailed solutions, time spent and section-wise accuracy after submission.' },
  { id: 'available-exams',  question: 'Which exams are currently available?',           answer: 'GridAcademy currently focuses on SSC, Railway, CUET UG, NEET UG, UPSC, Banking, Defence, Teaching and State PSC categories, with new exams added regularly.' },
];

// exam-type → lucide icon
function categoryIcon(name: string | null) {
  const map: Record<string, React.ReactNode> = {
    SSC:       <FileText className="h-6 w-6" />,
    Railway:   <Zap className="h-6 w-6" />,
    Banking:   <Landmark className="h-6 w-6" />,
    UPSC:      <GraduationCap className="h-6 w-6" />,
    CUET:      <BookOpen className="h-6 w-6" />,
    NEET:      <Brain className="h-6 w-6" />,
    Defence:   <ShieldCheck className="h-6 w-6" />,
    Teaching:  <Users className="h-6 w-6" />,
    'State PSC': <BriefcaseBusiness className="h-6 w-6" />,
  };
  return map[name ?? ''] ?? <FileText className="h-6 w-6" />;
}

function categoryMeta(name: string | null, count: number): string {
  const map: Record<string, string> = {
    SSC: 'Free + PYP tests', Railway: 'Latest pattern', Banking: 'Coming batches',
    UPSC: 'Analysis ready', CUET: `${count} tests`, NEET: 'Live now',
    Defence: 'Free start', Teaching: 'Topic-wise', 'State PSC': 'New exams added',
  };
  return map[name ?? ''] ?? `${count} exams`;
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function UpdatedHomePage() {
  const { exams, examTypes } = await getData();
  const posts = getAllPosts().slice(0, 3);

  const totalTests = exams.reduce((s: number, e: ExamCard) => s + e.testCount, 0);
  const featured   = exams.filter((e: ExamCard) => e.isFeatured);
  const topTests   = [...featured, ...exams.filter((e: ExamCard) => !e.isFeatured)].slice(0, 5);

  const HERO_METRICS = [
    { id: 'exams',    value: `${examTypes.length}+`,  label: 'Major exams' },
    { id: 'tests',    value: `${totalTests}+`,          label: 'Mock tests' },
    { id: 'students', value: '10K+',                    label: 'Students' },
  ];

  const STATS = [
    { id: 'exams',    value: `${examTypes.length}+`, label: 'Exams covered',      icon: <BookOpen className="h-5 w-5" /> },
    { id: 'tests',    value: `${totalTests}+`,        label: 'Mock tests',         icon: <FileCheck2 className="h-5 w-5" /> },
    { id: 'students', value: '10K+',                   label: 'Students practicing',icon: <Users className="h-5 w-5" /> },
    { id: 'free',     value: 'Mostly',                 label: 'Free to begin',     icon: <Sparkles className="h-5 w-5" /> },
  ];

  const CAT_COLORS: Record<string, string> = {
    SSC: 'bg-blue-100 text-blue-700 border-blue-200',
    CUET: 'bg-violet-100 text-violet-700 border-violet-200',
    Railway: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    NEET: 'bg-rose-100 text-rose-700 border-rose-200',
    Banking: 'bg-amber-100 text-amber-700 border-amber-200',
    UPSC: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-sans text-slate-950">

      {/* ── Announcement bar ─────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-[#3B5BDB] via-[#4263EB] to-[#0D9488] text-white" aria-label="Announcement">
        <div className="mx-auto flex max-w-[1200px] items-center justify-center gap-3 px-5 py-3 text-center text-[12px] sm:text-sm">
          <Sparkles className="h-4 w-4 shrink-0" />
          <p>NEET UG 2026 Mock Test Series is live — practice free today.</p>
        </div>
      </section>

      {/* ── Existing header (logo preserved) ─────────────────────────────── */}
      <Header />

      <main>

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-b from-white via-slate-50 to-white">
          <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 py-16 lg:grid-cols-12 lg:py-24">

            {/* Left */}
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-bold text-[#3B5BDB] shadow-sm">
                <Medal className="h-4 w-4" />
                <span>Trusted by 10,000+ Students</span>
              </div>

              <h1 className="mt-7 max-w-3xl text-[40px] font-bold leading-[1.15] tracking-[-0.03em] text-slate-950 sm:text-5xl lg:text-6xl">
                India&apos;s{' '}
                <span className="bg-gradient-to-r from-[#3B5BDB] to-[#0D9488] bg-clip-text text-transparent">Smartest</span>{' '}
                Mock Test Platform
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">
                Free mock tests for SSC, Railway, Banking, CUET and UPSC aspirants with instant results,
                detailed solutions and performance analytics that show exactly where to improve.
              </p>

              <ul className="mt-8 grid gap-3 text-base font-semibold text-slate-700 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {HERO_BULLETS.map(b => (
                  <li key={b.id} className="flex items-start gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#0D9488]" />
                    <span>{b.label}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/exams"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3B5BDB] px-7 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-200 transition hover:-translate-y-1 hover:bg-[#2F49C7] active:scale-95">
                  Start Free Mock Test <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href="/exams"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-7 py-4 text-base font-semibold text-slate-800 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:bg-slate-50 active:scale-95">
                  Browse All Exams
                </Link>
              </div>

              {/* Metrics strip */}
              <div className="mt-10 grid max-w-xl grid-cols-3 divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                {HERO_METRICS.map(m => (
                  <div key={m.id} className="px-4 first:pl-0 last:pr-0">
                    <strong className="block text-2xl font-bold tracking-tight text-slate-950">{m.value}</strong>
                    <span className="mt-1 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — mock-test UI preview card */}
            <div className="lg:col-span-6">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200/80">
                <div className="grid gap-4 rounded-[1.5rem] bg-slate-950 p-4 text-white sm:grid-cols-3">

                  {/* Question card */}
                  <div className="rounded-2xl bg-white p-4 text-slate-950 shadow-lg sm:col-span-2">
                    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3B5BDB]">SSC CGL Aptitude</p>
                        <h2 className="mt-1 text-xl font-black tracking-tight">Mock Test Preview</h2>
                      </div>
                      <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-[#0D9488]">Free</span>
                    </div>

                    <div className="mt-5">
                      <div className="flex items-center justify-between text-sm font-bold text-slate-500">
                        <span>Question 12 of 25</span><span>00:42</span>
                      </div>
                      <p className="mt-4 text-base font-black leading-7 text-slate-950">
                        If a train covers 180 km in 2.5 hours, what is its average speed?
                      </p>
                      <div className="mt-5 grid gap-3">
                        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 text-sm font-bold text-slate-700">A. 68 km/h</div>
                        <div className="rounded-2xl border border-[#0D9488] bg-teal-50 p-3.5 text-sm font-black text-[#0F766E] shadow-sm">B. 72 km/h ✓</div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 text-sm font-bold text-slate-700">C. 75 km/h</div>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-teal-50 p-4">
                      <div className="flex items-start gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#3B5BDB] shadow-sm">
                          <Sparkles className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-sm font-black text-slate-950">Insight</p>
                          <p className="mt-1 text-sm leading-6 text-slate-600">Your speed is strong in time-distance questions. Review ratio shortcuts to improve the next set.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stat cards */}
                  <div className="grid gap-4">
                    <div className="rounded-2xl bg-[#3B5BDB] p-4 shadow-lg shadow-indigo-950/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-100">Rank</span>
                        <Trophy className="h-5 w-5 text-indigo-100" />
                      </div>
                      <strong className="mt-4 block text-3xl font-black">#248</strong>
                      <span className="mt-1 block text-sm text-indigo-100">All India</span>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-300">Accuracy</span>
                        <Target className="h-5 w-5 text-teal-300" />
                      </div>
                      <strong className="mt-4 block text-3xl font-black">86%</strong>
                      <div className="mt-3 h-2 rounded-full bg-white/10">
                        <div className="h-2 w-[86%] rounded-full bg-[#0D9488]" />
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white p-4 text-slate-950 shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Free Exams</span>
                        <Star className="h-5 w-5 fill-[#0D9488] text-[#0D9488]" />
                      </div>
                      <strong className="mt-4 block text-3xl font-black">{examTypes.length}</strong>
                      <span className="mt-1 block text-sm font-semibold text-slate-500">Live today</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats bar ────────────────────────────────────────────────────── */}
        <section className="border-y border-slate-200 bg-white" aria-label="Platform statistics">
          <div className="mx-auto grid max-w-[1200px] gap-4 px-5 py-8 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map(s => (
              <article key={s.id} className="flex items-center gap-4 rounded-2xl bg-slate-50 p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-slate-200/70">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#3B5BDB] shadow-sm">{s.icon}</span>
                <div>
                  <strong className="block text-3xl font-bold tracking-tight text-slate-950">{s.value}</strong>
                  <p className="text-sm font-semibold text-slate-500">{s.label}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Exam categories ──────────────────────────────────────────────── */}
        <section id="exams" className="bg-slate-50 py-20 lg:py-28">
          <div className="mx-auto max-w-[1200px] px-5">
            <div className="max-w-2xl">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#3B5BDB]">Popular exam categories</p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-slate-950 sm:text-5xl">
                Choose your exam path and start practicing today.
              </h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {examTypes.slice(0, 9).map((t: ExamTypeFilter, i: number) => (
                <Link key={t.id} href={`/?category=${encodeURIComponent(t.name)}`}>
                  <article className="group h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-2xl hover:shadow-slate-200/80">
                    <div className="flex items-start justify-between gap-4">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-[#3B5BDB] transition group-hover:bg-[#3B5BDB] group-hover:text-white">
                        {categoryIcon(t.name)}
                      </span>
                      <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-[#0D9488]">
                        {categoryMeta(t.name, t.examCount ?? 0)}
                      </span>
                    </div>
                    <h3 className="mt-6 text-2xl font-bold tracking-tight text-slate-950">{t.name}</h3>
                    <p className="mt-3 text-base leading-7 text-slate-600 min-h-[72px]">
                      {t.examCount ?? 0} exam{(t.examCount ?? 0) !== 1 ? 's' : ''} available for practice.
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 rounded-xl text-sm font-black text-[#3B5BDB] transition group-hover:gap-3">
                      Start Practicing <ArrowRight className="h-4 w-4" />
                    </span>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured mock tests ──────────────────────────────────────────── */}
        <section id="mock-tests" className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-[1200px] px-5">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0D9488]">Featured mock tests</p>
                <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-slate-950 sm:text-5xl">
                  High-intent practice sets students are attempting now.
                </h2>
              </div>
              <Link href="/exams"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-800 transition hover:-translate-y-1 hover:bg-slate-50 active:scale-95">
                View all exams <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-5">
              {topTests.map(exam => (
                <Link key={exam.id} href={`/exam/${exam.slug}`}>
                  <article className="flex h-full min-h-[300px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-2xl hover:shadow-slate-200/80">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-[#3B5BDB]">{exam.category ?? exam.examTypeName ?? 'Exam'}</span>
                      <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-[#0D9488]">{exam.priceInr === 0 ? 'FREE' : `₹${exam.priceInr}`}</span>
                    </div>
                    <h3 className="mt-6 text-xl font-bold leading-7 tracking-tight text-slate-950 flex-1">{exam.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{exam.conductingBody ?? exam.examTypeName}</p>
                    <dl className="mt-6 grid gap-3 text-sm">
                      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                        <dt className="font-semibold text-slate-500">Tests</dt>
                        <dd className="font-black text-slate-950">{exam.testCount}</dd>
                      </div>
                      {exam.examLevelName && (
                        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                          <dt className="font-semibold text-slate-500">Level</dt>
                          <dd className="font-black text-slate-950">{exam.examLevelName}</dd>
                        </div>
                      )}
                    </dl>
                    <span className="mt-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3B5BDB] px-5 py-3 text-sm font-black text-white shadow-lg shadow-indigo-100 transition hover:bg-[#2F49C7] mt-4">
                      Start Test <Play className="h-4 w-4 fill-current" />
                    </span>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why GridAcademy ──────────────────────────────────────────────── */}
        <section className="bg-slate-50 py-20 lg:py-28">
          <div className="mx-auto max-w-[1200px] px-5">
            <div className="max-w-2xl">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#3B5BDB]">Why GridAcademy</p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-slate-950 sm:text-5xl">
                Everything serious aspirants need after every mock.
              </h2>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map(f => (
                <article key={f.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/80">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-[#3B5BDB]">{f.icon}</span>
                  <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-950">{f.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{f.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Analytics section ─────────────────────────────────────────────── */}
        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0D9488]">Performance analytics</p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-slate-950 sm:text-5xl">
                Turn every attempt into a sharper next attempt.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                GridAcademy analysis highlights your score trend, weak sections, time leakage and rank movement
                so preparation becomes measurable, not guesswork.
              </p>
              <Link href="/dashboard"
                className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 text-base font-black text-white transition hover:-translate-y-1 hover:bg-slate-800 active:scale-95">
                See your analysis <LineChart className="h-5 w-5" />
              </Link>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 shadow-2xl shadow-slate-200/80">
                <div className="rounded-[1.5rem] bg-white p-6">
                  <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.16em] text-[#3B5BDB]">SSC CGL Performance</p>
                      <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">Attempt Dashboard</h3>
                    </div>
                    <div className="rounded-2xl bg-teal-50 px-5 py-3 text-right">
                      <span className="block text-xs font-black uppercase tracking-[0.16em] text-[#0D9488]">Rank</span>
                      <strong className="text-2xl font-black text-slate-950">#248</strong>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-5 lg:grid-cols-2">
                    <div className="space-y-5">
                      {[['Quantitative Aptitude', 86, 'bg-[#3B5BDB]'], ['Reasoning', 78, 'bg-[#0D9488]'], ['General Awareness', 62, 'bg-slate-950']].map(([label, pct, color]) => (
                        <div key={label as string}>
                          <div className="mb-2 flex items-center justify-between text-sm font-bold">
                            <span>{label}</span><span>{pct}%</span>
                          </div>
                          <div className="h-3 rounded-full bg-slate-100">
                            <div className={`h-3 rounded-full ${color}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-teal-50 p-5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#3B5BDB] shadow-sm">
                          <BarChart3 className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Insight</p>
                          <strong className="text-base text-slate-950">Improve GA next</strong>
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-slate-700">
                        You gained 11% accuracy in Quant. Spend the next two sessions on General Awareness to move into the top 150.
                      </p>
                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-white p-4">
                          <span className="block text-xs font-bold text-slate-500">Score</span>
                          <strong className="mt-1 block text-2xl font-black text-slate-950">158</strong>
                        </div>
                        <div className="rounded-2xl bg-white p-4">
                          <span className="block text-xs font-bold text-slate-500">Accuracy</span>
                          <strong className="mt-1 block text-2xl font-black text-slate-950">82%</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Career guide ─────────────────────────────────────────────────── */}
        <section id="career-guide" className="bg-slate-950 py-20 text-white lg:py-28">
          <div className="mx-auto grid max-w-[1200px] gap-10 px-5 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-teal-300">Free Career Guide</p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
                Not sure which career to choose? Explore 100 options.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                Discover paths across personality types like Makers, Thinkers, Builders and Helpers.
                Most options cost ₹0 to start exploring.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/career-guide/quiz"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-base font-black text-slate-950 transition hover:-translate-y-1 hover:bg-slate-100 active:scale-95">
                  Take the Quiz <CheckCircle2 className="h-5 w-5 text-[#0D9488]" />
                </Link>
                <Link href="/career-guide"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/20 px-6 py-4 text-base font-black text-white transition hover:-translate-y-1 hover:bg-white/10 active:scale-95">
                  Browse 100 Careers
                </Link>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
              <article className="rounded-2xl bg-white p-6 text-slate-950 shadow-xl shadow-black/20">
                <Compass className="h-8 w-8 text-[#3B5BDB]" />
                <h3 className="mt-5 text-2xl font-bold">Thinkers</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Analytical careers for students who enjoy systems, logic and structured problem solving.</p>
              </article>
              <article className="rounded-2xl bg-white/10 p-6 text-white ring-1 ring-white/10">
                <Target className="h-8 w-8 text-teal-300" />
                <h3 className="mt-5 text-2xl font-bold">Builders</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">Action-oriented paths for students who like creating, operating and improving things.</p>
              </article>
              <article className="rounded-2xl bg-white/10 p-6 text-white ring-1 ring-white/10 sm:col-span-2">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">100 career cards</h3>
                    <p className="mt-2 max-w-lg text-sm leading-6 text-slate-300">Match interests, exam preparation and realistic starting steps before choosing a direction.</p>
                  </div>
                  <span className="rounded-full bg-teal-300 px-5 py-2 text-sm font-black text-slate-950 shrink-0">₹0 to explore</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────────────── */}
        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-[1200px] px-5">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#3B5BDB]">How it works</p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-slate-950 sm:text-5xl">A simple five-step preparation loop.</h2>
            </div>
            <div className="mt-12 grid gap-4 lg:grid-cols-5">
              {HOW_IT_WORKS.map((step, i) => (
                <article key={step.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-slate-200/80">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#3B5BDB] text-sm font-black text-white">{i + 1}</span>
                  <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-950">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{step.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Blog posts ───────────────────────────────────────────────────── */}
        {posts.length > 0 && (
          <section id="blog" className="bg-slate-50 py-20 lg:py-28">
            <div className="mx-auto max-w-[1200px] px-5">
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0D9488]">Latest from the blog</p>
                  <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-slate-950 sm:text-5xl">Exam strategy without the noise.</h2>
                </div>
                <Link href="/blog"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-1 hover:shadow-xl active:scale-95">
                  View all posts <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-10 grid gap-5 lg:grid-cols-3">
                {posts.map(post => {
                  const catCls = CAT_COLORS[post.category] ?? 'bg-indigo-50 border-indigo-200 text-[#3B5BDB]';
                  const date = new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                  return (
                    <Link key={post.slug} href={`/blog/${post.slug}`}>
                      <article className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/80">
                        <div className="flex items-center justify-between gap-4">
                          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black border ${catCls}`}>
                            <Tag className="w-2.5 h-2.5" />{post.category}
                          </span>
                          <span className="text-xs font-bold text-slate-500">{date}</span>
                        </div>
                        <h3 className="mt-6 text-xl font-bold leading-7 tracking-tight text-slate-950">{post.title}</h3>
                        <p className="mt-4 text-base leading-7 text-slate-600 line-clamp-3">{post.excerpt}</p>
                        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                          <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-500">
                            <Clock className="h-4 w-4" />{post.readingTimeMinutes} min read
                          </span>
                          <span className="text-sm font-black text-[#3B5BDB]">Read</span>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-[900px] px-5">
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#3B5BDB]">FAQ</p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-slate-950 sm:text-5xl">
                Questions aspirants ask before starting.
              </h2>
            </div>
            <div className="mt-10 space-y-3">
              {FAQS.map(faq => (
                <details key={faq.id} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-xl hover:shadow-slate-200/80">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-lg font-semibold text-slate-950 focus:outline-none">
                    <span>{faq.question}</span>
                    <ChevronDown className="h-5 w-5 shrink-0 text-slate-500 transition group-open:rotate-180" />
                  </summary>
                  <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section className="bg-white px-5 pb-20 lg:pb-28">
          <div className="mx-auto max-w-[1200px] overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#3B5BDB] to-[#0D9488] p-8 text-white shadow-2xl shadow-indigo-200 lg:p-14">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-white/75">Ready to crack your exam?</p>
                <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
                  Start with a free mock test and know where you stand today.
                </h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col xl:flex-row">
                <Link href="/exams"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-base font-black text-[#3B5BDB] transition hover:-translate-y-1 hover:bg-slate-100 active:scale-95">
                  Start Free Mock Test <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href="/register"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/30 px-6 py-4 text-base font-black text-white transition hover:-translate-y-1 hover:bg-white/10 active:scale-95">
                  Register Free
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── Existing footer ────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
