import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import { DataSource } from 'typeorm';
import { seed } from './seeds/seed';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // 1. Cấu hình Prefix API
  app.setGlobalPrefix('api');

  // 2. Middleware xử lý dữ liệu
  app.use(cookieParser());
  // Tăng giới hạn upload để không bị lỗi khi gửi nhiều link ảnh
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  // 3. CẤU HÌNH CORS CHUẨN (Fix lỗi Not allowed)
  // Thay vì dùng callback phức tạp, ta dùng mảng domain trực tiếp
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://chamvan.com',
      'https://www.chamvan.com',
      'https://admin.chamvan.com' // Dự phòng cho tương lai
    ],
    credentials: true, // Quan trọng: Cho phép gửi Cookie/Token
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
  });

  // 4. Validation toàn cục
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidUnknownValues: false, // Giúp linh hoạt hơn với dữ liệu frontend gửi lên
    }),
  );

  // 5. Seed Admin (nếu bật)
  if (process.env.SEED_ADMIN_ON_BOOT === '1') {
    try {
      const dataSource = app.get(DataSource);
      await seed(dataSource);
      logger.log('Admin seeded successfully');
    } catch (e) {
      logger.error('Seeding failed', e);
    }
  }

  // 6. Khởi động Server
  const port = Number(process.env.PORT || 4000);
  await app.listen(port, '0.0.0.0');
  
  logger.log(\`✅ API ready on port \${port} (Prefix: /api)\`);
  logger.log(\`✅ CORS Enabled for: https://chamvan.com, http://localhost:3000\`);
}

bootstrap().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});