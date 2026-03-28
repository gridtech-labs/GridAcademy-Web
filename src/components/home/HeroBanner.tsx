'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, TrendingUp } from 'lucide-react';
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
    <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">

        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full
          px-4 py-1.5 text-sm font-medium mb-6 text-white/90">
          <TrendingUp className="w-4 h-4" />
          10 lakh+ tests taken on GridAcademy
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
          Crack Your Dream Exam<br />
          <span className="text-yellow-300">with India&apos;s Best Mock Tests</span>
        </h1>
        <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Practice with tests from top coaching institutes.
          Get real exam experience, all-India rank, and detailed analysis.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch}
          className="flex items-center max-w-xl mx-auto bg-white rounded-full shadow-xl overflow-hidden">
          <Search className="ml-5 w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search for SSC CGL, IBPS PO, RRB..."
            className="flex-1 px-4 py-4 text-gray-800 text-sm focus:outline-none"
          />
          <button type="submit"
            className="m-1.5 bg-indigo-600 text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-indigo-700 transition-colors shrink-0">
            Search
          </button>
        </form>

        {/* Trending */}
        <div className="flex items-center justify-center gap-2 flex-wrap mt-5 text-sm">
          <span className="text-indigo-200">Trending:</span>
          {TRENDING.map(t => (
            <Link key={t}
              href={`/tests?q=${encodeURIComponent(t)}`}
              className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full transition-colors">
              {t}
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-center">
          {[['500+', 'Mock Tests'], ['200+', 'Providers'], ['10 Exams', 'Covered'], ['Free', 'Trial Tests']].map(([n, l]) => (
            <div key={l}>
              <div className="text-2xl md:text-3xl font-extrabold text-yellow-300">{n}</div>
              <div className="text-indigo-200 text-sm mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
