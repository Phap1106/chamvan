// src/app/huong-dan-bao-quan/HuongDanBaoQuanClient.tsx
"use client";

import { useState } from "react";

type Item = { title: string; desc?: string };

const daily: Item[] = [
  { title: "Lau bụi khô nhẹ", desc: "Dùng khăn microfiber khô, sạch; lau theo thớ gỗ." },
  { title: "Kiểm tra vệt nước", desc: "Nếu có vệt nước vừa bám, thấm khô ngay, tránh loang." },
];

const weekly: Item[] = [
  { title: "Lau ẩm nhẹ", desc: "Khăn vắt kiệt nước + 1–2 giọt xà phòng trung tính; lau nhanh rồi lau khô lại." },
  { title: "Hút bụi khe chạm", desc: "Dùng chổi mềm/đầu hút chổi để sạch bụi trong họa tiết chạm khắc." },
];

const monthly: Item[] = [
  { title: "Dưỡng bề mặt", desc: "Sáp/conditioner phù hợp sơn mài/PU. Thử ở góc khuất trước." },
  { title: "Soát ốc nối/khớp", desc: "Siết nhẹ nếu lỏng. Không siết quá tay gây nứt." },
];

const donts: Item[] = [
  { title: "Không phơi nắng trực tiếp", desc: "Nắng gắt làm bạc màu, co ngót, nứt lớp giả cổ." },
  { title: "Không dùng hóa chất mạnh", desc: "Tránh xăng, cồn đậm đặc, acid/kiềm mạnh." },
  { title: "Không đặt sát nguồn nhiệt/ẩm", desc: "Tránh máy sưởi, điều hòa thổi trực diện, máy phun sương gần." },
  { title: "Không kéo lê", desc: "Nhấc khi di chuyển; dán nỉ chân để tránh xước." },
];

const humidityTips: Item[] = [
  { title: "Độ ẩm 45–60%", desc: "Dùng ẩm kế. Mùa nồm dùng hút ẩm; mùa hanh dùng tạo ẩm gián tiếp." },
  { title: "Thoáng khí tự nhiên", desc: "Mở cửa sổ (khô ráo), tránh gió thốc trực diện vào bề mặt gỗ." },
  { title: "Tránh sốc ẩm/nhiệt", desc: "Không chuyển phòng quá lạnh → nóng đột ngột; để đồ “thích nghi” 1–2 giờ." },
];

const stainGuide: Item[] = [
  { title: "Vệt nước mới", desc: "Thấm khô ngay 3–5 phút; không chà mạnh." },
  { title: "Vết đồ uống/ngọt", desc: "Khăn ẩm + xà phòng nhẹ, lau khoanh nhỏ; lau khô liền." },
  { title: "Vệt trắng do ẩm", desc: "Thổi ấm nhẹ máy sấy, cách 20–30cm trong 30–60s; dừng nếu thấy nóng." },
  { title: "Xước lông mèo", desc: "Dùng sáp cùng tông, miết lấp, đánh khô bằng khăn mềm." },
];

const tools: string[] = [
  "Khăn microfiber (khô & ẩm vắt kiệt)",
  "Chổi mềm/hút bụi đầu chổi",
  "Xà phòng trung tính (pH ~7)",
  "Sáp/conditioner cho lớp hoàn thiện gỗ",
  "Ẩm kế, máy hút ẩm/tạo ẩm (khi cần)",
];

// ---- UI nhỏ gọn ----
function Accordion({
  items,
  defaultOpen = [],
  className,
}: {
  items: { id: string; title: string; content: React.ReactNode }[];
  defaultOpen?: string[];
  className?: string;
}) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpen);
  const toggle = (id: string) =>
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div className={className}>
      {items.map((it, idx) => {
        const open = openIds.includes(it.id);
        return (
          <div key={it.id} className="border border-gray-200">
            <button
              type="button"
              onClick={() => toggle(it.id)}
              aria-expanded={open}
              className="w-full flex items-center justify-between px-4 py-3 text-left text-gray-800 hover:bg-gray-50 border-b border-gray-200"
            >
              <span className="font-medium text-black">{it.title}</span>
              <span
                className={`ml-3 grid place-items-center w-6 h-6 border border-gray-300 text-gray-600 ${
                  open ? "rotate-180" : ""
                } transition-transform`}
                aria-hidden
              >
                ▾
              </span>
            </button>
            {open && <div className="px-4 py-4">{it.content}</div>}
            {idx !== items.length - 1 && !open && <div className="h-px bg-gray-200" />}
          </div>
        );
      })}
    </div>
  );
}

function ListLines({ data }: { data: Item[] }) {
  return (
    <ul className="divide-y divide-gray-200 text-sm">
      {data.map((x) => (
        <li key={x.title} className="py-3">
          <div className="font-medium text-gray-900">{x.title}</div>
          {x.desc && <p className="text-gray-600 mt-1">{x.desc}</p>}
        </li>
      ))}
    </ul>
  );
}

