// // //src/products/products.service.ts
// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { In, Repository } from 'typeorm';
// import { Product } from './product.entity';
// import { ProductImage } from './product-image.entity';
// import { ProductColor } from './product-color.entity';
// import { ProductSpec } from './product-spec.entity';
// import { Category } from '../categories/category.entity';
// import { CreateProductDto } from './dto/create-product.dto';

// type UpsertProductDto = CreateProductDto & { id?: number; slug?: string };

// function slugify(input: string): string {
//   return input
//     .normalize('NFD')                    // tách dấu khỏi ký tự gốc
//     .replace(/[\u0300-\u036f]/g, '')     // xóa toàn bộ dấu thanh/mũ/móc
//     .replace(/đ/g, 'd')
//     .replace(/Đ/g, 'd')
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, '-')         // mọi ký tự không phải a-z0-9 → "-"
//     .replace(/^-+|-+$/g, '')             // bỏ "-" đầu/cuối
//     .replace(/-{2,}/g, '-');             // gộp nhiều "-" liên tiếp
// }



// export type RecItem = {
//   id: number;
//   name: string;
//   slug?: string;
//   price: number;
//   image?: string;
//   sold?: number;
//   createdAt?: Date;
//   categories: { id: number; slug: string }[];
//   score?: number;
// };

// export type Recommendations = {
//   related: RecItem[];
//   suggested: RecItem[];
// };

// @Injectable()
// export class ProductsService {
//   constructor(
//     @InjectRepository(Product) private readonly repo: Repository<Product>,
//     @InjectRepository(ProductImage) private readonly imgRepo: Repository<ProductImage>,
//     @InjectRepository(ProductColor) private readonly colorRepo: Repository<ProductColor>,
//     @InjectRepository(ProductSpec) private readonly specRepo: Repository<ProductSpec>,
//     @InjectRepository(Category) private readonly cateRepo: Repository<Category>,
//   ) {}

//   // ====================== Helpers chung ======================

//   // Chuẩn hoá slug giống FE
//   private normalizeSlug(raw?: string, fallbackName?: string): string | undefined {
//     const base = (raw && raw.trim()) || (fallbackName && fallbackName.trim()) || '';
//     if (!base) return undefined;

//     const slug = base
//       .toLowerCase()
//       .normalize('NFD') // tách dấu
//       .replace(/[\u0300-\u036f]/g, '') // bỏ dấu
//       .replace(/đ/g, 'd')
//       .replace(/[^a-z0-9]+/g, '-') // còn lại → -
//       .replace(/^-+|-+$/g, '') // bỏ - đầu/cuối
//       .replace(/-{2,}/g, '-'); // gộp --

//     return slug || undefined;
//   }

//   // Lấy ảnh đại diện đầu tiên (Dùng cho List/Rec)
//   private pickFirstImage(p: Product & { images?: ProductImage[] }): string | undefined {
//     if (p.image) return p.image;
//     const imgs = p.images ?? [];
//     return imgs[0]?.url;
//   }

//   private normPrice(v: unknown): number {
//     const n = Number(v);
//     return Number.isFinite(n) ? n : 0;
//   }

//   // ====================== CRUD cơ bản ======================

//   // --- FIND ONE BY ID (Đã xác nhận lại relations) ---
//   async findOne(id: number) {
//     const item = await this.repo.findOne({
//       where: { id },
//       relations: { images: true, colors: true, specs: true, categories: true },
//     });
//     if (!item) throw new NotFoundException('Product not found');
//     return item;
//   }

//   // --- FIND ONE BY SLUG ---
//   async findBySlug(slug: string) {
//     const item = await this.repo.findOne({
//       where: { slug },
//       relations: { images: true, colors: true, specs: true, categories: true },
//     });
//     if (!item) throw new NotFoundException('Product not found');
//     return item;
//   }

//   // --- FIND ALL ---
//   async findAll() {
//     return this.repo.find({
//       relations: { images: true, colors: true, specs: true, categories: true },
//       order: { createdAt: 'DESC' },
//     });
//   }

//   // --- CREATE ---
//   async create(dto: CreateProductDto) {
//     const saved = await this.saveCoreAndChildren(dto);
//     return this.findOne(saved.id);
//   }

//   // --- UPDATE ---
//    async update(id: number, dto: CreateProductDto) {
//     const exists = await this.repo.findOne({ where: { id } });
//     if (!exists) throw new NotFoundException('Product not found');

