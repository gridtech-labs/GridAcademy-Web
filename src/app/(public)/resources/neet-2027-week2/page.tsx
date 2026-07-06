import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Download, BookOpen, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'NEET 2027 Week 2 Target — Study Material',
  description: 'Download NEET 2027 Week 2 Target study material (8–14 July). Free on GridAcademy.',
};

export default function NeetWeek2DownloadPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full">

        {/* File card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Coloured header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-7 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-orange-100 uppercase tracking-widest">
                Study Material · PDF
              </span>
            </div>
            <h1 className="text-xl font-extrabold leading-snug mb-1">
              NEET 2027 — Week 2 Target
            </h1>
            <p className="text-orange-100 text-sm">8–14 July 2026 Revision Pack</p>
          </div>

          {/* Meta chips */}
          <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-orange-400" />Week 2 · Jul 8–14
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-orange-400" />NEET 2027 Prep
            </span>
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-orange-400" />PDF Format
            </span>
          </div>

          {/* CTA area */}
          <div className="px-6 py-6">
            <a
              href="/api/download/neet-week2"
              className="flex items-center justify-center gap-2 w-full
                bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm
                py-3.5 rounded-xl transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </a>
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-gray-400">
          <Link href="/exams" className="hover:text-orange-500 transition-colors">
            ← Browse mock tests
          </Link>
        </p>
      </div>
    </div>
  );
}
