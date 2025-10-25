
// // src/products/products.controller.ts
// import {
//   Controller, Get, Post, Patch, Delete, Param, Body, HttpCode, ParseIntPipe
// } from '@nestjs/common';
// import { ProductsService } from './products.service';
// import { CreateProductDto } from './dto/create-product.dto';

// @Controller('products') // <<< FE gọi BASE/products
// export class ProductsController {
//   constructor(private readonly service: ProductsService) {}

//   @Get()
//   findAll() {
//     return this.service.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id', ParseIntPipe) id: number) {
//     return this.service.findOne(id);
//   }

//   @Post()
//   create(@Body() dto: CreateProductDto) {
//     return this.service.create(dto);
//   }

//   @Patch(':id')
//   update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateProductDto) {
//     return this.service.update(id, dto);
//   }

//   @Delete(':id')
//   @HttpCode(204) // <<< FE trông đợi 204
//   async remove(@Param('id', ParseIntPipe) id: number) {
//     await this.service.remove(id);
//     // trả 204 No Content
//   }
// }











import {
  Controller, Get, Post, Patch, Delete, Param, Body, HttpCode, ParseIntPipe, Query
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products') // <<< FE gọi BASE/products
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateProductDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204) // <<< FE trông đợi 204
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    // trả 204 No Content
  }

  // ====== NEW: Recommendations ======
  // GET /products/:id/recommendations?limit=12
  @Get(':id/recommendations')
  recommendations(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit') limit?: string,
  ) {
    const n = Math.min(24, Math.max(4, Number(limit) || 12));
    return this.service.getRecommendations(id, n);
  }
}
