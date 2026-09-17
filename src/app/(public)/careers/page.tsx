import { Metadata } from 'next';
import PageIntro from '@/components/ui/PageIntro';

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join the GridAcademy team and help shape the future of exam preparation in India.',
};

export default function CareersPage() {
  return (
    <div className="bg-white text-ink">
      <PageIntro
        narrow
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Careers' }]}
        eyebrow="Careers"
        title="Help shape exam preparation in India."
      />
      <div className="max-w-[880px] mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="border border-line rounded-xl p-6 md:p-8 flex flex-col gap-3">
          <h2 className="text-xl md:text-2xl font-semibold">No open positions right now</h2>
          <p className="text-base leading-relaxed text-[#475467]">
            We&apos;re not actively hiring at the moment, but we&apos;re always happy to meet talented people.
            Send us your resume and we&apos;ll reach out when something comes up.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2">
            <a href="mailto:info@gridacademy.in?subject=Career%20Enquiry"
              className="h-11 inline-flex items-center justify-center px-5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark">
              Send your resume
            </a>
            <span className="text-sm text-[#667085]">info@gridacademy.in</span>
          </div>
        </div>
      </div>
    </div>
  );
}
