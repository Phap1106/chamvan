import type { Metadata } from "next";
import { Suspense } from "react";
import ListingHangMoi from "./_ListingHM";

export const metadata: Metadata = {
  title: "Hàng mới | Chạm Vân",
  description: "Sản phẩm gỗ giả cổ mới về – chọn ngay mẫu bạn thích.",
  alternates: { canonical: "/hang-moi" },
  openGraph: {
    title: "Hàng mới | Chạm Vân",
    description: "Bộ sưu tập sản phẩm mới nhất.",
    url: "https://your-domain.com/hang-moi",
    type: "website",
  },
};

export default function Page() {
  return (
    <Suspense>
      <ListingHangMoi />
    </Suspense>
  );
}
