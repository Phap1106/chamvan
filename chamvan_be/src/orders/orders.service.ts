// // //src/orders/orders.service.ts

// import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { In, Repository } from 'typeorm';
// import { Order } from './order.entity';
// import { OrderItem } from './order-item.entity';
// import { CreateOrderDto } from './dto/create-order.dto';
// import { Product } from '../products/product.entity';
// import { ZaloService } from 'src/integrations/zalo/zalo.service'; // hoặc đường dẫn tương đối tới zalo.service.ts

// @Injectable()
// export class OrdersService {
//   constructor(
//     @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
//     @InjectRepository(OrderItem) private readonly itemRepo: Repository<OrderItem>,
//     @InjectRepository(Product) private readonly productRepo: Repository<Product>,
//     private readonly zalo: ZaloService,
//   ) {}

//   async create(dto: CreateOrderDto, userId: number | null) {
//     const ids = dto.items.map((i) => Number(i.productId)).filter((x) => Number.isInteger(x));
//     const prods = ids.length ? await this.productRepo.find({ where: { id: In(ids) } }) : [];

//     const priceMap = new Map<number, number>(prods.map((p) => [p.id, Number(p.price) || 0]));
//     const nameMap = new Map<number, string>(prods.map((p) => [p.id, p.name]));

//     let subtotal = 0;
//     const itemsData = dto.items.map((i) => {
//       const pid = Number(i.productId);
//       const qty = Number(i.qty) || 0;
//       const unitPrice = priceMap.get(pid) ?? 0;
//       const lineTotal = unitPrice * qty;
//       subtotal += lineTotal;
//       return { productId: pid, qty, unitPrice, lineTotal };
//     });

//     const order = this.orderRepo.create({
//       customerName: dto.customerName,
//       customerEmail: dto.customerEmail,
//       customerPhone: dto.customerPhone ?? null,
//       customerDob: dto.customerDob ?? null,
//       shippingAddress: dto.shippingAddress ?? null,
//       notes: dto.notes ?? null,
//       subtotal,
//       shippingFee: 0,
//       total: subtotal,
//       status: 'chờ duyệt',
//       userId: userId ?? null,
//     });

//     const saved = await this.orderRepo.save(order);

//     const items = itemsData.map((d) => this.itemRepo.create({ ...d, order: saved }));
//     await this.itemRepo.save(items);

//     const withNames = items.map((i) => ({ ...i, name: nameMap.get(i.productId) }));
//     return { ...saved, items: withNames };
//   }

//   async findOne(id: number) {
//     if (!Number.isInteger(id)) throw new BadRequestException('Invalid id');

//     const order = await this.orderRepo.findOne({ where: { id }, relations: ['items'] });
//     if (!order) throw new NotFoundException('Order not found');

//     const ids = order.items.map((i) => i.productId);
//     const prods = ids.length ? await this.productRepo.find({ where: { id: In(ids) } }) : [];
//     const nameMap = new Map<number, string>(prods.map((p) => [p.id, p.name]));

//     (order.items as any) = order.items.map((i) => ({ ...i, name: nameMap.get(i.productId) }));
//     return order;
//   }

//   async findMine(userId: number) {
//     if (!Number.isInteger(userId)) throw new BadRequestException('Invalid userId');

//     const orders = await this.orderRepo.find({
//       where: { userId },
//       order: { createdAt: 'DESC' },
//       relations: ['items'],
//     });

//     if (!orders.length) return [];

//     const ids = Array.from(new Set(orders.flatMap((o) => o.items.map((i) => i.productId))));
//     const prods = ids.length ? await this.productRepo.find({ where: { id: In(ids) } }) : [];
//     const nameMap = new Map<number, string>(prods.map((p) => [p.id, p.name]));

//     return orders.map((o) => {
//       const items = o.items.map((i) => {
//         const unitPrice = Number(i.unitPrice) || 0;
//         const qty = Number(i.qty) || 0;
//         const lineTotal = unitPrice * qty;
//         return { ...i, name: nameMap.get(i.productId), unitPrice, qty, lineTotal };
//       });
//       const subtotal = items.reduce((s, it) => s + it.lineTotal, 0);
//       const shippingFee = Number(o.shippingFee) || 0;
//       const total = subtotal + shippingFee;
//       return { ...o, items, subtotal, total };
//     });
//   }

