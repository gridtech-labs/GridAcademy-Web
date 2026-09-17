import Link from 'next/link';
import { ChevronRight, Star } from 'lucide-react';
import { TestSeries } from '@/types';
import { formatPrice } from '@/lib/utils';

const COLS = 'md:grid-cols-[minmax(0,1fr)_90px_110px_110px_24px]';

/** Marketplace test series as table rows (same row pattern as the exam list). */
export default function TestSeriesList({ series }: { series: TestSeries[] }) {
  return (
    <div className="bg-white border border-line rounded-xl overflow-hidden">
      <div className={`hidden md:grid ${COLS} gap-4 px-5 py-2.5 bg-[#f9fafb] border-b border-line text-[12.5px] font-semibold text-[#475467]`}>
        <span>Test series</span><span>Tests</span><span>Rating</span><span>Price</span><span />
      </div>
      <ul className="divide-y divide-[#eef0f3]">
        {series.map(s => {
          const rated = s.reviewCount > 0;
          const free = s.priceInr === 0;
          return (
            <li key={s.id}>
              <Link href={`/test/${s.slug}`}
                className={`group grid grid-cols-[minmax(0,1fr)_20px] ${COLS} gap-x-4 items-center px-4 md:px-5 py-3.5 md:py-4 hover:bg-[#f7f9fc] focus-visible:bg-[#f7f9fc] focus-visible:outline-none`}>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-[15.5px] leading-snug group-hover:text-primary-dark">{s.title}</span>
                    {s.isFirstTestFree && !free && (
                      <span className="h-[22px] inline-flex items-center px-2 rounded-full bg-[#e7f6ec] text-[#0b6b31] text-[11.5px] font-medium">Free preview</span>
                    )}
                  </div>
                  <p className="text-[13px] text-[#667085] mt-0.5 truncate">
                    {[s.providerName, s.examType].filter(Boolean).join(' · ')}
                  </p>
                  <p className="md:hidden text-[13px] text-[#475467] mt-1.5 flex items-center gap-1 flex-wrap">
                    <span><span className="font-mono">{s.testCount}</span> test{s.testCount === 1 ? '' : 's'}</span>
                    {rated && <><span className="text-[#98a2b3]">·</span><Star className="w-3.5 h-3.5 fill-saffron text-saffron" />{s.avgRating.toFixed(1)}</>}
                    <span className="text-[#98a2b3]">·</span>
                    <span className={free ? 'text-[#0b6b31] font-medium' : ''}>{free ? 'Free' : formatPrice(s.priceInr)}</span>
                  </p>
                </div>
                <span className="hidden md:block font-mono text-sm text-[#344054]">{s.testCount}</span>
                <span className="hidden md:flex items-center gap-1 text-sm text-[#344054]">
                  {rated
                    ? <><Star className="w-3.5 h-3.5 fill-saffron text-saffron" />{s.avgRating.toFixed(1)} <span className="text-[#667085]">({s.reviewCount})</span></>
                    : <span className="text-[#98a2b3]">—</span>}
                </span>
                <span className={`hidden md:block text-sm ${free ? 'text-[#0b6b31] font-medium' : 'text-[#344054]'}`}>{free ? 'Free' : formatPrice(s.priceInr)}</span>
                <ChevronRight className="w-[18px] h-[18px] text-[#98a2b3] group-hover:text-primary justify-self-end" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
