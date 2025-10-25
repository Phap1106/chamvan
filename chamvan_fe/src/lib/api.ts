// chamvan_fe/src/lib/api.ts
export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '');
const TIMEOUT = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS || 15000);

// Lưu/đọc token 1 nơi
export const tokenStore = {
  get() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('cv_access_token');
  },
  set(t: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cv_access_token', t);
  },
  clear() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('cv_access_token');
  },
};

// Tự abort theo TIMEOUT
async function _fetch(input: RequestInfo | URL, init?: RequestInit) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const res = await fetch(input, { ...init, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

// Dùng proxy Next nếu path bắt đầu bằng /api/; ngược lại bắn thẳng API_BASE
function resolveUrl(path: string) {
  if (/^\/api\//.test(path)) return path;
  return `${API_BASE}${path.startsWith('/') ? path : '/' + path}`;
}

/* ---------------- JSON helpers ---------------- */
export async function getJSON<T>(path: string, withAuth = false): Promise<T> {
  const headers: Record<string, string> = {};
  if (withAuth) {
    const t = tokenStore.get();
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  const res = await _fetch(resolveUrl(path), { headers });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      msg = j?.message || j?.error || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function postJSON<T = any>(path: string, body: any, withAuth = false): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (withAuth) {
    const t = tokenStore.get();
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  const res = await _fetch(resolveUrl(path), {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      msg = j?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json().catch(() => ({} as T));
}

export async function patchJSON<T = any>(path: string, body: any, withAuth = false): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (withAuth) {
    const t = tokenStore.get();
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  const res = await _fetch(resolveUrl(path), {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      msg = j?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json().catch(() => ({} as T));
}

/* ===== Auth API wrappers ===== */
export type LoginResp = {
  accessToken: string;
  user: { id: string; email: string; fullName: string; role: 'admin' | 'support_admin' | 'user' };
};

export function apiLogin(email: string, password: string) {
  return postJSON<LoginResp>('/auth/login', { email, password });
}

export function apiRegister(data: {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  dob?: string; // YYYY-MM-DD
}) {
  return postJSON<{ id: string }>('/users/register', data);
}

export function apiMe() {
  return getJSON<LoginResp['user']>('/users/me', true);
}
