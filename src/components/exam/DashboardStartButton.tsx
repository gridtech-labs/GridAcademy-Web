'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface Props {
  assignmentId: string;
  token: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

/**
 * Starts a new attempt for an already-assigned test (or resumes the in-progress
 * one the backend reports), then navigates to the Instructions page.
 */
export default function DashboardStartButton({ assignmentId, token }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      const startRes = await fetch(`${API_BASE}/api/assessment/attempts/${assignmentId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });

      if (!startRes.ok) {
        const err = await startRes.json().catch(() => ({}));
        const msg: string = err?.message ?? '';
        // An in-progress attempt's UUID is embedded in the message — resume it
        const uuidMatch = msg.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
        if (uuidMatch) {
          router.push(`/instructions/${uuidMatch[0]}`);
          return;
        }
        throw new Error(msg || 'Failed to start attempt');
      }

      const startJson = await startRes.json();
      const attemptId: string = startJson.data?.attemptId ?? startJson.data?.AttemptId ?? startJson.attemptId;
      if (!attemptId) throw new Error('No attempt ID returned from server');
      router.push(`/instructions/${attemptId}`);
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleStart} disabled={loading}
        className="h-9 inline-flex items-center gap-1.5 px-3.5 rounded-[7px] bg-primary text-white text-sm font-semibold hover:bg-primary-dark disabled:opacity-60">
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? 'Starting…' : 'Start Test'}
      </button>
      {error && <p className="text-xs text-[#b42318] mt-1 text-right max-w-[220px]">{error}</p>}
    </div>
  );
}
