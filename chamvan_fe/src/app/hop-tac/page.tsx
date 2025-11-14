// src/app/hop-tac-du-an/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hợp tác dự án | Chạm Vân",
  description:
    "Nhận gia công/đồng phát triển sản phẩm gỗ giả cổ, decor nội thất, quà tặng theo yêu cầu đối tác.",
};

export default function Page() {
  return (
    <div className="bg-white text-gray-800">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <header className="border border-gray-200 p-5">
          <h1 className="text-[28px] font-semibold tracking-tight text-black">Hợp tác dự án</h1>
          <p className="text-sm text-gray-500 mt-1">
            Đồng phát triển sản phẩm thủ công · Sản xuất theo thiết kế · Bảo mật & đúng tiến độ
          </p>
        </header>

        <main className="mt-6 space-y-6">
          {/* Năng lực & phạm vi */}
          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">1. Năng lực & phạm vi hợp tác</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-px bg-gray-200">
              {[
                { t: "Thiết kế & mẫu hoá", d: "Đồng thiết kế, dựng mẫu thử, tinh chỉnh hoàn thiện theo brief." },
                { t: "Sản xuất theo lô", d: "Quy mô linh hoạt 20–2.000 sản phẩm/lô tuỳ phức tạp." },
                { t: "QC & đóng gói", d: "Kiểm soát chất lượng, đóng gói theo tiêu chuẩn xuất/nhập kho." },
              ].map((x) => (
                <div key={x.t} className="bg-white p-5 text-sm">
                  <div className="font-medium text-gray-900">{x.t}</div>
                  <p className="text-gray-700 mt-1">{x.d}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Quy trình làm việc */}
          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">2. Quy trình làm việc</h2>
            </div>
            <ol className="p-5 text-sm text-gray-700 space-y-2 list-decimal list-inside">
              <li>Tiếp nhận brief: mục tiêu, định hướng thẩm mỹ, số lượng, ngân sách, deadline.</li>
              <li>Đề xuất kỹ thuật & báo giá sơ bộ; ký NDA (nếu cần).</li>
              <li>Mẫu thử & duyệt mẫu: tinh chỉnh chi tiết, chốt BOM & quy cách.</li>
              <li>Sản xuất hàng loạt, QC từng công đoạn, đóng gói & giao nhận.</li>
            </ol>
          </section>

          {/* Cam kết */}
          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">3. Cam kết hợp tác</h2>
            </div>
            <ul className="p-5 text-sm text-gray-700 space-y-2 list-disc list-inside">
              <li>Bảo mật thông tin đối tác và bản quyền thiết kế.</li>
              <li>Chất lượng ổn định, kiểm duyệt đa bước, nghiệm thu minh bạch.</li>
              <li>Tiến độ đúng cam kết; hỗ trợ chứng từ & thanh toán B2B.</li>
            </ul>
          </section>

          {/* Hồ sơ gửi kèm */}
          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">4. Hồ sơ đề nghị hợp tác</h2>
            </div>
            <div className="p-5 text-sm text-gray-700 space-y-2">
              <p>Vui lòng gửi kèm:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Brief ý tưởng + moodboard (nếu có).</li>
                <li>Yêu cầu kỹ thuật, kích thước, vật liệu mong muốn.</li>
                <li>Số lượng dự kiến theo từng giai đoạn.</li>
                <li>Deadline & yêu cầu đóng gói/vận chuyển.</li>
              </ul>
            </div>
          </section>

          {/* Liên hệ */}
          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">5. Liên hệ</h2>
            </div>
            <div className="p-5 text-sm text-gray-700 space-y-2">
              <p>Email: <span className="font-medium">chamvan@gmail.com</span></p>
              <p>Tiêu đề mẫu: “Hợp tác dự án — Tên đơn vị — Số lượng — Deadline”</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
