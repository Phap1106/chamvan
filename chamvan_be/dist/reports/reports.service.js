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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bug_report_entity_1 = require("./bug-report.entity");
let ReportsService = class ReportsService {
    bugRepo;
    constructor(bugRepo) {
        this.bugRepo = bugRepo;
    }
    async create(dto, extra) {
        const entity = this.bugRepo.create({
            title: dto.title.trim(),
            description: dto.description,
            pageUrl: dto.pageUrl ?? null,
            status: 'open',
            userAgent: extra.userAgent ?? null,
            userId: extra.userId ?? null,
            userEmail: extra.userEmail ?? null,
        });
        const saved = await this.bugRepo.save(entity);
        return { success: true, id: saved.id };
    }
    async list(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const where = {};
        if (query.status)
            where.status = query.status;
        const [items, total] = await this.bugRepo.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { items, total, page, limit };
    }
    async get(id) {
        const item = await this.bugRepo.findOne({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Report not found');
        return item;
    }
    async updateStatus(id, body) {
        const item = await this.get(id);
        item.status = body.status;
        await this.bugRepo.save(item);
        return { success: true };
    }
    async remove(id) {
        const item = await this.get(id);
        await this.bugRepo.remove(item);
        return { success: true };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bug_report_entity_1.BugReport)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map