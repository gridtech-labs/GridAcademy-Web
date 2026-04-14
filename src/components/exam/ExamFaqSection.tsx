'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { ExamFaq } from '@/types/exam';

interface Props {
  faqs: ExamFaq[];
}

export default function ExamFaqSection({ faqs }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (faqs.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-orange-500 shrink-0" />
          <h2 className="font-bold text-gray-800 text-base">Frequently Asked Questions</h2>
        </div>

        <ul className="divide-y divide-gray-100">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-gray-800 leading-snug">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 text-orange-500 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
