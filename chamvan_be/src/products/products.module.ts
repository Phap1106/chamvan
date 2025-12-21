// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ProductsService } from './products.service';
// import { ProductsController } from './products.controller';
// import { Product } from './product.entity';
// import { ProductImage } from './product-image.entity';
// import { ProductColor } from './product-color.entity';
// import { ProductSpec } from './product-spec.entity';
// import { Category } from '../categories/category.entity';


// @Module({
// imports: [TypeOrmModule.forFeature([Product, ProductImage, ProductColor, ProductSpec, Category])],
// providers: [ProductsService],
// controllers: [ProductsController],
// })
// export class ProductsModule {}








// chamvan_be/src/products/products.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './product.entity';
import { ProductImage } from './product-image.entity';
import { ProductColor } from './product-color.entity';
import { ProductSpec } from './product-spec.entity';
import { Category } from '../categories/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage, ProductColor, ProductSpec, Category]),
    MulterModule.register({}), // dùng interceptor cấu hình diskStorage trực tiếp
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
