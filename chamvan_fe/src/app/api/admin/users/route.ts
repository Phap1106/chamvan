// FE proxy -> BE /users
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '');

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();                 // Next15: phải await
    const token = cookieStore.get('cv_token')?.value;    // JWT lưu ở cookie FE

    const u = new URL(req.url);
    const qs = u.search ? u.search : '';
    const res = await fetch(`${BASE}/users${qs}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Proxy error' }, { status: 500 });
  }
}
