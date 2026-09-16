// Force dynamic rendering so getServerSession always reads the live cookie
export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, ChevronRight, FileText, Globe } from 'lucide-react';
import { api } from '@/lib/api-client';
import { ExamDetail, ExamFaq } from '@/types/exam';
import ExamDetailTabs from '@/components/exam/ExamDetailTabs';
import ExamBuyButton from '@/components/exam/ExamBuyButton';
import ExamFaqSection from '@/components/exam/ExamFaqSection';
import ExamTestList from '@/components/exam/ExamTestList';
import FreeTestButton from '@/components/exam/FreeTestButton';
import { stripHtml } from '@/lib/utils';
import { getStaticFaqs } from '@/lib/static-faqs';
import { getStaticMeta, isHindi, buildExamDescription, buildExamTitle } from '@/lib/static-meta';
import { getAllPosts } from '@/lib/blog-posts';
import { getExamPageData } from '@/lib/exam-page-data';

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

const PREVIEW_TESTS = 5;

export default async function ExamDetailPage({ params, searchParams }: PageProps) {
  const {
    exam, session, token, hasAccess, offers, tests, freeCount, paidCount,
    showUnlock, importantDates, conductingBody, totalAttempts,
  } = await getExamPageData(params.slug);

  const staticMeta = getStaticMeta(params.slug);
  const faqs: ExamFaq[] = getStaticFaqs(params.slug);
  const fallbackOfficial = getFallbackOfficial(conductingBody ?? null);
  const officialUrl = exam.officialWebsite ?? fallbackOfficial?.url ?? null;
  const callbackUrl = `/exam/${exam.slug}`;
  const firstStartable = tests.find(t => t.isFree || hasAccess || exam.priceInr <= 0) ?? null;

  const tabs = [
    { id: 'overview',    label: 'Overview',         icon: 'BookOpen', content: exam.overview ?? staticMeta?.overview ?? null },
    { id: 'pattern',     label: 'Exam pattern',     icon: 'Trophy',   content: exam.examPattern },
    { id: 'syllabus',    label: 'Syllabus',         icon: 'FileText', content: exam.syllabus },
    { id: 'eligibility', label: 'Eligibility',      icon: 'Users',    content: exam.eligibility },
    { id: 'dates',       label: 'Important dates',  icon: 'Calendar', content: null },
    { id: 'admit',       label: 'Admit card',       icon: 'FileText', content: exam.admitCard },
    { id: 'result',      label: 'Result & cut-off', icon: 'Tag',      content: [exam.resultInfo, exam.cutOff].filter(Boolean).join('\n\n') || null },
    { id: 'apply',       label: 'How to apply',     icon: 'Bell',     content: exam.howToApply },
  ].filter(t => t.id === 'dates' ? importantDates.length > 0 : !!t.content);

  const breadcrumbCategory = exam.examCategoryName ?? exam.examLevelName;
  const related = (() => {
    const cats = ['SSC', 'Banking', 'Railway', 'NEET', 'CUET', 'UPSC'];
    const hay = `${exam.examTypeName ?? ''} ${exam.title}`.toLowerCase();
    const cat = cats.find(c => hay.includes(c.toLowerCase()));
    return getAllPosts().filter(p => (cat ? p.category === cat : true)).slice(0, 3);
  })();

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
          courseWorkload: `PT${tests[0]?.durationMinutes || 60}M`
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

      <div className="bg-white text-ink">
        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <section className="bg-paper border-b border-line">
          <div className="max-w-[1328px] mx-auto px-4 md:px-6 lg:px-8 pt-5 md:pt-7 pb-6 md:pb-9 grid lg:grid-cols-[1fr_420px] gap-6 lg:gap-12">
            <div className="flex flex-col gap-4 min-w-0">
              <nav className="flex items-center gap-1.5 text-[13.5px] text-[#667085] overflow-x-auto whitespace-nowrap scrollbar-hide" aria-label="Breadcrumb">
                <Link href="/exams" className="hover:text-primary-dark">Exams</Link>
                {breadcrumbCategory && <><ChevronRight className="w-3.5 h-3.5 shrink-0" /><span>{breadcrumbCategory}</span></>}
                {exam.examSubCategoryName && <><ChevronRight className="w-3.5 h-3.5 shrink-0" /><span>{exam.examSubCategoryName}</span></>}
              </nav>
              <div className="flex gap-2 flex-wrap">
                {exam.examLevelName && <span className="h-[26px] inline-flex items-center px-2.5 rounded-full bg-primary-tint text-primary-dark text-[12.5px] font-medium">{exam.examLevelName}</span>}
                {exam.examTypeName && <span className="h-[26px] inline-flex items-center px-2.5 rounded-full bg-[#f2f4f7] text-[#344054] text-[12.5px] font-medium">{exam.examTypeName}</span>}
                {conductingBody && <span className="h-[26px] inline-flex items-center px-2.5 rounded-full bg-[#f2f4f7] text-[#344054] text-[12.5px] font-medium">{conductingBody}</span>}
              </div>
              <h1 className="exam-hero-title text-[28px] leading-[1.15] md:text-[42px] md:leading-[1.1] font-bold tracking-[-0.02em]">{exam.title}</h1>
              {exam.shortDescription && (
                <p className="text-base md:text-[17.5px] leading-relaxed text-[#475467] max-w-[720px]">{stripHtml(exam.shortDescription)}</p>
              )}
              <dl className="flex gap-6 md:gap-7 mt-1 key-facts">
                <div><dd className="font-mono font-semibold text-xl md:text-[22px]">{tests.length}</dd><dt className="text-sm text-[#667085]">mock tests</dt></div>
                {freeCount > 0 && <div><dd className="font-mono font-semibold text-xl md:text-[22px]">{freeCount}</dd><dt className="text-sm text-[#667085]">free</dt></div>}
                {totalAttempts > 0 && <div><dd className="font-mono font-semibold text-xl md:text-[22px]">{totalAttempts.toLocaleString('en-IN')}</dd><dt className="text-sm text-[#667085]">attempts so far</dt></div>}
              </dl>
              {(officialUrl || exam.notificationUrl) && (
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-[14.5px]">
                  {officialUrl && (
                    <a href={officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-primary-dark hover:underline min-h-[32px]">
                      <Globe className="w-4 h-4" /> Official website
                    </a>
                  )}
                  {exam.notificationUrl && (
                    <a href={exam.notificationUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-primary-dark hover:underline min-h-[32px]">
                      <FileText className="w-4 h-4" /> Official notification
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* ── Purchase / start card ──────────────────────────────────── */}
            <aside id="unlock" className={`scroll-mt-20 relative z-10 ${showUnlock ? 'lg:-mb-40' : ''}`}>
              <div className="bg-white border border-line rounded-xl p-5 md:p-[22px] flex flex-col gap-3.5 shadow-[0_12px_32px_-14px_rgba(14,23,38,.18)]">
                {showUnlock ? (
                  <>
                    {freeCount > 0 && (
                      <span className="self-start h-[26px] inline-flex items-center px-2.5 rounded-full bg-[#e7f6ec] text-[#0b6b31] text-[12.5px] font-medium">
                        {freeCount} free test{freeCount === 1 ? '' : 's'} — no payment
                      </span>
                    )}
                    <div>
                      <p className="text-[13.5px] text-[#667085]">All {paidCount} paid test{paidCount === 1 ? '' : 's'}</p>
                      <p className="text-[34px] font-bold leading-tight mt-0.5">
                        ₹{exam.priceInr.toLocaleString('en-IN')} <span className="text-[15px] font-medium text-[#475467]">one-time</span>
                      </p>
                    </div>
                    <ExamBuyButton
                      examPageId={exam.id} examTitle={exam.title} examSlug={exam.slug}
                      priceInr={exam.priceInr} paidTestCount={paidCount} token={token} offers={offers}
                    />
                  </>
                ) : (
                  <>
                    <p className="flex items-center gap-2 text-[15px] font-semibold text-[#0b6b31]">
                      <Check className="w-[18px] h-[18px]" strokeWidth={2.4} />
                      {exam.priceInr > 0 && hasAccess
                        ? 'You own this exam · lifetime access'
                        : `All ${tests.length} test${tests.length === 1 ? '' : 's'} are free`}
                    </p>
                    <p className="text-sm text-[#475467]">Every test in this exam is open to you. Start with the first one or pick from the list.</p>
                    {firstStartable && (
                      <FreeTestButton
                        testId={firstStartable.testId} isLoggedIn={!!session} token={token} callbackUrl={callbackUrl}
                        testTitle={firstStartable.title} variant="primary" size="lg"
                        label={firstStartable.isFree ? 'Take Free Test' : 'Start Test'}
                      />
                    )}
                  </>
                )}
              </div>
            </aside>
          </div>
        </section>

        {/* ── Body ───────────────────────────────────────────────────────── */}
        <div className="max-w-[1328px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-10 grid lg:grid-cols-[1fr_420px] gap-10 lg:gap-12">
          <div className="flex flex-col gap-10 min-w-0">
            {tests.length > 0 && (
              <section id="tests" className="flex flex-col gap-3.5 scroll-mt-20">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl md:text-2xl font-semibold">Mock tests</h2>
                  {tests.length > PREVIEW_TESTS && (
                    <Link href={`/exam/${exam.slug}/tests`} className="inline-flex items-center gap-1 font-semibold text-[14.5px] text-primary-dark hover:underline">
                      See all {tests.length} tests <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
                <ExamTestList
                  tests={tests.slice(0, PREVIEW_TESTS)} examPrice={exam.priceInr} hasAccess={hasAccess}
                  isLoggedIn={!!session} token={token} callbackUrl={callbackUrl}
                />
              </section>
            )}

            {tabs.length > 0 && (
              <section className="flex flex-col gap-3.5">
                <h2 className="text-xl md:text-2xl font-semibold">About the exam</h2>
                <ExamDetailTabs tabs={tabs} importantDates={importantDates} slug={exam.slug} defaultTab={searchParams?.tab} />
              </section>
            )}

            {faqs.length > 0 && <ExamFaqSection faqs={faqs} />}
          </div>

          {/* Clears the purchase card, which overlaps down from the hero on desktop */}
          <aside className={`flex flex-col gap-5 ${showUnlock ? 'lg:pt-40' : ''}`}>
            {importantDates.length > 0 && (
              <div className="border border-line rounded-xl p-5">
                <p className="text-base font-semibold mb-3">Important dates</p>
                <ol>
                  {importantDates.map((d, i) => (
                    <li key={i} className="flex gap-3.5">
                      <span className="flex flex-col items-center w-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary mt-[6px]" />
                        {i < importantDates.length - 1 && <span className="w-0.5 flex-1 bg-line" />}
                      </span>
                      <span className="pb-3.5">
                        <span className="block text-[14.5px] font-medium">{d.label}</span>
                        <span className="block font-mono text-[13px] text-[#667085] mt-0.5">{d.date}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="border border-line rounded-xl p-5 flex flex-col gap-2.5">
              <p className="text-base font-semibold">Exam at a glance</p>
              {[
                ['Conducting body', conductingBody],
                ['Level', exam.examLevelName],
                ['Type', exam.examTypeName],
                ['Category', [exam.examCategoryName, exam.examSubCategoryName].filter(Boolean).join(' · ') || null],
              ].filter(([, v]) => !!v).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 text-sm pt-2 border-t border-[#eef0f3]">
                  <span className="text-[#667085]">{k}</span><span className="text-right">{v}</span>
                </div>
              ))}
            </div>

            {related.length > 0 && (
              <div className="border border-line rounded-xl p-5 flex flex-col gap-1">
                <p className="text-base font-semibold mb-1">Related articles</p>
                {related.map(post => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="group py-2.5 border-t border-[#eef0f3]">
                    <span className="block text-[14.5px] leading-snug group-hover:text-primary-dark">{post.title}</span>
                    <span className="block text-[12.5px] text-[#667085] mt-1">{post.readingTimeMinutes} min read</span>
                  </Link>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
