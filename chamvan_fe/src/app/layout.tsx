// import "@/app/globals.css";
// import type { Metadata } from "next";
// import { Manrope, Playfair_Display } from "next/font/google";

// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import RootProviders from "@/components/providers/RootProviders";
// import Toaster from "@/components/Toaster";

// /* Font: Manrope (nội dung) + Playfair (logo/tiêu đề) */
// const manrope = Manrope({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700", "800"],
//   variable: "--font-sans",
// });

// const playfair = Playfair_Display({
//   subsets: ["latin"],
//   weight: ["600", "700", "800", "900"],
//   variable: "--font-display",
// });

// export const metadata: Metadata = {
//   title: "Chạm Vân",
//   description: "Website bán hàng đồ gỗ giả cổ Chạm Vân",
//   icons: {
//     icon: [
//       { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
//       { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
//     ],
//     shortcut: '/favicon.png',
//   },
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="vi" className={`${manrope.variable} ${playfair.variable}`}>
//       {/* 👇 Đã thêm suppressHydrationWarning={true} để fix lỗi extension */}
//       <body 
//         className="flex flex-col font-sans bg-white min-h-dvh text-neutral-900"
//         suppressHydrationWarning={true}
//       >
//         {/* Toaster bọc ngoài cùng để mọi nơi có thể useToast() */}
//         <Toaster>
//           <RootProviders>
//             <Header />
//             <main className="flex-1">{children}</main>
//             <Footer />
//           </RootProviders>
//         </Toaster>
//       </body>
//     </html>
//   );
// }




// import "@/app/globals.css";
// import type { Metadata } from "next";
// import { Manrope, Playfair_Display } from "next/font/google";
// import ClientLayout from "@/components/ClientLayout";

// /* Font: Manrope (nội dung) + Playfair (logo/tiêu đề) */
// const manrope = Manrope({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700", "800"],
//   variable: "--font-sans",
// });

// const playfair = Playfair_Display({
//   subsets: ["latin"],
//   weight: ["600", "700", "800", "900"],
//   variable: "--font-display",
// });

// export const metadata: Metadata = {
//   title: "Chạm Vân",
//   description: "Website bán hàng đồ gỗ giả cổ Chạm Vân",
//   // icons: {
//   //   icon: [
//   //     { url: "/favicon.png", sizes: "32x32", type: "image/png" },
//   //     { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
//   //   ],
//   //   shortcut: "/favicon.png",
//   // },
//   icons: {
//   icon: "/favicon.ico",
//   shortcut: "/favicon.ico",
// },

// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html
//       lang="vi"
//       className={`${manrope.variable} ${playfair.variable}`}
//     >
//       {/* 👇 Đã thêm suppressHydrationWarning={true} để fix lỗi extension */}
//       <body
//         className="flex flex-col font-sans bg-white min-h-dvh text-neutral-900"
//         suppressHydrationWarning={true}
//       >
//         {/* Toàn bộ phần dùng hook/state đưa vào ClientLayout */}
//         <ClientLayout>{children}</ClientLayout>
//       </body>
//     </html>
//   );
// }






// src/app/layout.tsx
import "@/app/globals.css";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import ClientLayout from "@/components/ClientLayout";

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
        {/* Toàn bộ phần dùng hook/state đưa vào ClientLayout */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
