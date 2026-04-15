'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen, Loader2, Eye, EyeOff, CheckCircle,
  Star, ShieldCheck, BarChart2, Clock,
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

const PERKS = [
  { icon: Star,       text: 'Expert-crafted questions by top educators' },
  { icon: BarChart2,  text: 'Detailed performance & accuracy analysis'  },
  { icon: ShieldCheck,text: 'All-India rank with every test attempt'     },
  { icon: Clock,      text: 'Practice anytime — mobile-friendly'        },
];

function RegisterForm() {
  const searchParams = useSearchParams();
  const callbackUrl  = searchParams.get('callbackUrl') ?? '/dashboard';

  const [name,            setName]            = useState('');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw,          setShowPw]          = useState(false);
  const [showCpw,         setShowCpw]         = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState('');
  const [success,         setSuccess]         = useState(false);

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

  /* ── Success screen ───────────────────────────────────────────────── */
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-md p-10 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-9 h-9 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created! 🎉</h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Welcome to GridAcademy, <strong className="text-gray-800">{name}</strong>!<br />
            Your account has been created. Sign in to start preparing.
          </p>
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-colors text-center">
            Sign In Now →
          </Link>
        </div>
      </div>
    );
  }

  /* ── Registration form ────────────────────────────────────────────── */
  return (
    <div className="min-h-screen flex">

      {/* ── Left hero panel (desktop only) ───────────────────────────── */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#0f0c29 0%,#1e1b4b 45%,#312e81 80%,#1e3a5f 100%)' }}>
        {/* Decorative glows */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(249,115,22,.18),transparent 65%)', transform: 'translate(25%,-25%)' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(129,140,248,.12),transparent 65%)', transform: 'translate(-25%,25%)' }} />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/40">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-extrabold text-white tracking-tight">GridAcademy</span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10">
          <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-3">Start for free today</p>
          <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-5">
            Your exam success<br />starts here ✨
          </h2>
          <p className="text-indigo-200/80 text-base mb-8 leading-relaxed max-w-xs">
            Join lakhs of aspirants preparing for SSC, Banking, Railway, UPSC and State PCS.
          </p>
          <div className="space-y-3">
            {PERKS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(249,115,22,.18)', border: '1px solid rgba(249,115,22,.3)' }}>
                  <Icon className="w-3.5 h-3.5 text-orange-400" />
                </div>
                <span className="text-indigo-100 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-indigo-400/50 text-xs relative z-10">
          © {new Date().getFullYear()} GridAcademy. All rights reserved.
        </p>
      </div>

      {/* ── Right form panel ──────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md py-8">

          {/* Mobile-only logo */}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-gray-900">GridAcademy</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
            <p className="text-sm text-gray-500 mb-6">Join millions of aspirants preparing smarter</p>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Rajesh Kumar" required autoComplete="name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="rajesh@example.com" required autoComplete="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" />
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="At least 8 characters" required autoComplete="new-password"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="mt-1.5 flex gap-1">
                    {[1, 2, 3, 4].map(level => (
                      <div key={level} className={`h-1 flex-1 rounded-full transition-colors ${
                        password.length >= level * 3
                          ? level <= 1 ? 'bg-red-400' : level <= 2 ? 'bg-yellow-400' : level <= 3 ? 'bg-blue-400' : 'bg-green-500'
                          : 'bg-gray-200'
                      }`} />
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input type={showCpw ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password" required autoComplete="new-password"
                    className={`w-full px-4 py-3 pr-12 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                      confirmPassword && confirmPassword !== password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`} />
                  <button type="button" onClick={() => setShowCpw(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showCpw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
                )}
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2 border border-red-100">{error}</p>
              )}

              <button type="submit" disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2">
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? 'Creating account...' : 'Create Free Account →'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-orange-600 font-semibold hover:underline">Sign In</Link>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            Are you a coaching institute?{' '}
            <Link href="/provider/register" className="text-indigo-500 hover:underline font-medium">
              Register as a Provider
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
