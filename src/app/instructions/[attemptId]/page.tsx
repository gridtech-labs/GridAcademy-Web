export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { api } from '@/lib/api-client';
import { AttemptInfo } from '@/types/exam';
import { redirect } from 'next/navigation';
import InstructionsClient from './InstructionsClient';

interface PageProps {
  params: { attemptId: string };
}

export default async function InstructionsPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(`/login?callbackUrl=/instructions/${params.attemptId}`);
  }

  const token = (session.user as any).accessToken as string;

  let info: AttemptInfo | null = null;
  try {
    info = await api.get<AttemptInfo>(
      `/api/assessment/attempts/${params.attemptId}/info`,
      token,
    );
  } catch {
    redirect('/dashboard');
  }

  if (!info) redirect('/dashboard');

  // If already acknowledged, go straight to exam
  if (info.instructionsAcknowledged) {
    redirect(`/attempt/${params.attemptId}`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <InstructionsClient info={info} token={token} />
    </div>
  );
}
