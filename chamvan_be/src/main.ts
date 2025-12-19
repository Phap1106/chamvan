
// // src/main.ts
// import 'dotenv/config';
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe, Logger } from '@nestjs/common';
// import cookieParser from 'cookie-parser';
// import { json, urlencoded } from 'express';
// import { DataSource } from 'typeorm';
// import { seed } from './seeds/seed';
// import { NestExpressApplication } from '@nestjs/platform-express';

// async function bootstrap() {
//   const logger = new Logger('Bootstrap');

//   const app = await NestFactory.create<NestExpressApplication>(AppModule);

//   app.set('trust proxy', true);
//   app.setGlobalPrefix('api');

//   const BODY_LIMIT = process.env.BODY_LIMIT || '50mb'; // ✅ tăng limit (base64 rất nặng)

//   app.use(cookieParser());
//   app.use(json({ limit: BODY_LIMIT }));
//   app.use(urlencoded({ extended: true, limit: BODY_LIMIT }));

//   // ✅ trả về 413 rõ ràng khi payload quá lớn (thay vì lỗi mơ hồ)
//   app.use((err: any, _req: any, res: any, next: any) => {
//     if (err?.type === 'entity.too.large') {
//       return res.status(413).json({
//         message: 'Payload too large (ảnh/base64 quá nặng). Hãy giảm dung lượng ảnh hoặc giảm số ảnh.',
//       });
//     }
//     return next(err);
//   });

//   app.enableCors({
//     origin: [
//       'http://localhost:3000',
//       'http://localhost:3001',
//       'https://chamvan.com',
//       'https://www.chamvan.com',
//       'https://admin.chamvan.com',
//     ],
//     credentials: true,
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//     allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
//   });

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       transform: true,
//       transformOptions: { enableImplicitConversion: true },
//       forbidUnknownValues: false,
//     }),
//   );

//   if (process.env.SEED_ADMIN_ON_BOOT === '1') {
//     try {
//       const dataSource = app.get(DataSource);
//       await seed(dataSource);
//       logger.log('Admin seeded successfully');
//     } catch (e) {
//       logger.error('Seeding failed', e as any);
//     }
//   }

//   const port = Number(process.env.PORT || 4000);
//   await app.listen(port, '0.0.0.0');
//   logger.log(`✅ API ready on port ${port} (Prefix: /api)`);
// }

// bootstrap().catch((err) => {
//   // eslint-disable-next-line no-console
//   console.error('Fatal startup error:', err);
//   process.exit(1);
// });



// src/main.ts
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import { DataSource } from 'typeorm';
import { seed } from './seeds/seed';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('trust proxy', true);
  app.setGlobalPrefix('api');

  // ✅ Serve static uploads (quan trọng: đặt trước listen)
  // URL public sẽ là: https://api.chamvan.com/uploads/...
  app.useStaticAssets(path.join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  const BODY_LIMIT = process.env.BODY_LIMIT || '50mb';

  app.use(cookieParser());
  app.use(json({ limit: BODY_LIMIT }));
  app.use(urlencoded({ extended: true, limit: BODY_LIMIT }));

  // ✅ trả về 413 rõ ràng khi payload quá lớn
  app.use((err: any, _req: any, res: any, next: any) => {
    if (err?.type === 'entity.too.large') {
      return res.status(413).json({
        message:
          'Payload too large (ảnh/base64 quá nặng). Hãy giảm dung lượng ảnh hoặc giảm số ảnh.',
      });
    }
    return next(err);
  });

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://chamvan.com',
      'https://www.chamvan.com',
      'https://admin.chamvan.com',
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidUnknownValues: false,
    }),
  );

  if (process.env.SEED_ADMIN_ON_BOOT === '1') {
    try {
      const dataSource = app.get(DataSource);
      await seed(dataSource);
      logger.log('Admin seeded successfully');
    } catch (e) {
      logger.error('Seeding failed', e as any);
    }
  }

  const port = Number(process.env.PORT || 4000);
  await app.listen(port, '0.0.0.0');
  logger.log(`✅ API ready on port ${port} (Prefix: /api)`);
  logger.log(`📦 Static uploads served at /uploads/*`);
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Fatal startup error:', err);
  process.exit(1);
});
