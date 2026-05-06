'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, FileText, Users } from 'lucide-react';
import { ExamCard } from '@/types/exam';

interface Props {
  exams: ExamCard[];
}

export default function ExamLevelSection({ exams }: Props) {
  const levels = ['All', ...Array.from(new Set(exams.map(e => e.examLevelName ?? 'Other')))];
  const [activeLevel, setActiveLevel] = useState('All');

  const filtered =
    activeLevel === 'All' ? exams : exams.filter(e => (e.examLevelName ?? 'Other') === activeLevel);

  return (
    <div className="mt-6">
      {/* Level tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {levels.map(level => (
          <button
            key={level}
            onClick={() => setActiveLevel(level)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors
              ${activeLevel === level
                ? 'bg-[#1760f4] text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Exam cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map(exam => (
          <ExamCardItem key={exam.id} exam={exam} />
        ))}
      </div>
    </div>
  );
}

function ExamCardItem({ exam }: { exam: ExamCard }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow flex flex-col">
      {/* Thumbnail */}
      <div className="relative h-32 bg-gray-100 flex items-center justify-center shrink-0">
        {exam.thumbnailUrl ? (
          <Image
            src={exam.thumbnailUrl}
            alt={exam.title}
            fill
            sizes="(max-width: 640px) 100vw, 25vw"
            className="object-cover"
          />
        ) : (
          <BookOpen className="w-10 h-10 text-gray-300" />
        )}
        {exam.isFeatured && (
          <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            Featured
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        {/* Badges */}
        <div className="flex gap-1.5 flex-wrap mb-2">
          {exam.examLevelName && (
            <span className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
              {exam.examLevelName}
            </span>
          )}
          {exam.examTypeName && (
            <span className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
              {exam.examTypeName}
            </span>
          )}
        </div>

        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">{exam.title}</h3>

        {exam.conductingBody && (
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <Users className="w-3 h-3 shrink-0" />
            {exam.conductingBody}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <FileText className="w-3 h-3" />
            {exam.testCount} {exam.testCount === 1 ? 'test' : 'tests'}
          </span>
          <Link
            href={`/exam/${exam.slug}`}
            className="text-xs font-semibold text-[#1760f4] hover:text-[#0e4dd4] hover:underline">
            View Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
