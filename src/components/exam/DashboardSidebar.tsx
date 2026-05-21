'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, LayoutGrid, BarChart2, LogOut, GraduationCap } from 'lucide-react';
import { signOut } from 'next-auth/react';

const navItems = [
  {
    href: '/dashboard',
    label: 'My Tests',
    icon: BookOpen,
    description: 'Assigned tests',
    exact: true,
  },
  {
    href: '/dashboard/available',
    label: 'Available Tests',
    icon: LayoutGrid,
    description: 'Browse all tests',
    exact: false,
  },
  {
    href: '/dashboard/performance',
    label: 'Test Performance',
    icon: BarChart2,
    description: 'Results & analytics',
    exact: false,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="hidden md:flex flex-col w-60 bg-gray-900 min-h-screen shrink-0">

      {/* Logo / Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-800">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
          <GraduationCap className="w-4.5 h-4.5 text-white" />
        </div>
        <span className="font-bold text-white text-sm leading-tight">Grid Academy</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, description, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group ${
                active
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 shrink-0 ${active ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`} />
              <div className="min-w-0">
                <div className={`text-sm font-semibold leading-tight ${active ? 'text-white' : ''}`}>
                  {label}
                </div>
                <div className={`text-xs mt-0.5 leading-tight ${active ? 'text-indigo-200' : 'text-gray-600 group-hover:text-gray-400'}`}>
                  {description}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer: Sign out */}
      <div className="px-3 pb-5 border-t border-gray-800 pt-4">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-colors group"
        >
          <LogOut className="w-4.5 h-4.5 shrink-0 text-gray-500 group-hover:text-gray-300" />
          <span className="text-sm font-semibold">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
