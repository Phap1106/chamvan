"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import Pagination from "@/components/Pagination";
import ProductHover, { Product } from "@/components/ProductHover";

/* ====== CẤU HÌNH DANH MỤC ====== */
const CATEGORIES = [
  { slug: "", label: "Tất cả" },
  { slug: "hang-moi", label: "Hàng mới" },
  { slug: "qua-tang", label: "Quà tặng" },
  { slug: "trang-tri-nha", label: "Trang trí nhà" },
  { slug: "trung-bay", label: "Trưng bày" },
];

/* ====== MOCK DATA — thay bằng API sau ====== */
export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Hộp bút Innate",
    price: 3600000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/538970029_122192862716284018_8628354831470128134_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGXi9sfkjI1fTWUQnXtmmFTP22gbGuo_kU_baBsa6j-Ra4S4L51L1svb8NjLKpqw92eKDC9pWdufEPJAUFGlQeE&_nc_ohc=ZCamyoxV6X4Q7kNvwF3RNbw&_nc_oc=Adm-5kFd_tgOs7U9aMGJm0TQu8DzNGxevjbMlmWS-xJFhE50EykqPaWtCX0xeDvnF_P7OAlt7c8MYVm-T_MwrO_T&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=LVX3Jw_dGZ6_BvMwNcpIDA&oh=00_AffR7CYj_XyKbt-zYoblREHsAKNFhgjCRFI1hSajBPy86g&oe=68F1C642",
    colors: [
      { name: "Đỏ gụ", hex: "#8B2E2E" },
      { name: "Xanh rêu", hex: "#235843" },
    ],
    category: "trung-bay",
  },
  {
    id: "p2",
    name: "Khay trầm Terrace",
    price: 2250000,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
    colors: [
      { name: "Xanh ngọc", hex: "#0A6E66" },
      { name: "Đen", hex: "#1F1F1F" },
    ],
    category: "phong-thuy",
  },
  {
    id: "p3",
    name: "Bình hoa Cosmos size S",
    price: 9330000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/532591560_122191557656284018_2900684475026621404_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeG6rArbgbqULfsjz3Qt4UzR1qdBHWEH5kPWp0EdYQfmQ2qOULgUg8ygczloEdVQfIxwsxo5v-xXZGc5kMJIEFeW&_nc_ohc=QWsp3DAA-xcQ7kNvwEhrOLT&_nc_oc=AdlkhDHHYpQVZpXEznqG4HKhVOh2kvn6_0j1xWj0LEnt8ykJZJU-LjLuhA3-NHsUxfUWJDuJBnTN6wqNC9g-ywIH&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=KAvFc0u72XXS4uHetZAbFg&oh=00_AfeFUMKSwkEXE0MDMAaUe4cjdSPQsLPkn_7CE3qteejltA&oe=68F1D4E8",
    colors: [
      { name: "Xanh than", hex: "#163B5A" },
      { name: "Ghi", hex: "#8E8E8E" },
    ],
    category: "phong-khach",
  },
  {
    id: "p4",
    name: "Án gian gỗ chạm",
    price: 25800000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/519169530_122187317954284018_8632856102545815425_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFDMjxl5F2lX-RnIIwtptJi1BJxXSvxQTnUEnFdK_FBOZ5I5F9W5A2afQ7CuXdxG0j2w4vCMvpVF0yau_E5-1QO&_nc_ohc=CbHzPn3sSSIQ7kNvwG8XufZ&_nc_oc=Admk53rQwZx46VYjj-GmtEM1TO_7aoQ81FPBK8ziT-sZsdMjaDok7Kg3JvShCeWEJp5q1Smbpm18-1qZ9S3mRvb5&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=lb0RTbc6Ob40jl8KaTBv1g&oh=00_Afcc42ay6_d2zmWdfB4QJmkELmdMXVbsHUOw5Jw9dSoTOg&oe=68F1DB8F",
    colors: [
      { name: "Nâu trầm", hex: "#6B3A2E" },
      { name: "Cánh gián", hex: "#7C3F2C" },
    ],
    category: "phong-tho",
  },
   {
    id: "p1",
    name: "Hộp bút Innate",
    price: 3600000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/538970029_122192862716284018_8628354831470128134_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGXi9sfkjI1fTWUQnXtmmFTP22gbGuo_kU_baBsa6j-Ra4S4L51L1svb8NjLKpqw92eKDC9pWdufEPJAUFGlQeE&_nc_ohc=ZCamyoxV6X4Q7kNvwF3RNbw&_nc_oc=Adm-5kFd_tgOs7U9aMGJm0TQu8DzNGxevjbMlmWS-xJFhE50EykqPaWtCX0xeDvnF_P7OAlt7c8MYVm-T_MwrO_T&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=LVX3Jw_dGZ6_BvMwNcpIDA&oh=00_AffR7CYj_XyKbt-zYoblREHsAKNFhgjCRFI1hSajBPy86g&oe=68F1C642",
    colors: [
      { name: "Đỏ gụ", hex: "#8B2E2E" },
      { name: "Xanh rêu", hex: "#235843" },
    ],
    category: "trung-bay",
  },
  {
    id: "p2",
    name: "Khay trầm Terrace",
    price: 2250000,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
    colors: [
      { name: "Xanh ngọc", hex: "#0A6E66" },
      { name: "Đen", hex: "#1F1F1F" },
    ],
    category: "phong-thuy",
  },
  {
    id: "p3",
    name: "Bình hoa Cosmos size S",
    price: 9330000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/532591560_122191557656284018_2900684475026621404_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeG6rArbgbqULfsjz3Qt4UzR1qdBHWEH5kPWp0EdYQfmQ2qOULgUg8ygczloEdVQfIxwsxo5v-xXZGc5kMJIEFeW&_nc_ohc=QWsp3DAA-xcQ7kNvwEhrOLT&_nc_oc=AdlkhDHHYpQVZpXEznqG4HKhVOh2kvn6_0j1xWj0LEnt8ykJZJU-LjLuhA3-NHsUxfUWJDuJBnTN6wqNC9g-ywIH&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=KAvFc0u72XXS4uHetZAbFg&oh=00_AfeFUMKSwkEXE0MDMAaUe4cjdSPQsLPkn_7CE3qteejltA&oe=68F1D4E8",
    colors: [
      { name: "Xanh than", hex: "#163B5A" },
      { name: "Ghi", hex: "#8E8E8E" },
    ],
    category: "phong-khach",
  },
  {
    id: "p4",
    name: "Án gian gỗ chạm",
    price: 25800000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/519169530_122187317954284018_8632856102545815425_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFDMjxl5F2lX-RnIIwtptJi1BJxXSvxQTnUEnFdK_FBOZ5I5F9W5A2afQ7CuXdxG0j2w4vCMvpVF0yau_E5-1QO&_nc_ohc=CbHzPn3sSSIQ7kNvwG8XufZ&_nc_oc=Admk53rQwZx46VYjj-GmtEM1TO_7aoQ81FPBK8ziT-sZsdMjaDok7Kg3JvShCeWEJp5q1Smbpm18-1qZ9S3mRvb5&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=lb0RTbc6Ob40jl8KaTBv1g&oh=00_Afcc42ay6_d2zmWdfB4QJmkELmdMXVbsHUOw5Jw9dSoTOg&oe=68F1DB8F",
    colors: [
      { name: "Nâu trầm", hex: "#6B3A2E" },
      { name: "Cánh gián", hex: "#7C3F2C" },
    ],
    category: "phong-tho",
  },
   {
    id: "p1",
    name: "Hộp bút Innate",
    price: 3600000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/538970029_122192862716284018_8628354831470128134_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGXi9sfkjI1fTWUQnXtmmFTP22gbGuo_kU_baBsa6j-Ra4S4L51L1svb8NjLKpqw92eKDC9pWdufEPJAUFGlQeE&_nc_ohc=ZCamyoxV6X4Q7kNvwF3RNbw&_nc_oc=Adm-5kFd_tgOs7U9aMGJm0TQu8DzNGxevjbMlmWS-xJFhE50EykqPaWtCX0xeDvnF_P7OAlt7c8MYVm-T_MwrO_T&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=LVX3Jw_dGZ6_BvMwNcpIDA&oh=00_AffR7CYj_XyKbt-zYoblREHsAKNFhgjCRFI1hSajBPy86g&oe=68F1C642",
    colors: [
      { name: "Đỏ gụ", hex: "#8B2E2E" },
      { name: "Xanh rêu", hex: "#235843" },
    ],
    category: "trung-bay",
  },
  {
    id: "p2",
    name: "Khay trầm Terrace",
    price: 2250000,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
    colors: [
      { name: "Xanh ngọc", hex: "#0A6E66" },
      { name: "Đen", hex: "#1F1F1F" },
    ],
    category: "phong-thuy",
  },
  {
    id: "p3",
    name: "Bình hoa Cosmos size S",
    price: 9330000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/532591560_122191557656284018_2900684475026621404_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeG6rArbgbqULfsjz3Qt4UzR1qdBHWEH5kPWp0EdYQfmQ2qOULgUg8ygczloEdVQfIxwsxo5v-xXZGc5kMJIEFeW&_nc_ohc=QWsp3DAA-xcQ7kNvwEhrOLT&_nc_oc=AdlkhDHHYpQVZpXEznqG4HKhVOh2kvn6_0j1xWj0LEnt8ykJZJU-LjLuhA3-NHsUxfUWJDuJBnTN6wqNC9g-ywIH&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=KAvFc0u72XXS4uHetZAbFg&oh=00_AfeFUMKSwkEXE0MDMAaUe4cjdSPQsLPkn_7CE3qteejltA&oe=68F1D4E8",
    colors: [
      { name: "Xanh than", hex: "#163B5A" },
      { name: "Ghi", hex: "#8E8E8E" },
    ],
    category: "phong-khach",
  },
  {
    id: "p4",
    name: "Án gian gỗ chạm",
    price: 25800000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/519169530_122187317954284018_8632856102545815425_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFDMjxl5F2lX-RnIIwtptJi1BJxXSvxQTnUEnFdK_FBOZ5I5F9W5A2afQ7CuXdxG0j2w4vCMvpVF0yau_E5-1QO&_nc_ohc=CbHzPn3sSSIQ7kNvwG8XufZ&_nc_oc=Admk53rQwZx46VYjj-GmtEM1TO_7aoQ81FPBK8ziT-sZsdMjaDok7Kg3JvShCeWEJp5q1Smbpm18-1qZ9S3mRvb5&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=lb0RTbc6Ob40jl8KaTBv1g&oh=00_Afcc42ay6_d2zmWdfB4QJmkELmdMXVbsHUOw5Jw9dSoTOg&oe=68F1DB8F",
    colors: [
      { name: "Nâu trầm", hex: "#6B3A2E" },
      { name: "Cánh gián", hex: "#7C3F2C" },
    ],
    category: "phong-tho",
  },
    {
    id: "p1",
    name: "Hộp bút Innate",
    price: 3600000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/538970029_122192862716284018_8628354831470128134_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGXi9sfkjI1fTWUQnXtmmFTP22gbGuo_kU_baBsa6j-Ra4S4L51L1svb8NjLKpqw92eKDC9pWdufEPJAUFGlQeE&_nc_ohc=ZCamyoxV6X4Q7kNvwF3RNbw&_nc_oc=Adm-5kFd_tgOs7U9aMGJm0TQu8DzNGxevjbMlmWS-xJFhE50EykqPaWtCX0xeDvnF_P7OAlt7c8MYVm-T_MwrO_T&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=LVX3Jw_dGZ6_BvMwNcpIDA&oh=00_AffR7CYj_XyKbt-zYoblREHsAKNFhgjCRFI1hSajBPy86g&oe=68F1C642",
    colors: [
      { name: "Đỏ gụ", hex: "#8B2E2E" },
      { name: "Xanh rêu", hex: "#235843" },
    ],
    category: "trung-bay",
  },
  {
    id: "p2",
    name: "Khay trầm Terrace",
    price: 2250000,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
    colors: [
      { name: "Xanh ngọc", hex: "#0A6E66" },
      { name: "Đen", hex: "#1F1F1F" },
    ],
    category: "phong-thuy",
  },
  {
    id: "p3",
    name: "Bình hoa Cosmos size S",
    price: 9330000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/532591560_122191557656284018_2900684475026621404_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeG6rArbgbqULfsjz3Qt4UzR1qdBHWEH5kPWp0EdYQfmQ2qOULgUg8ygczloEdVQfIxwsxo5v-xXZGc5kMJIEFeW&_nc_ohc=QWsp3DAA-xcQ7kNvwEhrOLT&_nc_oc=AdlkhDHHYpQVZpXEznqG4HKhVOh2kvn6_0j1xWj0LEnt8ykJZJU-LjLuhA3-NHsUxfUWJDuJBnTN6wqNC9g-ywIH&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=KAvFc0u72XXS4uHetZAbFg&oh=00_AfeFUMKSwkEXE0MDMAaUe4cjdSPQsLPkn_7CE3qteejltA&oe=68F1D4E8",
    colors: [
      { name: "Xanh than", hex: "#163B5A" },
      { name: "Ghi", hex: "#8E8E8E" },
    ],
    category: "phong-khach",
  },
  {
    id: "p4",
    name: "Án gian gỗ chạm",
    price: 25800000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/519169530_122187317954284018_8632856102545815425_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFDMjxl5F2lX-RnIIwtptJi1BJxXSvxQTnUEnFdK_FBOZ5I5F9W5A2afQ7CuXdxG0j2w4vCMvpVF0yau_E5-1QO&_nc_ohc=CbHzPn3sSSIQ7kNvwG8XufZ&_nc_oc=Admk53rQwZx46VYjj-GmtEM1TO_7aoQ81FPBK8ziT-sZsdMjaDok7Kg3JvShCeWEJp5q1Smbpm18-1qZ9S3mRvb5&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=lb0RTbc6Ob40jl8KaTBv1g&oh=00_Afcc42ay6_d2zmWdfB4QJmkELmdMXVbsHUOw5Jw9dSoTOg&oe=68F1DB8F",
    colors: [
      { name: "Nâu trầm", hex: "#6B3A2E" },
      { name: "Cánh gián", hex: "#7C3F2C" },
    ],
    category: "phong-tho",
  },
   {
    id: "p1",
    name: "Hộp bút Innate",
    price: 3600000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/538970029_122192862716284018_8628354831470128134_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGXi9sfkjI1fTWUQnXtmmFTP22gbGuo_kU_baBsa6j-Ra4S4L51L1svb8NjLKpqw92eKDC9pWdufEPJAUFGlQeE&_nc_ohc=ZCamyoxV6X4Q7kNvwF3RNbw&_nc_oc=Adm-5kFd_tgOs7U9aMGJm0TQu8DzNGxevjbMlmWS-xJFhE50EykqPaWtCX0xeDvnF_P7OAlt7c8MYVm-T_MwrO_T&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=LVX3Jw_dGZ6_BvMwNcpIDA&oh=00_AffR7CYj_XyKbt-zYoblREHsAKNFhgjCRFI1hSajBPy86g&oe=68F1C642",
    colors: [
      { name: "Đỏ gụ", hex: "#8B2E2E" },
      { name: "Xanh rêu", hex: "#235843" },
    ],
    category: "trung-bay",
  },
  {
    id: "p2",
    name: "Khay trầm Terrace",
    price: 2250000,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
    colors: [
      { name: "Xanh ngọc", hex: "#0A6E66" },
      { name: "Đen", hex: "#1F1F1F" },
    ],
    category: "phong-thuy",
  },
  {
    id: "p3",
    name: "Bình hoa Cosmos size S",
    price: 9330000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/532591560_122191557656284018_2900684475026621404_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeG6rArbgbqULfsjz3Qt4UzR1qdBHWEH5kPWp0EdYQfmQ2qOULgUg8ygczloEdVQfIxwsxo5v-xXZGc5kMJIEFeW&_nc_ohc=QWsp3DAA-xcQ7kNvwEhrOLT&_nc_oc=AdlkhDHHYpQVZpXEznqG4HKhVOh2kvn6_0j1xWj0LEnt8ykJZJU-LjLuhA3-NHsUxfUWJDuJBnTN6wqNC9g-ywIH&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=KAvFc0u72XXS4uHetZAbFg&oh=00_AfeFUMKSwkEXE0MDMAaUe4cjdSPQsLPkn_7CE3qteejltA&oe=68F1D4E8",
    colors: [
      { name: "Xanh than", hex: "#163B5A" },
      { name: "Ghi", hex: "#8E8E8E" },
    ],
    category: "phong-khach",
  },
  {
    id: "p4",
    name: "Án gian gỗ chạm",
    price: 25800000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/519169530_122187317954284018_8632856102545815425_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFDMjxl5F2lX-RnIIwtptJi1BJxXSvxQTnUEnFdK_FBOZ5I5F9W5A2afQ7CuXdxG0j2w4vCMvpVF0yau_E5-1QO&_nc_ohc=CbHzPn3sSSIQ7kNvwG8XufZ&_nc_oc=Admk53rQwZx46VYjj-GmtEM1TO_7aoQ81FPBK8ziT-sZsdMjaDok7Kg3JvShCeWEJp5q1Smbpm18-1qZ9S3mRvb5&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=lb0RTbc6Ob40jl8KaTBv1g&oh=00_Afcc42ay6_d2zmWdfB4QJmkELmdMXVbsHUOw5Jw9dSoTOg&oe=68F1DB8F",
    colors: [
      { name: "Nâu trầm", hex: "#6B3A2E" },
      { name: "Cánh gián", hex: "#7C3F2C" },
    ],
    category: "phong-tho",
  },
   {
    id: "p1",
    name: "Hộp bút Innate",
    price: 3600000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/538970029_122192862716284018_8628354831470128134_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGXi9sfkjI1fTWUQnXtmmFTP22gbGuo_kU_baBsa6j-Ra4S4L51L1svb8NjLKpqw92eKDC9pWdufEPJAUFGlQeE&_nc_ohc=ZCamyoxV6X4Q7kNvwF3RNbw&_nc_oc=Adm-5kFd_tgOs7U9aMGJm0TQu8DzNGxevjbMlmWS-xJFhE50EykqPaWtCX0xeDvnF_P7OAlt7c8MYVm-T_MwrO_T&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=LVX3Jw_dGZ6_BvMwNcpIDA&oh=00_AffR7CYj_XyKbt-zYoblREHsAKNFhgjCRFI1hSajBPy86g&oe=68F1C642",
    colors: [
      { name: "Đỏ gụ", hex: "#8B2E2E" },
      { name: "Xanh rêu", hex: "#235843" },
    ],
    category: "trung-bay",
  },
  {
    id: "p2",
    name: "Khay trầm Terrace",
    price: 2250000,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
    colors: [
      { name: "Xanh ngọc", hex: "#0A6E66" },
      { name: "Đen", hex: "#1F1F1F" },
    ],
    category: "phong-thuy",
  },
  {
    id: "p3",
    name: "Bình hoa Cosmos size S",
    price: 9330000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/532591560_122191557656284018_2900684475026621404_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeG6rArbgbqULfsjz3Qt4UzR1qdBHWEH5kPWp0EdYQfmQ2qOULgUg8ygczloEdVQfIxwsxo5v-xXZGc5kMJIEFeW&_nc_ohc=QWsp3DAA-xcQ7kNvwEhrOLT&_nc_oc=AdlkhDHHYpQVZpXEznqG4HKhVOh2kvn6_0j1xWj0LEnt8ykJZJU-LjLuhA3-NHsUxfUWJDuJBnTN6wqNC9g-ywIH&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=KAvFc0u72XXS4uHetZAbFg&oh=00_AfeFUMKSwkEXE0MDMAaUe4cjdSPQsLPkn_7CE3qteejltA&oe=68F1D4E8",
    colors: [
      { name: "Xanh than", hex: "#163B5A" },
      { name: "Ghi", hex: "#8E8E8E" },
    ],
    category: "phong-khach",
  },
  {
    id: "p4",
    name: "Án gian gỗ chạm",
    price: 25800000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/519169530_122187317954284018_8632856102545815425_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFDMjxl5F2lX-RnIIwtptJi1BJxXSvxQTnUEnFdK_FBOZ5I5F9W5A2afQ7CuXdxG0j2w4vCMvpVF0yau_E5-1QO&_nc_ohc=CbHzPn3sSSIQ7kNvwG8XufZ&_nc_oc=Admk53rQwZx46VYjj-GmtEM1TO_7aoQ81FPBK8ziT-sZsdMjaDok7Kg3JvShCeWEJp5q1Smbpm18-1qZ9S3mRvb5&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=lb0RTbc6Ob40jl8KaTBv1g&oh=00_Afcc42ay6_d2zmWdfB4QJmkELmdMXVbsHUOw5Jw9dSoTOg&oe=68F1DB8F",
    colors: [
      { name: "Nâu trầm", hex: "#6B3A2E" },
      { name: "Cánh gián", hex: "#7C3F2C" },
    ],
    category: "phong-tho",
  },
    {
    id: "p1",
    name: "Hộp bút Innate",
    price: 3600000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/538970029_122192862716284018_8628354831470128134_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGXi9sfkjI1fTWUQnXtmmFTP22gbGuo_kU_baBsa6j-Ra4S4L51L1svb8NjLKpqw92eKDC9pWdufEPJAUFGlQeE&_nc_ohc=ZCamyoxV6X4Q7kNvwF3RNbw&_nc_oc=Adm-5kFd_tgOs7U9aMGJm0TQu8DzNGxevjbMlmWS-xJFhE50EykqPaWtCX0xeDvnF_P7OAlt7c8MYVm-T_MwrO_T&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=LVX3Jw_dGZ6_BvMwNcpIDA&oh=00_AffR7CYj_XyKbt-zYoblREHsAKNFhgjCRFI1hSajBPy86g&oe=68F1C642",
    colors: [
      { name: "Đỏ gụ", hex: "#8B2E2E" },
      { name: "Xanh rêu", hex: "#235843" },
    ],
    category: "trung-bay",
  },
  {
    id: "p2",
    name: "Khay trầm Terrace",
    price: 2250000,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
    colors: [
      { name: "Xanh ngọc", hex: "#0A6E66" },
      { name: "Đen", hex: "#1F1F1F" },
    ],
    category: "phong-thuy",
  },
  {
    id: "p3",
    name: "Bình hoa Cosmos size S",
    price: 9330000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/532591560_122191557656284018_2900684475026621404_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeG6rArbgbqULfsjz3Qt4UzR1qdBHWEH5kPWp0EdYQfmQ2qOULgUg8ygczloEdVQfIxwsxo5v-xXZGc5kMJIEFeW&_nc_ohc=QWsp3DAA-xcQ7kNvwEhrOLT&_nc_oc=AdlkhDHHYpQVZpXEznqG4HKhVOh2kvn6_0j1xWj0LEnt8ykJZJU-LjLuhA3-NHsUxfUWJDuJBnTN6wqNC9g-ywIH&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=KAvFc0u72XXS4uHetZAbFg&oh=00_AfeFUMKSwkEXE0MDMAaUe4cjdSPQsLPkn_7CE3qteejltA&oe=68F1D4E8",
    colors: [
      { name: "Xanh than", hex: "#163B5A" },
      { name: "Ghi", hex: "#8E8E8E" },
    ],
    category: "phong-khach",
  },
  {
    id: "p4",
    name: "Án gian gỗ chạm",
    price: 25800000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/519169530_122187317954284018_8632856102545815425_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFDMjxl5F2lX-RnIIwtptJi1BJxXSvxQTnUEnFdK_FBOZ5I5F9W5A2afQ7CuXdxG0j2w4vCMvpVF0yau_E5-1QO&_nc_ohc=CbHzPn3sSSIQ7kNvwG8XufZ&_nc_oc=Admk53rQwZx46VYjj-GmtEM1TO_7aoQ81FPBK8ziT-sZsdMjaDok7Kg3JvShCeWEJp5q1Smbpm18-1qZ9S3mRvb5&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=lb0RTbc6Ob40jl8KaTBv1g&oh=00_Afcc42ay6_d2zmWdfB4QJmkELmdMXVbsHUOw5Jw9dSoTOg&oe=68F1DB8F",
    colors: [
      { name: "Nâu trầm", hex: "#6B3A2E" },
      { name: "Cánh gián", hex: "#7C3F2C" },
    ],
    category: "phong-tho",
  },
   {
    id: "p1",
    name: "Hộp bút Innate",
    price: 3600000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/538970029_122192862716284018_8628354831470128134_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGXi9sfkjI1fTWUQnXtmmFTP22gbGuo_kU_baBsa6j-Ra4S4L51L1svb8NjLKpqw92eKDC9pWdufEPJAUFGlQeE&_nc_ohc=ZCamyoxV6X4Q7kNvwF3RNbw&_nc_oc=Adm-5kFd_tgOs7U9aMGJm0TQu8DzNGxevjbMlmWS-xJFhE50EykqPaWtCX0xeDvnF_P7OAlt7c8MYVm-T_MwrO_T&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=LVX3Jw_dGZ6_BvMwNcpIDA&oh=00_AffR7CYj_XyKbt-zYoblREHsAKNFhgjCRFI1hSajBPy86g&oe=68F1C642",
    colors: [
      { name: "Đỏ gụ", hex: "#8B2E2E" },
      { name: "Xanh rêu", hex: "#235843" },
    ],
    category: "trung-bay",
  },
  {
    id: "p2",
    name: "Khay trầm Terrace",
    price: 2250000,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
    colors: [
      { name: "Xanh ngọc", hex: "#0A6E66" },
      { name: "Đen", hex: "#1F1F1F" },
    ],
    category: "phong-thuy",
  },
  {
    id: "p3",
    name: "Bình hoa Cosmos size S",
    price: 9330000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/532591560_122191557656284018_2900684475026621404_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeG6rArbgbqULfsjz3Qt4UzR1qdBHWEH5kPWp0EdYQfmQ2qOULgUg8ygczloEdVQfIxwsxo5v-xXZGc5kMJIEFeW&_nc_ohc=QWsp3DAA-xcQ7kNvwEhrOLT&_nc_oc=AdlkhDHHYpQVZpXEznqG4HKhVOh2kvn6_0j1xWj0LEnt8ykJZJU-LjLuhA3-NHsUxfUWJDuJBnTN6wqNC9g-ywIH&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=KAvFc0u72XXS4uHetZAbFg&oh=00_AfeFUMKSwkEXE0MDMAaUe4cjdSPQsLPkn_7CE3qteejltA&oe=68F1D4E8",
    colors: [
      { name: "Xanh than", hex: "#163B5A" },
      { name: "Ghi", hex: "#8E8E8E" },
    ],
    category: "phong-khach",
  },
  {
    id: "p4",
    name: "Án gian gỗ chạm",
    price: 25800000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/519169530_122187317954284018_8632856102545815425_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFDMjxl5F2lX-RnIIwtptJi1BJxXSvxQTnUEnFdK_FBOZ5I5F9W5A2afQ7CuXdxG0j2w4vCMvpVF0yau_E5-1QO&_nc_ohc=CbHzPn3sSSIQ7kNvwG8XufZ&_nc_oc=Admk53rQwZx46VYjj-GmtEM1TO_7aoQ81FPBK8ziT-sZsdMjaDok7Kg3JvShCeWEJp5q1Smbpm18-1qZ9S3mRvb5&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=lb0RTbc6Ob40jl8KaTBv1g&oh=00_Afcc42ay6_d2zmWdfB4QJmkELmdMXVbsHUOw5Jw9dSoTOg&oe=68F1DB8F",
    colors: [
      { name: "Nâu trầm", hex: "#6B3A2E" },
      { name: "Cánh gián", hex: "#7C3F2C" },
    ],
    category: "phong-tho",
  },
   {
    id: "p1",
    name: "Hộp bút Innate",
    price: 3600000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/538970029_122192862716284018_8628354831470128134_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGXi9sfkjI1fTWUQnXtmmFTP22gbGuo_kU_baBsa6j-Ra4S4L51L1svb8NjLKpqw92eKDC9pWdufEPJAUFGlQeE&_nc_ohc=ZCamyoxV6X4Q7kNvwF3RNbw&_nc_oc=Adm-5kFd_tgOs7U9aMGJm0TQu8DzNGxevjbMlmWS-xJFhE50EykqPaWtCX0xeDvnF_P7OAlt7c8MYVm-T_MwrO_T&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=LVX3Jw_dGZ6_BvMwNcpIDA&oh=00_AffR7CYj_XyKbt-zYoblREHsAKNFhgjCRFI1hSajBPy86g&oe=68F1C642",
    colors: [
      { name: "Đỏ gụ", hex: "#8B2E2E" },
      { name: "Xanh rêu", hex: "#235843" },
    ],
    category: "trung-bay",
  },
  {
    id: "p2",
    name: "Khay trầm Terrace",
    price: 2250000,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
    colors: [
      { name: "Xanh ngọc", hex: "#0A6E66" },
      { name: "Đen", hex: "#1F1F1F" },
    ],
    category: "phong-thuy",
  },
  {
    id: "p3",
    name: "Bình hoa Cosmos size S",
    price: 9330000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/532591560_122191557656284018_2900684475026621404_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeG6rArbgbqULfsjz3Qt4UzR1qdBHWEH5kPWp0EdYQfmQ2qOULgUg8ygczloEdVQfIxwsxo5v-xXZGc5kMJIEFeW&_nc_ohc=QWsp3DAA-xcQ7kNvwEhrOLT&_nc_oc=AdlkhDHHYpQVZpXEznqG4HKhVOh2kvn6_0j1xWj0LEnt8ykJZJU-LjLuhA3-NHsUxfUWJDuJBnTN6wqNC9g-ywIH&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=KAvFc0u72XXS4uHetZAbFg&oh=00_AfeFUMKSwkEXE0MDMAaUe4cjdSPQsLPkn_7CE3qteejltA&oe=68F1D4E8",
    colors: [
      { name: "Xanh than", hex: "#163B5A" },
      { name: "Ghi", hex: "#8E8E8E" },
    ],
    category: "phong-khach",
  },
  {
    id: "p4",
    name: "Án gian gỗ chạm",
    price: 25800000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/519169530_122187317954284018_8632856102545815425_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFDMjxl5F2lX-RnIIwtptJi1BJxXSvxQTnUEnFdK_FBOZ5I5F9W5A2afQ7CuXdxG0j2w4vCMvpVF0yau_E5-1QO&_nc_ohc=CbHzPn3sSSIQ7kNvwG8XufZ&_nc_oc=Admk53rQwZx46VYjj-GmtEM1TO_7aoQ81FPBK8ziT-sZsdMjaDok7Kg3JvShCeWEJp5q1Smbpm18-1qZ9S3mRvb5&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=lb0RTbc6Ob40jl8KaTBv1g&oh=00_Afcc42ay6_d2zmWdfB4QJmkELmdMXVbsHUOw5Jw9dSoTOg&oe=68F1DB8F",
    colors: [
      { name: "Nâu trầm", hex: "#6B3A2E" },
      { name: "Cánh gián", hex: "#7C3F2C" },
    ],
    category: "phong-tho",
  },
    {
    id: "p1",
    name: "Hộp bút Innate",
    price: 3600000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/538970029_122192862716284018_8628354831470128134_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGXi9sfkjI1fTWUQnXtmmFTP22gbGuo_kU_baBsa6j-Ra4S4L51L1svb8NjLKpqw92eKDC9pWdufEPJAUFGlQeE&_nc_ohc=ZCamyoxV6X4Q7kNvwF3RNbw&_nc_oc=Adm-5kFd_tgOs7U9aMGJm0TQu8DzNGxevjbMlmWS-xJFhE50EykqPaWtCX0xeDvnF_P7OAlt7c8MYVm-T_MwrO_T&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=LVX3Jw_dGZ6_BvMwNcpIDA&oh=00_AffR7CYj_XyKbt-zYoblREHsAKNFhgjCRFI1hSajBPy86g&oe=68F1C642",
    colors: [
      { name: "Đỏ gụ", hex: "#8B2E2E" },
      { name: "Xanh rêu", hex: "#235843" },
    ],
    category: "trung-bay",
  },
  {
    id: "p2",
    name: "Khay trầm Terrace",
    price: 2250000,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
    colors: [
      { name: "Xanh ngọc", hex: "#0A6E66" },
      { name: "Đen", hex: "#1F1F1F" },
    ],
    category: "phong-thuy",
  },
  {
    id: "p3",
    name: "Bình hoa Cosmos size S",
    price: 9330000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/532591560_122191557656284018_2900684475026621404_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeG6rArbgbqULfsjz3Qt4UzR1qdBHWEH5kPWp0EdYQfmQ2qOULgUg8ygczloEdVQfIxwsxo5v-xXZGc5kMJIEFeW&_nc_ohc=QWsp3DAA-xcQ7kNvwEhrOLT&_nc_oc=AdlkhDHHYpQVZpXEznqG4HKhVOh2kvn6_0j1xWj0LEnt8ykJZJU-LjLuhA3-NHsUxfUWJDuJBnTN6wqNC9g-ywIH&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=KAvFc0u72XXS4uHetZAbFg&oh=00_AfeFUMKSwkEXE0MDMAaUe4cjdSPQsLPkn_7CE3qteejltA&oe=68F1D4E8",
    colors: [
      { name: "Xanh than", hex: "#163B5A" },
      { name: "Ghi", hex: "#8E8E8E" },
    ],
    category: "phong-khach",
  },
  {
    id: "p4",
    name: "Án gian gỗ chạm",
    price: 25800000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/519169530_122187317954284018_8632856102545815425_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFDMjxl5F2lX-RnIIwtptJi1BJxXSvxQTnUEnFdK_FBOZ5I5F9W5A2afQ7CuXdxG0j2w4vCMvpVF0yau_E5-1QO&_nc_ohc=CbHzPn3sSSIQ7kNvwG8XufZ&_nc_oc=Admk53rQwZx46VYjj-GmtEM1TO_7aoQ81FPBK8ziT-sZsdMjaDok7Kg3JvShCeWEJp5q1Smbpm18-1qZ9S3mRvb5&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=lb0RTbc6Ob40jl8KaTBv1g&oh=00_Afcc42ay6_d2zmWdfB4QJmkELmdMXVbsHUOw5Jw9dSoTOg&oe=68F1DB8F",
    colors: [
      { name: "Nâu trầm", hex: "#6B3A2E" },
      { name: "Cánh gián", hex: "#7C3F2C" },
    ],
    category: "phong-tho",
  },
   {
    id: "p1",
    name: "Hộp bút Innate",
    price: 3600000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/538970029_122192862716284018_8628354831470128134_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGXi9sfkjI1fTWUQnXtmmFTP22gbGuo_kU_baBsa6j-Ra4S4L51L1svb8NjLKpqw92eKDC9pWdufEPJAUFGlQeE&_nc_ohc=ZCamyoxV6X4Q7kNvwF3RNbw&_nc_oc=Adm-5kFd_tgOs7U9aMGJm0TQu8DzNGxevjbMlmWS-xJFhE50EykqPaWtCX0xeDvnF_P7OAlt7c8MYVm-T_MwrO_T&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=LVX3Jw_dGZ6_BvMwNcpIDA&oh=00_AffR7CYj_XyKbt-zYoblREHsAKNFhgjCRFI1hSajBPy86g&oe=68F1C642",
    colors: [
      { name: "Đỏ gụ", hex: "#8B2E2E" },
      { name: "Xanh rêu", hex: "#235843" },
    ],
    category: "trung-bay",
  },
  {
    id: "p2",
    name: "Khay trầm Terrace",
    price: 2250000,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
    colors: [
      { name: "Xanh ngọc", hex: "#0A6E66" },
      { name: "Đen", hex: "#1F1F1F" },
    ],
    category: "phong-thuy",
  },
  {
    id: "p3",
    name: "Bình hoa Cosmos size S",
    price: 9330000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/532591560_122191557656284018_2900684475026621404_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeG6rArbgbqULfsjz3Qt4UzR1qdBHWEH5kPWp0EdYQfmQ2qOULgUg8ygczloEdVQfIxwsxo5v-xXZGc5kMJIEFeW&_nc_ohc=QWsp3DAA-xcQ7kNvwEhrOLT&_nc_oc=AdlkhDHHYpQVZpXEznqG4HKhVOh2kvn6_0j1xWj0LEnt8ykJZJU-LjLuhA3-NHsUxfUWJDuJBnTN6wqNC9g-ywIH&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=KAvFc0u72XXS4uHetZAbFg&oh=00_AfeFUMKSwkEXE0MDMAaUe4cjdSPQsLPkn_7CE3qteejltA&oe=68F1D4E8",
    colors: [
      { name: "Xanh than", hex: "#163B5A" },
      { name: "Ghi", hex: "#8E8E8E" },
    ],
    category: "phong-khach",
  },
  {
    id: "p4",
    name: "Án gian gỗ chạm",
    price: 25800000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/519169530_122187317954284018_8632856102545815425_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFDMjxl5F2lX-RnIIwtptJi1BJxXSvxQTnUEnFdK_FBOZ5I5F9W5A2afQ7CuXdxG0j2w4vCMvpVF0yau_E5-1QO&_nc_ohc=CbHzPn3sSSIQ7kNvwG8XufZ&_nc_oc=Admk53rQwZx46VYjj-GmtEM1TO_7aoQ81FPBK8ziT-sZsdMjaDok7Kg3JvShCeWEJp5q1Smbpm18-1qZ9S3mRvb5&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=lb0RTbc6Ob40jl8KaTBv1g&oh=00_Afcc42ay6_d2zmWdfB4QJmkELmdMXVbsHUOw5Jw9dSoTOg&oe=68F1DB8F",
    colors: [
      { name: "Nâu trầm", hex: "#6B3A2E" },
      { name: "Cánh gián", hex: "#7C3F2C" },
    ],
    category: "phong-tho",
  },
   {
    id: "p1",
    name: "Hộp bút Innate",
    price: 3600000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/538970029_122192862716284018_8628354831470128134_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGXi9sfkjI1fTWUQnXtmmFTP22gbGuo_kU_baBsa6j-Ra4S4L51L1svb8NjLKpqw92eKDC9pWdufEPJAUFGlQeE&_nc_ohc=ZCamyoxV6X4Q7kNvwF3RNbw&_nc_oc=Adm-5kFd_tgOs7U9aMGJm0TQu8DzNGxevjbMlmWS-xJFhE50EykqPaWtCX0xeDvnF_P7OAlt7c8MYVm-T_MwrO_T&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=LVX3Jw_dGZ6_BvMwNcpIDA&oh=00_AffR7CYj_XyKbt-zYoblREHsAKNFhgjCRFI1hSajBPy86g&oe=68F1C642",
    colors: [
      { name: "Đỏ gụ", hex: "#8B2E2E" },
      { name: "Xanh rêu", hex: "#235843" },
    ],
    category: "trung-bay",
  },
  {
    id: "p2",
    name: "Khay trầm Terrace",
    price: 2250000,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
    colors: [
      { name: "Xanh ngọc", hex: "#0A6E66" },
      { name: "Đen", hex: "#1F1F1F" },
    ],
    category: "phong-thuy",
  },
  {
    id: "p3",
    name: "Bình hoa Cosmos size S",
    price: 9330000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/532591560_122191557656284018_2900684475026621404_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeG6rArbgbqULfsjz3Qt4UzR1qdBHWEH5kPWp0EdYQfmQ2qOULgUg8ygczloEdVQfIxwsxo5v-xXZGc5kMJIEFeW&_nc_ohc=QWsp3DAA-xcQ7kNvwEhrOLT&_nc_oc=AdlkhDHHYpQVZpXEznqG4HKhVOh2kvn6_0j1xWj0LEnt8ykJZJU-LjLuhA3-NHsUxfUWJDuJBnTN6wqNC9g-ywIH&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=KAvFc0u72XXS4uHetZAbFg&oh=00_AfeFUMKSwkEXE0MDMAaUe4cjdSPQsLPkn_7CE3qteejltA&oe=68F1D4E8",
    colors: [
      { name: "Xanh than", hex: "#163B5A" },
      { name: "Ghi", hex: "#8E8E8E" },
    ],
    category: "phong-khach",
  },
  {
    id: "p4",
    name: "Án gian gỗ chạm",
    price: 25800000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/519169530_122187317954284018_8632856102545815425_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFDMjxl5F2lX-RnIIwtptJi1BJxXSvxQTnUEnFdK_FBOZ5I5F9W5A2afQ7CuXdxG0j2w4vCMvpVF0yau_E5-1QO&_nc_ohc=CbHzPn3sSSIQ7kNvwG8XufZ&_nc_oc=Admk53rQwZx46VYjj-GmtEM1TO_7aoQ81FPBK8ziT-sZsdMjaDok7Kg3JvShCeWEJp5q1Smbpm18-1qZ9S3mRvb5&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=lb0RTbc6Ob40jl8KaTBv1g&oh=00_Afcc42ay6_d2zmWdfB4QJmkELmdMXVbsHUOw5Jw9dSoTOg&oe=68F1DB8F",
    colors: [
      { name: "Nâu trầm", hex: "#6B3A2E" },
      { name: "Cánh gián", hex: "#7C3F2C" },
    ],
    category: "phong-tho",
  },
    {
    id: "p1",
    name: "Hộp bút Innate",
    price: 3600000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/538970029_122192862716284018_8628354831470128134_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGXi9sfkjI1fTWUQnXtmmFTP22gbGuo_kU_baBsa6j-Ra4S4L51L1svb8NjLKpqw92eKDC9pWdufEPJAUFGlQeE&_nc_ohc=ZCamyoxV6X4Q7kNvwF3RNbw&_nc_oc=Adm-5kFd_tgOs7U9aMGJm0TQu8DzNGxevjbMlmWS-xJFhE50EykqPaWtCX0xeDvnF_P7OAlt7c8MYVm-T_MwrO_T&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=LVX3Jw_dGZ6_BvMwNcpIDA&oh=00_AffR7CYj_XyKbt-zYoblREHsAKNFhgjCRFI1hSajBPy86g&oe=68F1C642",
    colors: [
      { name: "Đỏ gụ", hex: "#8B2E2E" },
      { name: "Xanh rêu", hex: "#235843" },
    ],
    category: "trung-bay",
  },
  {
    id: "p2",
    name: "Khay trầm Terrace",
    price: 2250000,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
    colors: [
      { name: "Xanh ngọc", hex: "#0A6E66" },
      { name: "Đen", hex: "#1F1F1F" },
    ],
    category: "phong-thuy",
  },
  {
    id: "p3",
    name: "Bình hoa Cosmos size S",
    price: 9330000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/532591560_122191557656284018_2900684475026621404_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeG6rArbgbqULfsjz3Qt4UzR1qdBHWEH5kPWp0EdYQfmQ2qOULgUg8ygczloEdVQfIxwsxo5v-xXZGc5kMJIEFeW&_nc_ohc=QWsp3DAA-xcQ7kNvwEhrOLT&_nc_oc=AdlkhDHHYpQVZpXEznqG4HKhVOh2kvn6_0j1xWj0LEnt8ykJZJU-LjLuhA3-NHsUxfUWJDuJBnTN6wqNC9g-ywIH&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=KAvFc0u72XXS4uHetZAbFg&oh=00_AfeFUMKSwkEXE0MDMAaUe4cjdSPQsLPkn_7CE3qteejltA&oe=68F1D4E8",
    colors: [
      { name: "Xanh than", hex: "#163B5A" },
      { name: "Ghi", hex: "#8E8E8E" },
    ],
    category: "phong-khach",
  },
  {
    id: "p4",
    name: "Án gian gỗ chạm",
    price: 25800000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/519169530_122187317954284018_8632856102545815425_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFDMjxl5F2lX-RnIIwtptJi1BJxXSvxQTnUEnFdK_FBOZ5I5F9W5A2afQ7CuXdxG0j2w4vCMvpVF0yau_E5-1QO&_nc_ohc=CbHzPn3sSSIQ7kNvwG8XufZ&_nc_oc=Admk53rQwZx46VYjj-GmtEM1TO_7aoQ81FPBK8ziT-sZsdMjaDok7Kg3JvShCeWEJp5q1Smbpm18-1qZ9S3mRvb5&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=lb0RTbc6Ob40jl8KaTBv1g&oh=00_Afcc42ay6_d2zmWdfB4QJmkELmdMXVbsHUOw5Jw9dSoTOg&oe=68F1DB8F",
    colors: [
      { name: "Nâu trầm", hex: "#6B3A2E" },
      { name: "Cánh gián", hex: "#7C3F2C" },
    ],
    category: "phong-tho",
  },
   {
    id: "p1",
    name: "Hộp bút Innate",
    price: 3600000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/538970029_122192862716284018_8628354831470128134_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGXi9sfkjI1fTWUQnXtmmFTP22gbGuo_kU_baBsa6j-Ra4S4L51L1svb8NjLKpqw92eKDC9pWdufEPJAUFGlQeE&_nc_ohc=ZCamyoxV6X4Q7kNvwF3RNbw&_nc_oc=Adm-5kFd_tgOs7U9aMGJm0TQu8DzNGxevjbMlmWS-xJFhE50EykqPaWtCX0xeDvnF_P7OAlt7c8MYVm-T_MwrO_T&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=LVX3Jw_dGZ6_BvMwNcpIDA&oh=00_AffR7CYj_XyKbt-zYoblREHsAKNFhgjCRFI1hSajBPy86g&oe=68F1C642",
    colors: [
      { name: "Đỏ gụ", hex: "#8B2E2E" },
      { name: "Xanh rêu", hex: "#235843" },
    ],
    category: "trung-bay",
  },
  {
    id: "p2",
    name: "Khay trầm Terrace",
    price: 2250000,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
    colors: [
      { name: "Xanh ngọc", hex: "#0A6E66" },
      { name: "Đen", hex: "#1F1F1F" },
    ],
    category: "phong-thuy",
  },
  {
    id: "p3",
    name: "Bình hoa Cosmos size S",
    price: 9330000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/532591560_122191557656284018_2900684475026621404_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeG6rArbgbqULfsjz3Qt4UzR1qdBHWEH5kPWp0EdYQfmQ2qOULgUg8ygczloEdVQfIxwsxo5v-xXZGc5kMJIEFeW&_nc_ohc=QWsp3DAA-xcQ7kNvwEhrOLT&_nc_oc=AdlkhDHHYpQVZpXEznqG4HKhVOh2kvn6_0j1xWj0LEnt8ykJZJU-LjLuhA3-NHsUxfUWJDuJBnTN6wqNC9g-ywIH&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=KAvFc0u72XXS4uHetZAbFg&oh=00_AfeFUMKSwkEXE0MDMAaUe4cjdSPQsLPkn_7CE3qteejltA&oe=68F1D4E8",
    colors: [
      { name: "Xanh than", hex: "#163B5A" },
      { name: "Ghi", hex: "#8E8E8E" },
    ],
    category: "phong-khach",
  },
  {
    id: "p4",
    name: "Án gian gỗ chạm",
    price: 25800000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/519169530_122187317954284018_8632856102545815425_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFDMjxl5F2lX-RnIIwtptJi1BJxXSvxQTnUEnFdK_FBOZ5I5F9W5A2afQ7CuXdxG0j2w4vCMvpVF0yau_E5-1QO&_nc_ohc=CbHzPn3sSSIQ7kNvwG8XufZ&_nc_oc=Admk53rQwZx46VYjj-GmtEM1TO_7aoQ81FPBK8ziT-sZsdMjaDok7Kg3JvShCeWEJp5q1Smbpm18-1qZ9S3mRvb5&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=lb0RTbc6Ob40jl8KaTBv1g&oh=00_Afcc42ay6_d2zmWdfB4QJmkELmdMXVbsHUOw5Jw9dSoTOg&oe=68F1DB8F",
    colors: [
      { name: "Nâu trầm", hex: "#6B3A2E" },
      { name: "Cánh gián", hex: "#7C3F2C" },
    ],
    category: "phong-tho",
  },
   {
    id: "p1",
    name: "Hộp bút Innate",
    price: 3600000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/538970029_122192862716284018_8628354831470128134_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGXi9sfkjI1fTWUQnXtmmFTP22gbGuo_kU_baBsa6j-Ra4S4L51L1svb8NjLKpqw92eKDC9pWdufEPJAUFGlQeE&_nc_ohc=ZCamyoxV6X4Q7kNvwF3RNbw&_nc_oc=Adm-5kFd_tgOs7U9aMGJm0TQu8DzNGxevjbMlmWS-xJFhE50EykqPaWtCX0xeDvnF_P7OAlt7c8MYVm-T_MwrO_T&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=LVX3Jw_dGZ6_BvMwNcpIDA&oh=00_AffR7CYj_XyKbt-zYoblREHsAKNFhgjCRFI1hSajBPy86g&oe=68F1C642",
    colors: [
      { name: "Đỏ gụ", hex: "#8B2E2E" },
      { name: "Xanh rêu", hex: "#235843" },
    ],
    category: "trung-bay",
  },
  {
    id: "p2",
    name: "Khay trầm Terrace",
    price: 2250000,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
    colors: [
      { name: "Xanh ngọc", hex: "#0A6E66" },
      { name: "Đen", hex: "#1F1F1F" },
    ],
    category: "phong-thuy",
  },
  {
    id: "p3",
    name: "Bình hoa Cosmos size S",
    price: 9330000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/532591560_122191557656284018_2900684475026621404_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeG6rArbgbqULfsjz3Qt4UzR1qdBHWEH5kPWp0EdYQfmQ2qOULgUg8ygczloEdVQfIxwsxo5v-xXZGc5kMJIEFeW&_nc_ohc=QWsp3DAA-xcQ7kNvwEhrOLT&_nc_oc=AdlkhDHHYpQVZpXEznqG4HKhVOh2kvn6_0j1xWj0LEnt8ykJZJU-LjLuhA3-NHsUxfUWJDuJBnTN6wqNC9g-ywIH&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=KAvFc0u72XXS4uHetZAbFg&oh=00_AfeFUMKSwkEXE0MDMAaUe4cjdSPQsLPkn_7CE3qteejltA&oe=68F1D4E8",
    colors: [
      { name: "Xanh than", hex: "#163B5A" },
      { name: "Ghi", hex: "#8E8E8E" },
    ],
    category: "phong-khach",
  },
  {
    id: "p4",
    name: "Án gian gỗ chạm",
    price: 25800000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/519169530_122187317954284018_8632856102545815425_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFDMjxl5F2lX-RnIIwtptJi1BJxXSvxQTnUEnFdK_FBOZ5I5F9W5A2afQ7CuXdxG0j2w4vCMvpVF0yau_E5-1QO&_nc_ohc=CbHzPn3sSSIQ7kNvwG8XufZ&_nc_oc=Admk53rQwZx46VYjj-GmtEM1TO_7aoQ81FPBK8ziT-sZsdMjaDok7Kg3JvShCeWEJp5q1Smbpm18-1qZ9S3mRvb5&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=lb0RTbc6Ob40jl8KaTBv1g&oh=00_Afcc42ay6_d2zmWdfB4QJmkELmdMXVbsHUOw5Jw9dSoTOg&oe=68F1DB8F",
    colors: [
      { name: "Nâu trầm", hex: "#6B3A2E" },
      { name: "Cánh gián", hex: "#7C3F2C" },
    ],
    category: "phong-tho",
  },
];

