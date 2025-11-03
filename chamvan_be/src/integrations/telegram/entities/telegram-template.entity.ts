import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'telegram_templates' })
export class TelegramTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64, unique: true })
  key: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
