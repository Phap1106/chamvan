import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  // ⬇️ Lấy cookie theo API mới (async)
  const cookieStore = await cookies();
  const token = cookieStore.get('cv_token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '');

  const res = await fetch(`${base}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
