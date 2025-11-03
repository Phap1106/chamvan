
// // src/orders/orders.service.ts

// import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { In, Repository } from 'typeorm';
// import { Order } from './order.entity';
// import { OrderItem } from './order-item.entity';
// import { CreateOrderDto } from './dto/create-order.dto';
// import { Product } from '../products/product.entity';
// import { User } from '../users/user.entity';

// // Giữ nguyên import ZaloService (không dùng) để không phá file/module khác
// import { ZaloService } from 'src/integrations/zalo/zalo.service';
// import { TelegramService } from '../integrations/telegram/telegram.service';

// @Injectable()
// export class OrdersService {
//   constructor(
//     @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
//     @InjectRepository(OrderItem) private readonly itemRepo: Repository<OrderItem>,
//     @InjectRepository(Product) private readonly productRepo: Repository<Product>,
//     @InjectRepository(User) private readonly userRepo: Repository<User>,
//     private readonly zalo: ZaloService,           // giữ nguyên
//     private readonly telegram: TelegramService,   // dùng để gửi thông báo
//   ) {}

//   /** Tạo đơn hàng
//    *  - Ghi userId nếu có thể convert sang number, còn lại để null (tránh Data truncated)
//    *  - Chuẩn hoá email (ưu tiên DTO > user), lowercase
//    *  - Tính subtotal/total từ items
//    *  - Giữ nguyên các field khác, không đụng module/controller
//    */
// async create(dto: CreateOrderDto, userId?: string | null) {
//   let user: User | null = null;
//   if (userId) {
//     user = await this.userRepo.findOne({ where: { id: String(userId) } });
//   }

//   const rawEmail =
//     (dto as any)?.customerEmail ??
//     (dto as any)?.email ??
//     (user?.email ?? null);

//   const customerEmail =
//     typeof rawEmail === 'string' && rawEmail.includes('@')
//       ? rawEmail.trim().toLowerCase()
//       : '';

//   const customerName =
//     (dto as any)?.customerName ??
//     (dto as any)?.name ??
//     (user?.fullName ?? '');

//   const customerPhone =
//     (dto as any)?.customerPhone ??
//     (dto as any)?.phone ??
//     (user?.phone ?? null);

//   let numericUserId: number | null = null;
//   if (typeof userId === 'number') {
//     numericUserId = Number.isFinite(userId) ? userId : null;
//   } else if (typeof userId === 'string') {
//     const maybe = Number(userId);
//     numericUserId = Number.isInteger(maybe) ? maybe : null;
//   }

//   const itemsInput: any[] = Array.isArray((dto as any)?.items) ? (dto as any).items : [];
//   const itemsToCreate: OrderItem[] = [];
//   let subtotal = 0;

//   const numericProductIds = Array.from(
//     new Set(
//       itemsInput.map((i) => Number(i?.productId)).filter((x) => Number.isInteger(x)),
//     ),
//   );
//   const existProducts = numericProductIds.length
//     ? await this.productRepo.find({ where: { id: In(numericProductIds) } })
//     : [];
//   const priceMap = new Map<number, number>(existProducts.map((p) => [p.id, Number(p.price) || 0]));
//   const nameMap = new Map<number, string>(existProducts.map((p) => [p.id, p.name]));

//   for (const it of itemsInput) {
//     const pidNum = Number(it?.productId);
//     const qty = Number(it?.qty ?? 0) || 0;
//     const unitPrice =
//       (Number(it?.unitPrice) || 0) ||
//       (Number(it?.price) || 0) ||
//       (Number.isInteger(pidNum) ? (priceMap.get(pidNum) ?? 0) : 0);

//     if (qty <= 0) continue;

//     const lineTotal = qty * unitPrice;
//     subtotal += lineTotal;

//     // ✅ Tránh overload: tạo instance rồi gán field
//     const item = this.itemRepo.create() as OrderItem;
//     (item as any).productId = Number.isInteger(pidNum) ? pidNum : (it?.productId as any);

//     (item as any).qty = qty;
//     (item as any).unitPrice = unitPrice;
//     (item as any).lineTotal = lineTotal;

//     itemsToCreate.push(item);
//   }

//   const shippingFee = Number((dto as any)?.shippingFee ?? 0) || 0;

