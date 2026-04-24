import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">GridAcademy</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              India&apos;s trusted marketplace for competitive exam mock tests.
              Prepare smarter with tests from top coaching institutes.
            </p>
          </div>

          {/* Exams */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Top Exams</h4>
            <ul className="space-y-2 text-sm">
              {['SSC CGL', 'IBPS PO', 'RRB NTPC', 'UPSC Prelims', 'SBI PO'].map(e => (
                <li key={e}>
                  <Link href={`/exams/${e.toLowerCase().replace(/ /g, '-')}`}
                    className="text-gray-400 hover:text-white transition-colors">{e}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-2 text-sm">
              {[
                ['About Us', '/about'],
                ['Become a Provider', '/provider/register'],
                ['Blog', '/blog'],
                ['Careers', '/careers'],
                ['Contact Us', '/contact'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-gray-400 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm">
              {[
                ['Privacy Policy', '/privacy'],
                ['Terms of Service', '/terms'],
                ['Refund Policy', '/refund-policy'],
                ['Provider Agreement', '/provider-agreement'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-gray-400 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} GridAcademy. All rights reserved.</p>
          <p>GSTIN: XXXXXXXXXXXX &nbsp;|&nbsp; Grievance Officer: <a href="mailto:info@gridacademy.in" className="hover:text-gray-300 transition-colors">info@gridacademy.in</a></p>
        </div>
      </div>
    </footer>
  );
}
