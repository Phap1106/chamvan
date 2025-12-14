// // chamvan_be/src/orders/orders.service.ts
// import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { In, Repository } from 'typeorm';

// import { Order } from './order.entity';
// import { OrderItem } from './order-item.entity';
// import { CreateOrderDto } from './dto/create-order.dto';
// import { Product } from '../products/product.entity';
// import { User } from '../users/user.entity';

// import { ZaloService } from 'src/integrations/zalo/zalo.service';
// import { TelegramService } from '../integrations/telegram/telegram.service';

// type RequestMeta = {
//   ip?: string | null;
//   userAgent?: string | null;
// };

// @Injectable()
// export class OrdersService {
//   constructor(
//     @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
//     @InjectRepository(OrderItem) private readonly itemRepo: Repository<OrderItem>,
//     @InjectRepository(Product) private readonly productRepo: Repository<Product>,
//     @InjectRepository(User) private readonly userRepo: Repository<User>,
//     private readonly zalo: ZaloService,           // giữ nguyên
//     private readonly telegram: TelegramService,   // dùng thông báo
//   ) {}

//   /** -------------------- CREATE -------------------- */
//   async create(dto: CreateOrderDto, userId?: string | null, meta?: RequestMeta) {
//     // Lấy user đăng nhập (nếu có)
//     let user: User | null = null;
//     if (userId) {
//       user = await this.userRepo.findOne({ where: { id: String(userId) } });
//     }

//     const customerEmail = (user?.email ?? (dto as any)?.customerEmail ?? (dto as any)?.email ?? '')
//       .toString()
//       .trim()
//       .toLowerCase();

//     const customerName =
//       (dto as any)?.customerName ??
//       (dto as any)?.name ??
//       (user?.fullName ?? '');

//     const customerPhone =
//       (dto as any)?.customerPhone ??
//       (dto as any)?.phone ??
//       (user?.phone ?? null);

//     // ✅ Guest vẫn đặt được nhưng yêu cầu thông tin liên hệ tối thiểu
//     // (chặn bot rác, ít ảnh hưởng khách thật)
//     if (!userId) {
//       const hasEmail = !!customerEmail;
//       const hasPhone = !!customerPhone;

//       if (!customerName || String(customerName).trim().length < 2) {
//         throw new BadRequestException('Vui lòng nhập họ tên hợp lệ');
//       }
//       if (!hasEmail && !hasPhone) {
//         throw new BadRequestException('Vui lòng nhập email hoặc số điện thoại');
//       }
//       if (hasEmail) {
//         const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail);
//         if (!okEmail) throw new BadRequestException('Email không hợp lệ');
//       }
//       if (hasPhone) {
//         const phone = String(customerPhone).replace(/\s+/g, '').trim();
//         const okPhone = /^(0|\+84)[0-9]{9,10}$/.test(phone);
//         if (!okPhone) throw new BadRequestException('Số điện thoại không hợp lệ');
//       }
//     }

//     // userId (INT) theo schema hiện tại: chỉ set khi convert được
//     let numericUserId: number | null = null;
//     if (typeof userId === 'number') {
//       numericUserId = Number.isFinite(userId) ? userId : null;
//     } else if (typeof userId === 'string') {
//       const asNum = Number(userId);
//       numericUserId = Number.isInteger(asNum) ? asNum : null;
//     }

//     // Chuẩn hoá items
//     const itemsInput: any[] = Array.isArray((dto as any)?.items) ? (dto as any).items : [];
//     const itemsToCreate: OrderItem[] = [];
//     let subtotal = 0;

//     // Lấy giá từ DB cho các productId hợp lệ (nếu không truyền price)
//     const numericPids = Array.from(
//       new Set(itemsInput.map((i) => Number(i?.productId)).filter((x) => Number.isInteger(x))),
//     );
//     const products = numericPids.length
//       ? await this.productRepo.find({ where: { id: In(numericPids) } })
//       : [];
//     const priceMap = new Map<number, number>(products.map((p: any) => [p.id, Number((p as any).price) || 0]));

//     for (const it of itemsInput) {
//       const pidNum = Number(it?.productId);
//       const qty = Number(it?.qty ?? 0) || 0;
//       if (qty <= 0) continue;

