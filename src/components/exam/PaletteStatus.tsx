/**
 * NTA-style question status marks. Shape and colour both carry the status, so the
 * palette stays readable for colour-blind students and matches the real exam screen.
 */

export type QStatus = 'notVisited' | 'notAnswered' | 'answered' | 'marked' | 'answeredMarked';

export const STATUS_ORDER: QStatus[] = ['answered', 'notAnswered', 'notVisited', 'marked', 'answeredMarked'];

export const STATUS_LABEL: Record<QStatus, string> = {
  notVisited:     'Not visited',
  notAnswered:    'Not answered',
  answered:       'Answered',
  marked:         'Marked for review',
  answeredMarked: 'Answered & marked for review',
};

const SHAPE: Record<QStatus, { className: string; style?: React.CSSProperties }> = {
  notVisited:     { className: 'bg-[#eef1f5] text-[#344054] border border-[#d0d5dd] rounded-md' },
  notAnswered:    { className: 'bg-[#d92d20] text-white pb-1.5', style: { clipPath: 'polygon(0 0,100% 0,100% 72%,50% 100%,0 72%)' } },
  answered:       { className: 'bg-[#12803c] text-white pt-2', style: { clipPath: 'polygon(0 28%,50% 0,100% 28%,100% 100%,0 100%)' } },
  marked:         { className: 'bg-[#6941c6] text-white rounded-full aspect-square' },
  answeredMarked: { className: 'bg-[#6941c6] text-white rounded-full aspect-square' },
};

interface MarkProps {
  status: QStatus;
  children?: React.ReactNode;
  /** width × height in px; circles use the height for both */
  size?: [number, number];
  current?: boolean;
  className?: string;
}

export function StatusMark({ status, children, size = [44, 40], current = false, className = '' }: MarkProps) {
  const shape = SHAPE[status];
  const round = status === 'marked' || status === 'answeredMarked';
  const [w, h] = size;
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center font-semibold leading-none tabular-nums ${className}`}
      style={{ width: round ? h : w, height: h, fontSize: Math.max(11, Math.round(h * 0.36)) }}
    >
      <span
        className={`absolute inset-0 flex items-center justify-center ${shape.className}`}
        style={shape.style}
      >
        {children}
      </span>
      {status === 'answeredMarked' && (
        <span className="absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full bg-[#12803c] border-2 border-white" aria-hidden />
      )}
      {current && (
        <span className="absolute -inset-1.5 rounded-lg ring-2 ring-ink pointer-events-none" aria-hidden />
      )}
    </span>
  );
}

export function StatusLegend({
  counts,
  columns = 2,
  compact = false,
}: {
  counts?: Partial<Record<QStatus, number>>;
  columns?: 1 | 2;
  compact?: boolean;
}) {
  return (
    <ul className={`grid gap-x-3 ${compact ? 'gap-y-2' : 'gap-y-3'} ${columns === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
      {STATUS_ORDER.map(s => (
        <li key={s} className={`flex items-center gap-2.5 text-[#344054] ${compact ? 'text-[12.5px]' : 'text-[13.5px]'} leading-tight`}>
          <StatusMark status={s} size={compact ? [30, 28] : [34, 30]}>
            {counts ? counts[s] ?? 0 : ''}
          </StatusMark>
          <span>{STATUS_LABEL[s]}</span>
        </li>
      ))}
    </ul>
  );
}
