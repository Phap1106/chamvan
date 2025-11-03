const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''; // ví dụ: http://localhost:3001/api

export type MeResponse = {
  data: {
    id: string;
    fullName?: string;
    email: string;
    phone?: string;
    dob?: string; // YYYY-MM-DD
  };
};

export type UpdateProfileBody = {
  fullName?: string;
  phone?: string;
  dob?: string; // YYYY-MM-DD
};

const userApi = {
  async getMe(): Promise<MeResponse['data']> {
    const res = await fetch(`${API_BASE}/users/me`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Không lấy được thông tin tài khoản');
    const json = await res.json();
    return json.data;
  },

  async updateMe(body: UpdateProfileBody) {
    const res = await fetch(`${API_BASE}/users/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || 'Cập nhật thất bại');
    }
    return res.json();
  },
};

export default userApi;
