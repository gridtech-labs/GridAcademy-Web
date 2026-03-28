'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Play } from 'lucide-react';
import { FreeAccessResponse } from '@/types/exam';

interface Props {
  testId: string;
  isLoggedIn: boolean;
  callbackUrl: string;
  token?: string;
  /** 'hero' renders a larger, more prominent button for the banner area */
  variant?: 'default' | 'hero';
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export default function FreeTestButton({ testId, isLoggedIn, callbackUrl, token, variant = 'default' }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isHero = variant === 'hero';
  const btnBase = isHero
    ? 'flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-bold transition-colors shadow-lg'
    : 'flex items-center justify-center gap-2 w-full text-sm font-semibold py-2.5 rounded-xl transition-colors';

  if (!isLoggedIn) {
    return (
      <Link
        href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
        className={`${btnBase} bg-green-500 hover:bg-green-400 text-white`}
      >
        <Play className={isHero ? 'w-5 h-5' : 'w-3.5 h-3.5'} />
        Take Free Test
      </Link>
    );
  }

  const handleStart = async () => {
    if (!token) {
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // Step 1: Get assignment
      const freeRes = await fetch(`${API_BASE}/api/assessment/free-access/${testId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (!freeRes.ok) {
        const err = await freeRes.json().catch(() => ({}));
        throw new Error(err?.message ?? 'Failed to access test');
      }
      const freeJson = await freeRes.json();
      const freeData: FreeAccessResponse = freeJson.data ?? freeJson;
      const { assignmentId, attemptId: existingAttemptId } = freeData;

      let attemptId: string;

      if (existingAttemptId) {
        // Resume the existing in-progress attempt
        attemptId = existingAttemptId;
      } else {
        // No in-progress attempt — start a new one
        const startRes = await fetch(`${API_BASE}/api/assessment/attempts/${assignmentId}/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        });
        if (!startRes.ok) {
          const err = await startRes.json().catch(() => ({}));
          throw new Error(err?.message ?? 'Failed to start attempt');
        }
        const startJson = await startRes.json();
        attemptId = startJson.data?.attemptId ?? startJson.data?.AttemptId ?? startJson.attemptId;
        if (!attemptId) throw new Error('No attempt ID returned');
      }

      router.push(`/attempt/${attemptId}`);
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
        className={`${btnBase} bg-green-500 hover:bg-green-400 disabled:bg-green-400/70 text-white`}
      >
        {loading
          ? <Loader2 className={`animate-spin ${isHero ? 'w-5 h-5' : 'w-3.5 h-3.5'}`} />
          : <Play    className={isHero ? 'w-5 h-5' : 'w-3.5 h-3.5'} />}
        {loading ? 'Starting…' : 'Take Free Test'}
      </button>
      {error && (
        <p className="text-xs text-red-500 mt-1.5 text-center">{error}</p>
      )}
    </div>
  );
}
