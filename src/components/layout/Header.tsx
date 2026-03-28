'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Search, Menu, X, User, BookOpen, LogOut, ChevronDown } from 'lucide-react';
import { getInitials } from '@/lib/utils';

const EXAM_CATEGORIES = [
  { label: 'SSC', slug: 'ssc' },
  { label: 'Banking', slug: 'banking' },
  { label: 'Railways', slug: 'railways' },
  { label: 'UPSC', slug: 'upsc' },
  { label: 'Police', slug: 'police' },
  { label: 'Defence', slug: 'defence' },
  { label: 'State PSC', slug: 'state-psc' },
  { label: 'Teaching', slug: 'teaching' },
];

export default function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);

  const user = session?.user as any;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-indigo-600 hidden sm:block">GridAcademy</span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-xl relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search mock tests, exams..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 rounded-full border border-transparent
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-300 transition-all"
          />
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          {session ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(o => !o)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 text-xs font-bold">
                  {getInitials(user?.name ?? 'S')}
                </div>
                <span className="hidden sm:block max-w-[100px] truncate">{user?.name}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <Link href="/dashboard" onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                    <User className="w-4 h-4" /> My Tests
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 hidden sm:block transition-colors">
                Login
              </Link>
              <Link href="/register"
                className="text-sm font-semibold bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors">
                Sign Up Free
              </Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(o => !o)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Category nav bar */}
      <div className="border-t border-gray-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide h-10">
            <Link href="/tests"
              className="shrink-0 px-4 py-1.5 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors">
              All Tests
            </Link>
            {EXAM_CATEGORIES.map(cat => (
              <Link key={cat.slug} href={`/exams/${cat.slug}`}
                className="shrink-0 px-4 py-1.5 text-sm text-gray-600 rounded-full hover:bg-gray-100 hover:text-gray-900 transition-colors whitespace-nowrap">
                {cat.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search mock tests..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="flex flex-wrap gap-2">
            {EXAM_CATEGORIES.map(cat => (
              <Link key={cat.slug} href={`/exams/${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-indigo-50 hover:text-indigo-600">
                {cat.label}
              </Link>
            ))}
          </div>
          {!session && (
            <div className="flex gap-3 pt-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 border border-indigo-600 text-indigo-600 rounded-full text-sm font-semibold">
                Login
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 bg-indigo-600 text-white rounded-full text-sm font-semibold">
                Sign Up Free
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
