import { Product } from './product.entity';
export declare class ProductColor {
    id: number;
    name: string;
    hex?: string;
    productId: number;
    product: Product;
}
