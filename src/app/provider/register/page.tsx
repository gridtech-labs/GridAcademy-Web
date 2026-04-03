'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen, Loader2, Eye, EyeOff, CheckCircle,
  Building2, ArrowRight, Shield, TrendingUp, Users,
} from 'lucide-react';

const API_BASE    = process.env.NEXT_PUBLIC_API_URL  ?? 'http://localhost:5000';
const ADMIN_URL   = process.env.NEXT_PUBLIC_ADMIN_URL ?? 'https://gridacademy-production.up.railway.app';

const BENEFITS = [
  { icon: TrendingUp, title: 'Earn 70% Revenue Share', desc: 'Keep 70% of every sale. GridAcademy takes only 30%.' },
  { icon: Users,      title: 'Reach Lakhs of Students', desc: 'Publish once and reach students across India.' },
  { icon: Shield,     title: 'Secure Payouts',          desc: 'Monthly payouts directly to your bank account.' },
];

export default function ProviderRegisterPage() {
  /* ── form state ─────────────────────────────────────────────────── */
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
  const [showCpw,       setShowCpw]       = useState(false);

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState(false);

  /* ── validation ─────────────────────────────────────────────────── */
  const validate = (): string | null => {
    if (!firstName.trim())     return 'First name is required.';
    if (!lastName.trim())      return 'Last name is required.';
    if (!email.trim())         return 'Email address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address.';
    if (!instituteName.trim()) return 'Institute / organisation name is required.';
    if (password.length < 8)   return 'Password must be at least 8 characters.';
    if (password !== confirmPw) return 'Passwords do not match.';
    if (!agreed)               return 'You must agree to the Provider Agreement.';
    return null;
  };

  /* ── submit ──────────────────────────────────────────────────────── */
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

      if (res.ok || res.status === 201) {
        setSuccess(true);
      } else {
        setError(json?.message ?? json?.Message ?? `Registration failed (${res.status}). Please try again.`);
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── success screen ──────────────────────────────────────────────── */
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-11 h-11 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-500 text-sm mb-1">
            Thank you, <strong>{firstName}</strong>! Your provider application for
          </p>
          <p className="text-indigo-600 font-semibold text-base mb-4">
            {instituteName}
          </p>
          <p className="text-gray-500 text-sm mb-6">
            has been received. Our team will review your application and approve it
            within <strong>1–2 business days</strong>. You will receive a confirmation email once approved.
          </p>

          {/* Admin portal notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-amber-800 mb-1">📋 Next Steps After Approval</p>
            <p className="text-sm text-amber-700">
              Once approved, log in to the <strong>Provider Portal</strong> to upload questions,
              create mock tests, set your pricing, and track your earnings.
            </p>
          </div>

          <a
            href={`${ADMIN_URL}/Account/Login`}
            className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-colors text-center mb-3"
          >
            Go to Provider Portal Login →
          </a>
          <Link href="/" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
            ← Back to GridAcademy
          </Link>
        </div>
      </div>
    );
  }

  /* ── registration form ───────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">GridAcademy</span>
          </Link>
          <p className="text-sm text-gray-500 hidden sm:block">
            Already registered?{' '}
            <a href={`${ADMIN_URL}/Account/Login`}
              className="text-green-600 font-semibold hover:underline">
              Login to Provider Portal
            </a>
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

        {/* ── Left: benefits panel ─────────────────────────────── */}
        <div className="hidden lg:block sticky top-8">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <Building2 className="w-3.5 h-3.5" /> FOR COACHING INSTITUTES &amp; EDUCATORS
            </span>
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">
              Reach students<br />across India
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed">
              Publish your mock tests on GridAcademy and earn revenue every time a student purchases.
              Trusted by India&apos;s top coaching institutes.
            </p>
          </div>

          <div className="space-y-5">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{title}</p>
                  <p className="text-gray-500 text-sm mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81)' }}>
            <p className="font-bold text-lg">How it works</p>
            <ol className="mt-3 space-y-2 text-sm text-green-100">
              <li className="flex items-start gap-2">
                <span className="bg-white/20 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">1</span>
                Register your institute below
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-white/20 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">2</span>
                Admin reviews &amp; approves your account (1–2 days)
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-white/20 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">3</span>
                Login to Provider Portal → upload questions &amp; create tests
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-white/20 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">4</span>
                Publish your test series &amp; start earning!
              </li>
            </ol>
          </div>
        </div>

        {/* ── Right: form ──────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Register as a Provider</h2>
          <p className="text-sm text-gray-500 mb-6">Create your institute account to get started</p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Institute name */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Institute / Organisation Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={instituteName}
                onChange={e => setInstituteName(e.target.value)}
                placeholder="e.g. Sharma Coaching Centre"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* First + Last name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="Ramesh"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Sharma"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="contact@yourinstitute.com"
                autoComplete="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Phone Number <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* City + State */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Mumbai"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={e => setState(e.target.value)}
                  placeholder="Maharashtra"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                About your Institute <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={3}
                placeholder="Brief description of your coaching institute, expertise, exams you cover..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCpw ? 'text' : 'password'}
                  value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 pr-12 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    confirmPw && confirmPw !== password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                <button type="button" onClick={() => setShowCpw(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showCpw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPw && confirmPw !== password && (
                <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
              )}
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
              <input
                id="agreed"
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500 cursor-pointer"
              />
              <label htmlFor="agreed" className="text-sm text-gray-600 cursor-pointer">
                I agree to the{' '}
                <Link href="/provider-agreement" className="text-green-600 font-semibold hover:underline">
                  Provider Agreement
                </Link>{' '}
                and{' '}
                <Link href="/terms" className="text-green-600 font-semibold hover:underline">
                  Terms of Service
                </Link>
                . I understand my account will be reviewed before activation.
              </label>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2.5 border border-red-100">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !agreed}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? 'Submitting application...' : (
                <>Submit Application <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Already a provider?{' '}
              <a href={`${ADMIN_URL}/Account/Login`}
                className="text-green-600 font-semibold hover:underline">
                Login to Provider Portal →
              </a>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Looking to take tests instead?{' '}
              <Link href="/register" className="text-indigo-600 hover:underline">Register as a student</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
