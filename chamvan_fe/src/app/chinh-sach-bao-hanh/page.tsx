// src/app/chinh-sach-bao-hanh/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách bảo hành | Chạm Vân",
  description:
    "Quy định và phạm vi bảo hành cho sản phẩm đồ gỗ giả cổ thủ công của Chạm Vân.",
};

export default function Page() {
  return (
    <div className="bg-white text-gray-800">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <header className="border border-gray-200 p-5">
          <h1 className="text-[28px] font-semibold tracking-tight text-black">
            Chính sách bảo hành
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Cập nhật: 11/11/2025 · Áp dụng cho sản phẩm “Chạm Vân — đồ gỗ giả cổ thủ công”
          </p>
        </header>

        <main className="mt-6 space-y-6">
          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">1. Thời hạn & phạm vi</h2>
            </div>
            <div className="p-5 text-sm text-gray-700 space-y-3">
              <p><span className="font-medium text-gray-900">Thời hạn:</span> 12 tháng kể từ ngày nhận hàng.</p>
              <p><span className="font-medium text-gray-900">Phạm vi:</span> Lỗi kỹ thuật từ nhà sản xuất (kết cấu, mối nối, lớp hoàn thiện bong tróc bất thường).</p>
              <p><span className="font-medium text-gray-900">Không áp dụng:</span> Hao mòn tự nhiên; va đập, trầy xước do sử dụng; ẩm mốc do môi trường; bảo quản sai hướng dẫn.</p>
            </div>
          </section>

          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">2. Điều kiện bảo hành hợp lệ</h2>
            </div>
            <ul className="p-5 text-sm text-gray-700 space-y-2 list-disc list-inside">
              <li>Có hóa đơn/phiếu mua hàng, tem nhãn, số đơn xác thực.</li>
              <li>Sản phẩm còn nguyên trạng (không tự ý sửa chữa/độ chế).</li>
              <li>Được sử dụng & bảo quản đúng hướng dẫn của Chạm Vân.</li>
            </ul>
          </section>

          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">3. Quy trình tiếp nhận</h2>
            </div>
            <ol className="p-5 text-sm text-gray-700 space-y-2 list-decimal list-inside">
              <li>Liên hệ <span className="font-medium">chamvan@gmail.com</span> (gửi ảnh/video & mô tả lỗi).</li>
              <li>Chúng tôi đánh giá từ xa hoặc hẹn kỹ thuật kiểm tra thực tế.</li>
              <li>Cung cấp phương án: sửa tại chỗ / đưa về xưởng / đổi mới (tùy mức độ).</li>
            </ol>
          </section>

          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">4. Chi phí</h2>
            </div>
            <div className="p-5 text-sm text-gray-700 space-y-3">
              <p><span className="font-medium text-gray-900">Trong phạm vi bảo hành:</span> Miễn phí vật tư & công sửa chữa. Phí vận chuyển tùy vị trí địa lý.</p>
              <p><span className="font-medium text-gray-900">Ngoài phạm vi:</span> Báo giá trước khi tiến hành; chỉ thực hiện khi bạn đồng ý.</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
