import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')                 // -> /api/orders
export class OrdersPublicController {
  constructor(private readonly orders: OrdersService) {}

  @Post()
  async create(@Body() dto: CreateOrderDto, @Req() req: any) {
    const userId = req?.user?.id ?? null;     // nếu có auth
    return this.orders.create(dto, userId);
  }

  // ✅ Thêm endpoint cho user xem đơn của chính họ
  @Get('my')
  async myOrders(@Req() req: any) {
    const userId = req?.user?.id ?? null;
    if (!Number.isInteger(Number(userId))) {
      // Chưa đăng nhập thì trả mảng rỗng cho an toàn
      return [];
    }
    return this.orders.findMine(Number(userId));
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

@Controller('admin/orders')          // -> /api/admin/orders
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




