'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

const TRENDING = ['SSC CGL 2026', 'IBPS PO', 'RRB NTPC', 'UPSC Prelims'];

export default function HeroBanner() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/tests?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-20">

        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-3 max-w-2xl">
          Crack Your Dream Exam<br />
          <span className="text-[#1760f4]">with India&apos;s Best Mock Tests</span>
        </h1>
        <p className="text-gray-500 text-base md:text-lg max-w-xl mb-8">
          Practice with tests from top coaching institutes.
          Get real exam experience, all-India rank, and detailed analysis.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch}
          className="flex items-center max-w-xl bg-white rounded-lg border border-gray-300 overflow-hidden
            focus-within:border-[#1760f4] focus-within:ring-2 focus-within:ring-[#1760f4]/10 transition-all">
          <Search className="ml-4 w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search for SSC CGL, IBPS PO, RRB..."
            className="flex-1 px-3 py-3 text-sm text-gray-800 focus:outline-none bg-transparent"
          />
          <button type="submit"
            className="m-1.5 bg-[#1760f4] text-white px-5 py-2 rounded-md font-semibold text-sm
              hover:bg-[#0e4dd4] transition-colors shrink-0">
            Search
          </button>
        </form>

        {/* Trending */}
        <div className="flex items-center gap-2 flex-wrap mt-4 text-sm">
          <span className="text-gray-400">Trending:</span>
          {TRENDING.map(t => (
            <Link key={t} href={`/tests?q=${encodeURIComponent(t)}`}
              className="text-gray-600 hover:text-[#1760f4] transition-colors text-xs underline underline-offset-2">
              {t}
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-8 mt-10 text-left">
          {[['500+', 'Mock Tests'], ['200+', 'Providers'], ['10', 'Exams Covered'], ['Free', 'Trial Tests']].map(([n, l]) => (
            <div key={l}>
              <div className="text-2xl font-extrabold text-gray-900">{n}</div>
              <div className="text-gray-400 text-xs mt-0.5">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
