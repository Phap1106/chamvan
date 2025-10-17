// src/app/tat-ca-san-pham/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import ListingPage from "./shared/ListingPage";

export const metadata: Metadata = {
  title: "Tất cả sản phẩm | Chạm Vân — Đồ gỗ giả cổ tiện nghi",
  description:
    "Khám phá bộ sưu tập đồ gỗ trang trí nhà phong cách giả cổ: phòng thờ, phòng khách, phong thủy, trưng bày... Tinh tế, bền bỉ, tiện nghi và dễ phối.",
  alternates: { canonical: "/tat-ca-san-pham" },
  openGraph: {
    title: "Tất cả sản phẩm | Chạm Vân",
    description:
      "Đồ gỗ giả cổ tinh tế cho không gian sống hiện đại. Dễ dùng, dễ phối, bền bỉ.",
    url: "https://your-domain.com/tat-ca-san-pham",
    type: "website",
  },
};

export default function Page() {
  return (
    <Suspense>
      <ListingPage />
    </Suspense>
  );
}
