import React from 'react';
import { ArrowRight, BarChart3, BookOpen, Brain, BriefcaseBusiness, CheckCircle2, ChevronDown, Clock3, Compass, Facebook, FileCheck2, FileText, GraduationCap, Instagram, Landmark, LayoutGrid, LineChart, Linkedin, Medal, Menu, MonitorSmartphone, PieChart, Play, ShieldCheck, Sparkles, Star, Target, Trophy, Twitter, Users, Zap } from 'lucide-react';
type CategoryCard = {
  id: string;
  title: string;
  description: string;
  meta: string;
  icon: React.ReactNode;
};
type MockTestCard = {
  id: string;
  title: string;
  badge: string;
  organizer: string;
  tests: string;
  level: string;
};
type FeatureCard = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};
type BlogCard = {
  id: string;
  tag: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
};
type FaqItem = {
  id: string;
  question: string;
  answer: string;
};
const NAV_LINKS = [{
  id: 'exams',
  label: 'Exams',
  href: '#exams'
}, {
  id: 'mock-tests',
  label: 'Mock Tests',
  href: '#mock-tests'
}, {
  id: 'blog',
  label: 'Blog',
  href: '#blog'
}, {
  id: 'career-guide',
  label: 'Career Guide',
  href: '#career-guide'
}];
const HERO_BULLETS = [{
  id: 'syllabus',
  label: 'Latest syllabus & real exam pattern'
}, {
  id: 'analytics',
  label: 'Instant analytics after every attempt'
}, {
  id: 'free',
  label: 'Mostly free tests for major exams'
}];
const HERO_METRICS = [{
  id: 'exams',
  value: '9+',
  label: 'Major exams'
}, {
  id: 'tests',
  value: '32+',
  label: 'Mock tests'
}, {
  id: 'students',
  value: '10K+',
  label: 'Students'
}];
const STATS = [{
  id: 'exams',
  value: '9+',
  label: 'Exams covered',
  icon: <BookOpen className="h-5 w-5" aria-hidden="true" />
}, {
  id: 'tests',
  value: '32+',
  label: 'Mock tests',
  icon: <FileCheck2 className="h-5 w-5" aria-hidden="true" />
}, {
  id: 'students',
  value: '10K+',
  label: 'Students practicing',
  icon: <Users className="h-5 w-5" aria-hidden="true" />
}, {
  id: 'free',
  value: 'Mostly',
  label: 'Free to begin',
  icon: <Sparkles className="h-5 w-5" aria-hidden="true" />
}];
const CATEGORIES: CategoryCard[] = [{
  id: 'ssc',
  title: 'SSC',
  description: 'CGL, CHSL, MTS and GD Constable practice with speed-focused aptitude sets.',
  meta: 'Free + PYP tests',
  icon: <FileText className="h-6 w-6" aria-hidden="true" />
}, {
  id: 'railway',
  title: 'Railway',
  description: 'RRB ALP, NTPC and Group D mock tests designed for real CBT timing.',
  meta: 'Latest pattern',
  icon: <Zap className="h-6 w-6" aria-hidden="true" />
}, {
  id: 'banking',
  title: 'Banking',
  description: 'IBPS, SBI and RBI practice sets with section-wise accuracy insights.',
  meta: 'Coming batches',
  icon: <Landmark className="h-6 w-6" aria-hidden="true" />
}, {
  id: 'upsc',
  title: 'UPSC',
  description: 'Prelims GS and CSAT preparation built for concept recall and stamina.',
  meta: 'Analysis ready',
  icon: <GraduationCap className="h-6 w-6" aria-hidden="true" />
}, {
  id: 'cuet',
  title: 'CUET UG',
  description: 'University entrance mocks for 2026 with domain and general test practice.',
  meta: '11 tests live',
  icon: <BookOpen className="h-6 w-6" aria-hidden="true" />
}, {
  id: 'neet',
  title: 'NEET UG',
  description: 'Physics, Chemistry and Biology papers aligned to the newest syllabus.',
  meta: 'Live now',
  icon: <Brain className="h-6 w-6" aria-hidden="true" />
}, {
  id: 'defence',
  title: 'Defence',
  description: 'Practice reasoning, GK and aptitude for disciplined defence preparation.',
  meta: 'Free start',
  icon: <ShieldCheck className="h-6 w-6" aria-hidden="true" />
}, {
  id: 'teaching',
  title: 'Teaching',
  description: 'Pedagogy and subject practice for teaching aspirants across India.',
  meta: 'Topic-wise',
  icon: <Users className="h-6 w-6" aria-hidden="true" />
}, {
  id: 'state-psc',
  title: 'State PSC',
  description: 'State-level exam practice with current affairs and regional exam focus.',
  meta: 'New exams added',
  icon: <BriefcaseBusiness className="h-6 w-6" aria-hidden="true" />
}];
const MOCK_TESTS: MockTestCard[] = [{
  id: 'neet-ug',
  title: 'Latest NEET UG Mock Test Series',
  badge: 'NEET UG',
  organizer: 'National Testing Agency (NTA)',
  tests: '1 test',
  level: 'All India Level'
}, {
  id: 'rrb-alp',
  title: 'RRB ALP Mock Test Series',
  badge: 'Railway',
  organizer: 'Railway Recruitment Board (RRB)',
  tests: '1 test',
  level: 'CBT Pattern'
}, {
  id: 'ssc-chsl',
  title: 'SSC CHSL Tier 1 PYP Mock Test Series',
  badge: 'SSC PYP',
  organizer: 'Staff Selection Commission (SSC)',
  tests: '1 test',
  level: 'Previous Year'
}, {
  id: 'cuet-2026',
  title: 'CUET Mock Test 2026 — Real Exam Practice',
  badge: 'CUET UG',
  organizer: 'National Testing Agency (NTA)',
  tests: '11 tests',
  level: 'Full Length'
}, {
  id: 'ssc-cgl',
  title: 'SSC CGL T1 2026 Practice Set',
  badge: 'SSC CGL',
  organizer: 'Staff Selection Commission',
  tests: '2 tests',
  level: 'Latest Pattern'
}];
const FEATURES: FeatureCard[] = [{
  id: 'instant-results',
  title: 'Instant Results',
  description: 'Know your score, time usage and accuracy the moment you submit.',
  icon: <Zap className="h-5 w-5" aria-hidden="true" />
}, {
  id: 'latest-pattern',
  title: 'Latest Pattern',
  description: 'Practice papers are aligned with current syllabus and exam format.',
  icon: <FileCheck2 className="h-5 w-5" aria-hidden="true" />
}, {
  id: 'leaderboard',
  title: 'Leaderboard',
  description: 'Benchmark your preparation against aspirants across India.',
  icon: <Trophy className="h-5 w-5" aria-hidden="true" />
}, {
  id: 'deep-analysis',
  title: 'Deep Analysis',
  description: 'Spot weak areas with section-wise performance and attempt patterns.',
  icon: <PieChart className="h-5 w-5" aria-hidden="true" />
}, {
  id: 'solutions',
  title: 'Detailed Solutions',
  description: 'Review concept-backed solutions instead of only checking answers.',
  icon: <BookOpen className="h-5 w-5" aria-hidden="true" />
}, {
  id: 'mostly-free',
  title: 'Mostly Free',
  description: 'Start serious preparation without a paywall blocking your first test.',
  icon: <Sparkles className="h-5 w-5" aria-hidden="true" />
}, {
  id: 'major-exams',
  title: 'All Major Exams',
  description: 'SSC, Railway, Banking, CUET, NEET, UPSC, Defence and State PSC.',
  icon: <Target className="h-5 w-5" aria-hidden="true" />
}, {
  id: 'mobile-ready',
  title: 'Mobile Ready',
  description: 'Attempt tests and review performance smoothly on any screen.',
  icon: <MonitorSmartphone className="h-5 w-5" aria-hidden="true" />
}];
const HOW_IT_WORKS = [{
  id: 'signup',
  title: 'Sign Up Free',
  description: 'Create your GridAcademy account in under a minute.'
}, {
  id: 'choose',
  title: 'Choose Exam',
  description: 'Pick SSC, CUET, NEET, Railway or another target.'
}, {
  id: 'attempt',
  title: 'Attempt Mock Test',
  description: 'Practice in a timed, exam-like interface.'
}, {
  id: 'analysis',
  title: 'View Instant Analysis',
  description: 'See score, accuracy, rank and weak topics.'
}, {
  id: 'repeat',
  title: 'Improve and Repeat',
  description: 'Review solutions and come back stronger.'
}];
const BLOG_POSTS: BlogCard[] = [{
  id: 'neet-cutoff',
  tag: 'NEET',
  title: 'NEET 2026 Expected Cutoff: Category-Wise Marks and Safe Score',
  excerpt: 'A data-driven look at expected qualifying cutoffs, safe scores for government MBBS seats and closing ranks for top colleges.',
  date: '15 Jul 2026',
  readTime: '10 min read'
}, {
  id: 'ssc-plan',
  tag: 'SSC',
  title: 'SSC CGL Tier 1 Preparation 2026: Section-Wise 90-Day Plan',
  excerpt: 'Topic priorities, mock-test rhythm, book recommendations and a practical strategy to push toward a 160+ score.',
  date: '11 Jul 2026',
  readTime: '10 min read'
}, {
  id: 'rpf-guide',
  tag: 'Railway',
  title: 'RPF Recruitment 2026: Complete Guide for Constable and SI',
  excerpt: 'Eligibility, exam pattern, selection stages and how to prepare for expected RPF Constable and Sub-Inspector vacancies.',
  date: '8 Jul 2026',
  readTime: '13 min read'
}];
const FAQS: FaqItem[] = [{
  id: 'free-tests',
  question: 'Are GridAcademy mock tests free?',
  answer: 'Most GridAcademy mock tests are free to start, including popular exam practice sets and previous year papers. Some provider-led premium batches may be added separately.'
}, {
  id: 'account',
  question: 'Do I need an account to take a test?',
  answer: 'Yes. A free account helps save your attempts, analysis, rank history and recommended next steps across devices.'
}, {
  id: 'pattern',
  question: 'How accurate is the exam pattern used in the mock tests?',
  answer: 'Tests are created or curated around the latest syllabus, official notifications and previous year paper patterns so practice feels close to the real exam.'
}, {
  id: 'review',
  question: 'Can I review my answers after finishing a test?',
  answer: 'Yes. You can review correct and incorrect answers, detailed solutions, time spent and section-wise accuracy after submission.'
}, {
  id: 'available-exams',
  question: 'Which exams are currently available on GridAcademy?',
  answer: 'GridAcademy currently focuses on SSC, Railway, CUET UG, NEET UG, UPSC, Banking, Defence, Teaching and State PSC categories, with new exams added regularly.'
}];
const FOOTER_TOP_EXAMS = ['SSC CGL', 'CUET UG', 'NEET UG', 'RRB ALP', 'UPSC Prelims'];
const FOOTER_PLATFORM_LINKS = ['Mock Tests', 'Career Guide', 'Blog', 'Leaderboard', 'Become a Provider'];
const FOOTER_LEGAL_LINKS = ['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Provider Agreement'];
const AnnouncementBar = () => {
  return <section className="bg-gradient-to-r from-[#3B5BDB] via-[#4263EB] to-[#0D9488] text-white" aria-label="Announcement">
      <div className="mx-auto flex max-w-[1200px] items-center justify-center gap-3 px-5 py-3 text-center text-[12px] font-normal leading-[1.65] sm:text-base">
        <Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" />
        <p>
          <span>NEET UG 2026 Mock Test Series is live — practice free today.</span>
        </p>
      </div>
    </section>;
};
const Header = () => {
  return <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-[1200px] items-center justify-between px-5" aria-label="Main navigation">
        <a href="#top" className="flex items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B5BDB] focus-visible:ring-offset-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#3B5BDB] text-white shadow-lg shadow-indigo-200">
            <LayoutGrid className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="text-[16px] font-bold leading-none tracking-tight text-slate-950">GridAcademy</span>
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map(link => <a key={link.id} href={link.href} className="rounded-lg text-[14px] font-medium text-slate-600 transition hover:text-[#3B5BDB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B5BDB] focus-visible:ring-offset-4">
              {link.label}
            </a>)}
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <a href="#login" className="rounded-xl px-4 py-2.5 text-[14px] font-medium text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B5BDB] focus-visible:ring-offset-4">
            Login
          </a>
          <a href="#mock-tests" className="rounded-xl bg-[#3B5BDB] px-5 py-2.5 text-[14px] font-medium text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-[#2F49C7] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B5BDB] focus-visible:ring-offset-4">
            Start Free
          </a>
        </div>

        <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B5BDB] focus-visible:ring-offset-4 lg:hidden" aria-label="Open navigation menu">
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </nav>
    </header>;
};
const Footer = () => {
  return <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-[1200px] px-5 py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <a href="#top" className="inline-flex items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#3B5BDB]">
                <LayoutGrid className="h-6 w-6" aria-hidden="true" />
              </span>
              <span className="text-[16px] font-bold leading-none tracking-tight">GridAcademy</span>
            </a>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
              <span>India's trusted marketplace for competitive exam mock tests. Prepare smarter with free practice, instant analysis and detailed solutions.</span>
            </p>
            <div className="mt-7 flex items-center gap-3" aria-label="Social links">
              <a href="#social-twitter" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-slate-200 transition hover:bg-white hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950" aria-label="GridAcademy on Twitter">
                <Twitter className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href="#social-linkedin" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-slate-200 transition hover:bg-white hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950" aria-label="GridAcademy on LinkedIn">
                <Linkedin className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href="#social-instagram" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-slate-200 transition hover:bg-white hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950" aria-label="GridAcademy on Instagram">
                <Instagram className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href="#social-facebook" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-slate-200 transition hover:bg-white hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950" aria-label="GridAcademy on Facebook">
                <Facebook className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h3 className="text-[11px] font-medium uppercase tracking-[0.07em] text-slate-400">Top Exams</h3>
              <ul className="mt-5 space-y-3">
                {FOOTER_TOP_EXAMS.map(link => <li key={link}>
                    <a href="#exams" className="text-[13px] font-normal text-slate-300 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950">
                      {link}
                    </a>
                  </li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-[11px] font-medium uppercase tracking-[0.07em] text-slate-400">Platform</h3>
              <ul className="mt-5 space-y-3">
                {FOOTER_PLATFORM_LINKS.map(link => <li key={link}>
                    <a href="#mock-tests" className="text-[13px] font-normal text-slate-300 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950">
                      {link}
                    </a>
                  </li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-[11px] font-medium uppercase tracking-[0.07em] text-slate-400">Legal</h3>
              <ul className="mt-5 space-y-3">
                {FOOTER_LEGAL_LINKS.map(link => <li key={link}>
                    <a href="#legal" className="text-[13px] font-normal text-slate-300 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950">
                      {link}
                    </a>
                  </li>)}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-7 text-[12px] font-normal text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>
            <span>© 2026 GridAcademy. All rights reserved.</span>
          </p>
          <p>
            <span>GSTIN: XXXXXXXXXXXX · Grievance: info@gridacademy.in</span>
          </p>
        </div>
      </div>
    </footer>;
};
export const GridAcademy = () => {
  return <div id="top" className="min-h-screen overflow-x-hidden bg-white font-sans text-slate-950">
      <AnnouncementBar />
      <Header />

      <main>
        <section className="bg-gradient-to-b from-white via-slate-50 to-white">
          <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 py-16 lg:grid-cols-12 lg:py-24">
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-bold text-[#3B5BDB] shadow-sm">
                <Medal className="h-4 w-4" aria-hidden="true" />
                <span>Trusted by 10000+ Students</span>
              </div>
              <h1 className="mt-7 max-w-3xl text-[40px] font-bold leading-[1.2] tracking-[-0.03em] text-slate-950 sm:text-6xl lg:text-7xl">
                <span>India </span>
                <span className="bg-gradient-to-r from-[#3B5BDB] to-[#0D9488] bg-clip-text text-transparent">Smartest</span>
                <span> Mock Test Platform</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">
                <span>Free mock tests for SSC, Railway, Banking, CUET and UPSC aspirants with instant results, detailed solutions and performance analytics that show exactly where to improve.</span>
              </p>

              <ul className="mt-8 grid gap-3 text-base font-semibold text-slate-700 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {HERO_BULLETS.map(bullet => <li key={bullet.id} className="flex items-start gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#0D9488]" aria-hidden="true" />
                    <span>{bullet.label}</span>
                  </li>)}
              </ul>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href="#mock-tests" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3B5BDB] px-7 py-4 text-base font-medium text-white shadow-xl shadow-indigo-200 transition hover:-translate-y-1 hover:bg-[#2F49C7] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B5BDB] focus-visible:ring-offset-4">
                  <span>Start Free Mock Test</span>
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </a>
                <a href="#exams" className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-7 py-4 text-base font-medium text-slate-800 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:bg-slate-50 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B5BDB] focus-visible:ring-offset-4">
                  Browse All Exams
                </a>
              </div>

              <div className="mt-10 grid max-w-xl grid-cols-3 divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                {HERO_METRICS.map(metric => <div key={metric.id} className="px-4 first:pl-0 last:pr-0">
                    <strong className="block text-2xl font-bold tracking-tight text-slate-950">{metric.value}</strong>
                    <span className="mt-1 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{metric.label}</span>
                  </div>)}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200/80">
                <div className="grid gap-4 rounded-[1.5rem] bg-slate-950 p-4 text-white sm:grid-cols-3">
                  <div className="rounded-2xl bg-white p-4 text-slate-950 shadow-lg sm:col-span-2">
                    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3B5BDB]">
                          <span>SSC CGL Aptitude</span>
                        </p>
                        <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">Mock Test Preview</h2>
                      </div>
                      <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-[#0D9488]">Free</span>
                    </div>

                    <div className="mt-5">
                      <div className="flex items-center justify-between text-sm font-bold text-slate-500">
                        <span>Question 12 of 25</span>
                        <span>00:42</span>
                      </div>
                      <p className="mt-4 text-lg font-black leading-7 text-slate-950">
                        <span>If a train covers 180 km in 2.5 hours, what is its average speed?</span>
                      </p>
                      <div className="mt-5 grid gap-3">
                        <button type="button" className="rounded-2xl border border-slate-200 bg-white p-4 text-left text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B5BDB] focus-visible:ring-offset-2">
                          A. 68 km/h
                        </button>
                        <button type="button" className="rounded-2xl border border-[#0D9488] bg-teal-50 p-4 text-left text-sm font-black text-[#0F766E] shadow-sm transition active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2">
                          B. 72 km/h
                        </button>
                        <button type="button" className="rounded-2xl border border-slate-200 bg-white p-4 text-left text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B5BDB] focus-visible:ring-offset-2">
                          C. 75 km/h
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-teal-50 p-4">
                      <div className="flex items-start gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#3B5BDB] shadow-sm">
                          <Sparkles className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div>
                          <p className="text-sm font-black text-slate-950">
                            <span>Insight</span>
                          </p>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            <span>Your speed is strong in time-distance questions. Review ratio shortcuts to improve the next set.</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="rounded-2xl bg-[#3B5BDB] p-4 text-white shadow-lg shadow-indigo-950/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-100">Rank</span>
                        <Trophy className="h-5 w-5 text-indigo-100" aria-hidden="true" />
                      </div>
                      <strong className="mt-4 block text-3xl font-black">#248</strong>
                      <span className="mt-1 block text-sm text-indigo-100">All India</span>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-300">Accuracy</span>
                        <Target className="h-5 w-5 text-teal-300" aria-hidden="true" />
                      </div>
                      <strong className="mt-4 block text-3xl font-black">86%</strong>
                      <div className="mt-3 h-2 rounded-full bg-white/10">
                        <div className="h-2 w-[86%] rounded-full bg-[#0D9488]" aria-hidden="true"></div>
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white p-4 text-slate-950 shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Free Exams</span>
                        <Star className="h-5 w-5 fill-[#0D9488] text-[#0D9488]" aria-hidden="true" />
                      </div>
                      <strong className="mt-4 block text-3xl font-black">9</strong>
                      <span className="mt-1 block text-sm font-semibold text-slate-500">Live today</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white" aria-label="GridAcademy platform statistics">
          <div className="mx-auto grid max-w-[1200px] gap-4 px-5 py-8 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map(stat => <article key={stat.id} className="flex items-center gap-4 rounded-2xl bg-slate-50 p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-slate-200/70">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#3B5BDB] shadow-sm">{stat.icon}</span>
                <div>
                  <strong className="block text-3xl font-bold tracking-tight text-slate-950">{stat.value}</strong>
                  <p className="text-sm font-semibold text-slate-500">
                    <span>{stat.label}</span>
                  </p>
                </div>
              </article>)}
          </div>
        </section>

        <section id="exams" className="bg-slate-50 py-20 lg:py-28">
          <div className="mx-auto max-w-[1200px] px-5">
            <div className="max-w-2xl">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#3B5BDB]">
                <span>Popular exam categories</span>
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">Choose your exam path and start practicing today.</h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {CATEGORIES.map(category => <article key={category.id} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-2xl hover:shadow-slate-200/80">
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-[#3B5BDB] transition group-hover:bg-[#3B5BDB] group-hover:text-white">{category.icon}</span>
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-[#0D9488]">{category.meta}</span>
                  </div>
                  <h3 className="mt-6 text-2xl font-black tracking-tight text-slate-950">{category.title}</h3>
                  <p className="mt-3 min-h-[72px] text-base leading-7 text-slate-600">
                    <span>{category.description}</span>
                  </p>
                  <a href="#mock-tests" className="mt-6 inline-flex items-center gap-2 rounded-xl text-sm font-black text-[#3B5BDB] transition hover:gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B5BDB] focus-visible:ring-offset-4">
                    <span>Start Practicing</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </article>)}
            </div>
          </div>
        </section>

        <section id="mock-tests" className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-[1200px] px-5">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0D9488]">
                  <span>Featured mock tests</span>
                </p>
                <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">High-intent practice sets students are attempting now.</h2>
              </div>
              <a href="#exams" className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-800 transition hover:-translate-y-1 hover:bg-slate-50 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B5BDB] focus-visible:ring-offset-4">
                <span>View all exams</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-5">
              {MOCK_TESTS.map(test => <article key={test.id} className="flex min-h-[320px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-2xl hover:shadow-slate-200/80">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-[#3B5BDB]">{test.badge}</span>
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-[#0D9488]">FREE</span>
                  </div>
                  <h3 className="mt-6 text-xl font-black leading-7 tracking-tight text-slate-950">{test.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    <span>{test.organizer}</span>
                  </p>
                  <dl className="mt-6 grid gap-3 text-sm">
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                      <dt className="font-semibold text-slate-500">Tests</dt>
                      <dd className="font-black text-slate-950">{test.tests}</dd>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                      <dt className="font-semibold text-slate-500">Level</dt>
                      <dd className="font-black text-slate-950">{test.level}</dd>
                    </div>
                  </dl>
                  <a href="#signup" className="mt-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3B5BDB] px-5 py-3 text-sm font-black text-white shadow-lg shadow-indigo-100 transition hover:-translate-y-1 hover:bg-[#2F49C7] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B5BDB] focus-visible:ring-offset-4">
                    <span>Start Test</span>
                    <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                  </a>
                </article>)}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-20 lg:py-28">
          <div className="mx-auto max-w-[1200px] px-5">
            <div className="max-w-2xl">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#3B5BDB]">
                <span>Why GridAcademy</span>
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">Everything serious aspirants need after every mock.</h2>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map(feature => <article key={feature.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/80">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-[#3B5BDB]">{feature.icon}</span>
                  <h3 className="mt-5 text-lg font-black tracking-tight text-slate-950">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    <span>{feature.description}</span>
                  </p>
                </article>)}
            </div>
          </div>
        </section>

        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0D9488]">
                <span>Performance analytics</span>
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">Turn every attempt into a sharper next attempt.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                <span>GridAcademy analysis highlights your score trend, weak sections, time leakage and rank movement so preparation becomes measurable, not guesswork.</span>
              </p>
              <a href="#signup" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 text-base font-black text-white transition hover:-translate-y-1 hover:bg-slate-800 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-4">
                <span>See your analysis</span>
                <LineChart className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
            <div className="lg:col-span-7">
              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 shadow-2xl shadow-slate-200/80">
                <div className="rounded-[1.5rem] bg-white p-6">
                  <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.16em] text-[#3B5BDB]">
                        <span>SSC CGL Performance</span>
                      </p>
                      <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Attempt Dashboard</h3>
                    </div>
                    <div className="rounded-2xl bg-teal-50 px-5 py-3 text-right">
                      <span className="block text-xs font-black uppercase tracking-[0.16em] text-[#0D9488]">Rank</span>
                      <strong className="text-2xl font-black text-slate-950">#248</strong>
                    </div>
                  </div>
                  <div className="mt-6 grid gap-5 lg:grid-cols-2">
                    <div className="space-y-5">
                      <div>
                        <div className="mb-2 flex items-center justify-between text-sm font-bold">
                          <span>Quantitative Aptitude</span>
                          <span>86%</span>
                        </div>
                        <div className="h-3 rounded-full bg-slate-100">
                          <div className="h-3 w-[86%] rounded-full bg-[#3B5BDB]" aria-hidden="true"></div>
                        </div>
                      </div>
                      <div>
                        <div className="mb-2 flex items-center justify-between text-sm font-bold">
                          <span>Reasoning</span>
                          <span>78%</span>
                        </div>
                        <div className="h-3 rounded-full bg-slate-100">
                          <div className="h-3 w-[78%] rounded-full bg-[#0D9488]" aria-hidden="true"></div>
                        </div>
                      </div>
                      <div>
                        <div className="mb-2 flex items-center justify-between text-sm font-bold">
                          <span>General Awareness</span>
                          <span>62%</span>
                        </div>
                        <div className="h-3 rounded-full bg-slate-100">
                          <div className="h-3 w-[62%] rounded-full bg-slate-950" aria-hidden="true"></div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-teal-50 p-5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#3B5BDB] shadow-sm">
                          <BarChart3 className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div>
                          <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                            <span>AI-style insight</span>
                          </p>
                          <strong className="text-lg text-slate-950">Improve GA next</strong>
                        </div>
                      </div>
                      <p className="mt-5 text-sm leading-6 text-slate-700">
                        <span>You gained 11% accuracy in Quant. Spend the next two sessions on General Awareness revision to move into the top 150.</span>
                      </p>
                      <div className="mt-6 grid grid-cols-2 gap-3">
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

        <section id="career-guide" className="bg-slate-950 py-20 text-white lg:py-28">
          <div className="mx-auto grid max-w-[1200px] gap-10 px-5 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-teal-300">
                <span>Free Career Guide</span>
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Not sure which career to choose? Explore 100 options.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                <span>Discover paths across personality types like Makers, Thinkers, Builders and Helpers. Most options cost ₹0 to start exploring.</span>
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#quiz" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-base font-black text-slate-950 transition hover:-translate-y-1 hover:bg-slate-100 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950">
                  <span>Take the Quiz</span>
                  <CheckCircle2 className="h-5 w-5 text-[#0D9488]" aria-hidden="true" />
                </a>
                <a href="#careers" className="inline-flex items-center justify-center rounded-2xl border border-white/20 px-6 py-4 text-base font-black text-white transition hover:-translate-y-1 hover:bg-white/10 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950">
                  Browse 100 Careers
                </a>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
              <article className="rounded-2xl bg-white p-6 text-slate-950 shadow-xl shadow-black/20">
                <Compass className="h-8 w-8 text-[#3B5BDB]" aria-hidden="true" />
                <h3 className="mt-5 text-2xl font-black">Thinkers</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  <span>Analytical careers for students who enjoy systems, logic and structured problem solving.</span>
                </p>
              </article>
              <article className="rounded-2xl bg-white/10 p-6 text-white ring-1 ring-white/10">
                <Target className="h-8 w-8 text-teal-300" aria-hidden="true" />
                <h3 className="mt-5 text-2xl font-black">Builders</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  <span>Action-oriented paths for students who like creating, operating and improving things.</span>
                </p>
              </article>
              <article className="rounded-2xl bg-white/10 p-6 text-white ring-1 ring-white/10 sm:col-span-2">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-2xl font-black">100 career cards</h3>
                    <p className="mt-2 max-w-lg text-sm leading-6 text-slate-300">
                      <span>Match interests, exam preparation and realistic starting steps before choosing a direction.</span>
                    </p>
                  </div>
                  <span className="rounded-full bg-teal-300 px-5 py-2 text-sm font-black text-slate-950">₹0 to explore</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-[1200px] px-5">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#3B5BDB]">
                <span>How it works</span>
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">A simple five-step preparation loop.</h2>
            </div>
            <div className="mt-12 grid gap-4 lg:grid-cols-5">
              {HOW_IT_WORKS.map(step => <article key={step.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-slate-200/80">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#3B5BDB] text-sm font-black text-white">{HOW_IT_WORKS.findIndex(item => item.id === step.id) + 1}</span>
                  <h3 className="mt-5 text-lg font-black tracking-tight text-slate-950">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    <span>{step.description}</span>
                  </p>
                </article>)}
            </div>
          </div>
        </section>

        <section id="blog" className="bg-slate-50 py-20 lg:py-28">
          <div className="mx-auto max-w-[1200px] px-5">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0D9488]">
                  <span>Latest from the blog</span>
                </p>
                <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">Exam strategy without the noise.</h2>
              </div>
              <a href="#all-posts" className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-1 hover:shadow-xl active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B5BDB] focus-visible:ring-offset-4">
                <span>View all posts</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {BLOG_POSTS.map(post => <article key={post.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/80">
                  <div className="flex items-center justify-between gap-4">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-[#3B5BDB]">{post.tag}</span>
                    <span className="text-xs font-bold text-slate-500">{post.date}</span>
                  </div>
                  <h3 className="mt-6 text-2xl font-black leading-8 tracking-tight text-slate-950">{post.title}</h3>
                  <p className="mt-4 text-base leading-7 text-slate-600">
                    <span>{post.excerpt}</span>
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-500">
                      <Clock3 className="h-4 w-4" aria-hidden="true" />
                      <span>{post.readTime}</span>
                    </span>
                    <a href="#read" className="rounded-lg text-sm font-black text-[#3B5BDB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B5BDB] focus-visible:ring-offset-4">
                      Read
                    </a>
                  </div>
                </article>)}
            </div>
          </div>
        </section>

        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-[900px] px-5">
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#3B5BDB]">
                <span>FAQ</span>
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">Questions aspirants ask before starting.</h2>
            </div>
            <div className="mt-10 space-y-3">
              {FAQS.map(faq => <details key={faq.id} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-xl hover:shadow-slate-200/80">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-lg font-black text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B5BDB] focus-visible:ring-offset-4">
                    <span>{faq.question}</span>
                    <ChevronDown className="h-5 w-5 shrink-0 text-slate-500 transition group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                    <span>{faq.answer}</span>
                  </p>
                </details>)}
            </div>
          </div>
        </section>

        <section id="signup" className="bg-white px-5 pb-20 lg:pb-28">
          <div className="mx-auto max-w-[1200px] overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#3B5BDB] to-[#0D9488] p-8 text-white shadow-2xl shadow-indigo-200 lg:p-14">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-white/75">
                  <span>Ready to crack your exam?</span>
                </p>
                <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Start with a free mock test and know where you stand today.</h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col xl:flex-row">
                <a href="#mock-tests" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-base font-black text-[#3B5BDB] transition hover:-translate-y-1 hover:bg-slate-100 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#3B5BDB]">
                  <span>Start Free Mock Test</span>
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </a>
                <a href="#register" className="inline-flex items-center justify-center rounded-2xl border border-white/30 px-6 py-4 text-base font-black text-white transition hover:-translate-y-1 hover:bg-white/10 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#3B5BDB]">
                  Register Free
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};