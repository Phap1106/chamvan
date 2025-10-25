// import { NextResponse } from 'next/server';
// const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '');

// export async function GET() {
//   const res = await fetch(`${BASE}/orders`, { cache: 'no-store' });
//   const data = await res.json().catch(() => ({}));
//   return NextResponse.json(data, { status: res.status });
// }






// src/app/api/admin/orders/route.ts
import { NextResponse } from 'next/server';

const BE = process.env.NEXT_PUBLIC_BE?.replace(/\/+$/, '') || 'http://localhost:4000/api';

export async function GET() {
  const r = await fetch(`${BE}/admin/orders`, { cache: 'no-store' });
  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}
