// // chamvan_be/src/app.module.ts
// import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ThrottlerModule , ThrottlerGuard } from '@nestjs/throttler';
// import {APP_GUARD} from '@nestjs/core';
// import { ormOpts } from './config/typeorm.config';
// import { ReturnsModule } from './returns/returns.module';
// import { UsersModule } from './users/users.module';
// import { AuthModule } from './auth/auth.module';
// import { CategoriesModule } from './categories/categories.module';
// import { ProductsModule } from './products/products.module';
// import { OrdersModule } from './orders/orders.module';
// import { TelegramModule } from './integrations/telegram/telegram.module';
// import { ReportsModule } from './reports/reports.module';
// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true }),
//     TypeOrmModule.forRoot(ormOpts),
//      ThrottlerModule.forRoot([
//       {
//         ttl: 60_000,
//         limit: 60,
//       },
//     ]),
//     UsersModule,
//     AuthModule,
//     CategoriesModule,
//     ProductsModule,
//     OrdersModule,
//     TelegramModule, 
//         ReportsModule,
//          ReturnsModule,
//   ],
//     providers: [
//     {
//       provide: APP_GUARD,
//       useClass: ThrottlerGuard,
//     },
//   ],
  
// }
// )
// export class AppModule {}






// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormOpts } from './config/typeorm.config';
import { ReturnsModule } from './returns/returns.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { TelegramModule } from './integrations/telegram/telegram.module';
import { ReportsModule } from './reports/reports.module';

import { ThrottlerGuard, ThrottlerModule, minutes } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(ormOpts),

    // Global rate limit (chống spam mọi API)
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          ttl: minutes(1), // 60000ms
          limit: 60,       // 60 req / IP / phút (global)
        },
      ],
    }),

    UsersModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    TelegramModule,
    ReportsModule,
    ReturnsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
