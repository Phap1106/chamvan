import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'telegram_config' })
export class TelegramConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  bot_token?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
