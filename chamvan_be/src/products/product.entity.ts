// //src/products/product.entity.ts
// import {
//   Entity, PrimaryGeneratedColumn, Column,
//   CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable
// } from 'typeorm';
// import { ProductImage } from './product-image.entity';
// import { ProductColor } from './product-color.entity';
// import { ProductSpec } from './product-spec.entity';
// import { Category } from '../categories/category.entity';

// @Entity('products')
// export class Product {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   name: string;

//   @Column({ nullable: true })
//   slug?: string;

//   @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
//   price: string;
//   // thêm vào class Product

// @Column('decimal', { precision: 15, scale: 2, nullable: true, name: 'original_price' })
// originalPrice?: string | null;

// @Column('decimal', { precision: 15, scale: 2, nullable: true, name: 'sale_price' })
// salePrice?: string | null;


//   @Column({ nullable: true })
//   sku?: string;

//   // SỬA: Chuyển sang 'longtext' để chứa bài viết dài
//   @Column({ type: 'longtext', nullable: true })
//   description?: string;

//   @Column({ type: 'int', default: 0 })
//   stock: number;

//   @Column({ type: 'enum', enum: ['open','closed'], default: 'open' })
//   status: 'open' | 'closed';

//   @Column({ type: 'int', default: 0 })
//   sold: number;

//   // SỬA: Chuyển sang 'longtext' để chứa link ảnh siêu dài
//   @Column({ type: 'longtext', nullable: true })
//   image?: string;

//   @OneToMany(() => ProductImage, (img) => img.product, { cascade: true })
//   images: ProductImage[];

//   @OneToMany(() => ProductColor, (c) => c.product, { cascade: true })
//   colors: ProductColor[];

//   @OneToMany(() => ProductSpec, (s) => s.product, { cascade: true })
//   specs: ProductSpec[];

//   @ManyToMany(() => Category, (c) => c.products, { eager: true })
//   @JoinTable({
//     name: 'product_categories',
//     joinColumn: { name: 'product_id', referencedColumnName: 'id' },
//     inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
//   })
//   categories: Category[];

//   @CreateDateColumn({ name: 'created_at' })
//   createdAt: Date;

//   @UpdateDateColumn({ name: 'updated_at' })
//   updatedAt: Date;
// }







// // chamvan_be/src/products/product.entity.ts
// import {
//   Column,
//   CreateDateColumn,
//   Entity,
//   OneToMany,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from 'typeorm';
// import { ProductImage } from './product-image.entity';
// import { ProductColor } from './product-color.entity';
// import { ProductSpec } from './product-spec.entity';
// import { Category } from '../categories/category.entity';

// @Entity('products')
// export class Product {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ type: 'varchar', length: 255 })
//   name: string;

//   @Column({ type: 'varchar', length: 255, nullable: true })
//   slug?: string | null;

//   /** ✅ price = giá bán thực tế */
//   @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
//   price: string;

//   /** ✅ original_price = giá gốc */
//   @Column({ name: 'original_price', type: 'decimal', precision: 12, scale: 2, nullable: true, default: null })
//   original_price?: string | null;

//   /** ✅ discount_percent = % giảm */
//   @Column({ name: 'discount_percent', type: 'tinyint', unsigned: true, default: 0 })
//   discount_percent: number;

//   @Column({ type: 'varchar', length: 255, nullable: true })
//   sku?: string | null;

//   @Column({ type: 'int', default: 0 })
//   stock: number;

//   @Column({ type: 'enum', enum: ['open', 'closed'], default: 'open' })
//   status: 'open' | 'closed';

//   @Column({ type: 'int', default: 0 })
//   sold: number;

//   @CreateDateColumn({ name: 'created_at', type: 'datetime', precision: 6 })
//   created_at: Date;

//   @UpdateDateColumn({ name: 'updated_at', type: 'datetime', precision: 6 })
//   updated_at: Date;

//   @Column({ type: 'longtext', nullable: true })
//   description?: string | null;

//   /** ảnh chính */
//   @Column({ type: 'longtext', nullable: true })
//   image?: string | null;

//   /* Relations */
//   @OneToMany(() => ProductImage, (i) => i.product, { cascade: true })
//   images: ProductImage[];

//   @OneToMany(() => ProductColor, (c) => c.product, { cascade: true })
//   colors: ProductColor[];

//   @OneToMany(() => ProductSpec, (s) => s.product, { cascade: true })
//   specs: ProductSpec[];

//   // nếu bạn đang dùng ManyToMany categories (tuỳ code cũ)
//   categories?: Category[];
// }







import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { ProductColor } from './product-color.entity';
import { ProductSpec } from './product-spec.entity';
import { Category } from '../categories/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  slug?: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  price: string;

  @Column({ name: 'original_price', type: 'decimal', precision: 12, scale: 2, nullable: true, default: null })
  original_price?: string | null;

  @Column({ name: 'discount_percent', type: 'tinyint', unsigned: true, default: 0 })
  discount_percent: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sku?: string | null;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'enum', enum: ['open', 'closed'], default: 'open' })
  status: 'open' | 'closed';

  @Column({ type: 'int', default: 0 })
  sold: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', precision: 6 })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', precision: 6 })
  updated_at: Date;

  @Column({ type: 'longtext', nullable: true })
  description?: string | null;

  @Column({ type: 'longtext', nullable: true })
  image?: string | null;

  @OneToMany(() => ProductImage, (i) => i.product, { cascade: true })
  images: ProductImage[];

  @OneToMany(() => ProductColor, (c) => c.product, { cascade: true })
  colors: ProductColor[];

  @OneToMany(() => ProductSpec, (s) => s.product, { cascade: true })
  specs: ProductSpec[];

  /** ✅ QUAN TRỌNG: bật lại pivot table product_categories */
  @ManyToMany(() => Category, (c) => c.products, { eager: true })
  @JoinTable({
    name: 'product_categories',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];
}
