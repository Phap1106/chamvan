import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

// telegram-recipient.entity.ts
@Entity('telegram_recipients')
export class TelegramRecipient {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'bigint', unique: true }) chat_id: string; // lưu string cho an toàn
  @Column({ type: 'varchar', length: 128, nullable: true }) display_name: string | null;
  @Column({ type: 'tinyint', width: 1, default: 1 }) is_active: boolean;
  @CreateDateColumn({ name: 'created_at' }) created_at: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updated_at: Date;
}

// telegram-template.entity.ts
@Entity('telegram_templates')
export class TelegramTemplate {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'varchar', length: 64, unique: true }) key: string;
  @Column({ type: 'text' }) content: string;
  @CreateDateColumn({ name: 'created_at' }) created_at: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updated_at: Date;
}
