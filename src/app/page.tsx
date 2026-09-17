export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight, BarChart3, BookOpen, Calendar, Check, ChevronRight,
  Download, ShieldCheck, Target,
} from 'lucide-react';
import { api } from '@/lib/api-client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { StatusLegend, StatusMark, QStatus } from '@/components/exam/PaletteStatus';
import ExamCardLink from '@/components/exam/ExamCardLink';
import { ExamCard, ExamNotification } from '@/types/exam';
import { STREAMS, StreamKey, groupByStream } from '@/lib/streams';
import { getAllDates, getStoriesByDate } from '@/lib/current-affairs';
import { getAllPosts } from '@/lib/blog-posts';

// ── Data ──────────────────────────────────────────────────────────────────────
async function getHomeData() {
  const [exams, notifications] = await Promise.all([
    api.get<ExamCard[]>('/api/exam-pages?activeOnly=true').catch(() => [] as ExamCard[]),
    api.get<{ items: ExamNotification[] }>('/api/notifications?pageSize=5')
      .then(r => r?.items ?? [])
      .catch(() => [] as ExamNotification[]),
  ]);
  return {
    exams: Array.isArray(exams) ? exams : [],
    notifications: Array.isArray(notifications) ? notifications : [],
  };
}

const NOTIFICATION_TYPE: Record<number, { label: string; className: string }> = {
  1: { label: 'Notification', className: 'bg-primary-tint text-primary-dark' },
  2: { label: 'Admit Card',   className: 'bg-[#fef3dc] text-[#8a5200]' },
  3: { label: 'Result',       className: 'bg-[#e7f6ec] text-[#0b6b31]' },
  4: { label: 'Syllabus',     className: 'bg-[#f2f4f7] text-[#344054]' },
};

const STREAM_ICON: Record<StreamKey, React.ComponentType<{ className?: string }>> = {
  jee: BarChart3, neet: Target, cuet: BookOpen, gov: ShieldCheck,
};

