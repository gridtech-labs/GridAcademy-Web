import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leaderboard — Top Mock Test Scorers',
  description: 'See the top-ranking students on GridAcademy across SSC, Banking, Railway, UPSC and CUET mock tests.',
  alternates: { canonical: 'https://www.gridacademy.in/leaderboard' },
};

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
