import Link from 'next/link';
import { Star } from 'lucide-react';
import { TestSeries } from '@/types';
import { formatPrice, formatDuration, cn } from '@/lib/utils';

interface TestCardProps {
  series: TestSeries;
  className?: string;
}

/** Marketplace test-series card (provider-sold series). */
export default function TestCard({ series, className }: TestCardProps) {
  return (
    <Link href={`/test/${series.slug}`}
      className={cn(
        'group bg-white border border-line rounded-xl p-5 flex flex-col gap-3 hover:border-primary/40 hover:shadow-[0_8px_24px_-12px_rgba(14,23,38,.18)] transition',
        className,
      )}>
      <div className="flex items-center justify-between gap-2 min-h-[22px]">
        <span className="text-[13px] text-[#667085] truncate">{series.providerName}</span>
        {series.isFirstTestFree && (
          <span className="h-[22px] inline-flex items-center px-2 rounded-full bg-[#e7f6ec] text-[#0b6b31] text-[11.5px] font-medium shrink-0">Free preview</span>
        )}
      </div>
      <h3 className="text-[17px] font-semibold leading-snug line-clamp-2 group-hover:text-primary-dark">{series.title}</h3>
      <div className="flex flex-wrap gap-2">
        {series.examType && (
          <span className="h-[26px] inline-flex items-center px-2.5 rounded-full bg-primary-tint text-primary-dark text-[12.5px] font-medium">{series.examType}</span>
        )}
        <span className="h-[26px] inline-flex items-center px-2.5 rounded-full bg-[#f2f4f7] text-[#344054] text-[12.5px] font-medium">
          {series.testCount} test{series.testCount === 1 ? '' : 's'} · {formatDuration(series.durationMinutes * 60)}
        </span>
      </div>
      {series.reviewCount > 0 && (
        <p className="flex items-center gap-1 text-[13px] text-[#475467]">
          <Star className="w-3.5 h-3.5 fill-saffron text-saffron" />
          <b className="text-ink">{series.avgRating.toFixed(1)}</b> ({series.reviewCount})
        </p>
      )}
      <div className="h-px bg-line mt-auto" />
      <div className="flex items-center justify-between">
        {series.priceInr === 0
          ? <b className="text-[15px] text-[#0b6b31]">Free</b>
          : <b className="text-[15px]">{formatPrice(series.priceInr)}</b>}
        <span className="text-sm font-semibold text-primary-dark">View details</span>
      </div>
    </Link>
  );
}
