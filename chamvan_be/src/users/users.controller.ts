// // src/users/users.controller.ts
// import {
//   BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post,
//   Query, Req, UseGuards,
// } from '@nestjs/common';
// import { UsersService } from './users.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { UpdateRoleDto } from './dto/update-role.dto';
// import { ListUsersQueryDto } from './dto/list-users.dto';
// import { JwtAuthGuard } from '../auth/jwt.guard';
// import { Roles } from '../common/roles.decorator';
// import { RolesGuard } from '../common/roles.guard';
// import { ChangePasswordDto } from './dto/change-password.dto';
// import { UpdateProfileDto } from './dto/update-profile.dto';

// import { Role } from '../common/role.enum';

// @Controller('users')
// export class UsersController {
//   constructor(private readonly users: UsersService) {}

//   @Post('register')
//   register(@Body() dto: CreateUserDto) {
//     return this.users.registerCustomer(dto); // luôn Role.USER
//   }

//   // Admin tạo user với role mong muốn (mặc định SUPPORT_ADMIN)
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(Role.ADMIN)
//   @Post('admin-create')
//   adminCreate(@Body() dto: CreateUserDto & { role?: Role }) {
//     return this.users.adminCreate(dto);
//   }

//   @UseGuards(JwtAuthGuard)
//   @Get('me')
//   me(@Req() req: any) { return req.user; }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(Role.ADMIN, Role.SUPPORT_ADMIN)
//   @Get()
//   list(@Query() q: ListUsersQueryDto) {
//     return this.users.findAll(q);
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(Role.ADMIN, Role.SUPPORT_ADMIN)
//   @Get(':id')
//   getOne(@Param('id') id: string) {
//     return this.users.findPublicById(id);
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(Role.ADMIN, Role.SUPPORT_ADMIN)
//   @Patch(':id')
//   update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
//     return this.users.updateProfile(id, dto);
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(Role.ADMIN)
//   @Patch(':id/role')
//   updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
//     if (!dto.role) throw new BadRequestException('role is required');
//     return this.users.updateRole(id, dto.role);
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(Role.ADMIN)
//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.users.remove(id);
//   }

//   @UseGuards(JwtAuthGuard)
//   @Patch('me/password')
//   changeMyPassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
//     return this.users.changePassword(req.user.id, dto);
//   }



// }
// src/users/users.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ListUsersQueryDto } from './dto/list-users.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Role } from '../common/role.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.users.registerCustomer(dto); // luôn Role.USER
  }

  // Admin tạo user với role mong muốn (mặc định SUPPORT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('admin-create')
  adminCreate(@Body() dto: CreateUserDto & { role?: Role }) {
    return this.users.adminCreate(dto);
  }

  // Lấy thông tin "me" từ DB để đảm bảo có fullName/phone/dob
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    return this.users.findPublicById(req.user.id);
  }

  // Cập nhật hồ sơ cho chính mình: chỉ nhận fullName / phone / dob
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(@Req() req: any, @Body() dto: UpdateProfileDto) {
    // Không đổi service/logic cũ: tái dùng updateProfile
    return this.users.updateProfile(req.user.id, dto as any);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPPORT_ADMIN)
  @Get()
  list(@Query() q: ListUsersQueryDto) {
    return this.users.findAll(q);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPPORT_ADMIN)
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.users.findPublicById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPPORT_ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.users.updateProfile(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id/role')
  updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    if (!dto.role) throw new BadRequestException('role is required');
    return this.users.updateRole(id, dto.role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.users.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/password')
  changeMyPassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    return this.users.changePassword(req.user.id, dto);
  }
}
