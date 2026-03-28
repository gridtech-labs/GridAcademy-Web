'use client';
import { Loader2, AlertTriangle } from 'lucide-react';

interface Props {
  stats: { total: number; answered: number; marked: number; notVisited: number };
  submitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function SubmitConfirmDialog({ stats, submitting, onConfirm, onCancel }: Props) {
  const unanswered = stats.total - stats.answered;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Submit Test?</h3>
        </div>

        <div className="space-y-2 mb-6">
          {[
            { label: 'Total Questions', value: stats.total, color: 'text-gray-800' },
            { label: 'Answered', value: stats.answered, color: 'text-green-600' },
            { label: 'Unanswered', value: unanswered, color: unanswered > 0 ? 'text-red-600' : 'text-gray-500' },
            { label: 'Marked for Review', value: stats.marked, color: 'text-orange-600' },
            { label: 'Not Visited', value: stats.notVisited, color: 'text-gray-500' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{label}</span>
              <span className={`text-sm font-bold ${color}`}>{value}</span>
            </div>
          ))}
        </div>

        {unanswered > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-700">
            ⚠ You have <strong>{unanswered}</strong> unanswered questions.
            Once submitted, you cannot make changes.
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onCancel} disabled={submitting}
            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 disabled:opacity-50">
            Go Back
          </button>
          <button onClick={onConfirm} disabled={submitting}
            className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : 'Submit Test'}
          </button>
        </div>
      </div>
    </div>
  );
}
