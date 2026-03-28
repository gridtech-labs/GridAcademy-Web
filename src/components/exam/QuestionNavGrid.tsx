'use client';
import { ExamConfig, StudentAnswer, QuestionStatus } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  config: ExamConfig;
  answers: Record<number, StudentAnswer>;
  activeSectionIdx: number;
  activeQIdx: number;
  onNavigate: (sectionIdx: number, qIdx: number) => void;
}

const STATUS_STYLES: Record<QuestionStatus, string> = {
  NotVisited:      'bg-gray-100 text-gray-500 border-gray-200',
  NotAnswered:     'bg-red-100 text-red-700 border-red-200',
  Answered:        'bg-green-500 text-white border-green-600',
  MarkedForReview: 'bg-orange-400 text-white border-orange-500',
  AnsweredAndMarked:'bg-purple-500 text-white border-purple-600',
};

export default function QuestionNavGrid({ config, answers, activeSectionIdx, activeQIdx, onNavigate }: Props) {
  const legend: { status: QuestionStatus; label: string }[] = [
    { status: 'Answered', label: 'Answered' },
    { status: 'NotAnswered', label: 'Not Answered' },
    { status: 'MarkedForReview', label: 'Marked for Review' },
    { status: 'AnsweredAndMarked', label: 'Answered & Marked' },
    { status: 'NotVisited', label: 'Not Visited' },
  ];

  return (
    <div className="p-3 space-y-4">
      {/* Legend */}
      <div className="space-y-1.5">
        {legend.map(({ status, label }) => (
          <div key={status} className="flex items-center gap-2">
            <div className={cn('w-5 h-5 rounded text-xs flex items-center justify-center border', STATUS_STYLES[status])}>
              {status === 'Answered' ? '✓' : ''}
            </div>
            <span className="text-xs text-gray-600">{label}</span>
          </div>
        ))}
      </div>

      <hr className="border-gray-200" />

      {/* Grid per section */}
      {config.sections.map((section, sIdx) => (
        <div key={section.id}>
          {config.sections.length > 1 && (
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{section.name}</p>
          )}
          <div className="grid grid-cols-5 gap-1.5">
            {section.questions.map((q, qIdx) => {
              const status: QuestionStatus = answers[q.id]?.status ?? 'NotVisited';
              const isActive = sIdx === activeSectionIdx && qIdx === activeQIdx;
              return (
                <button key={q.id}
                  onClick={() => onNavigate(sIdx, qIdx)}
                  className={cn(
                    'w-9 h-9 rounded-lg text-xs font-bold border transition-all hover:scale-105',
                    STATUS_STYLES[status],
                    isActive && 'ring-2 ring-indigo-600 ring-offset-1 scale-110'
                  )}>
                  {q.sequenceNumber}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
