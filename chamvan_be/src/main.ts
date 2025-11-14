// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cookie parser
  app.use(cookieParser());

  // ✅ Thêm prefix /api để khớp FE
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: true,
  });

  // (debug) log /api/orders/my nếu cần
  app.use('/api/orders/my', (req, _res, next) => {
    if (process.env.AUTH_DEBUG === '1') {
      const ck =
        req.cookies?.cv_token ||
        req.cookies?.cv_access_token ||
        req.cookies?.token ||
        null;
      console.log('[AUTH] >>> /api/orders/my', {
        hasCookie: !!ck,
        cookieFirst16: ck?.slice?.(0, 16),
        authHeader: req.headers['authorization'],
      });
    }
    next();
  });

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
