// src/app/dieu-khoan-su-dung/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng | Chạm Vân",
  description:
    "Quy định sử dụng website/dịch vụ của Chạm Vân, quyền và nghĩa vụ của người dùng.",
};

export default function Page() {
  return (
    <div className="bg-white text-gray-800">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <header className="border border-gray-200 p-5">
          <h1 className="text-[28px] font-semibold tracking-tight text-black">Điều khoản sử dụng</h1>
          <p className="text-sm text-gray-500 mt-1">Cập nhật: 11/11/2025</p>
        </header>

        <main className="mt-6 space-y-6">
          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">1. Chấp nhận điều khoản</h2>
            </div>
            <div className="p-5 text-sm text-gray-700">
              Bằng việc truy cập/sử dụng website và dịch vụ, bạn xác nhận đã đọc, hiểu và đồng ý tuân thủ các điều khoản này.
            </div>
          </section>

          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">2. Tài khoản & bảo mật</h2>
            </div>
            <ul className="p-5 text-sm text-gray-700 space-y-2 list-disc list-inside">
              <li>Thông tin đăng ký phải chính xác, đầy đủ; bạn chịu trách nhiệm bảo mật tài khoản.</li>
              <li>Thông báo ngay cho chúng tôi khi phát hiện truy cập trái phép.</li>
            </ul>
          </section>

          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">3. Hành vi bị cấm</h2>
            </div>
            <ul className="p-5 text-sm text-gray-700 space-y-2 list-disc list-inside">
              <li>Xâm phạm an ninh hệ thống, thu thập trái phép dữ liệu.</li>
              <li>Đăng tải nội dung vi phạm pháp luật, quyền sở hữu trí tuệ, đạo đức xã hội.</li>
            </ul>
          </section>

          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">4. Quyền sở hữu trí tuệ</h2>
            </div>
            <div className="p-5 text-sm text-gray-700">
              Toàn bộ nội dung, hình ảnh, nhãn hiệu thuộc sở hữu của Chạm Vân hoặc đối tác được cấp phép. Mọi sao chép cần có sự đồng ý bằng văn bản.
            </div>
          </section>

          <section className="border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-black">5. Giới hạn trách nhiệm</h2>
            </div>
            <div className="p-5 text-sm text-gray-700">
              Chúng tôi không chịu trách nhiệm đối với thiệt hại gián tiếp, ngẫu nhiên hoặc do bên thứ ba gây ra khi bạn sử dụng dịch vụ.
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
