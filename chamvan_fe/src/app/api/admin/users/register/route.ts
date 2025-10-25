import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '');

export async function POST(req: Request) {
  const body = await req.json();
  const cookieStore = await cookies();
  const token = cookieStore.get('cv_token')?.value;

  // Force role support_admin tại BE nếu được; FE vẫn truyền cho rõ ràng
  const res = await fetch(`${BASE}/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ ...body, role: 'support_admin' }),
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
