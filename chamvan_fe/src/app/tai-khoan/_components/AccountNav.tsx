
// // // chamvan_fe/src/app/tai-khoan/_components/AccountNav.tsx

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  UserRound,
  Lock,
  ReceiptText,
  RotateCcw,
  Heart,
  Bug,
  LogOut,
  CheckCircle2,
  X,
  ShieldAlert,
} from 'lucide-react';

/**
 * Nav tài khoản bên trái trong khu vực "Tài khoản".
 * Tích hợp API logout:
 *  - Confirm -> POST /api/auth/logout -> router.refresh() -> toast.
 */
const NAV = [
  { href: '/tai-khoan', label: 'Thông tin cá nhân', icon: <UserRound className="w-5 h-5" /> },
  { href: '/tai-khoan/doi-mat-khau', label: 'Thay đổi mật khẩu', icon: <Lock className="w-5 h-5" /> },
  { href: '/tai-khoan/don-hang', label: 'Đơn đặt hàng của tôi', icon: <ReceiptText className="w-5 h-5" /> },
  { href: '/tai-khoan/doi-tra', label: 'Yêu cầu đổi trả của tôi', icon: <RotateCcw className="w-5 h-5" /> },
  { href: '/tai-khoan/yeu-thich', label: 'Danh sách yêu thích', icon: <Heart className="w-5 h-5" /> },
  { href: '/bao-cao-loi', label: 'Báo cáo lỗi', icon: <Bug className="w-5 h-5" /> },
];

export function AccountNav() {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (href: string) =>
    href === '/tai-khoan' ? pathname === href : pathname?.startsWith(href);

  // UI state
  const [showConfirm, setShowConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);

  // Auto-hide toast
  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 2200);
    return () => clearTimeout(t);
  }, [showToast]);

  /** Gọi API logout ở FE (xoá cookie) rồi refresh UI */
async function doLogout() {
  setLoadingLogout(true);
  try {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });

    // ✅ Cách 1: reload trang hiện tại để reset toàn bộ state (khuyên dùng)
    // if (typeof window !== 'undefined') {
    //   window.location.reload(); // hard reload, xóa toàn bộ cache state client
    //   return; // không cần chạy tiếp
    // }

    // (Tuỳ chọn) Cách 2: chuyển về trang chủ và reload
    if (typeof window !== 'undefined') {
      window.location.replace('/'); // không để user back về trang cũ
    }

  } catch {
    // fallback: vẫn thử refresh nhẹ nếu có lỗi
    router.refresh();
  } finally {
    setLoadingLogout(false);
  }
}


  async function confirmLogout() {
    setShowConfirm(false);
    await doLogout();
  }

  return (
    <div className="bg-white">
      {/* Title + short line */}
      <div className="mb-4">
        <div className="text-[18px] font-semibold text-zinc-800">Thông tin tài khoản</div>
        <div className="w-1/2 h-px mt-2 bg-zinc-200" />
      </div>

      {/* Items */}
      <nav className="space-y-1">
        {NAV.map((i) => {
          const active = isActive(i.href);
          return (
            <Link
              key={i.href}
              href={i.href}
              className={`flex items-center gap-3 px-4 py-3.5 text-[15px] hover:bg-zinc-50 ${
                active ? 'text-zinc-900 font-semibold' : 'text-zinc-700'
              }`}
            >
              <span className="shrink-0">{i.icon}</span>
              <span>{i.label}</span>
            </Link>
          );
        })}

        {/* Logout -> mở confirm */}
        <button
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-[15px] text-rose-600 hover:bg-zinc-50"
          onClick={() => setShowConfirm(true)}
        >
          <LogOut className="w-5 h-5" />
          Đăng xuất
        </button>
      </nav>

      {/* Confirm modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 grid p-4 place-items-center bg-black/40"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm p-4 bg-white rounded-md shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[15px] font-medium">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                Xác nhận đăng xuất
              </div>
              <button
                className="p-1 rounded text-zinc-600 hover:bg-zinc-100"
                onClick={() => setShowConfirm(false)}
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="mb-4 text-[14px] text-zinc-600">
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 text-[15px] hover:bg-zinc-50"
                onClick={() => setShowConfirm(false)}
                disabled={loadingLogout}
              >
                Hủy
              </button>
              <button
                className="bg-black px-4 py-2 text-[15px] text-white disabled:opacity-50"
                onClick={confirmLogout}
                disabled={loadingLogout}
              >
                {loadingLogout ? 'Đang đăng xuất…' : 'Đăng xuất'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div
        className={`fixed bottom-6 right-6 z-[60] transition-all duration-300 ${
          showToast ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
        }`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3 px-4 py-3 border rounded-md shadow-lg border-emerald-200 bg-emerald-50 text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-5 w-5" />
          <div className="text-[15px]">
            <div className="font-medium">Đăng xuất thành công</div>
            <div className="text-[13px] opacity-80">Hẹn gặp lại bạn lần sau!</div>
          </div>
          <button
            className="p-1 ml-2 rounded text-emerald-700/80 hover:bg-emerald-100"
            onClick={() => setShowToast(false)}
            aria-label="Đóng thông báo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountNav;