//     const anyDto = dto as any;

//     const saved = await this.saveCoreAndChildren({
//       ...(anyDto as UpsertProductDto),
//       id,
//       // KHÔNG truyền slug nữa
//     } as UpsertProductDto);

//     return this.findOne(saved.id);
//   }



//   // --- REMOVE ---
//   async remove(id: number) {
//     const found = await this.repo.findOne({ where: { id } });
//     if (!found) throw new NotFoundException('Product not found');
//     await this.imgRepo.delete({ productId: id });
//     await this.colorRepo.delete({ productId: id });
//     await this.specRepo.delete({ productId: id });
//     await this.repo.delete(id);
//     return { success: true };
//   }

//   // ====================== Helpers Logic lưu ======================

//   // Logic lưu dữ liệu (core + children)
//   private async saveCoreAndChildren(input: UpsertProductDto): Promise<Product> {
//      const anyDto = input as any;
//   const id = input.id ? Number(input.id) : undefined;
//   const name = String(input.name ?? '').trim();

//   // Ưu tiên slug FE gửi, nếu không có thì dùng name
//   let slugSource = anyDto.slug ? String(anyDto.slug).trim() : '';
//   if (!slugSource && name) slugSource = name;

//   const slug = slugSource ? slugify(slugSource) : undefined;

//     // const rawImages: string[] = Array.isArray(anyDto.images) ? anyDto.images : [];
//     // const uniqueImages = [
//     //   ...new Set(
//     //     rawImages
//     //       .map((u) => String(u).trim())
//     //       .filter((u) => u && u.startsWith('http')),
//     //   ),
//     // ];


//     const rawImages: string[] = Array.isArray(anyDto.images) ? anyDto.images : [];
// const cleaned = rawImages
//   .map((u) => String(u).trim())
//   .filter((u) => /^(https?:\/\/|data:image\/)/i.test(u));

// const uniqueImages = [...new Set(cleaned)];


//     let image = input.image ? String(input.image).trim() : undefined;
//     if (!image && uniqueImages.length > 0) {
//       image = uniqueImages[0];
//     }

//     const price = String(anyDto.price ?? input.price ?? 0);
//     const sku = input.sku ? String(input.sku).trim() : undefined;
//     const description = input.description ? String(input.description).trim() : undefined;

//     const colors = Array.isArray(anyDto.colors) ? anyDto.colors : [];
//     const specs = Array.isArray(anyDto.specs) ? anyDto.specs : [];

//     const categoryIdsRaw = Array.isArray(anyDto.categories) ? anyDto.categories : [];
//     const categoryIds = (categoryIdsRaw || [])
//       .map((v: any) => Number(v))
//       .filter((v: number) => Number.isFinite(v));
//     const categories = categoryIds.length
//       ? await this.cateRepo.find({ where: { id: In(categoryIds) } })
//       : [];

//     const stock = Math.max(0, parseInt(String(anyDto.stock ?? 0)) || 0);
//     const sold = Math.max(0, parseInt(String(anyDto.sold ?? 0)) || 0);
//     const status =
//       String(anyDto.status ?? 'open').toLowerCase() === 'closed' ? 'closed' : 'open';

//     const core = this.repo.create({
//       ...(id ? { id } : {}),
//       name,
//       slug,
//       price,
//       sku,
//       description,
//       image,
//       stock,
//       sold,
//       status,
//       categories,
//     } as Partial<Product>);

//     const saved = await this.repo.save(core as any);

//     // Xóa cũ thêm mới (Ảnh gallery)
//     await this.imgRepo.delete({ productId: saved.id });
//     if (uniqueImages.length) {
//       const entities = uniqueImages.map((url) =>
//         this.imgRepo.create({ url: url.trim(), productId: saved.id }),
//       );
//       await this.imgRepo.save(entities);
//     }

//     // Colors
//     await this.colorRepo.delete({ productId: saved.id });
//     if (colors.length) {
//       const entities = colors
//         .filter((c: any) => c && c.name)
//         .map((c: any) =>
//           this.colorRepo.create({
//             name: c.name.trim(),
//             hex: c.hex,
//             productId: saved.id,
//           }),
//         );
//       if (entities.length) await this.colorRepo.save(entities);
//     }

