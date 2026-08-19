import { useState } from 'react';
import { Menu } from 'lucide-react';
const trustStats = [{
  id: 'exams',
  value: '9+',
  label: 'Exams'
}, {
  id: 'tests',
  value: '32+',
  label: 'Tests'
}, {
  id: 'students',
  value: '10K',
  label: 'Students'
}, {
  id: 'free',
  value: 'Mostly',
  label: 'Free'
}];
const heroBullets = [{
  id: 'pattern',
  text: 'Real exam pattern and latest syllabus'
}, {
  id: 'analysis',
  text: 'Instant results with section-wise analysis'
}, {
  id: 'free-tests',
  text: '32 plus mock tests mostly free'
}];
const stats = [{
  id: 'stat-exams',
  value: '9+',
  label: 'Exams'
}, {
  id: 'stat-mocks',
  value: '32+',
  label: 'Mock Tests'
}, {
  id: 'stat-students',
  value: '10K',
  label: 'Students'
}, {
  id: 'stat-free',
  value: '100%',
  label: 'Free'
}];
const examCategories = [{
  id: 'ssc',
  icon: '🎓',
  name: 'SSC',
  desc: 'CGL, CHSL, MTS and GD',
  badge: '12 Tests Free'
}, {
  id: 'railway',
  icon: '🚆',
  name: 'Railway',
  desc: 'RRB ALP, NTPC, Group D',
  badge: '6 Tests Free'
}, {
  id: 'banking',
  icon: '🏦',
  name: 'Banking',
  desc: 'IBPS PO, SBI PO',
  badge: '4 Tests Free'
}, {
  id: 'upsc',
  icon: '🏛️',
  name: 'UPSC',
  desc: 'Prelims and CSAT',
  badge: '3 Tests Free'
}, {
  id: 'cuet',
  icon: '📜',
  name: 'CUET UG',
  desc: 'NTA entrance practice',
  badge: '11 Tests Free'
}, {
  id: 'neet',
  icon: '🔬',
  name: 'NEET UG',
  desc: 'NTA medical entrance',
  badge: '1 Test Free'
}, {
  id: 'defence',
  icon: '🛡️',
  name: 'Defence',
  desc: 'RPF Constable',
  badge: '2 Tests Free'
}];
const featuredTests = [{
  id: 'neet-series',
  category: 'NEET',
  pillClass: 'bg-orange-100 text-orange-700',
  name: 'NEET UG Mock Test Series',
  organiser: 'NTA',
  questions: '1 Test',
  duration: '180 min',
  level: 'All India Level'
}, {
  id: 'rrb-alp',
  category: 'Railway',
  pillClass: 'bg-green-100 text-green-700',
  name: 'RRB ALP Mock Series',
  organiser: 'RRB',
  questions: '1 Test',
  duration: '60 min',
  level: 'All India Level'
}, {
  id: 'ssc-chsl',
  category: 'SSC',
  pillClass: 'bg-indigo-100 text-indigo-700',
  name: 'SSC CHSL Tier 1 PYP',
  organiser: 'SSC',
  questions: '1 Test',
  duration: '60 min',
  level: 'All India Level'
}, {
  id: 'cuet-2026',
  category: 'CUET',
  pillClass: 'bg-indigo-100 text-indigo-700',
  name: 'CUET Mock Test 2026',
  organiser: 'NTA',
  questions: '11 Tests',
  duration: '45 min',
  level: 'All India Level'
}];
const features = [{
  id: 'instant',
  icon: '⚡',
  title: 'Instant Results',
  desc: 'Know your score the moment you submit.'
}, {
  id: 'pattern',
  icon: '🎯',
  title: 'Latest Pattern',
  desc: 'Practice papers aligned with current syllabi.'
}, {
  id: 'leaderboard',
  icon: '🏆',
  title: 'Leaderboard',
  desc: 'Compare your rank with serious aspirants.'
}, {
  id: 'analysis',
  icon: '📊',
  title: 'Deep Analysis',
  desc: 'See section-wise strengths and gaps.'
}, {
  id: 'solutions',
  icon: '📄',
  title: 'Detailed Solutions',
  desc: 'Review answer keys with clear explanations.'
}, {
  id: 'free',
  icon: '🔓',
  title: 'Mostly Free',
  desc: 'Start preparation without payment friction.'
}, {
  id: 'exams',
  icon: '🏢',
  title: 'All Major Exams',
  desc: 'SSC, Banking, Railway, UPSC and more.'
}, {
  id: 'mobile',
  icon: '📱',
  title: 'Mobile Ready',
  desc: 'Attempt tests comfortably on any phone.'
}];
const performanceRows = [{
  id: 'quant',
  subject: 'Quantitative',
  percent: '72%',
  width: 'w-[72%]',
  color: 'bg-indigo-500'
}, {
  id: 'english',
  subject: 'English',
  percent: '88%',
  width: 'w-[88%]',
  color: 'bg-green-500'
}, {
  id: 'reasoning',
  subject: 'Reasoning',
  percent: '65%',
  width: 'w-[65%]',
  color: 'bg-amber-500'
}];
const steps = [{
  id: 'signup',
  number: '1',
  icon: '✏️',
  title: 'Sign Up Free',
  desc: 'Register in under a minute.'
}, {
  id: 'choose',
  number: '2',
  icon: '🔍',
  title: 'Choose Your Exam',
  desc: 'SSC, Railway, Banking, UPSC and more.'
}, {
  id: 'attempt',
  number: '3',
  icon: '🚀',
  title: 'Attempt Mock Test',
  desc: 'Practice with the real exam pattern.'
}, {
  id: 'analysis',
  number: '4',
  icon: '📊',
  title: 'View Instant Analysis',
  desc: 'Get section-wise results and rank.'
}, {
  id: 'improve',
  number: '5',
  icon: '📈',
  title: 'Improve and Repeat',
  desc: 'Target weak areas with focused practice.'
}];
const blogPosts = [{
  id: 'neet-cutoff',
  category: 'NEET',
  date: 'Jul 15',
  title: 'NEET 2026 Expected Cutoff',
  excerpt: 'Understand score bands, category trends and how to plan your final revision.',
  time: '5 min read',
  stripClass: 'bg-orange-400',
  badgeClass: 'bg-orange-100 text-orange-700'
}, {
  id: 'ssc-plan',
  category: 'SSC',
  date: 'Jul 12',
  title: 'SSC CGL Tier 1 90-Day Plan',
  excerpt: 'A crisp day-by-day preparation rhythm for quant, reasoning, English and GK.',
  time: '4 min read',
  stripClass: 'bg-indigo-500',
  badgeClass: 'bg-indigo-100 text-indigo-700'
}, {
  id: 'rpf-guide',
  category: 'Railway',
  date: 'Jul 8',
  title: 'RPF Recruitment 2026 Complete Guide',
  excerpt: 'Eligibility, exam stages, marks distribution and a practical mock-test strategy.',
  time: '6 min read',
  stripClass: 'bg-green-500',
  badgeClass: 'bg-green-100 text-green-700'
}];
const faqs = [{
  id: 'free-tests',
  question: 'Are tests free?',
  answer: 'Most GridAcademy mock tests are free. A few premium tests start at Rs 7 for deeper practice packs.'
}, {
  id: 'account',
  question: 'Do you need an account to save results?',
  answer: 'Yes. Free signup takes under 1 minute and lets you save scores, ranks and past attempts.'
}, {
  id: 'pattern-accuracy',
  question: 'How accurate is the pattern?',
  answer: 'Tests are updated to match official syllabi from SSC, IBPS, RRB and NTA wherever applicable.'
}, {
  id: 'answers',
  question: 'Can you review answers?',
  answer: 'Yes. Every attempt includes instant results with the full answer key and clear explanations.'
}, {
  id: 'exams-covered',
  question: 'Which exams are covered?',
  answer: 'GridAcademy covers SSC, Banking, Railway, UPSC, CUET, NEET, Defence and more exam categories.'
}];
const footerExamLinks = [{
  id: 'ssc-cgl',
  label: 'SSC CGL'
}, {
  id: 'ibps-po',
  label: 'IBPS PO'
}, {
  id: 'rrb-ntpc',
  label: 'RRB NTPC'
}, {
  id: 'upsc-prelims',
  label: 'UPSC Prelims'
}, {
  id: 'neet-ug',
  label: 'NEET UG'
}, {
  id: 'cuet-2026',
  label: 'CUET 2026'
}];
const footerPlatformLinks = [{
  id: 'about',
  label: 'About Us'
}, {
  id: 'blog',
  label: 'Blog'
}, {
  id: 'career',
  label: 'Career Guide'
}, {
  id: 'provider',
  label: 'Become Provider'
}, {
  id: 'contact',
  label: 'Contact'
}];
const footerLegalLinks = [{
  id: 'privacy',
  label: 'Privacy Policy'
}, {
  id: 'terms',
  label: 'Terms of Service'
}, {
  id: 'refund',
  label: 'Refund Policy'
}];
export function GridAcademyHome() {
  const [openFaq, setOpenFaq] = useState('free-tests');
  return <main className="min-h-screen overflow-x-hidden bg-white font-sans text-slate-600 antialiased">
      <section aria-label="Announcement" className="flex h-9 w-full items-center justify-center bg-gradient-to-r from-indigo-600 to-teal-600 px-5 text-center text-xs font-medium text-white">
        <p>
          <span>NEET UG 2026 Mock Test is Live, try free now.</span>
        </p>
      </section>

      <nav className="sticky top-0 z-50 h-14 border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm">
        <div className="mx-auto flex h-full max-w-[402px] items-center justify-between gap-3">
          <button type="button" aria-label="Open menu" className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-slate-700 transition-all duration-200 active:scale-95">
            <Menu className="h-6 w-6" strokeWidth={2.25} aria-hidden="true" />
          </button>
          <a href="#top" aria-label="GridAcademy home" className="flex min-h-11 items-center gap-2 rounded-xl px-1 text-slate-900 transition-all duration-200 active:scale-95">
            <span aria-hidden="true" className="grid h-8 w-8 grid-cols-2 gap-1 rounded-lg bg-indigo-600 p-1.5">
              <span className="rounded-[3px] bg-white" />
              <span className="rounded-[3px] bg-white/75" />
              <span className="rounded-[3px] bg-white/75" />
              <span className="rounded-[3px] bg-white" />
            </span>
            <span className="text-[17px] font-bold tracking-[-0.03em] text-slate-900">GridAcademy</span>
          </a>
          <button type="button" className="min-h-11 rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 active:scale-95">
            <span>Sign Up</span>
          </button>
        </div>
      </nav>

      <section id="top" className="bg-[radial-gradient(circle_at_50%_0%,#EEF2FF_0%,#F8FAFC_58%,#F8FAFC_100%)] px-5 pb-10 pt-8">
        <div className="mx-auto max-w-[402px]">
          <p className="inline-flex rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-medium text-indigo-600">
            <span>Trusted by 10,000 plus Students</span>
          </p>
          <h1 className="mt-3 max-w-[360px] text-3xl font-extrabold leading-tight tracking-[-0.045em] text-slate-900">
            <span>India </span>
            <span className="bg-gradient-to-r from-indigo-600 to-teal-600 bg-clip-text text-transparent">Smartest</span>
            <span> Mock Test Platform.</span>
          </h1>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-600">
            <span>Free mock tests for SSC Railway Banking CUET and UPSC with instant results and deep analytics.</span>
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {heroBullets.map(bullet => <li key={bullet.id} className="flex items-center gap-2">
                <svg className="h-4 w-4 flex-shrink-0 text-teal-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.31a1 1 0 0 1-1.423-.006L3.29 9.21a1 1 0 1 1 1.42-1.408l4.038 4.08 6.542-6.596a1 1 0 0 1 1.414.006Z" clipRule="evenodd" />
                </svg>
                <span>{bullet.text}</span>
              </li>)}
          </ul>
          <div className="mt-6 flex flex-col gap-3">
            <button type="button" className="min-h-11 w-full rounded-xl bg-indigo-600 py-4 text-base font-semibold text-white shadow-sm transition-all duration-200 active:scale-95">
              <span>Start Free Mock Test</span>
            </button>
            <button type="button" className="min-h-11 w-full rounded-xl border border-slate-300 py-3.5 text-sm font-medium text-slate-600 transition-all duration-200 active:scale-95">
              <span>Browse All Exams</span>
            </button>
          </div>
          <section aria-label="GridAcademy trust metrics" className="mt-6 grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            {trustStats.map(stat => <div key={stat.id} className="text-center">
                <p className="text-lg font-bold leading-none text-indigo-600">
                  <span>{stat.value}</span>
                </p>
                <p className="mt-0.5 text-xs uppercase tracking-wide text-slate-400">
                  <span>{stat.label}</span>
                </p>
              </div>)}
          </section>
        </div>
      </section>

      <section aria-label="Sample mock question" className="mx-auto mb-8 max-w-[402px] px-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
          <header className="mb-3 flex items-center justify-between gap-3">
            <p className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700">
              <span>SSC CGL Aptitude</span>
            </p>
            <p className="text-xs text-slate-400">
              <span>01:28 left</span>
            </p>
          </header>
          <h2 className="text-sm font-medium leading-snug text-slate-900">
            <span>A train travels 360 km in 4 hours. What is the speed in meters per second?</span>
          </h2>
          <div className="mt-3 space-y-2" role="list" aria-label="Answer options">
            <button type="button" className="flex min-h-11 w-full items-center rounded-lg border border-teal-400 bg-teal-50 p-3 text-left text-sm font-medium text-teal-800 transition-all duration-200 active:scale-95">
              <span>✓ A&nbsp;&nbsp;25 m per s</span>
            </button>
            <button type="button" className="flex min-h-11 w-full items-center rounded-lg border border-slate-200 p-3 text-left text-sm text-slate-600 transition-all duration-200 active:scale-95">
              <span>B&nbsp;&nbsp;30 m per s</span>
            </button>
            <button type="button" className="flex min-h-11 w-full items-center rounded-lg border border-slate-200 p-3 text-left text-sm text-slate-600 transition-all duration-200 active:scale-95">
              <span>C&nbsp;&nbsp;20 m per s</span>
            </button>
            <button type="button" className="flex min-h-11 w-full items-center rounded-lg border border-slate-200 p-3 text-left text-sm text-slate-600 transition-all duration-200 active:scale-95">
              <span>D&nbsp;&nbsp;35 m per s</span>
            </button>
          </div>
          <aside className="mt-3 rounded-lg border-l-4 border-teal-500 bg-green-50 p-3 text-xs leading-relaxed text-slate-700">
            <p>
              <span>🤖 Correct! 360000m divided by 14400s equals 25 m per s.</span>
            </p>
            <a href="#featured-tests" className="mt-2 block min-h-11 text-right text-xs font-medium text-teal-600 transition-all duration-200 active:scale-95">
              <span>Try Full Test</span>
            </a>
          </aside>
        </article>
      </section>

      <section aria-label="Platform statistics" className="bg-white px-5 py-8">
        <div className="mx-auto grid max-w-[402px] grid-cols-2 gap-4">
          {stats.map(stat => <div key={stat.id} className="rounded-2xl bg-slate-50 p-4 text-center">
              <p className="text-2xl font-bold leading-none text-indigo-600">
                <span>{stat.value}</span>
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                <span>{stat.label}</span>
              </p>
            </div>)}
        </div>
      </section>

      <section id="exams" className="bg-slate-50 px-5 py-10">
        <div className="mx-auto max-w-[402px]">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-teal-600">
            <span>Explore Exams</span>
          </p>
          <h2 className="mt-2 text-center text-2xl font-bold tracking-[-0.035em] text-slate-900">
            <span>Pick Your Exam</span>
          </h2>
          <div className="mt-6 space-y-3">
            {examCategories.map(category => <article key={category.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xl" aria-hidden="true">
                  <span>{category.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-slate-900">
                    <span>{category.name}</span>
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    <span>{category.desc}</span>
                  </p>
                  <p className="mt-1 inline-flex rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700">
                    <span>{category.badge}</span>
                  </p>
                </div>
              </article>)}
          </div>
          <button type="button" className="mt-4 min-h-11 w-full rounded-xl border border-indigo-600 py-3 text-sm font-medium text-indigo-600 transition-all duration-200 active:scale-95">
            <span>View All Exams</span>
          </button>
        </div>
      </section>

      <section id="featured-tests" className="bg-white px-5 py-10">
        <div className="mx-auto max-w-[402px]">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-teal-600">
            <span>Featured Tests</span>
          </p>
          <h2 className="mt-2 text-center text-2xl font-bold tracking-[-0.035em] text-slate-900">
            <span>Start Practicing Now</span>
          </h2>
          <div className="mt-6 space-y-4">
            {featuredTests.map(test => <article key={test.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <header className="flex items-center justify-between gap-3">
                  <p className={`rounded-full px-2.5 py-1 text-xs font-medium ${test.pillClass}`}>
                    <span>{test.category}</span>
                  </p>
                  <p className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    <span>FREE</span>
                  </p>
                </header>
                <h3 className="mt-2 text-base font-bold text-slate-900">
                  <span>{test.name}</span>
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  <span>{test.organiser}</span>
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span>📄 {test.questions}</span>
                  <span>⏱️ {test.duration}</span>
                  <span>🏆 {test.level}</span>
                </div>
                <button type="button" className="mt-4 min-h-11 w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition-all duration-200 active:scale-95">
                  <span>Start Test</span>
                </button>
              </article>)}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-10">
        <div className="mx-auto max-w-[402px]">
          <h2 className="text-center text-2xl font-bold tracking-[-0.035em] text-slate-900">
            <span>Why Students Choose GridAcademy</span>
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {features.map(feature => <article key={feature.id} className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                <p className="mx-auto text-2xl" aria-hidden="true">
                  <span>{feature.icon}</span>
                </p>
                <h3 className="mt-2 text-sm font-semibold text-slate-900">
                  <span>{feature.title}</span>
                </h3>
                <p className="mt-1 text-xs leading-snug text-slate-500">
                  <span>{feature.desc}</span>
                </p>
              </article>)}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-10">
        <div className="mx-auto max-w-[402px]">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">
            <span>Deep Analytics</span>
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-slate-900">
            <span>Know Where You Stand</span>
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            <span>Turn every test into a focused improvement plan with rank, accuracy and section-wise signals.</span>
          </p>
          <article className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
            <h3 className="mb-4 text-sm font-bold text-slate-900">
              <span>Your Performance</span>
            </h3>
            <div className="space-y-4">
              {performanceRows.map(row => <div key={row.id}>
                  <div className="mb-1 flex justify-between gap-3 text-xs text-slate-600">
                    <span>{row.subject}</span>
                    <span>{row.percent}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className={`h-2 rounded-full ${row.width} ${row.color}`} />
                  </div>
                </div>)}
            </div>
            <aside className="mt-5 rounded-lg border-l-4 border-teal-500 bg-green-50 p-3 text-xs leading-relaxed text-slate-700">
              <p>
                <span>🤖 Focus on Reasoning, try 10 more questions daily.</span>
              </p>
            </aside>
            <p className="mt-4 inline-flex rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600">
              <span>#1,243 out of 10,234 students</span>
            </p>
          </article>
        </div>
      </section>

      <section className="mx-auto mb-8 max-w-[402px] px-5">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-10 text-center">
          <p className="text-3xl" aria-hidden="true">
            <span>🧭</span>
          </p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-teal-400">
            <span>Free Career Guide</span>
          </p>
          <h2 className="mt-2 text-xl font-bold tracking-[-0.03em] text-white">
            <span>Not Sure Which Career to Choose?</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            <span>Explore 100 career paths across 8 personality types, most cost zero to start.</span>
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <button type="button" className="min-h-11 w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white transition-all duration-200 active:scale-95">
              <span>Take the Quiz</span>
            </button>
            <button type="button" className="min-h-11 w-full rounded-xl border border-slate-600 py-3 text-sm font-medium text-white transition-all duration-200 active:scale-95">
              <span>Browse 100 Careers</span>
            </button>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-10">
        <div className="mx-auto max-w-[402px]">
          <h2 className="text-center text-2xl font-bold tracking-[-0.035em] text-slate-900">
            <span>Start in Under 60 Seconds</span>
          </h2>
          <div className="relative mt-8 space-y-0">
            <div className="absolute bottom-0 left-5 top-0 w-0.5 bg-slate-200" aria-hidden="true" />
            {steps.map(step => <article key={step.id} className="relative mb-8 flex items-start gap-4">
                <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                  <span>{step.number}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xl" aria-hidden="true">
                    <span>{step.icon}</span>
                  </p>
                  <h3 className="mt-0.5 text-sm font-semibold text-slate-900">
                    <span>{step.title}</span>
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    <span>{step.desc}</span>
                  </p>
                </div>
              </article>)}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-10">
        <div className="mx-auto max-w-[402px]">
          <h2 className="text-center text-2xl font-bold tracking-[-0.035em] text-slate-900">
            <span>Latest from the Blog</span>
          </h2>
          <div className="mt-6 space-y-4">
            {blogPosts.map(post => <article key={post.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className={`h-1.5 w-full ${post.stripClass}`} />
                <div className="p-4">
                  <header className="mb-2 flex items-center justify-between gap-3">
                    <p className={`rounded-full px-2.5 py-1 text-xs font-medium ${post.badgeClass}`}>
                      <span>{post.category}</span>
                    </p>
                    <p className="text-xs text-slate-400">
                      <span>{post.date}</span>
                    </p>
                  </header>
                  <h3 className="text-sm font-bold leading-snug text-slate-900">
                    <span>{post.title}</span>
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
                    <span>{post.excerpt}</span>
                  </p>
                  <footer className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-xs text-slate-400">
                      <span>{post.time}</span>
                    </p>
                    <a href="#footer" className="min-h-11 text-xs font-medium text-teal-600 transition-all duration-200 active:scale-95">
                      <span>Read Article</span>
                    </a>
                  </footer>
                </div>
              </article>)}
          </div>
          <button type="button" className="mt-4 min-h-11 w-full rounded-xl border border-slate-300 py-3 text-sm font-medium text-slate-600 transition-all duration-200 active:scale-95">
            <span>View All Articles</span>
          </button>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-10">
        <div className="mx-auto max-w-[402px]">
          <h2 className="text-center text-2xl font-bold tracking-[-0.035em] text-slate-900">
            <span>Frequently Asked Questions</span>
          </h2>
          <div className="mt-6 space-y-3">
            {faqs.map(faq => <article key={faq.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <button type="button" onClick={() => setOpenFaq(openFaq === faq.id ? '' : faq.id)} aria-expanded={openFaq === faq.id} className="flex min-h-11 w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-semibold text-slate-900 transition-all duration-200 active:scale-95">
                  <span>{faq.question}</span>
                  <span className="ml-3 flex-shrink-0 text-lg leading-none text-indigo-600" aria-hidden="true">{openFaq === faq.id ? '−' : '+'}</span>
                </button>
                {openFaq === faq.id && <div className="border-t border-slate-100 px-5 pb-4 pt-3 text-sm leading-relaxed text-slate-600">
                    <p>
                      <span>{faq.answer}</span>
                    </p>
                  </div>}
              </article>)}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-indigo-600 to-teal-600 px-5 py-14 text-center">
        <div className="mx-auto max-w-[402px]">
          <h2 className="text-2xl font-bold tracking-[-0.035em] text-white">
            <span>Ready to Crack Your Exam?</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/80">
            <span>Join 10,000 plus students already preparing on GridAcademy, free fast and effective.</span>
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <button type="button" className="min-h-11 w-full rounded-xl bg-white py-4 text-base font-semibold text-indigo-700 transition-all duration-200 active:scale-95">
              <span>Start Free Mock Test</span>
            </button>
            <button type="button" className="min-h-11 w-full rounded-xl border-2 border-white py-3.5 text-sm font-medium text-white transition-all duration-200 active:scale-95">
              <span>Register Free</span>
            </button>
          </div>
          <p className="mt-4 text-xs text-white/60">
            <span>No credit card required, 9 plus Exams, 32 plus Mock Tests.</span>
          </p>
        </div>
      </section>

      <footer id="footer" className="bg-slate-900 px-5 py-10 text-white">
        <div className="mx-auto max-w-[402px]">
          <div className="flex items-center gap-2 text-lg font-bold tracking-[-0.03em] text-white">
            <span aria-hidden="true" className="grid h-8 w-8 grid-cols-2 gap-1 rounded-lg bg-indigo-600 p-1.5">
              <span className="rounded-[3px] bg-white" />
              <span className="rounded-[3px] bg-white/75" />
              <span className="rounded-[3px] bg-white/75" />
              <span className="rounded-[3px] bg-white" />
            </span>
            <span>GridAcademy</span>
          </div>
          <p className="mt-2 max-w-[300px] text-xs leading-relaxed text-slate-400">
            <span>India trusted mock test platform for government exam aspirants.</span>
          </p>
          <div className="mt-4 flex gap-3" aria-label="Social links">
            <a href="#footer" aria-label="Twitter" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs text-slate-400 transition-all duration-200 active:scale-95">
              <span>Tw</span>
            </a>
            <a href="#footer" aria-label="Instagram" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs text-slate-400 transition-all duration-200 active:scale-95">
              <span>Ig</span>
            </a>
            <a href="#footer" aria-label="LinkedIn" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs text-slate-400 transition-all duration-200 active:scale-95">
              <span>In</span>
            </a>
          </div>

          <section className="mt-8">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
              <span>Top Exams</span>
            </h2>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-400">
              {footerExamLinks.map(link => <li key={link.id}>
                  <a href="#exams" className="inline-flex min-h-11 items-center transition-all duration-200 active:scale-95">
                    <span>{link.label}</span>
                  </a>
                </li>)}
            </ul>
          </section>

          <section className="mt-6">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
              <span>Platform</span>
            </h2>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-400">
              {footerPlatformLinks.map(link => <li key={link.id}>
                  <a href="#footer" className="inline-flex min-h-11 items-center transition-all duration-200 active:scale-95">
                    <span>{link.label}</span>
                  </a>
                </li>)}
            </ul>
          </section>

          <section className="mt-6">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
              <span>Legal</span>
            </h2>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-400">
              {footerLegalLinks.map(link => <li key={link.id}>
                  <a href="#footer" className="inline-flex min-h-11 items-center transition-all duration-200 active:scale-95">
                    <span>{link.label}</span>
                  </a>
                </li>)}
            </ul>
          </section>

          <div className="mt-8 border-t border-slate-800 pt-6">
            <p className="text-center text-xs text-slate-500">
              <span>© 2026 GridAcademy. All rights reserved.</span>
            </p>
            <p className="mt-1 text-center text-xs text-slate-600">
              <span>Grievance info@gridacademy.in.</span>
            </p>
          </div>
        </div>
      </footer>
    </main>;
}