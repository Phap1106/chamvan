"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoUploadOptions = exports.imageUploadOptions = void 0;
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
const crypto_1 = __importDefault(require("crypto"));
const path_1 = __importDefault(require("path"));
const uploads_config_1 = require("../config/uploads.config");
(0, uploads_config_1.ensureUploadsDirs)();
const randomName = (original) => {
    const hash = crypto_1.default.randomBytes(6).toString('hex');
    const ext = path_1.default.extname(original || '').toLowerCase();
    return `${Date.now()}-${hash}${ext}`;
};
const makeFilter = (allowed, label) => (_req, file, cb) => {
    if (!allowed.includes(file.mimetype)) {
        return cb(new common_1.BadRequestException(`File ${label}`), false);
    }
    cb(null, true);
};
exports.imageUploadOptions = {
    storage: (0, multer_1.diskStorage)({
        destination: (_req, _file, cb) => cb(null, uploads_config_1.UPLOADS_IMAGES_DIR),
        filename: (_req, file, cb) => cb(null, randomName(file.originalname)),
    }),
    fileFilter: makeFilter(['image/jpeg', 'image/png', 'image/webp'], 'phải ở định dạng jpeg/png/webp'),
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 10,
    },
};
exports.videoUploadOptions = {
    storage: (0, multer_1.diskStorage)({
        destination: (_req, _file, cb) => cb(null, uploads_config_1.UPLOADS_VIDEOS_DIR),
        filename: (_req, file, cb) => cb(null, randomName(file.originalname)),
    }),
    fileFilter: makeFilter(['video/mp4'], 'video phải ở định dạng mp4'),
    limits: {
        fileSize: 200 * 1024 * 1024,
        files: 1,
    },
};
//# sourceMappingURL=uploads.multer.js.map