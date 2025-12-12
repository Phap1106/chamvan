"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./product.entity");
const product_image_entity_1 = require("./product-image.entity");
const product_color_entity_1 = require("./product-color.entity");
const product_spec_entity_1 = require("./product-spec.entity");
const category_entity_1 = require("../categories/category.entity");
let ProductsService = class ProductsService {
    repo;
    imgRepo;
    colorRepo;
    specRepo;
    cateRepo;
    constructor(repo, imgRepo, colorRepo, specRepo, cateRepo) {
        this.repo = repo;
        this.imgRepo = imgRepo;
        this.colorRepo = colorRepo;
        this.specRepo = specRepo;
        this.cateRepo = cateRepo;
    }
    normalizeSlug(raw, fallbackName) {
        const base = (raw && raw.trim()) || (fallbackName && fallbackName.trim()) || '';
        if (!base)
            return undefined;
        const slug = base
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .replace(/-{2,}/g, '-');
        return slug || undefined;
    }
    pickFirstImage(p) {
        if (p.image)
            return p.image;
        const imgs = p.images ?? [];
        return imgs[0]?.url;
    }
    normPrice(v) {
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
    }
    async findOne(id) {
        const item = await this.repo.findOne({
            where: { id },
            relations: { images: true, colors: true, specs: true, categories: true },
        });
        if (!item)
            throw new common_1.NotFoundException('Product not found');
        return item;
    }
    async findBySlug(slug) {
        const item = await this.repo.findOne({
            where: { slug },
            relations: { images: true, colors: true, specs: true, categories: true },
        });
        if (!item)
            throw new common_1.NotFoundException('Product not found');
        return item;
    }
    async findAll() {
        return this.repo.find({
            relations: { images: true, colors: true, specs: true, categories: true },
            order: { createdAt: 'DESC' },
        });
    }
    async create(dto) {
        const saved = await this.saveCoreAndChildren(dto);
        return this.findOne(saved.id);
    }
    async update(id, dto) {
        const exists = await this.repo.findOne({ where: { id } });
        if (!exists)
            throw new common_1.NotFoundException('Product not found');
        const anyDto = dto;
        const saved = await this.saveCoreAndChildren({
            ...anyDto,
            id,
        });
        return this.findOne(saved.id);
    }
    async remove(id) {
        const found = await this.repo.findOne({ where: { id } });
        if (!found)
            throw new common_1.NotFoundException('Product not found');
        await this.imgRepo.delete({ productId: id });
        await this.colorRepo.delete({ productId: id });
        await this.specRepo.delete({ productId: id });
        await this.repo.delete(id);
        return { success: true };
    }
    async saveCoreAndChildren(input) {
        const anyDto = input;
        const id = input.id ? Number(input.id) : undefined;
        const name = String(input.name ?? '').trim();
        const slug = this.normalizeSlug(undefined, name);
        const rawImages = Array.isArray(anyDto.images) ? anyDto.images : [];
        const uniqueImages = [
            ...new Set(rawImages
                .map((u) => String(u).trim())
                .filter((u) => u && u.startsWith('http'))),
        ];
        let image = input.image ? String(input.image).trim() : undefined;
        if (!image && uniqueImages.length > 0) {
            image = uniqueImages[0];
        }
        const price = String(anyDto.price ?? input.price ?? 0);
        const sku = input.sku ? String(input.sku).trim() : undefined;
        const description = input.description ? String(input.description).trim() : undefined;
        const colors = Array.isArray(anyDto.colors) ? anyDto.colors : [];
        const specs = Array.isArray(anyDto.specs) ? anyDto.specs : [];
        const categoryIdsRaw = Array.isArray(anyDto.categories) ? anyDto.categories : [];
        const categoryIds = (categoryIdsRaw || [])
            .map((v) => Number(v))
            .filter((v) => Number.isFinite(v));
        const categories = categoryIds.length
            ? await this.cateRepo.find({ where: { id: (0, typeorm_2.In)(categoryIds) } })
            : [];
        const stock = Math.max(0, parseInt(String(anyDto.stock ?? 0)) || 0);
        const sold = Math.max(0, parseInt(String(anyDto.sold ?? 0)) || 0);
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
        });
        const saved = await this.repo.save(core);
        await this.imgRepo.delete({ productId: saved.id });
        if (uniqueImages.length) {
            const entities = uniqueImages.map((url) => this.imgRepo.create({ url: url.trim(), productId: saved.id }));
            await this.imgRepo.save(entities);
        }
        await this.colorRepo.delete({ productId: saved.id });
        if (colors.length) {
            const entities = colors
                .filter((c) => c && c.name)
                .map((c) => this.colorRepo.create({
                name: c.name.trim(),
                hex: c.hex,
                productId: saved.id,
            }));
            if (entities.length)
                await this.colorRepo.save(entities);
        }
        await this.specRepo.delete({ productId: saved.id });
        if (specs.length) {
            const entities = specs
                .filter((s) => s && s.label && s.value)
                .map((s) => this.specRepo.create({
                label: s.label,
                value: s.value,
                productId: saved.id,
            }));
            if (entities.length)
                await this.specRepo.save(entities);
        }
        return saved;
    }
    async getRecommendations(id, limit = 12) {
        const pid = Number(id);
        const product = await this.repo.findOne({
            where: { id: pid },
            relations: { categories: true, images: true },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const price0 = this.normPrice(product.price);
        const catIds = (product.categories ?? []).map((c) => c.id);
        const qb1 = this.repo
            .createQueryBuilder('p')
            .leftJoinAndSelect('p.categories', 'c')
            .leftJoinAndSelect('p.images', 'imgs')
            .where('p.id <> :id', { id: pid })
            .andWhere('p.status = :st', { st: 'open' })
            .andWhere(catIds.length ? 'c.id IN (:...catIds)' : '1=1', { catIds })
            .andWhere('p.price BETWEEN :min AND :max', {
            min: price0 * 0.8,
            max: price0 * 1.25,
        });
        const candidates1 = await qb1.getMany();
        let candidates2 = [];
        if (candidates1.length < limit) {
            const qb2 = this.repo
                .createQueryBuilder('p')
                .leftJoinAndSelect('p.categories', 'c')
                .leftJoinAndSelect('p.images', 'imgs')
                .where('p.id <> :id', { id: pid })
                .andWhere('p.status = :st', { st: 'open' })
                .andWhere(catIds.length ? 'c.id IN (:...catIds)' : '1=1', { catIds })
                .andWhere('p.price BETWEEN :min AND :max', {
                min: price0 * 0.6,
                max: price0 * 1.5,
            });
            candidates2 = await qb2.getMany();
        }
        let candidates3 = [];
        if (candidates1.length + candidates2.length < limit) {
            candidates3 = await this.repo.find({
                where: { status: 'open' },
                order: { sold: 'DESC', createdAt: 'DESC' },
                take: limit * 2,
                relations: { categories: true, images: true },
            });
        }
        const pool = [];
        const seen = new Set();
        [candidates1, candidates2, candidates3].forEach((list) => list.forEach((p) => {
            if (!seen.has(p.id)) {
                seen.add(p.id);
                pool.push(p);
            }
        }));
        const maxSold = Math.max(1, ...pool.map((p) => p.sold || 0));
        const related = pool
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
        const seenSug = new Set([pid]);
        const pick = (arr, take) => {
            const out = [];
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
                if (out.length >= take)
                    break;
            }
            return out;
        };
        const takeTotal = Math.min(Math.max(4, limit), 24);
        const sug50 = Math.ceil(takeTotal * 0.5);
        const suggested = [
            ...pick(sameGroup, sug50),
            ...pick(topSellers, takeTotal - sug50),
        ].slice(0, takeTotal);
        return { related, suggested };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(product_image_entity_1.ProductImage)),
    __param(2, (0, typeorm_1.InjectRepository)(product_color_entity_1.ProductColor)),
    __param(3, (0, typeorm_1.InjectRepository)(product_spec_entity_1.ProductSpec)),
    __param(4, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map