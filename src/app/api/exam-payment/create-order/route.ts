import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Session expired. Please log in again.' }, { status: 401 });
  }

  const body  = await req.json();
  const token = (session.user as any).accessToken as string;

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/exam-payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        Authorization:   `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Could not reach payment server. Please try again.' },
      { status: 503 },
    );
  }

  // Safely parse JSON — backend should always return JSON, but be defensive
  let data: unknown;
  try {
    data = await res.json();
  } catch {
    return NextResponse.json(
      { success: false, message: `Payment service error (HTTP ${res.status}). Please try again.` },
      { status: res.status || 500 },
    );
  }

  return NextResponse.json(data, { status: res.status });
}
