import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export async function GET(
  req: NextRequest,
  { params }: { params: { examPageId: string } }
) {
  try {
    const res = await fetch(`${API_BASE}/api/exam-payment/offers/${params.examPageId}`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
