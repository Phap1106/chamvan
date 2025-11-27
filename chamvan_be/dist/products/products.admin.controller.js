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
exports.ProductsAdminController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_guard_1 = require("../auth/jwt.guard");
const roles_guard_1 = require("../common/roles.guard");
const roles_decorator_1 = require("../common/roles.decorator");
const role_enum_1 = require("../common/role.enum");
const products_service_1 = require("./products.service");
const uploads_multer_1 = require("./uploads.multer");
let ProductsAdminController = class ProductsAdminController {
    products;
    constructor(products) {
        this.products = products;
    }
    async uploadImages(id, files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('Không có file ảnh hợp lệ');
        }
        const urls = files.map((file) => toPublicUploadUrl(file.path));
        const result = await this.products.appendGalleryImages(id, urls);
        return {
            uploaded: urls,
            galleryUrls: result.galleryUrls,
            image: result.image,
        };
    }
    async uploadVideo(id, file) {
        if (!file)
            throw new common_1.BadRequestException('Không có file video');
        const url = toPublicUploadUrl(file.path);
        await this.products.updateVideoUrl(id, url);
        return { videoUrl: url };
    }
};
exports.ProductsAdminController = ProductsAdminController;
__decorate([
    (0, common_1.Post)(':id/media/image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, uploads_multer_1.imageUploadOptions)),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array]),
    __metadata("design:returntype", Promise)
], ProductsAdminController.prototype, "uploadImages", null);
__decorate([
    (0, common_1.Post)(':id/media/video'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', uploads_multer_1.videoUploadOptions)),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ProductsAdminController.prototype, "uploadVideo", null);
exports.ProductsAdminController = ProductsAdminController = __decorate([
    (0, common_1.Controller)('admin/products'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsAdminController);
//# sourceMappingURL=products.admin.controller.js.map