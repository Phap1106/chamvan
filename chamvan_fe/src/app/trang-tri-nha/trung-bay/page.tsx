// chamvan_fe/src/app/trang-tri-nha/trung-bay/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import ListingTrangTriNha from "../_ListingTTN";

export const metadata: Metadata = {
  title: "Trưng bày | Chạm Vân",
  description: "Sản phẩm trưng bày thuộc bộ sưu tập Trang trí nhà.",
  alternates: { canonical: "/trang-tri-nha/trung-bay" },
};

export default function Page() {
  return (
    <Suspense>
      <ListingTrangTriNha initialCategory="trung-bay" />
    </Suspense>
  );
}
