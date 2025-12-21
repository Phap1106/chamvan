
// // src/products/products.service.ts
// import {
//   BadRequestException,
//   Injectable,
//   InternalServerErrorException,
//   NotFoundException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { In, Repository } from 'typeorm';

// import { Product } from './product.entity';
// import { ProductImage } from './product-image.entity';
// import { ProductColor } from './product-color.entity';
// import { ProductSpec } from './product-spec.entity';
// import { Category } from '../categories/category.entity';
// import { CreateProductDto } from './dto/create-product.dto';

// type UpsertProductDto = CreateProductDto & { id?: number; slug?: string };

// /* =================== helpers =================== */
// function safeTrim(v: any): string {
//   return String(v ?? '').trim();
// }

// function slugify(input: string): string {
//   return safeTrim(input)
//     .normalize('NFD')
//     .replace(/[\u0300-\u036f]/g, '')
//     .replace(/đ/g, 'd')
//     .replace(/Đ/g, 'd')
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, '-')
//     .replace(/^-+|-+$/g, '')
//     .slice(0, 240);
// }

// /** ===== money utils ===== */
// function toMoney(v: any): number {
//   if (v === null || v === undefined) return 0;
//   if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
//   const s = String(v).trim().replace(/\s+/g, '').replace(/,/g, '');
//   const n = Number(s);
//   return Number.isFinite(n) ? n : 0;
// }
// function calcDiscountPercent(original: number, price: number): number {
//   if (!(original > 0) || !(price > 0) || price >= original) return 0;
//   const pct = Math.round((1 - price / original) * 100);
//   return Math.max(0, Math.min(99, pct));
// }
// function normalizePricing(dto: any) {
//   const price = toMoney(dto?.price);
//   const original =
//     dto?.original_price === null || dto?.original_price === undefined
//       ? null
//       : toMoney(dto?.original_price);

//   const originalOk = original && original > price ? original : null;
//   const discount = originalOk ? calcDiscountPercent(originalOk, price) : 0;

//   return {
//     price: price.toFixed(2),
//     original_price: originalOk ? originalOk.toFixed(2) : null,
//     discount_percent: discount,
//   };
// }

// /** ===== images input can be string OR object ===== */
// function pickUrl(x: any): string | null {
//   if (!x) return null;
//   if (typeof x === 'string') return x.trim();
//   if (typeof x === 'object') {
//     const u = x.url || x.href || x.src || x.path;
//     return u ? String(u).trim() : null;
//   }
//   return null;
// }
// function isAllowedImageUrl(u: string) {
//   return (
//     u.startsWith('http://') ||
//     u.startsWith('https://') ||
//     u.startsWith('/uploads/') ||
//     u.startsWith('/uploads')
//   );
// }
// function uniqueImageUrls(arr: any[]): string[] {
//   const out: string[] = [];
//   const seen = new Set<string>();
//   for (const item of arr || []) {
//     const u = pickUrl(item);
//     if (!u) continue;
//     if (!isAllowedImageUrl(u)) continue;
//     if (seen.has(u)) continue;
//     seen.add(u);
//     out.push(u);
//   }
//   return out;
// }

// /** ===== categories normalize =====
//  * FE có thể gửi:
//  * - categoryIds: number[]
//  * - categories: number[] (curl của bạn)
//  */
// function normalizeCategoryIds(dto: any): number[] {
//   const raw = dto?.categoryIds ?? dto?.categories ?? [];
//   const arr = Array.isArray(raw) ? raw : [];
//   const ids = arr
//     .map((x: any) => Number(String(x).trim()))
//     .filter((n: number) => Number.isFinite(n) && n > 0);
//   return Array.from(new Set(ids));
// }

// /** ===== error detect ===== */
// function isTypeOrmQueryError(e: any) {
//   return !!(e && (e.name === 'QueryFailedError' || e.code || e.sqlState));
// }
// function mapDbErrorToHttp(e: any) {
//   // duplicate key => 400
//   if (e?.code === 'ER_DUP_ENTRY') {
//     return new BadRequestException('Dữ liệu bị trùng (duplicate key)');
//   }
//   // null/default field => 400 (trường bắt buộc)
//   if (e?.code === 'ER_BAD_NULL_ERROR' || e?.code === 'ER_NO_DEFAULT_FOR_FIELD') {
//     return new BadRequestException('Thiếu dữ liệu bắt buộc (DB reject)');
//   }
//   return new InternalServerErrorException('Lỗi cơ sở dữ liệu khi lưu sản phẩm');
// }

