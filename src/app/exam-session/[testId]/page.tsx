import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { api } from '@/lib/api-client';
import { ExamConfig } from '@/types';
import { redirect } from 'next/navigation';
import ExamEngine from '@/components/exam/ExamEngine';

export default async function ExamPage({ params }: { params: { testId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/login?callbackUrl=/exam/${params.testId}`);

  const token = (session.user as any).accessToken;

  let config: ExamConfig;
  try {
    config = await api.get<ExamConfig>(`/api/student/exam/${params.testId}/config`, token);
    if (!config) redirect('/dashboard');
  } catch {
    redirect('/dashboard');
  }

  return (
    // Exam page — full screen, no header/footer
    <div className="min-h-screen bg-gray-100">
      <ExamEngine config={config} token={token} />
    </div>
  );
}