//     // Specs
//     await this.specRepo.delete({ productId: saved.id });
//     if (specs.length) {
//       const entities = specs
//         .filter((s: any) => s && s.label && s.value)
//         .map((s: any) =>
//           this.specRepo.create({
//             label: s.label,
//             value: s.value,
//             productId: saved.id,
//           }),
//         );
//       if (entities.length) await this.specRepo.save(entities);
//     }

//     return saved;
//   }

//   // ====================== RECOMMENDATIONS ======================

//   async getRecommendations(id: number | string, limit = 12): Promise<Recommendations> {
//     const pid = Number(id);
//     const product = await this.repo.findOne({
//       where: { id: pid },
//       relations: { categories: true, images: true },
//     });
//     if (!product) throw new NotFoundException('Product not found');

//     const price0 = this.normPrice(product.price);
//     const catIds = (product.categories ?? []).map((c) => c.id);

//     const qb1 = this.repo
//       .createQueryBuilder('p')
//       .leftJoinAndSelect('p.categories', 'c')
//       .leftJoinAndSelect('p.images', 'imgs')
//       .where('p.id <> :id', { id: pid })
//       .andWhere('p.status = :st', { st: 'open' })
//       .andWhere(catIds.length ? 'c.id IN (:...catIds)' : '1=1', { catIds })
//       .andWhere('p.price BETWEEN :min AND :max', {
//         min: price0 * 0.8,
//         max: price0 * 1.25,
//       });

//     const candidates1 = await qb1.getMany();

//     let candidates2: Product[] = [];
//     if (candidates1.length < limit) {
//       const qb2 = this.repo
//         .createQueryBuilder('p')
//         .leftJoinAndSelect('p.categories', 'c')
//         .leftJoinAndSelect('p.images', 'imgs')
//         .where('p.id <> :id', { id: pid })
//         .andWhere('p.status = :st', { st: 'open' })
//         .andWhere(catIds.length ? 'c.id IN (:...catIds)' : '1=1', { catIds })
//         .andWhere('p.price BETWEEN :min AND :max', {
//           min: price0 * 0.6,
//           max: price0 * 1.5,
//         });

//       candidates2 = await qb2.getMany();
//     }

//     let candidates3: Product[] = [];
//     if (candidates1.length + candidates2.length < limit) {
//       candidates3 = await this.repo.find({
//         where: { status: 'open' },
//         order: { sold: 'DESC', createdAt: 'DESC' },
//         take: limit * 2,
//         relations: { categories: true, images: true },
//       });
//     }

//     const pool: Product[] = [];
//     const seen = new Set<number>();
//     [candidates1, candidates2, candidates3].forEach((list) =>
//       list.forEach((p) => {
//         if (!seen.has(p.id)) {
//           seen.add(p.id);
//           pool.push(p);
//         }
//       }),
//     );

//     const maxSold = Math.max(1, ...pool.map((p) => p.sold || 0));
//     const related: RecItem[] = pool
//       .map((p) => {
//         const price = this.normPrice(p.price);
//         const shared = (p.categories ?? []).some((c) => catIds.includes(c.id));
//         const delta = Math.abs(price - price0);
//         const priceScore = 30 * Math.exp(-Math.pow(delta / (0.25 * (price0 || 1)), 2));
//         const soldScore = 20 * ((p.sold || 0) / maxSold);
//         const freshScore = 10;
//         const catScore = shared ? 40 : 0;

//         return {
//           id: p.id,
//           name: p.name,
//           slug: p.slug,
//           price,
//           image: this.pickFirstImage(p),
//           sold: p.sold,
//           createdAt: p.createdAt,
//           categories: (p.categories || []).map((c) => ({ id: c.id, slug: c.slug })),
//           score: catScore + priceScore + soldScore + freshScore,
//         };
//       })
//       .sort((a, b) => (b.score || 0) - (a.score || 0))
//       .slice(0, limit);

//     const sameGroup = await this.repo
//       .createQueryBuilder('p')
//       .leftJoinAndSelect('p.categories', 'c')
//       .leftJoinAndSelect('p.images', 'imgs')
//       .where('p.id <> :id', { id: pid })
//       .andWhere('p.status = :st', { st: 'open' })
//       .andWhere(catIds.length ? 'c.id IN (:...catIds)' : '1=1', { catIds })
//       .orderBy('p.createdAt', 'DESC')
//       .take(24)
//       .getMany();

