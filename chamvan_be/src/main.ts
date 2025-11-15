// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { seed } from './seeds/seed';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Cookie parser để backend có thể đọc cookie từ request
  app.use(cookieParser());

  // Prefix /api để khớp FE
  app.setGlobalPrefix('api');

  /**
   * Allowed origins: chỉnh ở đây nếu cần (thêm domain tạm thời của vercel nếu cần)
   * Bạn có thể thay thế bằng process.env.ALLOWED_ORIGINS.split(',') nếu muốn quản lý bằng env.
   */
  const allowedOrigins = [
    'http://localhost:3000',    // dev
    'https://chamvan.com',      // production (FE)
    'https://www.chamvan.com',  // nếu dùng www
    // 'https://your-app.vercel.app', // thêm nếu cần
  ];

  // Enable CORS động — quan trọng: không dùng '*' khi credentials = true
  app.enableCors({
    origin: (origin, callback) => {
      // origin === undefined khi server-side call hoặc curl/postman (non-browser)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      logger.warn(`Blocked CORS origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
    credentials: true, // cần nếu dùng cookie-based auth cross-origin
  });

  /**
   * Optional debug middleware để in origin & cookie (bật khi debug)
   * Bỏ/điều chỉnh khi không cần in log nữa.
   */
  app.use((req, _res, next) => {
    if (process.env.CORS_DEBUG === '1') {
      logger.debug(`[DEBUG CORS] origin=${req.headers.origin} cookies=${req.headers.cookie}`);
    }
    next();
  });

  // (debug) log /api/orders/my nếu cần (giữ như trước)
  app.use('/api/orders/my', (req, _res, next) => {
    if (process.env.AUTH_DEBUG === '1') {
      const ck =
        req.cookies?.cv_token ||
        req.cookies?.cv_access_token ||
        req.cookies?.token ||
        null;
      logger.debug('[AUTH] >>> /api/orders/my ' + JSON.stringify({
        hasCookie: !!ck,
        cookieFirst16: ck?.slice?.(0, 16),
        authHeader: req.headers['authorization'],
      }));
    }
    next();
  });

  // Seed admin nếu cần
  if (process.env.SEED_ADMIN_ON_BOOT === '1') {
    const dataSource = app.get(DataSource);
    await seed(dataSource);
  }

  const port = process.env.PORT ? Number(process.env.PORT) : 4000;
  await app.listen(port);
  logger.log(`API server listening on port ${port}`);
}

bootstrap().catch((err) => {
  // ensure error shown clearly
  // eslint-disable-next-line no-console
  console.error('Fatal startup error:', err);
  process.exit(1);
});
