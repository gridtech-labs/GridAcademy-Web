import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Props {
  title: string;
  subtitle?: string;
  linkHref?: string;
  linkLabel?: string;
}
export default function SectionHeading({ title, subtitle, linkHref, linkLabel }: Props) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {linkHref && linkLabel && (
        <Link href={linkHref}
          className="shrink-0 flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 mt-1">
          {linkLabel} <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
