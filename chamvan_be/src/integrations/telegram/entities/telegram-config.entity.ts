// src/integrations/telegram/entities/telegram-config.entity.ts
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('telegram_config')
export class TelegramConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 128, nullable: true }) // ✅ cho NULL
  bot_token: string | null;                                  // ✅ kiểu cho phép null

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
