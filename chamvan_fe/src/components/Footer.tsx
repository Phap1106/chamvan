// // src/components/Footer.tsx
// import Link from "next/link";

// type NavItem = { href: string; label: string };

// const supportLinks: NavItem[] = [
//   { href: "/lien-he", label: "Liên hệ" },
//   { href: "/huong-dan-bao-quan", label: "Hướng dẫn bảo quản" },
//   { href: "/bao-hanh", label: "Chính sách bảo hành" },
//   { href: "/giao-hang", label: "Chính sách giao hàng" },
//   { href: "/faqs", label: "FAQs" },
// ];

// const policyLinks: NavItem[] = [
//   { href: "/dieu-khoan-su-dung", label: "Điều khoản sử dụng" },
//   { href: "/bao-ve-du-lieu-ca-nhan", label: "Chính sách bảo vệ dữ liệu cá nhân" },
//   { href: "/cookie", label: "Chính sách Cookie" },
// ];

// const b2bLinks: NavItem[] = [
//   { href: "/doanh-nghiep", label: "Giải pháp quà tặng doanh nghiệp" },
//   { href: "/hop-tac", label: "Hợp tác & dự án" },
// ];

// // SVG icon components (kích thước tự co theo className)
// function IconFacebook(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
//       <path d="M22 12.06C22 6.5 17.52 2 11.94 2 6.37 2 2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.77l-.44 2.9h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
//     </svg>
//   );
// }
// function IconInstagram(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
//       <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5.5A5.5 5.5 0 1 0 17.5 13 5.5 5.5 0 0 0 12 7.5Zm0 2A3.5 3.5 0 1 1 8.5 13 3.5 3.5 0 0 1 12 9.5ZM18 6.2a1 1 0 1 0 1 1 1 1 0 0 0-1-1Z" />
//     </svg>
//   );
// }
// function IconYouTube(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
//       <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.9 31.9 0 0 0 0 12a31.9 31.9 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.9 31.9 0 0 0 24 12a31.9 31.9 0 0 0-.5-5.8ZM9.75 15.02V8.98L15.5 12l-5.75 3.02Z" />
//     </svg>
//   );
// }
// function IconPinterest(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
//       <path d="M12.04 2C6.55 2 3 5.73 3 10.3c0 3.3 1.85 5.17 3.8 5.17 1.19 0 1.86-.66 1.86-1.48 0-.36-.18-.84-.47-1.08-.49-.4-.71-.96-.71-1.73 0-2.64 1.99-4.98 5.19-4.98 2.52 0 4.28 1.44 4.28 4.06 0 3.28-1.46 6.05-3.63 6.05-1.2 0-2.09-.99-1.8-2.21.35-1.46 1.02-3.04 1.02-4.1 0-.95-.51-1.75-1.56-1.75-1.23 0-2.21 1.27-2.21 2.97 0 1.08.37 1.81.37 1.81l-1.5 6.33c-.44 1.87-.07 4.16-.04 4.38h.12c.77-1.14 2.03-3.62 2.37-5.02.23-.9.9-3.46.9-3.46.44.85 1.7 1.59 3.04 1.59 4 0 6.82-3.79 6.82-8.52C21 5.37 17.33 2 12.04 2Z" />
//     </svg>
//   );
// }

// export default function Footer() {
//   const year = new Date().getFullYear();

//   // Thay bằng Google Maps embed của bạn
//   const mapEmbed =
//     "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.004889033335!2d105.848093!3d21.032010!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab941f0a0f3f%3A0x2b0c0a9b5c9b6f31!2zTMOqIFbEg24gSHXhu7cgLSBIw6AgTuG7mWk!5e0!3m2!1svi!2sVN!4v1700000000000";

//   const SocialLink = ({
//     href,
//     label,
//     children,
//   }: {
//     href: string;
//     label: string;
//     children: React.ReactNode;
//   }) => (
//     <a
//       href={href}
//       aria-label={label}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="inline-flex items-center justify-center transition rounded-full h-9 w-9 hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-800"
//     >
//       {/* icon màu theo text-current */}
//       <span className="text-neutral-900">
//         {children}
//       </span>
//     </a>
//   );

//   const LinkItem = ({ href, label }: NavItem) => (
//     <li>
//       <Link href={href} className="relative inline-block py-1 group">
//         <span className="transition-opacity group-hover:opacity-90">{label}</span>
//         <span className="absolute left-0 -bottom-0.5 block h-px w-full origin-left scale-x-0 bg-neutral-900 transition-transform duration-200 group-hover:scale-x-100" />
//       </Link>
//     </li>
//   );

