// chamvan_be/src/integrations/telegram/telegram.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramConfig } from './entities/telegram-config.entity';
import { TelegramRecipient } from './entities/telegram-recipient.entity';
import { TelegramTemplate } from './entities/telegram-template.entity';
import { TelegramService } from './telegram.service';
import { TelegramAdminController } from './telegram.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TelegramConfig, TelegramRecipient, TelegramTemplate])],
  controllers: [TelegramAdminController],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
