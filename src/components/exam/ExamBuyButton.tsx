'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Loader2, CheckCircle, Tag, X, ChevronDown, ChevronUp } from 'lucide-react';

interface ExamOffer {
  id: number;
  code: string;
  title: string;
  description?: string;
  offerType: number; // 0=Percentage, 1=Fixed, 2=FreeAccess
  value: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
}

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
  hasAccess: boolean;
  token?: string;
  offers?: ExamOffer[];
}

declare global { interface Window { Razorpay: any } }

export default function ExamBuyButton({
  examPageId, examTitle, examSlug, priceInr, hasAccess, token, offers = []
}: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  const [loading, setLoading]           = useState(false);
  const [offerCode, setOfferCode]       = useState('');
  const [offerInput, setOfferInput]     = useState('');
  const [offerResult, setOfferResult]   = useState<{ valid: boolean; message: string; discount: number; final: number; title?: string } | null>(null);
  const [validating, setValidating]     = useState(false);
  const [showOffers, setShowOffers]     = useState(false);
  const [orderPreview, setOrderPreview] = useState<{ gst: number; total: number } | null>(null);

  const GST_RATE = 0.18;
  const effectiveBase   = offerResult?.valid ? offerResult.final : priceInr;
  const estimatedGst    = Math.round(effectiveBase * GST_RATE * 100) / 100;
  const estimatedTotal  = effectiveBase + estimatedGst;

  // Already has access
  if (hasAccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
        <p className="font-bold text-green-800 mb-3">You have access!</p>
        <a href={`/exam/${examSlug}`}
          className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors">
          Start Preparing
        </a>
      </div>
    );
  }

  // Free exam
  if (priceInr === 0) return null;

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
      setOfferResult({
        valid:    d.isValid,
        message:  d.message,
        discount: d.discountAmount,
        final:    d.finalAmount,
        title:    d.offerTitle,
      });
      if (d.isValid) setOfferCode(code.trim().toUpperCase());
    } catch {
      setOfferResult({ valid: false, message: 'Could not validate. Try again.', discount: 0, final: priceInr });
    } finally {
      setValidating(false);
    }
  };

  const removeOffer = () => {
    setOfferCode('');
    setOfferInput('');
    setOfferResult(null);
  };

  const handleBuy = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=/exam/${examSlug}`);
      return;
    }
    setLoading(true);
    try {
      const authToken = (session.user as any)?.accessToken ?? token;

      // Step 1: Create order
      const res = await fetch('/api/exam-payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({ examPageId, offerCode: offerCode || null }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? 'Failed to create order');
      const order: CreateOrderResponse = json.data ?? json;

      // Free after offer — redirect to success
      if (!order.razorpayOrderId || order.grandTotal <= 0) {
        router.push(`/checkout/success?ref=${order.bookingRef}&exam=${examSlug}`);
        return;
      }

      // Step 2: Load Razorpay SDK
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://checkout.razorpay.com/v1/checkout.js';
          s.onload = () => resolve();
          s.onerror = () => reject(new Error('Failed to load payment gateway'));
          document.body.appendChild(s);
        });
      }

      // Step 3: Open Razorpay modal
      const rzp = new window.Razorpay({
        key:         order.razorpayKeyId,
        amount:      Math.round(order.grandTotal * 100), // paise
        currency:    'INR',
        name:        'GridAcademy',
        description: order.examTitle,
        order_id:    order.razorpayOrderId,
        prefill: {
          name:    order.prefillName,
          email:   order.prefillEmail,
        },
        notes: {
          booking_ref: order.bookingRef,
          exam_slug:   examSlug,
        },
        theme: { color: '#f97316' },
        modal: {
          ondismiss: () => setLoading(false),
        },
        handler: async (response: any) => {
          // Step 4: Verify on server
          const verifyRes = await fetch('/api/exam-payment/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
            },
            body: JSON.stringify({
              orderId:            order.orderId,
              razorpayOrderId:    response.razorpay_order_id,
              razorpayPaymentId:  response.razorpay_payment_id,
              razorpaySignature:  response.razorpay_signature,
            }),
          });
          if (verifyRes.ok) {
            router.push(`/checkout/success?ref=${order.bookingRef}&exam=${examSlug}`);
          } else {
            router.push(`/checkout/failed?ref=${order.bookingRef}`);
          }
        },
      });
      rzp.open();
    } catch (err: any) {
      alert(err.message ?? 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Price breakdown */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Base Price</span>
          <span className="font-semibold">₹{priceInr.toLocaleString('en-IN')}</span>
        </div>
        {offerResult?.valid && offerResult.discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{offerResult.title ?? offerCode}</span>
            <span className="font-semibold">−₹{offerResult.discount.toLocaleString('en-IN')}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-400 text-xs">
          <span>GST (18%)</span>
          <span>₹{estimatedGst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2 mt-1">
          <span>Total</span>
          <span className="text-orange-600">₹{estimatedTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Available offers teaser */}
      {offers.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowOffers(v => !v)}
            className="flex items-center gap-2 text-sm text-orange-600 font-semibold hover:underline w-full">
            <Tag className="w-4 h-4" />
            {offers.length} offer{offers.length > 1 ? 's' : ''} available
            {showOffers ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
          </button>
          {showOffers && (
            <div className="mt-2 space-y-2">
              {offers.map(o => (
                <div key={o.id}
                  className="border border-dashed border-orange-300 rounded-lg p-3 bg-orange-50 flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded font-bold">{o.code}</span>
                    <p className="text-xs font-semibold text-gray-800 mt-1">{o.title}</p>
                    {o.description && <p className="text-xs text-gray-500">{o.description}</p>}
                    <p className="text-xs text-green-700 mt-0.5 font-semibold">
                      {o.offerType === 0 ? `${o.value}% off` : o.offerType === 1 ? `₹${o.value} off` : 'Free Access'}
                      {o.minOrderAmount > 0 ? ` · Min ₹${o.minOrderAmount}` : ''}
                      {o.maxDiscountAmount ? ` · Max ₹${o.maxDiscountAmount}` : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setOfferInput(o.code); validateOffer(o.code); setShowOffers(false); }}
                    className="text-xs text-orange-600 border border-orange-400 rounded px-2 py-1 hover:bg-orange-100 whitespace-nowrap">
                    Apply
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Offer code input */}
      {!offerResult?.valid ? (
        <div className="flex gap-2 w-full">
          <input
            type="text"
            value={offerInput}
            onChange={e => setOfferInput(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && validateOffer(offerInput)}
            placeholder="Offer code"
            className="flex-1 min-w-0 text-sm border border-gray-300 rounded-lg px-3 py-2 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-orange-400"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => validateOffer(offerInput)}
            disabled={validating || !offerInput.trim()}
            className="shrink-0 w-20 text-sm font-semibold py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 border border-gray-300 transition-colors">
            {validating ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Apply'}
          </button>
        </div>
      ) : (
        <div className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${offerResult.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <span className={offerResult.valid ? 'text-green-700 font-semibold' : 'text-red-600'}>
            {offerResult.valid ? `✓ ${offerResult.message}` : offerResult.message}
          </span>
          {offerResult.valid && (
            <button onClick={removeOffer} className="text-gray-400 hover:text-gray-600 ml-2">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
      {offerResult && !offerResult.valid && (
        <p className="text-xs text-red-500 -mt-1">{offerResult.message}</p>
      )}

      {/* Buy button */}
      <button
        onClick={handleBuy}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3.5 rounded-xl transition-colors text-base shadow-sm">
        {loading
          ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
          : <><ShoppingCart className="w-5 h-5" /> Buy Now · ₹{estimatedTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</>
        }
      </button>

      <p className="text-center text-xs text-gray-400">
        🔒 Secure payment via Razorpay · Lifetime access
      </p>
    </div>
  );
}
