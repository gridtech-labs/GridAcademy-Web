import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leaderboard',
  description: 'The GridAcademy leaderboard is coming soon.',
  alternates: { canonical: 'https://www.gridacademy.in/leaderboard' },
  // Placeholder page — keep it out of search results until real rankings ship
  robots: { index: false, follow: true },
};

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
