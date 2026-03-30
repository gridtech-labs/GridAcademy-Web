// Force dynamic rendering so getServerSession always reads the live cookie
export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { ExamDetail, ImportantDate } from '@/types/exam';
import ExamDetailTabs from '@/components/exam/ExamDetailTabs';
import FreeTestButton from '@/components/exam/FreeTestButton';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import {
  Globe, Bell, Clock, FileText, Calendar,
  ChevronRight, BookOpen, Building2, Trophy,
  Tag, ExternalLink, Users,
} from 'lucide-react';

interface PageProps { params: { slug: string } }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const exam = await api.get<ExamDetail>(`/api/exams/${params.slug}`);
    if (!exam) return { title: 'Exam Details' };
    return {
      title: exam.metaTitle ?? exam.title,
      description: exam.metaDescription ?? exam.shortDescription ?? undefined,
      openGraph: exam.bannerUrl ? { images: [{ url: exam.bannerUrl }] } : undefined,
    };
  } catch { return { title: 'Exam Details' }; }
}

export default async function ExamDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  const token   = (session?.user as any)?.accessToken as string | undefined;

  let exam: ExamDetail;
  try {
    const data = await api.get<ExamDetail>(`/api/exams/${params.slug}`);
    if (!data) notFound();
    exam = data;
  } catch { notFound(); }

  let importantDates: ImportantDate[] = [];
  if (exam.importantDates) {
    try { importantDates = JSON.parse(exam.importantDates); } catch { /* ignore */ }
  }

  const tabs = [
    { id: 'overview',    label: 'Overview',        icon: 'BookOpen',  content: exam.overview },
    { id: 'eligibility', label: 'Eligibility',     icon: 'Users',     content: exam.eligibility },
    { id: 'syllabus',    label: 'Syllabus',         icon: 'FileText',  content: exam.syllabus },
    { id: 'pattern',     label: 'Exam Pattern',     icon: 'Trophy',    content: exam.examPattern },
    { id: 'dates',       label: 'Important Dates',  icon: 'Calendar',  content: null },
    { id: 'apply',       label: 'How To Apply',     icon: 'Bell',      content: exam.howToApply },
    { id: 'result',      label: 'Result & Cut-off', icon: 'Tag',       content: (exam.resultInfo ?? '') + (exam.cutOff ? `\n\n${exam.cutOff}` : '') },
  ].filter(t => t.id === 'dates' ? importantDates.length > 0 : !!t.content);

  const freeTest = exam.tests.find(t => t.isFree);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Breadcrumb ─────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/exams" className="hover:text-indigo-600 transition-colors">Exams</Link>
            {exam.examLevelName && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-500">{exam.examLevelName}</span>
              </>
            )}
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-800 font-medium truncate max-w-[200px]">{exam.title}</span>
          </nav>
        </div>
      </div>

      {/* ── Hero ───────────────────────────────────────────────────────────────── */}

      {/* Banner strip — fixed height so Next.js Image fill works correctly */}
      <div className="relative w-full h-48 md:h-64 overflow-hidden bg-indigo-900">
        {exam.bannerUrl && (
          <Image
            src={exam.bannerUrl}
            alt={exam.title}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        )}
        {/* Bottom fade so the info section blends in smoothly */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/30 to-indigo-900/80" />
      </div>

      {/* Info section — always solid, sits below the banner */}
      <div className="bg-gradient-to-br from-indigo-800 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center">

            {/* Thumbnail / Logo */}
            <div className="shrink-0 -mt-14 md:-mt-16">
              {exam.thumbnailUrl ? (
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden
                  border-4 border-white/30 shadow-2xl bg-white">
                  <Image src={exam.thumbnailUrl} alt={exam.title}
                    width={96} height={96} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-white/15
                  border-4 border-white/20 flex items-center justify-center shadow-xl">
                  <BookOpen className="w-9 h-9 text-white/70" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                {exam.examLevelName && (
                  <span className="bg-yellow-400/20 text-yellow-200 border border-yellow-400/30
                    text-xs font-semibold px-3 py-1 rounded-full">
                    {exam.examLevelName}
                  </span>
                )}
                {exam.examTypeName && (
                  <span className="bg-white/15 text-white border border-white/20
                    text-xs font-semibold px-3 py-1 rounded-full">
                    {exam.examTypeName}
                  </span>
                )}
                {freeTest && (
                  <span className="bg-green-500/20 text-green-300 border border-green-400/30
                    text-xs font-semibold px-3 py-1 rounded-full">
                    Free Test Available
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold leading-tight mb-2">
                {exam.title}
              </h1>

              {exam.shortDescription && (
                <p className="text-indigo-200 text-sm md:text-base max-w-2xl mb-4 leading-relaxed">
                  {exam.shortDescription}
                </p>
              )}

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-indigo-200">
                {exam.conductingBody && (
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 shrink-0" />
                    {exam.conductingBody}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 shrink-0" />
                  {exam.testCount} Mock Test{exam.testCount !== 1 ? 's' : ''} Available
                </span>
                {exam.officialWebsite && (
                  <a href={exam.officialWebsite} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-white transition-colors underline underline-offset-2">
                    <Globe className="w-4 h-4 shrink-0" />
                    Official Website
                  </a>
                )}
                {exam.notificationUrl && (
                  <a href={exam.notificationUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-white transition-colors underline underline-offset-2">
                    <Bell className="w-4 h-4 shrink-0" />
                    Official Notification
                  </a>
                )}
              </div>
            </div>

            {/* CTA — free test button in hero */}
            {freeTest && (
              <div className="shrink-0 w-full md:w-auto">
                <FreeTestButton
                  testId={freeTest.testId}
                  isLoggedIn={!!session}
                  callbackUrl={`/exam/${exam.slug}`}
                  token={token}
                  variant="hero"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Content ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Left: Tabs */}
          <div className="flex-1 min-w-0">
            {tabs.length > 0 ? (
              <ExamDetailTabs tabs={tabs} importantDates={importantDates} />
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-gray-400">
                <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">Detailed information coming soon.</p>
              </div>
            )}
          </div>

          {/* Right: Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 space-y-5 lg:sticky lg:top-20">

            {/* Tests card — primary action */}
            {exam.tests.length > 0 && (
              <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3">
                  <h3 className="text-white font-bold text-sm uppercase tracking-wide">
                    Available Tests
                  </h3>
                </div>
                <ul className="divide-y divide-gray-100 px-4 py-2">
                  {exam.tests
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map(test => (
                      <li key={test.testId} className="py-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-sm font-semibold text-gray-900 leading-snug flex-1">
                            {test.title}
                          </p>
                          {test.isFree && (
                            <span className="shrink-0 bg-green-100 text-green-700 text-[10px] font-bold
                              px-2 py-0.5 rounded-full uppercase tracking-wide">
                              FREE
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {test.durationMinutes} min
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {test.totalQuestions} Questions
                          </span>
                        </div>
                        {test.isFree ? (
                          <FreeTestButton
                            testId={test.testId}
                            isLoggedIn={!!session}
                            callbackUrl={`/exam/${exam.slug}`}
                            token={token}
                          />
                        ) : (
                          <Link href={`/test/${exam.slug}`}
                            className="flex items-center justify-center gap-2 w-full text-sm font-semibold
                              bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white
                              py-2.5 rounded-xl transition-colors border border-indigo-200 hover:border-indigo-600">
                            View Test Details
                          </Link>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Quick Info */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Exam Highlights</h3>
              </div>
              <ul className="divide-y divide-gray-100">
                {[
                  exam.conductingBody && { icon: Building2,  label: 'Conducting Body',  value: exam.conductingBody },
                  exam.examLevelName  && { icon: Trophy,     label: 'Exam Level',        value: exam.examLevelName },
                  exam.examTypeName   && { icon: Tag,        label: 'Category',          value: exam.examTypeName },
                  exam.testCount > 0  && { icon: FileText,   label: 'Total Mock Tests',  value: `${exam.testCount} Tests` },
                ].filter(Boolean).map((item: any, i) => (
                  <li key={i} className="flex items-center gap-3 px-5 py-3">
                    <item.icon className="w-4 h-4 text-indigo-500 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs text-gray-400 block">{item.label}</span>
                      <span className="text-sm font-semibold text-gray-800 truncate block">{item.value}</span>
                    </div>
                  </li>
                ))}
                {exam.officialWebsite && (
                  <li className="flex items-center gap-3 px-5 py-3">
                    <Globe className="w-4 h-4 text-indigo-500 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs text-gray-400 block">Official Website</span>
                      <a href={exam.officialWebsite} target="_blank" rel="noopener noreferrer"
                        className="text-sm font-semibold text-indigo-600 hover:underline flex items-center gap-1">
                        {new URL(exam.officialWebsite).hostname}
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  </li>
                )}
                {exam.notificationUrl && (
                  <li className="flex items-center gap-3 px-5 py-3">
                    <Bell className="w-4 h-4 text-indigo-500 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs text-gray-400 block">Notification</span>
                      <a href={exam.notificationUrl} target="_blank" rel="noopener noreferrer"
                        className="text-sm font-semibold text-indigo-600 hover:underline flex items-center gap-1">
                        Download PDF
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            {/* Key Dates */}
            {importantDates.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Key Dates</h3>
                </div>
                <ul className="divide-y divide-gray-100">
                  {importantDates.slice(0, 6).map((d, i) => (
                    <li key={i} className="flex items-center justify-between gap-3 px-5 py-3">
                      <span className="text-sm text-gray-600 leading-snug">{d.label}</span>
                      <span className="text-sm font-bold text-indigo-700 whitespace-nowrap">{d.date}</span>
                    </li>
                  ))}
                  {importantDates.length > 6 && (
                    <li className="px-5 py-3">
                      <button
                        className="text-xs text-indigo-600 font-semibold hover:underline w-full text-left">
                        +{importantDates.length - 6} more dates
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            )}

          </aside>
        </div>
      </div>
    </div>
  );
}
