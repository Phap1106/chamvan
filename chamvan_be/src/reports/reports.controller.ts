import {
  Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateBugReportDto } from './dto/create-bug-report.dto';
import { ListReportsDto } from './dto/list-reports.dto';
import { UpdateReportStatusDto } from './dto/update-report.dto';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('reports') // -> /api/reports
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  // User gửi báo cáo (không bắt buộc login)
  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateBugReportDto, @Req() req: any) {
    const userIdRaw = req?.user?.id;
    const userId = Number.isInteger(Number(userIdRaw)) ? Number(userIdRaw) : null;
    const userEmail = (req?.user?.email ?? null) as string | null;
    const userAgent = (req?.headers?.['user-agent'] ?? null) as string | null;

    return this.reports.create(dto, { userId, userEmail, userAgent });
  }

  // Admin xem danh sách
  @UseGuards(JwtAuthGuard)
  @Get('admin')
  list(@Query() q: ListReportsDto) {
    return this.reports.list(q);
  }

  // Admin xem chi tiết
  @UseGuards(JwtAuthGuard)
  @Get('admin/:id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.reports.get(id);
  }

  // Admin đổi trạng thái
  @UseGuards(JwtAuthGuard)
  @Patch('admin/:id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateReportStatusDto,
  ) {
    return this.reports.updateStatus(id, body);
  }
}