//       const unitPrice =
//         (Number(it?.unitPrice) || 0) ||
//         (Number(it?.price) || 0) ||
//         (Number.isInteger(pidNum) ? priceMap.get(pidNum) ?? 0 : 0);

//       const lineTotal = qty * unitPrice;
//       subtotal += lineTotal;

//       const item = this.itemRepo.create() as OrderItem;
//       (item as any).productId = Number.isInteger(pidNum) ? pidNum : (it?.productId as any);
//       (item as any).qty = qty;
//       (item as any).unitPrice = unitPrice;
//       (item as any).lineTotal = lineTotal;

//       itemsToCreate.push(item);
//     }

//     if (!itemsToCreate.length) {
//       throw new BadRequestException('Giỏ hàng trống hoặc sản phẩm không hợp lệ');
//     }

//     const shippingFee = Number((dto as any)?.shippingFee ?? 0) || 0;

//     // ✅ FIX overload: tạo entity rỗng rồi gán field (không đổi logic DB)
//     const order = this.orderRepo.create() as any;
//     order.userId = numericUserId;
//     order.customerName = customerName;
//     order.customerEmail = customerEmail;
//     order.customerPhone = customerPhone;
//     order.customerDob = (dto as any)?.customerDob ?? null;
//     order.shippingAddress = (dto as any)?.shippingAddress ?? null;
//     order.notes = (dto as any)?.notes ?? null;
//     order.subtotal = subtotal;
//     order.shippingFee = shippingFee;
//     order.total = subtotal + shippingFee;
//     order.status = (dto as any)?.status ?? 'chờ duyệt';
//     order.eta = (dto as any)?.eta ?? null;

//     // ✅ Nếu DB chưa có cột ip/userAgent thì KHÔNG gán vào entity để tránh lỗi runtime.
//     // Bạn có thể bật phần này sau khi ALTER TABLE (mục 4).
//     // order.ipAddress = meta?.ip ?? null;
//     // order.userAgent = meta?.userAgent ?? null;

//     const saved = (await this.orderRepo.save(order)) as any;

//     // Lưu items
//     for (const it of itemsToCreate) {
//       (it as any).order = saved;
//       await this.itemRepo.save(it);
//     }

//     // ✅ Nếu thấy hành vi “nghi spam” (ví dụ guest + thiếu info, hoặc email/phone quá nhiều đơn chờ)
//     // thì báo admin (không chặn khách thật).
//     this.tryNotifySuspicious(saved, meta, dto).catch(() => {});

//     // Thông báo Telegram (an toàn) khi tạo đơn
//     try {
//       await this.notifyAdminsOrderCreatedSafe({ ...saved, items: itemsToCreate });
//     } catch {}

//     return { id: saved.id, code: saved?.code ?? null, success: true };
//   }

//   /** -------------------- GET ONE -------------------- */
//   async findOne(id: number) {
//     if (!Number.isInteger(id)) throw new BadRequestException('Invalid id');

//     const order = await this.orderRepo.findOne({ where: { id } as any, relations: ['items'] as any });
//     if (!order) throw new NotFoundException('Order not found');

//     const ids = (order as any).items.map((i: any) => i.productId as number);
//     const prods = ids.length ? await this.productRepo.find({ where: { id: In(ids) } as any }) : [];
//     const nameMap = new Map<number, string>(prods.map((p: any) => [p.id, p.name]));

//     (order as any).items = (order as any).items.map((i: any) => ({
//       ...i,
//       name: i.name ?? nameMap.get(i.productId as number),
//     }));

//     return order;
//   }

//   /** -------------------- MY ORDERS -------------------- */
//   async findMine(userId: string) {
//     const ors: any[] = [];

//     const asNum = Number(userId);
//     if (Number.isInteger(asNum)) ors.push({ userId: asNum });

//     const user = await this.userRepo.findOne({ where: { id: String(userId) } });
//     const email = user?.email ? user.email.trim().toLowerCase() : null;
//     if (email) ors.push({ customerEmail: email });

//     if (!ors.length) return { items: [], total: 0 };

//     const [items, total] = await this.orderRepo.findAndCount({
//       where: ors as any,
//       relations: ['items'] as any,
//       order: { createdAt: 'DESC' } as any,
//     });

