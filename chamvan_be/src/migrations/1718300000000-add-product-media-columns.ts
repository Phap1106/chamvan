import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductMediaColumns1718300000000 implements MigrationInterface {
  name = 'AddProductMediaColumns1718300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `products` ADD `videoUrl` longtext NULL');
    await queryRunner.query('ALTER TABLE `products` ADD `galleryUrls` longtext NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `products` DROP COLUMN `galleryUrls`');
    await queryRunner.query('ALTER TABLE `products` DROP COLUMN `videoUrl`');
  }
}
