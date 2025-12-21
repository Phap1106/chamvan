// import { NextRequest, NextResponse } from "next/server";

// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

// const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ||
//   process.env.NEXT_PUBLIC_API_URL ||
//   "http://localhost:4000/api"
// ).replace(/\/+$/, "");

// async function forward(req: NextRequest, url: string) {
//   const cookie = req.headers.get("cookie") || "";
//   const rawBody = await req.text();

//   const res = await fetch(url, {
//     method: req.method,
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//       Cookie: cookie,
//     },
//     body: req.method === "GET" || req.method === "HEAD" ? undefined : rawBody,
//     cache: "no-store",
//   });

//   const text = await res.text();
//   return new NextResponse(text, {
//     status: res.status,
//     headers: { "Content-Type": res.headers.get("content-type") || "application/json" },
//   });
// }

// export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
//   return forward(req, `${API_BASE}/products/${ctx.params.id}`);
// }

// export async function DELETE(req: NextRequest, ctx: { params: { id: string } }) {
//   return forward(req, `${API_BASE}/products/${ctx.params.id}`);
// }

// src/app/api/admin/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE = (() => {
  const raw =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4000/api";
  return String(raw).replace(/\/+$/, "");
})();

function pickHeadersFromUpstream(res: Response) {
  // Không forward các header hop-by-hop
  const h = new Headers();
  const contentType = res.headers.get("content-type");
  if (contentType) h.set("content-type", contentType);

  // Nếu bạn cần thêm header khác từ BE, add ở đây (vd: cache-control)
  const cacheControl = res.headers.get("cache-control");
  if (cacheControl) h.set("cache-control", cacheControl);

  return h;
}

async function forward(req: NextRequest, url: string) {
  const method = req.method;

  // Copy headers hợp lý, bỏ host để tránh lệch
  const headers = new Headers(req.headers);
  headers.delete("host");

  // Với DELETE/GET thường không cần body
  const hasBody = method !== "GET" && method !== "HEAD";

  const upstream = await fetch(url, {
    method,
    headers,
    body: hasBody ? await req.text().catch(() => "") : undefined,
    // giữ cookie auth từ browser -> route -> BE
    credentials: "include",
    cache: "no-store",
  });

  // 204/205: tuyệt đối không trả body
  if (upstream.status === 204 || upstream.status === 205) {
    return new NextResponse(null, {
      status: upstream.status,
      headers: pickHeadersFromUpstream(upstream),
    });
  }

  // Nếu có body thì forward theo content-type
  const ct = upstream.headers.get("content-type") || "";

  if (ct.includes("application/json")) {
    const data = await upstream.json().catch(() => null);
    return NextResponse.json(data, {
      status: upstream.status,
      headers: pickHeadersFromUpstream(upstream),
    });
  }

  const text = await upstream.text().catch(() => "");
  return new NextResponse(text, {
    status: upstream.status,
    headers: pickHeadersFromUpstream(upstream),
  });
}

// ✅ Next 15+: params là Promise => phải await
export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  return forward(req, `${API_BASE}/products/${id}`);
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  return forward(req, `${API_BASE}/products/${id}`);
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  return forward(req, `${API_BASE}/products/${id}`);
}
