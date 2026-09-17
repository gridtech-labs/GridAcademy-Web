'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/dashboard',             label: 'My tests',    exact: true  },
  { href: '/dashboard/available',   label: 'Find tests',  exact: false },
  { href: '/dashboard/performance', label: 'Performance', exact: false },
];

export default function DashboardTabs() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0" aria-label="Dashboard">
      {TABS.map(t => {
        const on = t.exact ? pathname === t.href : pathname.startsWith(t.href);
        return (
          <Link key={t.href} href={t.href} aria-current={on ? 'page' : undefined}
            className={`h-11 flex items-center px-4 text-[14.5px] font-semibold whitespace-nowrap border-b-[3px] transition-colors ${
              on ? 'text-primary-dark border-primary' : 'text-[#475467] border-transparent hover:text-ink'
            }`}>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
