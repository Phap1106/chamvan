"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ormOpts = void 0;
const typeorm_1 = require("typeorm");
const return_request_entity_1 = require("../returns/return-request.entity");
const user_entity_1 = require("../users/user.entity");
const category_entity_1 = require("../categories/category.entity");
const product_entity_1 = require("../products/product.entity");
const product_image_entity_1 = require("../products/product-image.entity");
const product_color_entity_1 = require("../products/product-color.entity");
const product_spec_entity_1 = require("../products/product-spec.entity");
const order_entity_1 = require("../orders/order.entity");
const order_item_entity_1 = require("../orders/order-item.entity");
const telegram_config_entity_1 = require("../integrations/telegram/entities/telegram-config.entity");
const telegram_recipient_entity_1 = require("../integrations/telegram/entities/telegram-recipient.entity");
const telegram_template_entity_1 = require("../integrations/telegram/entities/telegram-template.entity");
const bug_report_entity_1 = require("../reports/bug-report.entity");
require("dotenv/config");
exports.ormOpts = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
        user_entity_1.User,
        category_entity_1.Category,
        product_entity_1.Product,
        product_image_entity_1.ProductImage,
        product_color_entity_1.ProductColor,
        product_spec_entity_1.ProductSpec,
        order_entity_1.Order,
        order_item_entity_1.OrderItem,
        telegram_config_entity_1.TelegramConfig,
        telegram_recipient_entity_1.TelegramRecipient,
        telegram_template_entity_1.TelegramTemplate,
        bug_report_entity_1.BugReport,
        return_request_entity_1.ReturnRequest,
    ],
    synchronize: false,
    logging: false,
    charset: 'utf8mb4',
    timezone: 'Z',
};
const ds = new typeorm_1.DataSource(exports.ormOpts);
console.log('ENV:', process.env.DB_HOST, process.env.DB_USERNAME, process.env.DB_NAME);
exports.default = ds;
//# sourceMappingURL=typeorm.config.js.map