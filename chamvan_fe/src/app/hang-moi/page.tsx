import type { Metadata } from "next";
import { Suspense } from "react";
import ListingPage from "../tat-ca-san-pham/shared/ListingPage";

export const metadata: Metadata = {
  title: "Hàng mới | Chạm Vân",
  description: "Sản phẩm mới cập nhật từ Chạm Vân.",
  alternates: { canonical: "/hang-moi" },
  openGraph: {
    title: "Hàng mới | Chạm Vân",
    description: "Khám phá các mẫu đồ gỗ mới nhất.",
    url: "https://your-domain.com/hang-moi",
    type: "website",
  },
};

export default function Page() {
  return (
    <Suspense>
      <ListingPage initialCategory="hang-moi" />
    </Suspense>
  );
}
