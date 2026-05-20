'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Play } from 'lucide-react';

interface Props {
  assignmentId: string;
  token: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

/**
 * Used in the student dashboard for tests that are already assigned.
 * Starts a new attempt (or picks up an existing in-progress one via the
 * free-access endpoint which is idempotent for already-assigned tests),
 * then navigates to the Instructions page.
 */
export default function DashboardStartButton({ assignmentId, token }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      // Start a new attempt for the already-assigned test
      const startRes = await fetch(
        `${API_BASE}/api/assessment/attempts/${assignmentId}/start`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!startRes.ok) {
        const err = await startRes.json().catch(() => ({}));
        const msg: string = err?.message ?? '';
        // If an in-progress attempt already exists the backend embeds the UUID
        // in the message. Parse it out and resume directly instead of showing
        // a raw error with an internal ID.
        const uuidMatch = msg.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
        if (uuidMatch) {
          router.push(`/instructions/${uuidMatch[0]}`);
          return;
        }
        throw new Error(msg || 'Failed to start attempt');
      }

      const startJson = await startRes.json();
      const attemptId: string =
        startJson.data?.attemptId ??
        startJson.data?.AttemptId ??
        startJson.attemptId;

      if (!attemptId) throw new Error('No attempt ID returned from server');

      router.push(`/instructions/${attemptId}`);
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleStart}
        disabled={loading}
        className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400/70 transition-colors"
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Play className="w-3.5 h-3.5" />
        )}
        {loading ? 'Starting…' : 'Start Test'}
      </button>
      {error && (
        <p className="text-xs text-red-500 mt-1 text-right">{error}</p>
      )}
    </div>
  );
}
