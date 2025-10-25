// src/main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefix API (nếu bạn đang dùng)
  app.setGlobalPrefix('api');

  // ✅ Bật CORS cho FE chạy ở localhost:3000
  app.enableCors({
    origin: ['http://localhost:3000'],        // FE Next.js
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: true,                         // nếu dùng cookie/session
  });

  // Pipe validate chung
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Lắng nghe cổng (BE nên 4000 để không trùng FE 3000)
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 4000);
}
bootstrap();
