import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DashboardTabs from '@/components/exam/DashboardTabs';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login?callbackUrl=/dashboard');

  const user = session.user as any;
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <>
      <Header />
      <div className="min-h-screen bg-paper text-ink">
        <section className="bg-white border-b border-line">
          <div className="max-w-[1100px] mx-auto px-4 md:px-6 pt-6 md:pt-8">
            <p className="text-[13.5px] text-[#667085]">{user?.email}</p>
            <h1 className="text-[26px] md:text-[32px] font-bold tracking-[-0.015em] leading-tight mt-1">Hi, {firstName}</h1>
            <div className="mt-4"><DashboardTabs /></div>
          </div>
        </section>
        <main className="max-w-[1100px] mx-auto px-4 md:px-6 py-6 md:py-8">{children}</main>
      </div>
      <Footer />
    </>
  );
}
