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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZaloService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const zalo_config_entity_1 = require("./entities/zalo-config.entity");
const zalo_admin_entity_1 = require("./entities/zalo-admin.entity");
const zalo_template_entity_1 = require("./entities/zalo-template.entity");
const axios_1 = __importDefault(require("axios"));
let ZaloService = class ZaloService {
    http = axios_1.default.create({
        baseURL: 'https://openapi.zalo.me',
        timeout: 8000,
    });
    configRepo;
    adminRepo;
    tplRepo;
    constructor(ds) {
        this.configRepo = ds.getRepository(zalo_config_entity_1.ZaloConfig);
        this.adminRepo = ds.getRepository(zalo_admin_entity_1.ZaloAdmin);
        this.tplRepo = ds.getRepository(zalo_template_entity_1.ZaloTemplate);
    }
    async getToken() {
        return this.configRepo.findOne({ where: { id: 1 } });
    }
    async updateToken(partial) {
        const cfg = await this.getToken();
        const merged = this.configRepo.merge(cfg, partial);
        return this.configRepo.save(merged);
    }
    listAdmins() {
        return this.adminRepo.find({ order: { created_at: 'DESC' } });
    }
    async upsertAdmin(dto) {
        const existing = await this.adminRepo.findOne({ where: { zalo_user_id: dto.zalo_user_id } });
        if (existing) {
            existing.display_name = dto.display_name ?? existing.display_name;
            if (typeof dto.is_active === 'boolean')
                existing.is_active = dto.is_active;
            return this.adminRepo.save(existing);
        }
        const created = this.adminRepo.create({ zalo_user_id: dto.zalo_user_id, display_name: dto.display_name, is_active: dto.is_active ?? true });
        return this.adminRepo.save(created);
    }
    async removeAdmin(id) {
        await this.adminRepo.delete(id);
        return { ok: true };
    }
    async getTemplate(key) {
        const tpl = await this.tplRepo.findOne({ where: { key } });
        if (!tpl)
            throw new common_1.NotFoundException('Template not found');
        return tpl;
    }
    async setTemplate(key, content) {
        const existed = await this.tplRepo.findOne({ where: { key } });
        if (existed) {
            existed.content = content;
            return this.tplRepo.save(existed);
        }
        return this.tplRepo.save(this.tplRepo.create({ key, content }));
    }
    async getAccessToken() {
        const cfg = await this.getToken();
        if (!cfg?.oa_access_token)
            throw new Error('OA access token chưa được cấu hình');
        return cfg.oa_access_token;
    }
    async sendTextToUser(zalo_user_id, text) {
        const accessToken = await this.getAccessToken();
        const url = '/v2.0/oa/message';
        const body = {
            recipient: { user_id: zalo_user_id },
            message: { text },
        };
        const res = await this.http.post(url, body, { headers: { access_token: accessToken } });
        return res.data;
    }
    renderOrderSuccess(order, tplContent) {
        const map = {
            '{{code}}': String(order.code ?? order.id),
            '{{customer}}': String(order.customerName ?? order.user?.name ?? 'N/A'),
            '{{total}}': (order.total ?? 0).toLocaleString('vi-VN'),
            '{{items}}': (order.items ?? []).map((i) => `${i.qty}x ${i.name}`).join(', '),
            '{{time}}': new Date(order.paidAt ?? order.createdAt ?? Date.now()).toLocaleString('vi-VN'),
            '{{link}}': (process.env.ADMIN_ORDER_URL ?? '').replace(':id', String(order.id)),
        };
        let out = tplContent;
        for (const [k, v] of Object.entries(map))
            out = out.split(k).join(v);
        return out;
    }
    async notifyAdminsOrderSuccess(order) {
        const admins = await this.adminRepo.find({ where: { is_active: true } });
        if (!admins.length)
            return;
        const tpl = await this.getTemplate('ORDER_SUCCESS');
        const text = this.renderOrderSuccess(order, tpl.content);
        for (const a of admins) {
            try {
                await this.sendTextToUser(a.zalo_user_id, text);
            }
            catch (e) { }
        }
    }
};
exports.ZaloService = ZaloService;
exports.ZaloService = ZaloService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], ZaloService);
//# sourceMappingURL=zalo.service.js.map