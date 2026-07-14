// Force dynamic rendering so getServerSession always reads the live cookie
export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { ExamDetail, ExamFaq, ImportantDate } from '@/types/exam';
import ExamDetailTabs from '@/components/exam/ExamDetailTabs';
import FreeTestButton from '@/components/exam/FreeTestButton';
import ExamBuyButton from '@/components/exam/ExamBuyButton';
import ExamFaqSection from '@/components/exam/ExamFaqSection';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import {
  Globe, Bell, Clock, FileText, Calendar,
  ChevronRight, BookOpen, Building2,
  Tag, ExternalLink, Users, Lock,
} from 'lucide-react';
import { stripHtml } from '@/lib/utils';
import { getStaticFaqs } from '@/lib/static-faqs';
import { getStaticMeta, isHindi, buildExamDescription, buildExamTitle } from '@/lib/static-meta';
import { getAllPosts } from '@/lib/blog-posts';

interface PageProps { params: { slug: string }; searchParams?: { tab?: string } }

const CONDUCTING_BODY_URLS: [RegExp, { name: string; url: string }][] = [
  [/staff selection commission|^ssc$/i,            { name: 'Staff Selection Commission', url: 'https://ssc.gov.in' }],
  [/ibps/i,                                         { name: 'IBPS', url: 'https://www.ibps.in' }],
  [/state bank of india|^sbi$/i,                   { name: 'State Bank of India', url: 'https://sbi.co.in' }],
  [/railway recruitment board|^rrb/i,               { name: 'Railway Recruitment Board', url: 'https://indianrailways.gov.in' }],
  [/railway protection force|^rpf$/i,               { name: 'Railway Protection Force', url: 'https://indianrailways.gov.in' }],
  [/union public service commission|^upsc$/i,       { name: 'UPSC', url: 'https://upsc.gov.in' }],
  [/national testing agency|^nta$/i,                { name: 'National Testing Agency', url: 'https://nta.ac.in' }],
  [/central board of secondary education|^cbse$/i,  { name: 'CBSE', url: 'https://www.cbse.gov.in' }],
  [/defence|^nda$|^cds$|^afcat$/i,                 { name: 'Ministry of Defence', url: 'https://www.joinindianarmy.nic.in' }],
];

function getFallbackOfficial(conductingBody: string | null): { name: string; url: string } | null {
  if (!conductingBody) return null;
  for (const [pattern, info] of CONDUCTING_BODY_URLS) {
    if (pattern.test(conductingBody)) return info;
  }
  return null;
}

const SLUG_KEYWORDS: Record<string, string[]> = {
  "cuet-ug-2026-mock-paper": [
    "CUET mock test 2026", "CUET UG mock paper", "CUET practice test free",
    "CUET sample paper", "CUET online test",
  ],
  "cuet-mock-test-2026-ug-real-exam-practice": [
    "CUET mock test 2026", "CUET UG mock test", "CUET practice test online",
    "CUET sample paper 2026", "CUET exam preparation",
    "CUET online test series", "NTA CUET mock test", "CUET test practice",
  ],
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const exam = await api.get<ExamDetail>(`/api/exam-pages/${params.slug}`);
    if (!exam) return { title: "Exam Details" };

    const url = `https://www.gridacademy.in/exam/${params.slug}`;
    const override = getStaticMeta(params.slug);
    const hasFree = exam.tests?.some(t => t.isFree) ?? false;

    const rawDesc = stripHtml(exam.metaDescription ?? exam.shortDescription ?? '');
    const dbDescOk = !!rawDesc && !isHindi(rawDesc) && rawDesc.length <= 160;

    const title = (override?.title ?? exam.metaTitle ?? buildExamTitle(exam.title))
      .replace(/\s*\|\s*GridAcademy$/, '');
    const description = override?.description ?? (dbDescOk ? rawDesc : buildExamDescription(exam.title, hasFree));

    const ogImage = override?.image
      ? `https://www.gridacademy.in${override.image}`
      : exam.bannerUrl || exam.thumbnailUrl || "https://www.gridacademy.in/og-image.jpg";

    return {
      title,
      description,
      alternates: { canonical: url },
      ...((() => {
        const kw = exam.metaKeywords
          ? exam.metaKeywords.split(",").map(k => k.trim())
          : SLUG_KEYWORDS[params.slug];
        return kw ? { keywords: kw } : {};
      })()),
      openGraph: {
        title,
        description,
        url,
        siteName: "GridAcademy",
        images: [{ url: ogImage, width: 1200, height: 630 }],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
      },
    };
  } catch { return { title: "Exam Details" }; }
}

