import { Star } from 'lucide-react';
import { TestReview } from '@/types';
import { formatDate } from '@/lib/utils';

interface Props { seriesId: string; reviews: TestReview[] }

function Stars({ value, size = 'w-4 h-4' }: { value: number; size?: string }) {
  return (
    <span className="flex gap-0.5" aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${size} ${i < Math.round(value) ? 'fill-saffron text-saffron' : 'text-[#d0d5dd]'}`} />
      ))}
    </span>
  );
}

export default function ReviewsList({ reviews }: Props) {
  if (!reviews.length) return null;

  const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
  const dist = [5, 4, 3, 2, 1].map(r => ({ r, count: reviews.filter(x => x.rating === r).length }));

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl md:text-2xl font-semibold">Student reviews</h2>

      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 bg-paper border border-line rounded-xl p-5 md:p-6">
        <div className="flex flex-col items-center sm:items-start gap-1.5">
          <p className="font-mono font-semibold text-[40px] leading-none">{avg.toFixed(1)}</p>
          <Stars value={avg} size="w-5 h-5" />
          <p className="text-sm text-[#667085]">{reviews.length} review{reviews.length === 1 ? '' : 's'}</p>
        </div>
        <div className="flex-1 flex flex-col gap-1.5 justify-center">
          {dist.map(({ r, count }) => (
            <div key={r} className="flex items-center gap-3 text-xs text-[#475467]">
              <span className="w-6 font-mono">{r}★</span>
              <div className="flex-1 h-2 bg-[#e4e7ec] rounded overflow-hidden">
                <div className="h-2 bg-saffron" style={{ width: `${(count / reviews.length) * 100}%` }} />
              </div>
              <span className="w-6 text-right font-mono">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <ul className="flex flex-col divide-y divide-line border-y border-line">
        {reviews.slice(0, 6).map(r => (
          <li key={r.id} className="py-4 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-primary-tint text-primary-dark flex items-center justify-center text-sm font-semibold">{r.studentName[0]}</span>
              <div className="min-w-0">
                <p className="font-semibold text-[15px] truncate">{r.studentName}</p>
                <p className="text-xs text-[#667085]">{formatDate(r.createdAt)}</p>
              </div>
              <span className="ml-auto"><Stars value={r.rating} size="w-3.5 h-3.5" /></span>
            </div>
            <p className="text-[15px] text-[#344054] leading-relaxed">{r.comment}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
