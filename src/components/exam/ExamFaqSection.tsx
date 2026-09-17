'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ExamFaq } from '@/types/exam';

interface Props {
  faqs: ExamFaq[];
}

export default function ExamFaqSection({ faqs }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (faqs.length === 0) return null;

  return (
    <section className="flex flex-col gap-3.5">
      <h2 className="text-xl md:text-2xl font-semibold">Frequently asked questions</h2>
      <ul className="bg-white border border-line rounded-xl divide-y divide-line">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full min-h-[56px] flex items-center justify-between gap-4 px-5 py-3 text-left hover:bg-paper transition-colors"
                aria-expanded={isOpen}
              >
                <span className="text-[15px] font-semibold leading-snug">{faq.question}</span>
                <ChevronDown className={`w-4 h-4 shrink-0 text-[#667085] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && <p className="px-5 pb-4 text-[15px] text-[#475467] leading-relaxed">{faq.answer}</p>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
