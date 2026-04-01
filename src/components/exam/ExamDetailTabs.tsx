'use client';

import { useState } from 'react';
import { ImportantDate } from '@/types/exam';
import {
  BookOpen, Users, FileText, Trophy,
  Calendar, Bell, Tag,
} from 'lucide-react';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen, Users, FileText, Trophy, Calendar, Bell, Tag,
};

interface Tab {
  id:      string;
  label:   string;
  icon:    string;
  content: string | null;
}

interface Props {
  tabs:           Tab[];
  importantDates: ImportantDate[];
}

export default function ExamDetailTabs({ tabs, importantDates }: Props) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? '');
  const active = tabs.find(t => t.id === activeTab);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">

      {/* Tab nav — horizontally scrollable on mobile, no scrollbar shown */}
      <div className="relative border-b border-gray-200 bg-gray-50/80">
        {/* right-fade hint so user knows more tabs exist */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-gray-100/90 to-transparent z-10 sm:hidden" />
        <div
          className="flex overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
        >
          {tabs.map(tab => {
            const Icon = ICONS[tab.icon] ?? BookOpen;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-1.5 px-4 py-3.5 text-sm font-semibold whitespace-nowrap shrink-0
                  border-b-2 transition-all duration-150 focus:outline-none
                  ${isActive
                    ? 'border-indigo-600 text-indigo-600 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-white/70'}
                `}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-500' : 'text-gray-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="p-6 md:p-8">
        {active?.id === 'dates' ? (
          <ImportantDatesTable dates={importantDates} />
        ) : active?.content ? (
          <div
            className="
              prose prose-sm max-w-none
              prose-headings:font-bold prose-headings:text-gray-900 prose-headings:mt-6 prose-headings:mb-2
              prose-h2:text-lg prose-h3:text-base
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:my-2
              prose-li:text-gray-700 prose-li:leading-relaxed
              prose-ul:my-2 prose-ol:my-2
              prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900
              prose-table:border prose-table:border-gray-200 prose-table:rounded-lg
              prose-th:bg-indigo-50 prose-th:text-gray-700 prose-th:font-semibold prose-th:px-4 prose-th:py-2
              prose-td:px-4 prose-td:py-2 prose-td:border-b prose-td:border-gray-100
              prose-img:rounded-xl prose-img:shadow-sm
            "
            dangerouslySetInnerHTML={{ __html: active.content }}
          />
        ) : (
          <div className="py-10 text-center text-gray-400">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Information not available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ImportantDatesTable({ dates }: { dates: ImportantDate[] }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
          <Calendar className="w-4 h-4 text-indigo-600" />
        </div>
        <h3 className="font-bold text-gray-900 text-base">Important Dates & Schedule</h3>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-indigo-50 border-b border-indigo-100">
              <th className="text-left py-3 px-5 font-semibold text-gray-700 w-8">#</th>
              <th className="text-left py-3 px-5 font-semibold text-gray-700">Event / Activity</th>
              <th className="text-left py-3 px-5 font-semibold text-gray-700 whitespace-nowrap">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dates.map((d, i) => (
              <tr key={i} className="hover:bg-indigo-50/40 transition-colors">
                <td className="py-3.5 px-5 text-gray-400 text-xs font-medium">{i + 1}</td>
                <td className="py-3.5 px-5 text-gray-700">{d.label}</td>
                <td className="py-3.5 px-5 font-semibold text-indigo-700 whitespace-nowrap">{d.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