//   return (
//     <footer className="border-t bg-neutral-50 text-neutral-700">
//       {/* Grid 4 cột — thân thiện mobile */}
//       <section className="px-4 py-10 mx-auto max-w-7xl sm:py-12">
//         <div className="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-4">
//           {/* Brand */}
//           <div>
//             <h2 className="text-3xl font-semibold leading-none tracking-tight sm:text-4xl">
//               CHAMVAN
//             </h2>
//             <div className="mt-4 space-y-2 text-sm leading-6 text-neutral-600">
//               <p>Công ty TNHH Chạm Vân</p>
//               <p>
//                 Trụ sở: Tầng 6, Số nhà 21, Ngõ 2 Lê Văn Hưu, Quận Hai Bà Trưng, Hà Nội
//               </p>
//               <p>MST: 0108062837</p>
//               <p>Hotline: 0900 000 000</p>
//               <p>Email: hello@chamvan.vn</p>
//             </div>
//           </div>

//           {/* Hỗ trợ KH */}
//           <div>
//             <h3 className="text-xs font-semibold tracking-wider uppercase text-neutral-500">
//               Hỗ trợ khách hàng
//             </h3>
//             <ul className="mt-3 space-y-2 text-sm sm:mt-4 sm:space-y-3">
//               {supportLinks.map((it) => (
//                 <LinkItem key={it.href} {...it} />
//               ))}
//             </ul>
//           </div>

//           {/* Pháp lý */}
//           <div>
//             <h3 className="text-xs font-semibold tracking-wider uppercase text-neutral-500">
//               Chính sách pháp lý
//             </h3>
//             <ul className="mt-3 space-y-2 text-sm sm:mt-4 sm:space-y-3">
//               {policyLinks.map((it) => (
//                 <LinkItem key={it.href} {...it} />
//               ))}
//             </ul>
//           </div>

//           {/* B2B + Social */}
//           <div className="flex flex-col justify-between">
//             <div>
//               <h3 className="text-xs font-semibold tracking-wider uppercase text-neutral-500">
//                 Khách hàng doanh nghiệp
//               </h3>
//               <ul className="mt-3 space-y-2 text-sm sm:mt-4 sm:space-y-3">
//                 {b2bLinks.map((it) => (
//                   <LinkItem key={it.href} {...it} />
//                 ))}
//               </ul>
//             </div>

//             <div className="mt-6 sm:mt-8">
//               <div className="flex items-center gap-3 sm:gap-4">
//                 <SocialLink href="#" label="Facebook">
//                   <IconFacebook className="w-4 h-4 fill-current" />
//                 </SocialLink>
//                 <SocialLink href="#" label="Instagram">
//                   <IconInstagram className="w-4 h-4 fill-current" />
//                 </SocialLink>
//                 <SocialLink href="#" label="YouTube">
//                   <IconYouTube className="w-4 h-4 fill-current" />
//                 </SocialLink>
//                 <SocialLink href="#" label="Pinterest">
//                   <IconPinterest className="w-4 h-4 fill-current" />
//                 </SocialLink>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

 

//       {/* Copyright */}
//       <div className="border-t">
//         <div className="px-4 py-5 mx-auto text-sm text-center max-w-7xl text-neutral-600">
//           © {year} Chạm Vân — All rights reserved.
//         </div>
//       </div>
//     </footer>
//   );
// }










'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type React from 'react';

type NavItem = { href: string; label: string };

const supportLinks: NavItem[] = [
  { href: '/lien-he', label: 'Liên hệ' },
  { href: '/huong-dan-bao-quan', label: 'Hướng dẫn bảo quản' },
  { href: '/bao-hanh', label: 'Chính sách bảo hành' },
  { href: '/chinh-sach-giao-hang', label: 'Chính sách giao hàng' },
  { href: '/faqs', label: 'FAQs' },
];

const policyLinks: NavItem[] = [
  { href: '/dieu-khoan-su-dung', label: 'Điều khoản sử dụng' },
  { href: '/bao-ve-du-lieu-ca-nhan', label: 'Chính sách bảo vệ dữ liệu cá nhân' },
  { href: '/cookie', label: 'Chính sách Cookie' },
];

const b2bLinks: NavItem[] = [
  { href: '/doanh-nghiep', label: 'Giải pháp quà tặng doanh nghiệp' },
  { href: '/hop-tac', label: 'Hợp tác & dự án' },
];

/* ===== SVG Icons (typed) ===== */
const IconFacebook: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M22 12.06C22 6.5 17.52 2 11.94 2 6.37 2 2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.77l-.44 2.9h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
  </svg>
);

const IconInstagram: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5.5A5.5 5.5 0 1 0 17.5 13 5.5 5.5 0 0 0 12 7.5Zm0 2A3.5 3.5 0 1 1 8.5 13 3.5 3.5 0 0 1 12 9.5ZM18 6.2a1 1 0 1 0 1 1 1 1 0 0 0-1-1Z" />
  </svg>
);