//   async findAllForAdmin() {
//     const orders = await this.orderRepo.find({
//       order: { createdAt: 'DESC' },
//       relations: ['items'],
//     });

//     const ids = Array.from(new Set(orders.flatMap((o) => o.items.map((i) => i.productId))));
//     const prods = ids.length ? await this.productRepo.find({ where: { id: In(ids) } }) : [];
//     const nameMap = new Map<number, string>(prods.map((p) => [p.id, p.name]));

//     return orders.map((o) => {
//       const items = o.items.map((i) => {
//         const unitPrice = Number(i.unitPrice) || 0;
//         const qty = Number(i.qty) || 0;
//         const lineTotal = unitPrice * qty;
//         return { ...i, name: nameMap.get(i.productId), unitPrice, qty, lineTotal };
//       });
//       const subtotal = items.reduce((s, it) => s + it.lineTotal, 0);
//       const shippingFee = Number(o.shippingFee) || 0;
//       const total = subtotal + shippingFee;
//       return { ...o, items, subtotal, total };
//     });
//   }

//   async updateStatus(id: number, body: { status?: string; eta?: string | null }) {
//     if (!Number.isInteger(id)) throw new BadRequestException('Invalid id');

//     const order = await this.orderRepo.findOne({ where: { id } });
//     if (!order) throw new NotFoundException('Order not found');

//     if (body.status !== undefined) order.status = body.status;
//     if (body.eta !== undefined) (order as any).eta = body.eta as any;

//     await this.orderRepo.save(order);
//     return order;
//   }
// }












// // //src/orders/orders.service.ts

// import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { In, Repository } from 'typeorm';
// import { Order } from './order.entity';
// import { OrderItem } from './order-item.entity';
// import { CreateOrderDto } from './dto/create-order.dto';
// import { Product } from '../products/product.entity';
// import { ZaloService } from 'src/integrations/zalo/zalo.service'; // hoặc đường dẫn tương đối tới zalo.service.ts
// import { TelegramService } from '../integrations/telegram/telegram.service';

// @Injectable()
// export class OrdersService {
//   constructor(
//     @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
//     @InjectRepository(OrderItem) private readonly itemRepo: Repository<OrderItem>,
//     @InjectRepository(Product) private readonly productRepo: Repository<Product>,
//     private readonly zalo: ZaloService,
//     private readonly telegram: TelegramService,
    
//   ) {}

//   async create(dto: CreateOrderDto, userId: number | null) {
//     const ids = dto.items.map((i) => Number(i.productId)).filter((x) => Number.isInteger(x));
//     const prods = ids.length ? await this.productRepo.find({ where: { id: In(ids) } }) : [];

//     const priceMap = new Map<number, number>(prods.map((p) => [p.id, Number(p.price) || 0]));
//     const nameMap = new Map<number, string>(prods.map((p) => [p.id, p.name]));

//     let subtotal = 0;
//     const itemsData = dto.items.map((i) => {
//       const pid = Number(i.productId);
//       const qty = Number(i.qty) || 0;
//       const unitPrice = priceMap.get(pid) ?? 0;
//       const lineTotal = unitPrice * qty;
//       subtotal += lineTotal;
//       return { productId: pid, qty, unitPrice, lineTotal };
//     });

//     const order = this.orderRepo.create({
//       customerName: dto.customerName,
//       customerEmail: dto.customerEmail,
//       customerPhone: dto.customerPhone ?? null,
//       customerDob: dto.customerDob ?? null,
//       shippingAddress: dto.shippingAddress ?? null,
//       notes: dto.notes ?? null,
//       subtotal,
//       shippingFee: 0,
//       total: subtotal,
//       status: 'chờ duyệt',
//       userId: userId ?? null,
//     });

