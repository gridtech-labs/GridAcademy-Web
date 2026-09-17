import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ExamCard } from '@/types/exam';

const COLS = 'md:grid-cols-[minmax(0,1fr)_150px_110px_150px_24px]';

/**
 * Exams as table rows, matching the test list on an exam page. Each row links to
 * the exam; on mobile the columns fold into one meta line under the title.
 */
export default function ExamList({ exams }: { exams: ExamCard[] }) {
  return (
    <div className="bg-white border border-line rounded-xl overflow-hidden">
      <div className={`hidden md:grid ${COLS} gap-4 px-5 py-2.5 bg-[#f9fafb] border-b border-line text-[12.5px] font-semibold text-[#475467]`}>
        <span>Exam</span><span>Level</span><span>Mock tests</span><span>Price</span><span />
      </div>
      <ul className="divide-y divide-[#eef0f3]">
        {exams.map(e => {
          const body = e.conductingBody ?? e.examTypeName;
          const price = e.priceInr > 0 ? `₹${e.priceInr.toLocaleString('en-IN')} · unlock all` : 'Free';
          return (
            <li key={e.id}>
              <Link href={`/exam/${e.slug}`}
                className={`group grid grid-cols-[minmax(0,1fr)_20px] ${COLS} gap-x-4 items-center px-4 md:px-5 py-3.5 md:py-4 hover:bg-[#f7f9fc] focus-visible:bg-[#f7f9fc] focus-visible:outline-none`}>
                <div className="min-w-0">
                  <p className="font-semibold text-[15.5px] leading-snug group-hover:text-primary-dark">{e.title.trim()}</p>
                  {body && <p className="text-[13px] text-[#667085] mt-0.5 truncate">{body}</p>}
                  <p className="md:hidden text-[13px] text-[#475467] mt-1.5">
                    <span className="font-mono">{e.testCount}</span> test{e.testCount === 1 ? '' : 's'}
                    <span className="text-[#98a2b3]"> · </span>
                    <span className={e.priceInr > 0 ? '' : 'text-[#0b6b31] font-medium'}>{price}</span>
                  </p>
                </div>
                <span className="hidden md:block text-sm text-[#475467] truncate">{e.examLevelName ?? '—'}</span>
                <span className="hidden md:block font-mono text-sm text-[#344054]">{e.testCount}</span>
                <span className={`hidden md:block text-sm ${e.priceInr > 0 ? 'text-[#344054]' : 'text-[#0b6b31] font-medium'}`}>{price}</span>
                <ChevronRight className="w-[18px] h-[18px] text-[#98a2b3] group-hover:text-primary justify-self-end" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
