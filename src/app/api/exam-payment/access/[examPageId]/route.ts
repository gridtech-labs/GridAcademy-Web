import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export async function GET(
  req: NextRequest,
  { params }: { params: { examPageId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ hasAccess: false });

  const token = (session.user as any).accessToken;

  try {
    const res = await fetch(`${API_BASE}/api/exam-payment/access/${params.examPageId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ hasAccess: false });
  }
}
