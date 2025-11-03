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
exports.TelegramService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const typeorm_1 = require("typeorm");
const telegram_config_entity_1 = require("./entities/telegram-config.entity");
const telegram_recipient_entity_1 = require("./entities/telegram-recipient.entity");
const telegram_template_entity_1 = require("./entities/telegram-template.entity");
let TelegramService = class TelegramService {
    cfgRepo;
    recRepo;
    tplRepo;
    constructor(ds) {
        this.cfgRepo = ds.getRepository(telegram_config_entity_1.TelegramConfig);
        this.recRepo = ds.getRepository(telegram_recipient_entity_1.TelegramRecipient);
        this.tplRepo = ds.getRepository(telegram_template_entity_1.TelegramTemplate);
    }
    async getToken() {
        const cfg = await this.cfgRepo.findOne({ where: { id: 1 } });
        return cfg;
    }
    async updateToken(partial) {
        const existed = await this.getToken();
        const merged = this.cfgRepo.merge(existed ?? this.cfgRepo.create({ id: 1 }), partial);
        return this.cfgRepo.save(merged);
    }
    async token() {
        const cfg = await this.getToken();
        const t = cfg?.bot_token || process.env.TELEGRAM_BOT_TOKEN;
        if (!t)
            throw new Error('Telegram bot token chưa được cấu hình!');
        return t;
    }
    listRecipients() { return this.recRepo.find({ order: { created_at: 'DESC' } }); }
    async upsertRecipient(dto) {
        const existed = await this.recRepo.findOne({ where: { chat_id: String(dto.chat_id) } });
        if (existed) {
            existed.display_name = dto.display_name ?? existed.display_name;
            if (typeof dto.is_active === 'boolean')
                existed.is_active = dto.is_active;
            return this.recRepo.save(existed);
        }
        return this.recRepo.save(this.recRepo.create({
            chat_id: String(dto.chat_id),
            display_name: dto.display_name,
            is_active: dto.is_active ?? true,
        }));
    }
    async removeRecipient(id) { await this.recRepo.delete(id); return { ok: true }; }
    async getTemplate(key) {
        let tpl = await this.tplRepo.findOne({ where: { key } });
        if (!tpl)
            tpl = await this.tplRepo.save(this.tplRepo.create({ key, content: '' }));
        return tpl;
    }
    setTemplate(key, content) {
        return this.tplRepo.save(this.tplRepo.create({ key, content }));
    }
    async api(path, body) {
        const token = await this.token();
        const url = `https://api.telegram.org/bot${token}${path}`;
        const res = await axios_1.default.post(url, body);
        return res.data;
    }
    async sendText(chat_id, text) {
        return this.api('/sendMessage', { chat_id, text, parse_mode: 'HTML', disable_web_page_preview: true });
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
            catch { }
        }
    }
};
exports.TelegramService = TelegramService;
exports.TelegramService = TelegramService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map