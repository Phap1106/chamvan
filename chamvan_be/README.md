<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).



-- TẠO DB (nếu chưa có)
CREATE DATABASE IF NOT EXISTS chamvan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE chamvan;

-- DỌN SẠCH BẢNG THEO THỨ TỰ PHỤ THUỘC
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS product_colors;
DROP TABLE IF EXISTS product_specs;
DROP TABLE IF EXISTS product_categories;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- USERS
CREATE TABLE users (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  full_name      VARCHAR(255) NOT NULL,
  email          VARCHAR(255) NOT NULL UNIQUE,
  password       VARCHAR(255) NOT NULL,
  phone          VARCHAR(50)  NULL,
  dob            DATE         NULL,
  role           VARCHAR(32)  NOT NULL DEFAULT 'user', -- 'admin' | 'support_admin' | 'user'
  token_version  INT          NOT NULL DEFAULT 0,
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- CATEGORIES (bậc 1 & bậc 2)
CREATE TABLE categories (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  slug         VARCHAR(255) NOT NULL UNIQUE,
  name         VARCHAR(255) NOT NULL,
  description  TEXT NULL,
  parent_id    INT NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_categories_parent
    FOREIGN KEY (parent_id) REFERENCES categories(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- PRODUCTS
CREATE TABLE products (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(255) NOT NULL,
  slug         VARCHAR(255) NULL UNIQUE,
  price        DECIMAL(12,2) NOT NULL DEFAULT 0,
  sku          VARCHAR(255) NULL,
  description  TEXT NULL,
  image        TEXT NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- PRODUCT IMAGES (camelCase: productId)  <-- khớp log TypeORM: `product_images`.`productId`
CREATE TABLE product_images (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  productId  INT NOT NULL,
  url        TEXT NOT NULL,
  CONSTRAINT fk_pimages_product
    FOREIGN KEY (productId) REFERENCES products(id)
    ON DELETE CASCADE,
  INDEX idx_pimages_productId (productId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- PRODUCT COLORS (camelCase: productId)
CREATE TABLE product_colors (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  productId  INT NOT NULL,
  name       VARCHAR(100) NOT NULL,
  hex        VARCHAR(16)  NULL,
  CONSTRAINT fk_pcolors_product
    FOREIGN KEY (productId) REFERENCES products(id)
    ON DELETE CASCADE,
  INDEX idx_pcolors_productId (productId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- PRODUCT SPECS (camelCase: productId)
CREATE TABLE product_specs (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  productId  INT NOT NULL,
  label      VARCHAR(255) NOT NULL,
  value      VARCHAR(255) NOT NULL,
  CONSTRAINT fk_pspecs_product
    FOREIGN KEY (productId) REFERENCES products(id)
    ON DELETE CASCADE,
  INDEX idx_pspecs_productId (productId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- PRODUCT_CATEGORIES (snake_case như log JOIN gần nhất)
CREATE TABLE product_categories (
  product_id  INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY (product_id, category_id),
  CONSTRAINT fk_pc_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_pc_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE CASCADE,
  INDEX idx_pc_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ORDERS (camelCase cột – khớp log lỗi: Order.customerName, …)
CREATE TABLE orders (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  customerName     VARCHAR(255) NULL,
  customerEmail    VARCHAR(255) NULL,
  customerPhone    VARCHAR(50)  NULL,
  customerDob      DATE         NULL,
  shippingAddress  TEXT         NULL,
  notes            TEXT         NULL,
  subtotal         DECIMAL(12,2) NOT NULL DEFAULT 0,
  shippingFee      DECIMAL(12,2) NOT NULL DEFAULT 0,
  total            DECIMAL(12,2) NOT NULL DEFAULT 0,
  createdAt        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  userId           INT NULL,
  CONSTRAINT fk_orders_user
    FOREIGN KEY (userId) REFERENCES users(id)
    ON DELETE SET NULL,
  INDEX idx_orders_userId (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ORDER ITEMS (camelCase FK – khớp log)
CREATE TABLE order_items (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  qty        INT NOT NULL,
  unitPrice  DECIMAL(12,2) NOT NULL DEFAULT 0,
  lineTotal  DECIMAL(12,2) NOT NULL DEFAULT 0,
  orderId    INT NOT NULL,
  productId  INT NOT NULL,
  CONSTRAINT fk_oitems_order
    FOREIGN KEY (orderId) REFERENCES orders(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_oitems_product
    FOREIGN KEY (productId) REFERENCES products(id)
    ON DELETE RESTRICT,
  INDEX idx_oitems_orderId (orderId),
  INDEX idx_oitems_productId (productId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
