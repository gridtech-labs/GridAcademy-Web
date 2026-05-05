import Link from 'next/link';

const CATEGORIES = [
  { label: 'SSC',       slug: 'ssc' },
  { label: 'Banking',   slug: 'banking' },
  { label: 'Railways',  slug: 'railways' },
  { label: 'UPSC',      slug: 'upsc' },
  { label: 'Police',    slug: 'police' },
  { label: 'Defence',   slug: 'defence' },
  { label: 'State PSC', slug: 'state-psc' },
  { label: 'Teaching',  slug: 'teaching' },
];

export default function ExamCategoryBar() {
  return (
    <div className="bg-white border-b border-gray-200 py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Browse by category</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <Link key={cat.slug} href={`/exams/${cat.slug}`}
              className="px-4 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-sm font-medium
                text-gray-600 hover:bg-[#1760f4] hover:text-white hover:border-[#1760f4] transition-colors">
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
