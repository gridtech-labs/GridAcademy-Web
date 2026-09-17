import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import CareerQuiz from '@/components/career/CareerQuiz';

export const metadata: Metadata = {
  title: 'Career Type Quiz — Find Your Path',
  description:
    'Answer 5 quick questions and discover which of the 8 career personality types fits you best.',
};

export default function CareerQuizPage() {
  return (
    <div className="bg-paper text-ink min-h-[70vh]">
      <div className="max-w-[680px] mx-auto px-4 py-6 md:py-10 flex flex-col gap-5">
        <Link href="/career-guide" className="self-start inline-flex items-center gap-1 min-h-[36px] text-[15px] font-semibold text-primary-dark hover:underline">
          <ChevronLeft className="w-4 h-4" /> Career guide
        </Link>
        <CareerQuiz />
      </div>
    </div>
  );
}
