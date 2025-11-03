'use client';
import React, { useEffect, useMemo, useState } from 'react';

type ZaloConfig = {
  id: number;
  oa_access_token?: string;
  oa_refresh_token?: string;
  oa_expires_at?: string;
};

type ZaloAdmin = {
  id: number;
  zalo_user_id: string;
  display_name?: string;
  is_active: boolean;
};

type ZaloTemplate = {
  id: number;
  key: string;
  content: string;
};

const API = (path: string) => `/api/admin/zalo${path}`;

export default function ZaloAdminPage() {
  // ---- state ----
  const [loading, setLoading] = useState(false);
  const [cfg, setCfg] = useState<ZaloConfig | null>(null);
  const [admins, setAdmins] = useState<ZaloAdmin[]>([]);
  const [tpl, setTpl] = useState<ZaloTemplate | null>(null);

  // form states
  const [oaAccess, setOaAccess] = useState('');
  const [oaRefresh, setOaRefresh] = useState('');
  const [oaExpire, setOaExpire] = useState('');

  const [newZaloId, setNewZaloId] = useState('');
  const [newName, setNewName] = useState('');

  const [manualId, setManualId] = useState('');
  const [manualText, setManualText] = useState('');

  const [tplContent, setTplContent] = useState('');

  // ---- load init ----
  const loadAll = async () => {
    setLoading(true);
    try {
      const [tokenRes, adminsRes, tplRes] = await Promise.all([
        fetch(API('/token')), fetch(API('/recipients')), fetch(API(`/templates?key=ORDER_SUCCESS`))
      ]);
      const token = await tokenRes.json();
      const a = await adminsRes.json();
      const t = await tplRes.json();

      setCfg(token);
      setAdmins(a);
      setTpl(t);

      setOaAccess(token?.oa_access_token ?? '');
      setOaRefresh(token?.oa_refresh_token ?? '');
      setOaExpire(token?.oa_expires_at ?? '');
      setTplContent(t?.content ?? '');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  // ---- actions ----
  const saveToken = async () => {
    setLoading(true);
    try {
      await fetch(API('/token'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oa_access_token: oaAccess || null,
          oa_refresh_token: oaRefresh || null,
          oa_expires_at: oaExpire || null,
        }),
      });
      await loadAll();
      alert('Đã lưu token OA ✅');
    } finally { setLoading(false); }
  };

  const addRecipient = async () => {
    if (!newZaloId.trim()) return alert('Nhập zalo_user_id');
    setLoading(true);
    try {
      await fetch(API('/recipients'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zalo_user_id: newZaloId.trim(), display_name: newName || undefined }),
      });
      setNewZaloId(''); setNewName('');
      await loadAll();
    } finally { setLoading(false); }
  };

  const toggleRecipient = async (row: ZaloAdmin) => {
    setLoading(true);
    try {
      await fetch(API('/recipients'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zalo_user_id: row.zalo_user_id, is_active: !row.is_active }),
      });
      await loadAll();
    } finally { setLoading(false); }
  };

  const removeRecipient = async (id: number) => {
    if (!confirm('Xoá người nhận này?')) return;
    setLoading(true);
    try {
      await fetch(API(`/recipients/${id}`), { method: 'DELETE' });
      await loadAll();
    } finally { setLoading(false); }
  };

  const saveTpl = async () => {
    setLoading(true);
    try {
      await fetch(API('/templates'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'ORDER_SUCCESS', content: tplContent }),
      });
      await loadAll();
      alert('Đã lưu mẫu tin nhắn ✅');
    } finally { setLoading(false); }
  };

  const sendManual = async () => {
    if (!manualId.trim() || !manualText.trim()) return alert('Nhập đầy đủ zalo_user_id và nội dung');
    setLoading(true);
    try {
      await fetch(API('/send'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zalo_user_id: manualId.trim(), text: manualText }),
      });
      alert('Đã gửi tin nhắn ✅');
    } finally { setLoading(false); }
  };

  const pingUser = async (id: string) => {
    setLoading(true);
    try {
      await fetch(API('/ping'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zalo_user_id: id }),
      });
      alert('Ping ok ✅');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl p-6 mx-auto">
      <h1 className="mb-6 text-2xl font-semibold">Quản lý Zalo OA</h1>

      {/* Token */}
      <section className="p-5 mb-6 border rounded-2xl">
        <h2 className="mb-4 text-lg font-medium">1) Setup Token OA</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="col-span-1">
            <label className="text-sm text-zinc-500">OA Access Token</label>
            <input value={oaAccess} onChange={e=>setOaAccess(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md" placeholder="paste token..." />
          </div>
          <div className="col-span-1">
            <label className="text-sm text-zinc-500">Refresh Token (tuỳ OA)</label>
            <input value={oaRefresh} onChange={e=>setOaRefresh(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md" placeholder="optional" />
          </div>
          <div className="col-span-1">
            <label className="text-sm text-zinc-500">Expires At (epoch ms)</label>
            <input value={oaExpire} onChange={e=>setOaExpire(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md" placeholder="optional" />
          </div>
        </div>
        <div className="mt-4">
          <button onClick={saveToken} disabled={loading}
            className="px-4 py-2 border rounded-lg hover:bg-zinc-50">Lưu token</button>
        </div>
      </section>

      {/* Recipients */}
      <section className="p-5 mb-6 border rounded-2xl">
        <h2 className="mb-4 text-lg font-medium">2) Người nhận thông báo (zalo_user_id)</h2>
        <div className="flex flex-col gap-3 md:flex-row">
          <input value={newZaloId} onChange={e=>setNewZaloId(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="Nhập zalo_user_id..." />
          <input value={newName} onChange={e=>setNewName(e.target.value)} className="w-full px-3 py-2 border rounded-md md:w-56" placeholder="Tên hiển thị (tuỳ chọn)" />
          <button onClick={addRecipient} disabled={loading} className="px-4 py-2 border rounded-lg hover:bg-zinc-50">Thêm</button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-500">
                <th className="py-2">ID</th>
                <th className="py-2">zalo_user_id</th>
                <th className="py-2">Tên</th>
                <th className="py-2">Trạng thái</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {admins.map(a=>(
                <tr key={a.id} className="border-t">
                  <td className="py-2">{a.id}</td>
                  <td className="py-2">{a.zalo_user_id}</td>
                  <td className="py-2">{a.display_name || '-'}</td>
                  <td className="py-2">
                    <span className={`rounded px-2 py-1 text-xs ${a.is_active ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-700'}`}>
                      {a.is_active ? 'Đang nhận' : 'Tắt'}
                    </span>
                  </td>
                  <td className="py-2 space-x-2">
                    <button onClick={()=>toggleRecipient(a)} className="px-3 py-1 border rounded hover:bg-zinc-50">{a.is_active ? 'Tắt' : 'Bật'}</button>
                    <button onClick={()=>pingUser(a.zalo_user_id)} className="px-3 py-1 border rounded hover:bg-zinc-50">Ping</button>
                    <button onClick={()=>removeRecipient(a.id)} className="px-3 py-1 border rounded hover:bg-zinc-50">Xoá</button>
                  </td>
                </tr>
              ))}
              {!admins.length && <tr><td className="py-4 text-zinc-500" colSpan={5}>Chưa có người nhận</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {/* Template */}
      <section className="p-5 mb-6 border rounded-2xl">
        <h2 className="mb-4 text-lg font-medium">3) Mẫu tin nhắn (ORDER_SUCCESS)</h2>
        <p className="mb-2 text-sm text-zinc-500">Biến có sẵn: {'{{code}} {{customer}} {{total}} {{items}} {{time}} {{link}}'}</p>
        <textarea value={tplContent} onChange={e=>setTplContent(e.target.value)} rows={7}
          className="w-full px-3 py-2 font-mono border rounded-md" />
        <div className="mt-3">
          <button onClick={saveTpl} disabled={loading} className="px-4 py-2 border rounded-lg hover:bg-zinc-50">Lưu mẫu</button>
        </div>
      </section>

      {/* Manual send */}
      <section className="p-5 border rounded-2xl">
        <h2 className="mb-4 text-lg font-medium">4) Gửi thủ công</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <input value={manualId} onChange={e=>setManualId(e.target.value)} className="px-3 py-2 border rounded-md" placeholder="zalo_user_id..." />
          <input value={manualText} onChange={e=>setManualText(e.target.value)} className="px-3 py-2 border rounded-md md:col-span-2" placeholder="Nội dung tin nhắn..." />
        </div>
        <div className="mt-3">
          <button onClick={sendManual} disabled={loading} className="px-4 py-2 border rounded-lg hover:bg-zinc-50">Gửi</button>
        </div>
      </section>
    </div>
  );
}