//     const saved = await this.orderRepo.save(order);

//     const items = itemsData.map((d) => this.itemRepo.create({ ...d, order: saved }));
//     await this.itemRepo.save(items);

//     const withNames = items.map((i) => ({ ...i, name: nameMap.get(i.productId) }));

//     // ---- ADD: tạo biến result để có thể hook gửi Zalo trước khi return
//     const result = { ...saved, items: withNames };

//     // ADD — nếu đơn tạo ra đã ở trạng thái thành công (tuỳ flow của bạn)
//     try {
//       if (this.isSuccessStatus((result as any).status)) {
//         await this.notifyAdminsOrderSuccessSafe(result as any);
//       }
//     } catch {}

//     return result;
//   }

//   async findOne(id: number) {
//     if (!Number.isInteger(id)) throw new BadRequestException('Invalid id');

//     const order = await this.orderRepo.findOne({ where: { id }, relations: ['items'] });
//     if (!order) throw new NotFoundException('Order not found');

//     const ids = order.items.map((i) => i.productId);
//     const prods = ids.length ? await this.productRepo.find({ where: { id: In(ids) } }) : [];
//     const nameMap = new Map<number, string>(prods.map((p) => [p.id, p.name]));

//     (order.items as any) = order.items.map((i) => ({ ...i, name: nameMap.get(i.productId) }));
//     return order;
//   }

//   async findMine(userId: number) {
//     if (!Number.isInteger(userId)) throw new BadRequestException('Invalid userId');

//     const orders = await this.orderRepo.find({
//       where: { userId },
//       order: { createdAt: 'DESC' },
//       relations: ['items'],
//     });

//     if (!orders.length) return [];

//     const ids = Array.from(new Set(orders.flatMap((o) => o.items.map((i) => i.productId))));
//     const prods = ids.length ? await this.productRepo.find({ where: { id: In(ids) } }) : [];
//     const nameMap = new Map<number, string>(prods.map((p) => [p.id, p.name]));

//     return orders.map((o) => {
//       const items = o.items.map((i) => {
//         const unitPrice = Number(i.unitPrice) || 0;
//         const qty = Number(i.qty) || 0;
//         const lineTotal = unitPrice * qty;
//         return { ...i, name: nameMap.get(i.productId), unitPrice, qty, lineTotal };
//       });
//       const subtotal = items.reduce((s, it) => s + it.lineTotal, 0);
//       const shippingFee = Number(o.shippingFee) || 0;
//       const total = subtotal + shippingFee;
//       return { ...o, items, subtotal, total };
//     });
//   }

//   async findAllForAdmin() {
//     const orders = await this.orderRepo.find({
//       order: { createdAt: 'DESC' },
//       relations: ['items'],
//     });

//     const ids = Array.from(new Set(orders.flatMap((o) => o.items.map((i) => i.productId))));
//     const prods = ids.length ? await this.productRepo.find({ where: { id: In(ids) } }) : [];
//     const nameMap = new Map<number, string>(prods.map((p) => [p.id, p.name]));

//     return orders.map((o) => {
//       const items = o.items.map((i) => {
//         const unitPrice = Number(i.unitPrice) || 0;
//         const qty = Number(i.qty) || 0;
//         const lineTotal = unitPrice * qty;
//         return { ...i, name: nameMap.get(i.productId), unitPrice, qty, lineTotal };
//       });
//       const subtotal = items.reduce((s, it) => s + it.lineTotal, 0);
//       const shippingFee = Number(o.shippingFee) || 0;
//       const total = subtotal + shippingFee;
//       return { ...o, items, subtotal, total };
//     });
//   }

//   async updateStatus(id: number, body: { status?: string; eta?: string | null }) {
//     if (!Number.isInteger(id)) throw new BadRequestException('Invalid id');

//     const order = await this.orderRepo.findOne({ where: { id } });
//     if (!order) throw new NotFoundException('Order not found');

//     if (body.status !== undefined) order.status = body.status;
//     if (body.eta !== undefined) (order as any).eta = body.eta as any;

//     await this.orderRepo.save(order);
//     return order;
//   }

