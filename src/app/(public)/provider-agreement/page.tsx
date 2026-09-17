import { Metadata } from 'next';
import PageIntro from '@/components/ui/PageIntro';

export const metadata: Metadata = {
  title: 'Provider Agreement — GridAcademy',
  description: 'Terms and conditions for coaching institutes and providers on the GridAcademy platform.',
};

export default function ProviderAgreementPage() {
  return (
    <>
      <PageIntro narrow crumbs={[{ label: 'Home', href: '/' }, { label: 'Provider Agreement' }]} title="Provider Agreement" description="Last updated: April 2026" />

      <div className="bg-white text-ink">
        <div className="max-w-[880px] mx-auto px-4 md:px-6 py-8 md:py-12 text-[16px] leading-[1.75] text-[#344054] [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_li]:mb-1.5 [&_strong]:text-ink [&_strong]:font-semibold [&_a]:text-primary-dark [&_a]:font-medium [&_a]:underline [&_table]:w-full [&_table]:text-sm [&_th]:text-left [&_th]:bg-[#f9fafb] [&_th]:px-3 [&_th]:py-2 [&_td]:px-3 [&_td]:py-2 [&_td]:border-t [&_td]:border-line">

          <p>This Provider Agreement (&quot;Agreement&quot;) governs the relationship between GridAcademy and coaching institutes or individual educators (&quot;Provider&quot;) who list content on our platform.</p>

          <h2 className="text-ink font-semibold text-xl mt-10 mb-3 leading-snug">1. Provider Eligibility</h2>
          <ul className="space-y-1.5">
            <li>Providers must be registered entities or individuals with verifiable credentials.</li>
            <li>Providers are responsible for the accuracy and quality of all content uploaded.</li>
            <li>GridAcademy reserves the right to approve or reject any provider application.</li>
          </ul>

          <h2 className="text-ink font-semibold text-xl mt-10 mb-3 leading-snug">2. Content Standards</h2>
          <ul className="space-y-1.5">
            <li>All questions and solutions must be accurate and exam-level quality.</li>
            <li>Content must not infringe on third-party copyrights.</li>
            <li>GridAcademy may review content before publishing and request corrections.</li>
            <li>Misleading, offensive, or low-quality content will be removed without notice.</li>
          </ul>

          <h2 className="text-ink font-semibold text-xl mt-10 mb-3 leading-snug">3. Revenue Share</h2>
          <ul className="space-y-1.5">
            <li>Providers receive <strong>70%</strong> of the net sale price after platform fees.</li>
            <li>GridAcademy retains <strong>30%</strong> as a platform commission.</li>
            <li>GST and payment gateway fees are deducted before the split.</li>
            <li>Payouts are processed on a monthly basis via bank transfer.</li>
          </ul>

          <h2 className="text-ink font-semibold text-xl mt-10 mb-3 leading-snug">4. Intellectual Property</h2>
          <p>Providers retain ownership of their content. By uploading to GridAcademy, Providers grant us a non-exclusive, worldwide licence to host, display, and sell the content on our platform.</p>

          <h2 className="text-ink font-semibold text-xl mt-10 mb-3 leading-snug">5. Termination</h2>
          <p>Either party may terminate this agreement with 30 days written notice. GridAcademy may immediately terminate for breach of content standards or fraud.</p>

          <h2 className="text-ink font-semibold text-xl mt-10 mb-3 leading-snug">6. Dispute Resolution</h2>
          <p>Disputes shall first be resolved through good-faith negotiation. If unresolved, disputes are subject to arbitration under Indian law.</p>

          <h2 className="text-ink font-semibold text-xl mt-10 mb-3 leading-snug">7. Contact</h2>
          <p>For provider-related queries, email us at <a href="mailto:info@gridacademy.in">info@gridacademy.in</a> or <a href="/provider/register">register as a provider</a>.</p>

        </div>
      </div>
    </>
  );
}
