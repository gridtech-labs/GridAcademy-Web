export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { api } from '@/lib/api-client';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ExamCard } from '@/types/exam';
import ExamList from '@/components/exam/ExamList';

async function getExams(): Promise<ExamCard[]> {
  try {
    const res = await api.get<ExamCard[]>('/api/exam-pages');
    return Array.isArray(res) ? res.filter(e => e.status === 1 && e.testCount > 0) : [];
  } catch { return []; }
}

export default async function AvailableTestsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const exams = (await getExams()).sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold">Find tests</h2>
          <p className="text-[15px] text-[#475467] mt-1">Pick an exam to see its free and paid mock tests.</p>
        </div>
        <Link href="/exams" className="text-[15px] font-semibold text-primary-dark hover:underline">Search all exams</Link>
      </div>

      {exams.length === 0 ? (
        <div className="bg-white border border-line rounded-xl px-6 py-14 text-center">
          <p className="text-lg font-semibold">No exams available right now</p>
          <p className="text-[15px] text-[#475467] mt-1">New exams are added after each official notification.</p>
        </div>
      ) : (
        <ExamList exams={exams} />
      )}
    </div>
  );
}
