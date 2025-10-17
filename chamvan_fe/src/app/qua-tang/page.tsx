import type { Metadata } from "next";
import { Suspense } from "react";
import ListingPage from "../tat-ca-san-pham/shared/ListingPage";

export const metadata: Metadata = {
  title: "Quà tặng | Chạm Vân",
  description: "Gợi ý quà tặng tinh tế bằng gỗ giả cổ.",
  alternates: { canonical: "/qua-tang" },
  openGraph: {
    title: "Quà tặng | Chạm Vân",
    description: "Các mẫu quà tặng phù hợp biếu tặng, trang trí.",
    url: "https://your-domain.com/qua-tang",
    type: "website",
  },
};

export default function Page() {
  return (
    <Suspense>
      <ListingPage initialCategory="qua-tang" />
    </Suspense>
  );
}
