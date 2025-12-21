// src/app/layout.tsx
import "@/app/globals.css";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import ClientLayout from "@/components/ClientLayout";
import AntiDevtools from "@/components/security/AntiDevtools";

/* Font: Manrope cho nội dung (font chính) */
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Chạm Vân",
  description: "Website bán hàng đồ gỗ giả cổ Chạm Vân",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={manrope.variable} // chỉ còn font-sans, font-display lấy từ CSS nếu cần
    >
      {/* suppressHydrationWarning để tránh cảnh báo hydrate với extension */}
      <body
        className="flex flex-col font-sans bg-white min-h-dvh text-neutral-900"
        suppressHydrationWarning={true}
      >
                <AntiDevtools />
        {/* Toàn bộ phần dùng hook/state đưa vào ClientLayout */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
