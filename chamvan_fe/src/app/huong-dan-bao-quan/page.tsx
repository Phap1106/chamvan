// src/app/huong-dan-bao-quan/page.tsx
import type { Metadata } from "next";
import HuongDanBaoQuanClient from "./HuongDanBaoQuanClient.tsx";

export const metadata: Metadata = {
  title: "Hướng dẫn bảo quản đồ gỗ giả cổ | Chạm Vân",
  description:
    "Checklist & quy trình bảo quản đồ gỗ giả cổ thủ công: vệ sinh, độ ẩm, xử lý vết bẩn, bảo quản dài ngày.",
};

export default function Page() {
  return <HuongDanBaoQuanClient />;
}