//   const order = this.orderRepo.create({
//     userId: numericUserId,
//     customerName,
//     customerEmail,
//     customerPhone,
//     customerDob: (dto as any)?.customerDob ?? null,
//     shippingAddress: (dto as any)?.shippingAddress ?? null,
//     notes: (dto as any)?.notes ?? null,
//     subtotal,
//     shippingFee,
//     total: subtotal + shippingFee,
//     status: (dto as any)?.status ?? 'chờ duyệt',
//     eta: (dto as any)?.eta ?? null,
//   });

//   const saved = await this.orderRepo.save(order);

//   for (const it of itemsToCreate) {
//     (it as any).order = saved;
//     await this.itemRepo.save(it);
//   }

//   try {
//     await this.notifyAdminsOrderCreatedSafe({ ...saved, items: itemsToCreate });
//   } catch {}

//   return { id: saved.id, code: (saved as any)?.code ?? null, success: true };
// }


//   async findOne(id: number) {
//     if (!Number.isInteger(id)) throw new BadRequestException('Invalid id');

//     const order = await this.orderRepo.findOne({ where: { id }, relations: ['items'] });
//     if (!order) throw new NotFoundException('Order not found');

//     const ids = order.items.map((i) => i.productId);
//     const prods = ids.length ? await this.productRepo.find({ where: { id: In(ids as number[]) } }) : [];
//     const nameMap = new Map<number, string>(prods.map((p) => [p.id, p.name]));

//     (order.items as any) = order.items.map((i: any) => ({
//       ...i,
//       name: i.name ?? nameMap.get(i.productId as number),
//     }));

//     return order;
//   }

//   /** Lấy đơn của tôi:
//    *  - Nếu userId convert được sang number → lọc theo orders.userId
//    *  - Ngoài ra, nếu tìm thấy user → lọc OR theo customerEmail = user.email (lowercase)
//    *  Giải quyết trường hợp đơn cũ/guest chưa có userId.
//    */
//   async findMine(userId: string) {
//     const ors: any[] = [];

//     // userId của orders là INT → thêm điều kiện khi convert được
//     const maybeNum = Number(userId);
//     if (Number.isInteger(maybeNum)) {
//       ors.push({ userId: maybeNum });
//     }

//     // Lọc theo email user (nếu có)
//     const user = await this.userRepo.findOne({ where: { id: String(userId) } });
//     const email = user?.email ? user.email.trim().toLowerCase() : null;
//     if (email) {
//       ors.push({ customerEmail: email });
//     }

//     // Nếu không có điều kiện nào hợp lệ → trả rỗng
//     if (!ors.length) {
//       return { items: [], total: 0 };
//     }

//     const [items, total] = await this.orderRepo.findAndCount({
//       where: ors, // mảng => OR
//       relations: ['items'],
//       order: { createdAt: 'DESC' },
//     });

//     return { items, total };
//   }

//   async findAllForAdmin() {
//     const orders = await this.orderRepo.find({
//       order: { createdAt: 'DESC' },
//       relations: ['items'],
//     });

//     const ids = Array.from(new Set(orders.flatMap((o) => o.items.map((i) => i.productId))));
//     const prods = ids.length ? await this.productRepo.find({ where: { id: In(ids as number[]) } }) : [];
//     const nameMap = new Map<number, string>(prods.map((p) => [p.id, p.name]));

//     return orders.map((o) => {
//       const items = o.items.map((i: any) => {
//         const unitPrice = Number(i.unitPrice) || 0;
//         const qty = Number(i.qty) || 0;
//         const lineTotal = unitPrice * qty;
//         return {
//           ...i,
//           name: i.name ?? nameMap.get(i.productId as number),
//           unitPrice,
//           qty,
//           lineTotal,
//         };
//       });
//       const subtotal = items.reduce((s: number, it: any) => s + it.lineTotal, 0);
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

//   // =============== Helpers & Notify (Telegram) ===============

//   private isSuccessStatus(status?: string) {
//     if (!status) return false;
//     const ok = ['paid', 'success', 'confirmed', 'completed'];
//     return ok.includes(String(status).toLowerCase());
//   }

//   private async enrichOrderForNotify(orderId: number) {
//     const order = await this.orderRepo.findOne({
//       where: { id: orderId },
//       relations: ['items'],
//     });
//     if (!order) throw new Error('Order not found');

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

