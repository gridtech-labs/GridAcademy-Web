import type { Metadata } from 'next';
import Link from 'next/link';
import CareerQuiz from '@/components/career/CareerQuiz';

export const metadata: Metadata = {
  title: 'Career Type Quiz — Find Your Path | GridAcademy',
  description:
    'Answer 5 quick questions and discover which of the 8 career personality types fits you best.',
};

export default function CareerQuizPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/career-guide"
            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            ← Back to Career Guide
          </Link>
        </div>
        <CareerQuiz />
      </div>
    </div>
  );
}
