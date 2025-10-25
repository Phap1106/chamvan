// chamvan_fe/src/app/api/admin/products/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '');

export async function GET() {
  const res = await fetch(`${BASE}/products`, { cache: 'no-store' });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: Request) {
  const raw = await req.json();
  const cookieStore = await cookies();
  const token = cookieStore.get('cv_token')?.value;

  const body: any = { ...raw };
if (raw.stock != null) body.stock = Math.max(0, parseInt(String(raw.stock), 10) || 0);
if (raw.sold  != null) body.sold  = Math.max(0, parseInt(String(raw.sold ), 10) || 0);
if (typeof raw.status === 'string') {
  const s = String(raw.status).toLowerCase();
  body.status = s === 'closed' ? 'closed' : 'open';
}
  // 1) price: ép thành string số
  if (raw.price != null) {
    body.price = String(raw.price).trim(); // "1" ✓
  }

  // 2) categories: nhận mọi kiểu -> number[]
  let catIds: number[] = [];
  const pushNum = (v: any) => {
    const n = Number(v);
    if (Number.isFinite(n)) catIds.push(n);
  };

  if (Array.isArray(raw.categories)) {
    raw.categories.forEach(pushNum);
  } else if (typeof raw.categories === 'string') {
    raw.categories.split(',').forEach((s: string) => pushNum(s.trim()));
  } else if (raw.category != null) {
    pushNum(raw.category);
  } else if (typeof raw.categoryIds === 'string') { // fallback khác
    raw.categoryIds.split(',').forEach((s: string) => pushNum(s.trim()));
  }

  body.categories = catIds;

  // 3) images: đảm bảo là string[]
  if (Array.isArray(raw.images)) {
    body.images = raw.images.map(String);
  } else if (Array.isArray(raw.gallery)) {
    body.images = raw.gallery.map((g: any) => String(g));
  }

  const res = await fetch(`${BASE}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

