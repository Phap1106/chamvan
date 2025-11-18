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

  // --- FIND ALL ---
  async findAll() {
    return this.repo.find({
      relations: { images: true, colors: true, specs: true, categories: true },
      order: { createdAt: 'DESC' },
    });
  }

  // --- FIND ONE BY ID ---
  async findOne(id: number) {
    const item = await this.repo.findOne({
      where: { id },
      relations: { images: true, colors: true, specs: true, categories: true },
    });
    if (!item) throw new NotFoundException('Product not found');
    return item;
  }

  // --- FIND ONE BY SLUG (Mới thêm) ---
  async findBySlug(slug: string) {
    const item = await this.repo.findOne({
      where: { slug },
      relations: { images: true, colors: true, specs: true, categories: true },
    });
    if (!item) throw new NotFoundException('Product not found');
    return item;
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
    const saved = await this.saveCoreAndChildren({ ...dto, id });
    return this.findOne(saved.id);
  }

  // --- REMOVE ---
  async remove(id: number) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Product not found');
    
    // Xóa dữ liệu con trước
    await this.imgRepo.delete({ productId: id });
    await this.colorRepo.delete({ productId: id });
    await this.specRepo.delete({ productId: id });
    
    await this.repo.delete(id);
    return { success: true };
  }

  // ====================== Helpers Logic ======================

  private pickFirstImage(p: Product & { images?: ProductImage[] }): string | undefined {
    if (p.image) return p.image;
    const imgs = p.images ?? [];
    return imgs[0]?.url;
  }

  private normPrice(v: unknown): number {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  private async saveCoreAndChildren(input: UpsertProductDto): Promise<Product> {
    const anyDto = input as any;
    const id = input.id ? Number(input.id) : undefined;
    const name = String(input.name ?? '').trim();
    
    // Tự động tạo slug nếu không có
    let slug = anyDto.slug ? String(anyDto.slug).trim() : undefined;
    if (!slug && name) {
       slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }

    const price = String(anyDto.price ?? input.price ?? 0);
    const sku = input.sku ? String(input.sku).trim() : undefined;
    const description = input.description ? String(input.description).trim() : undefined;
    const image = input.image ? String(input.image).trim() : undefined;

    const images: string[] = Array.isArray(anyDto.images) ? anyDto.images : [];
    const colors = Array.isArray(anyDto.colors) ? anyDto.colors : [];
    const specs = Array.isArray(anyDto.specs) ? anyDto.specs : [];
    const categoryIdsRaw = Array.isArray(anyDto.categories) ? anyDto.categories : [];

    const categoryIds = (categoryIdsRaw || []).map((v: any) => Number(v)).filter((v: number) => Number.isFinite(v));
    const categories = categoryIds.length ? await this.cateRepo.find({ where: { id: In(categoryIds) } }) : [];

    const stock = Math.max(0, parseInt(String(anyDto.stock ?? 0)) || 0);
    const sold = Math.max(0, parseInt(String(anyDto.sold ?? 0)) || 0);
    const status = String(anyDto.status ?? 'open').toLowerCase() === 'closed' ? 'closed' : 'open';

    const core = this.repo.create({
      ...(id ? { id } : {}),
      name, slug, price, sku, description, image, stock, sold, status, categories,
    } as Partial<Product>);

    const saved = await this.repo.save(core as any);

    // Xóa cũ thêm mới relation
    await this.imgRepo.delete({ productId: saved.id });
    await this.colorRepo.delete({ productId: saved.id });
    await this.specRepo.delete({ productId: saved.id });

    if (images.length) {
      const entities = images.filter(u => typeof u === 'string' && u.trim()).map(url => this.imgRepo.create({ url: url.trim(), productId: saved.id }));
      if (entities.length) await this.imgRepo.save(entities);
    }

    if (colors.length) {
      const entities = colors.filter((c: any) => c && c.name).map((c: any) => this.colorRepo.create({ name: c.name.trim(), hex: c.hex, productId: saved.id }));
      if (entities.length) await this.colorRepo.save(entities);
    }

    if (specs.length) {
      const entities = specs.filter((s: any) => s && s.label && s.value).map((s: any) => this.specRepo.create({ label: s.label, value: s.value, productId: saved.id }));
      if (entities.length) await this.specRepo.save(entities);
    }

    return saved;
  }

  // ====================== Recommendations Logic ======================
  async getRecommendations(id: number | string, limit = 12): Promise<Recommendations> {
    const pid = Number(id);
    const product = await this.repo.findOne({ where: { id: pid }, relations: { categories: true, images: true } });
    if (!product) throw new NotFoundException('Product not found');

    const price0 = this.normPrice(product.price);
    const catIds = (product.categories ?? []).map((c) => c.id);

    // 1. Related (Cùng danh mục, giá gần)
    const qb1 = this.repo.createQueryBuilder('p')
      .leftJoinAndSelect('p.categories', 'c')
      .leftJoinAndSelect('p.images', 'imgs')
      .where('p.id <> :id', { id: pid })
      .andWhere('p.status = :st', { st: 'open' })
      .andWhere(catIds.length ? 'c.id IN (:...catIds)' : '1=1', { catIds })
      .andWhere('p.price BETWEEN :min AND :max', { min: price0 * 0.8, max: price0 * 1.25 });
    const candidates1 = await qb1.getMany();

    // 2. Fallback (Nới rộng giá)
    let candidates2: Product[] = [];
    if (candidates1.length < limit) {
      const qb2 = this.repo.createQueryBuilder('p')
        .leftJoinAndSelect('p.categories', 'c')
        .leftJoinAndSelect('p.images', 'imgs')
        .where('p.id <> :id', { id: pid })
        .andWhere('p.status = :st', { st: 'open' })
        .andWhere(catIds.length ? 'c.id IN (:...catIds)' : '1=1', { catIds })
        .andWhere('p.price BETWEEN :min AND :max', { min: price0 * 0.6, max: price0 * 1.5 });
      candidates2 = await qb2.getMany();
    }

    // 3. Best Sellers (Lấp đầy)
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
    [candidates1, candidates2, candidates3].forEach(list => list.forEach(p => {
      if (!seen.has(p.id)) { seen.add(p.id); pool.push(p); }
    }));

    const maxSold = Math.max(1, ...pool.map((p) => p.sold || 0));
    const related: RecItem[] = pool.map((p) => {
        const price = this.normPrice(p.price);
        const shared = (p.categories ?? []).some((c) => catIds.includes(c.id));
        const delta = Math.abs(price - price0);
        const priceScore = 30 * Math.exp(-Math.pow(delta / (0.25 * (price0 || 1)), 2));
        const soldScore = 20 * ((p.sold || 0) / maxSold);
        const days = p.createdAt ? (Date.now() - p.createdAt.getTime()) / 86400000 : 999;
        const freshScore = days >= 365 ? 0 : (days <= 30 ? 10 : 10 * (1 - (days - 30) / 335));
        const catScore = shared ? 40 : 0;

        return {
          id: p.id, name: p.name, price, image: this.pickFirstImage(p),
          sold: p.sold, createdAt: p.createdAt,
          categories: (p.categories || []).map((c) => ({ id: c.id, slug: c.slug })),
          score: catScore + priceScore + soldScore + freshScore,
        };
      })
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, limit);

    // 4. Suggested (Logic khám phá)
    const sameGroup = await this.repo.createQueryBuilder('p')
      .leftJoinAndSelect('p.categories', 'c')
      .leftJoinAndSelect('p.images', 'imgs')
      .where('p.id <> :id', { id: pid })
      .andWhere('p.status = :st', { st: 'open' })
      .andWhere(catIds.length ? 'c.id IN (:...catIds)' : '1=1', { catIds })
      .orderBy('p.createdAt', 'DESC').take(24).getMany();
      
    const priceSorted = await this.repo.find({ where: { status: 'open' }, order: { price: 'ASC' as any }, take: 200, relations: { categories: true, images: true } });
    const neighbors = priceSorted.map(p => ({ p, d: Math.abs(this.normPrice(p.price) - price0) }))
      .filter(x => x.p.id !== pid).sort((a, b) => a.d - b.d).slice(0, 24).map(x => x.p);

    const topSellers = await this.repo.find({ where: { status: 'open' }, order: { sold: 'DESC', createdAt: 'DESC' }, take: 24, relations: { categories: true, images: true } });

    const seenSug = new Set<number>([pid]);
    const pick = (arr: Product[], take: number) => {
      const out: RecItem[] = [];
      for (const p of arr) {
        if (!seenSug.has(p.id)) {
          seenSug.add(p.id);
          out.push({
            id: p.id, name: p.name, price: this.normPrice(p.price),
            image: this.pickFirstImage(p), sold: p.sold, createdAt: p.createdAt,
            categories: (p.categories || []).map(c => ({ id: c.id, slug: c.slug })),
          });
        }
        if (out.length >= take) break;
      }
      return out;
    };

    const takeTotal = Math.min(Math.max(4, limit), 24);
    const sug50 = Math.ceil(takeTotal * 0.5);
    const sug30 = Math.floor(takeTotal * 0.3);
    const sug20 = takeTotal - (sug50 + sug30);

    const suggested = [...pick(sameGroup, sug50), ...pick(neighbors, sug30), ...pick(topSellers, sug20)].slice(0, takeTotal);

    return { related, suggested };
  }
}