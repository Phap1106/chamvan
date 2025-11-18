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

  @Column({ nullable: true })
  slug?: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  price: string;

  @Column({ nullable: true })
  sku?: string;

  // SỬA: Chuyển sang 'longtext' để chứa bài viết dài
  @Column({ type: 'longtext', nullable: true })
  description?: string;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'enum', enum: ['open','closed'], default: 'open' })
  status: 'open' | 'closed';

  @Column({ type: 'int', default: 0 })
  sold: number;

  // SỬA: Chuyển sang 'longtext' để chứa link ảnh siêu dài
  @Column({ type: 'longtext', nullable: true })
  image?: string;

  @OneToMany(() => ProductImage, (img) => img.product, { cascade: true })
  images: ProductImage[];

  @OneToMany(() => ProductColor, (c) => c.product, { cascade: true })
  colors: ProductColor[];

  @OneToMany(() => ProductSpec, (s) => s.product, { cascade: true })
  specs: ProductSpec[];

  @ManyToMany(() => Category, (c) => c.products, { eager: true })
  @JoinTable({
    name: 'product_categories',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}