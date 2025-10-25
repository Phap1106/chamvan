import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Chỉ canh chừng /admin
  if (!pathname.startsWith('/admin')) return NextResponse.next();

  const token = req.cookies.get('cv_token')?.value;
  if (!token) {
    const url = new URL('/dang-nhap', req.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // Xác thực role với BE
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!.replace(/\/+$/, '');

  try {
    const meRes = await fetch(`${base}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!meRes.ok) {
      const url = new URL('/dang-nhap', req.url);
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }

    const me = await meRes.json();
    const role = me?.role as 'admin' | 'support_admin' | 'user' | undefined;

    if (role === 'admin' || role === 'support_admin') {
      return NextResponse.next(); // ok vào /admin
    }

    // Không đủ quyền → về trang chủ
    return NextResponse.redirect(new URL('/', req.url));
  } catch {
    const url = new URL('/dang-nhap', req.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
