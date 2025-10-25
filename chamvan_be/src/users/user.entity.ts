// src/users/user.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class User {
  // DB đang là varchar UUID → dùng 'uuid' và type string
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'full_name', nullable: true })
  fullName?: string;

  @Column({ unique: true })
  email: string;

  // cột tồn tại trong DB nhưng KHÔNG auto-select để tránh lộ mật khẩu
  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ type: 'date', nullable: true })
  dob?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'token_version', type: 'int', default: 0 })
  tokenVersion: number;
}
