// src/app/trang-tri-nha/[category]/page.tsx
import { Suspense } from "react";
import ListingPage from "../shared/ListingPage";

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  return (
    <Suspense>
      <ListingPage initialCategory={params.category} />
    </Suspense>
  );
}
