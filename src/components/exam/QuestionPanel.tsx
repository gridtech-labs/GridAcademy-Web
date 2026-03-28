'use client';
import { ExamQuestion, StudentAnswer } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  question: ExamQuestion;
  answer?: StudentAnswer;
  onOptionSelect: (optionId: number) => void;
  onNumericalInput: (value: string) => void;
}

export default function QuestionPanel({ question, answer, onOptionSelect, onNumericalInput }: Props) {
  const selected = answer?.selectedOptionIds ?? [];

  return (
    <div className="max-w-3xl">
      {/* Question meta */}
      <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
        <span className="bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 rounded-full">
          Q {question.sequenceNumber}
        </span>
        <span className="bg-gray-100 px-2.5 py-1 rounded-full capitalize">
          {question.questionType === 'SingleCorrect' ? 'Single correct' :
           question.questionType === 'MultipleCorrect' ? 'Multiple correct' : 'Numerical'}
        </span>
        <span className="bg-green-50 text-green-700 px-2.5 py-1 rounded-full">
          +{question.marks}
        </span>
        {question.negativeMarks !== 0 && (
          <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-full">
            {question.negativeMarks}
          </span>
        )}
        {question.questionType === 'MultipleCorrect' && (
          <span className="text-orange-600 font-medium">⚠ Select all correct options</span>
        )}
      </div>

      {/* Question text */}
      <div className="text-base md:text-lg text-gray-900 leading-relaxed mb-6 font-medium"
        dangerouslySetInnerHTML={{ __html: question.questionText }} />

      {/* MCQ Options */}
      {(question.questionType === 'SingleCorrect' || question.questionType === 'MultipleCorrect') && (
        <div className="space-y-3">
          {question.options?.map(opt => {
            const isSelected = selected.includes(opt.id);
            return (
              <button key={opt.id} onClick={() => onOptionSelect(opt.id)}
                className={cn(
                  'w-full flex items-start gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all',
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 text-gray-800'
                )}>
                <div className={cn(
                  'w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 font-bold text-sm mt-0.5',
                  isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300 text-gray-600'
                )}>
                  {opt.label}
                </div>
                <span className="text-sm md:text-base leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: opt.text }} />
              </button>
            );
          })}
        </div>
      )}

      {/* Numerical Input */}
      {question.questionType === 'Numerical' && (
        <div className="max-w-xs">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter your answer (numerical value):
          </label>
          <input
            type="number"
            step="any"
            value={answer?.numericalAnswer ?? ''}
            onChange={e => onNumericalInput(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl
              focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition-all"
          />
          <p className="text-xs text-gray-500 mt-2">
            Enter exact numerical value. Round off as specified in the question.
          </p>
        </div>
      )}
    </div>
  );
}