// /* =================== service =================== */
// @Injectable()
// export class ProductsService {
//   constructor(
//     @InjectRepository(Product) private readonly repo: Repository<Product>,
//     @InjectRepository(ProductImage) private readonly imgRepo: Repository<ProductImage>,
//     @InjectRepository(ProductColor) private readonly colorRepo: Repository<ProductColor>,
//     @InjectRepository(ProductSpec) private readonly specRepo: Repository<ProductSpec>,
//     @InjectRepository(Category) private readonly catRepo: Repository<Category>,
//   ) {}

//   async create(dto: CreateProductDto) {
//     return this.upsert({ ...(dto as any) });
//   }

//   async update(id: number, dto: CreateProductDto) {
//     const existing = await this.repo.findOne({ where: { id } });
//     if (!existing) throw new NotFoundException('Không tìm thấy sản phẩm');
//     return this.upsert({ ...(dto as any), id });
//   }

//   async remove(id: number) {
//     const p = await this.repo.findOne({ where: { id } });
//     if (!p) throw new NotFoundException('Không tìm thấy sản phẩm');

//     // xoá children trước
//     await this.imgRepo.delete({ productId: id } as any);
//     await this.colorRepo.delete({ productId: id } as any);
//     await this.specRepo.delete({ productId: id } as any);

//     await this.repo.remove(p);
//   }

//   async findAll() {
//     try {
//       return await this.repo.find({
//         order: { id: 'DESC' } as any,
//         relations: ['images', 'colors', 'specs', 'categories'] as any,
//       });
//     } catch {
//       return await this.repo.find({
//         order: { id: 'DESC' } as any,
//         relations: ['images', 'colors', 'specs'] as any,
//       });
//     }
//   }

//   async findOne(id: number) {
//     let p: any;
//     try {
//       p = await this.repo.findOne({
//         where: { id } as any,
//         relations: ['images', 'colors', 'specs', 'categories'] as any,
//       });
//     } catch {
//       p = await this.repo.findOne({
//         where: { id } as any,
//         relations: ['images', 'colors', 'specs'] as any,
//       });
//     }
//     if (!p) throw new NotFoundException('Không tìm thấy sản phẩm');
//     return p;
//   }

//   async findBySlug(slug: string) {
//     const s = safeTrim(slug);
//     if (!s) throw new BadRequestException('Thiếu slug');

//     let p: any;
//     try {
//       p = await this.repo.findOne({
//         where: { slug: s } as any,
//         relations: ['images', 'colors', 'specs', 'categories'] as any,
//       });
//     } catch {
//       p = await this.repo.findOne({
//         where: { slug: s } as any,
//         relations: ['images', 'colors', 'specs'] as any,
//       });
//     }

//     if (!p) throw new NotFoundException('Không tìm thấy sản phẩm');
//     return p;
//   }

//   async getRecommendations(id: number, limit = 12) {
//     const current = await this.repo.findOne({ where: { id } });
//     if (!current) throw new NotFoundException('Không tìm thấy sản phẩm');

//     const n = Math.min(24, Math.max(4, Number(limit) || 12));
//     return this.repo
//       .createQueryBuilder('p')
//       .where('p.id != :id', { id })
//       .orderBy('p.id', 'DESC')
//       .limit(n)
//       .getMany();
//   }

//   /** ======= core upsert ======= */
//   async upsert(dto: UpsertProductDto) {
//     try {
//       const anyDto = dto as any;

//       // ===== validate 400 =====
//       const name = safeTrim(anyDto?.name);
//       if (!name) throw new BadRequestException('Thiếu tên sản phẩm (name)');

