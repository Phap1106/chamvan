// src/app/faqs/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs | Chạm Vân",
  description:
    "Câu hỏi thường gặp về đặt hàng, giao hàng, bảo hành, bảo quản đồ gỗ giả cổ.",
};

type QA = { q: string; a: string };

const faqs: QA[] = [
  {
    q: "Thời gian giao hàng bao lâu?",
    a: "Thông thường 1–5 ngày làm việc tùy địa chỉ và tình trạng hàng. Chúng tôi sẽ thông báo nếu có điều chỉnh.",
  },
  {
    q: "Sản phẩm được bảo hành như thế nào?",
    a: "Bảo hành 3 tháng cho lỗi kỹ thuật của nhà sản xuất. Xem chi tiết tại trang /chinh-sach-bao-hanh.",
  },
  {
    q: "Tôi có thể đổi trả hàng không?",
    a: "Trong 7 ngày nếu sản phẩm lỗi do nhà sản xuất hoặc không đúng mô tả. Vui lòng giữ nguyên bao bì & hóa đơn.",
  },
  {
    q: "Bảo quản đồ gỗ giả cổ ra sao?",
    a: "Lau bụi khô hàng ngày, tránh nắng trực tiếp, duy trì độ ẩm 45–60%. Xem hướng dẫn đầy đủ tại /huong-dan-bao-quan.",
  },
  {
    q: "Chính sách bảo vệ dữ liệu cá nhân?",
    a: "Chúng tôi thu thập & xử lý dữ liệu theo pháp luật VN để phục vụ đơn hàng & cải thiện dịch vụ. Xem trang /chinh-sach-bao-ve-du-lieu-ca-nhan.",
  },
];

export default function Page() {
  return (
    <div className="bg-white text-gray-800">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <header className="border border-gray-200 p-5">
          <h1 className="text-[28px] font-semibold tracking-tight text-black">FAQs — Câu hỏi thường gặp</h1>
          <p className="text-sm text-gray-500 mt-1">Tổng hợp các vấn đề phổ biến khi mua & sử dụng sản phẩm Chạm Vân</p>
        </header>

        <main className="mt-6 space-y-4">
          {faqs.map((item) => (
            <details key={item.q} className="border border-gray-200 group">
              <summary className="cursor-pointer select-none px-4 py-3 text-gray-800 border-b border-gray-200 marker:hidden">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-black">{item.q}</span>
                  <span className="ml-3 w-6 h-6 grid place-items-center border border-gray-300 text-gray-600 group-open:rotate-180 transition-transform">
                    ▾
                  </span>
                </div>
              </summary>
              <div className="px-4 py-4 text-sm text-gray-700">{item.a}</div>
            </details>
          ))}

          {/* Liên hệ */}
          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">Chưa thấy câu trả lời?</h2>
            </div>
            <div className="p-5 text-sm text-gray-700">
              Liên hệ <span className="font-medium">chamvan@gmail.com</span> — chúng tôi phản hồi trong giờ làm việc.
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
