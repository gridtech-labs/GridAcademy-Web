import type { Career, CareerCategory } from '@/types/career';

interface CareerCardProps {
  career: Career;
  category: CareerCategory;
}

export default function CareerCard({ career, category }: CareerCardProps) {
  return (
    <div className="bg-white border border-line rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs text-[#667085]">#{String(career.id).padStart(2, '0')}</span>
        <span className="h-[22px] inline-flex items-center px-2 rounded-full bg-primary-tint text-primary-dark text-[11.5px] font-medium">{category.label}</span>
      </div>
      <h3 className="text-[17px] font-semibold leading-snug">{career.name}</h3>
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#667085]">What it is</p>
        <p className="text-sm leading-relaxed text-[#344054] mt-1">{career.what}</p>
      </div>
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-primary-dark">First step this week</p>
        <p className="text-sm leading-relaxed text-[#344054] mt-1">{career.firstStep}</p>
      </div>
      <div className="mt-auto pt-3 border-t border-line">
        {career.costInr === 0
          ? <span className="h-[26px] inline-flex items-center px-2.5 rounded-full bg-[#e7f6ec] text-[#0b6b31] text-[12.5px] font-medium">Free to start</span>
          : <span className="h-[26px] inline-flex items-center px-2.5 rounded-full bg-[#fef3dc] text-[#8a5200] text-[12.5px] font-medium">Starts at ₹{career.costInr.toLocaleString('en-IN')}</span>}
      </div>
    </div>
  );
}