//       const statusRaw = safeTrim(anyDto?.status) || 'open';
//       if (statusRaw !== 'open' && statusRaw !== 'closed') {
//         throw new BadRequestException('Trạng thái (status) chỉ nhận open | closed');
//       }
//       const status = statusRaw as 'open' | 'closed';

//       const stock = Number(anyDto?.stock ?? 0);
//       const sold = Number(anyDto?.sold ?? 0);
//       if (!Number.isFinite(stock) || stock < 0) {
//         throw new BadRequestException('Tồn kho (stock) phải là số >= 0');
//       }
//       if (!Number.isFinite(sold) || sold < 0) {
//         throw new BadRequestException('Đã bán (sold) phải là số >= 0');
//       }

//       // ===== pricing =====
//       const pricing = normalizePricing(anyDto);
//       if (!Number.isFinite(Number(pricing.price)) || Number(pricing.price) < 0) {
//         throw new BadRequestException('Giá bán (price) không hợp lệ');
//       }

//       // ===== images =====
//       const images = uniqueImageUrls(anyDto?.images || []);
//       const imageInput = safeTrim(anyDto?.image);
//       const mainImage =
//         imageInput && isAllowedImageUrl(imageInput) ? imageInput : images[0] || null;

//       // đảm bảo mainImage nằm trong images
//       const gallery = mainImage ? uniqueImageUrls([mainImage, ...images]) : images;

//       // ===== slug =====
//       const slugRaw = safeTrim(anyDto?.slug);
//       const slug = slugRaw ? slugify(slugRaw) : slugify(name);

//       // ===== categories (optional) =====
//       const categoryIds = normalizeCategoryIds(anyDto);
//       const categories =
//         categoryIds.length > 0
//           ? await this.catRepo.find({ where: { id: In(categoryIds) } })
//           : [];

//       // ===== save product =====
//       const entity = this.repo.create({
//         ...(anyDto?.id ? { id: Number(anyDto.id) } : {}),
//         name,
//         slug,
//         price: pricing.price,
//         original_price: pricing.original_price,
//         discount_percent: pricing.discount_percent,
//         sku: safeTrim(anyDto?.sku) || null,
//         stock: Math.trunc(stock) || 0,
//         sold: Math.trunc(sold) || 0,
//         status,
//         description: anyDto?.description ?? null,
//         image: mainImage,
//         categories: categories as any,
//       } as any);

//       const saved = await this.repo.save(entity as any);

//       // ===== replace children (tương thích productId hoặc product relation) =====
//       const productRef = { id: saved.id };

//       await this.imgRepo.delete({ productId: saved.id } as any);
//       if (gallery.length) {
//         const rows = gallery.map((u) =>
//           this.imgRepo.create({
//             productId: saved.id,
//             product: productRef,
//             url: u,
//           } as any),
//         );
//         await this.imgRepo.save(rows as any);
//       }

//       await this.colorRepo.delete({ productId: saved.id } as any);
//       if (Array.isArray(anyDto?.colors) && anyDto.colors.length) {
//         const rows = anyDto.colors
//           .filter((c: any) => safeTrim(c?.name))
//           .map((c: any) =>
//             this.colorRepo.create({
//               productId: saved.id,
//               product: productRef,
//               name: safeTrim(c.name),
//               hex: safeTrim(c?.hex) || null,
//             } as any),
//           );
//         if (rows.length) await this.colorRepo.save(rows as any);
//       }

//       await this.specRepo.delete({ productId: saved.id } as any);
//       if (Array.isArray(anyDto?.specs) && anyDto.specs.length) {
//         const rows = anyDto.specs
//           .filter((s: any) => safeTrim(s?.label) && safeTrim(s?.value))
//           .map((s: any) =>
//             this.specRepo.create({
//               productId: saved.id,
//               product: productRef,
//               label: safeTrim(s.label),
//               value: safeTrim(s.value),
//             } as any),
//           );
//         if (rows.length) await this.specRepo.save(rows as any);
//       }

//       return this.findOne(saved.id);
//     } catch (e: any) {
//       // pass-through 400/404
//       if (e?.status && typeof e.status === 'number') throw e;

//       // DB/system -> 500 (hoặc map 400 với lỗi DB rõ)
//       if (isTypeOrmQueryError(e)) throw mapDbErrorToHttp(e);

