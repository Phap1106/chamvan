// // src/products/products.controller.ts
// import {
//   BadRequestException,
//   Body,
//   Controller,
//   Delete,
//   Get,
//   HttpCode,
//   Param,
//   ParseIntPipe,
//   Patch,
//   Post,
//   Query,
//   UploadedFiles,
//   UseInterceptors,
// } from '@nestjs/common';
// import { FilesInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import * as fs from 'fs';
// import * as path from 'path';
// import sharp from 'sharp';

// import { ProductsService } from './products.service';

// type UploadedImage = { url: string; thumb: string };

// function ensureDir(p: string) {
//   if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
// }
// function safeBaseName(original: string) {
//   const base = path.parse(original).name.replace(/[^a-zA-Z0-9_-]/g, '');
//   return (base.slice(0, 40) || 'img').toLowerCase();
// }
// function yyyymmdd(d = new Date()) {
//   const y = d.getFullYear();
//   const m = String(d.getMonth() + 1).padStart(2, '0');
//   const day = String(d.getDate()).padStart(2, '0');
//   return `${y}${m}${day}`;
// }

// @Controller('products')
// export class ProductsController {
//   constructor(private readonly productsService: ProductsService) {}

//   /** ✅ upload ảnh */
//   @Post('upload')
//   @UseInterceptors(
//     FilesInterceptor('files', 20, {
//       storage: diskStorage({
//         destination: (_req, _file, cb) => {
//           const dir = path.join(process.cwd(), 'uploads', 'products', yyyymmdd());
//           ensureDir(dir);
//           cb(null, dir);
//         },
//         filename: (_req, file, cb) => {
//           const stamp = Date.now();
//           const rand = Math.random().toString(16).slice(2);
//           const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
//           cb(null, `${safeBaseName(file.originalname)}-${stamp}-${rand}${ext}`);
//         },
//       }),
//       limits: { fileSize: 8 * 1024 * 1024 },
//       fileFilter: (_req, file, cb) => {
//         if (!file.mimetype?.startsWith('image/')) {
//           return cb(new BadRequestException('File không phải ảnh'), false);
//         }
//         cb(null, true);
//       },
//     }),
//   )
//   async upload(@UploadedFiles() files: Express.Multer.File[]) {
//     if (!files?.length) throw new BadRequestException('Chưa có file ảnh');

//     const out: UploadedImage[] = [];
//     for (const f of files) {
//       const dir = path.dirname(f.path);
//       const base = path.parse(f.filename).name;

//       const mediumName = `${base}.webp`;
//       const thumbName = `${base}_thumb.webp`;

//       const mediumAbs = path.join(dir, mediumName);
//       const thumbAbs = path.join(dir, thumbName);

//       const bg = { r: 245, g: 245, b: 245, alpha: 1 };

//       await sharp(f.path)
//         .rotate()
//         .resize({ width: 1400, height: 1400, fit: 'contain', background: bg, withoutEnlargement: true })
//         .webp({ quality: 82 })
//         .toFile(mediumAbs);

//       await sharp(f.path)
//         .rotate()
//         .resize({ width: 500, height: 500, fit: 'contain', background: bg, withoutEnlargement: true })
//         .webp({ quality: 72 })
//         .toFile(thumbAbs);

//       try { fs.unlinkSync(f.path); } catch {}

//       let relDir = dir.replace(process.cwd(), '').replace(/\\/g, '/');
//       if (!relDir.startsWith('/')) relDir = `/${relDir}`;

//       out.push({
//         url: `${relDir}/${mediumName}`.replace(/\/{2,}/g, '/'),
//         thumb: `${relDir}/${thumbName}`.replace(/\/{2,}/g, '/'),
//       });
//     }

//     return { files: out };
//   }

//   @Get(':id/recommendations')
//   recommendations(@Param('id', ParseIntPipe) id: number, @Query('limit') limit?: string) {
//     const n = Math.min(24, Math.max(4, Number(limit) || 12));
//     return this.productsService.getRecommendations(id, n);
//   }

