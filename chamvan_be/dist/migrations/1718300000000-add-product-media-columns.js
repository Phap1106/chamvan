"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddProductMediaColumns1718300000000 = void 0;
class AddProductMediaColumns1718300000000 {
    name = 'AddProductMediaColumns1718300000000';
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE `products` ADD `videoUrl` longtext NULL');
        await queryRunner.query('ALTER TABLE `products` ADD `galleryUrls` longtext NULL');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE `products` DROP COLUMN `galleryUrls`');
        await queryRunner.query('ALTER TABLE `products` DROP COLUMN `videoUrl`');
    }
}
exports.AddProductMediaColumns1718300000000 = AddProductMediaColumns1718300000000;
//# sourceMappingURL=1718300000000-add-product-media-columns.js.map