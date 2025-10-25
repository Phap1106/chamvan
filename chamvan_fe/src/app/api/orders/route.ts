// src/app/api/orders/route.ts
import { NextResponse } from 'next/server';

const BE = process.env.NEXT_PUBLIC_BE?.replace(/\/+$/, '') || 'http://localhost:4000/api';

export async function POST(req: Request) {
  const body = await req.json();
  const r = await fetch(`${BE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}
