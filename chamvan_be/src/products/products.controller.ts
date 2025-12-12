// chamvan_be/src/products/products.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.productsService.findAll();
  }

  // Hỗ trợ tìm cả theo ID (số) và Slug (chuỗi)
  @Get(':term')
  findOne(@Param('term') term: string) {
    const isId = !isNaN(Number(term));
    if (isId) {
      return this.productsService.findOne(+term);
    }
    return this.productsService.findBySlug(term);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: CreateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productsService.remove(id);
  }

  // API Gợi ý sản phẩm
  @Get(':id/recommendations')
  recommendations(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit') limit?: string,
  ) {
    const n = Math.min(24, Math.max(4, Number(limit) || 12));
    return this.productsService.getRecommendations(id, n);
  }
}