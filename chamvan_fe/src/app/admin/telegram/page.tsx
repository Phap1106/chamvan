// chamvan_fe/src/app/admin/telegram/page.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

/* ================= Types (giữ nguyên) ================= */
type TGConfig = { id: number; bot_token?: string };
type TGRecipient = { id: number; chat_id: string; display_name?: string; is_active: boolean };
type TGTemplate = { id: number; key: string; content: string };

/* ================= API helper ================= */
const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || '')
    .replace(/\/+$/, '') || 'http://localhost:4000/api';

const API = (p: string) => `${API_BASE}/admin/telegram${p}`;

async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* ignore */ }
  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }
  return data as T;
}

/* ================= UI helpers ================= */
function Badge({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral'|'success'|'danger' }) {
  const cls =
    tone === 'success'
      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
      : tone === 'danger'
      ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
      : 'bg-zinc-50 text-zinc-700 ring-1 ring-zinc-200';
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${cls}`}>{children}</span>;
}

function Card({ title, desc, children, right }: { title: string; desc?: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-medium text-zinc-900">{title}</h2>
          {desc ? <p className="mt-0.5 text-sm text-zinc-500">{desc}</p> : null}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

function ActionButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' },
) {
  const { className = '', variant = 'ghost', ...rest } = props;
  const base =
    'inline-flex items-center justify-center rounded-lg px-3 h-9 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed';
  const styles =
    variant === 'primary'
      ? 'bg-black text-white hover:bg-neutral-900'
      : variant === 'danger'
      ? 'border border-rose-200 text-rose-700 hover:bg-rose-50'
      : 'border border-zinc-200 hover:bg-zinc-50';
  return <button className={`${base} ${styles} ${className}`} {...rest} />;
}

/* ================= Page ================= */
export default function TelegramAdminPage() {
  const [loading, setLoading] = useState(false);

  // data
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

  const hasToken = useMemo(() => !!(cfg?.bot_token || token), [cfg, token]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [tkn, r, t] = await Promise.all([
        fetchJson<TGConfig>(API('/token')),
        fetchJson<TGRecipient[]>(API('/recipients')),
        fetchJson<TGTemplate>(API('/templates?key=ORDER_SUCCESS')),
      ]);
      setCfg(tkn);
      setRecs(r);
      setTpl(t);
      setToken(tkn?.bot_token ?? '');
      setTplContent(t?.content ?? '');
    } catch (e: any) {
      toast.error(`Không tải được dữ liệu: ${e?.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  /* ============ actions ============ */
  const saveToken = async () => {
    setLoading(true);
    try {
      await fetchJson(API('/token'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bot_token: token || undefined }),
      });
      toast.success('Đã lưu Bot Token');
      await loadAll();
    } catch (e: any) {
      toast.error(`Lưu token thất bại: ${e?.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  const addRec = async () => {
    if (!newChatId.trim()) return toast.error('Nhập chat_id');
    setLoading(true);
    try {
      await fetchJson(API('/recipients'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: newChatId.trim(), display_name: newName || undefined }),
      });
      setNewChatId(''); setNewName('');
      toast.success('Đã thêm người nhận');
      await loadAll();
    } catch (e: any) {
      toast.error(`Thêm thất bại: ${e?.message || e}`);
    } finally { setLoading(false); }
  };

  const toggleRec = async (row: TGRecipient) => {
    setLoading(true);
    try {
      await fetchJson(API('/recipients'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: row.chat_id, is_active: !row.is_active }),
      });
      toast.success(`${!row.is_active ? 'Đã bật' : 'Đã tắt'} nhận thông báo`);
      await loadAll();
    } catch (e: any) {
      toast.error(`Cập nhật thất bại: ${e?.message || e}`);
    } finally { setLoading(false); }
  };

  const removeRec = async (id: number) => {
    if (!confirm('Xoá người nhận này?')) return;
    setLoading(true);
    try {
      await fetchJson(API(`/recipients/${id}`), { method: 'DELETE' });
      toast.success('Đã xoá người nhận');
      await loadAll();
    } catch (e: any) {
      toast.error(`Xoá thất bại: ${e?.message || e}`);
    } finally { setLoading(false); }
  };

  const saveTpl = async () => {
    setLoading(true);
    try {
      await fetchJson(API('/templates'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'ORDER_SUCCESS', content: tplContent }),
      });
      toast.success('Đã lưu Template');
      await loadAll();
    } catch (e: any) {
      toast.error(`Lưu template thất bại: ${e?.message || e}`);
    } finally { setLoading(false); }
  };

  const sendManual = async () => {
    if (!manualChatId.trim() || !manualText.trim()) return toast.error('Nhập chat_id và nội dung');
    setLoading(true);
    try {
      await fetchJson(API('/send'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: manualChatId.trim(), text: manualText }),
      });
      toast.success('Đã gửi tin nhắn');
      setManualText('');
    } catch (e: any) {
      toast.error(`Gửi thất bại: ${e?.message || e}`);
    } finally { setLoading(false); }
  };

  const ping = async (id: string) => {
    setLoading(true);
    try {
      await fetchJson(API('/ping'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: id }),
      });
      toast.success('Ping OK');
    } catch (e: any) {
      toast.error(`Ping thất bại: ${e?.message || e}`);
    } finally { setLoading(false); }
  };

  const fetchUpdates = async () => {
    setLoading(true);
    try {
      const res = await fetchJson<any>(API(`/updates${offset ? `?offset=${offset}` : ''}`));
      setUpdates(res);
      const upd = Array.isArray(res?.result) ? res.result : [];
      const maxId = upd.reduce((m: number, u: any) => Math.max(m, u.update_id || 0), 0);
      if (maxId) setOffset(maxId + 1);
      toast.success('Đã lấy updates');
    } catch (e: any) {
      toast.error(`Lỗi lấy updates: ${e?.message || e}`);
    } finally { setLoading(false); }
  };

  /* ============ UI ============ */
  return (
    <div className="mx-auto max-w-6xl px-5 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Quản lý Telegram Bot</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Thiết lập bot, danh sách người nhận và mẫu thông báo. Mọi thao tác đều có xác nhận nhanh.
        </p>
      </header>

      <div className="grid gap-6">
        {/* Token */}
        <Card
          title="1) Bot Token"
          desc="Nhập token lấy từ @BotFather. Nên giữ bí mật."
          right={hasToken ? <Badge tone="success">Đã cấu hình</Badge> : <Badge>Chưa cấu hình</Badge>}
        >
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
              placeholder="BotFather token…"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <ActionButton variant="primary" onClick={saveToken} disabled={loading}>
              Lưu token
            </ActionButton>
          </div>
        </Card>

        {/* Recipients */}
        <Card
          title="2) Người nhận (chat_id)"
          desc="Thêm chat_id để nhận thông báo. Dùng Lấy updates để tìm chat_id khi nhắn với bot."
        >
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm md:w-72"
              placeholder="chat_id…"
              value={newChatId}
              onChange={(e) => setNewChatId(e.target.value)}
            />
            <input
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm md:w-64"
              placeholder="Tên (tuỳ chọn)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <div className="flex gap-2">
              <ActionButton onClick={addRec} disabled={loading}>Thêm</ActionButton>
              <ActionButton onClick={fetchUpdates} disabled={loading}>Lấy updates</ActionButton>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-200">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 text-zinc-600">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">ID</th>
                  <th className="px-3 py-2 text-left font-medium">chat_id</th>
                  <th className="px-3 py-2 text-left font-medium">Tên</th>
                  <th className="px-3 py-2 text-left font-medium">Trạng thái</th>
                  <th className="px-3 py-2 text-right font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {recs.length ? (
                  recs.map((r) => (
                    <tr key={r.id} className="border-t">
                      <td className="px-3 py-2">{r.id}</td>
                      <td className="px-3 py-2 font-mono">{r.chat_id}</td>
                      <td className="px-3 py-2">{r.display_name || '-'}</td>
                      <td className="px-3 py-2">
                        {r.is_active ? <Badge tone="success">Đang nhận</Badge> : <Badge>Tắt</Badge>}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex justify-end gap-2">
                          <ActionButton onClick={() => toggleRec(r)} disabled={loading}>
                            {r.is_active ? 'Tắt' : 'Bật'}
                          </ActionButton>
                          <ActionButton onClick={() => ping(r.chat_id)} disabled={loading}>
                            Ping
                          </ActionButton>
                          <ActionButton variant="danger" onClick={() => removeRec(r.id)} disabled={loading}>
                            Xoá
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-3 py-6 text-center text-sm text-zinc-500" colSpan={5}>
                      Chưa có người nhận
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {updates && (
            <details className="mt-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
              <summary className="cursor-pointer text-sm text-zinc-700">Xem JSON updates</summary>
              <pre className="mt-2 max-h-64 overflow-auto text-xs">{JSON.stringify(updates, null, 2)}</pre>
            </details>
          )}
        </Card>

        {/* Template */}
        <Card
          title="3) Template ORDER_SUCCESS"
          desc="Biến hỗ trợ: {{code}} {{customer}} {{total}} {{items}} {{time}} {{link}}"
        >
          <textarea
            className="h-40 w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2 font-mono text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-zinc-400"
            value={tplContent}
            onChange={(e) => setTplContent(e.target.value)}
          />
          <div className="mt-3">
            <ActionButton variant="primary" onClick={saveTpl} disabled={loading}>
              Lưu mẫu
            </ActionButton>
          </div>
        </Card>

        {/* Send manual */}
        <Card title="4) Gửi thủ công" desc="Gửi message nhanh tới 1 chat_id để kiểm tra bot.">
          <div className="grid gap-3 md:grid-cols-3">
            <input
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm"
              placeholder="chat_id…"
              value={manualChatId}
              onChange={(e) => setManualChatId(e.target.value)}
            />
            <input
              className="md:col-span-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm"
              placeholder="Nội dung…"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <ActionButton onClick={sendManual} disabled={loading}>
              Gửi
            </ActionButton>
          </div>
        </Card>
      </div>

      {/* loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-10 grid place-items-center bg-white/40 backdrop-blur-[1px]">
          <div className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm shadow-md">
            Đang xử lý…
          </div>
        </div>
      )}
    </div>
  );
}
