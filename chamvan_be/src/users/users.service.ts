// import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, ILike } from 'typeorm';
// import { User } from './user.entity';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { ListUsersQueryDto } from './dto/list-users.dto';

// @Injectable()
// export class UsersService {
//   constructor(@InjectRepository(User) private repo: Repository<User>) {}

//   /* ---------- Helpers ---------- */
//   async assertExists(id: string) {
//     const u = await this.repo.findOne({ where: { id } });
//     if (!u) throw new NotFoundException('User not found');
//     return u;
//   }

//   async countAdmins() {
//     return this.repo.count({ where: { role: 'admin' as any } });
//   }

//   /* ---------- Public register ---------- */
//   async registerCustomer(dto: CreateUserDto) {
//     // Role luôn là user (bỏ qua mọi giá trị role nếu có)
//     const user = this.repo.create({ ...dto, role: 'user' as any });
//     return this.repo.save(user);
//   }

//   /* ---------- Admin create ---------- */
//   async adminCreate(dto: CreateUserDto & { role?: 'support_admin' | 'admin' | 'user' }) {
//     const role = dto.role ?? 'support_admin';
//     const user = this.repo.create({ ...dto, role: role as any });
//     return this.repo.save(user);
//   }

//   /* ---------- Queries ---------- */
//   async findAll(q: ListUsersQueryDto) {
//     const page = Math.max(1, Number(q.page || 1));
//     const limit = Math.min(100, Math.max(1, Number(q.limit || 20)));
//     const where: any[] = [];
//     const roleFilter = q.role ? { role: q.role } : {};

//     if (q.q) {
//       where.push({ ...roleFilter, fullName: ILike(`%${q.q}%`) });
//       where.push({ ...roleFilter, email: ILike(`%${q.q}%`) });
//     } else {
//       where.push({ ...roleFilter });
//     }

//     const [items, total] = await this.repo.findAndCount({
//       where,
//       order: { createdAt: 'DESC' },
//       take: limit,
//       skip: (page - 1) * limit,
//       select: ['id', 'fullName', 'email', 'role', 'phone', 'dob', 'createdAt'],
//     });

//     return { items, total, page, limit };
//   }

//   async findPublicById(id: string) {
//     const u = await this.repo.findOne({
//       where: { id },
//       select: ['id', 'fullName', 'email', 'role', 'phone', 'dob', 'createdAt', 'updatedAt'],
//     });
//     if (!u) throw new NotFoundException('User not found');
//     return u;
//   }

//   /* ---------- Mutations ---------- */
//   async updateProfile(id: string, dto: UpdateUserDto) {
//     const u = await this.assertExists(id);
//     this.repo.merge(u, dto);
//     return this.repo.save(u);
//   }

//   async updateRole(id: string, role: 'user' | 'support_admin' | 'admin') {
//     const u = await this.assertExists(id);
//     // Nếu hạ cấp admin cuối cùng -> chặn
//     if (u.role === 'admin' && role !== 'admin') {
//       const nAdmins = await this.countAdmins();
//       if (nAdmins <= 1) {
//         throw new BadRequestException('Không thể thay đổi vai trò: đây là admin cuối cùng');
//       }
//     }
//     u.role = role as any;
//     return this.repo.save(u);
//   }

//   async remove(id: string) {
//     const u = await this.assertExists(id);
//     // Chặn xoá admin cuối cùng
//     if (u.role === 'admin') {
//       const nAdmins = await this.countAdmins();
//       if (nAdmins <= 1) throw new BadRequestException('Không thể xoá admin cuối cùng');
//     }
//     await this.repo.remove(u);
//     return { success: true };
//   }

//   /* ---------- Existing helpers ---------- */
//   findByEmail(email: string) {
//     return this.repo.findOne({ where: { email } });
//   }

//   async findById(id: string) {
//     return this.assertExists(id);
//   }
// }









import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ListUsersQueryDto } from './dto/list-users.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  /* ---------- Helpers ---------- */
  async assertExists(id: string) {
    const u = await this.repo.findOne({ where: { id } });
    if (!u) throw new NotFoundException('User not found');
    return u;
  }

  async countAdmins() {
    return this.repo.count({ where: { role: 'admin' as any } });
  }

  private async hashPassword(plain: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plain, salt);
  }

  /* ---------- Public register ---------- */
  async registerCustomer(dto: CreateUserDto) {
    // Role luôn là user (bỏ qua mọi giá trị role nếu có)
    const user = this.repo.create({ ...dto, role: 'user' as any });
    if (user.password) {
      user.password = await this.hashPassword(user.password);
    }
    return this.repo.save(user);
  }

  /* ---------- Admin create ---------- */
  async adminCreate(dto: CreateUserDto & { role?: 'support_admin' | 'admin' | 'user' }) {
    const role = dto.role ?? 'support_admin';
    const user = this.repo.create({ ...dto, role: role as any });
    if (user.password) {
      user.password = await this.hashPassword(user.password);
    }
    return this.repo.save(user);
  }

  /* ---------- Queries ---------- */
  async findAll(q: ListUsersQueryDto) {
    const page = Math.max(1, Number(q.page || 1));
    const limit = Math.min(100, Math.max(1, Number(q.limit || 20)));
    const where: any[] = [];
    const roleFilter = q.role ? { role: q.role } : {};

    if (q.q) {
      where.push({ ...roleFilter, fullName: ILike(`%${q.q}%`) });
      where.push({ ...roleFilter, email: ILike(`%${q.q}%`) });
    } else {
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

  async findPublicById(id: string) {
    const u = await this.repo.findOne({
      where: { id },
      select: ['id', 'fullName', 'email', 'role', 'phone', 'dob', 'createdAt', 'updatedAt'],
    });
    if (!u) throw new NotFoundException('User not found');
    return u;
  }

  /* ---------- Mutations ---------- */
  async updateProfile(id: string, dto: UpdateUserDto) {
    const u = await this.assertExists(id);
    if (dto.password) {
      dto.password = await this.hashPassword(dto.password);
    }
    this.repo.merge(u, dto);
    return this.repo.save(u);
  }

  async updateRole(id: string, role: 'user' | 'support_admin' | 'admin') {
    const u = await this.assertExists(id);
    // Nếu hạ cấp admin cuối cùng -> chặn
    if (u.role === 'admin' && role !== 'admin') {
      const nAdmins = await this.countAdmins();
      if (nAdmins <= 1) {
        throw new BadRequestException('Không thể thay đổi vai trò: đây là admin cuối cùng');
      }
    }
    u.role = role as any;
    return this.repo.save(u);
  }

  async remove(id: string) {
    const u = await this.assertExists(id);
    // Chặn xoá admin cuối cùng
    if (u.role === 'admin') {
      const nAdmins = await this.countAdmins();
      if (nAdmins <= 1) throw new BadRequestException('Không thể xoá admin cuối cùng');
    }
    await this.repo.remove(u);
    return { success: true };
  }

  /* ---------- Existing helpers ---------- */
  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async findById(id: string) {
    return this.assertExists(id);
  }
}








