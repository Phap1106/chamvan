// // src/orders/orders.controller.ts
// import {
//   BadRequestException,
//   Body,
//   Controller,
//   Get,
//   Param,
//   Patch,
//   Post,
//   Req,
//   UseGuards,
// } from '@nestjs/common';
// import { OrdersService } from './orders.service';
// import { CreateOrderDto } from './dto/create-order.dto';
// import { JwtAuthGuard } from 'src/auth/jwt.guard';
// import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

// @Controller('orders')                 // -> /api/orders
// export class OrdersPublicController {
//   constructor(private readonly orders: OrdersService) {}

//   @UseGuards(OptionalJwtAuthGuard)
//   @Post()
//   async create(@Body() dto: CreateOrderDto, @Req() req: any) {
//     const userId = req?.user?.id ?? null;
//     return this.orders.create(dto, userId);
//   }

// @UseGuards(JwtAuthGuard)
// @Get('my')
// async myOrders(@Req() req: any) {
//   if (process.env.AUTH_DEBUG === '1') {
//     console.log('[ORDERS] /orders/my req.user =', req?.user);
//   }
//   const userId = req?.user?.id as string;   // UUID string từ JWT
//   if (!userId) throw new BadRequestException('Invalid user');

//   return this.orders.findMine(userId);      // truyền string
// }



//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     const n = Number(id);
//     if (!Number.isInteger(n)) {
//       throw new BadRequestException('Invalid id');
//     }
//     return this.orders.findOne(n);
//   }
// }

// @Controller('admin/orders')
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






// // src/orders/orders.controller.ts
// import {
//   BadRequestException,
//   Body,
//   Controller,
//   Get,
//   Param,
//   Patch,
//   Post,
//   Req,
//   UseGuards,
// } from '@nestjs/common';
// import type { Request } from 'express';
// import { Throttle } from '@nestjs/throttler';

// import { OrdersService } from './orders.service';
// import { CreateOrderDto } from './dto/create-order.dto';
// import { JwtAuthGuard } from 'src/auth/jwt.guard';
// import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

// function getClientIp(req: Request): string {
//   const fwd = (req.headers['x-forwarded-for'] as string | undefined) ?? '';
//   const ipFromFwd = fwd.split(',')[0]?.trim();
//   return (
//     ipFromFwd ||
//     (req.ip as any) ||
//     (req.socket?.remoteAddress as any) ||
//     ((req.connection as any)?.remoteAddress as any) ||
//     'unknown'
//   );
// }

// @Controller('orders') // /api/orders (nếu bạn set global prefix /api)
// export class OrdersPublicController {
//   constructor(private readonly orders: OrdersService) {}

//   // ✅ Guest được tạo đơn, nhưng siết rate-limit riêng cho create
//   @UseGuards(OptionalJwtAuthGuard)
//   @Throttle({ default: { ttl: 60, limit: 5 } }) // 5 req / IP / 60s
//   @Post()
//   async create(@Body() dto: CreateOrderDto, @Req() req: Request) {
//     const userId = (req as any)?.user?.id ?? null;

//     const ip = getClientIp(req);
//     const userAgent = (req.headers['user-agent'] as string | undefined) ?? null;

//      // ✅ debug 1 lần để chắc chắn có ip
//     if (process.env.ORDER_IP_DEBUG === '1') {
//       console.log('[orders.create] ip=', ip, 'ua=', userAgent, 'x-forwarded-for=', req.headers['x-forwarded-for']);
//     }


//     return this.orders.create(dto, userId, { ip, userAgent });
//   }

//   @UseGuards(JwtAuthGuard)
//   @Get('my')
//   async myOrders(@Req() req: any) {
//     const userId = req?.user?.id as string;
//     if (!userId) throw new BadRequestException('Invalid user');
//     return this.orders.findMine(userId);
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     const n = Number(id);
//     if (!Number.isInteger(n)) throw new BadRequestException('Invalid id');
//     return this.orders.findOne(n);
//   }
// }

// @Controller('admin/orders')
// export class OrdersAdminController {
//   constructor(private readonly orders: OrdersService) {}

//   // (Nếu bạn đã có guard/role cho admin ở tầng khác thì giữ nguyên.
//   // Nếu chưa có, bạn nên bọc JwtAuthGuard + role guard riêng.)
//   @Get()
//   findAll() {
//     return this.orders.findAllForAdmin();
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() body: { status?: string; eta?: string | null }) {
//     const n = Number(id);
//     if (!Number.isInteger(n)) throw new BadRequestException('Invalid id');
//     return this.orders.updateStatus(n, body);
//   }
// }











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
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';

function getClientIp(req: Request): { ip: string | null; forwardedFor: string | null } {
  const xff = (req.headers['x-forwarded-for'] as string | undefined) ?? null;
  const forwardedFor = xff ? xff : null;

  const ip =
    (xff ? xff.split(',')[0].trim() : '') ||
    (req.ip as any) ||
    (req.socket?.remoteAddress as any) ||
    null;

  return { ip: ip || null, forwardedFor };
}

@Controller('orders') // -> /api/orders
export class OrdersPublicController {
  constructor(private readonly orders: OrdersService) {}

  // Guest được phép đặt đơn, nhưng siết mạnh route tạo đơn
  @UseGuards(OptionalJwtAuthGuard)
  @Throttle({ default: { ttl: 60, limit: 5 } })
  @Post()
  async create(@Body() dto: CreateOrderDto, @Req() req: Request) {
    const userId = (req as any)?.user?.id ?? null;

    const { ip, forwardedFor } = getClientIp(req);
    const userAgent = (req.headers['user-agent'] as string | undefined) ?? null;

    return this.orders.create(dto, userId, { ip, userAgent, forwardedFor });
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async myOrders(@Req() req: any) {
    if (process.env.AUTH_DEBUG === '1') {
      // eslint-disable-next-line no-console
      console.log('[ORDERS] /orders/my req.user =', req?.user);
    }
    const userId = req?.user?.id as string;
    if (!userId) throw new BadRequestException('Invalid user');
    return this.orders.findMine(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const n = Number(id);
    if (!Number.isInteger(n)) throw new BadRequestException('Invalid id');
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
    if (!Number.isInteger(n)) throw new BadRequestException('Invalid id');
    return this.orders.updateStatus(n, body);
  }
}
