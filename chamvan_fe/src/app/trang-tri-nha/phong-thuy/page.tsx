import type { Metadata } from "next";
import { Suspense } from "react";
import ListingTrangTriNha from "../_ListingTTN";

export const metadata: Metadata = {
  title: "Phong thủy | Chạm Vân",
  description: "Sản phẩm phong thủy thuộc bộ sưu tập Trang trí nhà.",
  alternates: { canonical: "/trang-tri-nha/phong-thuy" },
};

export default function Page() {
  return (
    <Suspense>
      <ListingTrangTriNha initialCategory="phong-thuy" />
    </Suspense>
  );
}
