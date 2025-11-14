import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Index
} from 'typeorm';

export type ReturnStatus = 'pending' | 'in_review' | 'approved' | 'rejected' | 'refunded';

@Entity('return_requests')
export class ReturnRequest {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Index('idx_return_user')
  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Index('idx_return_order')
  @Column({ name: 'order_code', type: 'varchar', length: 50 })
  orderCode: string;

  @Column({ type: 'text' })
  reason: string;

  @Index('idx_return_status')
  @Column({
    type: 'enum',
    enum: ['pending', 'in_review', 'approved', 'rejected', 'refunded'],
    default: 'pending',
  })
  status: ReturnStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
