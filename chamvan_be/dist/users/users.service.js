"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const user_entity_1 = require("./user.entity");
let UsersService = class UsersService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async assertExists(id) {
        const u = await this.repo.findOne({ where: { id } });
        if (!u)
            throw new common_1.NotFoundException('User not found');
        return u;
    }
    async countAdmins() {
        return this.repo.count({ where: { role: 'admin' } });
    }
    async hashPassword(plain) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(plain, salt);
    }
    async registerCustomer(dto) {
        const user = this.repo.create({ ...dto, role: 'user' });
        if (user.password) {
            user.password = await this.hashPassword(user.password);
        }
        return this.repo.save(user);
    }
    async adminCreate(dto) {
        const role = dto.role ?? 'support_admin';
        const user = this.repo.create({ ...dto, role: role });
        if (user.password) {
            user.password = await this.hashPassword(user.password);
        }
        return this.repo.save(user);
    }
    async findAll(q) {
        const page = Math.max(1, Number(q.page || 1));
        const limit = Math.min(100, Math.max(1, Number(q.limit || 20)));
        const where = [];
        const roleFilter = q.role ? { role: q.role } : {};
        if (q.q) {
            where.push({ ...roleFilter, fullName: (0, typeorm_2.ILike)(`%${q.q}%`) });
            where.push({ ...roleFilter, email: (0, typeorm_2.ILike)(`%${q.q}%`) });
        }
        else {
            where.push({ ...roleFilter });
        }
        const [items, total] = await this.repo.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            take: limit,
            skip: (page - 1) * limit,
            select: ['id', 'fullName', 'email', 'role', 'phone', 'dob', 'createdAt'],
        });
        return { items, total, page, limit };
    }
    async findPublicById(id) {
        const u = await this.repo.findOne({
            where: { id },
            select: ['id', 'fullName', 'email', 'role', 'phone', 'dob', 'createdAt', 'updatedAt'],
        });
        if (!u)
            throw new common_1.NotFoundException('User not found');
        return u;
    }
    async updateProfile(id, dto) {
        const u = await this.assertExists(id);
        if (dto.password) {
            dto.password = await this.hashPassword(dto.password);
        }
        this.repo.merge(u, dto);
        return this.repo.save(u);
    }
    async updateRole(id, role) {
        const u = await this.assertExists(id);
        if (u.role === 'admin' && role !== 'admin') {
            const nAdmins = await this.countAdmins();
            if (nAdmins <= 1) {
                throw new common_1.BadRequestException('Không thể thay đổi vai trò: đây là admin cuối cùng');
            }
        }
        u.role = role;
        return this.repo.save(u);
    }
    async remove(id) {
        const u = await this.assertExists(id);
        if (u.role === 'admin') {
            const nAdmins = await this.countAdmins();
            if (nAdmins <= 1)
                throw new common_1.BadRequestException('Không thể xoá admin cuối cùng');
        }
        await this.repo.remove(u);
        return { success: true };
    }
    findByEmail(email) {
        return this.repo.findOne({ where: { email } });
    }
    async findById(id) {
        return this.assertExists(id);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map