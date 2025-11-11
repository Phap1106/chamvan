// src/app/gia-phap-qua-tang-doanh-nghiep/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giải pháp quà tặng doanh nghiệp | Chạm Vân",
  description:
    "Bộ giải pháp quà tặng doanh nghiệp bằng gỗ giả cổ thủ công — nhận diện thương hiệu, tuỳ biến theo sự kiện & ngân sách.",
};

export default function Page() {
  return (
    <div className="bg-white text-gray-800">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <header className="border border-gray-200 p-5">
          <h1 className="text-[28px] font-semibold tracking-tight text-black">
            Giải pháp quà tặng doanh nghiệp
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tùy biến theo nhận diện thương hiệu · Sản xuất thủ công tinh xảo · Quy trình nhanh gọn
          </p>
        </header>

        <main className="mt-6 space-y-6">
          {/* Lợi ích chính */}
          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">1. Vì sao chọn Chạm Vân</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-px bg-gray-200">
              {[
                {
                  t: "Ngôn ngữ quà tặng văn hoá",
                  d: "Gỗ giả cổ sơn mài — chất liệu truyền thống, sang trọng, bền vững với thời gian.",
                },
                {
                  t: "Tuỳ biến nhận diện",
                  d: "Khắc/ép logo, phối tông màu, thẻ chúc cá nhân hoá theo sự kiện.",
                },
                {
                  t: "Quy trình B2B nhanh",
                  d: "Báo giá trong 24h, mẫu duyệt nhanh, hỗ trợ hoá đơn & chứng từ đầy đủ.",
                },
              ].map((x) => (
                <div key={x.t} className="bg-white p-5 text-sm">
                  <div className="font-medium text-gray-900">{x.t}</div>
                  <p className="text-gray-700 mt-1">{x.d}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Danh mục gợi ý */}
          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">2. Danh mục gợi ý</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
              {[
                "Bộ tranh chữ/phúc lộc thọ tuỳ kích thước",
                "Hộp bút, ống cắm bút, kệ danh thiếp",
                "Bộ khay trà/khay decor bàn tiếp khách",
                "Tượng decor để bàn/để tủ",
                "Khung ảnh – bảng tri ân nhân sự",
                "Quà tặng Tết, kỷ niệm thành lập, hội nghị khách hàng",
              ].map((txt) => (
                <div key={txt} className="bg-white p-4 text-sm text-gray-700">
                  {txt}
                </div>
              ))}
            </div>
          </section>

          {/* Quy trình đặt hàng B2B */}
          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">3. Quy trình triển khai</h2>
            </div>
            <ol className="p-5 text-sm text-gray-700 space-y-2 list-decimal list-inside">
              <li>Gửi yêu cầu: số lượng, ngân sách, thời hạn, thông điệp/nhận diện thương hiệu.</li>
              <li>Đề xuất mẫu & báo giá: 2–3 phương án theo ngân sách.</li>
              <li>Duyệt mẫu & ký xác nhận: chốt kích thước, chất liệu, tuỳ biến logo.</li>
              <li>Sản xuất & giao hàng: đóng gói quà tặng, thiệp chúc, giao theo danh sách.</li>
            </ol>
          </section>

          {/* Gói ngân sách */}
          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">4. Gợi ý gói ngân sách</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-px bg-gray-200">
              {[
                { t: "Gói tiêu chuẩn", d: "800K–2M/suất · Hộp bút, kệ namecard, khay nhỏ." },
                { t: "Gói nâng cao", d: "2M–5M/suất · Bộ khay trà, tranh cỡ nhỏ, tượng mini." },
                { t: "Gói cao cấp", d: "5M–20M+/suất · Tranh, tượng, quà Tết premium, set quà trọn bộ." },
              ].map((x) => (
                <div key={x.t} className="bg-white p-5 text-sm">
                  <div className="font-medium text-gray-900">{x.t}</div>
                  <p className="text-gray-700 mt-1">{x.d}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA liên hệ */}
          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">5. Liên hệ tư vấn nhanh</h2>
            </div>
            <div className="p-5 text-sm text-gray-700 space-y-2">
              <p>Email: <span className="font-medium">chamvan@gmail.com</span></p>
              <p>Nội dung mẫu: “Quà tặng DN – Số lượng – Ngân sách – Thời hạn – Logo/CI (nếu có)”</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
