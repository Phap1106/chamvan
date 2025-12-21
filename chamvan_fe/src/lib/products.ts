
export type Color = { name: string; hex: string };
export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;        // ảnh đại diện
  images?: string[];    // album ảnh (nếu có)
  colors: Color[];
  category: string;     // vd: "phong-tho" | "phong-khach" | "phong-thuy" | "trung-bay" | "hang-moi" | "qua-tang"
  sku?: string;
  description?: string;
  specs?: { label: string; value: string }[];
};

// === DỮ LIỆU SẢN PHẨM ===
// 👉 HÃY COPY Y NGUYÊN danh sách MOCK_PRODUCTS bạn đang có vào đây (có thể rút gọn bớt lặp).
// Bạn có thể bổ sung thêm sku / images / description / specs cho các item.
export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Hộp bút Innate",
    price: 3600000,
    image:
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/538970029_122192862716284018_8628354831470128134_n.jpg?...",
    images: [
      "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/538970029_122192862716284018_8628354831470128134_n.jpg?...",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop"
    ],
    colors: [
      { name: "Đỏ gụ", hex: "#8B2E2E" },
      { name: "Xanh rêu", hex: "#235843" },
    ],
    category: "trung-bay",
    sku: "CV-P1",
    description:
      "Hộp bút gỗ chạm thủ công, hoàn thiện màu đỏ gụ – phong cách giả cổ tinh tế.",
    specs: [
      { label: "Chất liệu", value: "Gỗ tự nhiên, hoàn thiện PU" },
      { label: "Kích thước", value: "320 × 120 × 80 mm" },
      { label: "Màu sắc", value: "Đỏ gụ / Xanh rêu" },
    ],
  },
  {
    id: "p2",
    name: "Khay trầm Terrace",
    price: 2250000,
    image: "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/557363035_122198749556284018_3619573461219740447_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeE00UGFlYRnOUDBtrTmgdbPxvp7ymxR2drG-nvKbFHZ2to-aTU9AKJAW__a0sJM2WgRr10hTofF0RvAeEc5RnJQ&_nc_ohc=8ObRDiFusGoQ7kNvwF_lbhI&_nc_oc=AdkcAD3xWXJ3h2HBGraNCU0WK_dh451oCFa5ubCJfNjJY1xqOmzugahx_BzUkfJZSO9VVYSLuqeEKQ9Vv3mAfd-x&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=mOpyHwypwEd4WWcUxvN7eg&oh=00_AfcYyR0ecbiw2CqOfIjuhjhCVQSePH9_Si_79_h_QwWMpg&oe=68F567A9",
    colors: [
      { name: "Xanh ngọc", hex: "#0A6E66" },
      { name: "Đen", hex: "#1F1F1F" },
    ],
    category: "phong-thuy",
    sku: "CV-P2",
    description: "Khay trầm gỗ form Terrace, thao tác tiện dụng, dễ vệ sinh.",
    specs: [
      { label: "Chất liệu", value: "Gỗ tự nhiên" },
      { label: "Kích thước", value: "280 × 180 × 35 mm" },
    ],
  },
  // ... THÊM các sản phẩm còn lại giống mock hiện tại của bạn
];

export function findProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id) || null;
}

export function getRelated(currentId: string, category: string, limit = 8) {
  return PRODUCTS.filter((p) => p.id !== currentId && p.category === category).slice(0, limit);
}

export const currencyVN = (v: number) => v.toLocaleString("vi-VN") + " ₫";
// ... giữ nguyên các export hiện có

export function getSuggestions(currentId: string, limit = 8) {
  const pool = PRODUCTS.filter((p) => p.id !== currentId);
  // đơn giản: đảo và cắt (sau này thay bằng API/logic gợi ý)
  return [...pool].sort(() => Math.random() - 0.5).slice(0, limit);
}
