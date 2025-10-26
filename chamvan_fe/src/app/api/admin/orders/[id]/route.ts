
// src/app/api/admin/orders/[id]/route.ts
import { NextResponse } from 'next/server';

const BE = process.env.NEXT_PUBLIC_BE?.replace(/\/+$/, '') || 'http://localhost:4000/api';

export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  const body = await _req.json();
  const r = await fetch(`${BE}/admin/orders/${params.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}