//   // ====================== ADD: Helpers cho notify Zalo ======================

//   // ADD — xác định các trạng thái coi là "thành công"
//   private isSuccessStatus(status?: string) {
//     if (!status) return false;
//     const ok = ['paid', 'success', 'confirmed', 'completed']; // tuỳ hệ thống của bạn
//     return ok.includes(String(status).toLowerCase());
//   }

//   // ADD — đảm bảo có đủ dữ liệu để render template (name sản phẩm, v.v.)
//   private async enrichOrderForNotify(orderId: number) {
//     const order = await this.orderRepo.findOne({
//       where: { id: orderId },
//       relations: ['items'],
//     });
//     if (!order) throw new Error('Order not found');

//     // Đảm bảo mỗi item có name; nếu OrderItem chưa lưu sẵn name thì map từ Product
//     const needNames = order.items.some((i: any) => !i.name);
//     if (needNames) {
//       const ids = order.items
//         .map((i: any) => Number(i.productId))
//         .filter((x: any) => Number.isInteger(x));
//       if (ids.length) {
//         const prods = await this.productRepo.find({ where: { id: In(ids) } });
//         const nameMap = new Map(prods.map((p: any) => [p.id, (p as any).name ?? `SP #${p.id}`]));
//         (order.items as any) = order.items.map((i: any) => ({
//           ...i,
//           name: i.name ?? nameMap.get(i.productId) ?? `SP #${i.productId}`,
//         }));
//       }
//     }

//     // Chuẩn hoá vài field popular mà ZaloService.expect
//     return {
//       ...order,
//       code: (order as any).code ?? order.id,
//       paidAt: (order as any).paidAt ?? undefined,
//       user: (order as any).user ?? null,
//     };
//   }

//   // ADD — dùng khi create() đã có object result nhưng có thể thiếu name sản phẩm
//   private async notifyAdminsOrderSuccessSafe(orderLike: any) {
//     const hasAllNames =
//       Array.isArray(orderLike?.items) && orderLike.items.every((i: any) => !!i?.name);
//     if (!hasAllNames || !orderLike?.id) {
//       const full = await this.enrichOrderForNotify(orderLike.id);
//       return this.zalo.notifyAdminsOrderSuccess(full);
//     }
//     return this.zalo.notifyAdminsOrderSuccess(orderLike);
//   }
// }













// //src/orders/orders.service.ts

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product } from '../products/product.entity';

