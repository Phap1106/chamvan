// src/orders/orders.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Product } from '../products/product.entity';
import { OrdersService } from './orders.service';
import { OrdersPublicController, OrdersAdminController } from './orders.controller';
import { ZaloModule } from 'src/integrations/zalo/zalo.module'; // hoặc đường dẫn tương đối đúng dự án của bạn
import { TelegramModule } from '../integrations/telegram/telegram.module';
import { User } from '../users/user.entity';

// @Module({
//   imports: [TypeOrmModule.forFeature([Order, OrderItem, Product])],
//   ZaloModule,
//   controllers: [OrdersPublicController, OrdersAdminController], // ✅ dùng đúng tên class
//   providers: [OrdersService],
// })
// export class OrdersModule {}



@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product,User]),
    ZaloModule,
    TelegramModule // ADD ✅
  ],
  controllers: [OrdersPublicController, OrdersAdminController],
  providers: [OrdersService],
    exports: [TypeOrmModule],
})
export class OrdersModule {}
