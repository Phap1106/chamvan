// src/config/typeorm.config.ts
import { DataSource, DataSourceOptions } from 'typeorm';

import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';
import { Product } from '../products/product.entity';
import { ProductImage } from '../products/product-image.entity';
import { ProductColor } from '../products/product-color.entity';
import { ProductSpec } from '../products/product-spec.entity';
import { Order } from '../orders/order.entity';
import { OrderItem } from '../orders/order-item.entity';
import 'dotenv/config';


export const ormOpts: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Category, Product, ProductImage, ProductColor, ProductSpec, Order, OrderItem],
  synchronize: false,           // DEV: tự tạo bảng
  logging: false,
  charset: 'utf8mb4',
  timezone: 'Z',
};

// DataSource cho seed
const ds = new DataSource(ormOpts);
console.log('ENV:', process.env.DB_HOST, process.env.DB_USERNAME, process.env.DB_NAME);
export default ds;
