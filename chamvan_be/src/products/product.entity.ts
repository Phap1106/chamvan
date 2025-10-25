import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { ProductColor } from './product-color.entity';
import { ProductSpec } from './product-spec.entity';
import { Category } from '../categories/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // nếu cột price là DECIMAL: giữ string để không mất độ chính xác
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  price: string;

  @Column({ nullable: true })
  sku?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;
@Column({ type: 'int', default: 0 })
stock: number;
@Column({ type: 'enum', enum: ['open','closed'], default: 'open' })
status: 'open' | 'closed';

@Column({ type: 'int', default: 0 })
sold: number;
  // ảnh đại diện (url)
  @Column({ nullable: true })
  image?: string;

  @OneToMany(() => ProductImage, (img) => img.product, { cascade: true })
  images: ProductImage[];

  @OneToMany(() => ProductColor, (c) => c.product, { cascade: true })
  colors: ProductColor[];

  @OneToMany(() => ProductSpec, (s) => s.product, { cascade: true })
  specs: ProductSpec[];

  @ManyToMany(() => Category, (c) => c.products, { eager: true })
  @JoinTable({
    name: 'product_categories',                  // bảng nối hiện có
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
