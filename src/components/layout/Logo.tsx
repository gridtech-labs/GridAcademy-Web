import Link from 'next/link';

export default function Logo({ size = 30, dark = false }: { size?: number; dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="GridAcademy home">
      <span
        className="rounded-lg bg-primary flex items-center justify-center text-white font-bold"
        style={{ width: size, height: size, fontSize: Math.round(size * 0.55) }}
      >
        G
      </span>
      <span
        className={`font-bold tracking-tight leading-none ${dark ? 'text-white' : 'text-ink'}`}
        style={{ fontSize: Math.round(size * 0.62) }}
      >
        GridAcademy
      </span>
    </Link>
  );
}
