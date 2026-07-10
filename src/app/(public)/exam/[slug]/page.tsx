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
  ChevronRight, BookOpen, Building2, Trophy,
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
          "@type": "CourseInstance",
          courseMode: "online",
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

        {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5">
            <nav className="flex items-center gap-1.5 text-xs text-gray-500 overflow-x-auto scrollbar-hide whitespace-nowrap"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}>
              <Link href="/" className="hover:text-orange-500 transition-colors shrink-0">Home</Link>
              <ChevronRight className="w-3 h-3 shrink-0" />
              <Link href="/exams" className="hover:text-orange-500 transition-colors shrink-0">Exams</Link>
              {exam.examLevelName && (<><ChevronRight className="w-3 h-3 shrink-0" /><span className="shrink-0">{exam.examLevelName}</span></>)}
              <ChevronRight className="w-3 h-3 shrink-0" />
              <span className="text-gray-800 font-medium shrink-0">{exam.title}</span>
            </nav>
          </div>
        </div>

        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <div style={{ background: 'linear-gradient(135deg,#1e293b,#0f172a)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex flex-col md:flex-row gap-5 md:gap-8 items-start md:items-center">

              {/* Title + meta */}
              <div className="flex-1 min-w-0 text-white">
                <div className="flex flex-wrap gap-2 mb-2.5">
                  {exam.examLevelName && (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full border border-orange-400/40 bg-orange-500/15 text-orange-300">
                      {exam.examLevelName}
                    </span>
                  )}
                  {exam.examTypeName && (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20 bg-white/10 text-white/80">
                      {exam.examTypeName}
                    </span>
                  )}
                  {sortedTests.some(t => t.isFree) && (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full border border-green-400/40 bg-green-500/15 text-green-300">
                      ✓ Free Test Available
                    </span>
                  )}
                </div>

                <h1 className="text-2xl md:text-3xl font-extrabold leading-tight mb-2">{exam.title}</h1>

                {exam.shortDescription && (
                  <p className="text-slate-400 text-sm max-w-2xl mb-3 leading-relaxed line-clamp-2">
                    {stripHtml(exam.shortDescription)}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-slate-400">
                  {displayConductingBody && (
                    <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 shrink-0" />{displayConductingBody}</span>
                  )}
                  <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 shrink-0" />{exam.testCount} Mock Test{exam.testCount !== 1 ? 's' : ''}</span>
                  {officialUrl && (
                    <a href={officialUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 hover:text-orange-400 transition-colors underline underline-offset-2">
                      <Globe className="w-3.5 h-3.5 shrink-0" />{officialName}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Key Facts Box (AEO optimization - direct answers for AI snippets) ───── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-6 mb-8 z-10 relative">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-4 sm:p-6" itemScope itemType="https://schema.org/ItemList">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2" itemProp="name">
              <span className="w-5 h-5 text-orange-500">⚡</span>
              Quick Facts
            </h3>
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-sm">
              {displayConductingBody && (
                <div className="flex flex-col gap-1">
                  <dt className="text-gray-400 text-xs uppercase tracking-wide">Conducting Body</dt>
                  <dd className="font-semibold text-gray-900" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <span itemProp="name">{displayConductingBody}</span>
                  </dd>
                </div>
              )}
              {exam.examLevelName && (
                <div className="flex flex-col gap-1">
                  <dt className="text-gray-400 text-xs uppercase tracking-wide">Exam Level</dt>
                  <dd className="font-semibold text-gray-900" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <span itemProp="name">{exam.examLevelName}</span>
                  </dd>
                </div>
              )}
              {exam.examTypeName && (
                <div className="flex flex-col gap-1">
                  <dt className="text-gray-400 text-xs uppercase tracking-wide">Category</dt>
                  <dd className="font-semibold text-gray-900" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <span itemProp="name">{exam.examTypeName}</span>
                  </dd>
                </div>
              )}
              {sortedTests.length > 0 && (
                <>
                  <div className="flex flex-col gap-1">
                    <dt className="text-gray-400 text-xs uppercase tracking-wide">Total Tests</dt>
                    <dd className="font-semibold text-gray-900" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                      <span itemProp="name">{exam.testCount}</span>
                    </dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="text-gray-400 text-xs uppercase tracking-wide">Free Tests</dt>
                    <dd className="font-semibold text-green-600" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                      <span itemProp="name">{sortedTests.filter(t => t.isFree).length}</span>
                    </dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="text-gray-400 text-xs uppercase tracking-wide">Duration</dt>
                    <dd className="font-semibold text-gray-900" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                      <span itemProp="name">{sortedTests[0]?.durationMinutes} min</span>
                    </dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="text-gray-400 text-xs uppercase tracking-wide">Questions</dt>
                    <dd className="font-semibold text-gray-900" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                      <span itemProp="name">{sortedTests[0]?.totalQuestions}</span>
                    </dd>
                  </div>
                </>
              )}
              {exam.priceInr !== undefined && (
                <div className="flex flex-col gap-1">
                  <dt className="text-gray-400 text-xs uppercase tracking-wide">Price</dt>
                  <dd className="font-semibold text-gray-900" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <span itemProp="name">{exam.priceInr === 0 ? 'Free' : `₹${exam.priceInr.toLocaleString('en-IN')}`}</span>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* ── Main content ───────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

          {/* ── Test Cards ─────────────────────────────────────────────── */}
          {sortedTests.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-orange-500" />
                Available Mock Tests
              </h2>
              <div className="space-y-3">
                {sortedTests.map(test => (
                  <div key={test.testId}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">

                    {/* Left content */}
                    <div className="flex-1 min-w-0">
                      {/* Badge + attempts row */}
                      <div className="flex items-center gap-2 mb-1.5">
                        {test.isFree ? (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-green-500 text-white uppercase tracking-wide">
                            FREE
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-500 text-white uppercase tracking-wide flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />PAID
                          </span>
                        )}
                        {test.attemptCount > 0 && (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {test.attemptCount.toLocaleString('en-IN')} Attempts
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <p className="text-base font-bold text-gray-900 mb-2">{test.title}</p>

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-orange-400" />
                          {test.totalQuestions} Questions
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-orange-400" />
                          {test.durationMinutes} Minutes
                        </span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="shrink-0 w-full sm:w-36">
                      {test.isFree ? (
                        <FreeTestButton
                          testId={test.testId}
                          isLoggedIn={!!session}
                          callbackUrl={`/exam/${exam.slug}`}
                          token={token}
                        />
                      ) : exam.priceInr > 0 ? (
                        hasAccess ? (
                          <FreeTestButton
                            testId={test.testId}
                            isLoggedIn={!!session}
                            callbackUrl={`/exam/${exam.slug}`}
                            token={token}
                          />
                        ) : (
                          <ExamBuyButton
                            examPageId={exam.id}
                            examTitle={exam.title}
                            examSlug={exam.slug}
                            priceInr={exam.priceInr}
                            hasAccess={hasAccess}
                            token={token}
                            offers={examOffers}
                          />
                        )
                      ) : (
                        <Link href={`/test/${exam.slug}`}
                          className="flex items-center justify-center gap-2 w-full text-sm font-semibold
                            bg-gray-50 text-gray-700 hover:bg-orange-500 hover:text-white
                            py-2.5 rounded-xl transition-all border border-gray-200 hover:border-orange-500">
                          View Details
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Exam info grid (highlights + key dates) ─────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              displayConductingBody && { icon: Building2, label: 'Conducting Body', value: displayConductingBody },
              exam.examLevelName  && { icon: Trophy,    label: 'Exam Level',      value: exam.examLevelName },
              exam.examTypeName   && { icon: Tag,       label: 'Category',        value: exam.examTypeName },
              exam.testCount > 0  && { icon: FileText,  label: 'Mock Tests',      value: `${exam.testCount} Tests` },
            ].filter(Boolean).map((item: any, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-orange-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{item.label}</p>
                  <p className="text-xs font-bold text-gray-800 truncate">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Tabs: Overview, Syllabus, etc. ──────────────────────────── */}
          {tabs.length > 0 ? (
            <ExamDetailTabs
              tabs={tabs}
              importantDates={effectiveDates}
              slug={exam.slug}
              defaultTab={searchParams?.tab}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-gray-400">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium">Detailed information coming soon.</p>
            </div>
          )}

          {/* ── Important Dates table (standalone) ──────────────────────── */}
          {effectiveDates.length > 0 && !tabs.some(t => t.id === 'dates') && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-100 bg-gray-50">
                <div className="w-6 h-6 rounded-md bg-orange-100 flex items-center justify-center shrink-0">
                  <Calendar className="w-3.5 h-3.5 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Key Dates</h3>
              </div>
              <ul className="divide-y divide-gray-100">
                {effectiveDates.map((d, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 px-5 py-3.5">
                    <span className="text-sm text-gray-600">{d.label}</span>
                    <span className="text-sm font-bold text-orange-600 whitespace-nowrap">{d.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Official links ───────────────────────────────────────────── */}
          {(officialUrl || exam.notificationUrl) && (
            <div className="flex flex-wrap gap-3">
              {officialUrl && (
                <a href={officialUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 bg-white
                    border border-orange-200 hover:border-orange-400 hover:bg-orange-50 px-4 py-2.5 rounded-xl transition-colors">
                  <Globe className="w-4 h-4" />{officialName}<ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {exam.notificationUrl && (
                <a href={exam.notificationUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white
                    border border-gray-200 hover:border-orange-400 hover:text-orange-600 px-4 py-2.5 rounded-xl transition-colors">
                  <Bell className="w-4 h-4" />Official Notification<ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* ── FAQ ────────────────────────────────────────────────────────── */}
        {faqs.length > 0 && <ExamFaqSection faqs={faqs} />}

        {/* ── Related Blog Posts ──────────────────────────────────────────── */}
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
            <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-1 h-5 rounded-full bg-orange-500" />
                  Related Articles
                </h2>
                <Link href="/blog" className="text-sm font-semibold text-[#1760f4] hover:text-[#0e4dd4] flex items-center gap-1">
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map(post => {
                  const catCls = CAT_COLORS[post.category] ?? 'bg-orange-100 text-orange-700';
                  const date = new Date(post.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
                  return (
                    <Link key={post.slug} href={`/blog/${post.slug}`}
                      className="group flex flex-col bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-200 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${catCls}`}>
                          <Tag className="w-2.5 h-2.5" />{post.category}
                        </span>
                        <span className="text-[11px] text-gray-400 ml-auto flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />{post.readingTimeMinutes} min
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-orange-600 transition-colors line-clamp-3 flex-1">
                        {post.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-2">{date}</p>
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
