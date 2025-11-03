'use client';
import React, { useEffect, useState } from 'react';

type TGConfig = { id: number; bot_token?: string };
type TGRecipient = { id: number; chat_id: string; display_name?: string; is_active: boolean };
type TGTemplate = { id: number; key: string; content: string };

const API = (p: string) => `/admin/telegram${p}`;

export default function TelegramAdminPage() {
  const [loading, setLoading] = useState(false);
  const [cfg, setCfg] = useState<TGConfig | null>(null);
  const [recs, setRecs] = useState<TGRecipient[]>([]);
  const [tpl, setTpl] = useState<TGTemplate | null>(null);

  // forms
  const [token, setToken] = useState('');
  const [newChatId, setNewChatId] = useState('');
  const [newName, setNewName] = useState('');
  const [tplContent, setTplContent] = useState('');
  const [manualChatId, setManualChatId] = useState('');
  const [manualText, setManualText] = useState('');
  const [updates, setUpdates] = useState<any>(null);
  const [offset, setOffset] = useState<number | undefined>(undefined);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [tkn, r, t] = await Promise.all([
        fetch(API('/token')).then(r => r.json()),
        fetch(API('/recipients')).then(r => r.json()),
        fetch(API('/templates?key=ORDER_SUCCESS')).then(r => r.json()),
      ]);
      setCfg(tkn); setRecs(r); setTpl(t); setToken(tkn?.bot_token ?? ''); setTplContent(t?.content ?? '');
    } finally { setLoading(false); }
  };
  useEffect(()=>{ loadAll(); }, []);

  const saveToken = async () => {
    setLoading(true);
    try {
      await fetch(API('/token'), { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ bot_token: token || null }) });
      await loadAll(); alert('Đã lưu token ✅');
    } finally { setLoading(false); }
  };

  const addRec = async () => {
    if (!newChatId.trim()) return alert('Nhập chat_id');
    setLoading(true);
    try {
      await fetch(API('/recipients'), { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ chat_id: newChatId.trim(), display_name: newName || undefined }) });
      setNewChatId(''); setNewName(''); await loadAll();
    } finally { setLoading(false); }
  };

  const toggleRec = async (row: TGRecipient) => {
    setLoading(true);
    try {
      await fetch(API('/recipients'), { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ chat_id: row.chat_id, is_active: !row.is_active }) });
      await loadAll();
    } finally { setLoading(false); }
  };

  const removeRec = async (id: number) => {
    if (!confirm('Xoá người nhận này?')) return;
    setLoading(true);
    try { await fetch(API(`/recipients/${id}`), { method:'DELETE' }); await loadAll(); } finally { setLoading(false); }
  };

  const saveTpl = async () => {
    setLoading(true);
    try {
      await fetch(API('/templates'), { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ key:'ORDER_SUCCESS', content: tplContent }) });
      await loadAll(); alert('Đã lưu mẫu ✅');
    } finally { setLoading(false); }
  };

  const sendManual = async () => {
    if (!manualChatId.trim() || !manualText.trim()) return alert('Nhập chat_id và nội dung');
    setLoading(true);
    try {
      await fetch(API('/send'), { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ chat_id: manualChatId.trim(), text: manualText }) });
      alert('Đã gửi ✅');
    } finally { setLoading(false); }
  };

  const ping = async (id: string) => {
    setLoading(true);
    try { await fetch(API('/ping'), { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ chat_id: id }) }); alert('Ping ok ✅'); }
    finally { setLoading(false); }
  };

  const fetchUpdates = async () => {
    setLoading(true);
    try {
      const res = await fetch(API(`/updates${offset ? `?offset=${offset}` : ''}`)).then(r=>r.json());
      setUpdates(res);
      // gợi ý offset mới
      const upd = Array.isArray(res?.result) ? res.result : [];
      const maxId = upd.reduce((m:any,u:any)=> Math.max(m, u.update_id || 0), 0);
      if (maxId) setOffset(maxId + 1);
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl p-6 mx-auto">
      <h1 className="mb-6 text-2xl font-semibold">Quản lý Telegram Bot</h1>

      <section className="p-5 mb-6 border rounded-2xl">
        <h2 className="mb-4 text-lg font-medium">1) Token Bot</h2>
        <input className="w-full px-3 py-2 border rounded-md" value={token} onChange={e=>setToken(e.target.value)} placeholder="BotFather token..." />
        <div className="mt-3"><button className="px-4 py-2 border rounded-lg hover:bg-zinc-50" onClick={saveToken} disabled={loading}>Lưu token</button></div>
      </section>

      <section className="p-5 mb-6 border rounded-2xl">
        <h2 className="mb-4 text-lg font-medium">2) Người nhận (chat_id)</h2>
        <div className="flex flex-col gap-3 md:flex-row">
          <input className="px-3 py-2 border rounded-md" placeholder="chat_id..." value={newChatId} onChange={e=>setNewChatId(e.target.value)} />
          <input className="px-3 py-2 border rounded-md md:w-64" placeholder="Tên (tuỳ chọn)" value={newName} onChange={e=>setNewName(e.target.value)} />
          <button className="px-4 py-2 border rounded-lg hover:bg-zinc-50" onClick={addRec} disabled={loading}>Thêm</button>
          <button className="px-4 py-2 border rounded-lg hover:bg-zinc-50" onClick={fetchUpdates} disabled={loading}>Lấy updates (tìm chat_id)</button>
        </div>

        {updates && (
          <pre className="p-3 mt-3 overflow-auto text-xs rounded max-h-64 bg-zinc-50">
            {JSON.stringify(updates, null, 2)}
          </pre>
        )}

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-zinc-500"><th className="py-2">ID</th><th className="py-2">chat_id</th><th className="py-2">Tên</th><th className="py-2">Trạng thái</th><th></th></tr></thead>
            <tbody>
              {recs.map(r=>(
                <tr key={r.id} className="border-t">
                  <td className="py-2">{r.id}</td>
                  <td className="py-2">{r.chat_id}</td>
                  <td className="py-2">{r.display_name || '-'}</td>
                  <td className="py-2">
                    <span className={`rounded px-2 py-1 text-xs ${r.is_active ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-700'}`}>
                      {r.is_active ? 'Đang nhận' : 'Tắt'}
                    </span>
                  </td>
                  <td className="py-2 space-x-2">
                    <button onClick={()=>toggleRec(r)} className="px-3 py-1 border rounded hover:bg-zinc-50">{r.is_active ? 'Tắt' : 'Bật'}</button>
                    <button onClick={()=>ping(r.chat_id)} className="px-3 py-1 border rounded hover:bg-zinc-50">Ping</button>
                    <button onClick={()=>removeRec(r.id)} className="px-3 py-1 border rounded hover:bg-zinc-50">Xoá</button>
                  </td>
                </tr>
              ))}
              {!recs.length && <tr><td className="py-4 text-zinc-500" colSpan={5}>Chưa có người nhận</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="p-5 mb-6 border rounded-2xl">
        <h2 className="mb-2 text-lg font-medium">3) Template ORDER_SUCCESS</h2>
        <p className="mb-2 text-sm text-zinc-500">Biến: {'{{code}} {{customer}} {{total}} {{items}} {{time}} {{link}}'}</p>
        <textarea className="w-full px-3 py-2 font-mono border rounded-md" rows={7} value={tplContent} onChange={e=>setTplContent(e.target.value)} />
        <div className="mt-3"><button className="px-4 py-2 border rounded-lg hover:bg-zinc-50" onClick={saveTpl} disabled={loading}>Lưu mẫu</button></div>
      </section>

      <section className="p-5 border rounded-2xl">
        <h2 className="mb-2 text-lg font-medium">4) Gửi thủ công</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <input className="px-3 py-2 border rounded-md" placeholder="chat_id..." value={manualChatId} onChange={e=>setManualChatId(e.target.value)} />
          <input className="px-3 py-2 border rounded-md md:col-span-2" placeholder="Nội dung..." value={manualText} onChange={e=>setManualText(e.target.value)} />
        </div>
        <div className="mt-3"><button className="px-4 py-2 border rounded-lg hover:bg-zinc-50" onClick={sendManual} disabled={loading}>Gửi</button></div>
      </section>
    </div>
  );
}
