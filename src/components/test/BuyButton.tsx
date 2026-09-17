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
        className="h-12 w-full rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold flex items-center justify-center gap-2">
        <BookOpen className="w-[18px] h-[18px]" /> Continue
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
        theme: { color: '#1760f4' },
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
      className="h-12 w-full rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold flex items-center justify-center gap-2">
      {loading ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <ShoppingCart className="w-[18px] h-[18px]" />}
      {loading ? 'Processing…' : series.priceInr === 0 ? 'Start Free Test' : `Buy now · ${series.priceInr.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}`}
    </button>
  );
}
