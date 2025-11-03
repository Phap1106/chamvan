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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const telegram_config_entity_1 = require("./entities/telegram-config.entity");
const telegram_recipient_entity_1 = require("./entities/telegram-recipient.entity");
const telegram_template_entity_1 = require("./entities/telegram-template.entity");
let TelegramService = class TelegramService {
    cfgRepo;
    recRepo;
    tplRepo;
    constructor(cfgRepo, recRepo, tplRepo) {
        this.cfgRepo = cfgRepo;
        this.recRepo = recRepo;
        this.tplRepo = tplRepo;
    }
    async getToken() {
        let cfg = await this.cfgRepo.findOne({ where: { id: 1 } });
        if (!cfg) {
            const seed = {
                id: 1,
                bot_token: process.env.TELEGRAM_BOT_TOKEN || undefined,
            };
            cfg = this.cfgRepo.create(seed);
            cfg = await this.cfgRepo.save(cfg);
        }
        return cfg;
    }
    async updateToken(partial) {
        const existed = await this.getToken();
        const merged = this.cfgRepo.merge(existed, partial);
        return this.cfgRepo.save(merged);
    }
    async token() {
        const cfg = await this.getToken();
        const t = cfg?.bot_token || process.env.TELEGRAM_BOT_TOKEN;
        if (!t)
            throw new Error('Telegram bot token chưa được cấu hình!');
        return t;
    }
    listRecipients() {
        return this.recRepo.find({ order: { created_at: 'DESC' } });
    }
    async upsertRecipient(dto) {
        const chatId = String(dto.chat_id);
        const existed = await this.recRepo.findOne({ where: { chat_id: chatId } });
        if (existed) {
            existed.display_name = dto.display_name ?? existed.display_name;
            if (typeof dto.is_active === 'boolean')
                existed.is_active = dto.is_active;
            return this.recRepo.save(existed);
        }
        const seed = {
            chat_id: chatId,
            display_name: dto.display_name,
            is_active: dto.is_active ?? true,
        };
        return this.recRepo.save(this.recRepo.create(seed));
    }
    async removeRecipient(id) {
        await this.recRepo.delete(id);
        return { ok: true };
    }
    async getTemplate(key) {
        let tpl = await this.tplRepo.findOne({ where: { key } });
        if (!tpl) {
            const seed = {
                key,
                content: '🛒 ĐƠN HÀNG MỚI — CHỜ DUYỆT\n• Mã: {{code}}\n• Khách: {{customer}}\n• Tổng: {{total}}₫\n• Sản phẩm: {{items}}\n• Thời gian: {{time}}\n• Link: {{link}}',
            };
            tpl = await this.tplRepo.save(this.tplRepo.create(seed));
        }
        return tpl;
    }
    setTemplate(key, content) {
        const seed = { key, content };
        return this.tplRepo.save(this.tplRepo.create(seed));
    }
    async api(path, body) {
        const token = await this.token();
        const url = `https://api.telegram.org/bot${token}${path}`;
        const res = await axios_1.default.post(url, body);
        return res.data;
    }
    async sendText(chat_id, text) {
        return this.api('/sendMessage', {
            chat_id,
            text,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
        });
    }
    async getUpdates(offset) {
        const token = await this.token();
        const url = `https://api.telegram.org/bot${token}/getUpdates`;
        const res = await axios_1.default.get(url, { params: { offset: offset ?? undefined, timeout: 0 } });
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
        let out = tplContent || 'Đơn hàng #{{code}} tổng {{total}}₫';
        for (const [k, v] of Object.entries(map))
            out = out.split(k).join(v);
        return out;
    }
    async notifyAdminsOrderSuccess(order) {
        const recs = await this.recRepo.find({ where: { is_active: true } });
        if (!recs.length)
            return;
        const tpl = await this.getTemplate('ORDER_SUCCESS');
        const text = this.renderOrderSuccess(order, tpl.content);
        for (const r of recs) {
            try {
                await this.sendText(String(r.chat_id), text);
            }
            catch {
            }
        }
    }
};
exports.TelegramService = TelegramService;
exports.TelegramService = TelegramService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(telegram_config_entity_1.TelegramConfig)),
    __param(1, (0, typeorm_2.InjectRepository)(telegram_recipient_entity_1.TelegramRecipient)),
    __param(2, (0, typeorm_2.InjectRepository)(telegram_template_entity_1.TelegramTemplate)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map