//       throw new InternalServerErrorException(
//         e?.message ? `Internal server error: ${e.message}` : 'Internal server error',
//       );
//     }
//   }
// }













// src/products/products.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, In, Repository } from 'typeorm';

import { Product } from './product.entity';
import { ProductImage } from './product-image.entity';
import { ProductColor } from './product-color.entity';
import { ProductSpec } from './product-spec.entity';
import { Category } from '../categories/category.entity';
import { CreateProductDto } from './dto/create-product.dto';

type UpsertProductDto = CreateProductDto & { id?: number };

function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function safeTrim(v: any) {
  const s = typeof v === 'string' ? v.trim() : '';
  return s || '';
}

function toMoney(v: any): number {
  const n = Number(String(v ?? '').replace(/[^\d.-]/g, ''));
  if (!Number.isFinite(n)) return 0;
  return n;
}

function calcDiscountPercent(original: number, price: number) {
  if (!original || original <= 0) return 0;
  if (!price || price <= 0) return 0;
  if (price >= original) return 0;
  return Math.round(((original - price) / original) * 100);
}

function normalizePricing(dto: any) {
  const price = toMoney(dto?.price);

  const original =
    dto?.original_price === null || dto?.original_price === undefined
      ? null
      : toMoney(dto?.original_price);

  const originalOk = original && original > price ? original : null;
  const discount = originalOk ? calcDiscountPercent(originalOk, price) : 0;

  return {
    // DB decimal -> luôn lưu string "x.xx"
    price: price.toFixed(2),
    original_price: originalOk ? originalOk.toFixed(2) : null,
    discount_percent: discount,
  };
}

/** ===== images input must be URL/path only (NO base64) ===== */
function ensureNotBase64(u: string) {
  if (u?.startsWith('data:image/')) {
    throw new BadRequestException(
      'Ảnh không hợp lệ: vui lòng upload để lấy URL (/uploads/...) thay vì base64',
    );
  }
}
function isAllowedImageUrl(u: string) {
  if (!u) return false;
  if (u.startsWith('data:image/')) return false;
  return u.startsWith('http://') || u.startsWith('https://') || u.startsWith('/uploads/');
}
function uniqueImageUrls(arr: any[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of arr || []) {
    if (typeof item !== 'string') continue;
    const u = item.trim();
    if (!u) continue;
    ensureNotBase64(u);
    if (!isAllowedImageUrl(u)) continue;
    if (seen.has(u)) continue;
    seen.add(u);
    out.push(u);
  }
  return out;
}

/** ===== categories normalize (FE có thể gửi categories hoặc categoryIds) ===== */
function normalizeCategoryIds(dto: any): number[] {
  const raw = dto?.categoryIds ?? dto?.categories ?? [];
  const arr = Array.isArray(raw) ? raw : [];
  const ids = arr
    .map((x) => Number(x))
    .filter((n) => Number.isFinite(n) && n > 0);
  return [...new Set(ids)];
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly repo: Repository<Product>,
    @InjectRepository(ProductImage) private readonly imageRepo: Repository<ProductImage>,
    @InjectRepository(ProductColor) private readonly colorRepo: Repository<ProductColor>,
    @InjectRepository(ProductSpec) private readonly specRepo: Repository<ProductSpec>,
    @InjectRepository(Category) private readonly catRepo: Repository<Category>,
  ) {}

  async findAll(opts?: { q?: string; category?: string }) {
    const qb = this.repo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.images', 'images')
      .leftJoinAndSelect('p.colors', 'colors')
      .leftJoinAndSelect('p.specs', 'specs')
      .leftJoinAndSelect('p.categories', 'categories')
      .orderBy('p.id', 'DESC');

    if (opts?.q) {
      qb.andWhere('(p.name LIKE :q OR p.slug LIKE :q)', { q: `%${opts.q}%` });
    }
    if (opts?.category) {
      qb.andWhere('categories.slug = :slug', { slug: opts.category });
    }

    return qb.getMany();
  }

  async findOne(id: number) {
    const p = await this.repo.findOne({
      where: { id },
      relations: ['images', 'colors', 'specs', 'categories'],
    });
    if (!p) throw new NotFoundException('Không tìm thấy sản phẩm');
    return p;
  }

  async findBySlug(slug: string) {
    const p = await this.repo.findOne({
      where: { slug },
      relations: ['images', 'colors', 'specs', 'categories'],
    });
    if (!p) throw new NotFoundException('Không tìm thấy sản phẩm');
    return p;
  }

  async create(dto: CreateProductDto) {
    return this.saveCoreAndChildren(dto);
  }

  async update(id: number, dto: CreateProductDto) {
    const exist = await this.repo.findOne({
      where: { id },
      relations: ['images', 'colors', 'specs', 'categories'],
    });
    if (!exist) throw new NotFoundException('Không tìm thấy sản phẩm');
    return this.saveCoreAndChildren({ ...(dto as any), id }, exist);
  }


