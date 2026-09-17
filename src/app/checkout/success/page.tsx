import Link from 'next/link';
import StatusCard from '@/components/ui/StatusCard';

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { ref?: string; exam?: string };
}) {
  const examSlug = searchParams.exam;

  return (
    <StatusCard tone="success" title="Payment successful">
      <p className="text-[15px] text-[#475467] leading-relaxed">
        Your purchase is confirmed and every paid test in this exam is now unlocked, with lifetime access.
        A confirmation email is on its way.
      </p>
      {searchParams.ref && <p className="font-mono text-xs text-[#667085]">Ref: {searchParams.ref}</p>}
      <div className="w-full flex flex-col gap-2.5 mt-2">
        {examSlug && (
          <Link href={`/exam/${examSlug}`} className="h-12 inline-flex items-center justify-center rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark">
            Start your tests
          </Link>
        )}
        <Link href="/dashboard" className={`h-12 inline-flex items-center justify-center rounded-lg font-semibold ${examSlug ? 'border border-[#d0d5dd] hover:bg-paper' : 'bg-primary text-white hover:bg-primary-dark'}`}>
          Go to my tests
        </Link>
      </div>
    </StatusCard>
  );
}
