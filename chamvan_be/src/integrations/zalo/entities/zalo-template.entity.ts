import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'zalo_templates' })
export class ZaloTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64, unique: true })
  key: string; // vd: ORDER_SUCCESS

  @Column({ type: 'text' })
  content: string; // ví dụ: "🛒 Đơn #{{code}} tổng {{total}}₫"

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