async remove(id: number) {
  // Dùng transaction để tránh trạng thái nửa xóa nửa còn
  return this.repo.manager.transaction(async (em) => {
    const productRepo = em.getRepository(Product);
    const imageRepo = em.getRepository(ProductImage);
    const colorRepo = em.getRepository(ProductColor);
    const specRepo = em.getRepository(ProductSpec);

    // 1) Lấy product + categories để remove relation an toàn
    const found = await productRepo.findOne({
      where: { id },
      relations: ['categories'],
    });

    if (!found) throw new NotFoundException('Không tìm thấy sản phẩm');

    // 2) Xóa liên kết many-to-many (join-table)
    // Cách 2.1: remove relation qua TypeORM (không cần biết tên bảng join)
    if (found.categories?.length) {
      await productRepo
        .createQueryBuilder()
        .relation(Product, 'categories')
        .of(id)
        .remove(found.categories);
    }

    // 3) Xóa bảng con theo productId (đúng schema bạn đang dùng)
    await imageRepo.delete({ productId: id } as any);
    await colorRepo.delete({ productId: id } as any);
    await specRepo.delete({ productId: id } as any);

    // 4) Xóa product
    await productRepo.delete(id);

    return { success: true };
  });
}


async getRecommendations(id: number, limit = 12) {
  const take = Math.min(24, Math.max(4, Number(limit) || 12));

  // 1) Lấy danh sách ID trước (KHÔNG join images/categories) để LIMIT đúng theo product
  const idRows = await this.repo
    .createQueryBuilder('p')
    .select('p.id', 'id')
    .where('p.id != :id', { id })
    .andWhere('p.status = :st', { st: 'open' })
    .orderBy('p.created_at', 'DESC') // giữ đúng theo file bạn đang dùng
    .limit(take)
    .getRawMany();

  const ids = idRows
    .map((r: any) => Number(r.id))
    .filter((n: number) => Number.isFinite(n) && n > 0);

  if (!ids.length) return [];

  // 2) Sau đó mới fetch đầy đủ relations
  const products = await this.repo.find({
    where: { id: In(ids) },
    relations: ['images', 'categories'],
  });

  // 3) Giữ đúng thứ tự theo ids
  const map = new Map(products.map((p: any) => [p.id, p]));
  return ids.map((pid) => map.get(pid)).filter(Boolean);
}




  /**
   * ✅ Upsert core + children
   * - Ảnh: chỉ lưu URL (/uploads/...) hoặc http(s), không base64
   * - Giữ đúng field DB: price, original_price, discount_percent, status(open/closed)
   * - Fix TS: repo.create/save không còn suy luận Product[]
   */
  private async saveCoreAndChildren(input: UpsertProductDto, exist?: Product) {
    const anyDto: any = input as any;

    const name = safeTrim(anyDto?.name);
    if (!name) throw new BadRequestException('Tên sản phẩm không hợp lệ');

    const pricing = normalizePricing(anyDto);
    if (!Number.isFinite(Number(pricing.price)) || Number(pricing.price) < 0) {
      throw new BadRequestException('Giá bán (price) không hợp lệ');
    }

    // ===== images =====
    const imagesInput = anyDto?.images;
    const hasImagesField = Object.prototype.hasOwnProperty.call(anyDto, 'images');
    const hasImageField = Object.prototype.hasOwnProperty.call(anyDto, 'image');

    // nếu update mà FE không gửi images/image => giữ nguyên
    const galleryFromDto = uniqueImageUrls(Array.isArray(imagesInput) ? imagesInput : []);
    const imageInput = safeTrim(anyDto?.image);

    if (imageInput) ensureNotBase64(imageInput);

    let mainImage: string | null = null;
    let gallery: string[] = [];

    if (!exist || hasImagesField || hasImageField) {
      // create hoặc update có gửi ảnh
      mainImage =
        imageInput && isAllowedImageUrl(imageInput)
          ? imageInput
          : galleryFromDto[0] || null;

      gallery = mainImage
        ? uniqueImageUrls([mainImage, ...galleryFromDto])
        : galleryFromDto;
    } else {
      // update nhưng không gửi ảnh => giữ nguyên
      mainImage = exist.image || null;
      gallery = (exist.images || [])
        .map((x) => x?.url)
        .filter((u) => typeof u === 'string' && u.trim())
        .map((u) => u.trim());
    }

    // ===== slug =====
    const slugRaw = safeTrim(anyDto?.slug);
    const slug = slugRaw ? slugify(slugRaw) : slugify(name);

    // ===== status =====
    const statusRaw = safeTrim(anyDto?.status) || (exist?.status ?? 'open');
    const status = statusRaw === 'closed' ? 'closed' : 'open';

    // ===== categories =====
    const categoryIds = normalizeCategoryIds(anyDto);
    const categories = categoryIds.length
      ? await this.catRepo.find({ where: { id: In(categoryIds) } })
      : (exist?.categories ?? []);

    // ===== base product payload =====
    const payload: DeepPartial<Product> = {
      ...(anyDto?.id ? { id: Number(anyDto.id) } : {}),
      name,
      slug,
      description: safeTrim(anyDto?.description),
      sku: safeTrim(anyDto?.sku) || null,
      status,
      stock: Number(anyDto?.stock ?? exist?.stock ?? 0),
      sold: Number(anyDto?.sold ?? exist?.sold ?? 0),
      price: pricing.price,
      original_price: pricing.original_price,
      discount_percent: pricing.discount_percent,
      image: mainImage,
      categories,
    };

    const entity = this.repo.create(payload); // ✅ Product (không phải Product[])
    const saved = await this.repo.save(entity); // ✅ Product

    // ===== children reset & re-insert (chỉ khi create hoặc FE có gửi field) =====
    const colorsProvided = !exist || Object.prototype.hasOwnProperty.call(anyDto, 'colors');
    const specsProvided = !exist || Object.prototype.hasOwnProperty.call(anyDto, 'specs');
    const imagesProvided = !exist || hasImagesField || hasImageField;

    if (imagesProvided) {
      await this.imageRepo.delete({ productId: saved.id } as any);

      if (gallery?.length) {
        await this.imageRepo.insert(
          gallery.map((u, i) => ({
            productId: saved.id,
            url: u,
            sort: i,
          })) as any,
        );
      }
    }

    if (colorsProvided) {
      await this.colorRepo.delete({ productId: saved.id } as any);

      const colors = Array.isArray(anyDto?.colors) ? anyDto.colors : [];
      if (colors.length) {
        await this.colorRepo.insert(
          colors
            .map((c: any) => ({
              productId: saved.id,
              name: safeTrim(c?.name),
              hex: safeTrim(c?.hex),
            }))
            .filter((x: any) => x.name || x.hex) as any,
        );
      }
    }

    if (specsProvided) {
      await this.specRepo.delete({ productId: saved.id } as any);

      const specs = Array.isArray(anyDto?.specs) ? anyDto.specs : [];
      if (specs.length) {
        await this.specRepo.insert(
          specs
            .map((s: any) => ({
              productId: saved.id,
              label: safeTrim(s?.label),
              value: safeTrim(s?.value),
            }))
            .filter((x: any) => x.label || x.value) as any,
        );
      }
    }

    // trả về full relations
    return this.findOne(saved.id);
  }
}
