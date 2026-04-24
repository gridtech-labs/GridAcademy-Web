import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Provider Agreement — GridAcademy',
  description: 'Terms and conditions for coaching institutes and providers on the GridAcademy platform.',
};

export default function ProviderAgreementPage() {
  return (
    <>
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="text-sm text-orange-100 mb-3">
            <a href="/" className="hover:text-white">Home</a>
            <span className="mx-2">/</span>
            <span className="text-white font-medium">Provider Agreement</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Provider Agreement</h1>
          <p className="text-orange-100">Last updated: April 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 prose prose-sm max-w-none text-gray-600">

          <p>This Provider Agreement (&quot;Agreement&quot;) governs the relationship between GridAcademy and coaching institutes or individual educators (&quot;Provider&quot;) who list content on our platform.</p>

          <h2 className="text-gray-900 font-bold text-lg mt-8 mb-3">1. Provider Eligibility</h2>
          <ul className="space-y-1">
            <li>Providers must be registered entities or individuals with verifiable credentials.</li>
            <li>Providers are responsible for the accuracy and quality of all content uploaded.</li>
            <li>GridAcademy reserves the right to approve or reject any provider application.</li>
          </ul>

          <h2 className="text-gray-900 font-bold text-lg mt-8 mb-3">2. Content Standards</h2>
          <ul className="space-y-1">
            <li>All questions and solutions must be accurate and exam-level quality.</li>
            <li>Content must not infringe on third-party copyrights.</li>
            <li>GridAcademy may review content before publishing and request corrections.</li>
            <li>Misleading, offensive, or low-quality content will be removed without notice.</li>
          </ul>

          <h2 className="text-gray-900 font-bold text-lg mt-8 mb-3">3. Revenue Share</h2>
          <ul className="space-y-1">
            <li>Providers receive <strong>70%</strong> of the net sale price after platform fees.</li>
            <li>GridAcademy retains <strong>30%</strong> as a platform commission.</li>
            <li>GST and payment gateway fees are deducted before the split.</li>
            <li>Payouts are processed on a monthly basis via bank transfer.</li>
          </ul>

          <h2 className="text-gray-900 font-bold text-lg mt-8 mb-3">4. Intellectual Property</h2>
          <p>Providers retain ownership of their content. By uploading to GridAcademy, Providers grant us a non-exclusive, worldwide licence to host, display, and sell the content on our platform.</p>

          <h2 className="text-gray-900 font-bold text-lg mt-8 mb-3">5. Termination</h2>
          <p>Either party may terminate this agreement with 30 days written notice. GridAcademy may immediately terminate for breach of content standards or fraud.</p>

          <h2 className="text-gray-900 font-bold text-lg mt-8 mb-3">6. Dispute Resolution</h2>
          <p>Disputes shall first be resolved through good-faith negotiation. If unresolved, disputes are subject to arbitration under Indian law.</p>

          <h2 className="text-gray-900 font-bold text-lg mt-8 mb-3">7. Contact</h2>
          <p>For provider-related queries, email us at <a href="mailto:info@gridacademy.in" className="text-orange-500">info@gridacademy.in</a> or <a href="/provider/register" className="text-orange-500">register as a provider</a>.</p>

        </div>
      </div>
    </>
  );
}
