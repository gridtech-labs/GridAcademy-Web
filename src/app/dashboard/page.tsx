import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { api } from '@/lib/api-client';
import { PurchasedSeries, Order } from '@/types';
import { redirect } from 'next/navigation';
import { formatDate, formatPrice } from '@/lib/utils';
import { BookOpen, Clock, BarChart2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  const token = (session.user as any).accessToken;
  const user = session.user as any;

  const [purchased, orders] = await Promise.all([
    api.get<PurchasedSeries[]>('/api/student/tests', token).catch(() => []),
    api.get<Order[]>('/api/student/orders', token).catch(() => []),
  ]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

          {/* Welcome */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
            <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="text-indigo-100 text-sm mt-1">Continue your exam preparation</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: BookOpen, label: 'Tests Purchased', value: purchased?.length ?? 0, color: 'text-indigo-600 bg-indigo-50' },
              { icon: BarChart2, label: 'Tests Taken', value: purchased?.reduce((a, t) => a + t.testsTaken, 0) ?? 0, color: 'text-green-600 bg-green-50' },
              { icon: Clock, label: 'In Progress', value: purchased?.filter(t => t.testsTaken > 0 && t.testsTaken < t.totalTests).length ?? 0, color: 'text-orange-600 bg-orange-50' },
              { icon: ShoppingBag, label: 'Orders', value: orders?.length ?? 0, color: 'text-purple-600 bg-purple-50' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-extrabold text-gray-900">{value}</div>
                <div className="text-xs text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* My Tests */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">My Test Series</h2>
              <Link href="/tests" className="text-sm text-indigo-600 font-medium hover:underline">Browse more</Link>
            </div>

            {!purchased?.length ? (
              <div className="text-center py-16">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No tests purchased yet</p>
                <p className="text-sm text-gray-400 mt-1">Explore our free tests to get started</p>
                <Link href="/tests?free=true"
                  className="inline-block mt-4 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700">
                  Try Free Tests
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {purchased.map(series => {
                  const progress = series.totalTests > 0
                    ? Math.round((series.testsTaken / series.totalTests) * 100) : 0;
                  return (
                    <div key={series.seriesId} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                        {series.thumbnailUrl
                          ? <img src={series.thumbnailUrl} className="w-12 h-12 rounded-xl object-cover" alt={series.title} />
                          : <BookOpen className="w-6 h-6 text-indigo-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate text-sm">{series.title}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <div className="flex-1 max-w-32 h-1.5 bg-gray-200 rounded-full">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-xs text-gray-500">{series.testsTaken}/{series.totalTests} done</span>
                        </div>
                      </div>
                      <Link href={`/exam/${series.seriesId}/next`}
                        className="shrink-0 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
                        {series.testsTaken === 0 ? 'Start' : 'Continue'}
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Order History */}
          {!!orders?.length && (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Order History</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Order ID', 'Test Series', 'Amount', 'Date', 'Status'].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-5 py-3 font-mono text-xs text-gray-500">{order.bookingRef}</td>
                        <td className="px-5 py-3 text-gray-800 max-w-[200px] truncate">{order.seriesTitle}</td>
                        <td className="px-5 py-3 font-semibold text-gray-900">{formatPrice(order.grandTotal)}</td>
                        <td className="px-5 py-3 text-gray-500">{formatDate(order.createdAt)}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                            ${order.status === 'Paid' ? 'bg-green-100 text-green-700' :
                              order.status === 'Failed' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-600'}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
