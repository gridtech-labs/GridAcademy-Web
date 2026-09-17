import { Metadata } from 'next';
import PageIntro from '@/components/ui/PageIntro';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'GridAcademy refund and cancellation policy for mock test purchases.',
  alternates: { canonical: 'https://www.gridacademy.in/refund-policy' },
};

export default function RefundPolicyPage() {
  return (
    <>
      <PageIntro narrow crumbs={[{ label: 'Home', href: '/' }, { label: 'Refund Policy' }]} title="Refund Policy" description="Last updated: April 2026" />

      <div className="bg-white text-ink">
        <div className="max-w-[880px] mx-auto px-4 md:px-6 py-8 md:py-12 text-[16px] leading-[1.75] text-[#344054] [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_li]:mb-1.5 [&_strong]:text-ink [&_strong]:font-semibold [&_a]:text-primary-dark [&_a]:font-medium [&_a]:underline [&_table]:w-full [&_table]:text-sm [&_th]:text-left [&_th]:bg-[#f9fafb] [&_th]:px-3 [&_th]:py-2 [&_td]:px-3 [&_td]:py-2 [&_td]:border-t [&_td]:border-line">

          <p>At GridAcademy, we want you to be completely satisfied with your purchase. Please read this policy carefully before purchasing.</p>

          <h2 className="text-ink font-semibold text-xl mt-10 mb-3 leading-snug">1. Eligibility for Refund</h2>
          <p>You may request a full refund within <strong>7 days of purchase</strong> if:</p>
          <ul className="space-y-1.5">
            <li>You have not attempted more than 1 test from the series.</li>
            <li>The content is significantly different from what was described.</li>
            <li>A technical issue prevented you from accessing the content and we were unable to resolve it.</li>
          </ul>

          <h2 className="text-ink font-semibold text-xl mt-10 mb-3 leading-snug">2. Non-Refundable Cases</h2>
          <ul className="space-y-1.5">
            <li>Requests made after 7 days of purchase.</li>
            <li>Series where more than 1 test has been attempted.</li>
            <li>Change of mind or accidental purchases (after access has been granted).</li>
            <li>Free or discounted purchases.</li>
          </ul>

          <h2 className="text-ink font-semibold text-xl mt-10 mb-3 leading-snug">3. How to Request a Refund</h2>
          <p>Email us at <a href="mailto:info@gridacademy.in">info@gridacademy.in</a> with:</p>
          <ul className="space-y-1.5">
            <li>Your registered email address</li>
            <li>Order ID / Transaction ID</li>
            <li>Reason for the refund request</li>
          </ul>

          <h2 className="text-ink font-semibold text-xl mt-10 mb-3 leading-snug">4. Refund Processing</h2>
          <p>Approved refunds are processed within <strong>5–7 business days</strong> to the original payment method. Processing times may vary depending on your bank.</p>

          <h2 className="text-ink font-semibold text-xl mt-10 mb-3 leading-snug">5. Contact</h2>
          <p>For refund-related queries, contact us at <a href="mailto:info@gridacademy.in">info@gridacademy.in</a>.</p>

        </div>
      </div>
    </>
  );
}
