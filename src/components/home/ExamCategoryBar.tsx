import Link from 'next/link';

const CATEGORIES = [
  { label: 'SSC', slug: 'ssc', emoji: '📋', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { label: 'Banking', slug: 'banking', emoji: '🏦', color: 'bg-green-50 text-green-700 border-green-200' },
  { label: 'Railways', slug: 'railways', emoji: '🚂', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { label: 'UPSC', slug: 'upsc', emoji: '🏛️', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { label: 'Police', slug: 'police', emoji: '👮', color: 'bg-red-50 text-red-700 border-red-200' },
  { label: 'Defence', slug: 'defence', emoji: '⚔️', color: 'bg-slate-50 text-slate-700 border-slate-200' },
  { label: 'State PSC', slug: 'state-psc', emoji: '🗺️', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  { label: 'Teaching', slug: 'teaching', emoji: '📚', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
];

export default function ExamCategoryBar() {
  return (
    <div className="bg-white border-b border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Browse by Exam Category</h2>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {CATEGORIES.map(cat => (
            <Link key={cat.slug} href={`/exams/${cat.slug}`}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border ${cat.color}
                hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer`}>
              <span className="text-2xl">{cat.emoji}</span>
              <span className="text-xs font-semibold text-center leading-tight">{cat.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
