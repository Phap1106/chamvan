// src/app/chinh-sach-cookie/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách Cookie | Chạm Vân",
  description:
    "Cách Chạm Vân sử dụng cookie và công nghệ tương tự để vận hành & cải thiện dịch vụ.",
};

export default function Page() {
  return (
    <div className="bg-white text-gray-800">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <header className="border border-gray-200 p-5">
          <h1 className="text-[28px] font-semibold tracking-tight text-black">Chính sách Cookie</h1>
          <p className="text-sm text-gray-500 mt-1">Cập nhật: 11/11/2025</p>
        </header>

        <main className="mt-6 space-y-6">
          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">1. Cookie là gì?</h2>
            </div>
            <div className="p-5 text-sm text-gray-700">
              Cookie là các tệp nhỏ được lưu trên thiết bị khi bạn truy cập website để ghi nhớ thông tin phiên, cài đặt
              và giúp cải thiện trải nghiệm người dùng.
            </div>
          </section>

          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">2. Chúng tôi dùng cookie để</h2>
            </div>
            <ul className="p-5 text-sm text-gray-700 space-y-2 list-disc list-inside">
              <li>Ghi nhớ đăng nhập, giỏ hàng, tuỳ chọn hiển thị.</li>
              <li>Phân tích hành vi truy cập (analytics) để cải thiện dịch vụ.</li>
              <li>Tăng cường bảo mật, chống gian lận.</li>
            </ul>
          </section>

          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">3. Tuỳ chọn của bạn</h2>
            </div>
            <div className="p-5 text-sm text-gray-700 space-y-2">
              <p>Bạn có thể cấu hình trình duyệt để chặn/xóa cookie. Một số tính năng có thể không hoạt động khi vô hiệu hóa cookie.</p>
              <p>Đối với cookie phân tích/marketing, chúng tôi chỉ kích hoạt khi bạn đồng ý (nếu có banner chấp thuận).</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
