// chamvan_fe/src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!.replace(/\/+$/, '');
  const body = await req.json();

  // DEBUG: in ra base (xem ở terminal của Next)
  // eslint-disable-next-line no-console
  console.log('[FE] login via base =', base);

  const res = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return NextResponse.json(
      { message: data?.message || 'Đăng nhập thất bại' },
      { status: res.status }
    );
  }

  const token = data?.access_token ?? data?.accessToken;
  if (!token) {
    return NextResponse.json({ message: 'Thiếu access token trong phản hồi' }, { status: 500 });
  }

  const resp = NextResponse.json({ user: data.user }, { status: 200 });
  resp.cookies.set('cv_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return resp;
}
