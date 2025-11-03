"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./order.entity");
const order_item_entity_1 = require("./order-item.entity");
const product_entity_1 = require("../products/product.entity");
const user_entity_1 = require("../users/user.entity");
const zalo_service_1 = require("../integrations/zalo/zalo.service");
const telegram_service_1 = require("../integrations/telegram/telegram.service");
let OrdersService = class OrdersService {
    orderRepo;
    itemRepo;
    productRepo;
    userRepo;
    zalo;
    telegram;
    constructor(orderRepo, itemRepo, productRepo, userRepo, zalo, telegram) {
        this.orderRepo = orderRepo;
        this.itemRepo = itemRepo;
        this.productRepo = productRepo;
        this.userRepo = userRepo;
        this.zalo = zalo;
        this.telegram = telegram;
    }
    async create(dto, userId) {
        let user = null;
        if (userId) {
            user = await this.userRepo.findOne({ where: { id: String(userId) } });
        }
        const customerEmail = (user?.email ?? dto?.customerEmail ?? dto?.email ?? '')
            .toString()
            .trim()
            .toLowerCase();
        const customerName = dto?.customerName ??
            dto?.name ??
            (user?.fullName ?? '');
        const customerPhone = dto?.customerPhone ??
            dto?.phone ??
            (user?.phone ?? null);
        let numericUserId = null;
        if (typeof userId === 'number') {
            numericUserId = Number.isFinite(userId) ? userId : null;
        }
        else if (typeof userId === 'string') {
            const asNum = Number(userId);
            numericUserId = Number.isInteger(asNum) ? asNum : null;
        }
        const itemsInput = Array.isArray(dto?.items) ? dto.items : [];
        const itemsToCreate = [];
        let subtotal = 0;
        const numericPids = Array.from(new Set(itemsInput.map((i) => Number(i?.productId)).filter((x) => Number.isInteger(x))));
        const products = numericPids.length
            ? await this.productRepo.find({ where: { id: (0, typeorm_2.In)(numericPids) } })
            : [];
        const priceMap = new Map(products.map((p) => [p.id, Number(p.price) || 0]));
        for (const it of itemsInput) {
            const pidNum = Number(it?.productId);
            const qty = Number(it?.qty ?? 0) || 0;
            if (qty <= 0)
                continue;
            const unitPrice = (Number(it?.unitPrice) || 0) ||
                (Number(it?.price) || 0) ||
                (Number.isInteger(pidNum) ? priceMap.get(pidNum) ?? 0 : 0);
            const lineTotal = qty * unitPrice;
            subtotal += lineTotal;
            const item = this.itemRepo.create();
            item.productId = Number.isInteger(pidNum) ? pidNum : it?.productId;
            item.qty = qty;
            item.unitPrice = unitPrice;
            item.lineTotal = lineTotal;
            itemsToCreate.push(item);
        }
        const shippingFee = Number(dto?.shippingFee ?? 0) || 0;
        const order = this.orderRepo.create({
            userId: numericUserId,
            customerName,
            customerEmail,
            customerPhone,
            customerDob: dto?.customerDob ?? null,
            shippingAddress: dto?.shippingAddress ?? null,
            notes: dto?.notes ?? null,
            subtotal,
            shippingFee,
            total: subtotal + shippingFee,
            status: dto?.status ?? 'chờ duyệt',
            eta: dto?.eta ?? null,
        });
        const saved = await this.orderRepo.save(order);
        for (const it of itemsToCreate) {
            it.order = saved;
            await this.itemRepo.save(it);
        }
        try {
            await this.notifyAdminsOrderCreatedSafe({ ...saved, items: itemsToCreate });
        }
        catch { }
        return { id: saved.id, code: saved?.code ?? null, success: true };
    }
    async findOne(id) {
        if (!Number.isInteger(id))
            throw new common_1.BadRequestException('Invalid id');
        const order = await this.orderRepo.findOne({ where: { id }, relations: ['items'] });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const ids = order.items.map((i) => i.productId);
        const prods = ids.length ? await this.productRepo.find({ where: { id: (0, typeorm_2.In)(ids) } }) : [];
        const nameMap = new Map(prods.map((p) => [p.id, p.name]));
        order.items = order.items.map((i) => ({
            ...i,
            name: i.name ?? nameMap.get(i.productId),
        }));
        return order;
    }
    async findMine(userId) {
        const ors = [];
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
    async findAllForAdmin() {
        const orders = await this.orderRepo.find({
            order: { createdAt: 'DESC' },
            relations: ['items'],
        });
        const ids = Array.from(new Set(orders.flatMap((o) => o.items.map((i) => i.productId))));
        const prods = ids.length ? await this.productRepo.find({ where: { id: (0, typeorm_2.In)(ids) } }) : [];
        const nameMap = new Map(prods.map((p) => [p.id, p.name]));
        return orders.map((o) => {
            const items = o.items.map((i) => {
                const unitPrice = Number(i.unitPrice) || 0;
                const qty = Number(i.qty) || 0;
                const lineTotal = unitPrice * qty;
                return {
                    ...i,
                    name: i.name ?? nameMap.get(i.productId),
                    unitPrice,
                    qty,
                    lineTotal,
                };
            });
            const subtotal = items.reduce((s, it) => s + it.lineTotal, 0);
            const shippingFee = Number(o.shippingFee) || 0;
            const total = subtotal + shippingFee;
            return { ...o, items, subtotal, total };
        });
    }
    async updateStatus(id, body) {
        if (!Number.isInteger(id))
            throw new common_1.BadRequestException('Invalid id');
        const order = await this.orderRepo.findOne({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (body.status !== undefined)
            order.status = body.status;
        if (body.eta !== undefined)
            order.eta = body.eta;
        await this.orderRepo.save(order);
        return order;
    }
    async enrichOrderForNotify(orderId) {
        const order = await this.orderRepo.findOne({
            where: { id: orderId },
            relations: ['items'],
        });
        if (!order)
            throw new Error('Order not found');
        const needNames = order.items.some((i) => !i.name);
        if (needNames) {
            const ids = order.items
                .map((i) => Number(i.productId))
                .filter((x) => Number.isInteger(x));
            if (ids.length) {
                const prods = await this.productRepo.find({ where: { id: (0, typeorm_2.In)(ids) } });
                const nameMap = new Map(prods.map((p) => [p.id, p.name ?? `SP #${p.id}`]));
                order.items = order.items.map((i) => ({
                    ...i,
                    name: i.name ?? nameMap.get(i.productId) ?? `SP #${i.productId}`,
                }));
            }
        }
        return {
            ...order,
            code: order.code ?? order.id,
            paidAt: order.paidAt ?? undefined,
            user: order.user ?? null,
        };
    }
    async notifyAdminsOrderCreatedSafe(orderLike) {
        const hasAllNames = Array.isArray(orderLike?.items) && orderLike.items.every((i) => !!i?.name);
        const payload = (!hasAllNames || !orderLike?.id)
            ? await this.enrichOrderForNotify(orderLike.id)
            : orderLike;
        return this.telegram.notifyAdminsOrderSuccess(payload);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        zalo_service_1.ZaloService,
        telegram_service_1.TelegramService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map