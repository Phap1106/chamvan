import "@/app/globals.css";
import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RootProviders from "@/components/providers/RootProviders";
import Toaster from "@/components/Toaster";

/* Font: Manrope (nội dung) + Playfair (logo/tiêu đề) */
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Chạm Vân",
  description: "Website bán hàng đồ gỗ giả cổ Chạm Vân",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${manrope.variable} ${playfair.variable}`}>
      <body className="flex flex-col font-sans bg-white min-h-dvh text-neutral-900">
        {/* Toaster bọc ngoài cùng để mọi nơi có thể useToast() */}
        <Toaster>
          <RootProviders>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </RootProviders>
        </Toaster>
      </body>
    </html>
  );
}
