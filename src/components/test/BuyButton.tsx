'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Loader2, BookOpen } from 'lucide-react';
import { TestSeriesDetail } from '@/types';

interface Props { series: TestSeriesDetail; hasAccess: boolean; }

declare global { interface Window { Razorpay: any } }

export default function BuyButton({ series, hasAccess }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (hasAccess) {
    return (
      <a href={`/exam/${series.id}/1`}
        className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
        <BookOpen className="w-5 h-5" /> Continue Learning
      </a>
    );
  }

  const handleBuy = async () => {
    if (!session) { router.push(`/login?callbackUrl=/test/${series.slug}`); return; }
    setLoading(true);
    try {
      // Step 1: Create order on server
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seriesId: series.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? 'Failed to create order');

      // Step 2: Load Razorpay SDK dynamically
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://checkout.razorpay.com/v1/checkout.js';
          s.onload = () => resolve();
          s.onerror = () => reject(new Error('Failed to load Razorpay'));
          document.body.appendChild(s);
        });
      }

      // Step 3: Open Razorpay checkout
      const rzp = new window.Razorpay({
        key: data.data.keyId,
        amount: data.data.amount,
        currency: data.data.currency,
        name: 'GridAcademy',
        description: series.title,
        order_id: data.data.razorpayOrderId,
        prefill: data.data.prefill,
        theme: { color: '#4f46e5' },
        handler: async (response: any) => {
          // Step 4: Verify payment on server
          const verifyRes = await fetch('/api/orders/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: data.data.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          if (verifyRes.ok) {
            router.push(`/checkout/success?ref=${data.data.orderId}`);
          } else {
            router.push('/checkout/failed');
          }
        },
      });
      rzp.open();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleBuy} disabled={loading}
      className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
      {loading ? 'Processing...' : series.priceInr === 0 ? 'Start Free Test' : `Buy Now — ${series.priceInr.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}`}
    </button>
  );
}
