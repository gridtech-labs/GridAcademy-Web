import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import DashboardSidebar from '@/components/exam/DashboardSidebar';
import MobileDashboardNav from '@/components/exam/MobileDashboardNav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const user = session.user as any;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <DashboardSidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0">
          <div>
            <p className="font-bold text-gray-900 text-sm">
              Welcome, {user?.name?.split(' ')[0] ?? 'Student'} 👋
            </p>
            <p className="text-xs text-gray-500">{user?.email ?? ''}</p>
          </div>
          {/* Mobile: shows logo on left side */}
          <div className="md:hidden flex items-center gap-1.5">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" stroke="currentColor" strokeWidth={2}>
                <path d="M12 3L2 9l10 6 10-6-10-6Z" /><path d="M2 15l10 6 10-6" /><path d="M2 12l10 6 10-6" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-sm">Grid Academy</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <MobileDashboardNav />
      </div>
    </div>
  );
}
