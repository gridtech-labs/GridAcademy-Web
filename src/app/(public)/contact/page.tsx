'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import PageIntro from '@/components/ui/PageIntro';
import { fieldClass, labelClass } from '@/components/auth/AuthShell';

const SUBJECTS = [
  'Course / Exam Enquiry',
  'Technical Support',
  'Payment / Billing',
  'Partnership / Collaboration',
  'Feedback / Suggestion',
  'Other',
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

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
    <div className="bg-white text-ink">
      <PageIntro
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
        eyebrow="Contact"
        title="How can we help?"
        description="Questions about tests, payments or partnerships — our team replies within 24 hours."
      />

      <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-8 md:py-12 grid lg:grid-cols-[1fr_340px] gap-8 lg:gap-12 items-start [&>*]:min-w-0">
        <div className="border border-line rounded-xl p-5 md:p-8 flex flex-col gap-5">
          <h2 className="text-xl md:text-2xl font-semibold">Send us a message</h2>

          {status === 'success' && (
            <div className="flex items-start gap-3 rounded-lg bg-[#e7f6ec] text-[#0b6b31] px-4 py-3">
              <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
              <p className="text-[15px]"><b>Message sent.</b> A confirmation is on its way to your email — we’ll reply within 24 hours.</p>
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-start gap-3 rounded-lg bg-[#fef3f2] border border-[#fecdca] text-[#b42318] px-4 py-3">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <p className="text-[15px]">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Full name</span>
                <input type="text" required placeholder="Your full name" value={form.name} onChange={set('name')} autoComplete="name" className={fieldClass()} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Email</span>
                <input type="email" required placeholder="you@example.com" value={form.email} onChange={set('email')} autoComplete="email" className={fieldClass()} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Phone <span className="font-normal text-[#667085]">(optional)</span></span>
                <input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} autoComplete="tel" className={fieldClass()} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Subject</span>
                <select required value={form.subject} onChange={set('subject')} className={fieldClass()}>
                  <option value="">Select a subject</option>
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </label>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Message</span>
              <textarea required minLength={10} rows={5} placeholder="Write your message here" value={form.message} onChange={set('message')}
                className={`${fieldClass()} h-auto py-3 resize-y`} />
            </label>
            <button type="submit" disabled={status === 'loading'}
              className="h-12 rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold inline-flex items-center justify-center gap-2">
              {status === 'loading' ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <Send className="w-[18px] h-[18px]" />}
              {status === 'loading' ? 'Sending…' : 'Send message'}
            </button>
            <p className="text-[13px] text-[#667085] text-center">We never share your details.</p>
          </form>
        </div>

        <aside className="flex flex-col gap-5">
          <div className="rounded-xl bg-ink text-white p-5 md:p-6">
            <h3 className="font-semibold text-lg mb-3">Get in touch</h3>
            <dl className="flex flex-col divide-y divide-white/10">
              <div className="py-2.5"><dt className="text-[13px] text-ink-muted">Email</dt><dd><a href="mailto:info@gridacademy.in" className="font-semibold hover:underline">info@gridacademy.in</a></dd></div>
              <div className="py-2.5"><dt className="text-[13px] text-ink-muted">Phone</dt><dd><a href="tel:+918000000000" className="font-semibold hover:underline">+91 80000 00000</a></dd></div>
              <div className="py-2.5"><dt className="text-[13px] text-ink-muted">Support hours</dt><dd className="font-semibold">Mon–Sat, 9 AM – 6 PM IST</dd></div>
            </dl>
          </div>
          <div className="border border-line rounded-xl p-5 md:p-6">
            <h3 className="font-semibold mb-3">What to expect</h3>
            <ul className="flex flex-col gap-2 text-[15px] text-[#344054]">
              {['Email replies within 24 hours', 'Technical issues resolved in 48 hours', 'Payment queries in 24 hours'].map(t => (
                <li key={t} className="flex items-start gap-2"><CheckCircle2 className="w-[18px] h-[18px] text-[#12803c] shrink-0 mt-0.5" />{t}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <section className="bg-paper border-t border-line">
        <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-10 md:py-12 flex flex-col gap-5">
          <h2 className="text-xl md:text-2xl font-semibold">Common questions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { q: 'How do I buy tests?', a: 'Open an exam and choose “Unlock all tests”. One payment unlocks every paid test in that exam, with lifetime access.' },
              { q: 'What payment methods are accepted?', a: 'UPI, net banking, credit/debit cards and wallets through Razorpay’s secure checkout.' },
              { q: 'How can I get a refund?', a: 'Email info@gridacademy.in within 7 days of purchase. Refunds are processed in 5–7 business days.' },
            ].map(({ q, a }) => (
              <div key={q} className="bg-white border border-line rounded-xl p-5">
                <h3 className="font-semibold mb-1.5">{q}</h3>
                <p className="text-sm leading-relaxed text-[#475467]">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
