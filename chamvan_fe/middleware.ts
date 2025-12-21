// // middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// const PROTECTED_PREFIXES = ["/admin", "/tai-khoan", "/bao-cao-loi"];

// function isBypassPath(pathname: string) {
//   return (
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/static") ||
//     pathname.startsWith("/favicon") ||
//     pathname.startsWith("/images") ||
//     pathname.startsWith("/fonts") ||
//     pathname.startsWith("/api") // API same-origin xử lý auth riêng
//   );
// }

// export async function middleware(req: NextRequest) {
//   const { pathname, search } = req.nextUrl;

//   if (isBypassPath(pathname)) return NextResponse.next();

//   const needAuth = PROTECTED_PREFIXES.some(
//     (p) => pathname === p || pathname.startsWith(p + "/")
//   );
//   if (!needAuth) return NextResponse.next();

//   const loginURL = new URL("/dang-nhap", req.url);
//   loginURL.searchParams.set("next", pathname + (search || ""));

//   // Lấy token từ cookie (chắc chắn cookie phải có Domain=.chamvan.com)
//   const token = req.cookies.get("cv_token")?.value;
//   if (!token) {
//     // Không có token -> redirect tới login
//     return NextResponse.redirect(loginURL);
//   }

//   // Base API (đảm bảo env var đúng: https://api.chamvan.com hoặc https://chamvan.com/api)
//   const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
//   if (!base) {
//     // Nếu thiếu config, tránh chặn người dùng theo cách khó debug
//     console.error("NEXT_PUBLIC_API_BASE_URL is not set");
//     return NextResponse.redirect(loginURL);
//   }

//   try {
//     // Lưu ý: fetch trong middleware chạy ở Vercel Edge runtime -> dùng global fetch
//     // cache: 'no-store' để luôn kiểm tra auth mới
//     const meRes = await fetch(`${base}/users/me`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Accept": "application/json",
//       },
//       // không dùng credentials ở đây vì ta gửi token bằng header
//       // Evict any cached responses at edge
//       cache: "no-store",
//     });

//     // nếu backend trả 401 -> redirect login
//     if (meRes.status === 401) {
//       return NextResponse.redirect(loginURL);
//     }

//     if (!meRes.ok) {
//       // nếu backend trả 500/502... coi như lỗi backend: redirect (or you can show error page)
//       console.error("[middleware] /users/me non-ok:", meRes.status);
//       return NextResponse.redirect(loginURL);
//     }

//     // parse an toàn
//     const me = await meRes.json().catch((e) => {
//       console.error("[middleware] failed parse me json", e);
//       return null;
//     });

//     const role = String(me?.role || "");
//     // quyền admin
//     if (pathname === "/admin" || pathname.startsWith("/admin/")) {
//       if (role !== "admin" && role !== "support_admin") {
//         return NextResponse.redirect(new URL("/", req.url));
//       }
//     }

//     // hợp lệ
//     return NextResponse.next();
//   } catch (err) {
//     console.error("[middleware] fetch /users/me error:", err);
//     // Lỗi mạng/timeout -> coi như chưa login
//     return NextResponse.redirect(loginURL);
//   }
// }

// export const config = {
//   matcher: [
//     "/admin",
//     "/admin/:path*",
//     "/tai-khoan",
//     "/tai-khoan/:path*",
//     "/bao-cao-loi",
//     "/bao-cao-loi/:path*",
//   ],
// };






// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/admin", "/tai-khoan", "/bao-cao-loi"];

function isBypassPath(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/api")
  );
}

function withSecurityHeaders(res: NextResponse) {
  // Chống clickjacking + sniffing + giảm leak referrer
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  // HSTS (chỉ bật nếu production chạy https ổn định)
  res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  return res;
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (isBypassPath(pathname)) return withSecurityHeaders(NextResponse.next());

  const needAuth = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (!needAuth) return withSecurityHeaders(NextResponse.next());

  const loginURL = new URL("/dang-nhap", req.url);
  loginURL.searchParams.set("next", pathname + (search || ""));

  const token = req.cookies.get("cv_token")?.value;
  if (!token) return withSecurityHeaders(NextResponse.redirect(loginURL));

  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
  if (!base) {
    console.error("NEXT_PUBLIC_API_BASE_URL is not set");
    return withSecurityHeaders(NextResponse.redirect(loginURL));
  }

  try {
    const meRes = await fetch(`${base}/users/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
    });

    if (meRes.status === 401) return withSecurityHeaders(NextResponse.redirect(loginURL));
    if (!meRes.ok) {
      console.error("[middleware] /users/me non-ok:", meRes.status);
      return withSecurityHeaders(NextResponse.redirect(loginURL));
    }

    const me = await meRes.json().catch(() => null);
    const role = String(me?.role || "");

    if (pathname === "/admin" || pathname.startsWith("/admin/")) {
      if (role !== "admin" && role !== "support_admin") {
        return withSecurityHeaders(NextResponse.redirect(new URL("/", req.url)));
      }
    }

    return withSecurityHeaders(NextResponse.next());
  } catch (err) {
    console.error("[middleware] fetch /users/me error:", err);
    return withSecurityHeaders(NextResponse.redirect(loginURL));
  }
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/tai-khoan",
    "/tai-khoan/:path*",
    "/bao-cao-loi",
    "/bao-cao-loi/:path*",
  ],
};