//     const topSellers = await this.repo.find({
//       where: { status: 'open' },
//       order: { sold: 'DESC', createdAt: 'DESC' },
//       take: 24,
//       relations: { categories: true, images: true },
//     });

//     const seenSug = new Set<number>([pid]);
//     const pick = (arr: Product[], take: number) => {
//       const out: RecItem[] = [];
//       for (const p of arr) {
//         if (!seenSug.has(p.id)) {
//           seenSug.add(p.id);
//           out.push({
//             id: p.id,
//             name: p.name,
//             slug: p.slug,
//             price: this.normPrice(p.price),
//             image: this.pickFirstImage(p),
//             sold: p.sold,
//             createdAt: p.createdAt,
//             categories: (p.categories || []).map((c) => ({ id: c.id, slug: c.slug })),
//           });
//         }
//         if (out.length >= take) break;
//       }
//       return out;
//     };

//     const takeTotal = Math.min(Math.max(4, limit), 24);
//     const sug50 = Math.ceil(takeTotal * 0.5);
//     const suggested = [
//       ...pick(sameGroup, sug50),
//       ...pick(topSellers, takeTotal - sug50),
//     ].slice(0, takeTotal);

//     return { related, suggested };
//   }
// }






// src/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from './product.entity';
import { ProductImage } from './product-image.entity';
import { ProductColor } from './product-color.entity';
import { ProductSpec } from './product-spec.entity';
import { Category } from '../categories/category.entity';
import { CreateProductDto } from './dto/create-product.dto';

type UpsertProductDto = CreateProductDto & { id?: number };

export type RecItem = {
  id: number;
  name: string;
  slug?: string;
  price: number;
  image?: string;
  sold?: number;
  createdAt?: Date;
  categories: { id: number; slug: string }[];
  score?: number;
};

export type Recommendations = {
  related: RecItem[];
  suggested: RecItem[];
};

// Hỗ trợ cả URL http(s) và base64 data:image/...
const IMG_RE = /^(https?:\/\/|data:image\/)/i;

