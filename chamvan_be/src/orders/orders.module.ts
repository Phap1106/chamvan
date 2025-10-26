// // src/orders/orders.module.ts
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Order } from './order.entity';
// import { OrderItem } from './order-item.entity';
// import { Product } from '../products/product.entity'; // chỉnh path đúng dự án của bạn
// import { OrdersService } from './orders.service';
// import { OrdersPublicController, OrdersAdminController } from './orders.controller';

// @Module({
//   imports: [TypeOrmModule.forFeature([Order, OrderItem, Product])],
//   controllers: [OrdersPublicController, OrdersAdminController],
//   providers: [OrdersService],
// })
// export class OrdersModule {}




// src/orders/orders.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Product } from '../products/product.entity';
import { OrdersService } from './orders.service';
import { OrdersPublicController, OrdersAdminController } from './orders.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Product])],
  controllers: [OrdersPublicController, OrdersAdminController], // ✅ dùng đúng tên class
  providers: [OrdersService],
})
export class OrdersModule {}
