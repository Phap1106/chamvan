import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductVariants1718300001000 implements MigrationInterface {
  name = 'CreateProductVariants1718300001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE \`product_variants\`');
  }
}
