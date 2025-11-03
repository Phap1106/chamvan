// //src/orders/orders.controller.ts
// import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
// import { OrdersService } from './orders.service';
// import { CreateOrderDto } from './dto/create-order.dto';

// @Controller('orders')                 // -> /api/orders
// export class OrdersPublicController {
//   constructor(private readonly orders: OrdersService) {}

//   @Post()
//   async create(@Body() dto: CreateOrderDto, @Req() req: any) {
//     const userId = req?.user?.id ?? null;     // nếu có auth
//     return this.orders.create(dto, userId);
//   }

//   // ✅ Thêm endpoint cho user xem đơn của chính họ
//   @Get('my')
//   async myOrders(@Req() req: any) {
//     const userId = req?.user?.id ?? null;
//     if (!Number.isInteger(Number(userId))) {
//       // Chưa đăng nhập thì trả mảng rỗng cho an toàn
//       return [];
//     }
//     return this.orders.findMine(Number(userId));
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     const n = Number(id);
//     if (!Number.isInteger(n)) {
//       throw new BadRequestException('Invalid id');
//     }
//     return this.orders.findOne(n);
//   }
// }

// @Controller('admin/orders')          // -> /api/admin/orders
// export class OrdersAdminController {
//   constructor(private readonly orders: OrdersService) {}

//   @Get()
//   findAll() {
//     return this.orders.findAllForAdmin();
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() body: { status?: string; eta?: string | null }) {
//     const n = Number(id);
//     if (!Number.isInteger(n)) {
//       throw new BadRequestException('Invalid id');
//     }
//     return this.orders.updateStatus(n, body);
//   }
// }
















// src/orders/orders.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

@Controller('orders')                 // -> /api/orders
export class OrdersPublicController {
  constructor(private readonly orders: OrdersService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateOrderDto, @Req() req: any) {
    const userId = req?.user?.id ?? null;
    return this.orders.create(dto, userId);
  }



//  @UseGuards(JwtAuthGuard)
//   @Get('my')
//   async myOrders(@Req() req: any) {
//     if (process.env.AUTH_DEBUG === '1') {
//       console.log('[ORDERS] /orders/my req.user =', req?.user);
//     }
//     const userId = Number(req?.user?.id);
//     if (!Number.isInteger(userId)) {
//       throw new BadRequestException('Invalid user');
//     }
//     return this.orders.findMine(userId);
//   }


@UseGuards(JwtAuthGuard)
@Get('my')
async myOrders(@Req() req: any) {
  if (process.env.AUTH_DEBUG === '1') {
    console.log('[ORDERS] /orders/my req.user =', req?.user);
  }
  const userId = req?.user?.id as string;   // UUID string từ JWT
  if (!userId) throw new BadRequestException('Invalid user');

  return this.orders.findMine(userId);      // truyền string
}



  @Get(':id')
  findOne(@Param('id') id: string) {
    const n = Number(id);
    if (!Number.isInteger(n)) {
      throw new BadRequestException('Invalid id');
    }
    return this.orders.findOne(n);
  }
}

@Controller('admin/orders')
export class OrdersAdminController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  findAll() {
    return this.orders.findAllForAdmin();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: { status?: string; eta?: string | null }) {
    const n = Number(id);
    if (!Number.isInteger(n)) {
      throw new BadRequestException('Invalid id');
    }
    return this.orders.updateStatus(n, body);
  }
}
