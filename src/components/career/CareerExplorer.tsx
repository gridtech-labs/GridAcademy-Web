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
      <div className="relative">
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm pointer-events-none">
          🔍
        </span>
        <input
          type="text"
          placeholder="Search careers..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryChange('')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            !activeCategory
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
          }`}
        >
          All
        </button>
        {CAREER_CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => handleCategoryChange(cat.slug)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === cat.slug
                ? `${cat.accent} text-white shadow-sm`
                : `bg-white border border-gray-200 ${cat.text} hover:border-current`
            }`}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Cost filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Cost:
        </span>
        {costOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleCostChange(opt.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              costFilter === opt.value
                ? 'bg-gray-800 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500">
        Showing{' '}
        <strong className="text-gray-800">{filtered.length}</strong> of{' '}
        <strong className="text-gray-800">100</strong> careers
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
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <span className="text-5xl">🔍</span>
          <p className="text-lg font-semibold text-gray-700">No careers found</p>
          <p className="text-sm text-gray-500 max-w-xs">
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
            className="mt-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