// Giữ nguyên import ZaloService (không dùng) để không phá file/module khác
import { ZaloService } from 'src/integrations/zalo/zalo.service';
import { TelegramService } from '../integrations/telegram/telegram.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private readonly itemRepo: Repository<OrderItem>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,

    private readonly zalo: ZaloService,           // giữ nguyên
    private readonly telegram: TelegramService,   // dùng để gửi thông báo
  ) {}

  async create(dto: CreateOrderDto, userId: number | null) {
    const ids = dto.items.map((i) => Number(i.productId)).filter((x) => Number.isInteger(x));
    const prods = ids.length ? await this.productRepo.find({ where: { id: In(ids) } }) : [];

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
      total: subtotal,
      status: 'chờ duyệt',          // trạng thái mặc định
      userId: userId ?? null,
    });

    const saved = await this.orderRepo.save(order);

    const items = itemsData.map((d) => this.itemRepo.create({ ...d, order: saved }));
    await this.itemRepo.save(items);

    const withNames = items.map((i) => ({ ...i, name: nameMap.get(i.productId) }));

    // Kết quả trả về
    const result = { ...saved, items: withNames };

    // ✅ Gửi thông báo Telegram NGAY khi tạo đơn ở trạng thái "chờ duyệt"
    // (không kiểm tra isSuccessStatus, vì yêu cầu là gửi lúc vừa đặt thành công → chờ duyệt)
    try {
      await this.notifyAdminsOrderCreatedSafe(result as any);
    } catch {}

    return result;
  }

  async findOne(id: number) {
    if (!Number.isInteger(id)) throw new BadRequestException('Invalid id');

    const order = await this.orderRepo.findOne({ where: { id }, relations: ['items'] });
    if (!order) throw new NotFoundException('Order not found');

    const ids = order.items.map((i) => i.productId);
    const prods = ids.length ? await this.productRepo.find({ where: { id: In(ids) } }) : [];
    const nameMap = new Map<number, string>(prods.map((p) => [p.id, p.name]));

    (order.items as any) = order.items.map((i) => ({ ...i, name: nameMap.get(i.productId) }));
    return order;
  }

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

    return orders.map((o) => {
      const items = o.items.map((i) => {
        const unitPrice = Number(i.unitPrice) || 0;
        const qty = Number(i.qty) || 0;
        const lineTotal = unitPrice * qty;
        return { ...i, name: nameMap.get(i.productId), unitPrice, qty, lineTotal };
      });
      const subtotal = items.reduce((s, it) => s + it.lineTotal, 0);
      const shippingFee = Number(o.shippingFee) || 0;
      const total = subtotal + shippingFee;
      return { ...o, items, subtotal, total };
    });
  }

  async findAllForAdmin() {
    const orders = await this.orderRepo.find({
      order: { createdAt: 'DESC' },
      relations: ['items'],
    });

    const ids = Array.from(new Set(orders.flatMap((o) => o.items.map((i) => i.productId))));
    const prods = ids.length ? await this.productRepo.find({ where: { id: In(ids) } }) : [];
    const nameMap = new Map<number, string>(prods.map((p) => [p.id, p.name]));

    return orders.map((o) => {
      const items = o.items.map((i) => {
        const unitPrice = Number(i.unitPrice) || 0;
        const qty = Number(i.qty) || 0;
        const lineTotal = unitPrice * qty;
        return { ...i, name: nameMap.get(i.productId), unitPrice, qty, lineTotal };
      });
      const subtotal = items.reduce((s, it) => s + it.lineTotal, 0);
      const shippingFee = Number(o.shippingFee) || 0;
      const total = subtotal + shippingFee;
      return { ...o, items, subtotal, total };
    });
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

  // =============== Helpers & Notify (Telegram) ===============

  // Nếu bạn vẫn cần logic "thành công" ở nơi khác, giữ lại để tái dùng.
  private isSuccessStatus(status?: string) {
    if (!status) return false;
    const ok = ['paid', 'success', 'confirmed', 'completed'];
    return ok.includes(String(status).toLowerCase());
  }

  private async enrichOrderForNotify(orderId: number) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['items'],
    });
    if (!order) throw new Error('Order not found');

    const needNames = order.items.some((i: any) => !i.name);
    if (needNames) {
      const ids = order.items
        .map((i: any) => Number(i.productId))
        .filter((x: any) => Number.isInteger(x));
      if (ids.length) {
        const prods = await this.productRepo.find({ where: { id: In(ids) } });
        const nameMap = new Map(prods.map((p: any) => [p.id, (p as any).name ?? `SP #${p.id}`]));
        (order.items as any) = order.items.map((i: any) => ({
          ...i,
          name: i.name ?? nameMap.get(i.productId) ?? `SP #${i.productId}`,
        }));
      }
    }

    return {
      ...order,
      code: (order as any).code ?? order.id,
      paidAt: (order as any).paidAt ?? undefined,
      user: (order as any).user ?? null,
    };
  }

  // Gửi khi vừa tạo đơn (trạng thái "chờ duyệt")
  private async notifyAdminsOrderCreatedSafe(orderLike: any) {
    // Đảm bảo có đủ tên sp trước khi render template
    const hasAllNames =
      Array.isArray(orderLike?.items) && orderLike.items.every((i: any) => !!i?.name);
    const payload = (!hasAllNames || !orderLike?.id)
      ? await this.enrichOrderForNotify(orderLike.id)
      : orderLike;

    // Dùng template ORDER_SUCCESS (hoặc bạn có thể tạo template ORDER_PENDING riêng)
    return this.telegram.notifyAdminsOrderSuccess(payload);
  }
}
