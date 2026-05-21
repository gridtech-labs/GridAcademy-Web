'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, LayoutGrid, BarChart2 } from 'lucide-react';

const tabs = [
  { href: '/dashboard',             label: 'My Tests',     icon: BookOpen,   exact: true  },
  { href: '/dashboard/available',   label: 'Available',    icon: LayoutGrid, exact: false },
  { href: '/dashboard/performance', label: 'Performance',  icon: BarChart2,  exact: false },
];

export default function MobileDashboardNav() {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <nav
      className="md:hidden bg-white border-t border-gray-200 grid shrink-0"
      style={{
        gridTemplateColumns: `repeat(${tabs.length}, 1fr)`,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {tabs.map(({ href, label, icon: Icon, exact }) => {
        const active = isActive(href, exact);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center py-2.5 gap-1 transition-colors ${
              active ? 'text-indigo-600' : 'text-gray-400'
            }`}
          >
            <Icon className={`w-5 h-5 ${active ? 'text-indigo-600' : 'text-gray-400'}`} />
            <span className={`text-[10px] font-semibold leading-tight ${active ? 'text-indigo-600' : 'text-gray-400'}`}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
