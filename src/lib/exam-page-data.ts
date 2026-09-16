import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { api } from '@/lib/api-client';
import { ExamDetail, ExamTest, ImportantDate } from '@/types/exam';
import { getStaticMeta } from '@/lib/static-meta';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export interface ExamOffer {
  id: number;
  code: string;
  title: string;
  description?: string;
  offerType: number; // 0=Percentage, 1=Fixed, 2=FreeAccess
  value: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
}

export interface ExamPageData {
  exam: ExamDetail;
  session: Awaited<ReturnType<typeof getServerSession>>;
  token?: string;
  hasAccess: boolean;
  offers: ExamOffer[];
  tests: ExamTest[];
  freeCount: number;
  paidCount: number;
  /** Exam-level purchase is offered only while the student doesn't own a priced exam with paid tests. */
  showUnlock: boolean;
  importantDates: ImportantDate[];
  conductingBody: string | null;
  totalAttempts: number;
}

/** Shared loader for /exam/[slug] and /exam/[slug]/tests. */
export async function getExamPageData(slug: string): Promise<ExamPageData> {
  const session = await getServerSession(authOptions);
  const token = (session?.user as any)?.accessToken as string | undefined;

  let exam: ExamDetail;
  try {
    const data = await api.get<ExamDetail>(`/api/exam-pages/${slug}`);
    if (!data) notFound();
    exam = data;
  } catch {
    notFound();
  }

  let hasAccess = false;
  let offers: ExamOffer[] = [];
  if (exam.priceInr > 0) {
    if (session && token) {
      try {
        const r = await fetch(`${API_BASE}/api/exam-payment/access/${exam.id}`, {
          headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
        });
        if (r.ok) hasAccess = ((await r.json()).data ?? {})?.hasAccess === true;
      } catch { /* treat as no access */ }
    }
    try {
      const r = await fetch(`${API_BASE}/api/exam-payment/offers/${exam.id}`, { cache: 'no-store' });
      if (r.ok) offers = (await r.json()).data ?? [];
    } catch { /* no offers */ }
  }

  let importantDates: ImportantDate[] = [];
  if (exam.importantDates) {
    try { importantDates = JSON.parse(exam.importantDates); } catch { /* ignore malformed JSON */ }
  }
  const staticMeta = getStaticMeta(slug);
  if (importantDates.length === 0) importantDates = staticMeta?.importantDates ?? [];

  const tests = [...exam.tests].sort((a, b) => a.sortOrder - b.sortOrder);
  const freeCount = tests.filter(t => t.isFree).length;
  const paidCount = tests.length - freeCount;

  return {
    exam,
    session,
    token,
    hasAccess,
    offers,
    tests,
    freeCount,
    paidCount,
    showUnlock: exam.priceInr > 0 && paidCount > 0 && !hasAccess,
    importantDates,
    conductingBody: staticMeta?.conductingBody ?? exam.conductingBody,
    totalAttempts: tests.reduce((n, t) => n + (t.attemptCount ?? 0), 0),
  };
}
