'use client';

import { useState } from 'react';
import { Mail, Phone, Clock, Send, CheckCircle, AlertCircle, MapPin, BookOpen } from 'lucide-react';
import type { Metadata } from 'next';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const subjects = [
    'Course / Exam Enquiry',
    'Technical Support',
    'Payment / Billing',
    'Partnership / Collaboration',
    'Feedback / Suggestion',
    'Other',
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Failed to send');
      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err?.message ?? 'Something went wrong. Please email us directly at info@gridacademy.in');
    }
  }

  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="text-sm text-orange-100 mb-3">
            <a href="/" className="hover:text-white">Home</a>
            <span className="mx-2">/</span>
            <span className="text-white font-medium">Contact Us</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Contact Us</h1>
          <p className="text-orange-100 text-lg">Have a question? We&apos;d love to hear from you.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Contact Form ─────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Send Us a Message</h2>
              <p className="text-sm text-gray-500 mb-6">Our team will get back to you within 24 hours.</p>

              {status === 'success' && (
                <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 mb-6">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Message sent successfully!</p>
                    <p className="text-sm mt-0.5">Thank you! A confirmation has been sent to your email. We&apos;ll get back to you within 24 hours.</p>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 mb-6">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{errorMsg}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text" required
                      placeholder="Your full name"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email" required
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition bg-white"
                    >
                      <option value="">— Select a subject —</option>
                      {subjects.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required minLength={10}
                    rows={5}
                    placeholder="Write your message here…"
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  {status === 'loading' ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {status === 'loading' ? 'Sending…' : 'Send Message'}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  🔒 We respect your privacy. Your information will never be shared.
                </p>
              </form>
            </div>
          </div>

          {/* ── Contact Info Sidebar ──────────────────────────────── */}
          <div className="space-y-4">

            {/* Direct contact */}
            <div className="bg-orange-500 text-white rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4">Get In Touch</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-orange-100 text-xs mb-0.5">Email Us</p>
                    <a href="mailto:info@gridacademy.in" className="font-semibold text-sm hover:underline">
                      info@gridacademy.in
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-orange-100 text-xs mb-0.5">Call Us</p>
                    <a href="tel:+918000000000" className="font-semibold text-sm hover:underline">
                      +91 80000 00000
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-orange-100 text-xs mb-0.5">Support Hours</p>
                    <p className="font-semibold text-sm">Mon–Sat, 9 AM – 6 PM IST</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-orange-100 text-xs mb-0.5">Location</p>
                    <p className="font-semibold text-sm">India</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Response time */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">⚡ What to Expect</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {[
                  'Email replies within 24 hours',
                  'Technical issues resolved in 48 hours',
                  'Payment queries in 24 hours',
                ].map(t => (
                  <li key={t} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Strip */}
        <div className="mt-14">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Frequently Asked Questions</h2>
          <p className="text-gray-500 text-center mb-8 text-sm">Quick answers to common queries.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { q: 'How do I enroll in a course?', a: 'Browse exams, click "Buy Now", and complete payment. You get instant access.' },
              { q: 'What payment methods are accepted?', a: 'UPI, Net Banking, Credit/Debit cards and wallets via Razorpay\'s secure gateway.' },
              { q: 'How can I get a refund?', a: 'Email info@gridacademy.in within 7 days of purchase. Refunds process in 5–7 business days.' },
            ].map(({ q, a }) => (
              <div key={q} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">{q}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
