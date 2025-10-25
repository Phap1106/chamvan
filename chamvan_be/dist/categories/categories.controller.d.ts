import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoriesController {
    private readonly categories;
    constructor(categories: CategoriesService);
    create(dto: CreateCategoryDto): Promise<import("./category.entity").Category>;
    all(): Promise<import("./category.entity").Category[]>;
    bySlug(slug: string): Promise<import("./category.entity").Category>;
}
