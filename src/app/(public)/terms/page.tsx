import { Metadata } from 'next';
import PageIntro from '@/components/ui/PageIntro';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions governing use of the GridAcademy platform.',
  alternates: { canonical: 'https://www.gridacademy.in/terms' },
};

export default function TermsPage() {
  return (
    <>
      <PageIntro narrow crumbs={[{ label: 'Home', href: '/' }, { label: 'Terms of Service' }]} title="Terms of Service" description="Last updated: April 2026" />

      <div className="bg-white text-ink">
        <div className="max-w-[880px] mx-auto px-4 md:px-6 py-8 md:py-12 text-[16px] leading-[1.75] text-[#344054] [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_li]:mb-1.5 [&_strong]:text-ink [&_strong]:font-semibold [&_a]:text-primary-dark [&_a]:font-medium [&_a]:underline [&_table]:w-full [&_table]:text-sm [&_th]:text-left [&_th]:bg-[#f9fafb] [&_th]:px-3 [&_th]:py-2 [&_td]:px-3 [&_td]:py-2 [&_td]:border-t [&_td]:border-line">

          <p>By accessing or using GridAcademy (&quot;Platform&quot;, &quot;we&quot;, &quot;us&quot;), you agree to be bound by these Terms of Service. If you disagree with any part, please do not use our Platform.</p>

          <h2 className="text-ink font-semibold text-xl mt-10 mb-3 leading-snug">1. Use of the Platform</h2>
          <ul className="space-y-1.5">
            <li>You must be at least 13 years old to create an account.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You agree not to use the Platform for any unlawful purpose or to violate any laws.</li>
            <li>Sharing of test content, questions, or answers outside the Platform is strictly prohibited.</li>
          </ul>

          <h2 className="text-ink font-semibold text-xl mt-10 mb-3 leading-snug">2. Purchases &amp; Payments</h2>
          <ul className="space-y-1.5">
            <li>All prices are in Indian Rupees (INR) and inclusive of applicable taxes unless stated otherwise.</li>
            <li>Payments are processed securely via Razorpay.</li>
            <li>Access to purchased content is granted upon successful payment confirmation.</li>
          </ul>

          <h2 className="text-ink font-semibold text-xl mt-10 mb-3 leading-snug">3. Intellectual Property</h2>
          <p>All content on the Platform — including questions, solutions, design, and code — is owned by GridAcademy or its coaching partners and is protected by Indian copyright law. Unauthorised reproduction or distribution is prohibited.</p>

          <h2 className="text-ink font-semibold text-xl mt-10 mb-3 leading-snug">4. Disclaimer of Warranties</h2>
          <p>The Platform is provided &quot;as is&quot; without warranties of any kind. We do not guarantee that use of our mock tests will result in exam success, though we strive to provide the highest quality content.</p>

          <h2 className="text-ink font-semibold text-xl mt-10 mb-3 leading-snug">5. Limitation of Liability</h2>
          <p>GridAcademy shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Platform.</p>

          <h2 className="text-ink font-semibold text-xl mt-10 mb-3 leading-snug">6. Termination</h2>
          <p>We reserve the right to suspend or terminate accounts that violate these terms without prior notice.</p>

          <h2 className="text-ink font-semibold text-xl mt-10 mb-3 leading-snug">7. Governing Law</h2>
          <p>These terms are governed by the laws of India. Disputes shall be subject to the jurisdiction of courts in India.</p>

          <h2 className="text-ink font-semibold text-xl mt-10 mb-3 leading-snug">8. Contact</h2>
          <p>Questions about these Terms? Email us at <a href="mailto:info@gridacademy.in">info@gridacademy.in</a>.</p>

        </div>
      </div>
    </>
  );
}
