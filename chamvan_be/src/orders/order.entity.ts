// // src/orders/order.entity.ts
// import {
//   Column,
//   CreateDateColumn,
//   Entity,
//   OneToMany,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from 'typeorm';
// import { OrderItem } from './order-item.entity';
// import { ColumnNumericTransformer } from '../common/column-numeric.transformer';

// @Entity('orders')
// export class Order {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ type: 'varchar', length: 255 })
//   customerName: string;

//   @Column({ type: 'varchar', length: 255 })
//   customerEmail: string;

//   @Column({ type: 'varchar', length: 20, nullable: true })
//   customerPhone: string | null;

//   @Column({ type: 'varchar', length: 20, nullable: true })
//   customerDob: string | null;

//   @Column({ type: 'text', nullable: true })
//   shippingAddress: string | null;

//   @Column({ type: 'text', nullable: true })
//   notes: string | null;

//   @Column('decimal', {
//     precision: 12,
//     scale: 0,
//     default: 0,
//     transformer: new ColumnNumericTransformer(),
//   })
//   subtotal: number;

//   @Column('decimal', {
//     precision: 12,
//     scale: 0,
//     default: 0,
//     transformer: new ColumnNumericTransformer(),
//   })
//   shippingFee: number;

//   @Column('decimal', {
//     precision: 12,
//     scale: 0,
//     default: 0,
//     transformer: new ColumnNumericTransformer(),
//   })
//   total: number;

//   @Column({ type: 'varchar', length: 50, default: 'chờ duyệt' })
//   status: string;

//   @Column({ type: 'datetime', nullable: true })
//   eta: string | null;

//   @Column({ type: 'int', nullable: true })
//   userId: number | null;

//   @OneToMany(() => OrderItem, (i) => i.order, { cascade: false })
//   items: OrderItem[];

  
//   @Column({ name: 'ip_address', nullable: true, length: 64 })
//   ipAddress?: string;

//   @Column({ name: 'user_agent', nullable: true, type: 'text' })
//   userAgent?: string;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }














import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { ColumnNumericTransformer } from '../common/column-numeric.transformer';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  customerName: string;

  @Column({ type: 'varchar', length: 255 })
  customerEmail: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  customerPhone: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  customerDob: string | null;

  @Column({ type: 'text', nullable: true })
  shippingAddress: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column('decimal', {
    precision: 12,
    scale: 0,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  subtotal: number;

  @Column('decimal', {
    precision: 12,
    scale: 0,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  shippingFee: number;

  @Column('decimal', {
    precision: 12,
    scale: 0,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  total: number;

  @Column({ type: 'varchar', length: 50, default: 'chờ duyệt' })
  status: string;

  @Column({ type: 'datetime', nullable: true })
  eta: string | null;

  @Column({ type: 'int', nullable: true })
  userId: number | null;

  @OneToMany(() => OrderItem, (i) => i.order, { cascade: false })
  items: OrderItem[];

  @Column({ name: 'ip_address', type: 'varchar', length: 64, nullable: true })
  ipAddress: string | null;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string | null;


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