//   @Post()
//   create(@Body() dto: any) {
//     // ✅ dto là plain object => không bị whitelist strip
//     return this.productsService.create(dto);
//   }

//   @Get()
//   findAll() {
//     return this.productsService.findAll();
//   }

//   @Get(':term')
//   findOne(@Param('term') term: string) {
//     const asNumber = Number(term);
//     const isId = Number.isFinite(asNumber) && String(asNumber) === term;
//     if (isId) return this.productsService.findOne(asNumber);
//     return this.productsService.findBySlug(term);
//   }

//   @Patch(':id')
//   update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
//     return this.productsService.update(id, dto);
//   }

//   @Delete(':id')
//   @HttpCode(204)
//   async remove(@Param('id', ParseIntPipe) id: number) {
//     await this.productsService.remove(id);
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
import { diskStorage } from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
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
   * ✅ Upload ảnh: luôn trả về URL /uploads/... (không base64)
   * ✅ Fix lỗi sharp: "Cannot use same file for input and output"
   *   (khi upload file .webp => input và output trùng tên)
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

          // ✅ luôn lưu file gốc với suffix _src để tránh trùng output .webp
          cb(null, `${safeBaseName(file.originalname)}-${stamp}-${rand}_src${ext}`);
        },
      }),
      limits: { fileSize: 8 * 1024 * 1024 },
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
      const dir = path.dirname(f.path);

      // f.filename: xxx_src.jpg/png/webp...
      const rawBase = path.parse(f.filename).name;
      const base = rawBase.endsWith('_src') ? rawBase.slice(0, -4) : rawBase;

      // ✅ output KHÁC input tuyệt đối
      const mediumName = `${base}_m.webp`;
      const thumbName = `${base}_thumb.webp`;

      const mediumAbs = path.join(dir, mediumName);
      const thumbAbs = path.join(dir, thumbName);

      const bg = { r: 245, g: 245, b: 245, alpha: 1 };

      await sharp(f.path)
        .rotate()
        .resize({
          width: 1400,
          height: 1400,
          fit: 'contain',
          background: bg,
          withoutEnlargement: true,
        })
        .webp({ quality: 82 })
        .toFile(mediumAbs);

      await sharp(f.path)
        .rotate()
        .resize({
          width: 500,
          height: 500,
          fit: 'contain',
          background: bg,
          withoutEnlargement: true,
        })
        .webp({ quality: 72 })
        .toFile(thumbAbs);

      // xoá file gốc _src.*
      try {
        fs.unlinkSync(f.path);
      } catch {}

      // dir tuyệt đối => /uploads/...
      let relDir = dir.replace(process.cwd(), '').replace(/\\/g, '/');
      if (!relDir.startsWith('/')) relDir = `/${relDir}`;

      out.push({
        url: `${relDir}/${mediumName}`.replace(/\/{2,}/g, '/'),
        thumb: `${relDir}/${thumbName}`.replace(/\/{2,}/g, '/'),
      });
    }

    return { files: out };
  }

  @Get(':id/recommendations')
  recommendations(@Param('id', ParseIntPipe) id: number, @Query('limit') limit?: string) {
    const n = Math.min(24, Math.max(4, Number(limit) || 12));
    return this.productsService.getRecommendations(id, n);
  }

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  findAll(@Query('q') q?: string, @Query('category') category?: string) {
    return this.productsService.findAll({ q, category });
  }

  /**
   * term có thể là:
   * - id (number)
   * - slug (string)
   */
  @Get(':term')
  findOne(@Param('term') term: string) {
    const asNumber = Number(term);
    const isId = Number.isFinite(asNumber) && String(asNumber) === term;
    if (isId) return this.productsService.findOne(asNumber);
    return this.productsService.findBySlug(term);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productsService.remove(id);
  }
}
