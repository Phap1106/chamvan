

// chamvan_fe/src/lib/api.ts

/* ================== Config ================== */
export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '');
const TIMEOUT = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS || 15000);

/* ================== Token store ================== */
// Lưu/đọc token 1 nơi (giữ nguyên)
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

/* ================== Utils ================== */
// Tự abort theo TIMEOUT + luôn gửi cookie (credentials: 'include') để hỗ trợ session-based auth
async function _fetch(input: RequestInfo | URL, init?: RequestInit) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const res = await fetch(input, {
      // giữ nguyên các init truyền vào
      ...init,
      // đảm bảo CORS + cookie nếu backend cho phép
      credentials: 'include',
      mode: init?.mode ?? 'cors',
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(id);
  }
}

// Dùng proxy Next nếu path bắt đầu bằng /api/; ngược lại bắn thẳng API_BASE (giữ nguyên)
function resolveUrl(path: string) {
  if (/^\/api\//.test(path)) return path;
  return `${API_BASE}${path.startsWith('/') ? path : '/' + path}`;
}

// Cố gắng parse JSON, nếu fail thì trả undefined
async function safeJson<T>(res: Response): Promise<T | undefined> {
  try {
    return (await res.json()) as T;
  } catch {
    return undefined;
  }
}

// Lấy message lỗi từ JSON hoặc status text
async function extractErrorMessage(res: Response) {
  let msg = `HTTP ${res.status}`;
  const j = await safeJson<any>(res);
  if (j?.message) msg = Array.isArray(j.message) ? j.message.join(', ') : j.message;
  else if (j?.error) msg = j.error;
  else if (res.statusText) msg = res.statusText;
  return msg;
}

/* =============== JSON helpers (giữ API cũ) =============== */
export async function getJSON<T>(path: string, withAuth = false): Promise<T> {
  const headers: Record<string, string> = {};
  if (withAuth) {
    const t = tokenStore.get();
    if (t) headers.Authorization = `Bearer ${t}`;
  }

  const res = await _fetch(resolveUrl(path), { headers });
  if (!res.ok) {
    throw new Error(await extractErrorMessage(res));
  }
  const data = await safeJson<T>(res);
  // Nếu server không trả JSON, tránh throw — trả {} như trước
  return (data ?? ({} as T));
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
    throw new Error(await extractErrorMessage(res));
  }
  const data = await safeJson<T>(res);
  return (data ?? ({} as T));
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
    throw new Error(await extractErrorMessage(res));
  }
  const data = await safeJson<T>(res);
  return (data ?? ({} as T));
}

/* =============== (Tuỳ chọn) bổ sung DELETE helper — không ảnh hưởng code cũ =============== */
export async function deleteJSON<T = any>(path: string, withAuth = false): Promise<T> {
  const headers: Record<string, string> = {};
  if (withAuth) {
    const t = tokenStore.get();
    if (t) headers.Authorization = `Bearer ${t}`;
  }

  const res = await _fetch(resolveUrl(path), { method: 'DELETE', headers });
  if (!res.ok) {
    throw new Error(await extractErrorMessage(res));
  }
  const data = await safeJson<T>(res);
  return (data ?? ({} as T));
}

/* =============== Auth API wrappers (giữ nguyên) =============== */
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

/* =============== (Tuỳ chọn) wrappers phục vụ màn Orders (không bắt buộc dùng) =============== */
// Không bắt buộc, chỉ thêm để code FE gọn hơn. Không đụng tới hàm cũ.
export type OrderItemLite = {
  productId: number | string;
  qty: number;
  unitPrice?: number;
  lineTotal?: number;
  name?: string;
};
export type OrderLite = {
  id: number | string;
  code?: string;
  items: OrderItemLite[];
  subtotal: number;
  shippingFee?: number;
  total: number;
  status?: string;
  createdAt?: string;
  eta?: string | null;
  userId?: number | null;
};

// Lấy đơn của chính user (yêu cầu đã đăng nhập)
export function apiMyOrders() {
  return getJSON<OrderLite[]>('/orders/my', true);
}

// Lấy chi tiết một đơn (nếu cần cho trang chi tiết)
export function apiOrderDetail(id: string | number) {
  return getJSON<OrderLite>(`/orders/${id}`, true);
}
