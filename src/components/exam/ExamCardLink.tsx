import Link from 'next/link';
import { ExamCard } from '@/types/exam';

/** Exam card used on the home page and the /exams listing. */
export default function ExamCardLink({ exam }: { exam: ExamCard }) {
  return (
    <Link href={`/exam/${exam.slug}`}
      className="group bg-white border border-line rounded-xl p-5 flex flex-col gap-3.5 hover:border-primary/40 hover:shadow-[0_8px_24px_-12px_rgba(14,23,38,.18)] transition">
      <div className="flex items-center justify-between gap-2 min-h-[22px]">
        <span className="text-[13px] text-[#667085] truncate">{exam.conductingBody ?? exam.examTypeName ?? exam.examLevelName ?? ''}</span>
        {exam.isFeatured && (
          <span className="h-[22px] inline-flex items-center px-2 rounded-full bg-[#fef3dc] text-[#8a5200] text-[11.5px] font-medium">Featured</span>
        )}
      </div>
      <h3 className="text-lg md:text-xl font-semibold leading-snug group-hover:text-primary-dark line-clamp-2">{exam.title.trim()}</h3>
      <div className="flex flex-wrap gap-2">
        <span className="h-[26px] inline-flex items-center px-2.5 rounded-full bg-[#f2f4f7] text-[#344054] text-[12.5px] font-medium">
          {exam.testCount} mock test{exam.testCount === 1 ? '' : 's'}
        </span>
        {exam.examLevelName && (
          <span className="h-[26px] inline-flex items-center px-2.5 rounded-full bg-primary-tint text-primary-dark text-[12.5px] font-medium">{exam.examLevelName}</span>
        )}
      </div>
      <div className="h-px bg-line mt-auto" />
      <p className="text-[13.5px] text-[#475467]">
        {exam.priceInr > 0
          ? <>Paid tests <b className="text-ink">₹{exam.priceInr.toLocaleString('en-IN')}</b> · lifetime access</>
          : <b className="text-[#0b6b31]">All tests free</b>}
      </p>
      <span className="h-9 inline-flex items-center justify-center rounded-[7px] bg-primary-tint text-primary-dark text-sm font-semibold group-hover:bg-primary group-hover:text-white transition-colors">
        View tests
      </span>
    </Link>
  );
}
