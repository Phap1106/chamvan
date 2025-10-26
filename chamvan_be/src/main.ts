// // src/main.ts
// import { ValidationPipe } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   // Prefix API (nếu bạn đang dùng)
//   app.setGlobalPrefix('api');

//   // ✅ Bật CORS cho FE chạy ở localhost:3000
//   app.enableCors({
//     origin: ['http://localhost:3000'],        // FE Next.js
//     methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
//     allowedHeaders: ['Content-Type','Authorization'],
//     credentials: true,                         // nếu dùng cookie/session
//   });

//   // Pipe validate chung
//   app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

//   // Lắng nghe cổng (BE nên 4000 để không trùng FE 3000)
//   await app.listen(process.env.PORT ? Number(process.env.PORT) : 4000);
// }
// bootstrap();








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
