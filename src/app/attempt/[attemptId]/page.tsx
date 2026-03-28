export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { api } from '@/lib/api-client';
import { AttemptState } from '@/types/exam';
import { redirect } from 'next/navigation';
import AttemptEngine from '@/components/exam/AttemptEngine';

interface PageProps {
  params: { attemptId: string };
}

// Attempt status enum values — must match backend AttemptStatus enum
// InProgress = 1, Submitted = 2, TimedOut = 3, Abandoned = 4
const STATUS_SUBMITTED = 2;
const STATUS_TIMED_OUT = 3;

export default async function AttemptPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(`/login?callbackUrl=/attempt/${params.attemptId}`);
  }

  const token = (session.user as any).accessToken as string;

  let attemptState: AttemptState;
  try {
    const data = await api.get<AttemptState>(
      `/api/assessment/attempts/${params.attemptId}/state`,
      token,
    );
    if (!data) redirect('/dashboard');
    attemptState = data;
  } catch {
    redirect('/dashboard');
  }

  // If already submitted or timed out, redirect to result
  if (attemptState.status === STATUS_SUBMITTED || attemptState.status === STATUS_TIMED_OUT) {
    redirect(`/attempt/${params.attemptId}/result`);
  }

  return (
    // Full-screen attempt — no header/footer
    <div className="min-h-screen bg-gray-100">
      <AttemptEngine attempt={attemptState} token={token} />
    </div>
  );
}
