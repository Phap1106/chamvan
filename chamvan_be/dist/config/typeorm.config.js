"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ormOpts = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const category_entity_1 = require("../categories/category.entity");
const product_entity_1 = require("../products/product.entity");
const product_image_entity_1 = require("../products/product-image.entity");
const product_color_entity_1 = require("../products/product-color.entity");
const product_spec_entity_1 = require("../products/product-spec.entity");
const order_entity_1 = require("../orders/order.entity");
const order_item_entity_1 = require("../orders/order-item.entity");
require("dotenv/config");
exports.ormOpts = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [user_entity_1.User, category_entity_1.Category, product_entity_1.Product, product_image_entity_1.ProductImage, product_color_entity_1.ProductColor, product_spec_entity_1.ProductSpec, order_entity_1.Order, order_item_entity_1.OrderItem],
    synchronize: false,
    logging: false,
    charset: 'utf8mb4',
    timezone: 'Z',
};
const ds = new typeorm_1.DataSource(exports.ormOpts);
console.log('ENV:', process.env.DB_HOST, process.env.DB_USERNAME, process.env.DB_NAME);
exports.default = ds;
//# sourceMappingURL=typeorm.config.js.map