
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product } from '../products/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private readonly itemRepo: Repository<OrderItem>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
  ) {}

  async create(dto: CreateOrderDto, userId: number | null) {
    const ids = dto.items.map((i) => Number(i.productId)).filter((x) => Number.isInteger(x));
    const prods = await this.productRepo.find({ where: { id: In(ids) } });

    const priceMap = new Map<number, number>(prods.map((p) => [p.id, Number(p.price) || 0]));
    const nameMap = new Map<number, string>(prods.map((p) => [p.id, p.name]));

    let subtotal = 0;
    const itemsData = dto.items.map((i) => {
      const pid = Number(i.productId);
      const qty = Number(i.qty) || 0;
      const unitPrice = priceMap.get(pid) ?? 0;
      const lineTotal = unitPrice * qty;
      subtotal += lineTotal;
      return { productId: pid, qty, unitPrice, lineTotal };
    });

    const order = this.orderRepo.create({
      customerName: dto.customerName,
      customerEmail: dto.customerEmail,
      customerPhone: dto.customerPhone ?? null,
      customerDob: dto.customerDob ?? null,
      shippingAddress: dto.shippingAddress ?? null,
      notes: dto.notes ?? null,
      subtotal,
      shippingFee: 0,
      total: subtotal,              // ✅ tổng = tạm tính + phí ship (hiện 0)
      status: 'chờ duyệt',
      userId: userId ?? null,
    });

    const saved = await this.orderRepo.save(order);

    const items = itemsData.map((d) => this.itemRepo.create({ ...d, order: saved }));
    await this.itemRepo.save(items);

    const withNames = items.map((i) => ({ ...i, name: nameMap.get(i.productId) }));
    return { ...saved, items: withNames };
  }

  async findOne(id: number) {
    if (!Number.isInteger(id)) throw new BadRequestException('Invalid id');

    const order = await this.orderRepo.findOne({ where: { id }, relations: ['items'] });
    if (!order) throw new NotFoundException('Order not found');

    const ids = order.items.map((i) => i.productId);
    const prods = await this.productRepo.find({ where: { id: In(ids) } });
    const nameMap = new Map<number, string>(prods.map((p) => [p.id, p.name]));

    (order.items as any) = order.items.map((i) => ({ ...i, name: nameMap.get(i.productId) }));
    return order;
  }

  // ✅ danh sách đơn của 1 user
  async findMine(userId: number) {
    if (!Number.isInteger(userId)) throw new BadRequestException('Invalid userId');

    const orders = await this.orderRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: ['items'],
    });

    if (!orders.length) return [];

    const ids = Array.from(new Set(orders.flatMap((o) => o.items.map((i) => i.productId))));
    const prods = ids.length ? await this.productRepo.find({ where: { id: In(ids) } }) : [];
    const nameMap = new Map<number, string>(prods.map((p) => [p.id, p.name]));

    return orders.map((o) => ({
      ...o,
      // chuẩn hoá lại items + tự đảm bảo tiền dòng → tránh lỗi định dạng
      items: o.items.map((i) => {
        const unitPrice = Number(i.unitPrice) || 0;
        const qty = Number(i.qty) || 0;
        const lineTotal = unitPrice * qty;
        return {
          ...i,
          name: nameMap.get(i.productId),
          unitPrice,
          qty,
          lineTotal,
        };
      }),
      // đảm bảo tổng tiền hợp lệ
      subtotal: o.items.reduce((s, it) => s + (Number(it.unitPrice) || 0) * (Number(it.qty) || 0), 0),
      total: (o.items.reduce((s, it) => s + (Number(it.unitPrice) || 0) * (Number(it.qty) || 0), 0)) + (Number(o.shippingFee) || 0),
    }));
  }

  async findAllForAdmin() {
    const orders = await this.orderRepo.find({
      order: { createdAt: 'DESC' },
      relations: ['items'],
    });

    const ids = Array.from(new Set(orders.flatMap((o) => o.items.map((i) => i.productId))));
    const prods = ids.length ? await this.productRepo.find({ where: { id: In(ids) } }) : [];
    const nameMap = new Map<number, string>(prods.map((p) => [p.id, p.name]));

    return orders.map((o) => ({
      ...o,
      items: o.items.map((i) => ({ ...i, name: nameMap.get(i.productId) })),
      // đồng nhất cách tính để FE/BE khớp
      subtotal: o.items.reduce((s, it) => s + (Number(it.unitPrice) || 0) * (Number(it.qty) || 0), 0),
      total: (o.items.reduce((s, it) => s + (Number(it.unitPrice) || 0) * (Number(it.qty) || 0), 0)) + (Number(o.shippingFee) || 0),
    }));
  }

  async updateStatus(id: number, body: { status?: string; eta?: string | null }) {
    if (!Number.isInteger(id)) throw new BadRequestException('Invalid id');

    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    if (body.status !== undefined) order.status = body.status;
    if (body.eta !== undefined) (order as any).eta = body.eta as any;

    await this.orderRepo.save(order);
    return order;
  }
}



