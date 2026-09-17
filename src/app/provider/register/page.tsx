'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Eye, EyeOff, Loader2 } from 'lucide-react';
import AuthShell, { FormError, fieldClass, labelClass } from '@/components/auth/AuthShell';

const API_BASE  = process.env.NEXT_PUBLIC_API_URL  ?? 'http://localhost:5000';
const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL ?? 'https://gridacademy-production.up.railway.app';

const SHELL = {
  eyebrow: 'For coaching institutes & educators',
  headline: 'Publish your mock tests to students across India.',
  points: [
    'Keep 70% of every sale — GridAcademy takes 30%',
    'Monthly payouts directly to your bank account',
    'Applications reviewed within 1–2 business days',
    'Upload questions, build tests and set prices in the Provider Portal',
  ],
};

function Field({ label, optional, children }: { label: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={labelClass}>{label}{optional && <span className="font-normal text-[#667085]"> (optional)</span>}</span>
      {children}
    </label>
  );
}

export default function ProviderRegisterPage() {
  const [firstName,     setFirstName]     = useState('');
  const [lastName,      setLastName]      = useState('');
  const [email,         setEmail]         = useState('');
  const [phone,         setPhone]         = useState('');
  const [password,      setPassword]      = useState('');
  const [confirmPw,     setConfirmPw]     = useState('');
  const [instituteName, setInstituteName] = useState('');
  const [city,          setCity]          = useState('');
  const [state,         setState]         = useState('');
  const [bio,           setBio]           = useState('');
  const [agreed,        setAgreed]        = useState(false);
  const [showPw,        setShowPw]        = useState(false);

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState(false);

  const mismatch = !!confirmPw && confirmPw !== password;

  const validate = (): string | null => {
    if (!instituteName.trim()) return 'Institute / organisation name is required.';
    if (!firstName.trim())     return 'First name is required.';
    if (!lastName.trim())      return 'Last name is required.';
    if (!email.trim())         return 'Email address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address.';
    if (password.length < 8)   return 'Password must be at least 8 characters.';
    if (password !== confirmPw) return 'Passwords do not match.';
    if (!agreed)               return 'You must agree to the Provider Agreement.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/register/provider`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName:     firstName.trim(),
          lastName:      lastName.trim(),
          email:         email.trim().toLowerCase(),
          phone:         phone.trim() || undefined,
          password,
          instituteName: instituteName.trim(),
          city:          city.trim() || undefined,
          state:         state.trim() || undefined,
          bio:           bio.trim() || undefined,
          agreedToTerms: true,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok || res.status === 201) setSuccess(true);
      else setError(json?.message ?? json?.Message ?? `Registration failed (${res.status}). Please try again.`);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const portalLink = (
    <>Already a provider? <a href={`${ADMIN_URL}/Account/Login`} className="font-semibold text-primary-dark hover:underline">Log in to the Provider Portal</a></>
  );

  if (success) {
    return (
      <AuthShell {...SHELL} footer={<Link href="/" className="font-semibold text-primary-dark hover:underline">Back to GridAcademy</Link>}>
        <div className="bg-white border border-line rounded-xl p-6 md:p-8 flex flex-col items-center text-center gap-4">
          <span className="w-14 h-14 rounded-full bg-[#e7f6ec] text-[#0b6b31] flex items-center justify-center">
            <Check className="w-7 h-7" strokeWidth={2.6} />
          </span>
          <h1 className="text-2xl font-bold">Application submitted</h1>
          <p className="text-[15px] text-[#475467] leading-relaxed">
            Thank you, <b className="text-ink">{firstName}</b>. We&apos;ve received the application for <b className="text-ink">{instituteName}</b> and
            will review it within 1–2 business days. You&apos;ll get an email once it&apos;s approved.
          </p>
          <div className="w-full text-left rounded-lg bg-paper border border-line px-4 py-3.5 text-sm text-[#344054] leading-relaxed">
            <p className="font-semibold text-ink mb-1">After approval</p>
            Log in to the Provider Portal to upload questions, create mock tests, set your pricing and track earnings.
          </div>
          <a href={`${ADMIN_URL}/Account/Login`}
            className="w-full h-12 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold inline-flex items-center justify-center gap-2">
            Go to Provider Portal <ArrowRight className="w-[17px] h-[17px]" />
          </a>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell {...SHELL} wide footer={<>Looking to take tests instead? <Link href="/register" className="font-semibold text-primary-dark hover:underline">Register as a student</Link></>}>
      <div className="bg-white border border-line rounded-xl p-6 md:p-8 flex flex-col gap-5 shadow-[0_12px_32px_-16px_rgba(14,23,38,.18)]">
        <div>
          <h1 className="text-2xl md:text-[28px] font-bold leading-tight">Register as a provider</h1>
          <p className="text-[15px] text-[#475467] mt-1.5">Create your institute account. We review every application before activation.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <Field label="Institute / organisation name">
            <input type="text" value={instituteName} onChange={e => setInstituteName(e.target.value)} placeholder="e.g. Sharma Coaching Centre" autoComplete="organization" className={fieldClass()} />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="First name">
              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Ramesh" autoComplete="given-name" className={fieldClass()} />
            </Field>
            <Field label="Last name">
              <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Sharma" autoComplete="family-name" className={fieldClass()} />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Email">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="contact@yourinstitute.com" autoComplete="email" className={fieldClass()} />
            </Field>
            <Field label="Phone" optional>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" autoComplete="tel" className={fieldClass()} />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="City" optional>
              <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Mumbai" autoComplete="address-level2" className={fieldClass()} />
            </Field>
            <Field label="State" optional>
              <input type="text" value={state} onChange={e => setState(e.target.value)} placeholder="Maharashtra" autoComplete="address-level1" className={fieldClass()} />
            </Field>
          </div>

          <Field label="About your institute" optional>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
              placeholder="Your expertise and the exams you prepare students for"
              className={`${fieldClass()} h-auto py-3 resize-none`} />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Password">
              <span className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="At least 8 characters" autoComplete="new-password" className={`${fieldClass()} pr-12`} />
                <button type="button" onClick={() => setShowPw(v => !v)} aria-label={showPw ? 'Hide passwords' : 'Show passwords'}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-[#667085] hover:text-ink">
                  {showPw ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </span>
            </Field>
            <Field label="Confirm password">
              <input type={showPw ? 'text' : 'password'} value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                placeholder="Re-enter your password" autoComplete="new-password" className={fieldClass(mismatch)} />
              {mismatch && <span className="text-xs text-[#b42318]">Passwords do not match.</span>}
            </Field>
          </div>

          <label className="flex items-start gap-3 rounded-lg bg-paper border border-line p-3.5 cursor-pointer">
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
              className="mt-0.5 w-5 h-5 accent-[#1760f4] shrink-0 cursor-pointer" />
            <span className="text-sm text-[#344054] leading-relaxed">
              I agree to the <Link href="/provider-agreement" className="font-semibold text-primary-dark hover:underline">Provider Agreement</Link> and{' '}
              <Link href="/terms" className="font-semibold text-primary-dark hover:underline">Terms of Service</Link>, and understand my account will be reviewed before activation.
            </span>
          </label>

          {error && <FormError>{error}</FormError>}

          <button type="submit" disabled={loading || !agreed}
            className="h-12 rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold text-base inline-flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-[18px] h-[18px] animate-spin" /> Submitting application…</> : <>Submit application <ArrowRight className="w-[17px] h-[17px]" /></>}
          </button>
        </form>

        <p className="text-center text-sm text-[#475467] border-t border-line pt-4">{portalLink}</p>
      </div>
    </AuthShell>
  );
}