function slugify(input: string): string {
  // Giữ slug “ổn định” cho tiếng Việt: bỏ dấu, đ/Đ -> d, chuẩn hoá '-'
  return String(input || '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function cleanImg(v: any): string {
  return String(v ?? '').trim();
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly repo: Repository<Product>,
    @InjectRepository(ProductImage) private readonly imgRepo: Repository<ProductImage>,
    @InjectRepository(ProductColor) private readonly colorRepo: Repository<ProductColor>,
    @InjectRepository(ProductSpec) private readonly specRepo: Repository<ProductSpec>,
    @InjectRepository(Category) private readonly cateRepo: Repository<Category>,
  ) {}

  // --- FIND ONE BY ID ---
  async findOne(id: number) {
    const item = await this.repo.findOne({
      where: { id },
      relations: { images: true, colors: true, specs: true, categories: true },
    });
    if (!item) throw new NotFoundException('Product not found');
    return item;
  }

  // --- FIND ONE BY SLUG ---
  async findBySlug(slug: string) {
    const item = await this.repo.findOne({
      where: { slug },
      relations: { images: true, colors: true, specs: true, categories: true },
    });
    if (!item) throw new NotFoundException('Product not found');
    return item;
  }

  // --- FIND ALL ---
  async findAll() {
    return this.repo.find({
      relations: { images: true, colors: true, specs: true, categories: true },
      order: { createdAt: 'DESC' },
    });
  }

  // --- CREATE ---
  async create(dto: CreateProductDto) {
    const saved = await this.saveCoreAndChildren(dto);
    return this.findOne(saved.id);
  }

  // --- UPDATE ---
  async update(id: number, dto: CreateProductDto) {
    const exists = await this.repo.findOne({ where: { id } });
    if (!exists) throw new NotFoundException('Product not found');

    const saved = await this.saveCoreAndChildren({ ...(dto as any), id } as UpsertProductDto);
    return this.findOne(saved.id);
  }

  // --- REMOVE ---
  async remove(id: number) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Product not found');

    await this.imgRepo.delete({ productId: id });
    await this.colorRepo.delete({ productId: id });
    await this.specRepo.delete({ productId: id });
    await this.repo.delete(id);

    return { success: true };
  }

  // ====================== Helpers ======================

  // Lấy ảnh đại diện đầu tiên (Dùng cho List/Rec)
  private pickFirstImage(p: Product & { images?: ProductImage[] }): string | undefined {
    if (p.image) return p.image;
    const imgs = p.images ?? [];
    return imgs[0]?.url;
  }

  private normPrice(v: unknown): number {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  // ====================== Save core + children ======================

  private async saveCoreAndChildren(input: UpsertProductDto): Promise<Product> {
    const anyDto = input as any;

    const id = input.id ? Number(input.id) : undefined;
    const name = String(input.name ?? '').trim();

    // Slug: ưu tiên dto.slug nếu có, không có thì lấy theo name (fix tiếng Việt)
    const slugSource = (anyDto.slug ? String(anyDto.slug).trim() : '') || name;
    const slug = slugSource ? slugify(slugSource) : undefined;

    // ====== IMAGES (FIX CHÍNH) ======
    // - Nhận cả http(s) và data:image/
    // - Loại rác, trim, unique
    const rawImages: string[] = Array.isArray(anyDto.images) ? anyDto.images : [];
    const uniqueImages = [
      ...new Set(
        rawImages
          .map((u) => cleanImg(u))
          .filter((u) => u && IMG_RE.test(u)),
      ),
    ];

    // image (ảnh đại diện): chấp nhận http(s) hoặc data:image/
    let image = input.image ? cleanImg(input.image) : undefined;
    if (image && !IMG_RE.test(image)) image = undefined;

    // nếu chưa có image thì lấy ảnh đầu tiên từ gallery
    if (!image && uniqueImages.length > 0) image = uniqueImages[0];

    // đảm bảo ảnh đại diện cũng nằm trong gallery để user list luôn có ảnh đúng
    if (image && !uniqueImages.includes(image)) uniqueImages.unshift(image);

    // ====== FIELDS KHÁC (GIỮ NGUYÊN LOGIC) ======
    const price = String(anyDto.price ?? input.price ?? 0);
    const sku = input.sku ? String(input.sku).trim() : undefined;
    const description = input.description ? String(input.description).trim() : undefined;

    const colors = Array.isArray(anyDto.colors) ? anyDto.colors : [];
    const specs = Array.isArray(anyDto.specs) ? anyDto.specs : [];

    const categoryIdsRaw = Array.isArray(anyDto.categories) ? anyDto.categories : [];
    const categoryIds = (categoryIdsRaw || [])
      .map((v: any) => Number(v))
      .filter((v: number) => Number.isFinite(v));

    const categories = categoryIds.length
      ? await this.cateRepo.find({ where: { id: In(categoryIds) } })
      : [];

    const stock = Math.max(0, parseInt(String(anyDto.stock ?? 0), 10) || 0);
    const sold = Math.max(0, parseInt(String(anyDto.sold ?? 0), 10) || 0);
    const status = String(anyDto.status ?? 'open').toLowerCase() === 'closed' ? 'closed' : 'open';

    const core = this.repo.create({
      ...(id ? { id } : {}),
      name,
      slug,
      price,
      sku,
      description,
      image,
      stock,
      sold,
      status,
      categories,
    } as Partial<Product>);

    const saved = await this.repo.save(core as any);

    // ====== CHILD TABLES (GIỮ NGUYÊN) ======

    // Gallery images
    await this.imgRepo.delete({ productId: saved.id });
    if (uniqueImages.length) {
      const entities = uniqueImages.map((url) =>
        this.imgRepo.create({ url: url.trim(), productId: saved.id }),
      );
      await this.imgRepo.save(entities);
    }

    // Colors
    await this.colorRepo.delete({ productId: saved.id });
    if (colors.length) {
      const entities = colors
        .filter((c: any) => c && c.name)
        .map((c: any) =>
          this.colorRepo.create({
            name: String(c.name).trim(),
            hex: c.hex,
            productId: saved.id,
          }),
        );
      if (entities.length) await this.colorRepo.save(entities);
    }

    // Specs
    await this.specRepo.delete({ productId: saved.id });
    if (specs.length) {
      const entities = specs
        .filter((s: any) => s && s.label && s.value)
        .map((s: any) =>
          this.specRepo.create({
            label: String(s.label).trim(),
            value: String(s.value).trim(),
            productId: saved.id,
          }),
        );
      if (entities.length) await this.specRepo.save(entities);
    }

    return saved;
  }

  // --- RECOMMENDATIONS (GIỮ NGUYÊN LOGIC CŨ) ---
  async getRecommendations(id: number | string, limit = 12): Promise<Recommendations> {
    const pid = Number(id);
    const product = await this.repo.findOne({
      where: { id: pid },
      relations: { categories: true, images: true },
    });
    if (!product) throw new NotFoundException('Product not found');

    const price0 = this.normPrice(product.price);
    const catIds = (product.categories ?? []).map((c) => c.id);

    const qb1 = this.repo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.categories', 'c')
      .leftJoinAndSelect('p.images', 'imgs')
      .where('p.id <> :id', { id: pid })
      .andWhere('p.status = :st', { st: 'open' })
      .andWhere(catIds.length ? 'c.id IN (:...catIds)' : '1=1', { catIds })
      .andWhere('p.price BETWEEN :min AND :max', { min: price0 * 0.8, max: price0 * 1.25 });

    const candidates1 = await qb1.getMany();

    let candidates2: Product[] = [];
    if (candidates1.length < limit) {
      const qb2 = this.repo
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.categories', 'c')
        .leftJoinAndSelect('p.images', 'imgs')
        .where('p.id <> :id', { id: pid })
        .andWhere('p.status = :st', { st: 'open' })
        .andWhere(catIds.length ? 'c.id IN (:...catIds)' : '1=1', { catIds })
        .andWhere('p.price BETWEEN :min AND :max', { min: price0 * 0.6, max: price0 * 1.5 });

      candidates2 = await qb2.getMany();
    }

    let candidates3: Product[] = [];
    if (candidates1.length + candidates2.length < limit) {
      candidates3 = await this.repo.find({
        where: { status: 'open' },
        order: { sold: 'DESC', createdAt: 'DESC' },
        take: limit * 2,
        relations: { categories: true, images: true },
      });
    }

    const pool: Product[] = [];
    const seen = new Set<number>();
    [candidates1, candidates2, candidates3].forEach((list) =>
      list.forEach((p) => {
        if (!seen.has(p.id)) {
          seen.add(p.id);
          pool.push(p);
        }
      }),
    );

    const maxSold = Math.max(1, ...pool.map((p) => p.sold || 0));

    const related: RecItem[] = pool
      .map((p) => {
        const price = this.normPrice(p.price);
        const shared = (p.categories ?? []).some((c) => catIds.includes(c.id));
        const delta = Math.abs(price - price0);
        const priceScore = 30 * Math.exp(-Math.pow(delta / (0.25 * (price0 || 1)), 2));
        const soldScore = 20 * ((p.sold || 0) / maxSold);
        const freshScore = 10;
        const catScore = shared ? 40 : 0;

        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          price,
          image: this.pickFirstImage(p),
          sold: p.sold,
          createdAt: p.createdAt,
          categories: (p.categories || []).map((c) => ({ id: c.id, slug: c.slug })),
          score: catScore + priceScore + soldScore + freshScore,
        };
      })
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, limit);

    const sameGroup = await this.repo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.categories', 'c')
      .leftJoinAndSelect('p.images', 'imgs')
      .where('p.id <> :id', { id: pid })
      .andWhere('p.status = :st', { st: 'open' })
      .andWhere(catIds.length ? 'c.id IN (:...catIds)' : '1=1', { catIds })
      .orderBy('p.createdAt', 'DESC')
      .take(24)
      .getMany();

    const topSellers = await this.repo.find({
      where: { status: 'open' },
      order: { sold: 'DESC', createdAt: 'DESC' },
      take: 24,
      relations: { categories: true, images: true },
    });

    const seenSug = new Set<number>([pid]);
    const pick = (arr: Product[], take: number) => {
      const out: RecItem[] = [];
      for (const p of arr) {
        if (!seenSug.has(p.id)) {
          seenSug.add(p.id);
          out.push({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: this.normPrice(p.price),
            image: this.pickFirstImage(p),
            sold: p.sold,
            createdAt: p.createdAt,
            categories: (p.categories || []).map((c) => ({ id: c.id, slug: c.slug })),
          });
        }
        if (out.length >= take) break;
      }
      return out;
    };

    const takeTotal = Math.min(Math.max(4, limit), 24);
    const sug50 = Math.ceil(takeTotal * 0.5);
    const suggested = [...pick(sameGroup, sug50), ...pick(topSellers, takeTotal - sug50)].slice(0, takeTotal);

    return { related, suggested };
  }
}
