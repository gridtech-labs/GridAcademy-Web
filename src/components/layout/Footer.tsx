import Link from 'next/link';
import Logo from './Logo';

const COLUMNS: { title: string; links: [string, string][] }[] = [
  {
    title: 'Exams',
    links: [
      ['IIT JEE', '/exams?q=jee'],
      ['NEET UG', '/exams?q=neet'],
      ['CUET UG', '/exams?q=cuet'],
      ['All exams', '/exams'],
    ],
  },
  {
    title: 'Free content',
    links: [
      ['Current Affairs', '/current-affairs'],
      ['Blog', '/blog'],
      ['Career Guide', '/career-guide'],
      ['Leaderboard', '/leaderboard'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['About', '/about'],
      ['Contact', '/contact'],
      ['Careers', '/careers'],
      ['Become a provider', '/provider/register'],
    ],
  },
  {
    title: 'Legal',
    links: [
      ['Privacy', '/privacy'],
      ['Terms', '/terms'],
      ['Refund policy', '/refund-policy'],
      ['Provider agreement', '/provider-agreement'],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-[#c7cedb]">
      <div className="max-w-[1328px] mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))] gap-8">
          <div className="col-span-2 md:col-span-1 flex flex-col gap-3">
            <Logo size={28} dark />
            <p className="text-sm leading-relaxed max-w-xs">
              Mock tests on the real computer-based exam interface, for JEE, NEET, CUET and government jobs.
            </p>
          </div>
          {COLUMNS.map(col => (
            <div key={col.title}>
              <p className="text-white font-semibold text-sm mb-3">{col.title}</p>
              <ul className="space-y-1">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="inline-block py-1 text-sm hover:text-white transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-ink-muted">
          <p>© {new Date().getFullYear()} GridAcademy. All rights reserved.</p>
          <p>Grievance: <a href="mailto:info@gridacademy.in" className="hover:text-white">info@gridacademy.in</a></p>
        </div>
      </div>
    </footer>
  );
}
