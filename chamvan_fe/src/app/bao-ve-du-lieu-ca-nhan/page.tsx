// src/app/chinh-sach-bao-ve-du-lieu-ca-nhan/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách bảo vệ dữ liệu cá nhân | Chạm Vân",
  description:
    "Cách Chạm Vân thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu cá nhân theo quy định pháp luật VN.",
};

export default function Page() {
  return (
    <div className="bg-white text-gray-800">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <header className="border border-gray-200 p-5">
          <h1 className="text-[28px] font-semibold tracking-tight text-black">
            Chính sách bảo vệ dữ liệu cá nhân
          </h1>
          <p className="text-sm text-gray-500 mt-1">Cập nhật: 11/11/2025</p>
        </header>

        <main className="mt-6 space-y-6">
          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">1. Phạm vi & cơ sở pháp lý</h2>
            </div>
            <div className="p-5 text-sm text-gray-700">
              Chính sách này áp dụng cho mọi dữ liệu cá nhân bạn cung cấp cho Chạm Vân khi sử dụng website/dịch vụ.
              Chúng tôi tuân thủ quy định pháp luật Việt Nam về bảo vệ dữ liệu cá nhân.
            </div>
          </section>

          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">2. Dữ liệu thu thập</h2>
            </div>
            <ul className="p-5 text-sm text-gray-700 space-y-2 list-disc list-inside">
              <li>Thông tin liên hệ: họ tên, email, số điện thoại, địa chỉ.</li>
              <li>Thông tin giao dịch: đơn hàng, thanh toán, lịch sử hỗ trợ.</li>
              <li>Dữ liệu kỹ thuật: cookie, địa chỉ IP, loại trình duyệt, logs truy cập.</li>
            </ul>
          </section>

          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">3. Mục đích sử dụng</h2>
            </div>
            <ul className="p-5 text-sm text-gray-700 space-y-2 list-disc list-inside">
              <li>Xử lý đơn hàng, giao hàng, chăm sóc khách hàng.</li>
              <li>Cải thiện trải nghiệm, bảo mật hệ thống, thống kê nội bộ.</li>
              <li>Gửi thông báo khuyến mãi (khi bạn đồng ý nhận).</li>
            </ul>
          </section>

          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">4. Lưu trữ & bảo mật</h2>
            </div>
            <div className="p-5 text-sm text-gray-700 space-y-2">
              <p>Dữ liệu được lưu trữ an toàn trên hệ thống có kiểm soát truy cập; chỉ nhân sự có thẩm quyền mới được phép truy cập.</p>
              <p>Thời hạn lưu trữ theo mục đích thu thập hoặc theo quy định pháp luật.</p>
            </div>
          </section>

          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">5. Quyền của chủ thể dữ liệu</h2>
            </div>
            <ul className="p-5 text-sm text-gray-700 space-y-2 list-disc list-inside">
              <li>Quyền truy cập, đính chính, hạn chế xử lý, xóa dữ liệu (khi pháp luật cho phép).</li>
              <li>Rút lại sự đồng ý; khi rút, việc xử lý trước đó vẫn hợp pháp.</li>
              <li>Gửi yêu cầu qua <span className="font-medium">chamvan@gmail.com</span>.</li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}
