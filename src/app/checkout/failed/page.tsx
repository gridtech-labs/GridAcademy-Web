import { XCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutFailedPage({
  searchParams,
}: {
  searchParams: { ref?: string; exam?: string };
}) {
  const examSlug = searchParams.exam;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-10 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Payment Failed</h1>
        <p className="text-gray-500 mb-2">Something went wrong with your payment.</p>
        {searchParams.ref && (
          <p className="text-xs text-gray-400 font-mono mb-4">Ref: {searchParams.ref}</p>
        )}
        <p className="text-sm text-gray-600 mb-8">
          Your payment could not be processed. No amount has been deducted.
          Please try again or contact support if the issue persists.
        </p>
        <div className="flex flex-col gap-3">
          {examSlug ? (
            <Link href={`/exam/${examSlug}`}
              className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-colors">
              <RefreshCw className="w-5 h-5" /> Try Again
            </Link>
          ) : (
            <Link href="/exams"
              className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-colors">
              <RefreshCw className="w-5 h-5" /> Browse Exams
            </Link>
          )}
          <Link href="/"
            className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700">
            <Home className="w-4 h-4" /> Back to Home
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-6">
          Need help?{' '}
          <a href="mailto:support@gridacademy.in" className="text-orange-500 hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
