// // src/products/products.service.ts
// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { In, Repository } from 'typeorm';
// import { Product } from './product.entity';
// import { ProductImage } from './product-image.entity';
// import { ProductColor } from './product-color.entity';
// import { ProductSpec } from './product-spec.entity';
// import { Category } from '../categories/category.entity';
// import { CreateProductDto } from './dto/create-product.dto';

// type UpsertProductDto = CreateProductDto & { id?: number };

// @Injectable()
// export class ProductsService {
//   constructor(
//     @InjectRepository(Product) private readonly repo: Repository<Product>,
//     @InjectRepository(ProductImage) private readonly imgRepo: Repository<ProductImage>,
//     @InjectRepository(ProductColor) private readonly colorRepo: Repository<ProductColor>,
//     @InjectRepository(ProductSpec) private readonly specRepo: Repository<ProductSpec>,
//     @InjectRepository(Category) private readonly cateRepo: Repository<Category>,
//   ) {}

//   /** Lấy tất cả */
//   async findAll() {
//     return this.repo.find({
//       relations: { images: true, colors: true, specs: true, categories: true },
//       order: { createdAt: 'DESC' },
//     });
//   }

//   /** Lấy 1 sản phẩm */
//   async findOne(id: number | string) {
//     const item = await this.repo.findOne({
//       where: { id: Number(id) },
//       relations: { images: true, colors: true, specs: true, categories: true },
//     });
//     if (!item) throw new NotFoundException('Product not found');
//     return item;
//   }

//   /** Phân trang cho admin */
//   async findPaged(page = 1, limit = 20) {
//     const take = Math.max(1, Number(limit));
//     const skip = Math.max(0, (Number(page) - 1) * take);
//     const [items, total] = await this.repo.findAndCount({
//       relations: { images: true, colors: true, specs: true, categories: true },
//       order: { createdAt: 'DESC' },
//       take,
//       skip,
//     });
//     return { items, total, page: Number(page), limit: take };
//   }

//   /** Tạo mới */
//   async create(dto: CreateProductDto) {
//     const saved = await this.saveCoreAndChildren(dto);
//     return this.findOne(saved.id);
//   }

//   /** Cập nhật */
//   async update(id: number | string, dto: CreateProductDto) {
//     const pid = Number(id);
//     const exists = await this.repo.findOne({ where: { id: pid } });
//     if (!exists) throw new NotFoundException('Product not found');

//     const saved = await this.saveCoreAndChildren({ ...dto, id: pid });
//     return this.findOne(saved.id);
//   }

//   /** Xoá */
//   async remove(id: number | string) {
//     const pid = Number(id);
//     const found = await this.repo.findOne({ where: { id: pid } });
//     if (!found) throw new NotFoundException('Product not found');

//     // clear children (phòng trường hợp cascade chưa chạy)
//     await this.imgRepo.delete({ productId: pid });
//     await this.colorRepo.delete({ productId: pid });
//     await this.specRepo.delete({ productId: pid });

//     await this.repo.delete(pid);
//     return { success: true };
//   }

//   // ====================== Helpers ======================

//   /**
//    * Tạo/cập nhật core + children + categories
//    * - DB đang dùng camelCase: productId
//    * - Entity Product.price là string → lưu string
//    * - DTO có thể không có slug → đọc mềm từ any
//    */
//   private async saveCoreAndChildren(input: UpsertProductDto): Promise<Product> {
//     // lấy mềm các field có thể thiếu trong DTO
//     const anyDto = input as any;

//     const id: number | undefined = input.id ? Number(input.id) : undefined;
//     const name: string = String(input.name ?? '').trim();

//     // CreateProductDto không bắt buộc có slug
//     const slug: string | undefined = anyDto.slug ? String(anyDto.slug).trim() : undefined;

//     // Entity hiện tại price:string
//     const price: string = String(anyDto.price ?? input.price ?? 0);

//     const sku: string | undefined = input.sku ? String(input.sku).trim() : undefined;
//     const description: string | undefined = input.description ? String(input.description).trim() : undefined;
//     const image: string | undefined = input.image ? String(input.image).trim() : undefined;

