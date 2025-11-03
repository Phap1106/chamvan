import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'zalo_config' })
export class ZaloConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  oa_access_token?: string;

  @Column({ nullable: true })
  oa_refresh_token?: string;

  @Column({ type: 'bigint', nullable: true })
  oa_expires_at?: string; // epoch ms

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
