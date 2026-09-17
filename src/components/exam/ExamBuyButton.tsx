'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldCheck, Tag, Unlock, X } from 'lucide-react';
import type { ExamOffer } from '@/lib/exam-page-data';

interface CreateOrderResponse {
  orderId: string;
  bookingRef: string;
  razorpayOrderId: string;
  razorpayKeyId: string;
  originalAmount: number;
  discountAmount: number;
  gstAmount: number;
  grandTotal: number;
  offerTitle?: string;
  examTitle: string;
  examSlug: string;
  prefillName?: string;
  prefillEmail?: string;
}

interface Props {
  examPageId: string;
  examTitle: string;
  examSlug: string;
  priceInr: number;
  /** Number of paid tests this one payment unlocks. */
  paidTestCount: number;
  token?: string;
  offers?: ExamOffer[];
  /** compact = unlock button only (for banners); full = price breakdown + coupon */
  layout?: 'full' | 'compact';
}

declare global { interface Window { Razorpay: any } }

const GST_RATE = 0.18;
const money = (n: number) => `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function ExamBuyButton({
  examPageId, examTitle, examSlug, priceInr, paidTestCount, token, offers = [], layout = 'full',
}: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  const [loading, setLoading]         = useState(false);
  const [offerCode, setOfferCode]     = useState('');
  const [offerInput, setOfferInput]   = useState('');
  const [offerResult, setOfferResult] = useState<{ valid: boolean; message: string; discount: number; final: number; title?: string } | null>(null);
  const [validating, setValidating]   = useState(false);
  const [error, setError]             = useState<string | null>(null);

  if (priceInr <= 0) return null;

  const base  = offerResult?.valid ? offerResult.final : priceInr;
  const gst   = Math.round(base * GST_RATE * 100) / 100;
  const total = base + gst;

  const validateOffer = async (code: string) => {
    if (!code.trim()) return;
    setValidating(true);
    try {
      const res = await fetch('/api/exam-payment/offers/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim().toUpperCase(), examPageId, originalAmount: priceInr }),
      });
      const data = await res.json();
      const d = data.data ?? data;
      setOfferResult({ valid: d.isValid, message: d.message, discount: d.discountAmount, final: d.finalAmount, title: d.offerTitle });
      if (d.isValid) setOfferCode(code.trim().toUpperCase());
    } catch {
      setOfferResult({ valid: false, message: 'Could not check this code. Try again.', discount: 0, final: priceInr });
    } finally {
      setValidating(false);
    }
  };

  const removeOffer = () => { setOfferCode(''); setOfferInput(''); setOfferResult(null); };

  const handleBuy = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=/exam/${examSlug}`);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const authToken = (session.user as any)?.accessToken ?? token;
      const res = await fetch('/api/exam-payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
        body: JSON.stringify({ examPageId, offerCode: offerCode || null }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? 'Failed to create order');
      const order: CreateOrderResponse = json.data ?? json;

      // Free after offer — no gateway needed
      if (!order.razorpayOrderId || order.grandTotal <= 0) {
        router.push(`/checkout/success?ref=${order.bookingRef}&exam=${examSlug}`);
        return;
      }

      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://checkout.razorpay.com/v1/checkout.js';
          s.onload = () => resolve();
          s.onerror = () => reject(new Error('Failed to load payment gateway'));
          document.body.appendChild(s);
        });
      }

      const rzp = new window.Razorpay({
        key:         order.razorpayKeyId,
        amount:      Math.round(order.grandTotal * 100), // paise
        currency:    'INR',
        name:        'GridAcademy',
        description: order.examTitle ?? examTitle,
        order_id:    order.razorpayOrderId,
        prefill:     { name: order.prefillName, email: order.prefillEmail },
        notes:       { booking_ref: order.bookingRef, exam_slug: examSlug },
        theme:       { color: '#1760f4' },
        modal:       { ondismiss: () => setLoading(false) },
        handler: async (response: any) => {
          const verifyRes = await fetch('/api/exam-payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
            body: JSON.stringify({
              orderId:           order.orderId,
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          router.push(verifyRes.ok
            ? `/checkout/success?ref=${order.bookingRef}&exam=${examSlug}`
            : `/checkout/failed?ref=${order.bookingRef}`);
        },
      });
      rzp.open();
    } catch (err: any) {
      setError(err?.message ?? 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const unlockLabel = `Unlock all ${paidTestCount} test${paidTestCount === 1 ? '' : 's'} · ₹${priceInr.toLocaleString('en-IN')} · Lifetime access`;

  const button = (
    <button
      onClick={handleBuy}
      disabled={loading}
      className={`w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold text-center leading-tight px-4
        ${layout === 'compact' ? 'min-h-11 text-[15px]' : 'min-h-[52px] text-[15px] md:text-base py-2'}`}
    >
      {loading ? <Loader2 className="w-[18px] h-[18px] animate-spin shrink-0" /> : <Unlock className="w-[18px] h-[18px] shrink-0" />}
      {loading ? 'Opening checkout…' : unlockLabel}
    </button>
  );

  if (layout === 'compact') {
    return (
      <div>
        {button}
        {error && <p className="text-xs text-[#fda29b] mt-1.5">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3.5">
      {button}
      {error && <p className="text-[13px] text-[#b42318] -mt-1">{error}</p>}

      <dl className="flex flex-col gap-2 text-sm px-3.5 py-3 bg-[#f9fafb] rounded-lg">
        <div className="flex justify-between"><dt className="text-[#475467]">Price</dt><dd className="font-mono">{money(priceInr)}</dd></div>
        {offerResult?.valid && offerResult.discount > 0 && (
          <div className="flex justify-between text-[#0b6b31]">
            <dt className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" />{offerResult.title ?? offerCode}</dt>
            <dd className="font-mono">−{money(offerResult.discount)}</dd>
          </div>
        )}
        <div className="flex justify-between"><dt className="text-[#475467]">GST (18%)</dt><dd className="font-mono">{money(gst)}</dd></div>
        <div className="h-px bg-line" />
        <div className="flex justify-between font-semibold"><dt>You pay</dt><dd className="font-mono">{money(total)}</dd></div>
      </dl>

      {offerResult?.valid ? (
        <div className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm bg-[#e7f6ec] text-[#0b6b31]">
          <span className="font-medium">{offerResult.message}</span>
          <button onClick={removeOffer} className="w-8 h-8 -mr-1 flex items-center justify-center" aria-label="Remove coupon"><X className="w-4 h-4" /></button>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2">
            <input
              type="text"
              value={offerInput}
              onChange={e => setOfferInput(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && validateOffer(offerInput)}
              placeholder="Coupon code"
              aria-label="Coupon code"
              className="flex-1 min-w-0 h-10 px-3 rounded-lg border border-dashed border-[#98a2b3] text-sm uppercase tracking-wide focus:outline-none focus:border-primary focus:border-solid"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => validateOffer(offerInput)}
              disabled={validating || !offerInput.trim()}
              className="h-10 w-20 rounded-lg border border-[#d0d5dd] text-sm font-semibold hover:bg-paper disabled:opacity-50"
            >
              {validating ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Apply'}
            </button>
          </div>
          {offerResult && !offerResult.valid && <p className="text-xs text-[#b42318]">{offerResult.message}</p>}
          {offers.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {offers.map(o => (
                <button key={o.id} type="button"
                  onClick={() => { setOfferInput(o.code); validateOffer(o.code); }}
                  title={o.description ?? o.title}
                  className="h-7 inline-flex items-center gap-1.5 px-2.5 rounded-full bg-[#fef3dc] text-[#8a5200] text-xs font-medium hover:bg-[#fde7b8]">
                  <Tag className="w-3 h-3" />
                  <span className="font-mono font-semibold">{o.code}</span>
                  · {o.offerType === 0 ? `${o.value}% off` : o.offerType === 1 ? `₹${o.value} off` : 'Free access'}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <p className="flex items-center gap-2 text-[13px] text-[#475467]">
        <ShieldCheck className="w-4 h-4 text-[#12803c] shrink-0" /> Secure Razorpay checkout · UPI, cards, netbanking
      </p>
    </div>
  );
}
