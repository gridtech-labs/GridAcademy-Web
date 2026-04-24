import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — GridAcademy',
  description: 'Terms and conditions governing use of the GridAcademy platform.',
};

export default function TermsPage() {
  return (
    <>
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="text-sm text-orange-100 mb-3">
            <a href="/" className="hover:text-white">Home</a>
            <span className="mx-2">/</span>
            <span className="text-white font-medium">Terms of Service</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-orange-100">Last updated: April 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 prose prose-sm max-w-none text-gray-600">

          <p>By accessing or using GridAcademy (&quot;Platform&quot;, &quot;we&quot;, &quot;us&quot;), you agree to be bound by these Terms of Service. If you disagree with any part, please do not use our Platform.</p>

          <h2 className="text-gray-900 font-bold text-lg mt-8 mb-3">1. Use of the Platform</h2>
          <ul className="space-y-1">
            <li>You must be at least 13 years old to create an account.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You agree not to use the Platform for any unlawful purpose or to violate any laws.</li>
            <li>Sharing of test content, questions, or answers outside the Platform is strictly prohibited.</li>
          </ul>

          <h2 className="text-gray-900 font-bold text-lg mt-8 mb-3">2. Purchases &amp; Payments</h2>
          <ul className="space-y-1">
            <li>All prices are in Indian Rupees (INR) and inclusive of applicable taxes unless stated otherwise.</li>
            <li>Payments are processed securely via Razorpay.</li>
            <li>Access to purchased content is granted upon successful payment confirmation.</li>
          </ul>

          <h2 className="text-gray-900 font-bold text-lg mt-8 mb-3">3. Intellectual Property</h2>
          <p>All content on the Platform — including questions, solutions, design, and code — is owned by GridAcademy or its coaching partners and is protected by Indian copyright law. Unauthorised reproduction or distribution is prohibited.</p>

          <h2 className="text-gray-900 font-bold text-lg mt-8 mb-3">4. Disclaimer of Warranties</h2>
          <p>The Platform is provided &quot;as is&quot; without warranties of any kind. We do not guarantee that use of our mock tests will result in exam success, though we strive to provide the highest quality content.</p>

          <h2 className="text-gray-900 font-bold text-lg mt-8 mb-3">5. Limitation of Liability</h2>
          <p>GridAcademy shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Platform.</p>

          <h2 className="text-gray-900 font-bold text-lg mt-8 mb-3">6. Termination</h2>
          <p>We reserve the right to suspend or terminate accounts that violate these terms without prior notice.</p>

          <h2 className="text-gray-900 font-bold text-lg mt-8 mb-3">7. Governing Law</h2>
          <p>These terms are governed by the laws of India. Disputes shall be subject to the jurisdiction of courts in India.</p>

          <h2 className="text-gray-900 font-bold text-lg mt-8 mb-3">8. Contact</h2>
          <p>Questions about these Terms? Email us at <a href="mailto:info@gridacademy.in" className="text-orange-500">info@gridacademy.in</a>.</p>

        </div>
      </div>
    </>
  );
}
