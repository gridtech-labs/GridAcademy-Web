'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

const SORTS = [
  ['popular',    'Most popular'],
  ['newest',     'Newest'],
  ['rating',     'Highest rated'],
  ['price_asc',  'Price: low to high'],
];

/** Price and sort filters for /exams/[slug] — link-based so they work without JS. */
export default function ExamListingFilters() {
  const pathname = usePathname();
  const params = useSearchParams();

  const href = (key: string, value: string | null) => {
    const sp = new URLSearchParams(params.toString());
    if (value === null) sp.delete(key); else sp.set(key, value);
    sp.delete('page');
    const qs = sp.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const free = params.get('free') === 'true';
  const sort = params.get('sort') ?? 'popular';

  const chip = (on: boolean) =>
    `h-9 inline-flex items-center px-3.5 rounded-full text-[13.5px] font-medium whitespace-nowrap ${on ? 'bg-ink text-white' : 'bg-[#f2f4f7] text-[#344054] hover:bg-[#e4e7ec]'}`;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
      <div className="flex gap-2">
        <Link href={href('free', null)} className={chip(!free)}>All</Link>
        <Link href={href('free', 'true')} className={chip(free)}>Free only</Link>
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {SORTS.map(([value, label]) => (
          <Link key={value} href={href('sort', value === 'popular' ? null : value)} className={chip(sort === value)}>{label}</Link>
        ))}
      </div>
    </div>
  );
}
