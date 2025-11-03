import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'zalo_admins' })
export class ZaloAdmin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64, unique: true })
  zalo_user_id: string;

  @Column({ length: 128, nullable: true })
  display_name?: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
