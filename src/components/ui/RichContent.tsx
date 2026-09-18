'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Renders HTML written by a test author or the CMS.
 *
 * Tables keep their natural width and scroll inside a wrapper instead of
 * stretching the column they sit in — without that, a wide table widens the whole
 * page (the container must also allow shrinking, i.e. `min-w-0` in a flex/grid).
 * Until this runs, the CSS fallback in globals.css keeps tables inside the page.
 */
export default function RichContent({ html, className }: { html: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
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
      className={cn('exam-rich-content min-w-0', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
