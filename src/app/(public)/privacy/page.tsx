import { Metadata } from 'next';
import PageIntro from '@/components/ui/PageIntro';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How GridAcademy collects, uses, and protects your personal information.',
  alternates: { canonical: 'https://www.gridacademy.in/privacy' },
};

export default function PrivacyPage() {
  return (
    <>
      <PageIntro narrow crumbs={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]} title="Privacy Policy" description="Last updated: April 2026" />

      <div className="bg-white text-ink">
        <div className="max-w-[880px] mx-auto px-4 md:px-6 py-8 md:py-12 text-[16px] leading-[1.75] text-[#344054] [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_li]:mb-1.5 [&_strong]:text-ink [&_strong]:font-semibold [&_a]:text-primary-dark [&_a]:font-medium [&_a]:underline [&_table]:w-full [&_table]:text-sm [&_th]:text-left [&_th]:bg-[#f9fafb] [&_th]:px-3 [&_th]:py-2 [&_td]:px-3 [&_td]:py-2 [&_td]:border-t [&_td]:border-line">

          <p>GridAcademy (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the website <strong>www.gridacademy.in</strong>. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.</p>

          <h2 className="text-ink font-semibold text-xl mt-10 mb-3 leading-snug">1. Information We Collect</h2>
          <ul className="space-y-1.5">
            <li><strong>Account information:</strong> Name, email address, mobile number, and password when you register.</li>
            <li><strong>Usage data:</strong> Test attempts, scores, time spent, and exam history to provide analytics.</li>
            <li><strong>Payment data:</strong> Transaction IDs and order details. Card/UPI details are handled securely by Razorpay — we do not store payment credentials.</li>
            <li><strong>Device &amp; log data:</strong> IP address, browser type, and pages visited for security and performance.</li>
          </ul>

          <h2 className="text-ink font-semibold text-xl mt-10 mb-3 leading-snug">2. How We Use Your Information</h2>
          <ul className="space-y-1.5">
            <li>To create and manage your account.</li>
            <li>To process payments and deliver purchased content.</li>
            <li>To send important service notifications and exam updates.</li>
            <li>To improve our platform through analytics.</li>
            <li>To comply with legal obligations.</li>
          </ul>

          <h2 className="text-ink font-semibold text-xl mt-10 mb-3 leading-snug">3. Data Sharing</h2>
          <p>We do not sell your personal data. We may share data with:</p>
          <ul className="space-y-1.5">
            <li><strong>Coaching partners:</strong> Limited data to fulfil your test purchase.</li>
            <li><strong>Payment processors:</strong> Razorpay for secure payment handling.</li>
            <li><strong>Service providers:</strong> Hosting, analytics, and communication tools under strict confidentiality.</li>
            <li><strong>Legal authorities:</strong> When required by law.</li>
          </ul>

          <h2 className="text-ink font-semibold text-xl mt-10 mb-3 leading-snug">4. Data Security</h2>
          <p>We use industry-standard encryption (HTTPS/TLS), hashed passwords, and access controls to protect your data. However, no transmission over the internet is 100% secure.</p>

          <h2 className="text-ink font-semibold text-xl mt-10 mb-3 leading-snug">5. Your Rights</h2>
          <p>You may request access to, correction of, or deletion of your personal data by emailing us at <a href="mailto:info@gridacademy.in">info@gridacademy.in</a>.</p>

          <h2 className="text-ink font-semibold text-xl mt-10 mb-3 leading-snug">6. Cookies</h2>
          <p>We use essential cookies for authentication and analytics cookies (Google Analytics) to understand usage. You can disable cookies in your browser settings.</p>

          <h2 className="text-ink font-semibold text-xl mt-10 mb-3 leading-snug">7. Changes to This Policy</h2>
          <p>We may update this policy from time to time. We will notify you of significant changes via email or a notice on our website.</p>

          <h2 className="text-ink font-semibold text-xl mt-10 mb-3 leading-snug">8. Contact</h2>
          <p>For privacy-related queries, email us at <a href="mailto:info@gridacademy.in">info@gridacademy.in</a>.</p>

        </div>
      </div>
    </>
  );
}
