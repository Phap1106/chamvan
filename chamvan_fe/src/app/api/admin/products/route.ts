import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000/api"
).replace(/\/+$/, "");

async function forward(req: NextRequest, url: string) {
  const cookie = req.headers.get("cookie") || "";
  const rawBody = await req.text(); // ✅ đọc raw 1 lần, không JSON.parse

  const res = await fetch(url, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Cookie: cookie,
    },
    body: req.method === "GET" || req.method === "HEAD" ? undefined : rawBody,
    cache: "no-store",
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") || "application/json" },
  });
}

export async function GET(req: NextRequest) {
  return forward(req, `${API_BASE}/products`);
}

export async function POST(req: NextRequest) {
  return forward(req, `${API_BASE}/products`);
}
