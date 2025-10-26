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
exports.OrdersAdminController = exports.OrdersPublicController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const jwt_guard_1 = require("../auth/jwt.guard");
const optional_jwt_auth_guard_1 = require("../auth/guards/optional-jwt-auth.guard");
let OrdersPublicController = class OrdersPublicController {
    orders;
    constructor(orders) {
        this.orders = orders;
    }
    async create(dto, req) {
        const userId = req?.user?.id ?? null;
        return this.orders.create(dto, userId);
    }
    async myOrders(req) {
        if (process.env.AUTH_DEBUG === '1') {
            console.log('[ORDERS] /orders/my req.user =', req?.user);
        }
        const userId = Number(req?.user?.id);
        if (!Number.isInteger(userId)) {
            throw new common_1.BadRequestException('Invalid user');
        }
        return this.orders.findMine(userId);
    }
    findOne(id) {
        const n = Number(id);
        if (!Number.isInteger(n)) {
            throw new common_1.BadRequestException('Invalid id');
        }
        return this.orders.findOne(n);
    }
};
exports.OrdersPublicController = OrdersPublicController;
__decorate([
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto, Object]),
    __metadata("design:returntype", Promise)
], OrdersPublicController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersPublicController.prototype, "myOrders", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersPublicController.prototype, "findOne", null);
exports.OrdersPublicController = OrdersPublicController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersPublicController);
let OrdersAdminController = class OrdersAdminController {
    orders;
    constructor(orders) {
        this.orders = orders;
    }
    findAll() {
        return this.orders.findAllForAdmin();
    }
    update(id, body) {
        const n = Number(id);
        if (!Number.isInteger(n)) {
            throw new common_1.BadRequestException('Invalid id');
        }
        return this.orders.updateStatus(n, body);
    }
};
exports.OrdersAdminController = OrdersAdminController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdersAdminController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrdersAdminController.prototype, "update", null);
exports.OrdersAdminController = OrdersAdminController = __decorate([
    (0, common_1.Controller)('admin/orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersAdminController);
//# sourceMappingURL=orders.controller.js.map