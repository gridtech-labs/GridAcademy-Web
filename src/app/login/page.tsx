'use client';
import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen, Loader2, Eye, EyeOff,
  Trophy, Zap, Users, CheckCircle,
} from 'lucide-react';

const PERKS = [
  { icon: Trophy,      text: '10,000+ Mock Tests across all exams' },
  { icon: Zap,         text: 'Instant results with detailed analysis' },
  { icon: Users,       text: '5 Lakh+ students trust GridAcademy' },
  { icon: CheckCircle, text: 'Free practice tests always available' },
];

function LoginForm() {
  const params      = useSearchParams();
  const callbackUrl = params.get('callbackUrl') ?? '/dashboard';

  const [tab,     setTab]     = useState<'otp' | 'password'>('otp');
  const [email,   setEmail]   = useState('');
  const [password,setPassword]= useState('');
  const [contact, setContact] = useState('');
  const [otp,     setOtp]     = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const sendOtp = async () => {
    if (!contact) return;
    setLoading(true); setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact }),
      });
      if (res.ok) setOtpSent(true);
      else setError('Failed to send OTP. Please try again.');
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const result = tab === 'password'
      ? await signIn('credentials', { email, password, redirect: false })
      : await signIn('otp', { contact, otp, redirect: false });
    setLoading(false);
    if (result?.ok) window.location.href = callbackUrl;
    else setError('Invalid credentials. Please try again.');
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left hero panel (desktop only) ─────────────────────────────── */}
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
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back! 👋</h1>
            <p className="text-sm text-gray-500 mb-6">Sign in to continue your preparation</p>

            {/* Login type tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              {(['otp', 'password'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all
                    ${tab === t ? 'bg-white shadow text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}>
                  {t === 'otp' ? '📱 OTP Login' : '🔑 Password'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'otp' ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Email or Mobile</label>
                    <div className="flex gap-2">
                      <input type="text" value={contact} onChange={e => setContact(e.target.value)}
                        placeholder="email@example.com or 9876543210" required
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" />
                      <button type="button" onClick={sendOtp} disabled={loading || otpSent}
                        className="shrink-0 px-4 py-2 bg-orange-50 text-orange-600 border border-orange-200 rounded-xl text-sm font-semibold hover:bg-orange-100 disabled:opacity-50 transition-colors">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : otpSent ? '✓ Sent' : 'Send OTP'}
                      </button>
                    </div>
                  </div>
                  {otpSent && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1.5">Enter OTP</label>
                      <input type="text" value={otp} onChange={e => setOtp(e.target.value)}
                        placeholder="6-digit OTP" maxLength={6} required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 tracking-widest text-center text-xl" />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
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
                </>
              )}

              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2 border border-red-100">
                  {error}
                </p>
              )}

              <button type="submit" disabled={loading || (tab === 'otp' && !otpSent)}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2">
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              New to GridAcademy?{' '}
              <Link href="/register" className="text-orange-600 font-semibold hover:underline">
                Create free account
              </Link>
            </p>
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
