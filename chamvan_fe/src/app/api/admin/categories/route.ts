import { NextResponse } from 'next/server';

const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '');

export async function GET() {
  const res = await fetch(`${BASE}/categories`, { cache: 'no-store' });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
