// src/app/trang-tri-nha/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import ListingPage from "./shared/ListingPage";

export const metadata: Metadata = {
  title: "Trang trí nhà | Chạm Vân — Đồ gỗ giả cổ tiện nghi",
  description:
    "Khám phá bộ sưu tập đồ gỗ trang trí nhà phong cách giả cổ: phòng thờ, phòng khách, phong thủy, trưng bày... Tinh tế, bền bỉ, tiện nghi và dễ phối.",
  alternates: { canonical: "/trang-tri-nha" },
  openGraph: {
    title: "Trang trí nhà | Chạm Vân",
    description:
      "Đồ gỗ giả cổ tinh tế cho không gian sống hiện đại. Dễ dùng, dễ phối, bền bỉ.",
    url: "https://your-domain.com/trang-tri-nha",
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
