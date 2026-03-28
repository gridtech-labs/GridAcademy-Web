import { Star } from 'lucide-react';
import { TestReview } from '@/types';
import { formatDate } from '@/lib/utils';

interface Props { seriesId: string; reviews: TestReview[] }

export default function ReviewsList({ reviews }: Props) {
  if (!reviews.length) return null;

  const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
  const dist = [5, 4, 3, 2, 1].map(r => ({ r, count: reviews.filter(x => x.rating === r).length }));

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-6">Student Reviews</h2>

      {/* Summary */}
      <div className="flex flex-col sm:flex-row gap-8 mb-6 bg-gray-50 rounded-2xl p-6 border border-gray-100">
        <div className="text-center">
          <div className="text-5xl font-extrabold text-gray-900">{avg.toFixed(1)}</div>
          <div className="flex justify-center gap-0.5 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-5 h-5 ${i < Math.round(avg) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">{reviews.length} reviews</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {dist.map(({ r, count }) => (
            <div key={r} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-4">{r}★</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${reviews.length ? (count / reviews.length) * 100 : 0}%` }} />
              </div>
              <span className="text-xs text-gray-500 w-6">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Individual reviews */}
      <div className="space-y-4">
        {reviews.slice(0, 6).map(r => (
          <div key={r.id} className="border border-gray-100 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 text-sm font-bold">
                {r.studentName[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{r.studentName}</p>
                <p className="text-xs text-gray-400">{formatDate(r.createdAt)}</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
