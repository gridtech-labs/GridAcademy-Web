import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — GridAcademy',
  description: 'How GridAcademy collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <>
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="text-sm text-orange-100 mb-3">
            <a href="/" className="hover:text-white">Home</a>
            <span className="mx-2">/</span>
            <span className="text-white font-medium">Privacy Policy</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-orange-100">Last updated: April 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 prose prose-sm max-w-none text-gray-600">

          <p>GridAcademy (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the website <strong>www.gridacademy.in</strong>. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.</p>

          <h2 className="text-gray-900 font-bold text-lg mt-8 mb-3">1. Information We Collect</h2>
          <ul className="space-y-1">
            <li><strong>Account information:</strong> Name, email address, mobile number, and password when you register.</li>
            <li><strong>Usage data:</strong> Test attempts, scores, time spent, and exam history to provide analytics.</li>
            <li><strong>Payment data:</strong> Transaction IDs and order details. Card/UPI details are handled securely by Razorpay — we do not store payment credentials.</li>
            <li><strong>Device &amp; log data:</strong> IP address, browser type, and pages visited for security and performance.</li>
          </ul>

          <h2 className="text-gray-900 font-bold text-lg mt-8 mb-3">2. How We Use Your Information</h2>
          <ul className="space-y-1">
            <li>To create and manage your account.</li>
            <li>To process payments and deliver purchased content.</li>
            <li>To send important service notifications and exam updates.</li>
            <li>To improve our platform through analytics.</li>
            <li>To comply with legal obligations.</li>
          </ul>

          <h2 className="text-gray-900 font-bold text-lg mt-8 mb-3">3. Data Sharing</h2>
          <p>We do not sell your personal data. We may share data with:</p>
          <ul className="space-y-1">
            <li><strong>Coaching partners:</strong> Limited data to fulfil your test purchase.</li>
            <li><strong>Payment processors:</strong> Razorpay for secure payment handling.</li>
            <li><strong>Service providers:</strong> Hosting, analytics, and communication tools under strict confidentiality.</li>
            <li><strong>Legal authorities:</strong> When required by law.</li>
          </ul>

          <h2 className="text-gray-900 font-bold text-lg mt-8 mb-3">4. Data Security</h2>
          <p>We use industry-standard encryption (HTTPS/TLS), hashed passwords, and access controls to protect your data. However, no transmission over the internet is 100% secure.</p>

          <h2 className="text-gray-900 font-bold text-lg mt-8 mb-3">5. Your Rights</h2>
          <p>You may request access to, correction of, or deletion of your personal data by emailing us at <a href="mailto:info@gridacademy.in" className="text-orange-500">info@gridacademy.in</a>.</p>

          <h2 className="text-gray-900 font-bold text-lg mt-8 mb-3">6. Cookies</h2>
          <p>We use essential cookies for authentication and analytics cookies (Google Analytics) to understand usage. You can disable cookies in your browser settings.</p>

          <h2 className="text-gray-900 font-bold text-lg mt-8 mb-3">7. Changes to This Policy</h2>
          <p>We may update this policy from time to time. We will notify you of significant changes via email or a notice on our website.</p>

          <h2 className="text-gray-900 font-bold text-lg mt-8 mb-3">8. Contact</h2>
          <p>For privacy-related queries, email us at <a href="mailto:info@gridacademy.in" className="text-orange-500">info@gridacademy.in</a>.</p>

        </div>
      </div>
    </>
  );
}
