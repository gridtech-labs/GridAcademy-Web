import Link from 'next/link';
import { Check } from 'lucide-react';
import Logo from '@/components/layout/Logo';

export const fieldClass = (hasError = false) =>
  `w-full h-12 px-3.5 rounded-lg border text-[15px] bg-white text-ink placeholder:text-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
    hasError ? 'border-[#d92d20] bg-[#fef3f2]' : 'border-[#d0d5dd]'
  }`;

export const labelClass = 'text-[13.5px] font-medium text-ink';
export const errorTextClass = 'text-xs text-[#b42318]';

export function FormError({ children }: { children: React.ReactNode }) {
  return <p className="text-[13.5px] text-[#b42318] bg-[#fef3f2] border border-[#fecdca] rounded-lg px-3.5 py-2.5">{children}</p>;
}

interface Props {
  eyebrow: string;
  headline: string;
  points: string[];
  children: React.ReactNode;
  /** Small links under the card (e.g. provider sign-up). */
  footer?: React.ReactNode;
  wide?: boolean;
}

/** Split auth layout: ink brand panel on desktop, form card on paper. */
export default function AuthShell({ eyebrow, headline, points, children, footer, wide = false }: Props) {
  return (
    <div className="min-h-screen flex bg-paper text-ink">
      <aside className="hidden lg:flex lg:w-[44%] xl:w-[40%] flex-col justify-between bg-ink text-white p-12 xl:p-14">
        <Logo size={30} dark />
        <div className="flex flex-col gap-5 max-w-[420px]">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-[#8fb3ff]">{eyebrow}</p>
          <h2 className="text-[40px] xl:text-[44px] leading-[1.08] font-bold tracking-[-0.02em]">{headline}</h2>
          <ul className="flex flex-col gap-3 mt-2">
            {points.map(p => (
              <li key={p} className="flex items-start gap-3 text-[15.5px] text-[#c7cedb] leading-snug">
                <span className="w-6 h-6 rounded-full bg-ink-soft flex items-center justify-center shrink-0 mt-px">
                  <Check className="w-3.5 h-3.5 text-[#6ce9a6]" strokeWidth={2.6} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-ink-muted">© {new Date().getFullYear()} GridAcademy · <Link href="/privacy" className="hover:text-white">Privacy</Link> · <Link href="/terms" className="hover:text-white">Terms</Link></p>
      </aside>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-12">
        <div className="lg:hidden mb-7"><Logo size={30} /></div>
        <div className={`w-full ${wide ? 'max-w-[560px]' : 'max-w-[420px]'}`}>
          {children}
          {footer && <div className="mt-5 text-center text-[13.5px] text-[#475467]">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
