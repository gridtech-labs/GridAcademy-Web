import Link from 'next/link';
import StatusCard from '@/components/ui/StatusCard';

export default function CheckoutFailedPage({
  searchParams,
}: {
  searchParams: { ref?: string; exam?: string };
}) {
  const examSlug = searchParams.exam;

  return (
    <StatusCard tone="error" title="Payment failed">
      <p className="text-[15px] text-[#475467] leading-relaxed">
        Your payment could not be processed. Please try again, or contact support if the issue persists.
      </p>
      {searchParams.ref && <p className="font-mono text-xs text-[#667085]">Ref: {searchParams.ref}</p>}
      <div className="w-full flex flex-col gap-2.5 mt-2">
        <Link href={examSlug ? `/exam/${examSlug}` : '/exams'} className="h-12 inline-flex items-center justify-center rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark">
          {examSlug ? 'Try again' : 'Browse exams'}
        </Link>
        <Link href="/" className="h-12 inline-flex items-center justify-center rounded-lg border border-[#d0d5dd] font-semibold hover:bg-paper">
          Back to home
        </Link>
      </div>
      <p className="text-[13px] text-[#667085]">
        Need help? <a href="mailto:support@gridacademy.in" className="font-semibold text-primary-dark hover:underline">Contact support</a>
      </p>
    </StatusCard>
  );
}
