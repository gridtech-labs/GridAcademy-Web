import { Metadata } from 'next';
import Link from 'next/link';
import { Download } from 'lucide-react';
import PageIntro from '@/components/ui/PageIntro';

export const metadata: Metadata = {
  title: 'NEET 2027 Week 2 Target — Study Material',
  description: 'Download NEET 2027 Week 2 Target study material (8–14 July). Free on GridAcademy.',
};

export default function NeetWeek2DownloadPage() {
  return (
    <div className="bg-white text-ink">
      <PageIntro
        narrow
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Resources', href: '/blog' }, { label: 'NEET 2027 Week 2' }]}
        eyebrow="Free study material · PDF"
        title="NEET 2027 — Week 2 target"
        description="Revision pack for 8–14 July: day-by-day targets for Physics, Chemistry and Biology."
      />
      <div className="max-w-[880px] mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="border border-line rounded-xl p-5 md:p-7 flex flex-col sm:flex-row sm:items-center gap-5">
          <dl className="flex-1 grid grid-cols-3 gap-4">
            {[['Week', '8–14 July'], ['For', 'NEET 2027'], ['Format', 'PDF']].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[13px] text-[#667085]">{k}</dt>
                <dd className="font-semibold mt-0.5">{v}</dd>
              </div>
            ))}
          </dl>
          <a href="/api/download/neet-week2"
            className="h-12 inline-flex items-center justify-center gap-2 px-6 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark">
            <Download className="w-[18px] h-[18px]" /> Download PDF
          </a>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl bg-paper border border-line p-5">
          <p className="flex-1 text-[15px] text-[#344054]">Test what you’ve revised with a full-length NEET mock on the real exam interface.</p>
          <Link href="/exams?stream=neet" className="h-11 inline-flex items-center justify-center px-5 rounded-lg border border-[#d0d5dd] bg-white font-semibold hover:bg-[#f2f4f7]">
            NEET mock tests
          </Link>
        </div>
      </div>
    </div>
  );
}
