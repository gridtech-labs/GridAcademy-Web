import Link from 'next/link';

/**
 * Brand lockup: a grid mark (four answer cells, one answered — the same idea as the
 * question palette in the exam screen) next to a two-tone wordmark. The wordmark is
 * deliberately heavier and larger than the navigation around it so the brand reads
 * first; `size` is the height of the mark and everything else scales from it.
 */
export default function Logo({ size = 34, dark = false }: { size?: number; dark?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5 shrink-0" aria-label="GridAcademy home">
      <GridMark size={size} />
      <span
        className="font-bold leading-none whitespace-nowrap"
        style={{ fontSize: Math.round(size * 0.58), letterSpacing: '-0.022em' }}
      >
        <span className={dark ? 'text-white' : 'text-ink'}>Grid</span>
        <span className={dark ? 'text-[#aeb7c7]' : 'text-[#5a6476]'}>Academy</span>
      </span>
    </Link>
  );
}

/** The mark on its own — square, so it also works as an avatar or app icon. */
export function GridMark({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect width="40" height="40" rx="10" fill="#1760f4" />
      <rect width="40" height="40" rx="10" fill="url(#gridacademy-mark)" />
      <g fill="#fff">
        <rect x="9" y="9" width="9.5" height="9.5" rx="2.5" />
        <rect x="21.5" y="9" width="9.5" height="9.5" rx="2.5" opacity=".55" />
        <rect x="9" y="21.5" width="9.5" height="9.5" rx="2.5" opacity=".55" />
      </g>
      <rect x="21.5" y="21.5" width="9.5" height="9.5" rx="2.5" fill="#f5a524" />
      <defs>
        <linearGradient id="gridacademy-mark" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity=".18" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
