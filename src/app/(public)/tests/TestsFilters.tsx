'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const SORT_OPTIONS = [
  { value: '',         label: 'Relevance' },
  { value: 'popular',  label: 'Most Popular' },
  { value: 'newest',   label: 'Newest First' },
  { value: 'price_asc',label: 'Price: Low to High' },
];

export default function TestsFilters({ total }: { total: number }) {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery]   = useState(searchParams.get('q') ?? '');
  const sortBy              = searchParams.get('sortBy') ?? '';
  const isFree              = searchParams.get('free') === 'true';

  function buildUrl(overrides: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(overrides).forEach(([k, v]) => {
      if (v === null || v === '') params.delete(k);
      else params.set(k, v);
    });
    // always reset to page 1 when filters change
    params.delete('page');
    return `/tests?${params.toString()}`;
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    startTransition(() => router.push(buildUrl({ q: query || null })));
  }

  function handleSort(val: string) {
    startTransition(() => router.push(buildUrl({ sortBy: val || null })));
  }

  function handleFreeToggle() {
    startTransition(() => router.push(buildUrl({ free: isFree ? null : 'true' })));
  }

  return (
    <div className={cn(
      'bg-white border-b border-gray-200 sticky top-16 z-40 transition-opacity',
      isPending && 'opacity-60 pointer-events-none'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search tests, exams, subjects…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {query && (
              <button type="button" onClick={() => { setQuery(''); startTransition(() => router.push(buildUrl({ q: null }))); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button type="submit"
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors">
            Search
          </button>
        </form>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={e => handleSort(e.target.value)}
          className="text-sm border border-gray-300 rounded-xl px-3 py-2 focus:outline-none
                     focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer">
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Free toggle */}
        <button
          onClick={handleFreeToggle}
          className={cn(
            'text-sm font-medium px-4 py-2 rounded-xl border transition-colors whitespace-nowrap',
            isFree
              ? 'bg-green-600 text-white border-green-600'
              : 'bg-white text-gray-600 border-gray-300 hover:border-green-500 hover:text-green-700'
          )}>
          {isFree ? '✓ Free Only' : 'Free Only'}
        </button>

        {/* Result count */}
        <span className="text-sm text-gray-500 whitespace-nowrap shrink-0">
          {total} result{total !== 1 ? 's' : ''}
        </span>

      </div>
    </div>
  );
}
