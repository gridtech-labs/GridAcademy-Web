'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Search, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { getInitials } from '@/lib/utils';
import Logo from './Logo';

const NAV = [
  { label: 'IIT JEE',         href: '/exams?q=jee' },
  { label: 'NEET',            href: '/exams?q=neet' },
  { label: 'CUET',            href: '/exams?q=cuet' },
  { label: 'Govt Jobs',       href: '/#govt-jobs' },
  { label: 'Current Affairs', href: '/current-affairs' },
  { label: 'Resources',       href: '/blog' },
];

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const user = session?.user as any;
  const loginHref = `/login?callbackUrl=${encodeURIComponent(pathname ?? '/')}`;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-line" style={{ height: 'var(--topbar-h, 56px)' }}>
      <div className="h-full max-w-[1328px] mx-auto flex items-center gap-6 px-4 md:px-6 lg:px-8">
        <Logo size={32} />

        <nav className="hidden xl:flex items-center gap-1 text-[15px] font-medium text-[#344054]" aria-label="Main">
          {NAV.map(item => (
            <Link key={item.label} href={item.href}
              className="px-3 py-2 rounded-md whitespace-nowrap hover:text-primary-dark hover:bg-primary-tint/60 transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>

        <form action="/exams" method="GET" role="search" className="hidden md:flex flex-1 xl:flex-none xl:w-64 ml-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085] pointer-events-none" />
          <input
            type="search"
            name="q"
            placeholder="Search exams, e.g. SSC CGL"
            aria-label="Search exams"
            className="w-full h-10 pl-9 pr-3 text-sm bg-white rounded-lg border border-[#d0d5dd]
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </form>

        <div className="ml-auto md:ml-0 flex items-center gap-3">
          {session ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setProfileOpen(o => !o)}
                className="flex items-center gap-2 text-sm font-semibold text-ink hover:text-primary-dark transition-colors"
                aria-expanded={profileOpen}
              >
                <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                  {getInitials(user?.name ?? 'U')}
                </span>
                <span className="hidden xl:block max-w-[120px] truncate">{user?.name}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-line py-2 z-50">
                  <div className="px-4 py-2 border-b border-line">
                    <p className="text-sm font-semibold text-ink truncate">{user?.name}</p>
                    <p className="text-xs text-[#667085] truncate">{user?.email}</p>
                  </div>
                  <Link href="/dashboard" onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#344054] hover:bg-paper">
                    <User className="w-4 h-4" /> My dashboard
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#b42318] hover:bg-red-50">
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link href={loginHref} className="text-[15px] font-semibold text-ink hover:text-primary-dark px-1 whitespace-nowrap">
                Log in
              </Link>
              <Link href="/register"
                className="h-9 inline-flex items-center px-3.5 rounded-[7px] bg-primary text-white text-sm font-semibold whitespace-nowrap hover:bg-primary-dark transition-colors">
                Register free
              </Link>
            </div>
          )}

          <button
            className="xl:hidden w-11 h-11 flex items-center justify-center rounded-lg hover:bg-paper"
            onClick={() => setMobileMenuOpen(o => !o)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-line bg-white px-4 py-4 space-y-4 shadow-lg">
          <form action="/exams" method="GET" role="search" className="relative md:hidden">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085]" />
            <input type="search" name="q" placeholder="Search exams" aria-label="Search exams"
              className="w-full h-11 pl-10 pr-3 text-[15px] rounded-lg border border-[#d0d5dd] focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </form>

          <nav className="grid grid-cols-2 gap-1" aria-label="Main">
            {NAV.map(item => (
              <Link key={item.label} href={item.href} onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] flex items-center px-3 rounded-lg text-[15px] font-medium text-[#344054] hover:bg-paper">
                {item.label}
              </Link>
            ))}
          </nav>

          {!session ? (
            <div className="grid grid-cols-2 gap-2 md:hidden">
              <Link href={loginHref} onClick={() => setMobileMenuOpen(false)}
                className="h-11 flex items-center justify-center border border-[#d0d5dd] text-ink rounded-lg text-[15px] font-semibold">
                Log in
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}
                className="h-11 flex items-center justify-center bg-primary text-white rounded-lg text-[15px] font-semibold">
                Register free
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between md:hidden">
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                  {getInitials(user?.name ?? 'U')}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink">{user?.name}</span>
                  <span className="block text-xs text-[#667085]">My dashboard</span>
                </span>
              </Link>
              <button onClick={() => signOut({ callbackUrl: '/' })}
                className="h-11 px-3 text-sm text-[#b42318] font-semibold rounded-lg hover:bg-red-50">
                Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
