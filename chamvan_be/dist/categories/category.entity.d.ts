import { Product } from '../products/product.entity';
export declare class Category {
    id: number;
    slug: string;
    name: string;
    description?: string;
    parentId?: number;
    products: Product[];
    createdAt: Date;
    updatedAt: Date;
}
