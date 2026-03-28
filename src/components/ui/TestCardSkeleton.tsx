export default function TestCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="h-40 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="flex gap-3">
          <div className="h-3 bg-gray-200 rounded w-16" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
        <div className="h-px bg-gray-100" />
        <div className="flex justify-between">
          <div className="h-5 bg-gray-200 rounded w-16" />
          <div className="h-6 bg-gray-200 rounded-full w-24" />
        </div>
      </div>
    </div>
  );
}
