// src/lib/apiClient.ts
export function getApiBase() {
  const raw =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "";
  return String(raw).replace(/\/+$/, ""); // ví dụ: http://localhost:4000/api
}

export function getApiOrigin() {
  // Bóc /api ở cuối để build URL ảnh /uploads/...
  const base = getApiBase();
  return base.replace(/\/api$/i, "");
}

export function resolveImageUrl(input?: string) {
  const s = typeof input === "string" ? input.trim() : "";
  if (!s) return "/placeholder.jpg";

  // full url / data url
  if (/^(https?:\/\/|data:image\/)/i.test(s)) return s;

  // path nội bộ
  if (s.startsWith("/uploads/") || s.startsWith("/static/") || s.startsWith("/files/")) {
    return `${getApiOrigin()}${s}`;
  }

  // các path khác vẫn cho hiển thị (fallback)
  if (s.startsWith("/")) return s;

  return s;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { timeoutMs?: number }
): Promise<T> {
  const base = getApiBase();
  const url = path.startsWith("http") ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`;

  const timeoutMs =
    init?.timeoutMs ??
    Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS || 15000);

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...init,
      signal: ctrl.signal,
      headers: {
        Accept: "application/json",
        ...(init?.headers || {}),
      },
    });
    if (!res.ok) {
      // cố gắng đọc message JSON
      let msg = `${res.status} ${res.statusText}`;
      try {
        const j = await res.json();
        msg = j?.message?.[0] || j?.message || msg;
      } catch {}
      throw new Error(msg);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(t);
  }
}
