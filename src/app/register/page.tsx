'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Check, Eye, EyeOff, Loader2 } from 'lucide-react';
import AuthShell, { FormError, errorTextClass, fieldClass, labelClass } from '@/components/auth/AuthShell';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

function PasswordField({ label, value, onChange, placeholder, error }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <label className="flex flex-col gap-1.5">
      <span className={labelClass}>{label}</span>
      <span className="relative">
        <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} autoComplete="new-password" className={`${fieldClass(!!error)} pr-12`} />
        <button type="button" onClick={() => setShow(v => !v)} aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-[#667085] hover:text-ink">
          {show ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
        </button>
      </span>
      {error && <span className={errorTextClass}>{error}</span>}
    </label>
  );
}

function RegisterForm() {
  const searchParams = useSearchParams();
  const callbackUrl  = searchParams.get('callbackUrl') ?? '/dashboard';

  const [name,            setName]            = useState('');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState('');
  const [success,         setSuccess]         = useState(false);

  const mismatch = !!confirmPassword && confirmPassword !== password;

  const validate = (): string | null => {
    if (!name.trim())   return 'Full name is required.';
    if (!email.trim())  return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address.';
    if (password.length < 8)           return 'Password must be at least 8 characters.';
    if (password !== confirmPassword)  return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setLoading(true); setError('');
    try {
      const parts     = name.trim().split(/\s+/);
      const firstName = parts[0] ?? '';
      const lastName  = parts.slice(1).join(' ') || firstName;
      const res = await fetch(`${API_BASE}/api/auth/register/student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email: email.trim(), password }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) setSuccess(true);
      else setError(json?.message ?? json?.Message ?? `Registration failed (${res.status}). Please try again.`);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const shell = {
    eyebrow: 'Free to start',
    headline: 'Your exam preparation starts here.',
    points: [
      'Full-length mocks for JEE, NEET, CUET and government exams',
      'The same timer, palette and marking as the real test',
      'A worked solution for every question',
    ],
    footer: <>Are you a coaching institute? <Link href="/provider/register" className="font-semibold text-primary-dark hover:underline">Register as a provider</Link></>,
  };

  if (success) {
    return (
      <AuthShell {...shell}>
        <div className="bg-white border border-line rounded-xl p-6 md:p-8 flex flex-col items-center text-center gap-4">
          <span className="w-14 h-14 rounded-full bg-[#e7f6ec] text-[#0b6b31] flex items-center justify-center">
            <Check className="w-7 h-7" strokeWidth={2.6} />
          </span>
          <h1 className="text-2xl font-bold">Account created</h1>
          <p className="text-[15px] text-[#475467] leading-relaxed">
            Welcome to GridAcademy, <b className="text-ink">{name.trim().split(/\s+/)[0]}</b>. Log in with your email and password to start preparing.
          </p>
          <Link href={`/login?mode=password&callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="w-full h-12 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold inline-flex items-center justify-center gap-2">
            Log in <ArrowRight className="w-[17px] h-[17px]" />
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell {...shell}>
      <div className="bg-white border border-line rounded-xl p-6 md:p-8 flex flex-col gap-5 shadow-[0_12px_32px_-16px_rgba(14,23,38,.18)]">
        <div>
          <h1 className="text-2xl md:text-[28px] font-bold leading-tight">Create your account</h1>
          <p className="text-[15px] text-[#475467] mt-1.5">
            Only want to take a free test? You can start one with just your email and mobile number — no account needed.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Full name</span>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ananya Verma" autoComplete="name" className={fieldClass()} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Email</span>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" className={fieldClass()} />
          </label>
          <PasswordField label="Password" value={password} onChange={setPassword} placeholder="At least 8 characters" />
          <PasswordField label="Confirm password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Re-enter your password"
            error={mismatch ? 'Passwords do not match.' : undefined} />

          {error && <FormError>{error}</FormError>}

          <button type="submit" disabled={loading}
            className="h-12 rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold text-base inline-flex items-center justify-center gap-2 mt-1">
            {loading ? <><Loader2 className="w-[18px] h-[18px] animate-spin" /> Creating account…</> : <>Create free account <ArrowRight className="w-[17px] h-[17px]" /></>}
          </button>

          <p className="text-center text-[13px] text-[#667085]">
            By continuing you agree to our <Link href="/terms" className="underline hover:text-ink">Terms</Link> and <Link href="/privacy" className="underline hover:text-ink">Privacy Policy</Link>.
          </p>
        </form>

        <p className="text-center text-sm text-[#475467] border-t border-line pt-4">
          Already have an account? <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-semibold text-primary-dark hover:underline">Log in</Link>
        </p>
      </div>
    </AuthShell>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <Loader2 className="w-7 h-7 text-primary animate-spin" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
