import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '');

type ParamsCtx = { params: Promise<{ id: string }> };

const authHeaders = (token?: string) =>
  (token ? { Authorization: `Bearer ${token}` } : {}) as Record<string, string>;

export async function GET(_req: Request, ctx: ParamsCtx) {
  const { id } = await ctx.params;

  const res = await fetch(`${BASE}/products/${id}`, { cache: 'no-store' });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function PATCH(req: Request, ctx: ParamsCtx) {
  const { id } = await ctx.params;
  const cookieStore = await cookies();
  const token = cookieStore.get('cv_token')?.value;

  // Chuẩn hoá body gửi BE
  const raw = await req.json();
  const body: any = { ...raw };

  if (raw.price != null) body.price = String(raw.price).trim();
if (raw.stock != null) body.stock = Math.max(0, parseInt(String(raw.stock), 10) || 0);
if (raw.sold  != null) body.sold  = Math.max(0, parseInt(String(raw.sold ), 10) || 0);
if (typeof raw.status === 'string') {
  const s = String(raw.status).toLowerCase();
  body.status = s === 'closed' ? 'closed' : 'open';
}
  if (Array.isArray(raw.categories)) {
    body.categories = raw.categories.map((x: any) => Number(x)).filter(Number.isFinite);
  } else if (typeof raw.categories === 'string') {
    body.categories = raw.categories
      .split(',')
      .map((s: string) => Number(s.trim()))
      .filter(Number.isFinite);
  }

  if (Array.isArray(raw.images)) body.images = raw.images.map(String);

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...authHeaders(token),
  };

  const res = await fetch(`${BASE}/products/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(_req: Request, ctx: ParamsCtx) {
  const { id } = await ctx.params;
  const cookieStore = await cookies();
  const token = cookieStore.get('cv_token')?.value;

  const headers: HeadersInit = { ...authHeaders(token) };

  const res = await fetch(`${BASE}/products/${id}`, {
    method: 'DELETE',
    headers,
  });

  if (res.status === 204) return new NextResponse(null, { status: 204 });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
