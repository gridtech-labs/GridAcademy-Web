'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Search, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { getInitials } from '@/lib/utils';

export default function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const user = session?.user as any;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200"
      style={{ height: 'var(--topbar-h, 56px)' }}>

      <div className="h-full flex items-center gap-3 px-4 md:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="shrink-0 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1760f4] rounded-lg flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="6" height="6" rx="1.5" fill="white"/>
              <rect x="11" y="1" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.7"/>
              <rect x="1" y="11" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.7"/>
              <rect x="11" y="11" width="6" height="6" rx="1.5" fill="white"/>
            </svg>
          </div>
          <span className="text-lg font-extrabold tracking-tight text-gray-900 leading-none">
            GridAcademy
          </span>
        </Link>

        {/* Search bar */}
        <div className="flex-1 max-w-lg relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search exams, topics, tests…"
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 rounded-lg border border-transparent
              focus:outline-none focus:ring-2 focus:ring-[#1760f4]/20 focus:bg-white focus:border-[#1760f4]/40 transition-all"
          />
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">

          {/* Become a Provider — guests only, desktop */}
          {!session && (
            <Link href="/provider/register"
              className="hidden md:block text-sm font-medium text-gray-600 border border-gray-200 hover:border-gray-300
                hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
              Become a Provider
            </Link>
          )}

          {/* Auth */}
          {session ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setProfileOpen(o => !o)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-[#1760f4] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#1760f4] flex items-center justify-center text-white text-xs font-bold">
                  {getInitials(user?.name ?? 'U')}
                </div>
                <span className="hidden lg:block max-w-[100px] truncate">{user?.name}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <Link href="/dashboard" onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <User className="w-4 h-4" /> My Dashboard
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
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 transition-colors">
                Login
              </Link>
              <Link href="/register"
                className="text-sm font-semibold bg-[#1760f4] text-white px-4 py-2 rounded-lg hover:bg-[#0e4dd4] transition-colors">
                Sign Up Free
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(o => !o)}
            aria-label="Open menu">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-3">
          {/* Mobile search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search exams, tests…"
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1760f4]/20" />
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap gap-2">
            <Link href="/exams" onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-1 text-sm bg-[#1760f4] text-white rounded-full font-semibold">
              All Exams
            </Link>
            <Link href="/tests" onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full font-semibold">
              All Tests
            </Link>
            {['Railway', 'UPSC', 'Banking', 'SSC', 'Defence'].map(cat => (
              <Link key={cat} href={`/?category=${cat}`} onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200">
                {cat}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          {!session ? (
            <div className="flex gap-2 pt-1">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold">
                Login
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 bg-[#1760f4] text-white rounded-lg text-sm font-semibold">
                Sign Up Free
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#1760f4] flex items-center justify-center text-white text-xs font-bold">
                  {getInitials(user?.name ?? 'U')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button onClick={() => signOut({ callbackUrl: '/' })}
                className="text-sm text-red-600 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50">
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
