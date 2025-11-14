// ✅ returns.controller.ts
import {
  Body, Controller, Get, Param, Patch, Post, Req, UseGuards, ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';   // <-- đúng import, nhưng PHẢI gọi 'jwt'
import { ReturnsService } from './returns.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';

@Controller('return-requests')
@UseGuards(AuthGuard('jwt'))   // <-- GỌI MIXIN: 'jwt'
export class ReturnsController {
  constructor(private readonly service: ReturnsService) {}

  @Post()
  async create(@Req() req: any, @Body() dto: CreateReturnDto) {
    const userId = Number(req.user?.id);
    if (!userId) throw new ForbiddenException('Unauthorized');
    const data = await this.service.create(userId, dto);
    return { statusCode: 200, message: 'OK', data };
  }

  @Get('me')
  async mine(@Req() req: any) {
    const userId = Number(req.user?.id);
    if (!userId) throw new ForbiddenException('Unauthorized');
    const data = await this.service.findMine(userId);
    return { statusCode: 200, data };
  }

  @Get()
  async all(@Req() req: any) {
    const role = req.user?.role;
    if (role !== 'admin') throw new ForbiddenException('Forbidden');
    const data = await this.service.findAllWithUser();
    return { statusCode: 200, data };
  }

  @Patch(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateReturnDto) {
    const role = req.user?.role;
    if (role !== 'admin') throw new ForbiddenException('Forbidden');
    const data = await this.service.updateStatus(Number(id), dto);
    return { statusCode: 200, message: 'Updated', data };
  }
}
