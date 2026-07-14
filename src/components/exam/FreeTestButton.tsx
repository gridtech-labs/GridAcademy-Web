'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import { Loader2, Play, X } from 'lucide-react';
import { FreeAccessResponse } from '@/types/exam';

interface Props {
  testId: string;
  isLoggedIn: boolean;
  callbackUrl: string;
  token?: string;
  variant?: 'default' | 'hero';
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

const isValidEmail  = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isValidMobile = (v: string) => /^[6-9]\d{9}$/.test(v.trim());

export default function FreeTestButton({ testId, isLoggedIn, callbackUrl, token, variant = 'default' }: Props) {
  const router = useRouter();
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [email,     setEmail]     = useState('');
  const [mobile,    setMobile]    = useState('');
  const [emailErr,  setEmailErr]  = useState('');
  const [mobErr,    setMobErr]    = useState('');

  const isHero = variant === 'hero';
  const btnBase = isHero
    ? 'flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-bold transition-colors shadow-lg'
    : 'flex items-center justify-center gap-2 w-full text-sm font-semibold py-2.5 rounded-xl transition-colors';

  const startExam = async (bearerToken: string) => {
    const freeRes = await fetch(`${API_BASE}/api/assessment/free-access/${testId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${bearerToken}` },
    });
    if (!freeRes.ok) {
      const err = await freeRes.json().catch(() => ({}));
      throw new Error(err?.message ?? 'Failed to access test');
    }
    const freeJson = await freeRes.json();
    const freeData: FreeAccessResponse = freeJson.data ?? freeJson;
    const { assignmentId, attemptId: existingAttemptId } = freeData;

    if (existingAttemptId) {
      window.location.href = `/instructions/${existingAttemptId}`;
      return;
    }

    const startRes = await fetch(`${API_BASE}/api/assessment/attempts/${assignmentId}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${bearerToken}` },
    });
    if (!startRes.ok) {
      const err = await startRes.json().catch(() => ({}));
      throw new Error(err?.message ?? 'Failed to start attempt');
    }
    const startJson = await startRes.json();
    const attemptId = startJson.data?.attemptId ?? startJson.data?.AttemptId ?? startJson.attemptId;
    if (!attemptId) throw new Error('No attempt ID returned');
    window.location.href = `/instructions/${attemptId}`;
  };

  // ── Already logged in ─────────────────────────────────────────────────────
  const handleStart = async () => {
    if (!token) { setShowModal(true); return; }
    setLoading(true);
    setError(null);
    try {
      await startExam(token);
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  // ── Quick-access modal submit ─────────────────────────────────────────────
  const handleQuickAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const eErr = isValidEmail(email)   ? '' : 'Enter a valid email address.';
    const mErr = isValidMobile(mobile) ? '' : 'Enter a valid 10-digit mobile number (starting 6–9).';
    setEmailErr(eErr);
    setMobErr(mErr);
    if (eErr || mErr) return;

    setLoading(true);
    try {
      const result = await signIn('quick-access', {
        email:    email.trim().toLowerCase(),
        mobile:   mobile.trim(),
        redirect: false,
      });
      if (!result?.ok) {
        setError('Could not sign in. Please check your details.');
        setLoading(false);
        return;
      }
      const session = await getSession();
      const bearerToken = (session?.user as any)?.accessToken;
      if (!bearerToken) {
        window.location.href = callbackUrl;
        return;
      }
      await startExam(bearerToken);
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Trigger button ──────────────────────────────────────────────── */}
      <div>
        <button
          onClick={isLoggedIn ? handleStart : () => setShowModal(true)}
          disabled={loading}
          className={`${btnBase} bg-green-500 hover:bg-green-400 disabled:bg-green-400/70 text-white`}
        >
          {loading
            ? <Loader2 className={`animate-spin ${isHero ? 'w-5 h-5' : 'w-3.5 h-3.5'}`} />
            : <Play    className={isHero ? 'w-5 h-5' : 'w-3.5 h-3.5'} />}
          {loading ? 'Starting…' : 'Take Free Test'}
        </button>
        {error && !showModal && (
          <p className="text-xs text-red-500 mt-1.5 text-center">{error}</p>
        )}
      </div>

      {/* ── Quick-access modal ──────────────────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">
            <button
              onClick={() => { setShowModal(false); setError(null); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                <Play className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Start Free Test</h2>
              <p className="text-sm text-gray-500 mt-1">Enter your details to begin — no password needed.</p>
            </div>

            <form onSubmit={handleQuickAccess} className="space-y-3" noValidate>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={e => { setMobile(e.target.value.replace(/\D/g, '').slice(0, 10)); setMobErr(''); }}
                  placeholder="9876543210"
                  maxLength={10}
                  inputMode="numeric"
                  autoFocus
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent
                    ${mobErr ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                />
                {mobErr && <p className="text-xs text-red-500 mt-1">{mobErr}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setEmailErr(''); }}
                  placeholder="your@email.com"
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent
                    ${emailErr ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                />
                {emailErr && <p className="text-xs text-red-500 mt-1">{emailErr}</p>}
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 border border-red-100">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-400/70 text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 mt-1"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Starting test…' : 'Start Test →'}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-4">
              No registration required. Your progress is saved automatically.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
