import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private readonly repo: Repository<Category>) {}

  async create(dto: CreateCategoryDto) {
    const parentId = dto.parentId != null ? Number(dto.parentId) : undefined;

    const cat = this.repo.create({
      slug: dto.slug,
      name: dto.name,
      description: dto.description,
      parentId,                 // ✅ dùng parentId, KHÔNG phải 'parent'
    });

    return this.repo.save(cat);
  }

  async findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findBySlug(slug: string) {
    const cat = await this.repo.findOne({ where: { slug } });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }
}
