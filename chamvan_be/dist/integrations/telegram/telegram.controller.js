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
exports.TelegramAdminController = void 0;
const common_1 = require("@nestjs/common");
const telegram_service_1 = require("./telegram.service");
const telegram_dto_1 = require("./dto/telegram.dto");
let TelegramAdminController = class TelegramAdminController {
    tg;
    constructor(tg) {
        this.tg = tg;
    }
    getToken() { return this.tg.getToken(); }
    updateToken(dto) { return this.tg.updateToken(dto); }
    listRecipients() { return this.tg.listRecipients(); }
    upsertRecipient(dto) { return this.tg.upsertRecipient(dto); }
    removeRecipient(id) { return this.tg.removeRecipient(Number(id)); }
    getTpl(key = 'ORDER_SUCCESS') { return this.tg.getTemplate(key); }
    setTpl(dto) { return this.tg.setTemplate(dto.key, dto.content); }
    sendManual(dto) { return this.tg.sendText(dto.chat_id, dto.text); }
    ping(id) { return this.tg.sendText(id, 'Ping từ hệ thống 👋'); }
    getUpdates(offset) {
        return this.tg.getUpdates(offset ? Number(offset) : undefined);
    }
};
exports.TelegramAdminController = TelegramAdminController;
__decorate([
    (0, common_1.Get)('token'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TelegramAdminController.prototype, "getToken", null);
__decorate([
    (0, common_1.Put)('token'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegram_dto_1.UpdateBotTokenDto]),
    __metadata("design:returntype", void 0)
], TelegramAdminController.prototype, "updateToken", null);
__decorate([
    (0, common_1.Get)('recipients'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TelegramAdminController.prototype, "listRecipients", null);
__decorate([
    (0, common_1.Post)('recipients'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegram_dto_1.UpsertRecipientDto]),
    __metadata("design:returntype", void 0)
], TelegramAdminController.prototype, "upsertRecipient", null);
__decorate([
    (0, common_1.Delete)('recipients/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TelegramAdminController.prototype, "removeRecipient", null);
__decorate([
    (0, common_1.Get)('templates'),
    __param(0, (0, common_1.Query)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TelegramAdminController.prototype, "getTpl", null);
__decorate([
    (0, common_1.Put)('templates'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegram_dto_1.UpdateTemplateDto]),
    __metadata("design:returntype", void 0)
], TelegramAdminController.prototype, "setTpl", null);
__decorate([
    (0, common_1.Post)('send'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegram_dto_1.SendManualDto]),
    __metadata("design:returntype", void 0)
], TelegramAdminController.prototype, "sendManual", null);
__decorate([
    (0, common_1.Post)('ping'),
    __param(0, (0, common_1.Body)('chat_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TelegramAdminController.prototype, "ping", null);
__decorate([
    (0, common_1.Get)('updates'),
    __param(0, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TelegramAdminController.prototype, "getUpdates", null);
exports.TelegramAdminController = TelegramAdminController = __decorate([
    (0, common_1.Controller)('admin/telegram'),
    __metadata("design:paramtypes", [telegram_service_1.TelegramService])
], TelegramAdminController);
//# sourceMappingURL=telegram.controller.js.map