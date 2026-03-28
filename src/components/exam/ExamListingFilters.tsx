'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export default function ExamListingFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const update = (key: string, value: string | null) => {
    const sp = new URLSearchParams(params.toString());
    if (value === null) sp.delete(key); else sp.set(key, value);
    sp.delete('page');
    router.push(`${pathname}?${sp.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-5 sticky top-20">
      <h3 className="font-semibold text-gray-800">Filters</h3>

      {/* Price */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Price</p>
        <div className="space-y-1.5">
          {[['All', null], ['Free Only', 'true']].map(([label, val]) => (
            <label key={label} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="free" value={val ?? ''}
                defaultChecked={params.get('free') === val}
                onChange={() => update('free', val as string | null)}
                className="accent-indigo-600" />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Rating</p>
        {['4', '3'].map(r => (
          <label key={r} className="flex items-center gap-2 cursor-pointer mb-1.5">
            <input type="checkbox" className="accent-indigo-600"
              defaultChecked={params.get('minRating') === r}
              onChange={e => update('minRating', e.target.checked ? r : null)} />
            <span className="text-sm text-gray-700">{'⭐'.repeat(Number(r))} & above</span>
          </label>
        ))}
      </div>

      {/* Language */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Language</p>
        {['English', 'Hindi'].map(lang => (
          <label key={lang} className="flex items-center gap-2 cursor-pointer mb-1.5">
            <input type="checkbox" className="accent-indigo-600" />
            <span className="text-sm text-gray-700">{lang}</span>
          </label>
        ))}
      </div>

      <button onClick={() => router.push(pathname)}
        className="w-full text-sm text-indigo-600 hover:underline text-left">
        Clear all filters
      </button>
    </div>
  );
}
