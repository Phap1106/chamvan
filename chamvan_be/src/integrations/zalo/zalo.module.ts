import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZaloConfig } from './entities/zalo-config.entity';
import { ZaloAdmin } from './entities/zalo-admin.entity';
import { ZaloTemplate } from './entities/zalo-template.entity';
import { ZaloService } from './zalo.service';
import { ZaloAdminController, ZaloWebhookController } from './zalo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ZaloConfig, ZaloAdmin, ZaloTemplate])],
  controllers: [ZaloAdminController, ZaloWebhookController],
  providers: [ZaloService],
  exports: [ZaloService],
})
export class ZaloModule {}
