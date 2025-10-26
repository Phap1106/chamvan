
// src/app/api/admin/orders/route.ts
import { NextResponse } from 'next/server';

const BE = process.env.NEXT_PUBLIC_BE?.replace(/\/+$/, '') || 'http://localhost:4000/api';

export async function GET() {
  const r = await fetch(`${BE}/admin/orders`, { cache: 'no-store' });
  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}
