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
exports.ReturnsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const return_request_entity_1 = require("./return-request.entity");
let ReturnsService = class ReturnsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async create(userId, dto) {
        const entity = this.repo.create({
            userId,
            orderCode: dto.orderCode.trim(),
            reason: dto.reason.trim(),
            status: 'pending',
        });
        await this.repo.save(entity);
        return entity;
    }
    async findMine(userId) {
        return this.repo.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    baseQB() {
        return this.repo.createQueryBuilder('r')
            .leftJoin('users', 'u', 'u.id = r.user_id')
            .select([
            'r.id AS id',
            'r.order_code AS orderCode',
            'r.reason AS reason',
            'r.status AS status',
            'r.created_at AS createdAt',
            'r.updated_at AS updatedAt',
            'u.id AS userId',
            'u.email AS userEmail',
            'u.full_name AS userFullName',
        ]);
    }
    async findAllWithUser() {
        const rows = await this.baseQB()
            .orderBy('r.created_at', 'DESC')
            .getRawMany();
        return rows.map((r) => ({
            id: Number(r.id),
            orderCode: r.orderCode,
            reason: r.reason,
            status: r.status,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
            user: {
                id: Number(r.userId),
                email: r.userEmail,
                fullName: r.userFullName,
            },
        }));
    }
    async updateStatus(id, dto) {
        const found = await this.repo.findOne({ where: { id } });
        if (!found)
            throw new common_1.NotFoundException('Return request not found');
        found.status = dto.status;
        await this.repo.save(found);
        return found;
    }
};
exports.ReturnsService = ReturnsService;
exports.ReturnsService = ReturnsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(return_request_entity_1.ReturnRequest)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ReturnsService);
//# sourceMappingURL=returns.service.js.map