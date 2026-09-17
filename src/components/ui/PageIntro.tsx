import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Crumb { label: string; href?: string }

interface Props {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  crumbs?: Crumb[];
  /** Right-hand slot on desktop (search, actions); stacks under the text on mobile. */
  aside?: React.ReactNode;
  children?: React.ReactNode;
  narrow?: boolean;
}

/** Exam Hall page header band: paper background, breadcrumb, eyebrow, title, description. */
export default function PageIntro({ eyebrow, title, description, crumbs, aside, children, narrow = false }: Props) {
  return (
    <section className="bg-paper border-b border-line">
      <div className={`${narrow ? 'max-w-[880px]' : 'max-w-[1328px]'} mx-auto px-4 md:px-6 lg:px-8 pt-5 md:pt-7 pb-7 md:pb-10 flex flex-col gap-4`}>
        {crumbs && crumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-[13.5px] text-[#667085] overflow-x-auto whitespace-nowrap scrollbar-hide" aria-label="Breadcrumb">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                {c.href ? <Link href={c.href} className="hover:text-primary-dark">{c.label}</Link> : <span className="text-[#344054]">{c.label}</span>}
              </span>
            ))}
          </nav>
        )}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div className="flex flex-col gap-3 min-w-0 max-w-[760px]">
            {eyebrow && <p className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-primary-dark">{eyebrow}</p>}
            <h1 className="text-[28px] leading-[1.15] md:text-[40px] md:leading-[1.1] font-bold tracking-[-0.02em] text-ink">{title}</h1>
            {description && <p className="text-base md:text-[17.5px] leading-relaxed text-[#475467]">{description}</p>}
          </div>
          {aside && <div className="lg:shrink-0">{aside}</div>}
        </div>
        {children}
      </div>
    </section>
  );
}
