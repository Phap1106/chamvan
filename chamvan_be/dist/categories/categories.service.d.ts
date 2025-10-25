import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoriesService {
    private readonly repo;
    constructor(repo: Repository<Category>);
    create(dto: CreateCategoryDto): Promise<Category>;
    findAll(): Promise<Category[]>;
    findBySlug(slug: string): Promise<Category>;
}
