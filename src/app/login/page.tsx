'use client';
import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Loader2, Eye, EyeOff } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') ?? '/dashboard';

  const [tab, setTab] = useState<'password' | 'otp'>('otp');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendOtp = async () => {
    if (!contact) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact }),
      });
      if (res.ok) setOtpSent(true);
      else setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = tab === 'password'
      ? await signIn('credentials', { email, password, redirect: false })
      : await signIn('otp', { contact, otp, redirect: false });

    setLoading(false);
    if (result?.ok) {
      // Full page reload ensures the server reads the fresh NextAuth cookie
      window.location.href = callbackUrl;
    } else setError('Invalid credentials. Please try again.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-extrabold text-indigo-600">GridAcademy</span>
        </div>

        <h1 className="text-xl font-bold text-gray-900 text-center mb-2">Welcome back!</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Sign in to continue your preparation</p>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          {(['otp', 'password'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all
                ${tab === t ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
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
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <button type="button" onClick={sendOtp} disabled={loading || otpSent}
                    className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-xl text-sm font-semibold hover:bg-indigo-200 disabled:opacity-50">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : otpSent ? 'Sent ✓' : 'Send OTP'}
                  </button>
                </div>
              </div>
              {otpSent && (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Enter OTP</label>
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value)}
                    placeholder="6-digit OTP" maxLength={6} required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 tracking-widest text-center text-xl" />
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="Your password" required
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          )}

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">{error}</p>}

          <button type="submit" disabled={loading || (tab === 'otp' && !otpSent)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          New to GridAcademy?{' '}
          <Link href="/register" className="text-indigo-600 font-semibold hover:underline">Create free account</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