export default async function ExamDetailPage({ params, searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  const token   = (session?.user as any)?.accessToken as string | undefined;

  let exam: ExamDetail;
  try {
    const data = await api.get<ExamDetail>(`/api/exam-pages/${params.slug}`);
    if (!data) notFound();
    exam = data;
  } catch { notFound(); }

  let hasAccess = false;
  let examOffers: any[] = [];
  if (exam.priceInr > 0) {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
    if (session && token) {
      try {
        const r = await fetch(`${API_BASE}/api/exam-payment/access/${exam.id}`, {
          headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
        });
        if (r.ok) hasAccess = ((await r.json()).data ?? {})?.hasAccess === true;
      } catch { /* ignore */ }
    }
    try {
      const r = await fetch(`${API_BASE}/api/exam-payment/offers/${exam.id}`, { cache: 'no-store' });
      if (r.ok) examOffers = (await r.json()).data ?? [];
    } catch { /* ignore */ }
  }

  let importantDates: ImportantDate[] = [];
  if (exam.importantDates) { try { importantDates = JSON.parse(exam.importantDates); } catch { /* ignore */ } }

  const faqs: ExamFaq[] = getStaticFaqs(params.slug);
  const staticMeta = getStaticMeta(params.slug);
  const displayConductingBody = staticMeta?.conductingBody ?? exam.conductingBody;
  const effectiveDates = importantDates.length > 0 ? importantDates : (staticMeta?.importantDates ?? []);

  const tabs = [
    { id: 'overview',    label: 'Overview',        icon: 'BookOpen',  content: exam.overview ?? staticMeta?.overview ?? null },
    { id: 'eligibility', label: 'Eligibility',     icon: 'Users',     content: exam.eligibility },
    { id: 'syllabus',    label: 'Syllabus',         icon: 'FileText',  content: exam.syllabus },
    { id: 'pattern',     label: 'Exam Pattern',     icon: 'Trophy',    content: exam.examPattern },
    { id: 'dates',       label: 'Important Dates',  icon: 'Calendar',  content: null },
    { id: 'apply',       label: 'How To Apply',     icon: 'Bell',      content: exam.howToApply },
    { id: 'result',      label: 'Result & Cut-off', icon: 'Tag',       content: (exam.resultInfo ?? '') + (exam.cutOff ? `\n\n${exam.cutOff}` : '') },
  ].filter(t => t.id === 'dates' ? effectiveDates.length > 0 : !!t.content);

  const sortedTests = [...exam.tests].sort((a, b) => a.sortOrder - b.sortOrder);
  const fallbackOfficial = getFallbackOfficial(displayConductingBody ?? null);
  const officialUrl = exam.officialWebsite ?? fallbackOfficial?.url ?? null;
  const officialName = displayConductingBody ?? fallbackOfficial?.name ?? 'Official Website';

  const freeTestCount = sortedTests.filter(t => t.isFree).length;

  return (
    <>
      {/* ── JSON-LD Structured Data ──────────────────────────────────────── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": ["Course", "EducationalOccupationalProgram"],
        name: exam.title, description: stripHtml(exam.shortDescription || ""),
        url: `https://www.gridacademy.in/exam/${exam.slug}`,
        image: staticMeta?.image ? `https://www.gridacademy.in${staticMeta.image}` : (exam.bannerUrl || exam.thumbnailUrl || "https://www.gridacademy.in/og-image.jpg"),
        provider: { "@type": "Organization", name: "GridAcademy", url: "https://www.gridacademy.in" },
        offers: exam.priceInr === 0 ? {
          "@type": "Offer", price: "0", priceCurrency: "INR", availability: "https://schema.org/Free"
        } : {
          "@type": "Offer", price: exam.priceInr, priceCurrency: "INR", availability: "https://schema.org/InStock"
        },
        hasCourseInstance: {
          "@type": "CourseInstance", courseMode: "online",
          courseWorkload: `PT${exam.tests[0]?.durationMinutes || 60}M`
        },
        educationalLevel: exam.examLevelName,
        teaches: exam.examTypeName
      })}} />
      {faqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "FAQPage",
          mainEntity: faqs.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
        })}} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.gridacademy.in" },
          { "@type": "ListItem", position: 2, name: "Exams", item: "https://www.gridacademy.in/exams" },
          ...(exam.examLevelName ? [
            { "@type": "ListItem", position: 3, name: exam.examLevelName },
            { "@type": "ListItem", position: 4, name: exam.title, item: `https://www.gridacademy.in/exam/${exam.slug}` },
          ] : [
            { "@type": "ListItem", position: 3, name: exam.title, item: `https://www.gridacademy.in/exam/${exam.slug}` },
          ]),
        ],
      })}} />

      <div className="min-h-screen bg-gray-50">

        {/* ── Breadcrumb ───────────────────────────────────────────────── */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
            <nav className="flex items-center gap-1.5 text-xs text-gray-400 overflow-x-auto whitespace-nowrap"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}>
              <Link href="/" className="hover:text-[#1760f4] transition-colors shrink-0">Home</Link>
              <ChevronRight className="w-3 h-3 shrink-0 text-gray-300" />
              <Link href="/exams" className="hover:text-[#1760f4] transition-colors shrink-0">Exams</Link>
              {exam.examLevelName && (
                <><ChevronRight className="w-3 h-3 shrink-0 text-gray-300" />
                <span className="shrink-0 text-gray-500">{exam.examLevelName}</span></>
              )}
              <ChevronRight className="w-3 h-3 shrink-0 text-gray-300" />
              <span className="text-gray-700 font-semibold shrink-0 truncate max-w-xs">{exam.title}</span>
            </nav>
          </div>
        </div>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-[#1760f4] via-[#1250d0] to-[#0a3ba8] relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/5 rounded-full" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-white/5 rounded-full" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 relative z-10">
            <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">

              {/* Left: title + meta */}
              <div className="flex-1 min-w-0 text-white">
                <div className="flex flex-wrap gap-2 mb-3">
                  {exam.examLevelName && (
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/20 text-white border border-white/30">
                      {exam.examLevelName}
                    </span>
                  )}
                  {exam.examTypeName && (
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/10 text-blue-100 border border-white/20">
                      {exam.examTypeName}
                    </span>
                  )}
                  {freeTestCount > 0 && (
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/25 text-emerald-200 border border-emerald-400/30">
                      ✓ Free Test Available
                    </span>
                  )}
                </div>

                <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight mb-3 text-white">
                  {exam.title}
                </h1>

                {exam.shortDescription && (
                  <p className="text-blue-100 text-sm md:text-base max-w-2xl mb-5 leading-relaxed opacity-90 line-clamp-2">
                    {stripHtml(exam.shortDescription)}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-blue-200">
                  {displayConductingBody && (
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />{displayConductingBody}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 shrink-0" />{exam.testCount ?? sortedTests.length} Mock Test{(exam.testCount ?? sortedTests.length) !== 1 ? 's' : ''}
                  </span>
                  {sortedTests[0]?.durationMinutes && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 shrink-0" />{sortedTests[0].durationMinutes} min / test
                    </span>
                  )}
                  {officialUrl && (
                    <a href={officialUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 hover:text-white transition-colors underline underline-offset-2">
                      <Globe className="w-3.5 h-3.5 shrink-0" />Official Site
                    </a>
                  )}
                </div>
              </div>

              {/* Right: CTA card */}
              <div className="shrink-0 w-full lg:w-60 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
                <div className="text-center mb-4">
                  <p className="text-4xl font-extrabold text-white">
                    {exam.priceInr === 0 ? 'Free' : `₹${exam.priceInr.toLocaleString('en-IN')}`}
                  </p>
                  <p className="text-blue-200 text-xs mt-1">
                    {exam.priceInr === 0 ? 'No credit card required' : 'One-time access'}
                  </p>
                </div>
                {freeTestCount > 0 && (
                  <Link
                    href={session ? '/dashboard' : `/register?callbackUrl=/exam/${exam.slug}`}
                    className="block w-full text-center text-sm font-bold bg-white text-[#1760f4] py-2.5 rounded-xl hover:bg-blue-50 transition-colors mb-3 shadow-sm">
                    Start Free Test
                  </Link>
                )}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-white/10 rounded-xl py-2">
                    <p className="text-white font-extrabold text-lg leading-none">{exam.testCount ?? sortedTests.length}</p>
                    <p className="text-blue-200 text-[10px] font-medium mt-0.5">Tests</p>
                  </div>
                  <div className="bg-white/10 rounded-xl py-2">
                    <p className="text-white font-extrabold text-lg leading-none">{freeTestCount}</p>
                    <p className="text-blue-200 text-[10px] font-medium mt-0.5">Free</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Quick Facts strip ─────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-5 mb-8 z-10 relative" itemScope itemType="https://schema.org/ItemList">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#1760f4] to-[#0a3ba8]" />
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 rounded-full bg-[#1760f4]" />
                <h3 className="font-bold text-gray-800 text-sm" itemProp="name">Quick Facts</h3>
              </div>
              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  displayConductingBody && { emoji: '🏛️', label: 'Conducting Body', value: displayConductingBody, bg: 'bg-blue-50', val: 'text-gray-800' },
                  exam.examLevelName    && { emoji: '🎓', label: 'Exam Level',       value: exam.examLevelName,       bg: 'bg-indigo-50', val: 'text-gray-800' },
                  sortedTests.length > 0 && { emoji: '📋', label: 'Mock Tests',     value: `${exam.testCount ?? sortedTests.length} Tests`, bg: 'bg-sky-50', val: 'text-gray-800' },
                  sortedTests.length > 0 && { emoji: '⏱️', label: 'Duration',       value: `${sortedTests[0]?.durationMinutes} min`, bg: 'bg-cyan-50', val: 'text-gray-800' },
                  sortedTests.length > 0 && { emoji: '❓', label: 'Questions',      value: `${sortedTests[0]?.totalQuestions} Qs`,   bg: 'bg-blue-50', val: 'text-gray-800' },
                  { emoji: '💰', label: 'Price',      value: exam.priceInr === 0 ? 'FREE' : `₹${exam.priceInr.toLocaleString('en-IN')}`, bg: 'bg-emerald-50', val: exam.priceInr === 0 ? 'text-emerald-600' : 'text-gray-800' },
                  freeTestCount > 0      && { emoji: '🆓', label: 'Free Tests',     value: `${freeTestCount} Available`, bg: 'bg-green-50', val: 'text-green-700' },
                  exam.examTypeName      && { emoji: '🏷️', label: 'Category',       value: exam.examTypeName,           bg: 'bg-violet-50', val: 'text-gray-800' },
                ].filter(Boolean).slice(0, 4).map((item: any, i) => (
                  <div key={i} className={`${item.bg} rounded-xl p-3.5`} itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <span className="text-xl leading-none block mb-2">{item.emoji}</span>
                    <dt className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">{item.label}</dt>
                    <dd className={`text-sm font-extrabold ${item.val} leading-tight`} itemProp="name">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* ── Main content ─────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 space-y-6">

          {/* ── Test Cards ────────────────────────────────────────────── */}
          {sortedTests.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-[#1760f4]" />
                Available Mock Tests
              </h2>
              <div className="space-y-3">
                {sortedTests.map(test => (
                  <div key={test.testId}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        {test.isFree ? (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500 text-white uppercase tracking-wide">
                            FREE
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#1760f4] text-white uppercase tracking-wide flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />PAID
                          </span>
                        )}
                        {test.attemptCount > 0 && (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Users className="w-3 h-3" />{test.attemptCount.toLocaleString('en-IN')} Attempts
                          </span>
                        )}
                      </div>
                      <p className="text-base font-bold text-gray-900 mb-2">{test.title}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-[#1760f4]" />{test.totalQuestions} Questions
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#1760f4]" />{test.durationMinutes} Minutes
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 w-full sm:w-36">
                      {test.isFree ? (
                        <FreeTestButton testId={test.testId} isLoggedIn={!!session} callbackUrl={`/exam/${exam.slug}`} token={token} />
                      ) : exam.priceInr > 0 ? (
                        hasAccess ? (
                          <FreeTestButton testId={test.testId} isLoggedIn={!!session} callbackUrl={`/exam/${exam.slug}`} token={token} />
                        ) : (
                          <ExamBuyButton examPageId={exam.id} examTitle={exam.title} examSlug={exam.slug} priceInr={exam.priceInr} hasAccess={hasAccess} token={token} offers={examOffers} />
                        )
                      ) : (
                        <Link href={`/test/${exam.slug}`}
                          className="flex items-center justify-center gap-2 w-full text-sm font-bold bg-[#1760f4] text-white py-2.5 rounded-xl hover:bg-[#0e4dd4] transition-colors shadow-sm">
                          Start Test
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Tabs ─────────────────────────────────────────────────── */}
          {tabs.length > 0 ? (
            <ExamDetailTabs tabs={tabs} importantDates={effectiveDates} slug={exam.slug} defaultTab={searchParams?.tab} />
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium">Detailed information coming soon.</p>
            </div>
          )}

          {/* ── Important Dates standalone ───────────────────────────── */}
          {effectiveDates.length > 0 && !tabs.some(t => t.id === 'dates') && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-blue-50/60">
                <Calendar className="w-4 h-4 text-[#1760f4]" />
                <h3 className="font-bold text-gray-800 text-sm">Key Dates</h3>
              </div>
              <ul className="divide-y divide-gray-50">
                {effectiveDates.map((d, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-blue-50/40 transition-colors">
                    <span className="text-sm text-gray-600">{d.label}</span>
                    <span className="text-sm font-bold text-[#1760f4] whitespace-nowrap">{d.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Official links ───────────────────────────────────────── */}
          {(officialUrl || exam.notificationUrl) && (
            <div className="flex flex-wrap gap-3">
              {officialUrl && (
                <a href={officialUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#1760f4] bg-white border border-blue-200 hover:border-[#1760f4] hover:bg-blue-50 px-4 py-2.5 rounded-xl transition-colors">
                  <Globe className="w-4 h-4" />{officialName}<ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {exam.notificationUrl && (
                <a href={exam.notificationUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:border-[#1760f4] hover:text-[#1760f4] px-4 py-2.5 rounded-xl transition-colors">
                  <Bell className="w-4 h-4" />Official Notification<ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        {faqs.length > 0 && <ExamFaqSection faqs={faqs} />}

        {/* ── Related Blog Posts ────────────────────────────────────────── */}
        {(() => {
          const EXAM_TO_CATEGORY: Record<string, string> = {
            SSC: 'SSC', Banking: 'Banking', Railway: 'Railway',
            NEET: 'NEET', CUET: 'CUET', UPSC: 'UPSC',
          };
          const blogCategory = exam.examTypeName
            ? Object.entries(EXAM_TO_CATEGORY).find(([k]) =>
                exam.examTypeName!.toLowerCase().includes(k.toLowerCase())
              )?.[1]
            : null;
          const related = getAllPosts()
            .filter(p => blogCategory ? p.category === blogCategory : true)
            .slice(0, 3);
          if (related.length === 0) return null;

          const CAT_COLORS: Record<string, string> = {
            SSC: 'bg-blue-100 text-blue-700', CUET: 'bg-violet-100 text-violet-700',
            Railway: 'bg-green-100 text-green-700', NEET: 'bg-red-100 text-red-700',
            Banking: 'bg-amber-100 text-amber-700', UPSC: 'bg-slate-100 text-slate-700',
          };

          return (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-1 h-5 rounded-full bg-[#1760f4]" />
                  Related Articles
                </h2>
                <Link href="/blog" className="text-sm font-semibold text-[#1760f4] hover:text-[#0e4dd4] flex items-center gap-1">
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map(post => {
                  const catCls = CAT_COLORS[post.category] ?? 'bg-blue-100 text-blue-700';
                  const date = new Date(post.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
                  return (
                    <Link key={post.slug} href={`/blog/${post.slug}`}
                      className="group flex flex-col bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md hover:shadow-blue-50 transition-all duration-200 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${catCls}`}>
                          <Tag className="w-2.5 h-2.5" />{post.category}
                        </span>
                        <span className="text-[11px] text-gray-400 ml-auto flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />{post.readingTimeMinutes} min
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-[#1760f4] transition-colors line-clamp-3 flex-1">
                        {post.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-2">{date}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })()}

      </div>
    </>
  );
}
