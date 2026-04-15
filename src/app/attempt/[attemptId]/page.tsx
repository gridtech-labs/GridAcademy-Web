export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { api } from '@/lib/api-client';
import { AttemptState, AttemptInfo } from '@/types/exam';
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

  // ── Instructions gate ────────────────────────────────────────────────────
  // Check InstructionsAcknowledged BEFORE loading the full exam state.
  // This ensures the instructions page is always shown regardless of how
  // the attempt was created (API, payment flow, free-access, etc.).
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

  if (!info.instructionsAcknowledged) {
    // Student hasn't read/accepted instructions yet — send them there first
    redirect(`/instructions/${params.attemptId}`);
  }

  // ── Load full attempt state ──────────────────────────────────────────────
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
