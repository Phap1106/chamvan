// //src/middleware.ts
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // Chỉ canh chừng /admin
//   if (!pathname.startsWith('/admin')) return NextResponse.next();

//   const token = req.cookies.get('cv_token')?.value;
//   if (!token) {
//     const url = new URL('/dang-nhap', req.url);
//     url.searchParams.set('next', pathname);
//     return NextResponse.redirect(url);
//   }

//   // Xác thực role với BE
//   const base = process.env.NEXT_PUBLIC_API_BASE_URL!.replace(/\/+$/, '');

//   try {
//     const meRes = await fetch(`${base}/users/me`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     if (!meRes.ok) {
//       const url = new URL('/dang-nhap', req.url);
//       url.searchParams.set('next', pathname);
//       return NextResponse.redirect(url);
//     }

//     const me = await meRes.json();
//     const role = me?.role as 'admin' | 'support_admin' | 'user' | undefined;

//     if (role === 'admin' || role === 'support_admin') {
//       return NextResponse.next(); // ok vào /admin
//     }

//     // Không đủ quyền → về trang chủ
//     return NextResponse.redirect(new URL('/', req.url));
//   } catch {
//     const url = new URL('/dang-nhap', req.url);
//     url.searchParams.set('next', pathname);
//     return NextResponse.redirect(url);
//   }
// }

// export const config = {
//   matcher: ['/admin/:path*'],
// };







// middleware.ts (đặt ở root project; nếu bạn để trong /src thì Next vẫn hỗ trợ,
// nhưng nhớ restart dev server sau khi sửa để matcher mới có hiệu lực)

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Các tiền tố cần đăng nhập
const PROTECTED_PREFIXES = ['/admin', '/tai-khoan', '/bao-cao-loi'];

// Bỏ qua các tài nguyên tĩnh / API
function isBypassPath(pathname: string) {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/api') // API tự xử lý auth riêng
  );
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (isBypassPath(pathname)) return NextResponse.next();

  const needAuth = PROTECTED_PREFIXES.some((p) =>
    pathname === p || pathname.startsWith(p + '/')
  );
  if (!needAuth) return NextResponse.next();

  // Lấy token từ cookie
  const token = req.cookies.get('cv_token')?.value;

  const loginURL = new URL('/dang-nhap', req.url);
  loginURL.searchParams.set('next', pathname + (search || ''));

  // Chưa đăng nhập -> ép đi login
  if (!token) return NextResponse.redirect(loginURL);

  // Có token -> xác thực với BE
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '');

  try {
    const meRes = await fetch(`${base}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!meRes.ok) {
      return NextResponse.redirect(loginURL);
    }

    const me = await meRes.json();
    const role = String(me?.role || '');

    // /admin cần quyền admin | support_admin
    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
      if (role !== 'admin' && role !== 'support_admin') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    // Hợp lệ
    return NextResponse.next();
  } catch {
    // Lỗi BE/mạng -> coi như chưa đăng nhập
    return NextResponse.redirect(loginURL);
  }
}

// Khai báo matcher RÕ RÀNG: gốc + nhánh con
export const config = {
  matcher: [
    // admin
    '/admin',
    '/admin/:path*',
    // tài khoản
    '/tai-khoan',
    '/tai-khoan/:path*',
    // báo cáo lỗi
    '/bao-cao-loi',
    '/bao-cao-loi/:path*',
  ],
};
