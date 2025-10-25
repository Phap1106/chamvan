// src/orders/order-item.entity.ts
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { ColumnNumericTransformer } from '../common/column-numeric.transformer';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (o) => o.items, { onDelete: 'CASCADE' })
  order: Order;

  @Column({ type: 'int' })
  productId: number;

  @Column({ type: 'int' })
  qty: number;

  @Column('decimal', {
    precision: 12,
    scale: 0,
    transformer: new ColumnNumericTransformer(),
  })
  unitPrice: number;

  @Column('decimal', {
    precision: 12,
    scale: 0,
    transformer: new ColumnNumericTransformer(),
  })
  lineTotal: number;
}





