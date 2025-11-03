"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZaloModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const zalo_config_entity_1 = require("./entities/zalo-config.entity");
const zalo_admin_entity_1 = require("./entities/zalo-admin.entity");
const zalo_template_entity_1 = require("./entities/zalo-template.entity");
const zalo_service_1 = require("./zalo.service");
const zalo_controller_1 = require("./zalo.controller");
let ZaloModule = class ZaloModule {
};
exports.ZaloModule = ZaloModule;
exports.ZaloModule = ZaloModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([zalo_config_entity_1.ZaloConfig, zalo_admin_entity_1.ZaloAdmin, zalo_template_entity_1.ZaloTemplate])],
        controllers: [zalo_controller_1.ZaloAdminController, zalo_controller_1.ZaloWebhookController],
        providers: [zalo_service_1.ZaloService],
        exports: [zalo_service_1.ZaloService],
    })
], ZaloModule);
//# sourceMappingURL=zalo.module.js.map