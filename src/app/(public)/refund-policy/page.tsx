import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy — GridAcademy',
  description: 'GridAcademy refund and cancellation policy for mock test purchases.',
};

export default function RefundPolicyPage() {
  return (
    <>
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="text-sm text-orange-100 mb-3">
            <a href="/" className="hover:text-white">Home</a>
            <span className="mx-2">/</span>
            <span className="text-white font-medium">Refund Policy</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Refund Policy</h1>
          <p className="text-orange-100">Last updated: April 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 prose prose-sm max-w-none text-gray-600">

          <p>At GridAcademy, we want you to be completely satisfied with your purchase. Please read this policy carefully before purchasing.</p>

          <h2 className="text-gray-900 font-bold text-lg mt-8 mb-3">1. Eligibility for Refund</h2>
          <p>You may request a full refund within <strong>7 days of purchase</strong> if:</p>
          <ul className="space-y-1">
            <li>You have not attempted more than 1 test from the series.</li>
            <li>The content is significantly different from what was described.</li>
            <li>A technical issue prevented you from accessing the content and we were unable to resolve it.</li>
          </ul>

          <h2 className="text-gray-900 font-bold text-lg mt-8 mb-3">2. Non-Refundable Cases</h2>
          <ul className="space-y-1">
            <li>Requests made after 7 days of purchase.</li>
            <li>Series where more than 1 test has been attempted.</li>
            <li>Change of mind or accidental purchases (after access has been granted).</li>
            <li>Free or discounted purchases.</li>
          </ul>

          <h2 className="text-gray-900 font-bold text-lg mt-8 mb-3">3. How to Request a Refund</h2>
          <p>Email us at <a href="mailto:info@gridacademy.in" className="text-orange-500">info@gridacademy.in</a> with:</p>
          <ul className="space-y-1">
            <li>Your registered email address</li>
            <li>Order ID / Transaction ID</li>
            <li>Reason for the refund request</li>
          </ul>

          <h2 className="text-gray-900 font-bold text-lg mt-8 mb-3">4. Refund Processing</h2>
          <p>Approved refunds are processed within <strong>5–7 business days</strong> to the original payment method. Processing times may vary depending on your bank.</p>

          <h2 className="text-gray-900 font-bold text-lg mt-8 mb-3">5. Contact</h2>
          <p>For refund-related queries, contact us at <a href="mailto:info@gridacademy.in" className="text-orange-500">info@gridacademy.in</a>.</p>

        </div>
      </div>
    </>
  );
}
