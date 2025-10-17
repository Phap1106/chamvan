import type { Metadata } from "next";
import { Suspense } from "react";
import ListingTrangTriNha from "./_ListingTTN";

export const metadata: Metadata = {
  title: "Trang trí nhà | Chạm Vân — Đồ gỗ giả cổ tiện nghi",
  description:
    "Đồ gỗ trang trí nhà: phòng thờ, phòng khách, phong thủy, trưng bày.",
  alternates: { canonical: "/trang-tri-nha" },
  openGraph: {
    title: "Trang trí nhà | Chạm Vân",
    description: "Bộ sưu tập đồ gỗ trang trí nhà tinh tế, bền bỉ, dễ phối.",
    url: "https://your-domain.com/trang-tri-nha",
    type: "website",
  },
};

export default function Page() {
  return (
    <Suspense>
      {/* không truyền category -> hiện tất cả 4 danh mục con */}
      <ListingTrangTriNha />
    </Suspense>
  );
}