//     const images: string[] = Array.isArray(anyDto.images) ? anyDto.images : [];
//     const colors: Array<{ name: string; hex?: string }> = Array.isArray(anyDto.colors) ? anyDto.colors : [];
//     const specs: Array<{ label: string; value: string }> = Array.isArray(anyDto.specs) ? anyDto.specs : [];
//     const categoryIdsRaw: Array<number | string> = Array.isArray(anyDto.categories) ? anyDto.categories : [];

//     // Danh mục
//     const categoryIds = (categoryIdsRaw || [])
//       .map((v) => Number(v))
//       .filter((v) => Number.isFinite(v));
//     const categories = categoryIds.length
//       ? await this.cateRepo.find({ where: { id: In(categoryIds) } })
//       : [];

//     // Core product (ép kiểu rõ ràng để save trả về Product, tránh overload "mảng")
// // Core product: dùng DeepPartial để hợp lệ với TypeORM
// const stock: number = Math.max(0, Number.parseInt(String(anyDto.stock ?? 0), 10) || 0);
// const sold:  number = Math.max(0, Number.parseInt(String(anyDto.sold  ?? 0), 10) || 0);
// const rawStatus = String((anyDto.status ?? 'open')).toLowerCase();
// const status: 'open' | 'closed' = rawStatus === 'closed' ? 'closed' : 'open';

// const core = this.repo.create({
//   ...(id ? { id } : {}),
//   name,
//   slug,
//   price,           // string (đúng với entity hiện tại)
//   sku,
//   description,
//   image,
//     stock,        // << thêm
//   sold, 
//     status,     
//   categories,
// } as Partial<Product>);

// // save trả về Product đầy đủ
// const saved: Product = await this.repo.save(core as any);


//     // Replace children
//     await this.imgRepo.delete({ productId: saved.id });
//     await this.colorRepo.delete({ productId: saved.id });
//     await this.specRepo.delete({ productId: saved.id });

//     // Images
//     if (Array.isArray(images) && images.length) {
//       const imgEntities = images
//         .filter((u) => typeof u === 'string' && u.trim())
//         .map((url) => this.imgRepo.create({ url: String(url).trim(), productId: saved.id }));
//       if (imgEntities.length) await this.imgRepo.save(imgEntities);
//     }

//     // Colors (hex dùng undefined thay vì null để khớp type hex?: string)
//     if (Array.isArray(colors) && colors.length) {
//       const colorEntities = colors
//         .filter((c) => c && typeof c.name === 'string' && c.name.trim())
//         .map((c) =>
//           this.colorRepo.create({
//             name: String(c.name).trim(),
//             hex: c.hex ? String(c.hex).trim() : undefined,
//             productId: saved.id,
//           }),
//         );
//       if (colorEntities.length) await this.colorRepo.save(colorEntities);
//     }

//     // Specs
//     if (Array.isArray(specs) && specs.length) {
//       const specEntities = specs
//         .filter((s) => s && s.label && s.value && String(s.label).trim() && String(s.value).trim())
//         .map((s) =>
//           this.specRepo.create({
//             label: String(s.label).trim(),
//             value: String(s.value).trim(),
//             productId: saved.id,
//           }),
//         );
//       if (specEntities.length) await this.specRepo.save(specEntities);
//     }

//     return saved;
//   }
// }









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

