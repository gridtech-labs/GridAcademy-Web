'use client';

import { useState, useEffect, useRef } from 'react';
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

      {/* Tab nav ─────────────────────────────────────────────────────────── */}

      {/* Mobile: 3-column pill grid so nothing scrolls off-screen */}
      <div className="grid grid-cols-3 gap-px bg-gray-200 border-b border-gray-200 sm:hidden">
        {tabs.map(tab => {
          const Icon = ICONS[tab.icon] ?? BookOpen;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex flex-col items-center justify-center gap-1 py-3 px-1 text-[11px] font-semibold
                transition-all duration-150 focus:outline-none
                ${isActive
                  ? 'bg-white text-indigo-600'
                  : 'bg-gray-50 text-gray-500 hover:bg-white hover:text-gray-800'}
              `}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-500' : 'text-gray-400'}`} />
              <span className="text-center leading-tight">{tab.label}</span>
              {isActive && <span className="block w-4 h-0.5 rounded-full bg-indigo-600 mt-0.5" />}
            </button>
          );
        })}
      </div>

      {/* Desktop: single horizontal tab bar (hidden on mobile) */}
      <div className="hidden sm:block border-b border-gray-200 bg-gray-50/80">
        <div
          className="flex overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
        >
          {tabs.map(tab => {
            const Icon = ICONS[tab.icon] ?? BookOpen;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap shrink-0
                  border-b-2 transition-all duration-150 focus:outline-none
                  ${isActive
                    ? 'border-indigo-600 text-indigo-600 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-white/70'}
                `}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-500' : 'text-gray-400'}`} />
                {tab.label}
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
          <RichContent html={active.content} />
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

function RichContent({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    // Wrap bare tables in a scroll container so they don't overflow on mobile
    ref.current.querySelectorAll('table').forEach(table => {
      if (table.parentElement?.classList.contains('table-scroll-wrapper')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'table-scroll-wrapper';
      table.parentNode?.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  }, [html]);

  return (
    <div
      ref={ref}
      className="exam-rich-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
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
