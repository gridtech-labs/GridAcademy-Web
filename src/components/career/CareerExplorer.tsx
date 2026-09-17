'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CAREER_CATEGORIES, CAREERS } from '@/data/careers';
import type { Career } from '@/types/career';
import CareerCard from './CareerCard';

type CostFilter = 'all' | 'free' | 'under500' | 'paid';

interface CareerExplorerProps {
  initialCategory?: string;
  initialSearch?: string;
  initialCost?: string;
}

function matchesCost(career: Career, filter: CostFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'free') return career.costInr === 0;
  if (filter === 'under500') return career.costInr < 500;
  if (filter === 'paid') return career.costInr > 0;
  return true;
}

export default function CareerExplorer({
  initialCategory = '',
  initialSearch = '',
  initialCost = '',
}: CareerExplorerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [costFilter, setCostFilter] = useState<CostFilter>(
    (initialCost as CostFilter) || 'all'
  );

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync to URL whenever filters change
  const pushParams = useCallback(
    (cat: string, q: string, cost: CostFilter) => {
      const params = new URLSearchParams(searchParams.toString());
      if (cat) params.set('category', cat);
      else params.delete('category');
      if (q) params.set('q', q);
      else params.delete('q');
      if (cost && cost !== 'all') params.set('cost', cost);
      else params.delete('cost');
      router.replace(`/career-guide?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handleCategoryChange = (slug: string) => {
    const next = slug === activeCategory ? '' : slug;
    setActiveCategory(next);
    pushParams(next, searchQuery, costFilter);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      pushParams(activeCategory, value, costFilter);
    }, 300);
  };

  const handleCostChange = (value: CostFilter) => {
    setCostFilter(value);
    pushParams(activeCategory, searchQuery, value);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  // Derive filtered careers
  const filtered = CAREERS.filter((career) => {
    const catMatch = !activeCategory || career.category === activeCategory;
    const costMatch = matchesCost(career, costFilter);
    const qLower = searchQuery.toLowerCase();
    const textMatch =
      !qLower ||
      career.name.toLowerCase().includes(qLower) ||
      career.what.toLowerCase().includes(qLower) ||
      career.firstStep.toLowerCase().includes(qLower);
    return catMatch && costMatch && textMatch;
  });

  const costOptions: { value: CostFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'free', label: 'Free to Start' },
    { value: 'under500', label: 'Under ₹500' },
    { value: 'paid', label: 'Paid' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Search */}
      <input
        type="search"
        placeholder="Search careers"
        aria-label="Search careers"
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="w-full md:max-w-[440px] h-11 rounded-lg border border-[#d0d5dd] bg-white px-3.5 text-[15px] placeholder:text-[#98a2b3] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryChange('')}
          className={`h-9 rounded-full px-3.5 text-[13.5px] font-medium transition-colors ${
            !activeCategory ? 'bg-ink text-white' : 'bg-[#f2f4f7] text-[#344054] hover:bg-[#e4e7ec]'
          }`}
        >
          All
        </button>
        {CAREER_CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => handleCategoryChange(cat.slug)}
            className={`h-9 inline-flex items-center rounded-full px-3.5 text-[13.5px] font-medium transition-colors ${
              activeCategory === cat.slug ? 'bg-ink text-white' : 'bg-[#f2f4f7] text-[#344054] hover:bg-[#e4e7ec]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Cost filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[13px] font-medium text-[#667085]">Cost</span>
        {costOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleCostChange(opt.value)}
            className={`h-8 rounded-full px-3 text-[13px] font-medium transition-colors ${
              costFilter === opt.value ? 'bg-primary-tint text-primary-dark' : 'bg-white border border-line text-[#344054] hover:bg-paper'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-[#667085]">
        Showing{' '}
        <strong className="text-ink">{filtered.length}</strong> of{' '}
        <strong className="text-ink">{CAREERS.length}</strong> careers
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((career) => {
            const category = CAREER_CATEGORIES.find((c) => c.slug === career.category)!;
            return (
              <CareerCard key={career.id} career={career} category={category} />
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3 rounded-xl border border-dashed border-[#d0d5dd]">
          <p className="text-lg font-semibold">No careers found</p>
          <p className="text-[15px] text-[#475467] max-w-xs">
            Try a different search term, select a different category, or remove the cost
            filter — there are 100 paths waiting for you.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('');
              setCostFilter('all');
              router.replace('/career-guide', { scroll: false });
            }}
            className="mt-1 h-11 rounded-lg bg-primary px-5 font-semibold text-white hover:bg-primary-dark"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
