'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const SORT_OPTIONS = [
  { value: '',          label: 'Relevance' },
  { value: 'popular',   label: 'Most popular' },
  { value: 'newest',    label: 'Newest first' },
  { value: 'price_asc', label: 'Price: low to high' },
];

export default function TestsFilters({ total }: { total: number }) {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const sortBy            = searchParams.get('sortBy') ?? '';
  const isFree            = searchParams.get('free') === 'true';

  function buildUrl(overrides: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(overrides).forEach(([k, v]) => {
      if (v === null || v === '') params.delete(k);
      else params.set(k, v);
    });
    params.delete('page'); // filters always reset to page 1
    return `/tests?${params.toString()}`;
  }

  const go = (url: string) => startTransition(() => router.push(url));

  return (
    <div className={cn('flex flex-col md:flex-row gap-3 md:items-center transition-opacity', isPending && 'opacity-60 pointer-events-none')}>
      <form onSubmit={e => { e.preventDefault(); go(buildUrl({ q: query || null })); }} role="search" className="relative flex-1 md:max-w-[440px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#667085] pointer-events-none" />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tests, exams, providers" aria-label="Search test series"
          className="w-full h-11 pl-10 pr-10 rounded-lg border border-[#d0d5dd] bg-white text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        {query && (
          <button type="button" aria-label="Clear search" onClick={() => { setQuery(''); go(buildUrl({ q: null })); }}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-[#667085] hover:text-ink">
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      <div className="flex items-center gap-2">
        <select value={sortBy} onChange={e => go(buildUrl({ sortBy: e.target.value || null }))} aria-label="Sort"
          className="h-11 px-3 rounded-lg border border-[#d0d5dd] bg-white text-[14.5px] focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <button onClick={() => go(buildUrl({ free: isFree ? null : 'true' }))} aria-pressed={isFree}
          className={cn('h-11 px-4 rounded-lg text-[14.5px] font-semibold whitespace-nowrap border',
            isFree ? 'bg-ink text-white border-ink' : 'bg-white text-[#344054] border-[#d0d5dd] hover:bg-paper')}>
          Free only
        </button>
      </div>

      <span className="text-sm text-[#667085] md:ml-auto whitespace-nowrap">{total} result{total !== 1 ? 's' : ''}</span>
    </div>
  );
}
