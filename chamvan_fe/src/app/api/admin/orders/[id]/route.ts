// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
// const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '');

// export async function PATCH(req: Request, { params }: { params: { id: string } }) {
//   const body = await req.json();
//   const cookieStore = await cookies();
//   const token = cookieStore.get('cv_token')?.value;

//   const res = await fetch(`${BASE}/orders/${params.id}`, {
//     method: 'PATCH',
//     headers: {
//       'Content-Type': 'application/json',
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     },
//     body: JSON.stringify(body),
//   });

//   const data = await res.json().catch(() => ({}));
//   return NextResponse.json(data, { status: res.status });
// }








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
