import { CheckCircle, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { ref?: string };
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-10 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Payment Successful! 🎉</h1>
        <p className="text-gray-500 mb-2">Your booking is confirmed.</p>
        {searchParams.ref && (
          <p className="text-xs text-gray-400 font-mono mb-6">Ref: {searchParams.ref}</p>
        )}
        <p className="text-sm text-gray-600 mb-8">
          A confirmation email has been sent to your registered email address.
          You can now access your test series from My Tests.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/dashboard"
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-colors">
            <BookOpen className="w-5 h-5" /> Go to My Tests
          </Link>
          <Link href="/"
            className="text-sm text-gray-500 hover:text-gray-700">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