//     return {
//       ...order,
//       code: (order as any).code ?? order.id,
//       paidAt: (order as any).paidAt ?? undefined,
//       user: (order as any).user ?? null,
//     };
//   }

//   // Gửi khi vừa tạo đơn (trạng thái "chờ duyệt")
//   private async notifyAdminsOrderCreatedSafe(orderLike: any) {
//     const hasAllNames =
//       Array.isArray(orderLike?.items) && orderLike.items.every((i: any) => !!i?.name);
//     const payload = (!hasAllNames || !orderLike?.id)
//       ? await this.enrichOrderForNotify(orderLike.id)
//       : orderLike;

//     // Dùng template ORDER_SUCCESS (hoặc template riêng nếu bạn có)
//     return this.telegram.notifyAdminsOrderSuccess(payload);
//   }
// }










// src/orders/orders.service.ts

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';

// Giữ nguyên import ZaloService (không dùng) để không phá module khác
import { ZaloService } from 'src/integrations/zalo/zalo.service';
import { TelegramService } from '../integrations/telegram/telegram.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private readonly itemRepo: Repository<OrderItem>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly zalo: ZaloService,           // giữ nguyên
    private readonly telegram: TelegramService,   // dùng thông báo
  ) {}

  /** -------------------- CREATE -------------------- */
  async create(dto: CreateOrderDto, userId?: string | null) {
    // Lấy user đăng nhập (nếu có)
    let user: User | null = null;
    if (userId) {
      user = await this.userRepo.findOne({ where: { id: String(userId) } });
    }

    // ✅ Ưu tiên email từ user khi đã đăng nhập (loại bỏ "guest@example.com")
    const customerEmail = (user?.email ?? (dto as any)?.customerEmail ?? (dto as any)?.email ?? '')
      .toString()
      .trim()
      .toLowerCase();

    const customerName =
      (dto as any)?.customerName ??
      (dto as any)?.name ??
      (user?.fullName ?? '');

    const customerPhone =
      (dto as any)?.customerPhone ??
      (dto as any)?.phone ??
      (user?.phone ?? null);

    // userId (INT) theo schema hiện tại: chỉ set khi convert được
    let numericUserId: number | null = null;
    if (typeof userId === 'number') {
      numericUserId = Number.isFinite(userId) ? userId : null;
    } else if (typeof userId === 'string') {
      const asNum = Number(userId);
      numericUserId = Number.isInteger(asNum) ? asNum : null;
    }

    // Chuẩn hoá items
    const itemsInput: any[] = Array.isArray((dto as any)?.items) ? (dto as any).items : [];
    const itemsToCreate: OrderItem[] = [];
    let subtotal = 0;

    // Lấy giá từ DB cho các productId hợp lệ (nếu không truyền price)
    const numericPids = Array.from(
      new Set(itemsInput.map((i) => Number(i?.productId)).filter((x) => Number.isInteger(x))),
    );
    const products = numericPids.length
      ? await this.productRepo.find({ where: { id: In(numericPids) } })
      : [];
    const priceMap = new Map<number, number>(products.map((p) => [p.id, Number(p.price) || 0]));

    for (const it of itemsInput) {
      const pidNum = Number(it?.productId);
      const qty = Number(it?.qty ?? 0) || 0;
      if (qty <= 0) continue;

      const unitPrice =
        (Number(it?.unitPrice) || 0) ||
        (Number(it?.price) || 0) ||
        (Number.isInteger(pidNum) ? priceMap.get(pidNum) ?? 0 : 0);

      const lineTotal = qty * unitPrice;
      subtotal += lineTotal;

      const item = this.itemRepo.create() as OrderItem;
      (item as any).productId = Number.isInteger(pidNum) ? pidNum : (it?.productId as any);
      (item as any).qty = qty;
      (item as any).unitPrice = unitPrice;
      (item as any).lineTotal = lineTotal;

      itemsToCreate.push(item);
    }

    const shippingFee = Number((dto as any)?.shippingFee ?? 0) || 0;

    const order = this.orderRepo.create({
      userId: numericUserId,                          // chỉ set khi là số; nếu không -> null
      customerName,
      customerEmail,
      customerPhone,
      customerDob: (dto as any)?.customerDob ?? null,
      shippingAddress: (dto as any)?.shippingAddress ?? null,
      notes: (dto as any)?.notes ?? null,
      subtotal,
      shippingFee,
      total: subtotal + shippingFee,
      status: (dto as any)?.status ?? 'chờ duyệt',
      eta: (dto as any)?.eta ?? null,
    });

    const saved = await this.orderRepo.save(order);

    // Lưu items
    for (const it of itemsToCreate) {
      (it as any).order = saved;
      await this.itemRepo.save(it);
    }

    // Thông báo Telegram (an toàn)
    try {
      await this.notifyAdminsOrderCreatedSafe({ ...saved, items: itemsToCreate });
    } catch {}

    return { id: saved.id, code: (saved as any)?.code ?? null, success: true };
  }

  /** -------------------- GET ONE -------------------- */
  async findOne(id: number) {
    if (!Number.isInteger(id)) throw new BadRequestException('Invalid id');

    const order = await this.orderRepo.findOne({ where: { id }, relations: ['items'] });
    if (!order) throw new NotFoundException('Order not found');

    // Map tên SP khi trả về (không lưu name vào DB)
    const ids = order.items.map((i) => i.productId as number);
    const prods = ids.length ? await this.productRepo.find({ where: { id: In(ids) } }) : [];
    const nameMap = new Map<number, string>(prods.map((p) => [p.id, p.name]));

    (order.items as any) = order.items.map((i: any) => ({
      ...i,
      name: i.name ?? nameMap.get(i.productId as number),
    }));

    return order;
  }

  /** -------------------- MY ORDERS -------------------- */
  async findMine(userId: string) {
    const ors: any[] = [];

    // userId (INT) di sản
    const asNum = Number(userId);
    if (Number.isInteger(asNum)) {
      ors.push({ userId: asNum });
    }

    // OR theo email của user (đảm bảo xem được đơn cũ/guest)
    const user = await this.userRepo.findOne({ where: { id: String(userId) } });
    const email = user?.email ? user.email.trim().toLowerCase() : null;
    if (email) {
      ors.push({ customerEmail: email });
    }

    // Nếu không có điều kiện hợp lệ -> rỗng
    if (!ors.length) {
      return { items: [], total: 0 };
    }

    const [items, total] = await this.orderRepo.findAndCount({
      where: ors,                 // mảng -> OR
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });

    return { items, total };
  }

  /** -------------------- ADMIN LIST -------------------- */
  async findAllForAdmin() {
    const orders = await this.orderRepo.find({
      order: { createdAt: 'DESC' },
      relations: ['items'],
    });

    const ids = Array.from(new Set(orders.flatMap((o) => o.items.map((i) => i.productId as number))));
    const prods = ids.length ? await this.productRepo.find({ where: { id: In(ids) } }) : [];
    const nameMap = new Map<number, string>(prods.map((p) => [p.id, p.name]));

    return orders.map((o) => {
      const items = o.items.map((i: any) => {
        const unitPrice = Number(i.unitPrice) || 0;
        const qty = Number(i.qty) || 0;
        const lineTotal = unitPrice * qty;
        return {
          ...i,
          name: i.name ?? nameMap.get(i.productId as number),
          unitPrice,
          qty,
          lineTotal,
        };
      });
      const subtotal = items.reduce((s: number, it: any) => s + it.lineTotal, 0);
      const shippingFee = Number(o.shippingFee) || 0;
      const total = subtotal + shippingFee;
      return { ...o, items, subtotal, total };
    });
  }

  /** -------------------- UPDATE STATUS -------------------- */
  async updateStatus(id: number, body: { status?: string; eta?: string | null }) {
    if (!Number.isInteger(id)) throw new BadRequestException('Invalid id');

    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    if (body.status !== undefined) order.status = body.status;
    if (body.eta !== undefined) (order as any).eta = body.eta as any;

    await this.orderRepo.save(order);
    return order;
  }

  // ================== Helpers & Notify ==================

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
    const hasAllNames =
      Array.isArray(orderLike?.items) && orderLike.items.every((i: any) => !!i?.name);
    const payload = (!hasAllNames || !orderLike?.id)
      ? await this.enrichOrderForNotify(orderLike.id)
      : orderLike;

    // Dùng template ORDER_SUCCESS (hoặc template riêng nếu bạn có)
    return this.telegram.notifyAdminsOrderSuccess(payload);
  }
}