//     return { items, total };
//   }

//   /** -------------------- ADMIN LIST -------------------- */
//   async findAllForAdmin() {
//     const orders = await this.orderRepo.find({
//       order: { createdAt: 'DESC' } as any,
//       relations: ['items'] as any,
//     });

//     const ids = Array.from(new Set(orders.flatMap((o: any) => o.items.map((i: any) => i.productId as number))));
//     const prods = ids.length ? await this.productRepo.find({ where: { id: In(ids) } as any }) : [];
//     const nameMap = new Map<number, string>(prods.map((p: any) => [p.id, p.name]));

//     return orders.map((o: any) => {
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

//   /** -------------------- UPDATE STATUS -------------------- */
//   async updateStatus(id: number, body: { status?: string; eta?: string | null }) {
//     if (!Number.isInteger(id)) throw new BadRequestException('Invalid id');

//     const order = await this.orderRepo.findOne({ where: { id } as any });
//     if (!order) throw new NotFoundException('Order not found');

//     if (body.status !== undefined) (order as any).status = body.status;
//     if (body.eta !== undefined) (order as any).eta = body.eta as any;

//     await this.orderRepo.save(order as any);
//     return order;
//   }

//   // ================== Helpers & Notify ==================

//   private async enrichOrderForNotify(orderId: number) {
//     const order = await this.orderRepo.findOne({
//       where: { id: orderId } as any,
//       relations: ['items'] as any,
//     });
//     if (!order) throw new Error('Order not found');

//     const needNames = (order as any).items.some((i: any) => !i.name);
//     if (needNames) {
//       const ids = (order as any).items
//         .map((i: any) => Number(i.productId))
//         .filter((x: any) => Number.isInteger(x));
//       if (ids.length) {
//         const prods = await this.productRepo.find({ where: { id: In(ids) } as any });
//         const nameMap = new Map(prods.map((p: any) => [p.id, p.name ?? `SP #${p.id}`]));
//         (order as any).items = (order as any).items.map((i: any) => ({
//           ...i,
//           name: i.name ?? nameMap.get(i.productId) ?? `SP #${i.productId}`,
//         }));
//       }
//     }

//     return {
//       ...(order as any),
//       code: (order as any).code ?? (order as any).id,
//       paidAt: (order as any).paidAt ?? undefined,
//       user: (order as any).user ?? null,
//     };
//   }

//   private async notifyAdminsOrderCreatedSafe(orderLike: any) {
//     const hasAllNames =
//       Array.isArray(orderLike?.items) && orderLike.items.every((i: any) => !!i?.name);
//     const payload = (!hasAllNames || !orderLike?.id)
//       ? await this.enrichOrderForNotify(orderLike.id)
//       : orderLike;

//     return (this.telegram as any).notifyAdminsOrderSuccess(payload);
//   }

//   private async tryNotifySuspicious(savedOrder: any, meta?: RequestMeta, dto?: any) {
//     const ip = meta?.ip ?? 'unknown';
//     const ua = meta?.userAgent ?? 'unknown';
//     const email = String(savedOrder?.customerEmail || '').trim().toLowerCase();
//     const phone = String(savedOrder?.customerPhone || '').trim();

//     // Ví dụ cảnh báo mềm: thiếu contact hoặc dữ liệu “lạ”
//     const isWeird =
//       (!email && !phone) ||
//       String(savedOrder?.customerName || '').trim().length < 2;

//     if (!isWeird) return;

//     const payload = {
//       type: 'SUSPICIOUS_ORDER_PAYLOAD',
//       orderId: savedOrder?.id ?? null,
//       ip,
//       userAgent: ua,
//       email: email || null,
//       phone: phone || null,
//       name: savedOrder?.customerName ?? null,
//       itemsCount: Array.isArray(dto?.items) ? dto.items.length : null,
//       time: new Date().toISOString(),
//     };

//     const t: any = this.telegram as any;
//     const fn =
//       t?.notifyAdminsSecurityAlert ||
//       t?.notifyAdminsAbuse ||
//       t?.notifyAdminsText ||
//       t?.notifyAdminsMessage;

//     if (typeof fn === 'function') {
//       await fn.call(this.telegram, payload);
//     }
//   }
// }













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

