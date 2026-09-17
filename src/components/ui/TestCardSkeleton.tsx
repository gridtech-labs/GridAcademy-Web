export default function TestCardSkeleton() {
  return (
    <div className="bg-white border border-line rounded-xl p-5 flex flex-col gap-3 animate-pulse">
      <div className="h-3 bg-[#eef1f5] rounded w-1/2" />
      <div className="h-5 bg-[#eef1f5] rounded w-4/5" />
      <div className="flex gap-2">
        <div className="h-6 bg-[#eef1f5] rounded-full w-16" />
        <div className="h-6 bg-[#eef1f5] rounded-full w-24" />
      </div>
      <div className="h-px bg-line mt-3" />
      <div className="flex justify-between">
        <div className="h-4 bg-[#eef1f5] rounded w-12" />
        <div className="h-4 bg-[#eef1f5] rounded w-20" />
      </div>
    </div>
  );
}
