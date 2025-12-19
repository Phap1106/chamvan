// // chamvan_be/src/products/products.controller.ts
// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   Query,
//   HttpCode,
//   ParseIntPipe,
// } from '@nestjs/common';
// import { ProductsService } from './products.service';
// import { CreateProductDto } from './dto/create-product.dto';

// @Controller('products')
// export class ProductsController {
//   constructor(private readonly productsService: ProductsService) {}

//   @Post()
//   create(@Body() createProductDto: CreateProductDto) {
//     return this.productsService.create(createProductDto);
//   }

//   @Get()
//   findAll(@Query() query: any) {
//     return this.productsService.findAll();
//   }

//   // Hỗ trợ tìm cả theo ID (số) và Slug (chuỗi)
//   @Get(':term')
//   findOne(@Param('term') term: string) {
//     const isId = !isNaN(Number(term));
//     if (isId) {
//       return this.productsService.findOne(+term);
//     }
//     return this.productsService.findBySlug(term);
//   }

//   @Patch(':id')
//   update(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() updateProductDto: CreateProductDto,
//   ) {
//     return this.productsService.update(id, updateProductDto);
//   }

//   @Delete(':id')
//   @HttpCode(204)
//   async remove(@Param('id', ParseIntPipe) id: number) {
//     await this.productsService.remove(id);
//   }

//   // API Gợi ý sản phẩm
//   @Get(':id/recommendations')
//   recommendations(
//     @Param('id', ParseIntPipe) id: number,
//     @Query('limit') limit?: string,
//   ) {
//     const n = Math.min(24, Math.max(4, Number(limit) || 12));
//     return this.productsService.getRecommendations(id, n);
//   }
// }




// src/products/products.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

type UploadedImage = { url: string; thumb: string };

function ensureDir(p: string) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function safeBaseName(original: string) {
  const base = path.parse(original).name.replace(/[^a-zA-Z0-9_-]/g, '');
  return (base.slice(0, 40) || 'img').toLowerCase();
}

function yyyymmdd(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * UPLOAD ẢNH TỪ THIẾT BỊ
   * - multipart/form-data, field: files
   * - Lưu vào: /uploads/products/YYYYMMDD/
   * - Convert sang .webp (medium) + _thumb.webp
   * - Trả về URL dạng: /uploads/products/YYYYMMDD/xxx.webp
   *
   * FE workflow đề xuất:
   * 1) POST /api/products/upload -> nhận {files:[{url,thumb}]}
   * 2) POST/PATCH product -> lưu url vào image/images
   */
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const dir = path.join(process.cwd(), 'uploads', 'products', yyyymmdd());
          ensureDir(dir);
          cb(null, dir);
        },
        filename: (_req, file, cb) => {
          const stamp = Date.now();
          const rand = Math.random().toString(16).slice(2);
          const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
          cb(null, `${safeBaseName(file.originalname)}-${stamp}-${rand}${ext}`);
        },
      }),
      limits: { fileSize: 8 * 1024 * 1024 }, // 8MB/ảnh (tuỳ chỉnh)
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype?.startsWith('image/')) {
          return cb(new BadRequestException('File không phải ảnh'), false);
        }
        cb(null, true);
      },
    }),
  )
  async upload(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files?.length) throw new BadRequestException('Chưa có file ảnh');

    const out: UploadedImage[] = [];

    for (const f of files) {
      // f.path: .../uploads/products/YYYYMMDD/xxx.jpg
      const dir = path.dirname(f.path);
      const base = path.parse(f.filename).name;

      const mediumName = `${base}.webp`;
      const thumbName = `${base}_thumb.webp`;

      const mediumAbs = path.join(dir, mediumName);
      const thumbAbs = path.join(dir, thumbName);

      // Medium cho trang chi tiết (max 1400px)
      await sharp(f.path)
        .rotate()
        .resize({ width: 1400, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(mediumAbs);

      // Thumb cho list/related (360px)
      await sharp(f.path)
        .rotate()
        .resize({ width: 360, withoutEnlargement: true })
        .webp({ quality: 70 })
        .toFile(thumbAbs);

      // Xoá file gốc (jpg/png) để tiết kiệm dung lượng
      try {
        fs.unlinkSync(f.path);
      } catch {
        // ignore
      }

      // Rel path để client gọi được qua static /uploads
      // dir có dạng: .../<project>/uploads/products/YYYYMMDD
      let relDir = dir.replace(process.cwd(), '').replace(/\\/g, '/');
      if (!relDir.startsWith('/')) relDir = `/${relDir}`;

      out.push({
        url: `${relDir}/${mediumName}`.replace(/\/{2,}/g, '/'),
        thumb: `${relDir}/${thumbName}`.replace(/\/{2,}/g, '/'),
      });
    }

    return { files: out };
  }

  // CREATE
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // LIST (giữ đơn giản; nếu service bạn có filter/pagination thì cứ pass query vào)
  @Get()
  findAll(@Query() query: any) {
    // Nếu service bạn có nhận query: return this.productsService.findAll(query);
    return this.productsService.findAll();
  }

  /**
   * GET ONE theo id hoặc slug
   * - /products/123 -> id
   * - /products/tuong-tam-the... -> slug
   */
  @Get(':term')
  findOne(@Param('term') term: string) {
    const asNumber = Number(term);
    const isId = Number.isFinite(asNumber) && String(asNumber) === term;
    if (isId) return this.productsService.findOne(asNumber);
    return this.productsService.findBySlug(term);
  }

  // UPDATE
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: CreateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  // DELETE
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productsService.remove(id);
  }

  /**
   * RECOMMENDATIONS
   * /products/:id/recommendations?limit=12
   */
  @Get(':id/recommendations')
  recommendations(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit') limit?: string,
  ) {
    const n = Math.min(24, Math.max(4, Number(limit) || 12));
    return this.productsService.getRecommendations(id, n);
  }
}
