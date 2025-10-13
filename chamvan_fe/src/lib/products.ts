export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  tags?: string[]; // ví dụ: ['hang-moi','qua-tang','phong-tho',...]
};

export const ALL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Bình trang trí cổ điển',
    price: 1200000,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
    tags: ['hang-moi','qua-tang','phong-khach'],
  },
  { id: 2, name: 'Hộp gỗ mỹ nghệ', price: 900000, image: 'https://images.unsplash.com/photo-1523861751938-12104e498b76?q=80&w=800&auto=format&fit=crop', tags: ['qua-tang','trung-bay'] },
  { id: 3, name: 'Tượng nhỏ phong thủy', price: 650000, image: 'https://images.unsplash.com/photo-1600486913747-55e0876a2e62?q=80&w=800&auto=format&fit=crop', tags: ['phong-thuy','trang-tri'] },
  { id: 4, name: 'Đèn gỗ ấm áp', price: 1750000, image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop', tags: ['phong-khach','hang-moi'] },
  { id: 5, name: 'Khay gỗ sơn mài', price: 850000, image: 'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=800&auto=format&fit=crop', tags: ['trang-tri','trung-bay'] },
  { id: 6, name: 'Lư hương phòng thờ', price: 2200000, image: 'https://images.unsplash.com/photo-1549187774-b4e9b0445b41?q=80&w=800&auto=format&fit=crop', tags: ['phong-tho'] },
  { id: 7, name: 'Bộ cờ gỗ thủ công', price: 2700000, image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800&auto=format&fit=crop', tags: ['qua-tang','trung-bay'] },
  { id: 8, name: 'Tượng nghệ nhân chạm khắc', price: 3900000, image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=800&auto=format&fit=crop', tags: ['trung-bay','phong-thuy'] },
];

export const byTag = (tag: string) => ALL_PRODUCTS.filter(p => p.tags?.includes(tag));
