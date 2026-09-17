import { Metadata } from 'next';
import Link from 'next/link';
import PageIntro from '@/components/ui/PageIntro';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about GridAcademy, India\'s trusted marketplace for competitive exam mock tests.',
  alternates: { canonical: 'https://www.gridacademy.in/about' },
};

const stats = [
  { label: 'Students enrolled',    value: '50,000+' },
  { label: 'Mock tests available', value: '1,200+' },
  { label: 'Coaching partners',    value: '100+' },
  { label: 'Exams covered',        value: '25+' },
];

const values = [
  { title: 'Our mission',        desc: 'To democratise access to quality exam preparation by connecting students with top coaching institutes across India.' },
  { title: 'Quality assurance',  desc: 'Every test on our platform is verified and curated by subject-matter experts to ensure exam-level accuracy.' },
  { title: 'Student-first',      desc: 'We design every feature with the student in mind — clear results, worked solutions and fair pricing.' },
  { title: 'Measurable results', desc: 'Students see exactly where they lose marks, section by section, so every mock moves them forward.' },
];

export default function AboutPage() {
  return (
    <div className="bg-white text-ink">
      <PageIntro
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
        eyebrow="About GridAcademy"
        title="Quality exam preparation for every student in India."
        description="India's marketplace for competitive exam mock tests — helping students prepare on the real exam interface."
      />

      <section className="max-w-[1100px] mx-auto px-4 md:px-6 py-10 md:py-14 grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-start">
        <div className="flex flex-col gap-4 text-base md:text-[17px] leading-relaxed text-[#344054]">
          <h2 className="text-2xl md:text-[28px] font-bold text-ink leading-tight">Our story</h2>
          <p>
            GridAcademy was founded with a single goal: make quality exam preparation accessible to every student in India,
            regardless of geography or budget. We saw talented students struggle not because of lack of effort, but because
            they lacked access to the right resources.
          </p>
          <p>
            Today, we partner with 100+ coaching institutes to bring their best mock tests directly to students across India.
            From SSC to UPSC, from banking exams to railway recruitment — GridAcademy covers it all.
          </p>
          <p>
            We believe in transparent pricing, real exam simulations, and clear results that help students understand
            exactly where they stand and what to work on next.
          </p>
        </div>
        <dl className="grid grid-cols-2 border-t border-l border-line">
          {stats.map(({ label, value }) => (
            <div key={label} className="border-r border-b border-line p-5 md:p-6">
              <dd className="font-mono font-semibold text-[28px] md:text-[32px] leading-none">{value}</dd>
              <dt className="text-sm text-[#475467] mt-2">{label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-paper border-y border-line">
        <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-10 md:py-14 flex flex-col gap-6">
          <h2 className="text-2xl md:text-[28px] font-bold leading-tight">What we stand for</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map(({ title, desc }) => (
              <div key={title} className="bg-white border border-line rounded-xl p-5 flex flex-col gap-2">
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-[#475467]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1100px] mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="rounded-xl bg-ink text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold">Ready to start preparing?</h2>
            <p className="text-ink-muted mt-1.5">Take a free mock test on the real exam interface, or get in touch with our team.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/exams" className="h-11 inline-flex items-center px-5 rounded-lg bg-primary font-semibold hover:bg-primary-dark">Browse exams</Link>
            <Link href="/contact" className="h-11 inline-flex items-center px-5 rounded-lg border border-white/30 font-semibold hover:bg-ink-soft">Contact us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
