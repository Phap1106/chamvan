// src/app/api/products/upload/route.ts
import { NextResponse } from "next/server";

const API_BASE = (() => {
  const raw =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4000/api";
  return String(raw).replace(/\/+$/, "");
})();

export async function POST(req: Request) {
  try {
    // forward multipart/form-data nguyên si
    const formData = await req.formData();

    const upstream = await fetch(`${API_BASE}/products/upload`, {
      method: "POST",
      body: formData,
      // không set Content-Type, fetch tự set boundary cho multipart
    });

    const contentType = upstream.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await upstream.json()
      : await upstream.text();

    return NextResponse.json(data, { status: upstream.status });
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
