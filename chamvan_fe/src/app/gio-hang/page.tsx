// // src/app/gio-hang/page.tsx
"use client";
import { useCart } from "@/components/providers/CartProvider";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, subtotal, updateQty, remove, clear } = useCart();
  const router = useRouter();

  // đúng chữ ký: updateQty(id, color, next)
  const dec = (id: string, color: string | undefined, current: number) =>
    updateQty(id, color, current - 1);
  const inc = (id: string, color: string | undefined, current: number) =>
    updateQty(id, color, current + 1);

  const onCheckout = () => {
    if (!items.length) return;
    try {
      localStorage.setItem(
        "cv_checkout_draft",
        JSON.stringify({ items, subtotal, ts: Date.now() })
      );
    } catch {}
    router.push("/checkout"); // đi thẳng tới trang checkout
  };

  return (
    <div className="px-4 py-10 mx-auto max-w-7xl">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">Giỏ hàng</h1>

      {items.length === 0 ? (
        <div className="p-10 text-center border rounded-lg text-neutral-600">
          Giỏ hàng trống.{" "}
          <Link href="/tat-ca-san-pham" className="underline">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-[1fr_360px]">
          {/* Danh sách */}
          <div className="space-y-4">
            {items.map((i) => (
              <div
                key={`${i.id}-${i.color ?? ""}`}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={i.image}
                  alt={i.name}
                  className="object-cover w-20 h-20 rounded"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{i.name}</div>
                  {i.color && (
                    <div className="text-xs text-neutral-500 mt-0.5">
                      Màu sắc: {i.color}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => dec(i.id, i.color, i.qty)}
                      className="px-2 py-1 border rounded"
                      aria-label="Giảm số lượng"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="min-w-[28px] text-center text-sm">{i.qty}</span>
                    <button
                      type="button"
                      onClick={() => inc(i.id, i.color, i.qty)}
                      className="px-2 py-1 border rounded"
                      aria-label="Tăng số lượng"
                    >
                      <Plus size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => remove(i.id, i.color)}
                      className="inline-flex items-center gap-1 ml-3 text-sm text-red-600 hover:underline"
                    >
                      <Trash2 size={16} /> Xoá
                    </button>
                  </div>
                </div>

                <div className="font-semibold text-right whitespace-nowrap">
                  {(i.price * i.qty).toLocaleString("vi-VN")} ₫
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-4">
              <button type="button" onClick={clear} className="text-sm underline">
                Xoá giỏ
              </button>
              <div className="text-lg font-semibold">
                Tạm tính: {subtotal.toLocaleString("vi-VN")} ₫
              </div>
            </div>
          </div>

          {/* Box tổng kết */}
          <aside className="p-5 border h-fit rounded-xl">
            <div className="mb-4 text-lg font-semibold">Tổng tiền</div>
            <div className="flex items-center justify-between pt-4 mt-2 border-t">
              <div className="text-neutral-600">Tạm tính</div>
              <div className="font-semibold">{subtotal.toLocaleString("vi-VN")} ₫</div>
            </div>

            <button
              type="button"
              onClick={onCheckout}
              disabled={!items.length}
              className="w-full py-3 mt-5 text-white rounded-lg bg-neutral-900 hover:bg-neutral-800 disabled:opacity-60"
            >
              Đặt hàng
            </button>

            <Link
              href="/tat-ca-san-pham"
              className="block w-full py-2 mt-3 text-sm text-center border rounded-lg hover:bg-neutral-50"
            >
              Tiếp tục mua sắm
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
