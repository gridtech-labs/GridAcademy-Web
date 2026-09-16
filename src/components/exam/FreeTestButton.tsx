'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { signIn, getSession } from 'next-auth/react';
import { ArrowRight, Loader2, X } from 'lucide-react';
import { FreeAccessResponse } from '@/types/exam';

interface Props {
  testId: string;
  isLoggedIn: boolean;
  callbackUrl: string;
  token?: string;
  /** ghost = tinted blue (free tests), primary = solid blue (owned tests / main CTA) */
  variant?: 'ghost' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  /** Overrides the button text — e.g. "Start Test" for a purchased (not free) test. */
  label?: string;
  /** Shown in the quick-access dialog so the student knows which test starts. */
  testTitle?: string;
  className?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

const isValidEmail  = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isValidMobile = (v: string) => /^[6-9]\d{9}$/.test(v.trim());

const SIZE = {
  sm: 'h-9 px-3.5 text-sm rounded-[7px]',
  md: 'h-11 px-[18px] text-[15px] rounded-lg',
  lg: 'h-[52px] px-6 text-base rounded-lg',
};
const VARIANT = {
  ghost:   'bg-primary-tint text-primary-dark hover:bg-[#d6e4fd] disabled:opacity-60',
  primary: 'bg-primary text-white hover:bg-primary-dark disabled:opacity-60',
};

export default function FreeTestButton({
  testId, isLoggedIn, callbackUrl, token, variant = 'ghost', size = 'sm', label, testTitle, className = '',
}: Props) {
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [email,     setEmail]     = useState('');
  const [mobile,    setMobile]    = useState('');
  const [emailErr,  setEmailErr]  = useState('');
  const [mobErr,    setMobErr]    = useState('');

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

  // ── Quick-access dialog submit ────────────────────────────────────────────
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
        // Quick-access refuses an existing account unless the mobile matches the
        // one registered on it (and always refuses staff accounts), so say what to do.
        setError('Could not sign in. If you already have an account with this email, ' +
                 'enter the mobile number registered with it — or log in with your password.');
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

  const closeModal = () => { setShowModal(false); setError(null); };

  return (
    <>
      <div className={className}>
        <button
          onClick={isLoggedIn ? handleStart : () => setShowModal(true)}
          disabled={loading}
          className={`w-full inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap transition-colors ${SIZE[size]} ${VARIANT[variant]}`}
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'Starting…' : label ?? 'Take Free Test'}
        </button>
        {error && !showModal && (
          <p className="text-xs text-[#b42318] mt-1.5 text-center whitespace-normal">{error}</p>
        )}
      </div>

      {showModal && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-4 bg-ink/55"
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-access-title"
        >
          <div className="bg-white w-full sm:max-w-[400px] rounded-t-2xl sm:rounded-xl p-[22px] shadow-[0_30px_60px_-20px_rgba(0,0,0,.4)] text-left text-ink">
            <div className="flex items-center justify-between">
              <h2 id="quick-access-title" className="text-lg font-semibold">{label ?? 'Take Free Test'}</h2>
              <button onClick={closeModal} className="w-11 h-11 -mr-3 flex items-center justify-center text-[#667085] hover:text-ink" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[14.5px] leading-relaxed text-[#475467] mt-1">
              {testTitle ? <>{testTitle}. </> : null}No password needed — we’ll save your result to this email.
            </p>

            <form onSubmit={handleQuickAccess} className="flex flex-col gap-3.5 mt-4" noValidate>
              <label className="flex flex-col gap-1.5">
                <span className="text-[13.5px] font-medium">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setEmailErr(''); }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoFocus
                  className={`h-11 px-3 rounded-lg border text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                    ${emailErr ? 'border-[#d92d20] bg-[#fef3f2]' : 'border-[#d0d5dd]'}`}
                />
                {emailErr && <span className="text-xs text-[#b42318]">{emailErr}</span>}
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[13.5px] font-medium">Mobile number</span>
                <span className={`h-11 flex items-center gap-2.5 px-3 rounded-lg border focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary
                  ${mobErr ? 'border-[#d92d20] bg-[#fef3f2]' : 'border-[#d0d5dd]'}`}>
                  <span className="text-[#667085] text-[15px]">+91</span>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={e => { setMobile(e.target.value.replace(/\D/g, '').slice(0, 10)); setMobErr(''); }}
                    placeholder="98765 43210"
                    maxLength={10}
                    inputMode="numeric"
                    autoComplete="tel-national"
                    className="flex-1 min-w-0 bg-transparent font-mono text-[15px] focus:outline-none"
                  />
                </span>
                {mobErr
                  ? <span className="text-xs text-[#b42318]">{mobErr}</span>
                  : <span className="text-[12.5px] text-[#667085]">Already registered? Use the mobile number on your account.</span>}
              </label>

              {error && (
                <p className="text-[13px] text-[#b42318] bg-[#fef3f2] rounded-lg px-3 py-2 border border-[#fecdca]">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="h-12 rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold text-[15px] flex items-center justify-center gap-2 mt-1"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Starting test…' : <>Start test <ArrowRight className="w-[17px] h-[17px]" /></>}
              </button>
            </form>

            <p className="text-center text-[13px] text-[#667085] mt-4">
              Have a password?{' '}
              <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-semibold text-primary-dark hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
