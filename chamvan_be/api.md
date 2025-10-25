Tổng hợp API backend Chạm Vân (v1) — sẵn sàng gọi từ FE
(Base URL: http://localhost:${PORT||4000}/api • Content-Type: application/json)

Auth

POST /auth/login
Body:

{ "email": "user@example.com", "password": "secret123" }


Response:

{
  "accessToken": "JWT...",
  "user": { "id":"", "email":"", "fullName":"", "role":"admin|support_admin|user" }
}


Lưu ý: Dùng Authorization: Bearer <accessToken> cho endpoint cần đăng nhập.

Users

POST /users/register
Body:

{
  "fullName": "Tên",
  "email": "email@vd.com",
  "password": ">=6 ký tự",
  "phone": "+84...",
  "dob": "YYYY-MM-DD"
}


GET /users/me (JWT required) → thông tin user từ token.

Categories (Phân loại)

POST /categories (hiện chưa khóa quyền; nên chỉ dùng ở Admin UI)
Body:

{
  "slug": "trung-bay",
  "name": "Trưng bày",
  "description": "mô tả...",
  "parentId": "uuid-cha (optional)"
}


GET /categories → danh sách (kèm parent/children).
GET /categories/:slug → chi tiết theo slug.

Products (Sản phẩm)

POST /products (hiện chưa khóa quyền; nên chỉ dùng ở Admin UI)
Body (theo mẫu bạn đưa):

{
  "name": "Hộp bút Innate",
  "price": 3600000,
  "sku": "CV-P1",
  "description": "Mô tả...",
  "image": "https://.../image.jpg",
  "images": ["https://.../image.jpg", "https://.../image2.jpg"],
  "colors": [{ "name": "Đỏ gụ", "hex": "#8B2E2E" }, { "name": "Xanh rêu", "hex": "#235843" }],
  "specs": [
    { "label": "Chất liệu", "value": "Gỗ tự nhiên, hoàn thiện PU" },
    { "label": "Kích thước", "value": "320 × 120 × 80 mm" }
  ],
  "categories": ["<uuid: trang-tri-nha>", "<uuid: trung-bay>"]
}


GET /products → danh sách (kèm images, colors, specs, categories).
GET /products/:id → chi tiết 1 sản phẩm.

Ghi chú: v1 chưa có filter query. Nếu cần GET /products?category=slug mình thêm ngay (kèm phân trang).

Orders (Đơn hàng)

POST /orders
Body:

{
  "customerName": "Khách A",
  "customerEmail": "a@vd.com",
  "customerPhone": "09...",
  "customerDob": "YYYY-MM-DD",
  "shippingAddress": "địa chỉ...",
  "notes": "ghi chú...",
  "items": [
    { "productId": "<uuid-sp-1>", "qty": 1 },
    { "productId": "<uuid-sp-2>", "qty": 2 }
  ]
}


Response: đối tượng Order gồm items (snapshot giá), subtotal, shippingFee, total, createdAt…

GET /orders → danh sách đơn (đủ items).
GET /orders/:id → chi tiết đơn.

Mẫu gọi nhanh (fetch)
const BASE = 'http://localhost:4000/api';

// login
const login = await fetch(`${BASE}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type':'application/json' },
  body: JSON.stringify({ email:'admin@chamvan.local', password:'admin123' })
}).then(r=>r.json());

// categories
const cats = await fetch(`${BASE}/categories`).then(r=>r.json());

// create product (admin)
await fetch(`${BASE}/products`, {
  method:'POST',
  headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${login.accessToken}` },
  body: JSON.stringify({
    name:'Hộp bút Innate', price:3600000, sku:'CV-P1',
    description:'...', image:'https://...',
    images:['https://...','https://...'],
    colors:[{name:'Đỏ gụ',hex:'#8B2E2E'}],
    specs:[{label:'Chất liệu', value:'Gỗ tự nhiên'}],
    categories:['<uuid-trang-tri-nha>','<uuid-trung-bay>']
  })
});

Tóm tắt trạng thái bảo mật hiện tại

✅ JWT hoạt động: /users/me yêu cầu token.

⛑️ Routes admin (POST /categories, POST /products) hiện chưa khóa role. Nếu bạn muốn, mình sẽ thêm RolesGuard và gắn @Roles('admin'|'support_admin') cho các route này ngay, cùng filter GET /products?category=slug&page=&limit= cho FE.