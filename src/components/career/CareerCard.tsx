import type { Career, CareerCategory } from '@/types/career';

interface CareerCardProps {
  career: Career;
  category: CareerCategory;
}

export default function CareerCard({ career, category }: CareerCardProps) {
  const idLabel = String(career.id).padStart(2, '0');

  return (
    <div
      className={`bg-white rounded-2xl border ${category.border} shadow-sm hover:shadow-md transition-shadow duration-200 p-5 flex flex-col gap-3`}
    >
      {/* Top row: number badge + category chip */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-mono font-semibold text-gray-400">#{idLabel}</span>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${category.color} ${category.text}`}
        >
          <span>{category.icon}</span>
          {category.label}
        </span>
      </div>

      {/* Career name */}
      <h3 className="text-base font-semibold text-gray-900 leading-snug">{career.name}</h3>

      {/* What it is */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          What it is
        </span>
        <p className="text-sm text-gray-700 leading-relaxed">{career.what}</p>
      </div>

      {/* First step */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-500">
          First step this week
        </span>
        <p className="text-sm text-gray-700 leading-relaxed">{career.firstStep}</p>
      </div>

      {/* Cost badge */}
      <div className="mt-auto pt-2">
        {career.costInr === 0 ? (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
            FREE to start
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
            Starts at ₹{career.costInr.toLocaleString('en-IN')}
          </span>
        )}
      </div>
    </div>
  );
}
