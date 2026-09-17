'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import type { StreamKey } from '@/lib/streams';

/**
 * Home-page stream switching, handled in the browser.
 *
 * The hero cards and the tabs above the exam list used to be links to
 * `/?stream=cuet#exams` with scroll={false}. Every click made Next.js re-render the
 * whole page on the server (refetching every exam), and because scroll={false} also
 * cancels the jump to the #exams hash, visitors stayed on the hero with only the URL
 * changed. Every stream's list is already rendered into the page, so switching is now
 * plain state: instant, no navigation, no query/hash added to the URL. `?stream=` is
 * still honoured on first load (the server picks the initial tab).
 */

interface StreamState {
  active: StreamKey;
  select: (key: StreamKey) => void;
}

const StreamContext = createContext<StreamState | null>(null);

function useStream(): StreamState {
  const ctx = useContext(StreamContext);
  if (!ctx) throw new Error('StreamCard and StreamTabs must be rendered inside <StreamProvider>.');
  return ctx;
}

/**
 * Scrolls a section into view. Smooth by default, but if the page has not moved at all
 * shortly after (some browsers / webviews skip smooth-scroll animations), it jumps
 * instead so the tap never looks like a no-op. A running smooth scroll has always moved
 * within that delay, so it is never cut short. Honours prefers-reduced-motion.
 */
function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const startY = window.scrollY;
  el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  if (reduceMotion) return;

  window.setTimeout(() => {
    // scroll-margin puts the section ~64px from the top; beyond 80px it isn't in place
    if (window.scrollY === startY && Math.abs(el.getBoundingClientRect().top) > 80) {
      el.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }, 450);
}

export function StreamProvider({ initial, children }: { initial: StreamKey; children: ReactNode }) {
  const [active, setActive] = useState<StreamKey>(initial);
  const select = useCallback((key: StreamKey) => setActive(key), []);
  return <StreamContext.Provider value={{ active, select }}>{children}</StreamContext.Provider>;
}

/**
 * Hero card: selects its stream (when given) and scrolls to the target section.
 * It stays a real `#target` link, so it still jumps to the section without JavaScript.
 */
export function StreamCard({
  stream, target, className, children,
}: {
  stream?: StreamKey;
  target: string;
  className?: string;
  children: ReactNode;
}) {
  const { select } = useStream();
  return (
    <a
      href={`#${target}`}
      className={className}
      onClick={e => {
        e.preventDefault();
        if (stream) select(stream);
        scrollToSection(target);
      }}
    >
      {children}
    </a>
  );
}

/**
 * Stream tabs plus one panel per stream. All panels stay in the HTML (inactive ones are
 * `hidden`), so every stream's exams remain crawlable.
 */
export function StreamTabs({
  tabs, panels,
}: {
  tabs: { key: StreamKey; name: string }[];
  panels: Record<StreamKey, ReactNode>;
}) {
  const { active, select } = useStream();
  return (
    <>
      <div
        className="flex gap-1 border-b border-line overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
        role="tablist"
        aria-label="Exam streams"
      >
        {tabs.map(t => (
          <button
            key={t.key}
            type="button"
            role="tab"
            id={`stream-tab-${t.key}`}
            aria-selected={t.key === active}
            aria-controls={`stream-panel-${t.key}`}
            onClick={() => select(t.key)}
            className={`h-11 flex items-center px-4 text-[14.5px] font-semibold whitespace-nowrap border-b-[3px] transition-colors ${
              t.key === active ? 'text-primary-dark border-primary' : 'text-[#475467] border-transparent hover:text-ink'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {tabs.map(t => (
        <div
          key={t.key}
          role="tabpanel"
          id={`stream-panel-${t.key}`}
          aria-labelledby={`stream-tab-${t.key}`}
          hidden={t.key !== active}
        >
          {panels[t.key]}
        </div>
      ))}
    </>
  );
}