// Kiểu trả về cho block đề xuất
export type RecItem = {
  id: number;
  name: string;
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

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly repo: Repository<Product>,
    @InjectRepository(ProductImage) private readonly imgRepo: Repository<ProductImage>,
    @InjectRepository(ProductColor) private readonly colorRepo: Repository<ProductColor>,
    @InjectRepository(ProductSpec) private readonly specRepo: Repository<ProductSpec>,
    @InjectRepository(Category) private readonly cateRepo: Repository<Category>,
  ) {}

  /** Lấy tất cả */
  async findAll() {
    return this.repo.find({
      relations: { images: true, colors: true, specs: true, categories: true },
      order: { createdAt: 'DESC' },
    });
  }

  /** Lấy 1 sản phẩm */
  async findOne(id: number | string) {
    const item = await this.repo.findOne({
      where: { id: Number(id) },
      relations: { images: true, colors: true, specs: true, categories: true },
    });
    if (!item) throw new NotFoundException('Product not found');
    return item;
  }

  /** Phân trang cho admin */
  async findPaged(page = 1, limit = 20) {
    const take = Math.max(1, Number(limit));
    const skip = Math.max(0, (Number(page) - 1) * take);
    const [items, total] = await this.repo.findAndCount({
      relations: { images: true, colors: true, specs: true, categories: true },
      order: { createdAt: 'DESC' },
      take,
      skip,
    });
    return { items, total, page: Number(page), limit: take };
  }

  /** Tạo mới */
  async create(dto: CreateProductDto) {
    const saved = await this.saveCoreAndChildren(dto);
    return this.findOne(saved.id);
  }

  /** Cập nhật */
  async update(id: number | string, dto: CreateProductDto) {
    const pid = Number(id);
    const exists = await this.repo.findOne({ where: { id: pid } });
    if (!exists) throw new NotFoundException('Product not found');

    const saved = await this.saveCoreAndChildren({ ...dto, id: pid });
    return this.findOne(saved.id);
  }

  /** Xoá */
  async remove(id: number | string) {
    const pid = Number(id);
    const found = await this.repo.findOne({ where: { id: pid } });
    if (!found) throw new NotFoundException('Product not found');

    // clear children (phòng trường hợp cascade chưa chạy)
    await this.imgRepo.delete({ productId: pid });
    await this.colorRepo.delete({ productId: pid });
    await this.specRepo.delete({ productId: pid });

    await this.repo.delete(pid);
    return { success: true };
  }

  // ====================== Helpers ======================

  private pickFirstImage(p: Product & { images?: ProductImage[] }): string | undefined {
    if (p.image) return p.image;
    const imgs = p.images ?? [];
    return imgs[0]?.url;
  }

  private normPrice(v: unknown): number {
    const n = Number(v);
    if (!Number.isFinite(n)) return 0;
    return n;
  }

  /**
   * Tạo/cập nhật core + children + categories
   * - DB đang dùng camelCase: productId
   * - Entity Product.price là string → lưu string
   * - DTO có thể không có slug → đọc mềm từ any
   */
  private async saveCoreAndChildren(input: UpsertProductDto): Promise<Product> {
    // lấy mềm các field có thể thiếu trong DTO
    const anyDto = input as any;

    const id: number | undefined = input.id ? Number(input.id) : undefined;
    const name: string = String(input.name ?? '').trim();

    // CreateProductDto không bắt buộc có slug
    const slug: string | undefined = anyDto.slug ? String(anyDto.slug).trim() : undefined;

    // Entity hiện tại price:string
    const price: string = String(anyDto.price ?? input.price ?? 0);

    const sku: string | undefined = input.sku ? String(input.sku).trim() : undefined;
    const description: string | undefined = input.description ? String(input.description).trim() : undefined;
    const image: string | undefined = input.image ? String(input.image).trim() : undefined;

    const images: string[] = Array.isArray(anyDto.images) ? anyDto.images : [];
    const colors: Array<{ name: string; hex?: string }> = Array.isArray(anyDto.colors) ? anyDto.colors : [];
    const specs: Array<{ label: string; value: string }> = Array.isArray(anyDto.specs) ? anyDto.specs : [];
    const categoryIdsRaw: Array<number | string> = Array.isArray(anyDto.categories) ? anyDto.categories : [];

    // Danh mục
    const categoryIds = (categoryIdsRaw || [])
      .map((v) => Number(v))
      .filter((v) => Number.isFinite(v));
    const categories = categoryIds.length
      ? await this.cateRepo.find({ where: { id: In(categoryIds) } })
      : [];

    // Core product
    const stock: number = Math.max(0, Number.parseInt(String(anyDto.stock ?? 0), 10) || 0);
    const sold:  number = Math.max(0, Number.parseInt(String(anyDto.sold  ?? 0), 10) || 0);
    const rawStatus = String((anyDto.status ?? 'open')).toLowerCase();
    const status: 'open' | 'closed' = rawStatus === 'closed' ? 'closed' : 'open';

    const core = this.repo.create({
      ...(id ? { id } : {}),
      name,
      slug,
      price,           // string (đúng với entity hiện tại)
      sku,
      description,
      image,
      stock,
      sold,
      status,
      categories,
    } as Partial<Product>);

    const saved: Product = await this.repo.save(core as any);

    // Replace children
    await this.imgRepo.delete({ productId: saved.id });
    await this.colorRepo.delete({ productId: saved.id });
    await this.specRepo.delete({ productId: saved.id });

    // Images
    if (Array.isArray(images) && images.length) {
      const imgEntities = images
        .filter((u) => typeof u === 'string' && u.trim())
        .map((url) => this.imgRepo.create({ url: String(url).trim(), productId: saved.id }));
      if (imgEntities.length) await this.imgRepo.save(imgEntities);
    }

    // Colors
    if (Array.isArray(colors) && colors.length) {
      const colorEntities = colors
        .filter((c) => c && typeof c.name === 'string' && c.name.trim())
        .map((c) =>
          this.colorRepo.create({
            name: String(c.name).trim(),
            hex: c.hex ? String(c.hex).trim() : undefined,
            productId: saved.id,
          }),
        );
      if (colorEntities.length) await this.colorRepo.save(colorEntities);
    }

    // Specs
    if (Array.isArray(specs) && specs.length) {
      const specEntities = specs
        .filter((s) => s && s.label && s.value && String(s.label).trim() && String(s.value).trim())
        .map((s) =>
          this.specRepo.create({
            label: String(s.label).trim(),
            value: String(s.value).trim(),
            productId: saved.id,
          }),
        );
      if (specEntities.length) await this.specRepo.save(specEntities);
    }

    return saved;
  }

  // ====================== New: Recommendations API ======================

  /**
   * Trả về 2 khối:
   * - related: liên quan mạnh (cùng category + gần giá), xếp hạng theo score
   * - suggested: gợi ý khám phá (cùng nhóm rộng, láng giềng giá, bestseller) và loại trùng
   *
   * KHÔNG làm thay đổi các API cũ.
   */
  async getRecommendations(id: number | string, limit = 12): Promise<Recommendations> {
    const pid = Number(id);
    const product = await this.repo.findOne({
      where: { id: pid },
      relations: { categories: true, images: true },
    });
    if (!product) throw new NotFoundException('Product not found');

    const price0 = this.normPrice(product.price);
    const catIds = (product.categories ?? []).map((c) => c.id);

    // -------- 1) Ứng viên liên quan (cùng category + gần giá) --------
    const qb1 = this.repo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.categories', 'c')
      .leftJoinAndSelect('p.images', 'imgs')
      .where('p.id <> :id', { id: pid })
      .andWhere('p.status = :st', { st: 'open' })
      .andWhere(catIds.length ? 'c.id IN (:...catIds)' : '1=1', { catIds })
      .andWhere('p.price BETWEEN :min1 AND :max1', {
        min1: price0 * 0.8,
        max1: price0 * 1.25,
      });

    const candidates1 = await qb1.getMany();

    // -------- 2) Fallback (nới biên độ giá) --------
    let candidates2: Product[] = [];
    if (candidates1.length < limit) {
      const qb2 = this.repo
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.categories', 'c')
        .leftJoinAndSelect('p.images', 'imgs')
        .where('p.id <> :id', { id: pid })
        .andWhere('p.status = :st', { st: 'open' })
        .andWhere(catIds.length ? 'c.id IN (:...catIds)' : '1=1', { catIds })
        .andWhere('p.price BETWEEN :min2 AND :max2', {
          min2: price0 * 0.6,
          max2: price0 * 1.5,
        });
      candidates2 = await qb2.getMany();
    }

    // -------- 3) Best sellers toàn shop để lấp đầy --------
    let candidates3: Product[] = [];
    if (candidates1.length + candidates2.length < limit) {
      candidates3 = await this.repo.find({
        where: { status: 'open' },
        order: { sold: 'DESC', createdAt: 'DESC' },
        take: limit * 2, // lấy dư để lọc trùng
        relations: { categories: true, images: true },
      });
    }

    // Gộp & loại trùng
    const pool: Product[] = [];
    const seen = new Set<number>();
    for (const list of [candidates1, candidates2, candidates3]) {
      for (const p of list) {
        if (seen.has(p.id)) continue;
        seen.add(p.id);
        pool.push(p);
      }
    }

    // Tính điểm
    const maxSold = Math.max(1, ...pool.map((p) => p.sold || 0));
    const related: RecItem[] = pool
      .map((p) => {
        const price = this.normPrice(p.price);
        const shared = (p.categories ?? []).some((c) => catIds.includes(c.id));
        const delta = Math.abs(price - price0);
        const priceScore = 30 * Math.exp(-Math.pow(delta / (0.25 * (price0 || 1)), 2));
        const soldScore = 20 * ((p.sold || 0) / maxSold);
        const freshScore = (() => {
          const days = p.createdAt ? (Date.now() - p.createdAt.getTime()) / 86400000 : 999;
          if (days >= 365) return 0;
          if (days <= 30) return 10;
          return 10 * (1 - (days - 30) / (365 - 30));
        })();
        const catScore = shared ? 40 : 0;

        return {
          id: p.id,
          name: p.name,
          price,
          image: this.pickFirstImage(p),
          sold: p.sold,
          createdAt: p.createdAt,
          categories: (p.categories || []).map((c) => ({ id: c.id, slug: c.slug })),
          score: catScore + priceScore + soldScore + freshScore,
        } as RecItem;
      })
      .sort((a, b) => (b.score! - a.score!))
      .slice(0, limit);

    // ===================== SUGGESTED =====================

    // 50%: cùng "nhóm" (cùng category), giá rộng [0.7x, 1.4x], mới trước
    const sameGroup = await this.repo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.categories', 'c')
      .leftJoinAndSelect('p.images', 'imgs')
      .where('p.id <> :id', { id: pid })
      .andWhere('p.status = :st', { st: 'open' })
      .andWhere(catIds.length ? 'c.id IN (:...catIds)' : '1=1', { catIds })
      .andWhere('p.price BETWEEN :min AND :max', {
        min: price0 * 0.7,
        max: price0 * 1.4,
      })
      .orderBy('p.createdAt', 'DESC')
      .take(24)
      .getMany();

    // 30%: láng giềng giá (gần giá nhất) – lấy trong tập open
    const priceSorted = await this.repo.find({
      where: { status: 'open' },
      order: { price: 'ASC' as any },
      take: 200,
      relations: { categories: true, images: true },
    });
    const neighbors = priceSorted
      .map((p) => ({ p, d: Math.abs(this.normPrice(p.price) - price0) }))
      .filter((x) => x.p.id !== pid)
      .sort((a, b) => a.d - b.d)
      .slice(0, 24)
      .map(({ p }) => p);

    // 20%: bán chạy toàn shop
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
        if (seenSug.has(p.id)) continue;
        seenSug.add(p.id);
        out.push({
          id: p.id,
          name: p.name,
          price: this.normPrice(p.price),
          image: this.pickFirstImage(p),
          sold: p.sold,
          createdAt: p.createdAt,
          categories: (p.categories || []).map((c) => ({ id: c.id, slug: c.slug })),
        });
        if (out.length >= take) break;
      }
      return out;
    };

    const takeTotal = Math.min(Math.max(4, limit), 24);
    const sug50 = Math.ceil(takeTotal * 0.5);
    const sug30 = Math.floor(takeTotal * 0.3);
    const sug20 = takeTotal - (sug50 + sug30);

    const suggested = [
      ...pick(sameGroup, sug50),
      ...pick(neighbors, sug30),
      ...pick(topSellers, sug20),
    ].slice(0, takeTotal);

    return { related, suggested };
  }
}
