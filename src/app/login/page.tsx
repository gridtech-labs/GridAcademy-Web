'use client';
import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import AuthShell, { FormError, errorTextClass, fieldClass, labelClass } from '@/components/auth/AuthShell';

const isValidEmail  = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isValidMobile = (v: string) => /^[6-9]\d{9}$/.test(v.trim());

type Mode = 'quick' | 'password';

function LoginForm() {
  const params      = useSearchParams();
  const callbackUrl = params.get('callbackUrl') ?? '/dashboard';
  const router      = useRouter();

  const [mode,     setMode]     = useState<Mode>(params.get('mode') === 'password' ? 'password' : 'quick');
  const [email,    setEmail]    = useState('');
  const [mobile,   setMobile]   = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [emailErr, setEmailErr] = useState('');
  const [mobErr,   setMobErr]   = useState('');
  const [pwErr,    setPwErr]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const switchMode = (m: Mode) => { setMode(m); setError(''); setMobErr(''); setPwErr(''); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const eErr = isValidEmail(email) ? '' : 'Enter a valid email address.';
    const mErr = mode === 'quick' && !isValidMobile(mobile) ? 'Enter a valid 10-digit mobile number (starting 6–9).' : '';
    const pErr = mode === 'password' && !password ? 'Enter your password.' : '';
    setEmailErr(eErr); setMobErr(mErr); setPwErr(pErr);
    if (eErr || mErr || pErr) return;

    setLoading(true);
    try {
      const result = mode === 'quick'
        ? await signIn('quick-access', { email: email.trim().toLowerCase(), mobile: mobile.trim(), redirect: false })
        : await signIn('credentials', { email: email.trim().toLowerCase(), password, redirect: false });
      if (result?.ok) {
        router.push(callbackUrl);
      } else {
        setError(mode === 'quick'
          ? 'Could not sign in. If you already have an account with this email, enter the mobile number registered with it — or log in with your password.'
          : 'Email or password is incorrect.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Mock tests on the real exam interface"
      headline="Practise on the exam screen before exam day."
      points={[
        'Free tests to start — just your email and mobile number',
        'Pay once per exam: every paid test unlocked, lifetime access',
        'Section-wise score and a solution for every question',
      ]}
      footer={<>Are you a coaching institute? <Link href="/provider/register" className="font-semibold text-primary-dark hover:underline">Register as a provider</Link></>}
    >
      <div className="bg-white border border-line rounded-xl p-6 md:p-8 flex flex-col gap-5 shadow-[0_12px_32px_-16px_rgba(14,23,38,.18)]">
        <div>
          <h1 className="text-2xl md:text-[28px] font-bold leading-tight">Log in</h1>
          <p className="text-[15px] text-[#475467] mt-1.5">
            {mode === 'quick' ? 'No password needed — use your email and mobile number.' : 'Use the email and password on your account.'}
          </p>
        </div>

        <div className="grid grid-cols-2 p-1 rounded-lg bg-[#f2f4f7]" role="tablist" aria-label="Login method">
          {([['quick', 'Email & mobile'], ['password', 'Password']] as [Mode, string][]).map(([m, label]) => (
            <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => switchMode(m)}
              className={`h-10 rounded-md text-sm font-semibold transition-colors ${mode === m ? 'bg-white text-ink shadow-sm' : 'text-[#475467] hover:text-ink'}`}>
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Email</span>
            <input type="email" value={email} autoComplete="email" autoFocus placeholder="you@example.com"
              onChange={e => { setEmail(e.target.value); setEmailErr(''); }} className={fieldClass(!!emailErr)} />
            {emailErr && <span className={errorTextClass}>{emailErr}</span>}
          </label>

          {mode === 'quick' ? (
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Mobile number</span>
              <span className={`${fieldClass(!!mobErr)} flex items-center gap-2.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary`}>
                <span className="text-[#667085]">+91</span>
                <input type="tel" value={mobile} inputMode="numeric" maxLength={10} autoComplete="tel-national" placeholder="98765 43210"
                  onChange={e => { setMobile(e.target.value.replace(/\D/g, '').slice(0, 10)); setMobErr(''); }}
                  className="flex-1 min-w-0 bg-transparent font-mono focus:outline-none" />
              </span>
              {mobErr
                ? <span className={errorTextClass}>{mobErr}</span>
                : <span className="text-[12.5px] text-[#667085]">Already registered? Use the mobile number on your account.</span>}
            </label>
          ) : (
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Password</span>
              <span className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} autoComplete="current-password"
                  onChange={e => { setPassword(e.target.value); setPwErr(''); }} className={`${fieldClass(!!pwErr)} pr-12`} />
                <button type="button" onClick={() => setShowPw(v => !v)} aria-label={showPw ? 'Hide password' : 'Show password'}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-[#667085] hover:text-ink">
                  {showPw ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </span>
              {pwErr && <span className={errorTextClass}>{pwErr}</span>}
            </label>
          )}

          {error && <FormError>{error}</FormError>}

          <button type="submit" disabled={loading}
            className="h-12 rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold text-base inline-flex items-center justify-center gap-2 mt-1">
            {loading ? <><Loader2 className="w-[18px] h-[18px] animate-spin" /> Signing in…</> : <>Continue <ArrowRight className="w-[17px] h-[17px]" /></>}
          </button>

          <p className="text-center text-[13px] text-[#667085]">
            By continuing you agree to our <Link href="/terms" className="underline hover:text-ink">Terms</Link> and <Link href="/privacy" className="underline hover:text-ink">Privacy Policy</Link>.
          </p>
        </form>

        <p className="text-center text-sm text-[#475467] border-t border-line pt-4">
          New to GridAcademy? <Link href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-semibold text-primary-dark hover:underline">Create an account</Link>
        </p>
      </div>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <Loader2 className="w-7 h-7 text-primary animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
