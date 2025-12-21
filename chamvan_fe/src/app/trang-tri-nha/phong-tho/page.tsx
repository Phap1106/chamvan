// chamvan_fe/src/app/trang-tri-nha/phong-khach/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import ListingTrangTriNha from "../_ListingTTN";

export const metadata: Metadata = {
  title: "Phòng thờ | Chạm Vân",
  description: "Sản phẩm phòng thờ thuộc bộ sưu tập Trang trí nhà.",
  alternates: { canonical: "/trang-tri-nha/phong-tho" },
};

export default function Page() {
  return (
    <Suspense>
      <ListingTrangTriNha initialCategory="phong-tho" />
    </Suspense>
  );
}
