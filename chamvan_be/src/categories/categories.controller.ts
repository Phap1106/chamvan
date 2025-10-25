import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';


@Controller('categories')
export class CategoriesController {
constructor(private readonly categories: CategoriesService) {}


@Post()
create(@Body() dto: CreateCategoryDto) { return this.categories.create(dto); }


@Get()
all() { return this.categories.findAll(); }


@Get(':slug')
bySlug(@Param('slug') slug: string) { return this.categories.findBySlug(slug); }
}