const IconYouTube: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.9 31.9 0 0 0 0 12a31.9 31.9 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.9 31.9 0 0 0 24 12a31.9 31.9 0 0 0-.5-5.8ZM9.75 15.02V8.98L15.5 12l-5.75 3.02Z" />
  </svg>
);

const IconPinterest: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M12.04 2C6.55 2 3 5.73 3 10.3c0 3.3 1.85 5.17 3.8 5.17 1.19 0 1.86-.66 1.86-1.48 0-.36-.18-.84-.47-1.08-.49-.4-.71-.96-.71-1.73 0-2.64 1.99-4.98 5.19-4.98 2.52 0 4.28 1.44 4.28 4.06 0 3.28-1.46 6.05-3.63 6.05-1.2 0-2.09-.99-1.8-2.21.35-1.46 1.02-3.04 1.02-4.1 0-.95-.51-1.75-1.56-1.75-1.23 0-2.21 1.27-2.21 2.97 0 1.08.37 1.81.37 1.81l-1.5 6.33c-.44 1.87-.07 4.16-.04 4.38h.12c.77-1.14 2.03-3.62 2.37-5.02.23-.9.9-3.46.9-3.46.44.85 1.7 1.59 3.04 1.59 4 0 6.82-3.79 6.82-8.52C21 5.37 17.33 2 12.04 2Z" />
  </svg>
);

/* ===== Small parts ===== */
const SocialLink = ({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    aria-label={label}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center justify-center transition rounded-full h-9 w-9 hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-800"
  >
    <span className="text-neutral-900">{children}</span>
  </a>
);

const LinkItem = ({ href, label }: NavItem) => (
  <li>
    <Link href={href} className="relative inline-block py-1 group">
      <span className="transition-opacity group-hover:opacity-90">{label}</span>
      <span className="absolute left-0 -bottom-0.5 block h-px w-full origin-left scale-x-0 bg-neutral-900 transition-transform duration-200 group-hover:scale-x-100" />
    </Link>
  </li>
);

/* ===== Footer ===== */
export default function Footer() {
  const pathname = usePathname();
  // Ẩn footer trên mọi trang admin
  if (pathname?.startsWith('/admin')) return null;

  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-neutral-50 text-neutral-700">
      {/* Content */}
      <section className="px-4 py-10 mx-auto max-w-7xl sm:py-12">
        <div className="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h2 className="text-3xl font-semibold leading-none tracking-tight sm:text-4xl">
              CHAMVAN
            </h2>
            <div className="mt-4 space-y-2 text-sm leading-6 text-neutral-600">
              <p>Công ty TNHH Chạm Vân</p>
              <p>Trụ sở: Số 12, đường Xóm Miễu, Thôn Duyên Trường, Xã Duyên Thái, Huyện Thường Tín, Thành phố Hà Nội, Việt Nam</p>
              <p>MST: 0110891704</p>
              <p>Hotline: 0933 415 331</p>
              <p>Email: chamvan@gmail.com</p>
            </div>
          </div>

          {/* Hỗ trợ KH */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider uppercase text-neutral-500">
              Hỗ trợ khách hàng
            </h3>
            <ul className="mt-3 space-y-2 text-sm sm:mt-4 sm:space-y-3">
              {supportLinks.map((it) => (
                <LinkItem key={it.href} {...it} />
              ))}
            </ul>
          </div>

          {/* Pháp lý */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider uppercase text-neutral-500">
              Chính sách pháp lý
            </h3>
            <ul className="mt-3 space-y-2 text-sm sm:mt-4 sm:space-y-3">
              {policyLinks.map((it) => (
                <LinkItem key={it.href} {...it} />
              ))}
            </ul>
          </div>

          {/* B2B + Social */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-semibold tracking-wider uppercase text-neutral-500">
                Khách hàng doanh nghiệp
              </h3>
              <ul className="mt-3 space-y-2 text-sm sm:mt-4 sm:space-y-3">
                {b2bLinks.map((it) => (
                  <LinkItem key={it.href} {...it} />
                ))}
              </ul>
            </div>

            <div className="mt-6 sm:mt-8">
              <div className="flex items-center gap-3 sm:gap-4">
                <SocialLink href="#" label="Facebook">
                  <IconFacebook className="w-4 h-4 fill-current" />
                </SocialLink>
                <SocialLink href="#" label="Instagram">
                  <IconInstagram className="w-4 h-4 fill-current" />
                </SocialLink>
                <SocialLink href="#" label="YouTube">
                  <IconYouTube className="w-4 h-4 fill-current" />
                </SocialLink>
                <SocialLink href="#" label="Pinterest">
                  <IconPinterest className="w-4 h-4 fill-current" />
                </SocialLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Copyright */}
      <div className="border-t">
        <div className="px-4 py-5 mx-auto text-sm text-center max-w-7xl text-neutral-600">
          © {year} Chạm Vân — All rights reserved.
        </div>
      </div>
    </footer>
  );
}
