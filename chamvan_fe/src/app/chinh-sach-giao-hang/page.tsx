// src/app/chinh-sach-giao-hang/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách giao hàng | Chạm Vân",
  description:
    "Phạm vi, thời gian, phí vận chuyển và quy định kiểm hàng khi nhận hàng.",
};

export default function Page() {
  return (
    <div className="bg-white text-gray-800">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <header className="border border-gray-200 p-5">
          <h1 className="text-[28px] font-semibold tracking-tight text-black">Chính sách giao hàng</h1>
          <p className="text-sm text-gray-500 mt-1">Cập nhật: 11/11/2025</p>
        </header>

        <main className="mt-6 space-y-6">
          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">1. Phạm vi & thời gian</h2>
            </div>
            <div className="p-5 text-sm text-gray-700 space-y-2">
              <p><span className="font-medium text-gray-900">Phạm vi:</span> Toàn quốc qua đơn vị vận chuyển đối tác hoặc đội vận chuyển của Chạm Vân (khu vực nội thành).</p>
              <p><span className="font-medium text-gray-900">Thời gian dự kiến:</span> 1–5 ngày làm việc tùy địa chỉ & tình trạng hàng.</p>
            </div>
          </section>

          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">2. Phí vận chuyển</h2>
            </div>
            <ul className="p-5 text-sm text-gray-700 space-y-2 list-disc list-inside">
              <li>Hiển thị tại bước thanh toán hoặc xác nhận qua email/Zalo trước khi chốt đơn.</li>
              <li>Hàng cồng kềnh, giao lắp đặt sẽ có phụ phí (nếu có) theo thực tế.</li>
            </ul>
          </section>

          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">3. Kiểm tra khi nhận hàng</h2>
            </div>
            <ol className="p-5 text-sm text-gray-700 space-y-2 list-decimal list-inside">
              <li>Kiểm tra ngoại quan kiện hàng, niêm phong, tem dán.</li>
              <li>Mở kiểm tra tình trạng bề mặt, phụ kiện kèm theo (nếu có biên bản mở hàng).</li>
              <li>Nếu phát hiện hư hỏng/thiếu: ghi nhận với nhân viên giao hàng và liên hệ ngay <span className="font-medium">chamvan@gmail.com</span>.</li>
            </ol>
          </section>
        </main>
      </div>
    </div>
  );
}
