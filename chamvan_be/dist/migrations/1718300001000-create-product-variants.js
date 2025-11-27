"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductVariants1718300001000 = void 0;
class CreateProductVariants1718300001000 {
    name = 'CreateProductVariants1718300001000';
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE \`product_variants\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`product_id\` int NOT NULL,
        \`name\` varchar(120) NOT NULL,
        \`price\` decimal(12,2) NOT NULL DEFAULT '0.00',
        \`stock\` int NOT NULL DEFAULT '0',
        \`sku\` varchar(120) NULL,
        PRIMARY KEY (\`id\`),
        KEY \`IDX_product_variant_product_id\` (\`product_id\`),
        CONSTRAINT \`FK_product_variant_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    }
    async down(queryRunner) {
        await queryRunner.query('DROP TABLE \`product_variants\`');
    }
}
exports.CreateProductVariants1718300001000 = CreateProductVariants1718300001000;
//# sourceMappingURL=1718300001000-create-product-variants.js.map