export type RequestMeta = {
  ip?: string | null;
  userAgent?: string | null;
  forwardedFor?: string | null;
};

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
  async create(dto: CreateOrderDto, userId?: string | null, meta?: RequestMeta) {
    // Lấy user đăng nhập (nếu có)
    let user: User | null = null;
    if (userId) {
      user = await this.userRepo.findOne({ where: { id: String(userId) } });
    }

    const customerEmail = (
      user?.email ??
      dto?.customerEmail ??
      (dto as any)?.email ??
      ''
    )
      .toString()
      .trim()
      .toLowerCase();

    const customerName =
      (dto as any)?.customerName ??
      (dto as any)?.name ??
      (user as any)?.fullName ??
      '';

    const customerPhone =
      (dto as any)?.customerPhone ??
      (dto as any)?.phone ??
      (user as any)?.phone ??
      null;

    // Bắt buộc tối thiểu: có tên + (email hoặc SĐT)
    if (!String(customerName || '').trim()) {
      throw new BadRequestException('Thiếu họ tên');
    }
    if (!String(customerEmail || '').trim() && !String(customerPhone || '').trim()) {
      throw new BadRequestException('Thiếu email hoặc số điện thoại');
    }

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
    const priceMap = new Map<number, number>(products.map((p) => [p.id, Number((p as any).price) || 0]));

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

      // Tránh overload sai kiểu: create() rồi gán
      const item = this.itemRepo.create() as OrderItem;
      (item as any).productId = Number.isInteger(pidNum) ? pidNum : (it?.productId as any);
      (item as any).qty = qty;
      (item as any).unitPrice = unitPrice;
      (item as any).lineTotal = lineTotal;

      itemsToCreate.push(item);
    }

    if (!itemsToCreate.length) {
      throw new BadRequestException('Giỏ hàng trống hoặc sản phẩm không hợp lệ');
    }

    const shippingFee = Number((dto as any)?.shippingFee ?? 0) || 0;

    // Tránh overload sai kiểu: create() rồi gán
    const order = this.orderRepo.create() as Order;
    order.userId = numericUserId;
    order.customerName = customerName;
    order.customerEmail = customerEmail;
    order.customerPhone = customerPhone;
    order.customerDob = (dto as any)?.customerDob ?? null;
    order.shippingAddress = (dto as any)?.shippingAddress ?? null;
    order.notes = (dto as any)?.notes ?? null;
    order.subtotal = subtotal;
    order.shippingFee = shippingFee;
    order.total = subtotal + shippingFee;
    order.status = (dto as any)?.status ?? 'chờ duyệt';
    (order as any).eta = (dto as any)?.eta ?? null;

    // ✅ Lưu IP/UA
    order.ipAddress = meta?.ip ?? null;
    order.userAgent = meta?.userAgent ?? null;

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
    const nameMap = new Map<number, string>(prods.map((p) => [p.id, (p as any).name]));

    (order.items as any) = order.items.map((i: any) => ({
      ...i,
      name: i.name ?? nameMap.get(i.productId as number),
    }));

    return order;
  }

  /** -------------------- MY ORDERS -------------------- */
  async findMine(userId: string) {
    const ors: any[] = [];

    const asNum = Number(userId);
    if (Number.isInteger(asNum)) {
      ors.push({ userId: asNum });
    }

    const user = await this.userRepo.findOne({ where: { id: String(userId) } });
    const email = user?.email ? user.email.trim().toLowerCase() : null;
    if (email) {
      ors.push({ customerEmail: email });
    }

    if (!ors.length) {
      return { items: [], total: 0 };
    }

    const [items, total] = await this.orderRepo.findAndCount({
      where: ors,
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
    const nameMap = new Map<number, string>(prods.map((p) => [p.id, (p as any).name]));

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
      const shippingFee = Number((o as any).shippingFee) || 0;
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

  private async notifyAdminsOrderCreatedSafe(orderLike: any) {
    const hasAllNames =
      Array.isArray(orderLike?.items) && orderLike.items.every((i: any) => !!i?.name);
    const payload = (!hasAllNames || !orderLike?.id)
      ? await this.enrichOrderForNotify(orderLike.id)
      : orderLike;

    return this.telegram.notifyAdminsOrderSuccess(payload);
  }
}
