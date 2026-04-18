'use client';
import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen, Loader2, Eye, EyeOff,
  Trophy, Zap, Users, CheckCircle, Smartphone,
} from 'lucide-react';

const PERKS = [
  { icon: Trophy,      text: '10,000+ Mock Tests across all exams' },
  { icon: Zap,         text: 'Instant results with detailed analysis' },
  { icon: Users,       text: '5 Lakh+ students trust GridAcademy' },
  { icon: CheckCircle, text: 'Free practice tests always available' },
];

// ── Validation helpers ────────────────────────────────────────────────────────
const isValidEmail  = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isValidMobile = (v: string) => /^[6-9]\d{9}$/.test(v.trim());

function LoginForm() {
  const params      = useSearchParams();
  const callbackUrl = params.get('callbackUrl') ?? '/dashboard';
  const router      = useRouter();

  // tab: 'quick' | 'password'
  const [tab,      setTab]      = useState<'quick' | 'password'>('quick');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  // Quick-access fields
  const [email,    setEmail]    = useState('');
  const [mobile,   setMobile]   = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [mobErr,   setMobErr]   = useState('');

  // Password fields
  const [pwEmail,  setPwEmail]  = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);

  // ── Quick-access submit ───────────────────────────────────────────────────
  const handleQuickAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate
    const eErr = isValidEmail(email)  ? '' : 'Enter a valid email address.';
    const mErr = isValidMobile(mobile) ? '' : 'Enter a valid 10-digit mobile number.';
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
      if (result?.ok) {
        router.push(callbackUrl);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Password login submit ─────────────────────────────────────────────────
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const result = await signIn('credentials', { email: pwEmail, password, redirect: false });
    setLoading(false);
    if (result?.ok) router.push(callbackUrl);
    else setError('Invalid email or password.');
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left hero panel ─────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#0f0c29 0%,#1e1b4b 45%,#312e81 80%,#1e3a5f 100%)' }}>
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
          <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-3">India&apos;s #1 Exam Prep Platform</p>
          <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-5">
            Crack your<br />dream exam 🎯
          </h2>
          <p className="text-indigo-200/80 text-base mb-8 leading-relaxed max-w-xs">
            Prepare smarter with expert-crafted mock tests, instant analysis and an all-India rank.
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

      {/* ── Right form panel ────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 min-h-screen">
        <div className="w-full max-w-md">

          {/* Mobile-only logo */}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-gray-900">GridAcademy</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button onClick={() => { setTab('quick'); setError(''); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all
                  ${tab === 'quick' ? 'bg-white shadow text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}>
                <Smartphone className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                Start Test
              </button>
              <button onClick={() => { setTab('password'); setError(''); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all
                  ${tab === 'password' ? 'bg-white shadow text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}>
                🔑 Sign In
              </button>
            </div>

            {/* ── Quick Access form ──────────────────────────────────────── */}
            {tab === 'quick' && (
              <>
                <div className="mb-5">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">Start your test 🚀</h1>
                  <p className="text-sm text-gray-500">Enter your details below — no password needed!</p>
                </div>

                <form onSubmit={handleQuickAccess} className="space-y-4" noValidate>
                  {/* Mobile */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={e => { setMobile(e.target.value.replace(/\D/g, '').slice(0, 10)); setMobErr(''); }}
                      placeholder="9876543210"
                      maxLength={10}
                      inputMode="numeric"
                      className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent
                        ${mobErr ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                    />
                    {mobErr && <p className="text-xs text-red-500 mt-1">{mobErr}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setEmailErr(''); }}
                      placeholder="your@email.com"
                      className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent
                        ${emailErr ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                    />
                    {emailErr && <p className="text-xs text-red-500 mt-1">{emailErr}</p>}
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2 border border-red-100">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2 text-base">
                    {loading
                      ? <><Loader2 className="w-5 h-5 animate-spin" /> Setting up…</>
                      : 'Start Test →'}
                  </button>

                  <p className="text-center text-xs text-gray-400 pt-1">
                    By continuing you agree to our{' '}
                    <Link href="/terms" className="underline hover:text-gray-600">Terms</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>.
                  </p>
                </form>
              </>
            )}

            {/* ── Password login form ────────────────────────────────────── */}
            {tab === 'password' && (
              <>
                <div className="mb-5">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back! 👋</h1>
                  <p className="text-sm text-gray-500">Sign in with your email and password</p>
                </div>

                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Email</label>
                    <input type="email" value={pwEmail} onChange={e => setPwEmail(e.target.value)}
                      placeholder="your@email.com" required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Password</label>
                    <div className="relative">
                      <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="Your password" required
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" />
                      <button type="button" onClick={() => setShowPw(v => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2 border border-red-100">{error}</p>
                  )}

                  <button type="submit" disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2">
                    {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                    {loading ? 'Signing in…' : 'Sign In →'}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Provider link */}
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
