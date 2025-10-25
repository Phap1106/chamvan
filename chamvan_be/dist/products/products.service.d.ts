import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { ProductImage } from './product-image.entity';
import { ProductColor } from './product-color.entity';
import { ProductSpec } from './product-spec.entity';
import { Category } from '../categories/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
export type RecItem = {
    id: number;
    name: string;
    price: number;
    image?: string;
    sold?: number;
    createdAt?: Date;
    categories: {
        id: number;
        slug: string;
    }[];
    score?: number;
};
export type Recommendations = {
    related: RecItem[];
    suggested: RecItem[];
};
export declare class ProductsService {
    private readonly repo;
    private readonly imgRepo;
    private readonly colorRepo;
    private readonly specRepo;
    private readonly cateRepo;
    constructor(repo: Repository<Product>, imgRepo: Repository<ProductImage>, colorRepo: Repository<ProductColor>, specRepo: Repository<ProductSpec>, cateRepo: Repository<Category>);
    findAll(): Promise<Product[]>;
    findOne(id: number | string): Promise<Product>;
    findPaged(page?: number, limit?: number): Promise<{
        items: Product[];
        total: number;
        page: number;
        limit: number;
    }>;
    create(dto: CreateProductDto): Promise<Product>;
    update(id: number | string, dto: CreateProductDto): Promise<Product>;
    remove(id: number | string): Promise<{
        success: boolean;
    }>;
    private pickFirstImage;
    private normPrice;
    private saveCoreAndChildren;
    getRecommendations(id: number | string, limit?: number): Promise<Recommendations>;
}