function formatDay(iso: string | null) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── SEO ───────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'GridAcademy — Mock Tests for JEE, NEET, CUET & Government Exams',
  description:
    'Full-length mock tests for JEE Main, NEET UG, CUET UG, SSC, Railways and Banking on the real computer-based exam interface. Free tests to start, a solution for every question.',
  alternates: { canonical: 'https://www.gridacademy.in/' },
  openGraph: {
    title: 'GridAcademy — Mock Tests for JEE, NEET, CUET & Government Exams',
    description:
      'Full-length mock tests on the real computer-based exam interface. Free tests to start, a solution for every question.',
    url: 'https://www.gridacademy.in/',
    siteName: 'GridAcademy',
    images: [{ url: 'https://www.gridacademy.in/og-image.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
};

const FAQS = [
  {
    q: 'Are GridAcademy mock tests free?',
    a: 'Most exams include free tests you can take with just your email and mobile number. Paid tests are unlocked per exam: one payment opens every paid test in that exam, with lifetime access.',
  },
  {
    q: 'Do I need an account to take a test?',
    a: 'No separate sign-up is needed for a free test — enter your email and 10-digit mobile number and the test starts. Your result is saved to that account.',
  },
  {
    q: 'Does the test screen match the real exam?',
    a: 'Yes. Tests use the computer-based exam layout: section tabs, a countdown timer, a question palette, Save & Next, Mark for Review & Next and an on-screen keypad for numerical answers.',
  },
  {
    q: 'Can I review my answers after finishing?',
    a: 'Yes. After you submit you see your score, section-wise correct, incorrect and unattempted counts, and the correct answer with a solution for every question.',
  },
  {
    q: 'Can I take tests on my phone?',
    a: 'Yes. GridAcademy works in any modern mobile browser with no app to install, and the test screen is built for phones.',
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function HomePage({ searchParams }: { searchParams?: { stream?: string } }) {
  const { exams, notifications } = await getHomeData();
  const byStream = groupByStream(exams);

  const requested = STREAMS.find(s => s.key === searchParams?.stream)?.key;
  const activeStream: StreamKey = requested ?? STREAMS.find(s => byStream[s.key].length > 0)?.key ?? 'jee';
  const activeExams = byStream[activeStream].slice(0, 4);
  const activeMeta = STREAMS.find(s => s.key === activeStream)!;

  const govExams = byStream.gov.slice(0, 5);
  const latestDate = getAllDates()[0];
  const todaysStories = latestDate ? getStoriesByDate(latestDate).slice(0, 3) : [];
  const latestPost = getAllPosts()[0];

  const resources = [
    { title: 'NEET 2027 Week 2 study plan', sub: 'Free PDF · weekly targets', href: '/resources/neet-2027-week2', Icon: Download },
    { title: 'Career Guide quiz',           sub: '100 career cards · 5 min',  href: '/career-guide/quiz',         Icon: Target },
    { title: 'Daily current affairs',        sub: 'Exam-relevant news, every day', href: '/current-affairs',     Icon: Calendar },
    ...(latestPost ? [{ title: latestPost.title, sub: `Blog · ${latestPost.readingTimeMinutes} min read`, href: `/blog/${latestPost.slug}`, Icon: BookOpen }] : []),
  ];

  const samplePalette: QStatus[] = [
    'answered', 'answered', 'answered', 'notAnswered', 'answered', 'answered', 'answeredMarked', 'answered',
    'answered', 'marked', 'answered', 'answered', 'answered', 'notAnswered', 'answered', 'answered',
    'notVisited', 'notVisited', 'notVisited', 'notVisited',
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        '@id': 'https://www.gridacademy.in/#webapp',
        name: 'GridAcademy',
        url: 'https://www.gridacademy.in',
        description: 'Mock tests for JEE, NEET, CUET and government exams on the real computer-based exam interface.',
        applicationCategory: 'EducationApplication',
        operatingSystem: 'Any',
        inLanguage: ['en-IN'],
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', description: 'Free tests to start; paid tests unlock per exam with lifetime access.' },
        featureList: [
          'Full-length mock tests on the computer-based exam interface',
          'JEE, NEET, CUET, SSC, Railways and Banking coverage',
          'Section-wise score after every test',
          'Correct answer and solution for every question',
          'Mobile-friendly test screen',
        ],
        publisher: { '@type': 'Organization', name: 'GridAcademy', url: 'https://www.gridacademy.in' },
      }) }} />

      <Header />

      <main className="bg-white text-ink">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-b from-paper to-white">
          <div className="max-w-[1328px] mx-auto px-4 md:px-6 lg:px-8 pt-7 pb-6 md:pt-16 md:pb-14 grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-16">
            <div className="flex flex-col gap-4 md:gap-5 lg:pt-3 min-w-0">
              <p className="text-[11.5px] md:text-[12.5px] font-semibold uppercase tracking-[0.08em] text-primary-dark">
                Mock tests on the real exam interface
              </p>
              <h1 className="text-[32px] leading-[1.1] md:text-[52px] md:leading-[1.06] font-bold tracking-[-0.025em] max-w-[620px]">
                Practise on the exam screen before exam day.
              </h1>
              <p className="text-base md:text-[18.5px] leading-relaxed text-[#475467] max-w-[560px]">
                Full-length mocks for JEE, NEET, CUET and government exams — same sections, timer, palette and
                marking as the computer-based test. Every question has a worked solution.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-1">
                <Link href="#exams"
                  className="h-[50px] inline-flex items-center justify-center gap-2 px-6 rounded-lg bg-primary text-white text-base font-semibold hover:bg-primary-dark transition-colors">
                  Take a free mock test <ArrowRight className="w-[18px] h-[18px]" />
                </Link>
                <Link href="/exams"
                  className="h-[50px] hidden sm:inline-flex items-center justify-center px-6 rounded-lg border border-[#d0d5dd] text-base font-semibold hover:bg-paper transition-colors">
                  Browse all exams
                </Link>
              </div>
              <ul className="hidden md:flex flex-col gap-2.5 mt-2">
                {[
                  'Free tests to start — just your email and mobile number',
                  'Pay once per exam: every paid test unlocked, lifetime access',
                  'Section-wise score and a solution for every question',
                ].map(t => (
                  <li key={t} className="flex items-center gap-2.5 text-[15px] text-[#344054]">
                    <Check className="w-[18px] h-[18px] text-[#12803c] shrink-0" strokeWidth={2.4} />{t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0 bg-white md:border md:border-line md:rounded-xl md:p-6 md:shadow-[0_12px_32px_-12px_rgba(14,23,38,.14)] flex flex-col gap-2.5 md:gap-3">
              <div>
                <h2 className="text-[17px] md:text-lg font-semibold">What are you preparing for?</h2>
                <p className="hidden md:block text-sm text-[#667085] mt-1">Pick a stream to see its exams and tests.</p>
              </div>
              {STREAMS.map(s => {
                const Icon = STREAM_ICON[s.key];
                const list = byStream[s.key];
                return (
                  <Link key={s.key} href={s.key === 'gov' ? '/#govt-jobs' : `/?stream=${s.key}#exams`} scroll={s.key === 'gov'}
                    className="group flex items-center gap-3 md:gap-4 p-3.5 md:px-[18px] md:py-4 min-h-[64px] rounded-[10px] border border-line bg-white hover:border-primary/40 hover:bg-primary-tint/30 transition-colors">
                    <span className="w-[38px] h-[38px] md:w-11 md:h-11 rounded-[10px] bg-primary-tint text-primary-dark flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 md:w-[22px] md:h-[22px]" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-base md:text-[17px] font-semibold leading-tight">
                        {s.name} <span className="font-medium text-[#475467] text-sm md:text-[15px]">{s.key === 'gov' ? '' : s.sub}</span>
                      </span>
                      <span className="block text-[12.5px] md:text-[13.5px] text-[#667085] mt-1 truncate">
                        {list.length > 0
                          ? list.slice(0, 4).map(e => e.title).join(' · ')
                          : s.key === 'gov' ? s.sub : 'New tests coming soon'}
                      </span>
                    </span>
                    <ChevronRight className="w-[18px] h-[18px] text-[#98a2b3] group-hover:text-primary shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Exams by stream ──────────────────────────────────────────── */}
        <section id="exams" className="scroll-mt-16 max-w-[1328px] mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-14 flex flex-col gap-5 md:gap-6">
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col gap-2.5">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-primary-dark">Exams</p>
              <h2 className="text-2xl md:text-[34px] font-bold tracking-[-0.015em] leading-tight">Start with a full-length mock</h2>
            </div>
            <Link href="/exams" className="hidden sm:inline-flex items-center gap-1.5 font-semibold text-primary-dark hover:underline">
              All exams <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex gap-1 border-b border-line overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0" role="tablist">
            {STREAMS.map(s => (
              <Link key={s.key} href={`/?stream=${s.key}#exams`} scroll={false} role="tab" aria-selected={s.key === activeStream}
                className={`h-11 flex items-center px-4 text-[14.5px] font-semibold whitespace-nowrap border-b-[3px] transition-colors ${
                  s.key === activeStream ? 'text-primary-dark border-primary' : 'text-[#475467] border-transparent hover:text-ink'
                }`}>
                {s.name}
              </Link>
            ))}
          </div>

          {activeExams.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {activeExams.map(exam => <ExamCardLink key={exam.id} exam={exam} />)}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#d0d5dd] p-8 text-center text-[#475467]">
              {activeMeta.name} tests are being added. <Link href="/exams" className="font-semibold text-primary-dark hover:underline">Browse all exams</Link>
            </div>
          )}
        </section>

        {/* ── Government jobs ──────────────────────────────────────────── */}
        <section id="govt-jobs" className="scroll-mt-16 bg-paper">
          <div className="max-w-[1328px] mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-14 flex flex-col gap-6 md:gap-7">
            <div className="flex flex-col gap-2.5">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-primary-dark">
                Government Jobs · <span lang="hi">सरकारी नौकरी</span>
              </p>
              <h2 className="text-2xl md:text-[34px] font-bold tracking-[-0.015em] leading-tight">Mocks, notifications and daily current affairs</h2>
            </div>

            <div className="grid lg:grid-cols-[1fr_1.25fr_1fr] gap-4 md:gap-5 [&>*]:min-w-0">
              <div className="bg-white border border-line rounded-xl py-2">
                <p className="text-[15px] font-semibold px-5 py-3">Exams</p>
                {govExams.length > 0 ? govExams.map(e => (
                  <Link key={e.id} href={`/exam/${e.slug}`}
                    className="flex items-center gap-3 px-5 py-3 min-h-[56px] border-t border-[#eef0f3] hover:bg-paper transition-colors">
                    <span className="flex-1 min-w-0">
                      <span className="block font-semibold text-[15px] truncate">{e.title}</span>
                      {e.conductingBody && <span className="block text-[13px] text-[#667085] mt-0.5 truncate">{e.conductingBody}</span>}
                    </span>
                    <span className="h-[26px] inline-flex items-center px-2.5 rounded-full bg-[#f2f4f7] text-[#344054] text-[12.5px] font-medium whitespace-nowrap">
                      {e.testCount} tests
                    </span>
                  </Link>
                )) : (
                  <p className="px-5 py-4 border-t border-[#eef0f3] text-sm text-[#667085]">Government exam tests are being added.</p>
                )}
              </div>

              <div className="bg-white border border-line rounded-xl py-2">
                <p className="text-[15px] font-semibold px-5 py-3">Latest notifications</p>
                {notifications.length > 0 ? notifications.map(n => {
                  const type = NOTIFICATION_TYPE[n.notificationType] ?? NOTIFICATION_TYPE[1];
                  return (
                    <a key={n.id} href={n.sourceUrl} target="_blank" rel="noopener noreferrer"
                      className="flex flex-col gap-1.5 px-5 py-3 border-t border-[#eef0f3] hover:bg-paper transition-colors">
                      <span className="flex items-center gap-2">
                        <span className={`h-[22px] inline-flex items-center px-2 rounded-full text-[11.5px] font-medium ${type.className}`}>{type.label}</span>
                        <span className="text-[12.5px] text-[#667085] truncate">{n.examName} · {formatDay(n.publishedAt ?? n.createdAt)}</span>
                      </span>
                      <span className="text-[14.5px] leading-snug font-medium">{n.title}</span>
                    </a>
                  );
                }) : (
                  <p className="px-5 py-4 border-t border-[#eef0f3] text-sm text-[#667085]">
                    No new notifications right now. Check the official website of your exam for the latest updates.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-4 md:gap-5">
                {todaysStories.length > 0 && (
                  <div className="bg-white border border-line rounded-xl px-5 py-[18px] flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[15px] font-semibold">Current affairs · {new Date(latestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                      <Calendar className="w-[18px] h-[18px] text-[#667085]" />
                    </div>
                    {todaysStories.map(s => (
                      <Link key={s.slug} href={`/current-affairs/${s.slug}`} className="flex flex-col gap-0.5 pt-2.5 border-t border-[#eef0f3] group">
                        <span className="text-xs text-[#667085]">{s.category}</span>
                        <span className="text-[14.5px] leading-snug group-hover:text-primary-dark">{s.title}</span>
                      </Link>
                    ))}
                    <Link href="/current-affairs" className="text-sm font-semibold text-primary-dark hover:underline pt-1">All current affairs</Link>
                  </div>
                )}
                {govExams[0] && (
                  <Link href={`/exam/${govExams[0].slug}`}
                    className="rounded-xl bg-ink text-white px-5 py-[18px] flex items-center gap-3.5 hover:bg-ink-soft transition-colors">
                    <span className="flex-1 min-w-0">
                      <span className="block font-semibold text-[15px] truncate">{govExams[0].title}</span>
                      <span className="block text-[13px] text-ink-muted mt-0.5">{govExams[0].testCount} mock tests</span>
                    </span>
                    <span className="h-9 inline-flex items-center px-3.5 rounded-[7px] bg-primary text-sm font-semibold whitespace-nowrap">View tests</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── How the test screen works ────────────────────────────────── */}
        <section className="max-w-[1328px] mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-16 grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-16 items-center [&>*]:min-w-0">
          <div className="flex flex-col gap-4">
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-primary-dark">Before your first attempt</p>
            <h2 className="text-2xl md:text-[34px] font-bold tracking-[-0.015em] leading-tight">The palette you’ll see on exam day</h2>
            <p className="text-base md:text-[17px] leading-relaxed text-[#475467]">
              Our test screen follows the computer-based exam layout: section tabs, a countdown, and a question palette whose
              shapes tell you what you’ve answered, skipped or marked for review — so nothing on the real day is new.
            </p>
            <div className="mt-2"><StatusLegend /></div>
          </div>
          <div className="hidden md:block rounded-xl border border-line overflow-hidden shadow-[0_18px_40px_-18px_rgba(14,23,38,.25)]" aria-hidden>
            <div className="h-11 bg-ink text-white flex items-center justify-between px-4 text-[13.5px]">
              <span>Sample test · Physics</span><span className="font-mono font-semibold">01:42:18</span>
            </div>
            <div className="flex bg-white">
              <div className="flex-1 p-5 flex flex-col gap-3 border-r border-line">
                <div className="flex gap-4 text-[13px] font-semibold">
                  <span className="text-primary-dark border-b-2 border-primary pb-1.5">Physics</span>
                  <span className="text-[#667085]">Chemistry</span>
                  <span className="text-[#667085]">Mathematics</span>
                </div>
                <p className="text-[14.5px] leading-relaxed">
                  A particle moves along the <i>x</i>-axis with velocity <i>v</i> = (3<i>t</i>² − 12<i>t</i> + 9) m s⁻¹.
                  The distance travelled between <i>t</i> = 0 and <i>t</i> = 3 s is ____ m.
                </p>
                <div className="w-40 h-[38px] rounded-[7px] border-[1.5px] border-primary flex items-center px-3 font-mono">8</div>
              </div>
              <div className="w-[230px] p-4 bg-[#f9fafb] grid grid-cols-4 gap-2 justify-items-center">
                {samplePalette.map((s, i) => <StatusMark key={i} status={s} size={[40, 36]} current={i === 3}>{i + 1}</StatusMark>)}
              </div>
            </div>
          </div>
        </section>

        {/* ── Free resources ───────────────────────────────────────────── */}
        <section className="max-w-[1328px] mx-auto px-4 md:px-6 lg:px-8 pb-10 md:pb-16 flex flex-col gap-5">
          <div className="flex items-end justify-between">
            <h2 className="text-xl md:text-[28px] font-bold">Free resources</h2>
            <Link href="/blog" className="font-semibold text-primary-dark hover:underline text-[15px]">Blog &amp; guides</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {resources.map(({ title, sub, href, Icon }) => (
              <Link key={href} href={href}
                className="flex gap-3.5 items-start border border-line rounded-xl px-5 py-[18px] hover:border-primary/40 transition-colors">
                <span className="w-10 h-10 rounded-[9px] bg-[#f2f4f7] text-[#344054] flex items-center justify-center shrink-0"><Icon className="w-5 h-5" /></span>
                <span className="min-w-0">
                  <span className="block font-semibold text-[15px] leading-snug line-clamp-2">{title}</span>
                  <span className="block text-[13px] text-[#667085] mt-1">{sub}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section className="bg-paper">
          <div className="max-w-[880px] mx-auto px-4 md:px-6 py-10 md:py-14">
            <h2 className="text-xl md:text-[28px] font-bold mb-4">Frequently asked questions</h2>
            <div className="bg-white border border-line rounded-xl divide-y divide-line">
              {FAQS.map(f => (
                <details key={f.q} className="group px-5">
                  <summary className="min-h-[56px] flex items-center justify-between gap-3 font-semibold text-[15px] cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <ChevronRight className="w-4 h-4 text-[#667085] shrink-0 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="pb-4 text-[15px] leading-relaxed text-[#475467]">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