function formatCurrency(v: number) {
  return v.toLocaleString("vi-VN") + " ₫";
}

/* ====== DROPDOWN SẮP XẾP NHẸ ====== */
const SORTS = [
  { key: "relevance", label: "Liên quan nhất" },
  { key: "newest", label: "Mới nhất" },
  { key: "price-asc", label: "Giá từ thấp đến cao" },
  { key: "price-desc", label: "Giá từ cao xuống thấp" },
];

function SortMenu({
  value,
  onChange,
}: {
  value: string;
  onChange: (k: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = SORTS.find((s) => s.key === value) ?? SORTS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 text-sm"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-neutral-500">Sắp xếp theo:</span>
        <span className="font-medium text-neutral-900">
          {current.label}
        </span>
        <span>▾</span>
      </button>

      {open && (
        <ul
          className="absolute z-20 p-1 mt-2 bg-white border rounded-md shadow w-44"
          role="listbox"
          onMouseLeave={() => setOpen(false)}
        >
          {SORTS.map((s) => (
            <li key={s.key}>
              <button
                className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-neutral-100 ${
                  s.key === value ? "font-medium text-neutral-900" : "text-neutral-700"
                }`}
                onClick={() => {
                  onChange(s.key);
                  setOpen(false);
                }}
                role="option"
                aria-selected={s.key === value}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ====== TRANG LISTING CHÍNH ====== */
export default function ListingPage({
  initialCategory,
}: {
  initialCategory?: string;
}) {
  const router = useRouter();
  const sp = useSearchParams();

  // Query
  const pageParam = Number(sp.get("page") || "1");
  const qParam = sp.get("q") || "";
  const sortParam = sp.get("sort") || "relevance";
  const categoryFromURL = initialCategory ?? sp.get("category") ?? "";

  const [q, setQ] = useState(qParam);
  const pageSize = 12;

  // Filter + sort + paginate (mock)
  const { products, total } = useMemo(() => {
    let arr = [...MOCK_PRODUCTS];

    if (categoryFromURL) arr = arr.filter((p) => p.category === categoryFromURL);
    if (qParam) {
      const kw = qParam.trim().toLowerCase();
      arr = arr.filter(
        (p) =>
          p.name.toLowerCase().includes(kw) ||
          p.category.replace("-", " ").includes(kw)
      );
    }

    // sort
    if (sortParam === "price-asc") arr.sort((a, b) => a.price - b.price);
    if (sortParam === "price-desc") arr.sort((a, b) => b.price - a.price);
    if (sortParam === "newest") arr = arr.slice().reverse();

    const start = (pageParam - 1) * pageSize;
    const end = start + pageSize;
    return { products: arr.slice(start, end), total: arr.length };
  }, [categoryFromURL, pageParam, qParam, sortParam]);

  const activeCategory = categoryFromURL;

  function pushParams(next: URLSearchParams, base?: string) {
    const href = (base ?? (initialCategory ? `/tat-ca-san-pham/${initialCategory}` : "/tat-ca-san-pham")) +
      `?${next.toString()}`;
    router.push(href);
  }

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(sp.toString());
    if (q) params.set("q", q);
    else params.delete("q");
    params.set("page", "1");
    pushParams(params);
  }

  function onSortChange(k: string) {
    const params = new URLSearchParams(sp.toString());
    params.set("sort", k);
    params.set("page", "1");
    pushParams(params);
  }

  // breadcrumb JSON-LD (SEO)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://your-domain.com/" },
      { "@type": "ListItem", position: 2, name: "Tất cả sản phẩm", item: "https://your-domain.com/tat-ca-san-pham" },
      ...(activeCategory
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: CATEGORIES.find((c) => c.slug === activeCategory)?.label ?? "Danh mục",
              item: `https://your-domain.com/tat-ca-san-pham/${activeCategory}`,
            },
          ]
        : []),
    ],
  };

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb + tiêu đề */}
      <nav className="mb-2 text-sm text-neutral-500">
        <Link href="/" className="hover:underline">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link href="/tat-ca-san-pham" className="hover:underline">Tất cả sản phẩm</Link>
        {activeCategory && (
          <>
            <span className="mx-2">/</span>
            <span className="font-medium text-neutral-700">
              {CATEGORIES.find((c) => c.slug === activeCategory)?.label}
            </span>
          </>
        )}
      </nav>

      <h1 className="mb-1 text-3xl font-semibold tracking-wide text-center">
        {activeCategory ? CATEGORIES.find((c) => c.slug === activeCategory)?.label : "TRUNG BÀY & TRANG TRÍ"}
      </h1>
      <p className="mb-6 text-sm text-center text-neutral-500">{total} sản phẩm phù hợp</p>

      {/* Dãy danh mục + ô tìm kiếm + sắp xếp */}
      <div className="flex flex-wrap items-center gap-2 mb-6 md:gap-3">
        {CATEGORIES.map((c) => {
          const isActive = (initialCategory ? initialCategory : "") === c.slug;
          const href = c.slug ? `/tat-ca-san-pham/${c.slug}` : "/tat-ca-san-pham";
          return (
            <Link
              key={c.slug}
              href={href}
              className={[
                "rounded-full px-4 py-2 text-sm border",
                isActive
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-300 bg-white text-neutral-800 hover:border-neutral-500",
              ].join(" ")}
            >
              {c.label}
            </Link>
          );
        })}

        {/* SEARCH nằm cùng hàng, tự wrap khi nhỏ */}
        <form onSubmit={onSearch} className="ml-auto flex min-w-[280px] flex-1 max-w-md">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm án gian, khay, lộc bình..."
            className="w-full px-4 py-2 text-sm border outline-none border-neutral-300 focus:ring-2 focus:ring-neutral-800"
          />
          <button
            type="submit"
            className="px-4 py-2 ml-2 text-sm font-medium text-white rounded-md bg-neutral-900 hover:bg-neutral-800"
          >
            Tìm
          </button>
        </form>

        {/* SORT nhỏ gọn */}
        <div className="ml-2">
          <SortMenu value={sortParam} onChange={onSortChange} />
        </div>
      </div>

      {/* GRID 3 CỘT (mobile 2) — Ảnh to, không viền, không bo góc */}
      {products.length === 0 ? (
        <div className="p-10 text-center border border-dashed rounded-md text-neutral-500">
          Không tìm thấy sản phẩm phù hợp.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
          {products.map((p) => (
            <ProductHover
              key={p.id}
              product={p}
              href={`/san-pham/${p.id}`}
              priceRenderer={formatCurrency}
            />
          ))}
        </div>
      )}

      {/* PHÂN TRANG */}
      <div className="mt-10">
        <Pagination
          total={total}
          pageSize={pageSize}
          current={pageParam}
          makeLink={(page) => {
            const params = new URLSearchParams(sp.toString());
            params.set("page", String(page));
            const base = initialCategory
              ? `/tat-ca-san-pham/${initialCategory}`
              : "/tat-ca-san-pham";
            return `${base}?${params.toString()}`;
          }}
        />
      </div>
    </div>
  );
}
