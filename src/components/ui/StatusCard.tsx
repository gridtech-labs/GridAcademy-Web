import { Check, X } from 'lucide-react';
import Logo from '@/components/layout/Logo';

/** Centered outcome card (payment success/failure and similar one-off states). */
export default function StatusCard({
  tone, title, children,
}: { tone: 'success' | 'error'; title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col items-center justify-center px-4 py-10">
      <div className="mb-7"><Logo size={34} /></div>
      <div className="w-full max-w-[440px] bg-white border border-line rounded-xl p-6 md:p-8 flex flex-col items-center text-center gap-4 shadow-[0_12px_32px_-16px_rgba(14,23,38,.18)]">
        <span className={`w-14 h-14 rounded-full flex items-center justify-center ${tone === 'success' ? 'bg-[#e7f6ec] text-[#0b6b31]' : 'bg-[#fee4e2] text-[#b42318]'}`}>
          {tone === 'success' ? <Check className="w-7 h-7" strokeWidth={2.6} /> : <X className="w-7 h-7" strokeWidth={2.6} />}
        </span>
        <h1 className="text-2xl font-bold">{title}</h1>
        {children}
      </div>
    </div>
  );
}
