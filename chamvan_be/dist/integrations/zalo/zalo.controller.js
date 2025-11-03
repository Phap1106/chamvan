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
exports.ZaloWebhookController = exports.ZaloAdminController = void 0;
const common_1 = require("@nestjs/common");
const zalo_service_1 = require("./zalo.service");
const zalo_dto_1 = require("./dto/zalo.dto");
let ZaloAdminController = class ZaloAdminController {
    zalo;
    constructor(zalo) {
        this.zalo = zalo;
    }
    getToken() { return this.zalo.getToken(); }
    updateToken(dto) { return this.zalo.updateToken(dto); }
    listAdmins() { return this.zalo.listAdmins(); }
    upsertAdmin(dto) { return this.zalo.upsertAdmin(dto); }
    removeAdmin(id) { return this.zalo.removeAdmin(Number(id)); }
    async getTpl(key = 'ORDER_SUCCESS') { return this.zalo.getTemplate(key); }
    setTpl(dto) { return this.zalo.setTemplate(dto.key, dto.content); }
    sendManual(dto) { return this.zalo.sendTextToUser(dto.zalo_user_id, dto.text); }
    ping(id) { return this.zalo.sendTextToUser(id, 'Ping từ hệ thống 👋'); }
};
exports.ZaloAdminController = ZaloAdminController;
__decorate([
    (0, common_1.Get)('token'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ZaloAdminController.prototype, "getToken", null);
__decorate([
    (0, common_1.Put)('token'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [zalo_dto_1.UpdateTokenDto]),
    __metadata("design:returntype", void 0)
], ZaloAdminController.prototype, "updateToken", null);
__decorate([
    (0, common_1.Get)('recipients'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ZaloAdminController.prototype, "listAdmins", null);
__decorate([
    (0, common_1.Post)('recipients'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [zalo_dto_1.UpsertAdminDto]),
    __metadata("design:returntype", void 0)
], ZaloAdminController.prototype, "upsertAdmin", null);
__decorate([
    (0, common_1.Delete)('recipients/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ZaloAdminController.prototype, "removeAdmin", null);
__decorate([
    (0, common_1.Get)('templates'),
    __param(0, (0, common_1.Query)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ZaloAdminController.prototype, "getTpl", null);
__decorate([
    (0, common_1.Put)('templates'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [zalo_dto_1.UpdateTemplateDto]),
    __metadata("design:returntype", void 0)
], ZaloAdminController.prototype, "setTpl", null);
__decorate([
    (0, common_1.Post)('send'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [zalo_dto_1.SendManualDto]),
    __metadata("design:returntype", void 0)
], ZaloAdminController.prototype, "sendManual", null);
__decorate([
    (0, common_1.Post)('ping'),
    __param(0, (0, common_1.Body)('zalo_user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ZaloAdminController.prototype, "ping", null);
exports.ZaloAdminController = ZaloAdminController = __decorate([
    (0, common_1.Controller)('admin/zalo'),
    __metadata("design:paramtypes", [zalo_service_1.ZaloService])
], ZaloAdminController);
let ZaloWebhookController = class ZaloWebhookController {
    zalo;
    constructor(zalo) {
        this.zalo = zalo;
    }
    async webhook(payload) {
        const text = payload?.message?.text?.trim();
        const userId = payload?.sender?.id || payload?.user_id;
        const name = payload?.sender?.name;
        if (text?.toUpperCase() === 'ADMIN ON' && userId) {
            await this.zalo.upsertAdmin({ zalo_user_id: String(userId), display_name: name, is_active: true });
            await this.zalo.sendTextToUser(String(userId), 'Đã đăng ký nhận thông báo đơn hàng thành công ✅');
        }
        if (text?.toUpperCase() === 'ADMIN OFF' && userId) {
            await this.zalo.upsertAdmin({ zalo_user_id: String(userId), display_name: name, is_active: false });
            await this.zalo.sendTextToUser(String(userId), 'Đã tắt nhận thông báo ✅');
        }
        return { ok: true };
    }
};
exports.ZaloWebhookController = ZaloWebhookController;
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ZaloWebhookController.prototype, "webhook", null);
exports.ZaloWebhookController = ZaloWebhookController = __decorate([
    (0, common_1.Controller)('integrations/zalo'),
    __metadata("design:paramtypes", [zalo_service_1.ZaloService])
], ZaloWebhookController);
//# sourceMappingURL=zalo.controller.js.map