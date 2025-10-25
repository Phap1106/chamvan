import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsController {
    private readonly service;
    constructor(service: ProductsService);
    findAll(): Promise<import("./product.entity").Product[]>;
    findOne(id: number): Promise<import("./product.entity").Product>;
    create(dto: CreateProductDto): Promise<import("./product.entity").Product>;
    update(id: number, dto: CreateProductDto): Promise<import("./product.entity").Product>;
    remove(id: number): Promise<void>;
    recommendations(id: number, limit?: string): Promise<import("./products.service").Recommendations>;
}
