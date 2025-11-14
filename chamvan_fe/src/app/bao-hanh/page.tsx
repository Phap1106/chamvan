// src/app/bao-hanh/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bảo hành | Chạm Vân",
  description:
    "Hướng dẫn gửi yêu cầu bảo hành cho sản phẩm đồ gỗ giả cổ thủ công của Chạm Vân.",
};

export default function Page() {
  return (
    <div className="bg-white text-gray-800">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <header className="border border-gray-200 p-5">
          <h1 className="text-[28px] font-semibold tracking-tight text-black">Bảo hành</h1>
          <p className="text-sm text-gray-500 mt-1">
            Quy trình tiếp nhận & xử lý yêu cầu bảo hành sản phẩm “Chạm Vân — đồ gỗ giả cổ thủ công”
          </p>
        </header>

        <main className="mt-6 space-y-6">
          {/* Điều kiện hợp lệ */}
          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">1. Điều kiện tiếp nhận</h2>
            </div>
            <ul className="p-5 text-sm text-gray-700 space-y-2 list-disc list-inside">
              <li>Còn thời hạn bảo hành (3 tháng kể từ ngày nhận hàng).</li>
              <li>Lỗi kỹ thuật từ nhà sản xuất (kết cấu, mối nối, lớp hoàn thiện bong tróc bất thường).</li>
              <li>Không thuộc trường hợp loại trừ (hao mòn tự nhiên, va đập, ẩm mốc do môi trường, bảo quản sai hướng dẫn…).</li>
            </ul>
          </section>

          {/* Hồ sơ cần cung cấp */}
          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">2. Hồ sơ & thông tin cần cung cấp</h2>
            </div>
            <div className="p-5 text-sm text-gray-700 space-y-2">
              <p>Vui lòng chuẩn bị:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Mã đơn/phiếu mua hàng, ngày mua.</li>
                <li>Ảnh/video vị trí lỗi (toàn cảnh + cận cảnh).</li>
                <li>Mô tả ngắn: khi nào phát sinh, đã thử xử lý gì chưa.</li>
                <li>Thông tin liên hệ: họ tên, số điện thoại, địa chỉ.</li>
              </ul>
            </div>
          </section>

          {/* Quy trình xử lý */}
          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">3. Quy trình xử lý</h2>
            </div>
            <ol className="p-5 text-sm text-gray-700 space-y-2 list-decimal list-inside">
              <li>Gửi yêu cầu qua email <span className="font-medium">chamvan@gmail.com</span> (đính kèm hồ sơ).</li>
              <li>Chúng tôi đánh giá từ xa hoặc hẹn kỹ thuật kiểm tra thực tế.</li>
              <li>Đưa ra phương án: sửa tại chỗ / đưa về xưởng / đổi mới (tùy mức độ & linh kiện có sẵn).</li>
              <li>Thông báo thời gian dự kiến & các chi phí phát sinh (nếu ngoài phạm vi bảo hành).</li>
            </ol>
          </section>

          {/* Chi phí & thời gian */}
          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">4. Chi phí & thời gian</h2>
            </div>
            <div className="p-5 text-sm text-gray-700 space-y-2">
              <p><span className="font-medium text-gray-900">Trong phạm vi bảo hành:</span> Miễn phí vật tư & công sửa chữa; phí vận chuyển tùy vị trí.</p>
              <p><span className="font-medium text-gray-900">Ngoài phạm vi:</span> Báo giá trước, chỉ thực hiện khi bạn đồng ý.</p>
              <p><span className="font-medium text-gray-900">Thời gian:</span> 3–10 ngày làm việc tùy mức độ và lịch xưởng.</p>
            </div>
          </section>

          {/* Lưu ý */}
          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">5. Lưu ý</h2>
            </div>
            <div className="p-5 text-xs text-gray-600">
              Bảo hành không bao gồm thiệt hại do vận hành sai, tự ý sửa chữa, thay đổi kết cấu; hoặc do điều kiện môi trường không phù hợp
              (độ ẩm quá cao/thấp, nắng nóng trực tiếp, côn trùng…). Hãy xem thêm{" "}
              <a href="/chinh-sach-bao-hanh" className="underline hover:opacity-80">Chính sách bảo hành</a>.
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
