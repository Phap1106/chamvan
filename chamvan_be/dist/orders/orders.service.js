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
let OrdersService = class OrdersService {
    orderRepo;
    itemRepo;
    productRepo;
    constructor(orderRepo, itemRepo, productRepo) {
        this.orderRepo = orderRepo;
        this.itemRepo = itemRepo;
        this.productRepo = productRepo;
    }
    async create(dto, userId) {
        const ids = dto.items.map((i) => Number(i.productId)).filter((x) => Number.isInteger(x));
        const prods = await this.productRepo.find({ where: { id: (0, typeorm_2.In)(ids) } });
        const priceMap = new Map(prods.map((p) => [p.id, Number(p.price) || 0]));
        const nameMap = new Map(prods.map((p) => [p.id, p.name]));
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
            status: 'chờ duyệt',
            userId: userId ?? null,
        });
        const saved = await this.orderRepo.save(order);
        const items = itemsData.map((d) => this.itemRepo.create({ ...d, order: saved }));
        await this.itemRepo.save(items);
        const withNames = items.map((i) => ({ ...i, name: nameMap.get(i.productId) }));
        return { ...saved, items: withNames };
    }
    async findOne(id) {
        if (!Number.isInteger(id))
            throw new common_1.BadRequestException('Invalid id');
        const order = await this.orderRepo.findOne({ where: { id }, relations: ['items'] });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const ids = order.items.map((i) => i.productId);
        const prods = await this.productRepo.find({ where: { id: (0, typeorm_2.In)(ids) } });
        const nameMap = new Map(prods.map((p) => [p.id, p.name]));
        order.items = order.items.map((i) => ({ ...i, name: nameMap.get(i.productId) }));
        return order;
    }
    async findMine(userId) {
        if (!Number.isInteger(userId))
            throw new common_1.BadRequestException('Invalid userId');
        const orders = await this.orderRepo.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            relations: ['items'],
        });
        if (!orders.length)
            return [];
        const ids = Array.from(new Set(orders.flatMap((o) => o.items.map((i) => i.productId))));
        const prods = ids.length ? await this.productRepo.find({ where: { id: (0, typeorm_2.In)(ids) } }) : [];
        const nameMap = new Map(prods.map((p) => [p.id, p.name]));
        return orders.map((o) => ({
            ...o,
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
        const prods = ids.length ? await this.productRepo.find({ where: { id: (0, typeorm_2.In)(ids) } }) : [];
        const nameMap = new Map(prods.map((p) => [p.id, p.name]));
        return orders.map((o) => ({
            ...o,
            items: o.items.map((i) => ({ ...i, name: nameMap.get(i.productId) })),
            subtotal: o.items.reduce((s, it) => s + (Number(it.unitPrice) || 0) * (Number(it.qty) || 0), 0),
            total: (o.items.reduce((s, it) => s + (Number(it.unitPrice) || 0) * (Number(it.qty) || 0), 0)) + (Number(o.shippingFee) || 0),
        }));
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrdersService);
//# sourceMappingURL=orders.service.js.map