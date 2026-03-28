import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import crypto from 'crypto';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = await req.json();

  // Verify Razorpay signature on server (never trust client)
  const secret = process.env.RAZORPAY_KEY_SECRET!;
  const body = razorpayOrderId + '|' + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
  }

  // Forward to ASP.NET Core API to confirm booking + grant entitlement
  const token = (session.user as any).accessToken;
  const res = await fetch(`${API_BASE}/api/orders/verify-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature }),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
