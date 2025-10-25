import { ProductImage } from './product-image.entity';
import { ProductColor } from './product-color.entity';
import { ProductSpec } from './product-spec.entity';
import { Category } from '../categories/category.entity';
export declare class Product {
    id: number;
    name: string;
    price: string;
    sku?: string;
    description?: string;
    stock: number;
    status: 'open' | 'closed';
    sold: number;
    image?: string;
    images: ProductImage[];
    colors: ProductColor[];
    specs: ProductSpec[];
    categories: Category[];
    createdAt: Date;
    updatedAt: Date;
}