export default function HuongDanBaoQuanClient() {
  const accordionItems = [
    {
      id: "quick",
      title: "Thực hiện nhanh",
      content: (
        <div className="grid sm:grid-cols-2 gap-px bg-gray-200">
          {[...daily, ...weekly].map((it) => (
            <div key={it.title} className="bg-white p-4 text-sm">
              <div className="font-medium text-gray-900">{it.title}</div>
              {it.desc && <p className="text-gray-600 mt-1">{it.desc}</p>}
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "routine",
      title: "Chu kỳ chăm sóc (ngày/tuần/tháng)",
      content: (
        <div className="grid md:grid-cols-3 gap-px bg-gray-200">
          <div className="bg-white">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-gray-900 font-medium">Hàng ngày</h3>
            </div>
            <div className="px-4">
              <ListLines data={daily} />
            </div>
          </div>
          <div className="bg-white">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-gray-900 font-medium">Hàng tuần</h3>
            </div>
            <div className="px-4">
              <ListLines data={weekly} />
            </div>
          </div>
          <div className="bg-white">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-gray-900 font-medium">Hàng tháng</h3>
            </div>
            <div className="px-4">
              <ListLines data={monthly} />
            </div>
          </div>
        </div>
      ),
    },
    { id: "donts", title: "Những điều cần tránh", content: <ListLines data={donts} /> },
    {
      id: "humidity",
      title: "Độ ẩm & nhiệt độ",
      content: (
        <div className="grid sm:grid-cols-3 gap-px bg-gray-200">
          {humidityTips.map((x) => (
            <div key={x.title} className="bg-white p-4 text-sm">
              <div className="font-medium text-gray-900">{x.title}</div>
              <p className="text-gray-600 mt-1">{x.desc}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "stain",
      title: "Xử lý vết bẩn & vết xước nhẹ",
      content: (
        <div>
          <ListLines data={stainGuide} />
          <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
            <strong className="text-gray-900">Lưu ý:</strong> Vết xước sâu, mẻ sơn, bong tróc… không tự xử lý. Liên hệ
            kỹ thuật để mài – phục hồi – phủ lại lớp hoàn thiện đồng bộ.
          </div>
        </div>
      ),
    },
    {
      id: "storage",
      title: "Bảo quản dài ngày / vận chuyển",
      content: (
        <div className="text-sm text-gray-700 space-y-3">
          <p>
            <span className="font-medium text-gray-900">Đóng gói:</span> Bọc lớp mềm (bọt/nỉ) tiếp xúc bề mặt, sau đó
            tới lớp carton. Tránh bọc nilon sát mặt quá kín trong thời gian dài (đọng hơi ẩm).
          </p>
          <p>
            <span className="font-medium text-gray-900">Xếp dỡ:</span> Nhấc bốn góc, không kéo lê. Đặt đứng chắc chắn; có
            nêm chống rung nếu di chuyển xa.
          </p>
          <p>
            <span className="font-medium text-gray-900">Cất kho:</span> Nơi khô ráo, thoáng; kê cao khỏi nền; duy trì ẩm
            45–60%. Không để sát tường ẩm, không để dưới miệng điều hòa.
          </p>
          <div className="pt-4 border-t border-gray-200 text-xs text-gray-500">
            * Áp dụng cho “Chạm Vân — đồ gỗ giả cổ thủ công”. Điều kiện thực tế có thể khác; vui lòng liên hệ để được
            tư vấn cụ thể theo chất liệu/lớp hoàn thiện từng mẫu.
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white text-gray-800">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <header className="border border-gray-200 p-5">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-[28px] md:text-[32px] font-semibold tracking-tight text-black">
                Hướng dẫn bảo quản đồ gỗ giả cổ thủ công
              </h1>
             
            </div>
          
          </div>
        </header>

        <main className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar trái */}
          <aside className="lg:col-span-4">
            <div className="border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-base font-medium text-black">Ghi chú chung</h2>
              </div>
              <div className="divide-y divide-gray-200 text-sm">
                <div className="p-4 text-gray-600">
                  Lớp hoàn thiện thủ công (sơn, mài, đánh bóng) — luôn thử sản phẩm vệ sinh ở góc khuất trước khi áp
                  dụng toàn bộ.
                </div>
                <div className="p-4 text-gray-600">
                  Ưu tiên microfiber, chổi mềm, dung dịch trung tính. Tránh miếng cọ thô, hóa chất mạnh, cồn đậm đặc.
                </div>
                <div className="p-4 text-gray-600">
                  Khi nghi ngờ hư hại: dừng thao tác và liên hệ Chạm Vân để được tư vấn kỹ thuật.
                </div>
              </div>
            </div>

            <div className="border border-gray-200 mt-6">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-base font-medium text-black">Dụng cụ khuyến nghị</h3>
              </div>
              <ul className="divide-y divide-gray-200 text-sm">
                {tools.map((txt) => (
                  <li
                    key={txt}
                    className="px-4 py-3 text-gray-700 hover:bg-gray-50 hover:outline hover:outline-1 hover:outline-gray-300"
                  >
                    {txt}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Accordion nội dung */}
          <section className="lg:col-span-8">
            <Accordion items={accordionItems} defaultOpen={["quick"]} className="space-y-4" />
          </section>
        </main>
      </div>
    </div>
  );
}
