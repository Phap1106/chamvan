// src/app/lienhe/page.tsx
import type { Metadata } from "next";
import {
  Mail,
  Phone,
  Facebook,
  MessageSquare,
  MapPin,
  Clock,
  Shirt,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Liên hệ | Chạm Vân",
  description:
    "Thông tin liên hệ Chạm Vân — đặt hàng trước, đặt theo mẫu, hỗ trợ nhanh qua email, Zalo, Facebook, hotline.",
};

const CONTACT = {
  email: "chamvan@gmail.com",
  hotline: "0933 415 331", // TODO: thay bằng số thật
  zalo: "https://zalo.me/0000000000", // TODO: thay link Zalo Official / cá nhân
  facebook: "https://www.facebook.com/profile.php?id=61558520552168", // TODO: thay link fanpage
  showroom: {
    name: "Chạm Vân",
    address: "Số 12, đường Xóm Miễu, Thôn Duyên Trường, Xã Duyên Thái, Huyện Thường Tín, Thành phố Hà Nội, Việt Nam",
    hours: "Thứ 2 – CN: 8:00 – 20:00",
  },
};

export default function LienHePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_60rem_at_20%_-10%,rgba(251,191,36,0.15),transparent_60%),radial-gradient(40rem_40rem_at_120%_10%,rgba(99,102,241,0.12),transparent_60%)]"
        />
        <div className="max-w-6xl px-6 py-20 mx-auto sm:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <p className="inline-block px-3 py-1 mb-3 text-xs tracking-wide border rounded-full border-zinc-200 text-zinc-600">
              BST SS2026 · Chạm cảm hứng
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              Liên hệ <span className="text-zinc-700">chamvan</span>
            </h1>
            <p className="max-w-2xl mx-auto mt-4 text-base leading-7 text-zinc-600 sm:text-lg">
              Cần đặt hàng trước, gia công theo mẫu, hay tư vấn chất liệu – kích
              thước? Hãy liên hệ trực tiếp. Chúng tôi phản hồi nhanh, tận tâm và
              rõ ràng.
            </p>
          </div>

          {/* Quick CTAs */}
          <div className="grid max-w-3xl grid-cols-1 gap-3 mx-auto mt-10 sm:grid-cols-3">
            <a
              href={`mailto:${CONTACT.email}`}
              className="inline-flex items-center justify-center px-4 py-3 text-sm font-medium transition bg-white border shadow-sm group rounded-2xl border-zinc-200 text-zinc-800 hover:border-zinc-300 hover:shadow"
            >
              <Mail className="w-5 h-5 mr-2" />
              Email
              <ArrowRight className="w-4 h-4 ml-2 transition opacity-0 group-hover:opacity-100" />
            </a>
            <a
              href={`tel:${CONTACT.hotline.replace(/\s+/g, "")}`}
              className="inline-flex items-center justify-center px-4 py-3 text-sm font-medium transition bg-white border shadow-sm group rounded-2xl border-zinc-200 text-zinc-800 hover:border-zinc-300 hover:shadow"
            >
              <Phone className="w-5 h-5 mr-2" />
              Hotline
              <ArrowRight className="w-4 h-4 ml-2 transition opacity-0 group-hover:opacity-100" />
            </a>
            <a
              href={CONTACT.zalo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-3 text-sm font-medium transition bg-white border shadow-sm group rounded-2xl border-zinc-200 text-zinc-800 hover:border-zinc-300 hover:shadow"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Zalo
              <ArrowRight className="w-4 h-4 ml-2 transition opacity-0 group-hover:opacity-100" />
            </a>
          </div>
        </div>
      </section>

      {/* Contact cards */}
      <section className="max-w-6xl px-6 pb-20 mx-auto">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Card: Trực tiếp & mạng xã hội */}
          <div className="p-6 border rounded-3xl border-zinc-200 sm:p-8">
            <h2 className="mb-4 text-xl font-semibold tracking-tight text-zinc-900">
              Liên hệ trực tiếp
            </h2>
            <ul className="space-y-4 text-sm sm:text-[15px]">
              <li className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-50">
                  <Mail className="w-5 h-5 text-zinc-700" />
                </div>
                <div>
                  <p className="font-medium text-zinc-900">Email</p>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="text-zinc-600 underline-offset-4 hover:underline"
                  >
                    {CONTACT.email}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-50">
                  <Phone className="w-5 h-5 text-zinc-700" />
                </div>
                <div>
                  <p className="font-medium text-zinc-900">Hotline</p>
                  <a
                    href={`tel:${CONTACT.hotline.replace(/\s+/g, "")}`}
                    className="text-zinc-600"
                  >
                    {CONTACT.hotline}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-50">
                  <Facebook className="w-5 h-5 text-zinc-700" />
                </div>
                <div>
                  <p className="font-medium text-zinc-900">Facebook</p>
                  <a
                    href={CONTACT.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-600 underline-offset-4 hover:underline"
                  >
                    Fanpage Chạm Vân
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-50">
                  <MessageSquare className="w-5 h-5 text-zinc-700" />
                </div>
                <div>
                  <p className="font-medium text-zinc-900">Zalo</p>
                  <a
                    href={CONTACT.zalo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-600 underline-offset-4 hover:underline"
                  >
                    Nhắn Zalo ngay
                  </a>
                </div>
              </li>
            </ul>

            <div className="p-4 mt-6 text-sm rounded-2xl bg-zinc-50 text-zinc-700">
              <p className="flex items-center gap-2 font-medium">
                <Shirt className="w-5 h-5" />
                Đặt theo mẫu / cá nhân hoá
              </p>
              <p className="mt-1 leading-6 text-zinc-600">
                Gửi ảnh, kích thước, màu sắc mong muốn – đội ngũ Chạm Vân tư vấn
                nhanh phương án chất liệu, thời gian & chi phí dự kiến.
              </p>
            </div>
          </div>

          {/* Card: Showroom & thời gian mở cửa */}
          <div className="p-6 border rounded-3xl border-zinc-200 sm:p-8">
            <h2 className="mb-4 text-xl font-semibold tracking-tight text-zinc-900">
              Thông tin cửa hàng
            </h2>

            <div className="mb-4 flex items-start gap-3 text-sm sm:text-[15px]">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-50">
                <MapPin className="w-5 h-5 text-zinc-700" />
              </div>
              <div>
                <p className="font-medium text-zinc-900">{CONTACT.showroom.name}</p>
                <p className="text-zinc-600">{CONTACT.showroom.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm sm:text-[15px]">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-50">
                <Clock className="w-5 h-5 text-zinc-700" />
              </div>
              <div>
                <p className="font-medium text-zinc-900">Giờ mở cửa</p>
                <p className="text-zinc-600">{CONTACT.showroom.hours}</p>
              </div>
            </div>

            {/* Promo block */}
            <div className="p-5 mt-6 border border-dashed rounded-2xl border-zinc-200">
              <p className="text-sm font-medium text-zinc-900">
                Hẹn lịch xem mẫu tại xưởng
              </p>
              <p className="mt-1 text-sm leading-6 text-zinc-600">
                Để chuẩn bị tốt nhất, bạn có thể nhắn trước sản phẩm quan tâm
                qua Zalo hoặc Facebook. Chúng tôi sẽ sắp xếp mẫu và tư vấn phù hợp.
              </p>
              <div className="grid grid-cols-1 gap-2 mt-4 sm:grid-cols-2">
                <a
                  href={CONTACT.zalo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-white transition bg-black rounded-xl hover:opacity-90"
                >
                  Nhắn Zalo
                </a>
                <a
                  href={CONTACT.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-3 text-sm font-medium transition bg-white border rounded-xl border-zinc-200 text-zinc-900 hover:border-zinc-300"
                >
                  Facebook Messenger
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner CTA */}
      <section className="max-w-6xl px-6 pb-24 mx-auto">
        <div className="relative overflow-hidden border rounded-3xl border-zinc-200">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(70rem_70rem_at_0%_100%,rgba(251,191,36,0.12),transparent_60%),radial-gradient(60rem_60rem_at_100%_0%,rgba(99,102,241,0.10),transparent_60%)]"
          />
          <div className="relative flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-zinc-900">
                Muốn đặt sản phẩm theo mẫu riêng?
              </h3>
              <p className="max-w-2xl mt-1 text-sm leading-6 text-zinc-600">
                Gửi ý tưởng – Chạm Vân giúp bạn biến thành sản phẩm thật với
                kỹ thuật thủ công & thẩm mỹ hiện đại.
              </p>
            </div>
            <div className="flex flex-col w-full gap-2 sm:w-auto sm:flex-row">
              <a
                href={`mailto:${CONTACT.email}`}
                className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-white transition bg-black rounded-xl hover:opacity-90"
              >
                Gửi email tư vấn
              </a>
              <a
                href={`tel:${CONTACT.hotline.replace(/\s+/g, "")}`}
                className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium transition bg-white border rounded-xl border-zinc-200 text-zinc-900 hover:border-zinc-300"
              >
                Gọi hotline
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
