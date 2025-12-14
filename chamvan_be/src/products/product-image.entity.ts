// import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
// import { Product } from './product.entity';

// @Entity('product_images')
// export class ProductImage {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ type: 'longtext' })
//   url: string;

//   // >>> đổi tên cột thành productId (camelCase)
//   @Column({ name: 'productId', type: 'int' })
//   productId: number;

//   @ManyToOne(() => Product, (p) => p.images, { onDelete: 'CASCADE' })
//   @JoinColumn({ name: 'productId' })
//   product: Product;
// }




  

// src/products/entities/product-image.entity.ts
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  // ✅ TEXT chỉ ~64KB → base64 dễ “Data too long”
  @Column({ type: 'longtext' })
  url: string;

  @Column()
  productId: number;

  @ManyToOne(() => Product, (p) => p.images, { onDelete: 'CASCADE' })
  product: Product;
}
