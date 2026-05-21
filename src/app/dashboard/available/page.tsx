export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { api, UnauthorizedError } from '@/lib/api-client';
import { redirect } from 'next/navigation';
import { ExamCard } from '@/types/exam';
import Link from 'next/link';
import {
  LayoutGrid, Search, FileText, Clock, BookOpen,
  ChevronRight, Zap,
} from 'lucide-react';

async function getExams(): Promise<ExamCard[]> {
  try {
    const res = await api.get<ExamCard[]>('/api/exam-pages');
    return Array.isArray(res) ? res.filter(e => e.status === 1) : [];
  } catch { return []; }
}

function categoryIcon(name: string | null) {
  if (!name) return '📝';
  const n = name.toLowerCase();
  if (n.includes('railway') || n.includes('rrb')) return '🚂';
  if (n.includes('upsc') || n.includes('ias'))    return '🏛️';
  if (n.includes('bank'))                          return '🏦';
  if (n.includes('ssc'))                           return '👮';
  if (n.includes('gate'))                          return '🔬';
  if (n.includes('defence') || n.includes('nda'))  return '📐';
  if (n.includes('police'))                        return '🚔';
  if (n.includes('teach') || n.includes('tet'))    return '📚';
  if (n.includes('state') || n.includes('psc'))    return '🗺️';
  if (n.includes('cuet'))                          return '🎓';
  if (n.includes('jee') || n.includes('neet'))     return '⚗️';
  if (n.includes('mat') || n.includes('cat'))      return '💼';
  return '📝';
}

function stripHtml(html: string | null) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 120);
}

export default async function AvailableTestsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const exams = await getExams();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-indigo-500" />
          Available Tests
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Browse all published exam series — click an exam to view its tests
        </p>
      </div>

      {/* Exam grid */}
      {exams.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 py-20 text-center">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No exams available right now</p>
          <p className="text-sm text-gray-400 mt-1">Check back later for new exam series</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {exams.map(exam => {
            const icon   = categoryIcon(exam.examTypeName ?? exam.category);
            const desc   = stripHtml(exam.shortDescription);
            const isFree = exam.priceInr === 0;

            return (
              <Link
                key={exam.id}
                href={`/exam/${exam.slug}`}
                className="bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all group flex flex-col overflow-hidden"
              >
                {/* Thumbnail / placeholder */}
                {exam.thumbnailUrl ? (
                  <div className="h-28 overflow-hidden">
                    <img
                      src={exam.thumbnailUrl}
                      alt={exam.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-28 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center text-4xl">
                    {icon}
                  </div>
                )}

                <div className="p-4 flex flex-col flex-1">
                  {/* Tags row */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {isFree ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                        <Zap className="w-3 h-3" />FREE
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                        ₹{exam.priceInr.toLocaleString('en-IN')}
                      </span>
                    )}
                    {exam.examTypeName && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {exam.examTypeName}
                      </span>
                    )}
                    {exam.isFeatured && (
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        ⭐ Featured
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1.5 group-hover:text-indigo-700 transition-colors">
                    {exam.title}
                  </h3>

                  {/* Description */}
                  {desc && (
                    <p className="text-xs text-gray-500 leading-relaxed flex-1 mb-3">
                      {desc}{desc.length === 120 ? '…' : ''}
                    </p>
                  )}

                  {/* Footer meta */}
                  <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      {exam.testCount} test{exam.testCount !== 1 ? 's' : ''}
                    </span>
                    <span className="flex items-center gap-1 text-indigo-600 font-semibold group-hover:gap-2 transition-all">
                      View Tests <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
